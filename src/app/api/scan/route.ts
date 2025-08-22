import { NextRequest, NextResponse } from 'next/server';
// Note: ZAI SDK integration - temporarily disabled for development
// import ZAI from 'z-ai-web-dev-sdk';

interface ScanRequest {
  photoId: string;
  imageData: string; // base64 encoded image
}

interface ScanResult {
  photoId: string;
  isNsfw: boolean;
  confidence: number;
  categories?: string[];
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const { photoId, imageData } = body;

    if (!photoId || !imageData) {
      return NextResponse.json(
        { error: 'Missing required fields: photoId and imageData' },
        { status: 400 }
      );
    }

    // Temporarily returning mock data for development
    console.log('Scanning image in mock mode');

    const scanResult: ScanResult = {
      photoId,
      isNsfw: false,
      confidence: 0.95,
      categories: ['safe', 'nature', 'landscape']
    };

    return NextResponse.json(scanResult);

  } catch (error) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to convert file to base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get pure base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}