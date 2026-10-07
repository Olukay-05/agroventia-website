// src/sanity/__tests__/asset-pipeline.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import nextConfig from '../../../next.config';
import {
  urlForImage,
  buildSanityImageUrl,
  generateSanitySrcSet,
  getSanityImageDimensions,
  isSanityImageSource,
  hasHotspot,
  sanityImageLoader,
  DEFAULT_IMAGE_WIDTHS,
} from '@/lib/api/sanity-image';
import SanityImage from '@/components/SanityImage';
import { isImageUrl, isImageField, getImageUrl } from '@/lib/utils/image';

describe('Story 4: Modern Asset Pipeline Integration', () => {
  const mockAssetRef =
    'image-728b7e2e88cb98fae6a6df247ee0ca3f0a5ad744-1200x800-jpg';
  const mockCdnUrl =
    'https://cdn.sanity.io/images/343j74om/production/728b7e2e88cb98fae6a6df247ee0ca3f0a5ad744-1200x800.jpg';

  const mockImageWithHotspot = {
    _type: 'image',
    asset: {
      _ref: mockAssetRef,
      _type: 'reference',
    },
    hotspot: {
      x: 0.35,
      y: 0.65,
      height: 0.4,
      width: 0.4,
    },
    crop: {
      top: 0.05,
      bottom: 0.05,
      left: 0.05,
      right: 0.05,
    },
  };

  describe('AC 1: Sanity image URL builder configuration', () => {
    it('generates a valid HTTPS cdn.sanity.io URL from an asset reference with auto=format', () => {
      const url = buildSanityImageUrl(mockAssetRef);
      expect(url).toContain('https://cdn.sanity.io/images/');
      expect(url).toContain('auto=format');
      expect(url).toContain('728b7e2e88cb98fae6a6df247ee0ca3f0a5ad744-1200x800.jpg');
    });

    it('generates URL with configurable width, height, and quality parameters', () => {
      const url = buildSanityImageUrl(mockAssetRef, {
        width: 800,
        height: 600,
        quality: 85,
      });

      expect(url).toContain('w=800');
      expect(url).toContain('h=600');
      expect(url).toContain('q=85');
      expect(url).toContain('auto=format');
    });

    it('supports explicit format overrides (webp, png)', () => {
      const webpUrl = buildSanityImageUrl(mockAssetRef, { format: 'webp' });
      const pngUrl = buildSanityImageUrl(mockAssetRef, { format: 'png' });

      // When format is explicit, Sanity image builder includes fm=
      expect(webpUrl).toContain('fm=webp');
      expect(pngUrl).toContain('fm=png');
    });

    it('returns empty string gracefully for null, undefined, or empty source', () => {
      expect(buildSanityImageUrl(null)).toBe('');
      expect(buildSanityImageUrl(undefined)).toBe('');
      expect(buildSanityImageUrl('')).toBe('');
      expect(buildSanityImageUrl('   ')).toBe('');
    });

    it('preserves non-Sanity external HTTPS URLs as-is', () => {
      const external = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b';
      expect(buildSanityImageUrl(external)).toBe(external);
    });

    it('exposes urlForImage builder for custom fluent chained transformations', () => {
      const builder = urlForImage(mockAssetRef);
      const url = builder.width(500).height(300).blur(10).url();
      expect(url).toContain('w=500');
      expect(url).toContain('h=300');
      expect(url).toContain('blur=10');
    });
  });

  describe('AC 2: Hotspot cropping respects focal point', () => {
    it('detects hotspot presence via hasHotspot helper', () => {
      expect(hasHotspot(mockImageWithHotspot)).toBe(true);
      expect(hasHotspot({ hotspot: { x: 0.5, y: 0.5 } })).toBe(true);
      expect(hasHotspot({ crop: { top: 0.1 } })).toBe(true);
      expect(hasHotspot({ asset: { _ref: mockAssetRef } })).toBe(false);
      expect(hasHotspot(null)).toBe(false);
      expect(hasHotspot(mockCdnUrl)).toBe(false);
    });

    it('includes fit=crop and crop=focalpoint when source contains a custom hotspot', () => {
      const url = buildSanityImageUrl(mockImageWithHotspot, {
        width: 600,
        height: 400,
      });

      expect(url).toContain('fit=crop');
      expect(url).toContain('crop=focalpoint');
      expect(url).toContain('w=600');
      expect(url).toContain('h=400');
      expect(url).toContain('auto=format');
    });

    it('preserves focal-point crop parameters across different aspect ratios', () => {
      // 16:9 banner
      const bannerUrl = buildSanityImageUrl(mockImageWithHotspot, {
        width: 1600,
        height: 900,
      });
      expect(bannerUrl).toContain('fit=crop');
      expect(bannerUrl).toContain('crop=focalpoint');

      // 1:1 square thumbnail
      const squareUrl = buildSanityImageUrl(mockImageWithHotspot, {
        width: 500,
        height: 500,
      });
      expect(squareUrl).toContain('fit=crop');
      expect(squareUrl).toContain('crop=focalpoint');

      // 4:3 catalog card
      const cardUrl = buildSanityImageUrl(mockImageWithHotspot, {
        width: 800,
        height: 600,
      });
      expect(cardUrl).toContain('fit=crop');
      expect(cardUrl).toContain('crop=focalpoint');
    });

    it('allows specifying custom crop modes like center or top', () => {
      const customUrl = buildSanityImageUrl(mockAssetRef, {
        width: 400,
        height: 300,
        fit: 'crop',
        crop: 'center',
      });
      expect(customUrl).toContain('crop=center');
    });
  });

  describe('AC 3: Next.js image domain configuration', () => {
    it('whitelists cdn.sanity.io in next.config.ts remotePatterns with HTTPS protocol', () => {
      const remotePatterns = nextConfig.images?.remotePatterns || [];
      const sanityPattern = remotePatterns.find(
        (p: any) => p.hostname === 'cdn.sanity.io'
      );

      expect(sanityPattern).toBeDefined();
      expect(sanityPattern?.protocol).toBe('https');
      expect(sanityPattern?.pathname).toBe('/**');
    });

    it('configures modern next/image formats (image/avif, image/webp)', () => {
      const formats = nextConfig.images?.formats || [];
      expect(formats).toContain('image/avif');
      expect(formats).toContain('image/webp');
    });

    it('confirms retirement of legacy media domains from remotePatterns', () => {
      const remotePatterns = nextConfig.images?.remotePatterns || [];
      const hosts = remotePatterns.map((p: any) => p.hostname);
      expect(hosts).toEqual(['cdn.sanity.io', 'images.unsplash.com']);
    });
  });

  describe('AC 4: Elimination of proprietary URI parsing and 403 failures', () => {
    it('identifies Sanity image sources via isSanityImageSource', () => {
      expect(isSanityImageSource(mockImageWithHotspot)).toBe(true);
      expect(isSanityImageSource({ _ref: mockAssetRef })).toBe(true);
      expect(isSanityImageSource(mockAssetRef)).toBe(true);
      expect(isSanityImageSource(mockCdnUrl)).toBe(true);
      expect(isSanityImageSource('legacy-proto://v1/test.jpg')).toBe(false);
      expect(isSanityImageSource('https://images.unsplash.com/test.jpg')).toBe(false);
      expect(isSanityImageSource(null)).toBe(false);
    });

    it('builds Sanity CDN URL directly', () => {
      const url = buildSanityImageUrl(mockImageWithHotspot);
      expect(url.startsWith('https://cdn.sanity.io/')).toBe(true);
      expect(url).toContain('cdn.sanity.io');
    });

    it('resolves image URLs cleanly through getImageUrl using Sanity pipeline', () => {
      const resolved = getImageUrl(mockCdnUrl);
      expect(resolved).toContain('728b7e2e88cb98fae6a6df247ee0ca3f0a5ad744-1200x800.jpg');
      expect(resolved).toContain('cdn.sanity.io');

      const fallback = getImageUrl(null, 'https://example.com/fallback.jpg');
      expect(fallback).toBe('https://example.com/fallback.jpg');
    });

    it('recognizes cdn.sanity.io as a valid image URL in image utils', () => {
      expect(isImageUrl(mockCdnUrl)).toBe(true);
      expect(isImageField('productImage', mockImageWithHotspot)).toBe(true);
      expect(isImageField('backgroundImage', mockCdnUrl)).toBe(true);
    });
  });

  describe('AC 5: Responsive srcset and layout preservation', () => {
    it('generates standard responsive srcset strings with widths and auto=format', () => {
      const srcset = generateSanitySrcSet(mockAssetRef, {
        widths: [320, 640, 1024],
      });

      expect(srcset).toContain('320w');
      expect(srcset).toContain('640w');
      expect(srcset).toContain('1024w');
      expect(srcset).toContain('auto=format');
      expect(srcset.split(', ')).toHaveLength(3);
    });

    it('uses DEFAULT_IMAGE_WIDTHS breakpoints when widths are omitted', () => {
      const srcset = generateSanitySrcSet(mockAssetRef);
      expect(DEFAULT_IMAGE_WIDTHS).toEqual([
        320, 480, 640, 768, 1024, 1280, 1536, 1920,
      ]);
      DEFAULT_IMAGE_WIDTHS.forEach(w => {
        expect(srcset).toContain(`${w}w`);
      });
    });

    it('calculates proportional heights in srcset when aspectRatio is provided', () => {
      const srcset = generateSanitySrcSet(mockAssetRef, {
        widths: [600],
        aspectRatio: 1.5, // 600 / 1.5 = 400
      });

      expect(srcset).toContain('w=600');
      expect(srcset).toContain('h=400');
    });

    it('extracts width, height, and aspect ratio from Sanity asset IDs and CDN URLs', () => {
      const fromRef = getSanityImageDimensions(mockAssetRef);
      expect(fromRef).toEqual({
        width: 1200,
        height: 800,
        aspectRatio: 1.5,
      });

      const fromUrl = getSanityImageDimensions(mockCdnUrl);
      expect(fromUrl).toEqual({
        width: 1200,
        height: 800,
        aspectRatio: 1.5,
      });

      const fromObject = getSanityImageDimensions(mockImageWithHotspot);
      expect(fromObject).toEqual({
        width: 1200,
        height: 800,
        aspectRatio: 1.5,
      });

      expect(getSanityImageDimensions('invalid-string')).toBeNull();
      expect(getSanityImageDimensions(null)).toBeNull();
    });

    it('provides Next.js compatible sanityImageLoader', () => {
      const loaded = sanityImageLoader({
        src: mockCdnUrl,
        width: 640,
        quality: 80,
      });

      expect(loaded).toContain('cdn.sanity.io');
      expect(loaded).toContain('w=640');
      expect(loaded).toContain('q=80');
      expect(loaded).toContain('auto=format');
    });

    it('renders SanityImage with fill layout and preserves container classes', () => {
      const { container } = render(
        <SanityImage
          src={mockImageWithHotspot}
          alt="Hero Banner"
          fill={true}
          className="object-cover custom-hero-banner"
          priority={true}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('relative');
      expect(wrapper.className).toContain('custom-hero-banner');

      const img = screen.getByRole('img', { name: /hero banner/i });
      expect(img).toBeInTheDocument();
      const srcAttr = decodeURIComponent(img.getAttribute('src') || '');
      expect(srcAttr).toContain('cdn.sanity.io');
      expect(srcAttr).toContain('fit=crop');
      expect(srcAttr).toContain('crop=focalpoint');
    });

    it('renders SanityImage drop-in component with exact prop and layout parity', () => {
      const { container } = render(
        <SanityImage
          src={mockCdnUrl}
          alt="Product Card"
          width={400}
          height={300}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('relative');
      expect(wrapper.className).toContain('w-full');

      const img = screen.getByRole('img', { name: /product card/i });
      expect(img).toBeInTheDocument();
      const srcAttr = decodeURIComponent(img.getAttribute('src') || '');
      expect(srcAttr).toContain('cdn.sanity.io');
      expect(srcAttr).toContain('w=400');
      expect(srcAttr).toContain('h=300');
    });

    it('renders graceful error placeholder without throw on invalid or empty image source', () => {
      render(
        <SanityImage
          src=""
          alt="Missing Product"
          width={400}
          height={300}
        />
      );

      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });
});
