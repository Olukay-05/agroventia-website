import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define a proper type for the Leaflet Icon prototype
interface LeafletIconPrototype {
  _getIconUrl?: () => string;
}

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as LeafletIconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  address: string;
  position?: [number, number];
  className?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  address,
  position,
  className = '',
}) => {
  // Default to Toronto coordinates if not provided
  const defaultCenter: [number, number] = position || [43.6532, -79.3832];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      className={`rounded-xl ${className}`}
      style={{ height: '100%', minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={defaultCenter}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
