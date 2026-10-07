// src/components/SanityImage.tsx
'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  buildSanityImageUrl,
  isSanityImageSource,
  hasHotspot,
  type SanityImageSource,
  type SanityImageFitMode,
  type SanityImageCropMode,
} from '@/lib/api/sanity-image';
import { convertWixImageUrl } from '@/lib/utils/image';

export interface SanityImageProps {
  src: SanityImageSource | string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholderColor?: string;
  quality?: number;
  fit?: SanityImageFitMode;
  crop?: SanityImageCropMode;
  autoFormat?: boolean;
  unoptimized?: boolean;
  onLoadSuccess?: (url: string) => void;
  onLoadError?: (error: string) => void;
}

export default function SanityImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  fill = false,
  style,
  sizes,
  loading = 'lazy',
  priority = false,
  placeholderColor = 'bg-gradient-to-br from-green-50 to-emerald-50',
  quality,
  fit,
  crop,
  autoFormat = true,
  unoptimized,
  onLoadSuccess,
  onLoadError,
}: SanityImageProps) {
  // Resolve image URL from Sanity image source, legacy Wix URL, or standard web URL
  const resolvedUrl = useMemo(() => {
    if (!src) return '';

    // 1. Sanity image source (object, asset reference, or cdn.sanity.io URL)
    if (isSanityImageSource(src)) {
      const isHotspot = hasHotspot(src);
      return buildSanityImageUrl(src, {
        width: fill ? undefined : width,
        height: fill ? undefined : height,
        quality,
        fit: fit || (isHotspot ? 'crop' : undefined),
        crop: crop || (isHotspot ? 'focalpoint' : undefined),
        autoFormat,
      });
    }

    // 2. String URL processing
    if (typeof src === 'string') {
      const trimmed = src.trim();
      if (!trimmed) return '';

      // Legacy Wix image URI: convert gracefully for backwards compatibility
      if (trimmed.startsWith('wix:image://')) {
        const converted = convertWixImageUrl(trimmed);
        return converted?.primary || '';
      }

      // Standard HTTP/HTTPS or local relative URL
      return trimmed;
    }

    return '';
  }, [src, width, height, fill, quality, fit, crop, autoFormat]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);

  useEffect(() => {
    if (!resolvedUrl) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setShowImage(false);
  }, [resolvedUrl]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setShowImage(true);
    onLoadSuccess?.(resolvedUrl);
  }, [resolvedUrl, onLoadSuccess]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onLoadError?.(`Failed to load image: ${resolvedUrl}`);
  }, [resolvedUrl, onLoadError]);

  if (hasError || !resolvedUrl) {
    return (
      <div
        className={`flex items-center justify-center ${placeholderColor} ${className || ''}`}
        style={{
          width: fill ? undefined : width,
          height: fill ? undefined : height,
          ...style,
        }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <div className="text-center text-gray-400 p-4">
          <p className="text-sm font-medium opacity-75">Image unavailable</p>
        </div>
      </div>
    );
  }

  const aspectRatio = width / height;
  const containerClasses = `relative ${className || ''}`;
  const containerStyle: React.CSSProperties = fill
    ? { position: 'relative', width: '100%', height: '100%', ...style }
    : { position: 'relative', ...style };

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Background placeholder during image loading */}
      <div
        className={`absolute inset-0 z-0 ${placeholderColor} rounded-lg ${
          isLoading ? 'animate-pulse' : ''
        }`}
        style={{
          opacity: showImage ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          ...style,
        }}
        aria-hidden="true"
      />

      <Image
        src={resolvedUrl}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${
          showImage ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500 ease-in-out ${
          fill ? 'object-cover' : ''
        } ${className || ''}`}
        fill={fill}
        loading={priority ? undefined : loading}
        priority={priority}
        unoptimized={unoptimized}
        sizes={
          sizes ||
          (fill
            ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            : undefined)
        }
        style={
          fill
            ? { objectFit: 'cover', width: '100%', height: '100%', ...style }
            : {
                width: '100%',
                height: 'auto',
                aspectRatio: `${aspectRatio}`,
                ...style,
              }
        }
      />
    </div>
  );
}
