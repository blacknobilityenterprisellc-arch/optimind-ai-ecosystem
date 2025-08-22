import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, analysisType, modelId, customPrompt } = body;

    if (!imageBase64 || !analysisType || !modelId) {
      return NextResponse.json(
        { error: 'Missing required fields: imageBase64, analysisType, modelId' },
        { status: 400 }
      );
    }

    const analysisRequest = {
      imageBase64,
      analysisType,
      modelId,
      customPrompt
    };

    const result = await zaiApiService.analyzeWithModel(analysisRequest);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('GLM-4.5 Flagship analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const modelInfo = await zaiApiService.getModelInfo('glm-45-flagship');
    const isOnline = await zaiApiService.testModelConnection('glm-45-flagship');

    return NextResponse.json({
      success: true,
      model: modelInfo,
      isOnline,
      status: isOnline ? 'available' : 'offline',
      capabilities: [
        'quantum-reasoning',
        'hyper-dimensional-analysis',
        'universal-comprehension',
        'predictive-modeling',
        'creative-synthesis',
        'quantum-safety-assessment',
        'multiversal-context-understanding',
        'infinite-pattern-recognition',
        'ultimate-accuracy',
        'superintelligence'
      ]
    });

  } catch (error) {
    console.error('GLM-4.5 Flagship status check error:', error);
    return NextResponse.json(
      { 
        error: 'Status check failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}