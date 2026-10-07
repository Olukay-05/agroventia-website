import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import QualityStandardsModal from '@/components/common/QualityStandardsModal';
import ProductsSection from '@/components/sections/ProductsSection';
import ProductsClient from '@/app/products/ProductsClient';
import ProductDetailClient from '@/app/products/[slug]/ProductDetailClient';
import {
  COMMODITY_PORTFOLIO,
  FLAGSHIP_FEATURED_SLUGS,
} from '@/lib/api/products-portfolio';
import { getAllMockProductCatalogContent } from '@/lib/api/mock-data';
import type { ProductCatalogItem } from '@/types/wix';

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

describe('CAP-11: UI/UX Layout Finishing, Design Polish & Component Modernization', () => {
  jest.setTimeout(30000);
  let queryClient: QueryClient;

  const renderWithProviders = (
    ui: React.ReactElement,
    initialLocale: string = 'en'
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

  describe('Scenario 1: Homepage 3x3 Responsive Grid & Section Rhythm', () => {
    it('renders exactly 9 flagship commodities in a 3x3 grid layout with tracked eyebrow and anchor CTA', async () => {
      const allProducts = await getAllMockProductCatalogContent('en');

      const { container } = renderWithProviders(
        <ProductsSection
          data={allProducts}
          isLoading={false}
          featuredOnly={true}
        />,
        'en'
      );

      // 1. Eyebrow & Headline Rhythm
      expect(
        screen.getByText('GLOBAL ORIGINATION PORTFOLIO')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Featured Commodities & Trade Origins')
      ).toBeInTheDocument();

      // 2. Responsive 3x3 Grid Container (md:grid-cols-2 lg:grid-cols-3)
      const gridContainer = container.querySelector(
        '.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
      );
      expect(gridContainer).toBeInTheDocument();

      // 3. Exactly 9 commodity cards
      const specButtons = screen.getAllByRole('button', {
        name: /View Details \/ Specs/i,
      });
      expect(specButtons).toHaveLength(9);

      const quoteButtons = screen.getAllByRole('button', {
        name: /Request Quote/i,
      });
      expect(quoteButtons).toHaveLength(9);

      // 4. White studio cutout canvas containers on all cards
      const imageContainers = container.querySelectorAll('.bg-white.relative.aspect-\\[4\\/3\\]');
      expect(imageContainers.length).toBeGreaterThanOrEqual(9);

      // 5. Origin badges with corridor symbols (🍁 for Canadian Prairies, 🌍 for West Africa)
      expect(screen.getAllByText(/🍁/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Canada|West Africa|Saskatchewan/i).length).toBeGreaterThanOrEqual(9);

      // 6. Bottom Banner with 43+ commodities anchor CTA
      expect(
        screen.getByText(/Explore Full Product Catalog \(43\+ Commodities\) →/i)
      ).toBeInTheDocument();
    });

    it('renders French and Spanish localized eyebrows and headlines cleanly', async () => {
      const allProducts = await getAllMockProductCatalogContent('fr');

      renderWithProviders(
        <ProductsSection
          data={allProducts}
          isLoading={false}
          featuredOnly={true}
        />,
        'fr-CA'
      );

      expect(
        screen.getByText('PORTEFEUILLE MONDIAL D’ORIGINATION')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Commodités phares et origines commerciales')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Explorer le catalogue complet \(43\+ commodités\) →/i)
      ).toBeInTheDocument();
    });
  });

  describe('Scenario 2: Dedicated /products Catalog Toolbar & Active Filter Chips', () => {
    it('renders sticky toolbar, corridor counts, and allows interactive category pill switching', async () => {
      renderWithProviders(<ProductsClient />, 'en');

      // 1. Dynamic Corridor Count Badges
      expect(await screen.findByText('46')).toBeInTheDocument(); // All origins count
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

      // 2. Category Filter Pills Row (horizontal scrolling on mobile)
      const grainsPill = screen.getByRole('button', { name: /^Grains & Cereals$/i });
      expect(grainsPill).toBeInTheDocument();

      // Click category pill
      fireEvent.click(grainsPill);

      // 3. Active filter chips rendered with remove button
      expect(screen.getByText(/Category: Grains & Cereals/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Remove category filter/i })).toBeInTheDocument();

      // 4. One-click "Clear All Filters" button
      const clearAllBtn = screen.getByRole('button', { name: /Clear All Filters/i });
      expect(clearAllBtn).toBeInTheDocument();
      fireEvent.click(clearAllBtn);

      // Filters reset back to full catalog
      expect(
        await screen.findByText(/Showing 46 of 46 commodities/i)
      ).toBeInTheDocument();
    });

    it('renders vector empty state and reset button when search finds zero matches', async () => {
      renderWithProviders(<ProductsClient />, 'en');

      const searchInput = screen.getByPlaceholderText(
        /Search commodities by name, origin, or keyword.../i
      );
      fireEvent.change(searchInput, { target: { value: 'NonExistentCommodityXYZ' } });

      // Empty state vector graphic and message
      expect(await screen.findByText('No Commodities Found')).toBeInTheDocument();
      expect(
        screen.getByText(/No commodities found matching your current filter criteria/i)
      ).toBeInTheDocument();

      // Reset button resets query
      const resetBtns = screen.getAllByRole('button', { name: /Reset Filters/i });
      fireEvent.click(resetBtns[0]);

      expect(
        await screen.findByText(/Showing 46 of 46 commodities/i)
      ).toBeInTheDocument();
    });
  });

  describe('Scenario 3: Quick-View Modal Desktop Split & Sticky Mobile CTA', () => {
    const sampleProduct: ProductCatalogItem = {
      _id: 'prod-red-lentils',
      title: 'Canadian Crimson Red Lentils',
      productName: 'Canadian Crimson Red Lentils',
      slug: 'red-lentils',
      category: 'Pulses & Legumes',
      sourcingOrigin: 'Saskatchewan, Canada',
      description: 'Split or whole red lentils with bright orange-red cotyledon.',
      typicalQualityParameters: '<p>Moisture: Max 14.0%. Purity: Min 99.5%.</p>',
      displayLogistics: true,
      packagingLogistics: 'Packed in 25kg or 50kg PP bags.',
      isFeatured: true,
    };

    it('renders 2-column desktop split, pure white image canvas, and sticky action bar', () => {
      const handleRequestQuote = jest.fn();
      const handleClose = jest.fn();

      renderWithProviders(
        <QualityStandardsModal
          isOpen={true}
          onClose={handleClose}
          product={sampleProduct}
          onRequestQuote={handleRequestQuote}
        />,
        'en'
      );

      // Radix Dialog mounts to document.body portal
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // 1. Two-column layout on desktop (md:grid-cols-12)
      const splitGrid = dialog.querySelector('.md\\:grid-cols-12');
      expect(splitGrid).toBeInTheDocument();

      // 2. Pure white background container on modal image
      const modalCanvas = dialog.querySelector('.bg-white.relative.aspect-\\[4\\/3\\]') || dialog.querySelector('.bg-white');
      expect(modalCanvas).toBeInTheDocument();

      // 3. Parameters dossier with ShieldCheck icon
      expect(screen.getByText('Typical Quality Parameters')).toBeInTheDocument();
      expect(
        screen.getByText(/Specifications are typical benchmarks/i)
      ).toBeInTheDocument();

      // 4. Toggleable logistics
      expect(screen.getByText('Export & Packaging Logistics')).toBeInTheDocument();

      // 5. Sticky action bar with "Request Custom Quote" and "View Full Spec Page"
      const quoteBtn = screen.getByRole('button', { name: /Request Custom Quote/i });
      expect(quoteBtn).toBeInTheDocument();

      const specPageLink = screen.getByRole('link', { name: /View Full Spec Page/i });
      expect(specPageLink).toHaveAttribute('href', '/products/red-lentils');

      // Click Quote button
      fireEvent.click(quoteBtn);
      expect(handleRequestQuote).toHaveBeenCalledWith('Canadian Crimson Red Lentils');
    });
  });

  describe('Scenario 4: Dedicated Product Detail Page (/products/[slug])', () => {
    it('renders category in breadcrumbs, corridor context dossier, and related commodities grid', () => {
      const commodity = COMMODITY_PORTFOLIO[0];
      const productItem: ProductCatalogItem = {
        _id: commodity.id,
        title: commodity.en.title,
        slug: commodity.slug,
        description: commodity.en.description,
        sourcingOrigin: commodity.en.origin,
        category: commodity.en.category,
        image: commodity.image,
        typicalQualityParameters: commodity.en.typicalQualityParameters,
        displayLogistics: true,
        packagingLogistics: commodity.en.packagingLogistics || '50kg PP bags.',
        isFeatured: true,
      };

      const related: ProductCatalogItem[] = [
        {
          _id: 'rel-green-lentils',
          title: 'Large Green Lentils (Laird)',
          slug: 'green-lentils',
          category: 'Pulses & Legumes',
          sourcingOrigin: 'Saskatchewan, Canada',
          image: '/products/green-lentils.png',
          description: 'Uniform large calibrated green lentils.',
        },
        {
          _id: 'rel-yellow-peas',
          title: 'Yellow Field Peas',
          slug: 'yellow-peas',
          category: 'Pulses & Legumes',
          sourcingOrigin: 'Alberta, Canada',
          image: '/products/yellow-peas.png',
          description: 'Grade 1 yellow peas for milling and fractionation.',
        },
      ];

      renderWithProviders(
        <ProductDetailClient product={productItem} relatedProducts={related} />,
        'en'
      );

      // 1. Breadcrumbs includes category
      const breadcrumbNav = screen.getByRole('navigation', { name: /Breadcrumb/i });
      expect(breadcrumbNav).toHaveTextContent(commodity.en.category);
      expect(breadcrumbNav).toHaveTextContent(commodity.en.title);

      // 2. Sourcing Corridor Context Dossier
      expect(screen.getByText('Sourcing Corridor Context')).toBeInTheDocument();
      expect(screen.getByText(/Harvest Window:/i)).toBeInTheDocument();
      expect(screen.getByText(/Export Readiness:/i)).toBeInTheDocument();

      // 3. Related commodities from same corridor
      expect(screen.getByText('Related Commodities')).toBeInTheDocument();
      expect(screen.getByText('Large Green Lentils (Laird)')).toBeInTheDocument();
      expect(screen.getByText('Yellow Field Peas')).toBeInTheDocument();
    });
  });
});
