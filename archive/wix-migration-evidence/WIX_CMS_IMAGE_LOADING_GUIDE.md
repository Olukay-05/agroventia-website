# Wix CMS Image Loading Guide for Next.js Applications

## Overview

This guide provides comprehensive instructions for successfully loading images from Wix CMS collections in Next.js applications. It addresses the common challenges with Wix's internal image URLs and provides proven solutions for reliable image rendering.

## Table of Contents

1. [Understanding Wix Image URLs](#understanding-wix-image-urls)
2. [Common Issues and Solutions](#common-issues-and-solutions)
3. [Implementation Strategy](#implementation-strategy)
4. [Next.js Integration](#nextjs-integration)
5. [Code Examples](#code-examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Understanding Wix Image URLs

### Wix Internal URL Format

Wix CMS stores images using internal URLs with the following format:

```
wix:image://v1/{imageId}~mv2.jpg/{filename}#originWidth={width}&originHeight={height}
```

**Example:**

```
wix:image://v1/nsplsh_ec99d493c1be45a5a5b244c890788b24~mv2.jpg/Image%20by%20Jacqueline%20O'Gara.jpg#originWidth=4192&originHeight=2789
```

### Why Direct Usage Fails

- **Protocol Issue**: Browsers cannot load `wix:image://` URLs directly
- **Access Restrictions**: Direct conversion attempts often result in 403 Forbidden errors
- **Authentication**: Some image endpoints require proper authentication headers

## Common Issues and Solutions

### Issue 1: ERR_UNKNOWN_URL_SCHEME

**Problem**: Browser cannot interpret `wix:image://` protocol

```javascript
// ❌ This will fail
<img src="wix:image://v1/..." alt="..." />
```

**Solution**: Convert to HTTP URLs before rendering

### Issue 2: 403 Forbidden Errors

**Problem**: Direct static URLs return 403 errors

```javascript
// ❌ Often fails with 403
https://static.wixstatic.com/media/imageId_4192x2789.jpg
```

**Solution**: Implement fallback URL patterns

### Issue 3: Inconsistent Loading

**Problem**: Some images load while others don't
**Solution**: Use systematic fallback strategy

## Implementation Strategy

### 1. URL Detection and Conversion

```typescript
// types/wix-image.ts
export interface WixImageUrlResult {
  primary: string;
  alternatives: string[];
  original: string;
}

// utils/wix-image-converter.ts
export function convertWixImageUrl(wixUrl: string): WixImageUrlResult | null {
  if (typeof wixUrl !== 'string') return null;

  // Check if it's a Wix internal URL
  if (wixUrl.startsWith('wix:image://')) {
    try {
      // Extract components
      const urlParts = wixUrl.replace('wix:image://v1/', '').split('/');
      if (urlParts.length >= 2) {
        const imageIdPart = urlParts[0]; // e.g., "nsplsh_...~mv2.jpg"
        const filenamePart = urlParts[1]; // e.g., "Image%20...#originWidth=..."

        // Extract dimensions
        let width = 800;
        let height = 600;

        if (filenamePart.includes('#')) {
          const fragment = filenamePart.split('#')[1];
          const params = new URLSearchParams(fragment);
          width = parseInt(params.get('originWidth') || '800');
          height = parseInt(params.get('originHeight') || '600');
        }

        // Remove file extension to get clean image ID
        const imageId = imageIdPart.replace(
          /~mv2\.(jpg|jpeg|png|gif|webp)$/i,
          ''
        );

        // Create multiple URL formats for fallback
        const urlFormats = [
          // Format 1: Wix static with dimensions (often fails with 403)
          `https://static.wixstatic.com/media/${imageId}_${width}x${height}.jpg`,

          // Format 2: Wix static with original format (more reliable)
          `https://static.wixstatic.com/media/${imageIdPart}`,

          // Format 3: Wix static without dimensions (most reliable)
          `https://static.wixstatic.com/media/${imageId}.jpg`,

          // Format 4: Direct Unsplash for nsplsh_ images
          ...(imageId.startsWith('nsplsh_')
            ? [
                `https://images.unsplash.com/photo-${imageId.replace(
                  'nsplsh_',
                  ''
                )}?w=${Math.min(800, width)}&h=${Math.min(
                  600,
                  height
                )}&fit=crop`,
              ]
            : []),
        ];

        return {
          primary: urlFormats[0],
          alternatives: urlFormats.slice(1),
          original: wixUrl,
        };
      }
    } catch (error) {
      console.error('Error converting Wix URL:', error);
      return null;
    }
  }

  // Return standard URLs as-is
  if (wixUrl.startsWith('http://') || wixUrl.startsWith('https://')) {
    return {
      primary: wixUrl,
      alternatives: [],
      original: wixUrl,
    };
  }

  return null;
}
```

### 2. Image Field Detection

```typescript
// utils/image-detection.ts
export function isImageField(fieldName: string, value: any): boolean {
  if (!value) return false;

  const imageFieldNames = [
    'image',
    'img',
    'photo',
    'picture',
    'banner',
    'logo',
    'icon',
    'thumbnail',
    'avatar',
  ];

  const lowerFieldName = fieldName.toLowerCase();
  const hasImageInName = imageFieldNames.some(name =>
    lowerFieldName.includes(name)
  );

  if (typeof value === 'string') {
    return hasImageInName || isImageUrl(value);
  } else if (typeof value === 'object' && value !== null) {
    // Check for Wix media object structure
    return hasWixMediaStructure(value) || hasImageInName;
  }

  return false;
}

