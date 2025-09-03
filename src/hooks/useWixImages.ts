// hooks/useWixImages.ts
import { useMemo } from 'react';
import { isImageField } from '@/lib/utils/image';

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

// Hook to get image monitoring data
export function useImageLoadMonitoring() {
  const trackImageLoad = (url: string, success: boolean, attempts: number) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'wix_image_load', {
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
  };

  return { trackImageLoad };
}
