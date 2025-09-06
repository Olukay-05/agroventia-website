// src/app/api/wix-collections/route.ts
import { NextResponse } from 'next/server';
import { wixDataService } from '@/services/wix-data.service';

export async function GET() {
  try {
    console.log('Attempting to fetch collection IDs from Wix...');

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID || !process.env.WIX_API_TOKEN) {
      throw new Error('Wix credentials not configured');
    }

    // Return predefined collection names since listing collections may not be available
    const collections = [
      {
        _id: process.env.WIX_HERO_COLLECTION_NAME || 'HeroContent',
        id: process.env.WIX_HERO_COLLECTION_NAME || 'HeroContent',
        displayName: 'Hero Content',
        type: 'cms',
      },
      {
        _id: process.env.WIX_ABOUT_COLLECTION_NAME || 'AboutContent',
        id: process.env.WIX_ABOUT_COLLECTION_NAME || 'AboutContent',
        displayName: 'About Content',
        type: 'cms',
      },
      {
        _id: process.env.WIX_SERVICES_COLLECTION_NAME || 'ServicesContent',
        id: process.env.WIX_SERVICES_COLLECTION_NAME || 'ServicesContent',
        displayName: 'Services Content',
        type: 'cms',
      },
      {
        _id: process.env.WIX_CONTACT_COLLECTION_NAME || 'ContactContent',
        id: process.env.WIX_CONTACT_COLLECTION_NAME || 'ContactContent',
        displayName: 'Contact Content',
        type: 'cms',
      },
    ];

    console.log('Successfully returned collections:', collections);

    // Return the collections data
    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Error fetching collection IDs:', error);
    console.error('Error details:', {
      message: (error as Error).message,
      code: (error as { code?: string }).code,
      stack: (error as Error).stack,
    });

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: 'Failed to fetch collection IDs',
        details: (error as Error).message || 'Unknown error',
        hint: 'Please check your Wix credentials in the environment variables',
      },
      { status: 500 }
    );
  }
}

// POST handler for inserting items into Wix collections
export async function POST(request: Request) {
  try {
    // Extract collection name from the URL path
    // The URL will be /api/wix-collections/:collectionName
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const collectionName = pathSegments[pathSegments.length - 1];

    console.log('Attempting to insert item into collection:', collectionName);

    // Validate collection name
    if (!collectionName) {
      return NextResponse.json(
        {
          error: 'Collection name is required',
          details: 'Please specify a collection name in the URL path',
        },
        { status: 400 }
      );
    }

    // For other collections, you might want to implement similar logic
    return NextResponse.json(
      {
        error: 'Unsupported collection',
        details: `Inserting into collection "${collectionName}" is not supported via this endpoint`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing POST request:', error);

    return NextResponse.json(
      {
        error: 'Failed to process request',
        details:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
