// hooks/useWixImages.ts
import { useMemo } from 'react';
import { isImageField } from '@/lib/utils/image';

interface WixImageInfo {
  fieldName: string;
  url: string;
  type: 'url' | 'wix-media' | 'object';
}

// Define a proper type for the data parameter
interface WixData {
  [key: string]: unknown;
}

export function useWixImages(data: WixData): WixImageInfo[] {
  return useMemo(() => {
    const images: WixImageInfo[] = [];

    function extractImages(obj: WixData, prefix = ''): void {
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
          } else if (
            typeof value === 'object' &&
            value &&
            'src' in value &&
            typeof value.src === 'string'
          ) {
            images.push({
              fieldName: fullKey,
              url: value.src,
              type: 'wix-media',
            });
          } else if (typeof value === 'object' && value) {
            const url =
              ('url' in value && typeof value.url === 'string'
                ? value.url
                : null) ||
              ('src' in value && typeof value.src === 'string'
                ? value.src
                : null) ||
              ('href' in value && typeof value.href === 'string'
                ? value.href
                : null) ||
              ('link' in value && typeof value.link === 'string'
                ? value.link
                : null);
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
            if (typeof item === 'object' && item !== null) {
              extractImages(item as WixData, `${fullKey}[${idx}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          extractImages(value as WixData, fullKey);
        }
      });
    }

    extractImages(data);
    return images;
  }, [data]);
}

// Hook to get image monitoring data
export function useImageLoadMonitoring() {
  const trackImageLoad = (url: string, success: boolean, attempts: number) => {
    // Analytics tracking
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    ) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
        'event',
        'wix_image_load',
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          custom_map: { url, success, attempts } as any,
          value: success ? 1 : 0,
        }
      );
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Image ${success ? 'loaded' : 'failed'}: ${url} (${attempts} attempts)`
      );
    }
  };

  return { trackImageLoad };
}
