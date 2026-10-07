import type { ProductCatalogItem } from '@/types/wix';
import type { Product } from '@/components/sections/ProductsSection';

export type AnyProductItem = ProductCatalogItem | Product;

export interface ProductFilterState {
  corridor: 'all' | 'canada' | 'africa';
  category: string; // 'all' or normalized category slug or display name
  searchQuery: string;
  sortBy: 'name' | 'category';
  sortOrder: 'asc' | 'desc';
  page?: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export const DEFAULT_PAGE_SIZE = 12;

export const DEFAULT_FILTER_STATE: ProductFilterState = {
  corridor: 'all',
  category: 'all',
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
};

/**
 * Normalizes a category name into a URL-safe, whitespace-resilient slug identifier.
 * Example: "Pulses & Legumes" -> "pulses-and-legumes"
 * Example: "Grains & Cereals" -> "grains-and-cereals"
 */
export function normalizeCategorySlug(category?: string | null): string {
  if (!category) return '';
  return category
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Robust check if a product's category matches the user's selected category.
 * Prevents case sensitivity, whitespace, ampersand, or slug mismatches.
 */
export function matchesCategory(
  productCategory?: string | null,
  selectedCategory?: string | null
): boolean {
  if (!selectedCategory || selectedCategory === 'all') return true;
  if (!productCategory) return false;

  const productSlug = normalizeCategorySlug(productCategory);
  const selectedSlug = normalizeCategorySlug(selectedCategory);

  if (productSlug === selectedSlug) return true;

  // Secondary fallback: normalized lowercase comparison
  return productCategory.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
}

/**
 * Formats category display label cleanly preserving canonical title casing.
 * Avoids character truncation bugs like `charAt(0).toUpperCase() + slice(1)`.
 */
export function formatCategoryLabel(
  category: string,
  availableCategories: string[] = []
): string {
  if (!category || category === 'all') return 'All Categories';

  // Check if a canonical category exists in availableCategories matching this slug
  const targetSlug = normalizeCategorySlug(category);
  const canonical = availableCategories.find(
    c => normalizeCategorySlug(c) === targetSlug
  );
  if (canonical) return canonical;

  // If already properly capitalized with spaces, return as is
  if (category.includes(' ') && /[A-Z]/.test(category)) {
    return category;
  }

  // Otherwise, format slugified or lowercase string into Title Case
  return category
    .replace(/-/g, ' ')
    .replace(/\band\b/gi, '&')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Strips HTML tags, styles, and markup entities from strings.
 * Prevents false-positive matches when users search for keywords matching HTML tags (e.g. `<p>`, `style`).
 */
export function stripHtmlTags(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluates whether a product belongs to the Canadian or African trade corridor.
 */
export function matchesCorridor(
  product: AnyProductItem,
  corridor: 'all' | 'canada' | 'africa'
): boolean {
  if (corridor === 'all') return true;

  const prodCorridor = (product as ProductCatalogItem).corridor;
  const origin = (product.sourcingOrigin || '').toLowerCase();

  if (corridor === 'canada') {
    if (prodCorridor === 'canada') return true;
    return (
      origin.includes('canada') ||
      origin.includes('saskatchewan') ||
      origin.includes('alberta') ||
      origin.includes('manitoba') ||
      origin.includes('ontario') ||
      origin.includes('quebec') ||
      origin.includes('pei') ||
      origin.includes('bc') ||
      origin.includes('british columbia') ||
      origin.includes('prairie') ||
      origin.includes('prairies')
    );
  }

  if (corridor === 'africa') {
    if (prodCorridor === 'africa') return true;
    return (
      origin.includes('africa') ||
      origin.includes('nigeria') ||
      origin.includes('ghana') ||
      origin.includes('madagascar') ||
      origin.includes('tropical') ||
      origin.includes('ivoire') ||
      origin.includes("côte d'ivoire") ||
      origin.includes('west africa')
    );
  }

  return true;
}

/**
 * Evaluates whether a product matches a sanitized search query.
 * Searches product title, sanitized description, sourcing origin, category, and sanitized typical parameters.
 */
export function matchesKeyword(product: AnyProductItem, query: string): boolean {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();

  const title = (
    product.title ||
    product.productName ||
    ('name' in product ? (product as { name?: string }).name : '') ||
    ''
  ).toLowerCase();

  const origin = (product.sourcingOrigin || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const strippedDescription = stripHtmlTags(product.description).toLowerCase();

  const typicalParams =
    product.typicalQualityParameters ||
    product.qualityStandards ||
    '';
  const strippedParams = stripHtmlTags(typicalParams).toLowerCase();

  return (
    title.includes(q) ||
    strippedDescription.includes(q) ||
    origin.includes(q) ||
    category.includes(q) ||
    strippedParams.includes(q)
  );
}

/**
 * Multi-dimensional filtering and sorting across the full dataset in memory.
 */
export function filterAndSortProducts<T extends AnyProductItem>(
  products: T[],
  filterState: ProductFilterState
): T[] {
  if (!products || products.length === 0) return [];

  const filtered = products.filter(product => {
    // 1. Trade Corridor Dimension
    if (!matchesCorridor(product, filterState.corridor)) {
      return false;
    }

    // 2. Category Dimension
    if (!matchesCategory(product.category, filterState.category)) {
      return false;
    }

    // 3. Keyword Dimension (debounced query)
    if (filterState.searchQuery && !matchesKeyword(product, filterState.searchQuery)) {
      return false;
    }

    return true;
  });

  // Sorting
  return [...filtered].sort((a, b) => {
    const aTitle = (a.title || a.productName || ('name' in a ? (a as { name?: string }).name : '') || '').toLowerCase();
    const bTitle = (b.title || b.productName || ('name' in b ? (b as { name?: string }).name : '') || '').toLowerCase();
    const aCat = (a.category || '').toLowerCase();
    const bCat = (b.category || '').toLowerCase();

    let comparison = 0;
    if (filterState.sortBy === 'category') {
      comparison = aCat.localeCompare(bCat);
      if (comparison === 0) {
        comparison = aTitle.localeCompare(bTitle);
      }
    } else {
      comparison = aTitle.localeCompare(bTitle);
    }

    return filterState.sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Client-side slicing for in-memory pagination of already filtered commodities.
 */
export function paginateProducts<T>(
  items: T[],
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): { paginatedItems: T[]; pagination: PaginationState } {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    pagination: {
      currentPage: validPage,
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasPrev: validPage > 1,
      hasNext: validPage < totalPages,
    },
  };
}

/**
 * Calculates page number list with ellipsis for pagination UI.
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('ellipsis');
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push('ellipsis');
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('ellipsis');
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push('ellipsis');
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Hydrates filter state from URL search parameters.
 */
export function parseFilterStateFromSearchParams(
  searchParams: { get(name: string): string | null } | URLSearchParams,
  availableCategories: string[] = []
): ProductFilterState & { page: number } {
  const rawOrigin = searchParams.get('origin');
  const corridor: 'all' | 'canada' | 'africa' =
    rawOrigin === 'canada' || rawOrigin === 'africa' ? rawOrigin : 'all';

  const rawCategory = searchParams.get('category');
  let category = 'all';
  if (rawCategory && rawCategory !== 'all') {
    // Resolve slug back to canonical category name if available
    const canonical = availableCategories.find(
      c => normalizeCategorySlug(c) === normalizeCategorySlug(rawCategory)
    );
    category = canonical || rawCategory;
  }

  const searchQuery = searchParams.get('q') || '';
  const rawSort = searchParams.get('sort');
  const sortBy: 'name' | 'category' = rawSort === 'category' ? 'category' : 'name';

  const rawOrder = searchParams.get('order');
  const sortOrder: 'asc' | 'desc' = rawOrder === 'desc' ? 'desc' : 'asc';

  const rawPage = searchParams.get('page');
  const pageNum = rawPage ? parseInt(rawPage, 10) : 1;
  const page = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;

  return {
    corridor,
    category,
    searchQuery,
    sortBy,
    sortOrder,
    page,
  };
}

/**
 * Builds clean URL search parameters from active filter state, omitting default values.
 */
export function buildFilterSearchParams(
  state: ProductFilterState,
  page: number = 1
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.corridor !== 'all') {
    params.set('origin', state.corridor);
  }

  if (state.category && state.category !== 'all') {
    params.set('category', normalizeCategorySlug(state.category));
  }

  if (state.searchQuery && state.searchQuery.trim()) {
    params.set('q', state.searchQuery.trim());
  }

  if (state.sortBy !== 'name') {
    params.set('sort', state.sortBy);
  }

  if (state.sortOrder !== 'asc') {
    params.set('order', state.sortOrder);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  return params;
}
