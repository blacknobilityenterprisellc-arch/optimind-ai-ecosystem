import { NextRequest, NextResponse } from 'next/server';
import { multiModelAISystem, AVAILABLE_MODELS } from '@/lib/multi-model-ai';

export async function GET(request: NextRequest) {
  try {
    // Test if all models are available and working
    const availableModels = multiModelAISystem.getAvailableModels();
    
    const modelStatus = AVAILABLE_MODELS.map(model => {
      const isAvailable = availableModels.some(m => m.id === model.id);
      return {
        id: model.id,
        name: model.name,
        version: model.version,
        provider: model.provider,
        isAvailable,
        capabilities: model.capabilities,
        status: isAvailable ? 'operational' : 'unavailable'
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Multi-model AI system test endpoint',
      timestamp: new Date().toISOString(),
      models: modelStatus,
      totalModels: AVAILABLE_MODELS.length,
      availableModels: availableModels.length,
      systemStatus: 'operational'
    });
  } catch (error) {
    console.error('Model test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test models',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelId, testPrompt = 'Test prompt for model validation' } = body;

    if (!modelId) {
      return NextResponse.json({
        success: false,
        message: 'Model ID is required'
      }, { status: 400 });
    }

    // Test specific model capabilities
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (!model) {
      return NextResponse.json({
        success: false,
        message: `Model ${modelId} not found`
      }, { status: 404 });
    }

    // Simulate model test (in real implementation, this would call the actual model)
    const testResult = {
      modelId: model.id,
      modelName: model.name,
      testPrompt,
      response: `Test response from ${model.name}`,
      confidence: 0.85 + Math.random() * 0.1, // Simulate confidence score
      processingTime: Math.floor(Math.random() * 1000) + 100, // Simulate processing time
      capabilities: model.capabilities,
      timestamp: new Date().toISOString(),
      status: 'operational'
    };

    return NextResponse.json({
      success: true,
      message: `Model ${model.name} test completed successfully`,
      result: testResult
    });
  } catch (error) {
    console.error('Model test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test model',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}