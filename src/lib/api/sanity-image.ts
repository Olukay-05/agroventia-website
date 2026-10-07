// src/lib/api/sanity-image.ts
import imageUrlBuilder from '@sanity/image-url';
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from '@/sanity/client';
import { projectId, dataset } from '@/sanity/env';

export type { SanityImageSource };

export type SanityImageCropMode =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'focalpoint';

export type SanityImageFitMode =
  | 'clip'
  | 'crop'
  | 'fill'
  | 'fillmax'
  | 'max'
  | 'scale'
  | 'min';

export type SanityImageFormat = 'webp' | 'jpg' | 'pjpg' | 'png';

export interface SanityImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: SanityImageFormat;
  autoFormat?: boolean; // defaults to true ('format')
  fit?: SanityImageFitMode; // defaults to 'crop' when hotspot is present
  crop?: SanityImageCropMode; // defaults to 'focalpoint' when hotspot is present
  blur?: number;
  dpr?: number;
}

export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface SanitySrcSetOptions {
  widths?: number[];
  aspectRatio?: number;
  quality?: number;
  fit?: SanityImageFitMode;
  crop?: SanityImageCropMode;
  format?: SanityImageFormat;
  autoFormat?: boolean;
}

export const DEFAULT_IMAGE_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1536, 1920];

/**
 * Use the configured Sanity client. If configuration is missing, the client
 * contains a non-existent placeholder project and requests fail visibly
 * instead of resolving assets from an unrelated project.
 */
const configuredClient =
  client && typeof (client as any).clientConfig === 'object' && (client as any).clientConfig.projectId
    ? client
    : { projectId, dataset };

export const imageBuilder: ImageUrlBuilder = imageUrlBuilder(configuredClient);

/**
 * Returns an ImageUrlBuilder instance for chaining custom Sanity transformations.
 */
export function urlForImage(source: SanityImageSource): ImageUrlBuilder {
  return imageBuilder.image(source);
}

/**
 * Determines whether the given value is an image object with hotspot and/or crop coordinates.
 */
export function hasHotspot(source: unknown): boolean {
  if (!source || typeof source !== 'object') return false;
  const s = source as Record<string, any>;
  return (
    (typeof s.hotspot === 'object' && s.hotspot !== null) ||
    (typeof s.crop === 'object' && s.crop !== null)
  );
}

/**
 * Determines whether the input is a Sanity image object, asset reference, or CDN URL.
 */
export function isSanityImageSource(source: unknown): boolean {
  if (!source) return false;
  if (typeof source === 'string') {
    return (
      source.includes('cdn.sanity.io') ||
      source.startsWith('image-')
    );
  }
  if (typeof source === 'object' && source !== null) {
    const s = source as Record<string, any>;
    return (
      s._type === 'image' ||
      s._type === 'sanity.imageAsset' ||
      typeof s._ref === 'string' ||
      (typeof s.asset === 'object' &&
        s.asset !== null &&
        (typeof s.asset._ref === 'string' ||
          typeof s.asset._id === 'string' ||
          typeof s.asset.url === 'string'))
    );
  }
  return false;
}

/**
 * Extracts native width, height, and aspect ratio from a Sanity image asset ID or CDN URL.
 */
export function getSanityImageDimensions(
  source: SanityImageSource | string | null | undefined
): SanityImageDimensions | null {
  if (!source) return null;

  let refOrUrl = '';
  if (typeof source === 'string') {
    refOrUrl = source;
  } else if (typeof source === 'object' && source !== null) {
    const s = source as Record<string, any>;
    refOrUrl = s.asset?._ref || s.asset?._id || s.asset?.url || s._ref || s._id || '';
  }

  const pattern = /-([0-9]+)x([0-9]+)(?:-|\.|$)/;
  const match = refOrUrl.match(pattern);

  if (match && match[1] && match[2]) {
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      return {
        width,
        height,
        aspectRatio: width / height,
      };
    }
  }

  return null;
}

/**
 * Builds a modern Sanity CDN image URL with focal-point hotspot cropping,
 * dimension transformations, and automatic format negotiation (WebP/AVIF).
 */
export function buildSanityImageUrl(
  source: SanityImageSource | string | null | undefined,
  options: SanityImageOptions = {}
): string {
  if (!source) return '';

  if (typeof source === 'string') {
    const trimmed = source.trim();
    if (!trimmed) return '';
    if (!isSanityImageSource(trimmed)) {
      return trimmed;
    }
  }

  try {
    let builder = urlForImage(source);

    // Automatic format negotiation
    if (options.autoFormat !== false) {
      builder = builder.auto('format');
    }

    if (options.format) {
      builder = builder.format(options.format);
    }

    if (typeof options.width === 'number' && options.width > 0) {
      builder = builder.width(Math.round(options.width));
    }

    if (typeof options.height === 'number' && options.height > 0) {
      builder = builder.height(Math.round(options.height));
    }

    if (
      typeof options.quality === 'number' &&
      options.quality > 0 &&
      options.quality <= 100
    ) {
      builder = builder.quality(options.quality);
    }

    if (typeof options.dpr === 'number' && options.dpr > 0) {
      builder = builder.dpr(options.dpr);
    }

    if (typeof options.blur === 'number' && options.blur > 0) {
      builder = builder.blur(options.blur);
    }

    // Hotspot and Crop handling:
    // If source has a custom hotspot defined or crop focalpoint is requested,
    // apply fit('crop') and crop('focalpoint') to respect focal subject.
    const sourceHasHotspot = hasHotspot(source);
    const fitMode =
      options.fit ||
      (sourceHasHotspot || options.crop === 'focalpoint' ? 'crop' : undefined);
    const cropMode =
      options.crop || (sourceHasHotspot ? 'focalpoint' : undefined);

    if (fitMode) {
      builder = builder.fit(fitMode);
    }

    if (cropMode) {
      builder = builder.crop(cropMode);
    }

    return builder.url() || '';
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[sanity-image] Failed to build image URL:', err);
    }
    return typeof source === 'string' ? source : '';
  }
}

/**
 * Generates a responsive srcset string across standard device breakpoints.
 */
export function generateSanitySrcSet(
  source: SanityImageSource | string | null | undefined,
  options: SanitySrcSetOptions = {}
): string {
  if (!source) return '';
  if (!isSanityImageSource(source)) return '';

  const widths = options.widths || DEFAULT_IMAGE_WIDTHS;
  const aspectRatio = options.aspectRatio;

  const entries = widths.map(width => {
    const height = aspectRatio ? Math.round(width / aspectRatio) : undefined;
    const url = buildSanityImageUrl(source, {
      width,
      height,
      quality: options.quality,
      fit: options.fit,
      crop: options.crop,
      format: options.format,
      autoFormat: options.autoFormat ?? true,
    });
    return `${url} ${width}w`;
  });

  return entries.join(', ');
}

/**
 * Next.js compatible image loader function for offloading resizing and optimization
 * directly to the Sanity Global Edge CDN.
 */
export function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!isSanityImageSource(src)) {
    return src;
  }
  return buildSanityImageUrl(src, {
    width,
    quality: quality || 75,
    autoFormat: true,
  });
}