function isImageUrl(url: string): boolean {
  if (typeof url !== 'string') return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();

  // Check for Wix internal URLs
  if (lowerUrl.startsWith('wix:image://')) return true;

  // Check for image extensions
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) return true;

  // Check for known image hosts
  const imageHosts = ['wixstatic.com', 'unsplash.com', 'images.unsplash.com'];
  return imageHosts.some(host => lowerUrl.includes(host));
}

function hasWixMediaStructure(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;

  const wixMediaProps = [
    'src',
    'url',
    'filename',
    'width',
    'height',
    'altText',
  ];
  const objKeys = Object.keys(obj);

  return wixMediaProps.some(prop => objKeys.includes(prop));
}
```

## Next.js Integration

### 1. Custom Image Component with Fallback

```tsx
// components/WixImage.tsx
'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import {
  convertWixImageUrl,
  type WixImageUrlResult,
} from '@/utils/wix-image-converter';

interface WixImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onLoadSuccess?: (url: string) => void;
  onLoadError?: (error: string) => void;
}

export default function WixImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  onLoadSuccess,
  onLoadError,
}: WixImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [urlData, setUrlData] = useState<WixImageUrlResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Initialize URL conversion
  useState(() => {
    const converted = convertWixImageUrl(src);
    if (converted) {
      setUrlData(converted);
      setCurrentSrc(converted.primary);
    } else {
      setCurrentSrc(src);
    }
  });

  const handleImageError = useCallback(() => {
    if (urlData && currentIndex < urlData.alternatives.length) {
      // Try next alternative URL
      const nextUrl = urlData.alternatives[currentIndex];
      console.log(
        `Image failed, trying alternative ${currentIndex + 1}: ${nextUrl}`
      );

      setCurrentIndex(prev => prev + 1);
      setCurrentSrc(nextUrl);
    } else {
      // All URLs failed
      setHasError(true);
      setIsLoading(false);
      onLoadError?.(
        `Failed to load image after ${
          (urlData?.alternatives.length || 0) + 1
        } attempts`
      );
    }
  }, [urlData, currentIndex, onLoadError]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoadSuccess?.(currentSrc);
  }, [currentSrc, onLoadSuccess]);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500 p-4">
          <p className="text-sm font-medium">Failed to load image</p>
          <p className="text-xs mt-1">
            Tried {(urlData?.alternatives.length || 0) + 1} URL(s)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}
        unoptimized // Disable Next.js optimization for external URLs
      />
    </div>
  );
}
```

### 2. Collection Data Processing Hook

```tsx
// hooks/useWixImages.ts
import { useMemo } from 'react';
import { isImageField } from '@/utils/image-detection';

interface WixImageInfo {
  fieldName: string;
  url: string;
  type: 'url' | 'wix-media' | 'object';
}

export function useWixImages(data: any): WixImageInfo[] {
  return useMemo(() => {
    const images: WixImageInfo[] = [];

    function extractImages(obj: any, prefix = ''): void {
      if (!obj || typeof obj !== 'object') return;

      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (isImageField(key, value)) {
          if (typeof value === 'string') {
            images.push({
              fieldName: fullKey,
              url: value,
              type: 'url',
            });
          } else if (typeof value === 'object' && value.src) {
            images.push({
              fieldName: fullKey,
              url: value.src,
              type: 'wix-media',
            });
          } else if (typeof value === 'object') {
            const url = value.url || value.src || value.href || value.link;
            if (url) {
              images.push({
                fieldName: fullKey,
                url: url,
                type: 'object',
              });
            }
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, idx) => {
            if (typeof item === 'object') {
              extractImages(item, `${fullKey}[${idx}]`);
            }
          });
        } else if (typeof value === 'object') {
          extractImages(value, fullKey);
        }
      });
    }

    extractImages(data);
    return images;
  }, [data]);
}
```

### 3. Server-Side Image Processing

```typescript
// lib/wix-api.ts
export async function fetchWixCollection(collectionName: string) {
  const response = await fetch(
    'https://www.wixapis.com/wix-data/v2/items/query',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WIX_API_TOKEN}`,
        'Content-Type': 'application/json',
        'wix-site-id': process.env.WIX_SITE_ID!,
      },
      body: JSON.stringify({
        dataCollectionId: collectionName,
        includeReferencedItems: ['*'],
        returnTotalCount: true,
        cursorPaging: { limit: 100 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${collectionName}: ${response.statusText}`
    );
  }

  const data = await response.json();

  // Transform response to include processed image URLs
  return {
    items:
      data.dataItems?.map((item: any) => ({
        ...item,
        data: processImageFields(item.data),
      })) || [],
    totalCount: data.pagingMetadata?.total || 0,
    _metadata: {
      collectionName,
      fetchedAt: new Date().toISOString(),
      itemCount: data.dataItems?.length || 0,
    },
  };
}

