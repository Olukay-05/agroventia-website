# Wix Image Integration Guide

## Overview
This document explains how images from Wix CMS are integrated, linked, and rendered in the UI. It provides a comprehensive guide to replicate this functionality in other projects.

## Table of Contents
1. [Wix CMS Image Storage](#wix-cms-image-storage)
2. [Image URL Structure](#image-url-structure)
3. [Retrieving Images from Wix CMS](#retrieving-images-from-wix-cms)
4. [Displaying Images in the UI](#displaying-images-in-the-ui)
5. [Responsive Image Handling](#responsive-image-handling)
6. [Performance Optimization](#performance-optimization)
7. [Implementation Example](#implementation-example)
8. [Troubleshooting](#troubleshooting)

## Wix CMS Image Storage
Wix CMS stores images in a cloud-based storage system with the following characteristics:
- Images are automatically optimized upon upload
- Multiple image sizes are generated automatically
- Images have unique URLs with optimization parameters
- Secure image hosting with CDN distribution

## Image URL Structure
Wix image URLs follow this pattern:
```
https://static.wixstatic.com/media/{media-id}_{format}.jpg
```

Additional parameters for optimization:
- `fill`: Scales image to fill specified dimensions
- `crop`: Crops image to specified dimensions
- `scale`: Scales image while maintaining aspect ratio
- `q`: Quality setting (e.g., q_80 for 80% quality)

## Retrieving Images from Wix CMS

### Using Wix Data Hooks
```javascript
import { useWixData } from '@wix/app-kit';

// Example of fetching CMS content with images
const { data, loading, error } = useWixData('collection-name', {
  include: ['image-field']
});
```

### Using Wix Client API
```javascript
import { wixClient } from '@/lib/wix-client';

const getImagesFromCMS = async () => {
  try {
    const response = await wixClient.collections.queryCollectionData({
      collectionId: 'your-collection-id',
      options: {
        suppressAuth: true
      }
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};
```

## Displaying Images in the UI

### Basic Image Implementation
```jsx
import Image from 'next/image';
import { wixImage } from '@/utils/wix-image';

const WixImageDisplay = ({ wixImageData }) => {
  const imageUrl = wixImage(wixImageData, 800, 600); // width, height

  return (
    <div className="image-container">
      <Image
        src={imageUrl}
        alt={wixImageData.altText || 'Image'}
        width={800}
        height={600}
        layout="responsive"
        objectFit="cover"
        placeholder="blur"
        blurDataURL={wixImage(wixImageData, 10, 10)} // Very small version for blur
      />
    </div>
  );
};
```

### Advanced Implementation with Error Handling
```jsx
import { useState } from 'react';
import Image from 'next/image';

const AdvancedWixImage = ({ wixImageData, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const imageUrl = wixImage(wixImageData, 800, 600);
  const fallbackUrl = '/images/fallback-image.jpg'; // Your fallback image

  return (
    <div className={`image-wrapper ${className}`}>
      {!imageError ? (
        <Image
          src={imageUrl}
          alt={wixImageData.altText || 'Content Image'}
          width={wixImageData.width || 800}
          height={wixImageData.height || 600}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      ) : (
        <Image
          src={fallbackUrl}
          alt="Fallback image"
          width={800}
          height={600}
        />
      )}
    </div>
  );
};
```

## Responsive Image Handling

### Using Wix Image Transformation Parameters
Wix provides automatic image transformation parameters to handle responsiveness:

```javascript
const getResponsiveImage = (wixImageData, width, height, mode = 'fill') => {
  const baseImageUrl = wixImageData.url;
  
  // Add responsive parameters
  const params = new URLSearchParams({
    width: width,
    height: height,
    mode: mode, // 'fill', 'crop', 'scale'
    q: 80, // quality
    usm: '0.66,1,6,0', // unsharp mask
  });

  return `${baseImageUrl}?${params.toString()}`;
};
```

### Next.js Image Component with Responsive Sizes
```jsx
<Image
  src={imageUrl}
  alt="Responsive Image"
  fill // For responsive layouts
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{
    objectFit: 'cover',
  }}
/>
```

## Performance Optimization

### Lazy Loading
All images should be lazy-loaded by default unless marked as priority:
```jsx
<Image
  src={imageUrl}
  alt="Lazy-loaded image"
  width={800}
  height={600}
  loading="lazy" // Default behavior, can be omitted
/>
```

### Image Optimization Function
```javascript
// utils/wix-image.js
export const wixImage = (wixImageData, width, height, options = {}) => {
  if (!wixImageData?.url) return null;

  const {
    quality = 80,
    fit = 'fill', // 'fill', 'crop', 'scale'
    format = 'auto',
  } = options;

  const url = new URL(wixImageData.url);
  
  // Add query parameters for optimization
  url.searchParams.set('width', width);
  url.searchParams.set('height', height);
  url.searchParams.set('fit', fit);
  url.searchParams.set('quality', quality);
  url.searchParams.set('format', format);

  return url.toString();
};
```

## Implementation Example

### Complete Component Implementation
```jsx
// components/WixImageGallery.jsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { wixImage } from '@/utils/wix-image';

const WixImageGallery = ({ collectionId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getImagesFromCMS(collectionId);
        setImages(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, [collectionId]);

  if (loading) return <div>Loading images...</div>;
  if (error) return <div>Error loading images: {error}</div>;

  return (
    <div className="gallery-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((imageData, index) => (
          <div key={index} className="image-card">
            <Image
              src={wixImage(imageData.image, 600, 400)}
              alt={imageData.title || 'Gallery image'}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-64"
            />
            {imageData.title && (
              <p className="mt-2 text-center">{imageData.title}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WixImageGallery;
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Image Not Loading
- **Check the image URL**: Ensure the URL is properly formatted
- **Verify permissions**: Make sure the image is public in Wix CMS
- **Check image format**: Ensure the image format is supported

#### 2. Responsive Image Issues
- **Size mismatch**: Verify that responsive sizes are correctly defined
- **Dimensions**: Make sure width/height match the actual image proportions

#### 3. Performance Issues
- **Image size**: Ensure optimized image dimensions are being used
- **Lazy loading**: Verify lazy loading is properly implemented
- **CDN**: Confirm images are being served through CDN

### Debugging Tips
```javascript
// Debug image data
console.log('Wix Image Data:', wixImageData);
console.log('Generated URL:', wixImage(wixImageData, 800, 600));

// Check if image exists
const checkImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
```

## Best Practices

1. **Always provide alt text** for accessibility
2. **Optimize image dimensions** for the specific use case
3. **Use appropriate image formats** (webp when possible)
4. **Implement fallbacks** for broken images
5. **Test across devices** to ensure responsive behavior
6. **Monitor loading performance** and optimize accordingly
7. **Use appropriate quality settings** balancing file size and visual quality

## Conclusion

This guide provides a comprehensive approach to implementing Wix CMS image integration. The key to successful implementation is understanding the URL structure, properly handling responsive images, and optimizing for performance. When replicating this in other projects, ensure you follow the same patterns and maintain consistent error handling.