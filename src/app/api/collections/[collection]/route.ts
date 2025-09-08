// app/api/collections/[collection]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { wixDataService } from '@/services/wix-data.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    // Check if Wix configuration is available
    if (!process.env.WIX_API_TOKEN || !process.env.WIX_SITE_ID) {
      return NextResponse.json(
        {
          error: 'Wix configuration missing. Check your environment variables.',
          items: [],
          totalCount: 0,
          count: 0,
          hasNext: false,
        },
        { status: 500 }
      );
    }

    // Await the params promise as required by Next.js
    const { collection } = await params;

    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = (page - 1) * limit;

    // Simple mapping without enum to avoid type issues
    let data;

    switch (collection) {
      case 'HeroContent':
        data = await wixDataService.fetchHeroContent();
        break;
      case 'AboutContent':
        data = await wixDataService.fetchAboutContent();
        break;
      case 'ServicesContent':
      case 'ServiceSection': // Added alias for ServiceSection
        data = await wixDataService.fetchServicesContent();
        break;
      case 'ProductsContent':
        data = await wixDataService.fetchProductsContent();
        break;
      case 'Import1':
        data = await wixDataService.fetchProductCategories();
        break;
      case 'Import2':
        // For Import2 (products), we can implement pagination
        data = await wixDataService.fetchProductsFromImport2();
        // Apply pagination on the server side
        if (data.items) {
          const paginatedItems = data.items.slice(offset, offset + limit);
          data.items = paginatedItems;
          data.hasNext = offset + limit < data.totalCount;
        }
        break;
      case 'ContactContent':
        data = await wixDataService.fetchContactContent();
        break;
      case 'CarouselImageDisplay':
        data = await wixDataService.fetchCarouselImageDisplay();
        break;
      default:
        return NextResponse.json(
          { error: `Unknown collection: ${collection}` },
          { status: 404 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in collections API:`, error);
    return NextResponse.json(
      {
        error: 'Failed to fetch collection data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
