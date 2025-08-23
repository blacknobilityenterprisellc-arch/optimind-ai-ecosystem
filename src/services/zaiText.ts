// src/services/zaiText.ts
/**
 * zaiText.ts
 * Enhanced GLM-4.5 wrapper with canonical moderation schema, edge-case handling, and deterministic prompts
 */

import { ZaiClient } from './zaiClient';
import { ModelResult, ModelLabel } from '../types/index';
import { 
  assertValidModeration, 
  safeValidateModeration, 
  extractJsonFromResponse, 
  requiresHumanReview,
  ModerationResult 
} from './validators';

export interface TextOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  allowLenientParse?: boolean;
  reasoningMode?: 'contextual' | 'consensus' | 'escalation';
  visionResults?: any;
  metadata?: Record<string, any>;
}

/**
 * Build system prompt for text reasoning
 */
function buildTextSystemPrompt(opts: TextOptions): string {
  const baseSystem = `SYSTEM: You are PolicyReasoner (GLM-4.5). OUTPUT JSON ONLY. Schema: { "labels": [{"label":string,"score":0.0-1.0,"region":{x,y,width,height}|null}], "reasons":[strings], "saliency_base64":nullable, "provenance":{ "model": "...", "version": "..." } }. Use provided visual descriptors/metadata to produce labels and short reasons. Include provenance.model/version. No chain-of-thought.`;

  // Add reasoning mode specific instructions
  if (opts.reasoningMode === 'contextual') {
    return `${baseSystem} Focus on contextual analysis and nuance detection. Consider metadata and environmental factors.`;
  } else if (opts.reasoningMode === 'consensus') {
    return `${baseSystem} Focus on consensus building across multiple model outputs. Resolve conflicts and provide unified assessment.`;
  } else if (opts.reasoningMode === 'escalation') {
    return `${baseSystem} Focus on escalation criteria and high-sensitivity detection. Prioritize safety and compliance.`;
  }

  return baseSystem;
}

/**
 * Build user prompt with enhanced context
 */
function buildTextUserPrompt(
  contextDescription: string, 
  opts: TextOptions
): string {
  let userPrompt = `USER: Context: ${contextDescription}`;

  // Add vision results if available
  if (opts.visionResults) {
    userPrompt += `\nVision Analysis: ${JSON.stringify(opts.visionResults)}`;
  }

  // Add metadata if available
  if (opts.metadata) {
    // Sanitize PII from metadata
    const safeMetadata = sanitizeMetadata(opts.metadata);
    userPrompt += `\nMetadata: ${JSON.stringify(safeMetadata)}`;
  }

  userPrompt += `\nProduce JSON with labels, reasons, and provenance. Use canonical labels: sexual_nudity, partial_nudity, suggestive, breastfeeding_ok, child_detected, child_exposed, deepfake_suspected, violence, hate_symbols, non_sexual_adult_context, religious_dress, sports_context, body_art_tattoo, insufficient_quality.`;

  return userPrompt;
}

/**
 * Sanitize metadata to remove PII
 */
