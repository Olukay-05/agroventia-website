import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import ProductsClient from '@/app/products/ProductsClient';
import ProductsSection from '@/components/sections/ProductsSection';
import ProductPagination from '@/components/common/ProductPagination';
import {
  normalizeCategorySlug,
  matchesCategory,
  formatCategoryLabel,
  stripHtmlTags,
  matchesKeyword,
  matchesCorridor,
  filterAndSortProducts,
  paginateProducts,
  getPageNumbers,
  parseFilterStateFromSearchParams,
  buildFilterSearchParams,
} from '@/lib/product-filters';
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

// Mock Next.js navigation with mutable searchParams
let mockSearchParams = new URLSearchParams();
const mockRouterReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockRouterReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/products',
  useSearchParams: () => mockSearchParams,
}));

describe('CAP-12: Robust Search, Multi-Dimensional Filtering & State Resilience', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

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

  describe('Scenario 1: Case & Formatting Resilient Category Filter', () => {
    it('normalizes category slugs and matches ampersands, whitespace, and casing variations', () => {
      // 1. Slug normalization
      expect(normalizeCategorySlug('Pulses & Legumes')).toBe('pulses-and-legumes');
      expect(normalizeCategorySlug('Grains & Cereals')).toBe('grains-and-cereals');
      expect(normalizeCategorySlug('Specialty Botanicals & Spices')).toBe(
        'specialty-botanicals-and-spices'
      );
      expect(normalizeCategorySlug('  Oils & Butters  ')).toBe('oils-and-butters');

      // 2. Resilient category matching
      expect(matchesCategory('Pulses & Legumes', 'pulses-and-legumes')).toBe(true);
      expect(matchesCategory('pulses & legumes', 'Pulses & Legumes')).toBe(true);
      expect(matchesCategory('Grains & Cereals', 'grains-and-cereals')).toBe(true);
      expect(matchesCategory('Grains & Cereals', 'all')).toBe(true);
      expect(matchesCategory('Grains & Cereals', 'oilseeds')).toBe(false);

      // 3. Category label formatting avoids corruption
      const available = ['Grains & Cereals', 'Pulses & Legumes', 'Oils & Butters'];
      expect(formatCategoryLabel('grains-and-cereals', available)).toBe('Grains & Cereals');
      expect(formatCategoryLabel('pulses-and-legumes', available)).toBe('Pulses & Legumes');
      expect(formatCategoryLabel('Grains & Cereals', available)).toBe('Grains & Cereals');
      expect(formatCategoryLabel('Oils & Butters', available)).toBe('Oils & Butters');
    });

    it('filters products correctly by normalized category slug and title casing', () => {
      const sampleProducts: ProductCatalogItem[] = [
        {
          _id: '1',
          _owner: 'owner',
          _createdDate: { $date: '' },
          _updatedDate: { $date: '' },
          title: 'Durum Wheat',
          category: 'Grains & Cereals',
          image1: '',
          description: 'Top grade durum',
        },
        {
          _id: '2',
          _owner: 'owner',
          _createdDate: { $date: '' },
          _updatedDate: { $date: '' },
          title: 'Crimson Red Lentils',
          category: 'Pulses & Legumes',
          image1: '',
          description: 'Split red lentils',
        },
      ];

      const filteredBySlug = filterAndSortProducts(sampleProducts, {
        corridor: 'all',
        category: 'pulses-and-legumes',
        searchQuery: '',
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(filteredBySlug).toHaveLength(1);
      expect(filteredBySlug[0].title).toBe('Crimson Red Lentils');
    });
  });

  describe('Scenario 2: HTML-Sanitized Keyword Search', () => {
    it('strips HTML tags and avoids false-positive matches for tags, styles, and attributes', () => {
      const rawHtml = '<p style="font-weight: bold;">Premium <span>Canadian</span> barley &amp; malt.</p>';
      const stripped = stripHtmlTags(rawHtml);

      expect(stripped).toBe('Premium Canadian barley & malt.');
      expect(stripped).not.toContain('<p');
      expect(stripped).not.toContain('style');
      expect(stripped).not.toContain('span');

      const testProduct: ProductCatalogItem = {
        _id: 'test-wheat',
        _owner: 'owner',
        _createdDate: { $date: '' },
        _updatedDate: { $date: '' },
        title: 'Canadian Amber Durum Wheat',
        category: 'Grains & Cereals',
        image1: '',
        sourcingOrigin: 'Saskatchewan, Canada',
        description: '<p class="content" style="color: red;">Milled from certified non-GMO Prairie crops.</p>',
        typicalQualityParameters: '<div>Protein: Min 14.5%</div>',
      };

      // HTML tags and style attributes must NEVER match
      expect(matchesKeyword(testProduct, '<p>')).toBe(false);
      expect(matchesKeyword(testProduct, 'style')).toBe(false);
      expect(matchesKeyword(testProduct, 'color')).toBe(false);
      expect(matchesKeyword(testProduct, 'class')).toBe(false);
      expect(matchesKeyword(testProduct, '<div>')).toBe(false);

      // Legitimate commodity keywords must match accurately
      expect(matchesKeyword(testProduct, 'Durum')).toBe(true);
      expect(matchesKeyword(testProduct, 'Canadian')).toBe(true);
      expect(matchesKeyword(testProduct, 'Saskatchewan')).toBe(true);
      expect(matchesKeyword(testProduct, 'non-GMO')).toBe(true);
      expect(matchesKeyword(testProduct, 'Protein')).toBe(true);
    });
  });

  describe('Scenario 3: Debounced Query Execution & Multi-Dimensional Filtering', () => {
    it('filters simultaneously across corridor, category, and keyword dimensions', () => {
      const products: ProductCatalogItem[] = [
        {
          _id: 'can-1',
          _owner: 'owner',
          _createdDate: { $date: '' },
          _updatedDate: { $date: '' },
          title: 'Canadian Crimson Lentils',
          category: 'Pulses & Legumes',
          sourcingOrigin: 'Saskatchewan, Canada',
          image1: '',
          description: 'High grade red lentils',
        },
        {
          _id: 'can-2',
          _owner: 'owner',
          _createdDate: { $date: '' },
          _updatedDate: { $date: '' },
          title: 'CWAD Durum Wheat',
          category: 'Grains & Cereals',
          sourcingOrigin: 'Alberta, Canada',
          image1: '',
          description: 'Hard amber durum',
        },
        {
          _id: 'afr-1',
          _owner: 'owner',
          _createdDate: { $date: '' },
          _updatedDate: { $date: '' },
          title: 'Split Dried Ginger',
          category: 'Specialty Botanicals & Spices',
          sourcingOrigin: 'Kaduna, Nigeria',
          image1: '',
          description: 'Pungent African ginger',
        },
      ];

      // Corridor filter
      expect(matchesCorridor(products[0], 'canada')).toBe(true);
      expect(matchesCorridor(products[2], 'canada')).toBe(false);
      expect(matchesCorridor(products[2], 'africa')).toBe(true);

      // Multi-dimensional combination: Canada corridor + Pulses & Legumes + "lentils" keyword
      const result = filterAndSortProducts(products, {
        corridor: 'canada',
        category: 'pulses-and-legumes',
        searchQuery: 'lentils',
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe('can-1');
    });
  });

  describe('Scenario 4: URL State Sharing, Parsing & Hydration', () => {
    it('hydrates filter state from search parameters including corridor, category slug, keyword, and page', () => {
      const params = new URLSearchParams(
        'origin=canada&category=pulses-and-legumes&q=red&sort=name&order=asc&page=2'
      );

      const available = ['Grains & Cereals', 'Pulses & Legumes'];
      const parsed = parseFilterStateFromSearchParams(params, available);

      expect(parsed.corridor).toBe('canada');
      expect(parsed.category).toBe('Pulses & Legumes');
      expect(parsed.searchQuery).toBe('red');
      expect(parsed.sortBy).toBe('name');
      expect(parsed.sortOrder).toBe('asc');
      expect(parsed.page).toBe(2);
    });

    it('builds clean search parameters omitting default values', () => {
      // Default state produces empty params
      const defaultParams = buildFilterSearchParams({
        corridor: 'all',
        category: 'all',
        searchQuery: '',
        sortBy: 'name',
        sortOrder: 'asc',
      });
      expect(defaultParams.toString()).toBe('');

      // Active state produces clean params with slugified category
      const activeParams = buildFilterSearchParams(
        {
          corridor: 'canada',
          category: 'Pulses & Legumes',
          searchQuery: 'lentils',
          sortBy: 'category',
          sortOrder: 'desc',
        },
        3
      );

      expect(activeParams.get('origin')).toBe('canada');
      expect(activeParams.get('category')).toBe('pulses-and-legumes');
      expect(activeParams.get('q')).toBe('lentils');
      expect(activeParams.get('sort')).toBe('category');
      expect(activeParams.get('order')).toBe('desc');
      expect(activeParams.get('page')).toBe('3');
    });
  });

  describe('Scenario 5: Full Dataset Search vs. Slice Truncation', () => {
    it('searches across the entire 43-commodity catalog in memory and locates end-of-catalog items immediately', async () => {
      const allMockProducts = await getAllMockProductCatalogContent('en');
      expect(allMockProducts.length).toBeGreaterThanOrEqual(40);

      // Search for a product that would otherwise be on page 3 or 4 (e.g. Yellow Soybeans or Sesame)
      const results = filterAndSortProducts(allMockProducts, {
        corridor: 'all',
        category: 'all',
        searchQuery: 'Yellow Soybeans',
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toMatch(/Yellow Soybeans/i);
    });
  });

  describe('Scenario 6: Pagination Implementation & Slicing', () => {
    it('slices filtered commodities into accurate pages and calculates bounds correctly', () => {
      const mockItems = Array.from({ length: 43 }, (_, i) => ({
        _id: `prod-${i + 1}`,
        title: `Commodity ${i + 1}`,
      }));

      // Page 1 (items 1–12)
      const page1 = paginateProducts(mockItems, 1, 12);
      expect(page1.pagination.totalItems).toBe(43);
      expect(page1.pagination.totalPages).toBe(4);
      expect(page1.pagination.currentPage).toBe(1);
      expect(page1.pagination.startIndex).toBe(0);
      expect(page1.pagination.endIndex).toBe(12);
      expect(page1.paginatedItems).toHaveLength(12);
      expect(page1.pagination.hasPrev).toBe(false);
      expect(page1.pagination.hasNext).toBe(true);

      // Page 2 (items 13–24)
      const page2 = paginateProducts(mockItems, 2, 12);
      expect(page2.pagination.currentPage).toBe(2);
      expect(page2.pagination.startIndex).toBe(12);
      expect(page2.pagination.endIndex).toBe(24);
      expect(page2.paginatedItems[0].title).toBe('Commodity 13');
      expect(page2.pagination.hasPrev).toBe(true);

      // Page 4 (items 37–43)
      const page4 = paginateProducts(mockItems, 4, 12);
      expect(page4.pagination.currentPage).toBe(4);
      expect(page4.pagination.startIndex).toBe(36);
      expect(page4.pagination.endIndex).toBe(43);
      expect(page4.paginatedItems).toHaveLength(7);
      expect(page4.pagination.hasNext).toBe(false);
    });

    it('generates page numbers with ellipsis when total pages exceeds 7', () => {
      expect(getPageNumbers(1, 4)).toEqual([1, 2, 3, 4]);
      expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
      expect(getPageNumbers(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
      expect(getPageNumbers(9, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
    });

    it('renders ProductPagination component with accessible navigation and triggers page change', () => {
      const handlePageChange = jest.fn();

      renderWithProviders(
        <ProductPagination
          currentPage={1}
          totalPages={4}
          totalItems={43}
          startIndex={0}
          endIndex={12}
          onPageChange={handlePageChange}
        />
      );

      // 1. Accessible navigation role
      const nav = screen.getByRole('navigation', { name: /Product Catalog Pagination/i });
      expect(nav).toBeInTheDocument();

      // 2. Showing range summary
      expect(screen.getByText('Showing 1–12 of 43 commodities')).toBeInTheDocument();

      // 3. Previous button is disabled on page 1
      const prevBtn = screen.getByRole('button', { name: /Previous page/i });
      expect(prevBtn).toBeDisabled();

      // 4. Click Next Page
      const nextBtn = screen.getByRole('button', { name: /Next page/i });
      expect(nextBtn).not.toBeDisabled();
      fireEvent.click(nextBtn);
      expect(handlePageChange).toHaveBeenCalledWith(2);

      // 5. Click specific page number button
      const page3Btn = screen.getByRole('button', { name: /Page 3/i });
      fireEvent.click(page3Btn);
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Scenario 7: Dedicated Catalog Integration & Empty-State Recovery', () => {
    it('renders the catalog, paginates commodities, and provides interactive empty-state reset', async () => {
      renderWithProviders(<ProductsClient />);

      // Wait for catalog title
      expect(
        await screen.findByText('Global Agricultural Commodity Catalog')
      ).toBeInTheDocument();

      // Verify corridor selector buttons
      expect(screen.getByText('All Corridors')).toBeInTheDocument();
      expect(screen.getByText('Canadian Prairies & Eastern Canada')).toBeInTheDocument();
      expect(screen.getByText('Tropical & West Africa')).toBeInTheDocument();

      // Verify search input
      const searchInput = screen.getByPlaceholderText(
        'Search commodities by name, origin, or keyword...'
      );
      expect(searchInput).toBeInTheDocument();

      // Type an impossible query that produces 0 results
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'XYZNONEXISTENTCOMMODITY' } });
        await new Promise(r => setTimeout(r, 400));
      });

      // Advance debounce timer and check empty state
      const emptyHeading = await screen.findByText('No Commodities Found');
      expect(emptyHeading).toBeInTheDocument();

      // Clear all filters button in empty state or chips
      const clearBtns = screen.getAllByRole('button', { name: /Clear All Filters/i });
      expect(clearBtns.length).toBeGreaterThan(0);

      // Clicking reset clears search input
      await act(async () => {
        fireEvent.click(clearBtns[0]);
        await new Promise(r => setTimeout(r, 400));
      });

      expect((searchInput as HTMLInputElement).value).toBe('');
    });

    it('hydrates initial corridor, category and query from URL search parameters', async () => {
      mockSearchParams = new URLSearchParams('origin=canada&category=pulses-and-legumes&q=red');

      renderWithProviders(<ProductsClient />);

      expect(
        await screen.findByText('Global Agricultural Commodity Catalog')
      ).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText(
        'Search commodities by name, origin, or keyword...'
      ) as HTMLInputElement;

      expect(searchInput.value).toBe('red');
    });
  });
});
