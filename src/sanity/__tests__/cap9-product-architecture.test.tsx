import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import QualityStandardsModal, {
  TypicalQualityParametersModal,
} from '@/components/common/QualityStandardsModal';
import ProductsSection from '@/components/sections/ProductsSection';
import ProductsClient from '@/app/products/ProductsClient';
import ProductDetailClient from '@/app/products/[slug]/ProductDetailClient';
import {
  COMMODITY_PORTFOLIO,
  FLAGSHIP_FEATURED_SLUGS,
} from '@/lib/api/products-portfolio';
import {
  getMockProductCatalogContent,
  getAllMockProductCatalogContent,
} from '@/lib/api/mock-data';
import type { Locale } from '@/lib/locale';
import type { ProductCatalogItem } from '@/types/content';

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

describe('CAP-9: Product Architecture Restructuring & Typical Quality Parameters', () => {
  jest.setTimeout(30000);
  let queryClient: QueryClient;
  const DASH_REGEX = /[—–]|\s-\s/;

  const renderWithProviders = (
    ui: React.ReactElement,
    initialLocale: Locale = 'en'
  ) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider initialLocale={initialLocale}>
          <QuoteRequestProvider>{ui}</QuoteRequestProvider>
        </LocaleProvider>
      </QueryClientProvider>
    );
  };

  describe('Scenario 1: Trade Terminology Parity Across UI (Zero "Quality Standards")', () => {
    const sampleProduct: ProductCatalogItem = {
      _id: 'prod-durum-wheat',
      title: 'Canadian Amber Durum Wheat (CWAD)',
      productName: 'Canadian Amber Durum Wheat (CWAD)',
      slug: 'durum-wheat',
      description: 'High vitreous kernel content durum wheat.',
      category: 'Grains & Cereals',
      sourcingOrigin: 'Saskatchewan & Alberta, Canada',
      typicalQualityParameters:
        '<p>Grade: CWAD No. 1 / No. 2. Minimum Test Weight: 80.0 kg/hL. Vitreous Kernels: Min 80%.</p>',
      displayLogistics: false,
      packagingLogistics: 'Bulk vessel loads, 50kg PP bags.',
      isFeatured: true,
      image1: '/products/durum-wheat.png',
      _owner: 'sanity',
      _createdDate: { $date: '2025-08-22T15:00:00.000Z' },
      _updatedDate: { $date: '2026-10-06T20:00:00.000Z' },
    };

    it('renders "Typical Quality Parameters" in English and ZERO occurrences of "Quality Standards"', () => {
      const { container } = renderWithProviders(
        <QualityStandardsModal
          isOpen={true}
          onClose={() => {}}
          product={sampleProduct}
        />,
        'en'
      );

      // Must display new standardized trade terminology
      expect(screen.getByText('Typical Quality Parameters')).toBeInTheDocument();

      // Official footnote disclaimer
      expect(
        screen.getByText(/Specifications are typical benchmarks/i)
      ).toBeInTheDocument();

      // Zero occurrences of legacy "Quality Standards" in user-facing DOM
      const htmlContent = container.innerHTML;
      expect(htmlContent).not.toMatch(/Quality Standards/i);
    });

    it('renders "Paramètres de qualité typiques" in French with zero em-dashes', () => {
      const { container } = renderWithProviders(
        <TypicalQualityParametersModal
          isOpen={true}
          onClose={() => {}}
          product={{
            ...sampleProduct,
            title: 'Blé dur ambré canadien (CWAD)',
            typicalQualityParameters:
              '<p>Grade : CWAD no 1 / no 2. Vitrosité minimale : 80 %.</p>',
          }}
        />,
        'fr-CA'
      );

      expect(
        screen.getByText('Paramètres de qualité typiques')
      ).toBeInTheDocument();

      // French disclaimer
      expect(
        screen.getByText(/Les spécifications sont des repères typiques/i)
      ).toBeInTheDocument();

      // Zero occurrences of Quality Standards
      const htmlContent = container.innerHTML;
      expect(htmlContent).not.toMatch(/Quality Standards/i);

      // Strict CAP-7 anti-slop mandate: No em-dashes in French text
      expect(htmlContent).not.toMatch(DASH_REGEX);
    });

    it('renders "Parámetros de calidad típicos" in Spanish with zero em-dashes', () => {
      const { container } = renderWithProviders(
        <TypicalQualityParametersModal
          isOpen={true}
          onClose={() => {}}
          product={{
            ...sampleProduct,
            title: 'Trigo duro ámbar canadiense (CWAD)',
            typicalQualityParameters:
              '<p>Grado: CWAD No. 1 / No. 2. Granos vítreos: Min 80%.</p>',
          }}
        />,
        'es'
      );

      expect(
        screen.getByText('Parámetros de calidad típicos')
      ).toBeInTheDocument();

      // Spanish disclaimer
      expect(
        screen.getByText(/Las especificaciones son puntos de referencia típicos/i)
      ).toBeInTheDocument();

      // Zero occurrences of Quality Standards
      const htmlContent = container.innerHTML;
      expect(htmlContent).not.toMatch(/Quality Standards/i);

      // Strict CAP-7 anti-slop mandate: No em-dashes in Spanish text
      expect(htmlContent).not.toMatch(DASH_REGEX);
    });
  });

  describe('Scenario 2: Homepage Featured 3x3 Grid & Anchor CTA', () => {
    it('renders exactly 9 flagship commodities on the homepage when featuredOnly is true', async () => {
      const allProducts = await getAllMockProductCatalogContent('en');

      renderWithProviders(
        <ProductsSection
          data={allProducts}
          isLoading={false}
          featuredOnly={true}
        />,
        'en'
      );

      // Verify that "View Details / Specs" action buttons are rendered
      const specButtons = screen.getAllByRole('button', {
        name: /View Details \/ Specs/i,
      });
      expect(specButtons).toHaveLength(9);

      // Verify "Request Quote" buttons are present for all 9
      const quoteButtons = screen.getAllByRole('button', {
        name: /Request Quote/i,
      });
      expect(quoteButtons).toHaveLength(9);

      // Verify that origin badges are rendered on the cards
      expect(
        screen.getAllByText(/Canada|West Africa|Saskatchewan/i).length
      ).toBeGreaterThanOrEqual(9);

      // Verify bottom anchor CTA to dedicated /products catalog
      expect(
        screen.getByText(
          /Looking for specialized grades, pulses, or specialty crops\?/i
        )
      ).toBeInTheDocument();

      const exploreBtn = screen.getByRole('button', {
        name: /Explore Full Product Catalog/i,
      });
      expect(exploreBtn).toBeInTheDocument();
      expect(exploreBtn.closest('a')).toHaveAttribute('href', '/products');
    });
  });

  describe('Scenario 3: Toggleable Export & Packaging Logistics Decoupling', () => {
    it('completely hides Export & Packaging Logistics when displayLogistics is false', () => {
      const productWithoutLogistics: ProductCatalogItem = {
        _id: 'p-no-logistics',
        title: 'Milling Wheat',
        slug: 'milling-wheat',
        description: 'Premium CWRS milling wheat.',
        category: 'Grains & Cereals',
        displayLogistics: false,
        packagingLogistics: '50kg polypropylene bags, bulk 20ft container.',
        typicalQualityParameters: '<p>Protein: Min 13.5%</p>',
        image1: '/products/milling-wheat.png',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:00:00.000Z' },
        _updatedDate: { $date: '2026-10-06T20:00:00.000Z' },
      };

      renderWithProviders(
        <QualityStandardsModal
          isOpen={true}
          onClose={() => {}}
          product={productWithoutLogistics}
        />,
        'en'
      );

      // The logistics title and content must NOT be present in DOM
      expect(
        screen.queryByText('Export & Packaging Logistics')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/50kg polypropylene bags/i)
      ).not.toBeInTheDocument();
    });

    it('cleanly renders Export & Packaging Logistics when displayLogistics is true', () => {
      const productWithLogistics: ProductCatalogItem = {
        _id: 'p-with-logistics',
        title: 'Dried Split Ginger',
        slug: 'dried-split-ginger',
        description: 'Sun-dried split ginger rhizomes.',
        category: 'Spices & Aromatics',
        displayLogistics: true,
        packagingLogistics:
          'Packed in 40kg or 50kg clean woven PP bags. Container capacity: 14 to 15 metric tons per 20ft FCL.',
        typicalQualityParameters: '<p>Moisture: Max 9.0%</p>',
        image1: '/products/dried-split-ginger.png',
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:00:00.000Z' },
        _updatedDate: { $date: '2026-10-06T20:00:00.000Z' },
      };

      renderWithProviders(
        <QualityStandardsModal
          isOpen={true}
          onClose={() => {}}
          product={productWithLogistics}
        />,
        'en'
      );

      // The logistics title and content MUST be present
      expect(
        screen.getByText('Export & Packaging Logistics')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Packed in 40kg or 50kg clean woven PP bags/i)
      ).toBeInTheDocument();
    });
  });

  describe('Scenario 4: Dedicated /products Catalog Navigation & Multi-Dimensional Filtering', () => {
    it('renders the dedicated catalog page and filters across corridors and categories', async () => {
      renderWithProviders(<ProductsClient />, 'en');

      // Check header and breadcrumbs
      expect(
        await screen.findByText('Global Agricultural Commodity Catalog')
      ).toBeInTheDocument();

      // Check trade corridor tab buttons
      const allCorridorsBtn = screen.getByRole('button', {
        name: /All Corridors/i,
      });
      const canadaBtn = screen.getByRole('button', {
        name: /Canadian Prairies & Eastern Canada/i,
      });
      const africaBtn = screen.getByRole('button', {
        name: /Tropical & West Africa/i,
      });

      expect(allCorridorsBtn).toBeInTheDocument();
      expect(canadaBtn).toBeInTheDocument();
      expect(africaBtn).toBeInTheDocument();

      // Initial count should display 46 commodities
      expect(
        await screen.findByText(/Showing 46 of 46 commodities/i)
      ).toBeInTheDocument();

      // Filter by Canadian corridor
      await act(async () => {
        fireEvent.click(canadaBtn);
      });
      expect(
        await screen.findByText(/Showing 33 of 46 commodities/i)
      ).toBeInTheDocument();

      // Filter by African corridor
      await act(async () => {
        fireEvent.click(africaBtn);
      });
      expect(
        await screen.findByText(/Showing 13 of 46 commodities/i)
      ).toBeInTheDocument();

      // Reset to all corridors
      await act(async () => {
        fireEvent.click(allCorridorsBtn);
      });
      expect(
        await screen.findByText(/Showing 46 of 46 commodities/i)
      ).toBeInTheDocument();

      // Search filtering
      const searchInput = screen.getByPlaceholderText(
        /Search commodities by name, origin, or keyword.../i
      );
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'Ginger' } });
      });

      // Should filter down to ginger commodities
      expect(
        await screen.findByText(/Showing [1-3] of 46 commodities/i)
      ).toBeInTheDocument();
    });
  });

  describe('Scenario 5: Product Detail Dossier View', () => {
    it('renders ProductDetailClient with high-res visual, parameters matrix, and related commodities', () => {
      const commodity = COMMODITY_PORTFOLIO[0];
      const productItem: ProductCatalogItem = {
        _id: commodity.id,
        title: commodity.en.title,
        productName: commodity.en.title,
        slug: commodity.slug,
        description: commodity.en.description,
        sourcingOrigin: commodity.en.origin,
        category: commodity.en.category,
        image: commodity.image,
        image1: commodity.image,
        typicalQualityParameters: commodity.en.typicalQualityParameters,
        displayLogistics: true,
        packagingLogistics:
          commodity.en.packagingLogistics || 'Bulk vessel loads, 50kg PP bags.',
        isFeatured: commodity.isFeatured,
        _owner: 'sanity',
        _createdDate: { $date: '2025-08-22T15:00:00.000Z' },
        _updatedDate: { $date: '2026-10-06T20:00:00.000Z' },
      };

      const related: ProductCatalogItem[] = [
        {
          _id: 'rel-1',
          title: 'Durum Wheat',
          slug: 'durum-wheat',
          description: 'Durum wheat description',
          category: 'Grains & Cereals',
          sourcingOrigin: 'Saskatchewan, Canada',
          image: '/products/durum-wheat.png',
          image1: '/products/durum-wheat.png',
          _owner: 'sanity',
          _createdDate: { $date: '2025-08-22T15:00:00.000Z' },
          _updatedDate: { $date: '2026-10-06T20:00:00.000Z' },
        },
      ];

      renderWithProviders(
        <ProductDetailClient
          product={productItem}
          relatedProducts={related}
        />,
        'en'
      );

      // Title & Origin
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        commodity.en.title
      );
      expect(screen.getAllByText(commodity.en.origin).length).toBeGreaterThan(0);

      // Quality parameters section
      expect(screen.getByText('Typical Quality Parameters')).toBeInTheDocument();
      expect(
        screen.getByText(/Specifications are typical benchmarks/i)
      ).toBeInTheDocument();

      // Toggleable logistics because displayLogistics: true
      expect(
        screen.getByText('Export & Packaging Logistics')
      ).toBeInTheDocument();

      // Related commodities
      expect(screen.getByText('Related Commodities')).toBeInTheDocument();
      expect(screen.getByText('Durum Wheat')).toBeInTheDocument();
    });
  });

  describe('Scenario 6: Sanity Portfolio Purity & Slugs Contract', () => {
    it('contains all 46 canonical commodities with clean slugs and zero empty fields', () => {
      expect(COMMODITY_PORTFOLIO).toHaveLength(46);

      const seenSlugs = new Set<string>();
      COMMODITY_PORTFOLIO.forEach(item => {
        // Valid slug
        expect(item.slug).toBeTruthy();
        expect(item.slug).toMatch(/^[a-z0-9-]+$/);
        expect(seenSlugs.has(item.slug)).toBe(false);
        seenSlugs.add(item.slug);

        // Multilingual titles
        expect(item.en.title).toBeTruthy();
        expect(item.fr.title).toBeTruthy();
        expect(item.esp.title).toBeTruthy();

        // Multilingual origins
        expect(item.en.origin).toBeTruthy();
        expect(item.fr.origin).toBeTruthy();
        expect(item.esp.origin).toBeTruthy();

        // Multilingual typical quality parameters
        expect(item.en.typicalQualityParameters).toBeTruthy();
        expect(item.fr.typicalQualityParameters).toBeTruthy();
        expect(item.esp.typicalQualityParameters).toBeTruthy();

        // Check for em-dashes in French and Spanish
        expect(item.fr.title).not.toMatch(DASH_REGEX);
        expect(item.esp.title).not.toMatch(DASH_REGEX);
      });
    });

    it('contains exactly 9 flagship commodities designated in FLAGSHIP_FEATURED_SLUGS', () => {
      expect(FLAGSHIP_FEATURED_SLUGS).toHaveLength(9);

      // Verify each flagship slug maps to a defined commodity
      FLAGSHIP_FEATURED_SLUGS.forEach(slug => {
        const found = COMMODITY_PORTFOLIO.find(p => p.slug === slug);
        expect(found).toBeDefined();
        expect(found?.isFeatured).toBe(true);
      });
    });
  });
});
