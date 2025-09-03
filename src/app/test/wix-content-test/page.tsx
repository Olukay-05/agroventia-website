// app/test/wix-content-test/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import WixContentTest from '@/components/WixContentTest';
import EnvironmentStatus from '@/components/EnvironmentStatus';
import { useHeroContent } from '@/hooks/useWixContent';
import { Button } from '@/components/ui/button';

const HeroContentDisplay: React.FC = () => {
  const { data: heroContent, isLoading, error } = useHeroContent();

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Hero Content from Wix CMS</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-48 bg-gray-300 rounded mb-4"></div>
        </div>
        <p className="text-gray-600">Loading hero content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          Hero Content Error
        </h2>
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry Loading
        </Button>
      </div>
    );
  }

  if (!heroContent || heroContent.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">
          No Hero Content Found
        </h2>
        <p className="text-yellow-600">
          No hero content items found in the Wix CMS. Please add content to the
          HeroContent collection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Hero Content from Wix CMS</h2>
      <div className="grid gap-6">
        {heroContent.map((hero, index) => (
          <div key={hero._id} className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Hero Item #{index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>ID:</strong> {hero._id}
                </div>
                <div>
                  <strong>Overlay Opacity:</strong> {hero.overlayOpacity || 0}
                </div>
              </div>
            </div>

            {/* Hero Image Display */}
            {hero.backgroundImage ? (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Background Image:</h4>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={hero.backgroundImage}
                    alt={`Hero background for ${hero.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Show overlay preview */}
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: hero.overlayOpacity || 0 }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    Overlay: {Math.round((hero.overlayOpacity || 0) * 100)}%
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Image URL: {hero.backgroundImage}
                </p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">No background image configured</p>
              </div>
            )}

            {/* Hero Content */}
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700">Title:</h4>
                <p className="text-lg font-bold">{hero.title}</p>
              </div>

              {hero.subtitle && (
                <div>
                  <h4 className="font-medium text-gray-700">Subtitle:</h4>
                  <p className="text-gray-600">{hero.subtitle}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Primary CTA:</h4>
                  <p>{hero.ctaPrimary || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Secondary CTA:</h4>
                  <p>{hero.ctaSecondary || 'N/A'}</p>
                </div>
              </div>

              {/* Preview Button */}
              {hero.ctaPrimary && (
                <div className="pt-2">
                  <Button
                    asChild
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <a
                      href="#" // Using # as placeholder since we don't have a specific link field
                      target="_self"
                      rel={undefined}
                    >
                      {hero.ctaPrimary}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WixContentTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">
        Wix Studio CMS Integration Test
      </h1>

      {/* Environment Status */}
      <EnvironmentStatus showDetails={true} />

      {/* Hero Content Section */}
      <HeroContentDisplay />

      {/* Existing Collections Test */}
      <WixContentTest />
    </div>
  );
};

export default WixContentTestPage;
