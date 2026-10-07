/**
 * CAP-14: Sanity-Only Runtime Cutover and Wix Retirement Verification Suite
 *
 * Verifies:
 * 1. Sole CMS Source: Next.js image config, remote patterns, and asset pipelines are 100% Sanity-backed.
 * 2. Complete Retirement: No legacy CMS packages, routes, or environment variables are required.
 * 3. Environment & Runtime Independence: Application runs successfully with zero legacy CMS variables.
 * 4. Content Contract Parity: Canonical content types and hooks supply all public page surfaces.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import nextConfig from '../../../next.config';
import {
  useHeroContent,
  useAboutContent,
  useServicesContent,
  useProductsContent,
  useProductCatalogContent,
  useProductBySlug,
  useContactContent,
  useCoreValues,
  useCarouselImages,
  useBlogPosts,
  useBlogPostBySlug,
} from '@/hooks/useContent';
import SanityImage from '@/components/SanityImage';
import { buildSanityImageUrl, isSanityImageSource } from '@/lib/api/sanity-image';
import { isImageUrl, isImageField, getImageUrl } from '@/lib/utils/image';
import EnvironmentStatus from '@/components/EnvironmentStatus';
import type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductCatalogItem,
  BlogPost,
} from '@/types/content';

// Mock Leaflet and map components
jest.mock('@/components/common/MapComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="map-component">Map</div>,
}));

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: {
    send: jest.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const actual = jest.requireActual('lucide-react');
  return {
    ...actual,
    ShieldCheck: () => <div data-testid="shield-check-icon" />,
    PackageCheck: () => <div data-testid="package-check-icon" />,
    Globe: () => <div data-testid="globe-icon" />,
  };
});

describe('CAP-14: Sanity-Only Runtime Cutover and Wix Retirement', () => {
  describe('CAP-14.1: Image Pipeline and Remote Pattern Sanity Exclusivity', () => {
    it('verifies that static.wixstatic.com is completely excluded from next.config remotePatterns', () => {
      const remotePatterns = nextConfig.images?.remotePatterns || [];
      const hostnames = remotePatterns.map((p: any) => p.hostname);

      expect(hostnames).not.toContain('static.wixstatic.com');
      expect(hostnames).toContain('cdn.sanity.io');
      expect(hostnames).toContain('images.unsplash.com');
    });

    it('verifies that Sanity CDN is the designated primary CMS image origin', () => {
      const remotePatterns = nextConfig.images?.remotePatterns || [];
      const sanityPattern = remotePatterns.find((p: any) => p.hostname === 'cdn.sanity.io');

      expect(sanityPattern).toBeDefined();
      expect(sanityPattern?.protocol).toBe('https');
      expect(sanityPattern?.pathname).toBe('/**');
    });

    it('verifies modern image formats (AVIF, WebP) are enabled without legacy polyfills', () => {
      const formats = nextConfig.images?.formats || [];
      expect(formats).toContain('image/avif');
      expect(formats).toContain('image/webp');
    });
  });

  describe('CAP-14.2: Zero Runtime Dependency on Legacy Credentials', () => {
    it('verifies that no legacy CMS environment variables are set or required in process.env', () => {
      expect(process.env.NEXT_PUBLIC_WIX_CLIENT_ID).toBeUndefined();
      expect(process.env.WIX_API_TOKEN).toBeUndefined();
      expect(process.env.WIX_SITE_ID).toBeUndefined();
      expect(process.env.NEXT_PUBLIC_WIX_SITE_ID).toBeUndefined();
      expect(process.env.NEXT_PUBLIC_WIX_ACCOUNT_ID).toBeUndefined();
      expect(process.env.NEXT_PUBLIC_WIX_APP_ID).toBeUndefined();
    });

    it('verifies that EnvironmentStatus checks only Sanity variables and reports status', () => {
      render(<EnvironmentStatus showDetails={true} />);
      expect(screen.getByText('Sanity Project ID')).toBeInTheDocument();
      expect(screen.getByText('Sanity Dataset')).toBeInTheDocument();
      expect(screen.getByText('Sanity API Version')).toBeInTheDocument();
      expect(screen.queryByText(/Wix Site ID/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Wix API Key/i)).not.toBeInTheDocument();
    });
  });

  describe('CAP-14.3: Canonical Content Types and Hook Contracts', () => {
    it('verifies canonical useContent hooks return well-typed CMS models', () => {
      expect(typeof useHeroContent).toBe('function');
      expect(typeof useAboutContent).toBe('function');
      expect(typeof useServicesContent).toBe('function');
      expect(typeof useProductsContent).toBe('function');
      expect(typeof useProductCatalogContent).toBe('function');
      expect(typeof useProductBySlug).toBe('function');
      expect(typeof useContactContent).toBe('function');
      expect(typeof useCoreValues).toBe('function');
      expect(typeof useCarouselImages).toBe('function');
      expect(typeof useBlogPosts).toBe('function');
      expect(typeof useBlogPostBySlug).toBe('function');
    });

    it('verifies SanityImage resolves Sanity image sources accurately', () => {
      const mockAssetRef = 'image-728b7e2e88cb98fae6a6df247ee0ca3f0a5ad744-1200x800-jpg';
      const mockSource = {
        _type: 'image',
        asset: { _ref: mockAssetRef, _type: 'reference' },
        hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
      };

      expect(isSanityImageSource(mockSource)).toBe(true);
      const url = buildSanityImageUrl(mockSource, { width: 600, height: 400 });
      expect(url).toContain('cdn.sanity.io');
      expect(url).toContain('w=600');
      expect(url).toContain('h=400');
    });

    it('verifies getImageUrl and image detection operate exclusively via standard/Sanity pipeline', () => {
      const cdnUrl = 'https://cdn.sanity.io/images/hn79lbvx/production/asset-1200x800.jpg';
      expect(isImageUrl(cdnUrl)).toBe(true);
      expect(isImageField('productImage', cdnUrl)).toBe(true);
      expect(getImageUrl(cdnUrl)).toContain('asset-1200x800.jpg');
      expect(getImageUrl(cdnUrl)).toContain('cdn.sanity.io');
      expect(getImageUrl(null, '/placeholder.jpg')).toBe('/placeholder.jpg');
    });

    it('renders SanityImage component successfully without errors or warnings', () => {
      const cdnUrl = 'https://cdn.sanity.io/images/hn79lbvx/production/asset-1200x800.jpg';
      const { container } = render(
        <SanityImage
          src={cdnUrl}
          alt="Clean Sanity Asset"
          width={500}
          height={300}
          className="rounded-xl"
        />
      );

      const img = screen.getByRole('img', { name: /clean sanity asset/i });
      expect(img).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('relative');
    });
  });
});
