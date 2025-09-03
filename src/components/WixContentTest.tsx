'use client';

import React, { useState } from 'react';
import { useAllCollections } from '@/hooks/useAllCollections';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { TransformedResponse } from '@/services/wix-api.service';
import {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ContactContent,
} from '@/services/wix-data.service';

// Define the structure of our collections data
interface CollectionsData {
  hero?: TransformedResponse<HeroContent>;
  about?: TransformedResponse<AboutContent>;
  services?: TransformedResponse<ServiceContent>;
  products?: TransformedResponse<ProductContent>;
  categories?: TransformedResponse<unknown>;
  contact?: TransformedResponse<ContactContent>;
  [key: string]: TransformedResponse<unknown> | undefined;
}

const WixContentTest: React.FC = () => {
  const { data, isLoading, error, refetch } = useAllCollections();
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Wix Collections Data</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading collections data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          Collections Loading Error
        </h2>
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </Button>
      </div>
    );
  }

  const collections = (data || {}) as CollectionsData;

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Wix Collections Data</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {Object.keys(collections).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No collections data available</p>
          <Button onClick={handleRefresh}>Load Collections</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(collections).map(
            ([collectionName, collectionData]) => (
              <div key={collectionName} className="border rounded-lg">
                <button
                  onClick={() => toggleSection(collectionName)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {collectionName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {collectionData && Array.isArray(collectionData.items)
                        ? `${collectionData.items.length} items`
                        : 'Collection data'}
                    </p>
                  </div>
                  {expandedSections[collectionName] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {expandedSections[collectionName] && collectionData && (
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-medium mb-3">Collection Structure:</h4>
                    <pre className="bg-white p-4 rounded border text-xs overflow-auto max-h-96">
                      {JSON.stringify(collectionData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )
          )}

          {/* Raw Data Section */}
          <div className="border rounded-lg">
            <button
              onClick={() => toggleSection('rawData')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-lg">Raw Data</h3>
                <p className="text-sm text-gray-600">
                  Complete collections response
                </p>
              </div>
              {expandedSections['rawData'] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSections['rawData'] && (
              <div className="p-4 border-t bg-gray-50">
                <pre className="bg-white p-4 rounded border text-xs overflow-auto max-h-96">
                  {JSON.stringify(collections, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WixContentTest;
