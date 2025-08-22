import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function GET() {
  try {
    const allModels = zaiApiService.getAvailableModels();
    
    // Get status for all models
    const modelStatuses = await Promise.all(
      allModels.map(async (model) => ({
        ...model,
        isOnline: await zaiApiService.testModelConnection(model.id),
        lastChecked: new Date().toISOString()
      }))
    );

    const onlineModels = modelStatuses.filter(m => m.isOnline);
    const offlineModels = modelStatuses.filter(m => !m.isOnline);

    return NextResponse.json({
      success: true,
      models: modelStatuses,
      summary: {
        total: allModels.length,
        online: onlineModels.length,
        offline: offlineModels.length,
        onlinePercentage: Math.round((onlineModels.length / allModels.length) * 100)
      },
      flagshipModel: modelStatuses.find(m => m.id === 'glm-45-flagship'),
      recommendations: {
        bestForAccuracy: 'glm-45-flagship',
        bestForSpeed: 'glm-45v',
        bestForReasoning: 'glm-45-auto-think',
        bestForLogic: 'air',
        bestForComprehensive: 'glm-45-full-stack'
      }
    });

  } catch (error) {
    console.error('Models status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get models status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, modelId, imageBase64, analysisType, customPrompt } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'analyze':
        if (!modelId || !imageBase64 || !analysisType) {
          return NextResponse.json(
            { error: 'Missing required fields for analysis: modelId, imageBase64, analysisType' },
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
          action: 'analyze',
          data: result
        });

      case 'status':
        if (!modelId) {
          return NextResponse.json(
            { error: 'Missing required field: modelId' },
            { status: 400 }
          );
        }

        const modelInfo = await zaiApiService.getModelInfo(modelId);
        const isOnline = await zaiApiService.testModelConnection(modelId);

        return NextResponse.json({
          success: true,
          action: 'status',
          data: {
            model: modelInfo,
            isOnline,
            timestamp: new Date().toISOString()
          }
        });

      case 'ensemble':
        if (!imageBase64 || !analysisType) {
          return NextResponse.json(
            { error: 'Missing required fields for ensemble: imageBase64, analysisType' },
            { status: 400 }
          );
        }

        const ensembleRequest = {
          imageBase64,
          analysisType,
          modelId: 'ensemble',
          customPrompt
        };

        const ensembleResult = await zaiApiService.performEnsembleAnalysis(ensembleRequest, body.modelIds);
        return NextResponse.json({
          success: true,
          action: 'ensemble',
          data: ensembleResult
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { 
        error: 'Request failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}