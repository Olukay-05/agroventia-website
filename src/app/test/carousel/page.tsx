// src/app/test/carousel/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { wixApiService } from '@/services/wix-api.service';

interface CarouselItem {
  image: string;
  imageDescription?: string;
  tagline?: string;
}

export default function CarouselTestPage() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Carousel Test: Fetching data...');
        const response = await wixApiService.queryCollection<CarouselItem>(
          'CarouselImageDisplay'
        );

        console.log('📊 Carousel Test: Response received', response);

        if (response.items && response.items.length > 0) {
          const items = response.items.map(item => ({
            image: item.data.image,
            imageDescription: item.data.imageDescription,
            tagline: item.data.tagline,
          }));

          console.log('✅ Carousel Test: Processed items', items);
          setCarouselItems(items);
        } else {
          console.warn('⚠️ Carousel Test: No items found');
          setError('No carousel items found');
        }
      } catch (err) {
        console.error('❌ Carousel Test: Error', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch carousel data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading carousel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Carousel Test
        </h1>

        {carouselItems.length > 0 ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Carousel Data Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {carouselItems.length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Has Images</p>
                  <p className="text-2xl font-bold text-green-600">
                    {carouselItems.filter(item => item.image).length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Has Descriptions</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {carouselItems.filter(item => item.imageDescription).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Carousel Items
              </h2>
              <div className="space-y-6">
                {carouselItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Item {index + 1}
                        </h3>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={`Carousel item ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'https://placehold.co/400x200/cccccc/999999?text=Image+Error';
                            }}
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="md:w-2/3">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Image URL</p>
                            <p className="text-gray-900 break-all">
                              {item.image || 'Not provided'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Image Description (Headline)
                            </p>
                            <p className="text-gray-900">
                              {item.imageDescription || 'Not provided'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tagline</p>
                            <p className="text-gray-900">
                              {item.tagline || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Carousel Data
            </h2>
            <p className="text-gray-600 mb-6">
              No items were found in the CarouselImageDisplay collection.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-medium text-yellow-800 mb-2">
                Troubleshooting Steps:
              </h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>
                  Check that you have created the CarouselImageDisplay
                  collection in Wix CMS
                </li>
                <li>
                  Verify that the collection has items with the correct field
                  names:
                  <ul className="list-circle list-inside ml-6 mt-1">
                    <li>image (URL field)</li>
                    <li>imageDescription (Text field)</li>
                    <li>tagline (Text field)</li>
                  </ul>
                </li>
                <li>
                  Ensure your WIX_API_TOKEN and WIX_SITE_ID are correctly set in
                  .env.local
                </li>
                <li>Check that your API token has the necessary permissions</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
