// components/WixImage.tsx
'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { convertWixImageUrl, type WixImageUrlResult } from '@/lib/utils/image';

interface WixImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onLoadSuccess?: (url: string) => void;
  onLoadError?: (error: string) => void;
  // New props for responsive behavior
  fill?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  // Lazy loading props
  loading?: 'lazy' | 'eager';
  placeholderColor?: string;
}

export default function WixImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  onLoadSuccess,
  onLoadError,
  fill = false,
  style,
  sizes,
  loading = 'lazy',
  placeholderColor = 'bg-gradient-to-br from-green-50 to-emerald-50',
}: WixImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || '');
  const [urlData, setUrlData] = useState<WixImageUrlResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);

  // Initialize URL conversion - only when src changes
  useEffect(() => {
    if (!src || src.trim() === '') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Log when we're processing a new image
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Processing image: ${src}`);
    }

    const converted = convertWixImageUrl(src);
    if (converted) {
      setUrlData(converted);
      setCurrentSrc(converted.primary);
      setCurrentIndex(0);
    } else {
      setCurrentSrc(src);
      setUrlData(null);
    }
    // Reset loading states when src changes
    setIsLoading(true);
    setHasError(false);
    setShowImage(false);
  }, [src]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setShowImage(true);
    }, 50);
    onLoadSuccess?.(currentSrc);

    // Log successful loading in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Image loaded successfully: ${currentSrc}`);
    }
  }, [currentSrc, onLoadSuccess]);

  const handleImageError = useCallback(() => {
    if (urlData && currentIndex < urlData.alternatives.length) {
      // Try next alternative URL
      const nextUrl = urlData.alternatives[currentIndex];

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `🔄 Trying alternative URL (${currentIndex + 1}/${urlData.alternatives.length + 1}): ${nextUrl}`
        );
      }

      setCurrentIndex(prev => prev + 1);
      setCurrentSrc(nextUrl);
    } else {
      // All URLs failed
      console.warn(
        `Failed to load image after ${
          (urlData?.alternatives.length || 0) + 1
        } attempts: ${urlData?.original}`
      );

      // Set error state after a delay to allow for slower loading
      setTimeout(() => {
        setHasError(true);
        setIsLoading(false);
        onLoadError?.(
          `Failed to load image after ${
            (urlData?.alternatives.length || 0) + 1
          } attempts`
        );
      }, 1000);
    }
  }, [urlData, currentIndex, onLoadError]);

  if (hasError) {
    // Even in error state, try to show a basic image if we have a valid URL
    return (
      <div
        className={`flex items-center justify-center ${placeholderColor} ${className || ''}`}
        style={{
          width: fill ? undefined : width,
          height: fill ? undefined : height,
          ...style,
        }}
      >
        <div className="text-center text-gray-400 p-4">
          <p className="text-sm font-medium opacity-75">Image unavailable</p>
          {process.env.NODE_ENV === 'development' && (
            <>
              <p className="text-xs mt-1 opacity-50">
                Tried {(urlData?.alternatives.length || 0) + 1} URL(s)
              </p>
              <p className="text-xs mt-2 font-mono text-gray-400 break-all opacity-50">
                Original: {urlData?.original}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Don't render Image component if src is empty or invalid
  if (!currentSrc || currentSrc.trim() === '') {
    return (
      <div
        className={`flex items-center justify-center ${placeholderColor} ${className || ''}`}
        style={{
          width: fill ? undefined : width,
          height: fill ? undefined : height,
          ...style,
        }}
      >
        <div className="text-center text-gray-500 p-4">
          <p className="text-sm font-medium">No image source</p>
        </div>
      </div>
    );
  }

  // Calculate aspect ratio for proper sizing
  const aspectRatio = width / height;

  // Ensure proper styling for fill mode
  const containerClasses = `relative ${className || ''}`;
  const containerStyle: React.CSSProperties = fill
    ? { position: 'relative', width: '100%', height: '100%', ...style }
    : { position: 'relative', ...style };

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Placeholder with shimmer effect */}
      <div
        className={`absolute inset-0 z-0 ${placeholderColor} rounded-lg ${isLoading ? 'animate-pulse' : ''}`}
        style={{
          opacity: showImage ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          ...style,
        }}
      />

      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${showImage ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 ease-in-out ${fill ? 'object-cover' : ''} ${className || ''}`}
        unoptimized // Disable Next.js optimization for external URLs
        fill={fill}
        loading={loading}
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

      {/* Debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
          <div>
            Attempt: {currentIndex + 1}/
            {(urlData?.alternatives.length || 0) + 1}
          </div>
          <div className="truncate">URL: {currentSrc}</div>
        </div>
      )}
    </div>
  );
}
