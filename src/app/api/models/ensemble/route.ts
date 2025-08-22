import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, analysisType, modelIds, customPrompt } = body;

    if (!imageBase64 || !analysisType) {
      return NextResponse.json(
        { error: 'Missing required fields: imageBase64, analysisType' },
        { status: 400 }
      );
    }

    const analysisRequest = {
      imageBase64,
      analysisType,
      modelId: 'ensemble', // Default model ID for ensemble
      customPrompt
    };

    const result = await zaiApiService.performEnsembleAnalysis(analysisRequest, modelIds);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Ensemble analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Ensemble analysis failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allModels = zaiApiService.getAvailableModels();
    const modelStatuses = await Promise.all(
      allModels.map(async (model) => ({
        id: model.id,
        name: model.name,
        isOnline: await zaiApiService.testModelConnection(model.id),
        capabilities: model.capabilities
      }))
    );

    const onlineModels = modelStatuses.filter(m => m.isOnline);
    const offlineModels = modelStatuses.filter(m => !m.isOnline);

    return NextResponse.json({
      success: true,
      models: allModels,
      statuses: modelStatuses,
      summary: {
        total: allModels.length,
        online: onlineModels.length,
        offline: offlineModels.length,
        canPerformEnsemble: onlineModels.length >= 2
      },
      recommendations: {
        minimumModelsForEnsemble: 2,
        optimalModelsForEnsemble: Math.min(5, onlineModels.length),
        bestPerformingModel: onlineModels.length > 0 ? onlineModels[0].id : null
      }
    });

  } catch (error) {
    console.error('Ensemble status check error:', error);
    return NextResponse.json(
      { 
        error: 'Status check failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}