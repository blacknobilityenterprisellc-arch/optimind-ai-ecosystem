// src/services/zaiVision.ts
/**
 * zaiVision.ts
 * Enhanced GLM-4.5V wrapper with canonical moderation schema, edge-case handling, and deterministic prompts
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

// Canonical label set for standardization
export const CANONICAL_LABELS = [
  'sexual_nudity',
  'partial_nudity', 
  'suggestive',
  'breastfeeding_ok',
  'child_detected',
  'child_exposed',
  'deepfake_suspected',
  'violence',
  'hate_symbols',
  'non_sexual_adult_context',
  'religious_dress',
  'sports_context',
  'body_art_tattoo',
  'insufficient_quality'
];

export interface VisionOptions {
  model?: string; // default GLM-4.5V
  temperature?: number;
  max_tokens?: number;
  includeSaliencyBase64?: boolean;
  allowLenientParse?: boolean;
  edgeCase?: EdgeCaseType;
  context?: string;
}

export type EdgeCaseType = 
  | 'breastfeeding'
  | 'religious_dress'
  | 'sports'
  | 'tattoos'
  | 'partial_nudity'
  | 'child_safety'
  | 'deepfake'
  | 'low_quality';

interface EdgeCaseConfig {
  systemSuffix: string;
  maxTokens: number;
  requiredLabels: string[];
}

const EDGE_CASE_CONFIGS: Record<EdgeCaseType, EdgeCaseConfig> = {
  breastfeeding: {
    systemSuffix: `Labels: include "breastfeeding_ok","sexual_nudity","partial_nudity". Consider presence of infant, latch, feeding posture, and caretaking context when deciding breastfeeding_ok.`,
    maxTokens: 600,
    requiredLabels: ['breastfeeding_ok', 'sexual_nudity', 'partial_nudity']
  },
  religious_dress: {
    systemSuffix: `Include "religious_dress" and "exposed_skin_nonsexual". Do not flag for sexual content if sacred/ceremonial context is detected.`,
    maxTokens: 500,
    requiredLabels: ['religious_dress']
  },
  sports: {
    systemSuffix: `Include "sports_context" and prefer non-sexual interpretations if jerseys/equipment are present.`,
    maxTokens: 500,
    requiredLabels: ['sports_context']
  },
  tattoos: {
    systemSuffix: `Include "body_art_tattoo" and "optical_illusion_nudity"; detect likely painted/tattooed anatomy and explain via reasons.`,
    maxTokens: 450,
    requiredLabels: ['body_art_tattoo']
  },
  partial_nudity: {
    systemSuffix: `Include "partial_nudity","underwear_visible","suggestive". Provide region boxes for visible areas.`,
    maxTokens: 450,
    requiredLabels: ['partial_nudity', 'suggestive']
  },
  child_safety: {
    systemSuffix: `Include "child_detected","child_exposed". If child_detected + any sexual label => mark priority in reasons and do NOT auto-delete.`,
    maxTokens: 800,
    requiredLabels: ['child_detected', 'child_exposed']
  },
  deepfake: {
    systemSuffix: `Include "deepfake_suspected","artifacts","mismatched_lighting". Provide reasons for suspicion.`,
    maxTokens: 700,
    requiredLabels: ['deepfake_suspected']
  },
  low_quality: {
    systemSuffix: `If image quality prevents confident determination, return labels:[] and reasons: ["insufficient_quality"].`,
    maxTokens: 200,
    requiredLabels: ['insufficient_quality']
  }
};

/**
 * Build system prompt with optional edge-case handling
 */
function buildVisionSystemPrompt(opts: VisionOptions): string {
  const baseSystem = `SYSTEM: You are VisionAgent (GLM-4.5V). OUTPUT JSON ONLY. Follow this schema exactly: { "labels": [{"label":string,"score":0.0-1.0,"region":{x,y,width,height}|null}], "reasons":[strings], "saliency_base64":nullable, "provenance":{ "model": "...", "version": "..." } }. Regions normalized 0..1. Labels must include applicable categories from: ${CANONICAL_LABELS.join(', ')}. Do NOT include explanations or chain-of-thought.`;

  if (opts.edgeCase && EDGE_CASE_CONFIGS[opts.edgeCase]) {
    return `${baseSystem}\n${EDGE_CASE_CONFIGS[opts.edgeCase].systemSuffix}`;
  }

  return baseSystem;
}

