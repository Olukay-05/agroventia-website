# Interactive Map Implementation

## Overview

This document explains how the interactive map feature was implemented in the Contact Section using React Leaflet.

## Implementation Details

### Dependencies

The following packages were installed:

- `leaflet`: The core mapping library
- `react-leaflet`: React components for Leaflet
- `@types/leaflet`: TypeScript definitions for Leaflet

### Components

#### MapComponent

Located at `src/components/common/MapComponent.tsx`, this is a reusable component that displays an interactive map.

**Props:**

- `address` (string): The address to display in the marker popup
- `position` ([number, number], optional): Latitude and longitude coordinates
- `className` (string, optional): Additional CSS classes

**Features:**

- Uses OpenStreetMap as the tile provider
- Displays a marker at the specified coordinates
- Shows the address in a popup when clicking the marker
- Responsive design with customizable height/width
- Falls back to Toronto coordinates if none provided

### Integration with ContactSection

The ContactSection was updated to use the MapComponent:

1. Added import for MapComponent
2. Replaced the static map placeholder with the interactive component
3. Passes the business address and coordinates (if available) to the map

### Adding Coordinates to Contact Data

To display the exact location on the map, you can add latitude and longitude to the Contact Content in Wix CMS:

1. In the Contact Content collection, add two new fields:
   - `latitude` (number)
   - `longitude` (number)

2. Enter the coordinates for the business location:
   - AgroVentia Inc. Address: 403 - 65 Mutual Street, Toronto, M5B 0E5
   - Coordinates: 43.6532, -79.3832 (approximate Toronto coordinates)

If coordinates are not provided, the map will default to Toronto coordinates.

## Usage Example

```tsx
<MapComponent
  address="403 - 65 Mutual Street, Toronto, M5B 0E5"
  position={[43.6532, -79.3832]}
  className="h-48 md:h-64"
/>
```

## Customization

### Styling

The map container accepts a `className` prop for custom styling. The map will automatically fill the container.

### Map Options

To customize the map further, you can modify the MapContainer props in the MapComponent:

- `zoom`: Initial zoom level (default: 15)
- `center`: Initial center coordinates
- Additional Leaflet options can be added as needed

### Tile Providers

The implementation uses OpenStreetMap tiles by default. To use a different provider:

1. Update the `url` prop in the TileLayer component
2. Update the `attribution` to match the new provider
3. Check the terms of service for the new provider

## Troubleshooting

### Map Not Displaying

- Ensure the container has a defined height
- Check that Leaflet CSS is imported
- Verify that coordinates are valid numbers

### Marker Icons Not Showing

- The implementation includes a fix for default marker icons
- If icons still don't appear, check the CDN URLs for the marker images

### Performance

- The map is only loaded when the ContactSection is rendered
- For better performance, consider implementing lazy loading if needed
