// lib/utils/image.ts
import {
  buildSanityImageUrl,
  urlForImage,
  isSanityImageSource,
  getSanityImageDimensions,
  type SanityImageSource,
} from '@/lib/api/sanity-image';

export {
  buildSanityImageUrl,
  urlForImage,
  isSanityImageSource,
  getSanityImageDimensions,
  type SanityImageSource,
};

// Image field detection utility
export function isImageField(fieldName: string, value: unknown): boolean {
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
    return isSanityImageSource(value) || hasImageInName;
  }

  return false;
}

export function isImageUrl(url: string): boolean {
  if (typeof url !== 'string') return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
  const lowerUrl = url.toLowerCase();

  // Check for image extensions
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) return true;

  // Check for known image hosts
  const imageHosts = [
    'cdn.sanity.io',
    'unsplash.com',
    'images.unsplash.com',
  ];
  return imageHosts.some(host => lowerUrl.includes(host));
}

/**
 * Get image URL with fallback handling using Sanity image pipeline
 */
export function getImageUrl(
  imageUrl?: string | null,
  fallback?: string
): string | undefined {
  if (!imageUrl) return fallback;

  try {
    if (isSanityImageSource(imageUrl)) {
      return buildSanityImageUrl(imageUrl) || fallback;
    }
    return imageUrl || fallback;
  } catch (error) {
    console.warn('Failed to resolve image URL:', imageUrl, error);
    return fallback;
  }
}
