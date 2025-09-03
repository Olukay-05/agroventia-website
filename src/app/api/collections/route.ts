// src/app/api/collections/route.ts
import { NextResponse } from 'next/server';
import { wixDataService } from '@/services/wix-data.service';

export async function GET() {
  try {
    // Fetch all collections data including the new CarouselImageDisplay collection
    const allData = await wixDataService.fetchAllCollections();

    return NextResponse.json({
      ...allData,
      _metadata: {
        fetchedAt: new Date().toISOString(),
        totalCollections: Object.keys(allData).length,
      },
    });
  } catch (error) {
    console.error('Error fetching all collections:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch collections',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
