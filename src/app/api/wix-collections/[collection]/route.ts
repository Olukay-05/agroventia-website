// src/app/api/wix-collections/[collection]/route.ts
import { NextResponse } from 'next/server';
import { wixDataService } from '@/services/wix-data.service';
import { CollectionNames } from '@/services/wix-data.service';

export async function POST(
  request: Request,
  { params }: { params: { collection: string } }
) {
  try {
    const { collection } = params;
    const data = await request.json();

    // Validate collection name
    if (
      !Object.values(CollectionNames).includes(collection as CollectionNames)
    ) {
      return NextResponse.json(
        {
          error: 'Invalid collection name',
          received: collection,
          expected: Object.values(CollectionNames),
        },
        { status: 400 }
      );
    }

    // For other collections, return not implemented
    return NextResponse.json(
      {
        error: 'This collection does not support insertion via API',
        collection: collection,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error inserting item:', error);

    return NextResponse.json(
      {
        error: 'Failed to insert item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
