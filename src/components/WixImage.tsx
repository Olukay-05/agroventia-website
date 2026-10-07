// components/WixImage.tsx
'use client';

import SanityImage, { type SanityImageProps } from './SanityImage';

export type WixImageProps = SanityImageProps;

/**
 * WixImage Component — Modern Asset Pipeline Adapter.
 *
 * Provides a drop-in backwards-compatible interface for existing sections
 * (Hero, Products, SectionContainer) while routing all asset requests through
 * the modern Sanity CDN pipeline (@sanity/image-url, focal-point hotspot cropping,
 * Next.js WebP/AVIF optimization) and eliminating legacy 403 retry arrays.
 */
export default function WixImage(props: WixImageProps) {
  return <SanityImage {...props} />;
}