function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  const piiFields = ['email', 'phone', 'address', 'name', 'userId', 'ip'];
  
  for (const [key, value] of Object.entries(metadata)) {
    if (piiFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Enhanced text reasoning with canonical validation and contextual analysis
 */
export async function zaiTextReasoning(
  client: ZaiClient, 
  contextDescription: string, 
  opts?: TextOptions
): Promise<ModelResult> {
  const options: TextOptions = {
    model: process.env.ZAI_TEXT_MODEL || 'GLM-4.5',
    temperature: 0.0, // Always deterministic for moderation
    max_tokens: 800,
    allowLenientParse: false,
    reasoningMode: 'contextual',
    ...opts,
  };

  // Build prompts
  const systemPrompt = buildTextSystemPrompt(options);
  const userPrompt = buildTextUserPrompt(contextDescription, options);

  const payload = {
    model: options.model,
    inputs: [
      {
        modality: 'text',
        content: `${systemPrompt}\n\n${userPrompt}`,
      },
    ],
    parameters: {
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      output_format: 'json',
    },
  };

  // Call ZAI
  const resp = await client.callZai(payload, { retries: 2 });

  // Extract response text
  const rawText =
    resp?.outputs?.[0]?.content ??
    resp?.result ??
    resp?.choices?.[0]?.message?.content ??
    JSON.stringify(resp);

  let parsed: any;
  let validationSuccess = false;

  // Parsing & fallback procedure
  try {
    // Step 1: Attempt direct parse with JSON extraction
    parsed = extractJsonFromResponse(rawText);
    
    // Step 2: Validate with AJV
    assertValidModeration(parsed);
    validationSuccess = true;
    
  } catch (error) {
    console.warn('[zaiTextReasoning] Validation failed:', error.message);
    
    // Step 3: Fallback handling
    if (options.allowLenientParse) {
      try {
        parsed = safeValidateModeration(parsed, true);
        validationSuccess = true;
      } catch (fallbackError) {
        // Ultimate fallback
        parsed = {
          labels: [],
          reasons: ['model_parse_error'],
          provenance: { model: options.model! }
        };
      }
    } else {
      // Fail fast - log full raw output for audit
      console.error('[zaiTextReasoning] Raw model output for audit:', rawText);
      throw new Error(`[zaiTextReasoning] Schema validation failed: ${error.message}`);
    }
  }

  // Convert ModerationResult to ModelResult
  const moderationResult = parsed as ModerationResult;
  const labels: ModelLabel[] = moderationResult.labels.map((l: any) => ({ 
    label: String(l.label), 
    score: Number(l.score) 
  }));

  const modelResult: ModelResult = {
    modelName: options.model!,
    modelVersion: moderationResult.provenance.version || undefined,
    labels,
    rawOutput: {
      ...moderationResult,
      _validationSuccess: validationSuccess,
      _reasoningMode: options.reasoningMode,
      _requiresHumanReview: requiresHumanReview(moderationResult),
      _contextProvided: !!contextDescription
    },
    latencyMs: typeof resp?.latencyMs === 'number' ? resp.latencyMs : undefined,
  };

  return modelResult;
}

/**
 * Specialized reasoning functions for different contexts
 */
export const TextReasoning = {
  /**
   * Contextual analysis for nuanced content understanding
   */
  contextual: (
    client: ZaiClient, 
    contextDescription: string, 
    visionResults?: any,
    metadata?: Record<string, any>
  ) => zaiTextReasoning(client, contextDescription, {
    reasoningMode: 'contextual',
    visionResults,
    metadata,
    max_tokens: 1000
  }),

  /**
   * Consensus building across multiple model outputs
   */
  consensus: (
    client: ZaiClient, 
    modelOutputs: any[], 
    contextDescription?: string
  ) => {
    const consensusContext = `Model outputs: ${JSON.stringify(modelOutputs)}${contextDescription ? `\nAdditional context: ${contextDescription}` : ''}`;
    return zaiTextReasoning(client, consensusContext, {
      reasoningMode: 'consensus',
      max_tokens: 1200
    });
  },

  /**
   * Escalation analysis for high-sensitivity content
   */
  escalation: (
    client: ZaiClient, 
    contextDescription: string, 
    sensitivityFlags: string[] = []
  ) => {
    const enhancedContext = `High-sensitivity analysis. Flags: ${sensitivityFlags.join(', ')}. Context: ${contextDescription}`;
    return zaiTextReasoning(client, enhancedContext, {
      reasoningMode: 'escalation',
      max_tokens: 800
    });
  },

  /**
   * Metadata analysis for content provenance and context
   */
  metadata: (
    client: ZaiClient, 
    metadata: Record<string, any>,
    contextDescription?: string
  ) => {
    const safeMetadata = sanitizeMetadata(metadata);
    const metadataContext = `Metadata analysis: ${JSON.stringify(safeMetadata)}${contextDescription ? `\nContext: ${contextDescription}` : ''}`;
    return zaiTextReasoning(client, metadataContext, {
      reasoningMode: 'contextual',
      max_tokens: 600
    });
  }
};