// lib/utils/image.ts
export interface WixImageUrlResult {
  primary: string;
  alternatives: string[];
  original: string;
}

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

        // Create multiple URL formats for fallback - prioritize most reliable
        const urlFormats = [
          // Format 1: Wix static with original format (most reliable) - prioritized
          `https://static.wixstatic.com/media/${imageIdPart}`,

          // Format 2: Wix static without dimensions (very reliable)
          `https://static.wixstatic.com/media/${imageId}.jpg`,

          // Format 3: Direct Unsplash for nsplsh_ images (when available)
          ...(imageId.startsWith('nsplsh_')
            ? [
                `https://images.unsplash.com/photo-${imageId.replace(
                  'nsplsh_',
                  ''
                )}?w=${Math.min(1200, width)}&h=${Math.min(
                  800,
                  height
                )}&fit=crop&auto=format`,
              ]
            : []),

          // Format 4: Wix static with dimensions (often fails with 403) - last resort
          `https://static.wixstatic.com/media/${imageId}_${width}x${height}.jpg`,
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

// Legacy function for backwards compatibility
export function convertWixImageUrlLegacy(wixImageUrl: string): string {
  const result = convertWixImageUrl(wixImageUrl);
  return result?.primary || '';
}

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

function hasWixMediaStructure(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;

  // Type assertion for object with string keys
  const objRecord = obj as Record<string, unknown>;
  const wixMediaProps = [
    'src',
    'url',
    'filename',
    'width',
    'height',
    'altText',
  ];
  const objKeys = Object.keys(objRecord);

  return wixMediaProps.some(prop => objKeys.includes(prop));
}

/**
 * Get image URL with fallback handling - backwards compatibility
 */
export function getImageUrl(
  imageUrl?: string | null,
  fallback?: string
): string | undefined {
  if (!imageUrl) return fallback;

  try {
    const result = convertWixImageUrl(imageUrl);
    return result?.primary || fallback;
  } catch (error) {
    console.warn('Failed to convert image URL:', imageUrl, error);
    return fallback;
  }
}