/**
 * Build user prompt with context
 */
function buildVisionUserPrompt(opts: VisionOptions): string {
  const baseUser = 'USER: Analyze the attached image (base64).';
  
  if (opts.context) {
    return `${baseUser} Context: ${opts.context}. Return JSON only, labels sorted by descending score.`;
  }
  
  return `${baseUser} Return JSON only, labels sorted by descending score.`;
}

/**
 * Enhanced vision analysis with edge-case handling and canonical validation
 */
export async function zaiVisionAnalyze(
  client: ZaiClient,
  imageBuffer: Buffer,
  opts?: VisionOptions
): Promise<ModelResult> {
  const options: VisionOptions = {
    model: process.env.ZAI_VISION_MODEL || 'GLM-4.5V',
    temperature: 0.0, // Always deterministic for moderation
    max_tokens: 1200,
    includeSaliencyBase64: false,
    allowLenientParse: false,
    ...opts,
  };

  // Adjust max tokens for edge cases
  if (options.edgeCase && EDGE_CASE_CONFIGS[options.edgeCase]) {
    options.max_tokens = EDGE_CASE_CONFIGS[options.edgeCase].maxTokens;
  }

  // Encode image as base64
  const imageB64 = imageBuffer.toString('base64');
  
  // Build prompts
  const systemPrompt = buildVisionSystemPrompt(options);
  const userPrompt = buildVisionUserPrompt(options);

  const payload = {
    model: options.model,
    inputs: [
      {
        modality: 'image',
        content_base64: imageB64,
      },
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

  // Call ZAI with enhanced retry logic
  const resp = await client.callZai(payload, { retries: 3 });

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
    console.warn('[zaiVisionAnalyze] Validation failed:', error.message);
    
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
      console.error('[zaiVisionAnalyze] Raw model output for audit:', rawText);
      throw new Error(`[zaiVisionAnalyze] Schema validation failed: ${error.message}`);
    }
  }

  // Convert ModerationResult to ModelResult
  const moderationResult = parsed as ModerationResult;
  const labels: ModelLabel[] = moderationResult.labels.map((l: any) => ({
    label: String(l.label),
    score: Number(l.score),
    region: l.region ? { 
      x: Number(l.region.x), 
      y: Number(l.region.y), 
      width: Number(l.region.width), 
      height: Number(l.region.height) 
    } : undefined,
  }));

  const modelResult: ModelResult = {
    modelName: options.model!,
    modelVersion: moderationResult.provenance.version || undefined,
    labels,
    rawOutput: {
      ...moderationResult,
      _validationSuccess: validationSuccess,
      _edgeCase: options.edgeCase,
      _requiresHumanReview: requiresHumanReview(moderationResult)
    },
    latencyMs: typeof resp?.latencyMs === 'number' ? resp.latencyMs : undefined,
  };

  // Handle saliency map if requested
  if (moderationResult.saliency_base64) {
    modelResult.rawOutput._saliency_b64 = moderationResult.saliency_base64;
  }

  return modelResult;
}

/**
 * Convenience functions for common edge cases
 */
export const VisionEdgeCases = {
  breastfeeding: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'breastfeeding', context }),
    
  religious: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'religious_dress', context }),
    
  sports: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'sports', context }),
    
  tattoos: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'tattoos', context }),
    
  partialNudity: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'partial_nudity', context }),
    
  childSafety: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'child_safety', context }),
    
  deepfake: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'deepfake', context }),
    
  lowQuality: (client: ZaiClient, imageBuffer: Buffer, context?: string) =>
    zaiVisionAnalyze(client, imageBuffer, { edgeCase: 'low_quality', context }),
};