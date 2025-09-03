// src/app/api/test-carousel/route.ts
import { NextResponse } from 'next/server';
import { wixDataService } from '@/services/wix-data.service';

export async function GET() {
  try {
    console.log('🔍 Test Carousel: Starting test...');

    // Check environment variables
    const hasToken = !!process.env.WIX_API_TOKEN;
    const hasSiteId = !!process.env.WIX_SITE_ID;

    console.log(
      '🔍 Test Carousel: Environment check - Token:',
      hasToken,
      'Site ID:',
      hasSiteId
    );

    if (!hasToken || !hasSiteId) {
      return NextResponse.json({
        success: false,
        error: 'Missing Wix configuration',
        details: {
          hasToken,
          hasSiteId,
          message: 'WIX_API_TOKEN and WIX_SITE_ID must be set in .env.local',
        },
      });
    }

    // Test fetching CarouselImageDisplay collection
    console.log(
      '🚀 Test Carousel: Fetching CarouselImageDisplay collection...'
    );
    const carouselData = await wixDataService.fetchCarouselImageDisplay();

    console.log(
      '📊 Test Carousel: Received data',
      JSON.stringify(carouselData, null, 2)
    );

    return NextResponse.json({
      success: true,
      data: carouselData,
      summary: {
        itemCount: carouselData.items.length,
        hasData: carouselData.items.length > 0,
        fields:
          carouselData.items.length > 0
            ? Object.keys(carouselData.items[0].data)
            : [],
      },
      environment: {
        hasToken,
        hasSiteId,
      },
      message: `Successfully fetched ${carouselData.items.length} carousel items`,
    });
  } catch (error) {
    console.error('❌ Test Carousel: Error testing carousel data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