function processImageFields(data: any): any {
  if (!data || typeof data !== 'object') return data;

  const processed = { ...data };

  Object.keys(processed).forEach(key => {
    const value = processed[key];

    if (
      isImageField(key, value) &&
      typeof value === 'string' &&
      value.startsWith('wix:image://')
    ) {
      // Add processed URL alongside original
      const converted = convertWixImageUrl(value);
      if (converted) {
        processed[`${key}_processed`] = converted;
      }
    } else if (Array.isArray(value)) {
      processed[key] = value.map(item => processImageFields(item));
    } else if (typeof value === 'object' && value !== null) {
      processed[key] = processImageFields(value);
    }
  });

  return processed;
}
```

### 4. Usage in Next.js Pages/Components

```tsx
// app/gallery/page.tsx
import { Suspense } from 'react';
import WixImage from '@/components/WixImage';
import { useWixImages } from '@/hooks/useWixImages';

interface GalleryPageProps {
  data: any; // Your Wix collection data
}

export default function GalleryPage({ data }: GalleryPageProps) {
  const images = useWixImages(data);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((imageInfo, index) => (
          <div
            key={`${imageInfo.fieldName}-${index}`}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Suspense
              fallback={<div className="h-64 bg-gray-200 animate-pulse" />}
            >
              <WixImage
                src={imageInfo.url}
                alt={`Image from ${imageInfo.fieldName}`}
                width={400}
                height={300}
                className="w-full h-64 object-cover"
                onLoadSuccess={url => console.log(`✅ Loaded: ${url}`)}
                onLoadError={error => console.error(`❌ Failed: ${error}`)}
              />
            </Suspense>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800">
                {imageInfo.fieldName}
              </h3>
              <p className="text-sm text-gray-600">Type: {imageInfo.type}</p>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images found in this collection.</p>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Error Handling

- Always implement fallback URLs for Wix images
- Provide meaningful error messages and loading states
- Log failed attempts for debugging

### 2. Performance Optimization

- Use Next.js Image component with `unoptimized` prop for external URLs
- Implement lazy loading for image galleries
- Consider caching converted URLs on the server side

### 3. Accessibility

- Always provide meaningful alt text
- Include proper ARIA labels for loading states
- Ensure keyboard navigation works properly

### 4. SEO Considerations

- Pre-process images during build time when possible
- Use proper meta tags for image-heavy pages
- Consider generating static image manifests

### 5. Monitoring and Debugging

```typescript
// utils/image-monitoring.ts
export function trackImageLoad(
  url: string,
  success: boolean,
  attempts: number
) {
  // Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'wix_image_load', {
      custom_map: { url, success, attempts },
      value: success ? 1 : 0,
    });
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Image ${success ? 'loaded' : 'failed'}: ${url} (${attempts} attempts)`
    );
  }
}
```

## Troubleshooting

### Common Issues and Solutions

1. **Images not loading at all**
   - Check if URLs are being converted properly
   - Verify network connectivity and CORS settings
   - Ensure fallback URLs are implemented

2. **403 Forbidden errors**
   - This is expected for dimension-based URLs
   - Ensure fallback to `~mv2.jpg` format is working
   - Check if alternative URL formats are being tried

3. **Slow loading times**
   - Implement proper loading states
   - Consider image optimization strategies
   - Use appropriate image dimensions

4. **Images loading inconsistently**
   - Check for race conditions in fallback logic
   - Verify that each image gets its own fallback state
   - Ensure proper error boundaries

### Debug Logging

```typescript
// Enable detailed logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Wix Image Debug Info:', {
    originalUrl: src,
    convertedUrl: currentSrc,
    alternativeUrls: urlData?.alternatives,
    currentAttempt: currentIndex + 1,
    totalAttempts: (urlData?.alternatives.length || 0) + 1,
  });
}
```

## Environment Variables

```bash
# .env.local
WIX_API_TOKEN=your_wix_api_token
WIX_SITE_ID=your_wix_site_id

# Optional: Enable debug logging
NEXT_PUBLIC_DEBUG_IMAGES=true
```

## Conclusion

Successfully loading images from Wix CMS requires understanding the URL conversion process and implementing robust fallback strategies. The key is to:

1. **Convert** `wix:image://` URLs to HTTP format
2. **Implement** multiple fallback URL patterns
3. **Handle** 403 errors gracefully with automatic retries
4. **Provide** proper loading states and error handling
5. **Monitor** success rates and optimize accordingly

By following this guide, you can reliably display Wix CMS images in your Next.js applications with excellent user experience and minimal loading failures.

## Additional Resources

- [Wix Data API Documentation](https://dev.wix.com/api/rest/wix-data)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Wix Media Manager API](https://dev.wix.com/api/rest/media)

---

_Last updated: 2025_
_Version: 1.0_
