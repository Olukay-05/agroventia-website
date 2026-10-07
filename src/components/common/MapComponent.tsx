import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from '@/contexts/LocaleContext';

// Dynamically import the LeafletMap component (client-side only)
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
      </div>
    </div>
  ),
});

interface MapComponentProps {
  address: string;
  position?: [number, number];
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  address,
  position,
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);
  const { locale } = useLocale();
  const isFrench = locale.startsWith('fr');
  const isSpanish = locale.startsWith('es') || locale === 'esp';
  const mapLabel = isFrench ? 'Carte interactive' : isSpanish ? 'Mapa interactivo' : 'Interactive Map';

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={`rounded-xl ${className}`}
        style={{ height: '100%', minHeight: '300px', position: 'relative' }}
      >
        <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-600">{mapLabel}</p>
            <p className="text-sm text-gray-500 mt-1">{address}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LeafletMap address={address} position={position} className={className} />
  );
};

export default MapComponent;
