'use client';

import React from 'react';
import MapComponent from '@/components/common/MapComponent';
import SectionContainer from '@/components/common/SectionContainer';

const MapTestPage = () => {
  return (
    <SectionContainer background="muted" padding="large">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">Map Component Test</h1>
          <p className="text-gray-600">
            Testing the interactive map component implementation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Map with Coordinates</h2>
            <div className="h-64 rounded-xl overflow-hidden">
              <MapComponent
                address="403 - 65 Mutual Street, Toronto, M5B 0E5"
                position={[43.6532, -79.3832]}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Map without Coordinates
            </h2>
            <div className="h-64 rounded-xl overflow-hidden">
              <MapComponent address="Toronto, Canada" />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default MapTestPage;
