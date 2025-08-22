import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function GET() {
  try {
    const models = zaiApiService.getAvailableModels();
    const testResults = [];

    for (const model of models) {
      try {
        const isConnected = await zaiApiService.testModelConnection(model.id);
        testResults.push({
          modelId: model.id,
          modelName: model.name,
          isConnected,
          capabilities: model.capabilities
        });
      } catch (error) {
        testResults.push({
          modelId: model.id,
          modelName: model.name,
          isConnected: false,
          error: error.message,
          capabilities: model.capabilities
        });
      }
    }

    return NextResponse.json({ testResults });
  } catch (error) {
    console.error('Model testing failed:', error);
    return NextResponse.json(
      { error: 'Model testing failed' },
      { status: 500 }
    );
  }
}