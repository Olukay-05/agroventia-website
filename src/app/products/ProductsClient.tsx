'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ArrowRight,
  ChevronRight,
  Filter,
  Globe,
  RotateCcw,
  Search,
  SearchX,
  SortDesc,
  X,
} from 'lucide-react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import SectionContainer from '@/components/common/SectionContainer';
import WixImage from '@/components/WixImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import QualityStandardsModal from '@/components/common/QualityStandardsModal';
import ProductPagination from '@/components/common/ProductPagination';
import { useProductCatalogContent } from '@/hooks/useContent';
import { useLocale } from '@/contexts/LocaleContext';
import { QuoteRequestProvider, useQuoteRequest } from '@/contexts/QuoteRequestContext';
import { useDebounce } from '@/hooks/useDebounce';
import {
  filterAndSortProducts,
  paginateProducts,
  parseFilterStateFromSearchParams,
  buildFilterSearchParams,
  formatCategoryLabel,
  normalizeCategorySlug,
  matchesCategory,
  DEFAULT_PAGE_SIZE,
} from '@/lib/product-filters';
import { trackButtonClick, trackProductQuoteRequest } from '@/lib/analytics';
import type { ProductCatalogItem } from '@/types/wix';

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: rawProducts, isLoading, error } = useProductCatalogContent({ all: true });
  const { locale } = useLocale();
  const { setRequestedProduct, prefetchProductForQuote } = useQuoteRequest();

  const isFrench = locale?.startsWith('fr');
  const isSpanish = locale?.startsWith('es') || locale === 'esp';

  // Extract unique categories from raw products
  const availableCategories = useMemo(() => {
    if (!rawProducts) return [];
    const set = new Set<string>();
    rawProducts.forEach(p => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rawProducts]);

  // Parse initial state from URL query parameters on initial render
  const initialFilterParams = useMemo(() => {
    return parseFilterStateFromSearchParams(searchParams, []);
  }, []);

  // State
  const [selectedCorridor, setSelectedCorridor] = useState<'all' | 'canada' | 'africa'>(
    initialFilterParams.corridor
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilterParams.category
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialFilterParams.searchQuery
  );
  const [sortBy, setSortBy] = useState<'name' | 'category'>(
    initialFilterParams.sortBy
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    initialFilterParams.sortOrder
  );
  const [currentPage, setCurrentPage] = useState<number>(
    initialFilterParams.page
  );

  // Debounced search query for high-performance filtering without keystroke lag
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem | null>(null);

  // Once categories load from CMS, map slug in selectedCategory to canonical display name if needed
  useEffect(() => {
    if (selectedCategory !== 'all' && availableCategories.length > 0) {
      const canonical = availableCategories.find(
        c => normalizeCategorySlug(c) === normalizeCategorySlug(selectedCategory)
      );
      if (canonical && canonical !== selectedCategory) {
        setSelectedCategory(canonical);
      }
    }
  }, [availableCategories]);

  // Keep state synchronized if URL search parameters change externally (e.g. browser back/forward)
  const prevSearchParamsStr = useRef(searchParams.toString());
  useEffect(() => {
    const currentStr = searchParams.toString();
    if (prevSearchParamsStr.current !== currentStr) {
      prevSearchParamsStr.current = currentStr;
      const parsed = parseFilterStateFromSearchParams(searchParams, availableCategories);
      setSelectedCorridor(parsed.corridor);
      setSelectedCategory(parsed.category);
      setSearchQuery(parsed.searchQuery);
      setSortBy(parsed.sortBy);
      setSortOrder(parsed.sortOrder);
      setCurrentPage(parsed.page);
    }
  }, [searchParams, availableCategories]);

  // Reset page to 1 whenever any filter or debounced search query changes
  const isFirstFilterChange = useRef(true);
  useEffect(() => {
    if (isFirstFilterChange.current) {
      isFirstFilterChange.current = false;
      return;
    }
    setCurrentPage(1);
  }, [selectedCorridor, selectedCategory, debouncedSearchQuery, sortBy, sortOrder]);

  // Synchronize state changes to URL search parameters without full page reload
  const isFirstUrlSync = useRef(true);
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }

    const params = buildFilterSearchParams(
      {
        corridor: selectedCorridor,
        category: selectedCategory,
        searchQuery: debouncedSearchQuery,
        sortBy,
        sortOrder,
      },
      currentPage
    );
    params.set('lang', locale);

    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    if (typeof window !== 'undefined') {
      const currentFullSearch = window.location.search.replace(/^\?/, '');
      if (currentFullSearch !== queryString) {
        router.replace(newPath, { scroll: false });
      }
    }
  }, [
    selectedCorridor,
    selectedCategory,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    currentPage,
    locale,
    pathname,
    router,
  ]);

  // Dynamic corridor counts computed across complete dataset
  const corridorCounts = useMemo(() => {
    if (!rawProducts) return { all: 0, canada: 0, africa: 0 };
    let canada = 0;
    let africa = 0;
    rawProducts.forEach(product => {
      const isCan =
        product.corridor === 'canada' ||
        (() => {
          const origin = (product.sourcingOrigin || '').toLowerCase();
          return (
            origin.includes('canada') ||
            origin.includes('saskatchewan') ||
            origin.includes('alberta') ||
            origin.includes('manitoba') ||
            origin.includes('ontario') ||
            origin.includes('prairies')
          );
        })();
      if (isCan) canada++;
      const isAfr =
        product.corridor === 'africa' ||
        (() => {
          const origin = (product.sourcingOrigin || '').toLowerCase();
          return (
            origin.includes('africa') ||
            origin.includes('nigeria') ||
            origin.includes('ghana') ||
            origin.includes('tropical') ||
            origin.includes('ivoire')
          );
        })();
      if (isAfr) africa++;
    });
    return { all: rawProducts.length, canada, africa };
  }, [rawProducts]);

  // Multilingual labels
  const labels = useMemo(
    () => ({
      pageTitle: isFrench
        ? 'Catalogue mondial des commodités agricoles'
        : isSpanish
          ? 'Catálogo global de productos agrícolas'
          : 'Global Agricultural Commodity Catalog',
      pageSubtitle: isFrench
        ? "Répertoire B2B complet des grains canadiens, légumineuses, oléagineux et commodités tropicales d'Afrique de l'Ouest avec paramètres de qualité typiques."
        : isSpanish
          ? 'Directorio B2B completo de granos canadienses, legumbres, oleaginosas y productos tropicales de África Occidental con parámetros de calidad típicos.'
          : 'Comprehensive B2B directory of Canadian Prairies grains, pulses, oilseeds, and West African tropical commodities with typical quality parameters.',
      home: isFrench ? 'Accueil' : isSpanish ? 'Inicio' : 'Home',
      catalog: isFrench ? 'Catalogue' : isSpanish ? 'Catálogo' : 'Catalog',
      allCorridors: isFrench ? 'Tous les corridors' : isSpanish ? 'Todos los corredores' : 'All Corridors',
      corridorCanada: isFrench
        ? 'Prairies canadiennes et Est du Canada'
        : isSpanish
          ? 'Praderas canadienses y Este de Canadá'
          : 'Canadian Prairies & Eastern Canada',
      corridorAfrica: isFrench
        ? "Afrique tropicale et de l'Ouest"
        : isSpanish
          ? 'África tropical y occidental'
          : 'Tropical & West Africa',
      searchPlaceholder: isFrench
        ? 'Rechercher par nom, origine ou mot-clé...'
        : isSpanish
          ? 'Buscar por nombre, origen o palabra clave...'
          : 'Search commodities by name, origin, or keyword...',
      allCategories: isFrench ? 'Toutes les catégories' : isSpanish ? 'Todas las categorías' : 'All Categories',
      sortByName: isFrench ? 'Nom' : isSpanish ? 'Nombre' : 'Name',
      sortByCategory: isFrench ? 'Catégorie' : isSpanish ? 'Categoría' : 'Category',
      commodityCategory: isFrench ? 'Catégorie de commodité' : isSpanish ? 'Categoría de producto' : 'Commodity Category',
      resetCategory: isFrench ? 'Réinitialiser la catégorie' : isSpanish ? 'Restablecer categoría' : 'Reset Category',
      categoryPrefix: isFrench ? 'Catégorie' : isSpanish ? 'Categoría' : 'Category',
      corridorPrefix: isFrench ? 'Corridor' : isSpanish ? 'Corredor' : 'Corridor',
      removeCategory: isFrench ? 'Retirer le filtre de catégorie' : isSpanish ? 'Quitar filtro de categoría' : 'Remove category filter',
      removeCorridor: isFrench ? 'Retirer le filtre de corridor' : isSpanish ? 'Quitar filtro de corredor' : 'Remove corridor filter',
      toggleSort: isFrench ? 'Inverser le tri' : isSpanish ? 'Cambiar orden' : 'Toggle sort order',
      loadError: isFrench ? 'Impossible de charger le catalogue de produits.' : isSpanish ? 'No se pudo cargar el catálogo de productos.' : 'Failed to load product catalog.',
      showingCount: (count: number, total: number) =>
        isFrench
          ? `Affichage de ${count} sur ${total} commodités`
          : isSpanish
            ? `Mostrando ${count} de ${total} productos básicos`
            : `Showing ${count} of ${total} commodities`,
      noResults: isFrench
        ? 'Aucune commodité ne correspond à vos filtres de recherche.'
        : isSpanish
          ? 'No se encontraron productos básicos que coincidan con sus filtros de búsqueda.'
          : 'No commodities found matching your current filter criteria.',
      resetFilters: isFrench ? 'Réinitialiser les filtres' : isSpanish ? 'Restablecer filtros' : 'Reset Filters',
      clearAllFilters: isFrench ? 'Effacer tous les filtres' : isSpanish ? 'Borrar todos los filtros' : 'Clear All Filters',
      viewSpecs: isFrench ? 'Détails et spécifications' : isSpanish ? 'Detalles y especificaciones' : 'View Details / Specs',
      requestQuote: isFrench ? 'Demander un devis' : isSpanish ? 'Solicitar cotización' : 'Request Quote',
      disclaimerText: isFrench
        ? 'Toutes les commodités sont rigoureusement sourcées auprès de coopératives agricoles vérifiées et de terminaux de grains certifiés. Les spécifications indiquées représentent des repères contractuels typiques et sont adaptées aux exigences des acheteurs et aux certificats phytosanitaires de destination.'
        : isSpanish
          ? 'Todos los productos básicos provienen directamente de cooperativas agrícolas verificadas y terminales de granos certificados. Las especificaciones indicadas representan puntos de referencia contractuales típicos y se personalizan según los requisitos de compra y las certificaciones fitosanitarias de destino.'
          : 'All commodities are sourced directly from verified farm cooperatives and certified grain terminals. Specifications represent typical contract benchmarks and are tailored to buyer purchase agreements and destination phytosanitary certifications.',
    }),
    [isFrench, isSpanish]
  );

  // Full-dataset in-memory multi-dimensional filtering & sorting
  const sortedProducts = useMemo(() => {
    return filterAndSortProducts(rawProducts || [], {
      corridor: selectedCorridor,
      category: selectedCategory,
      searchQuery: debouncedSearchQuery,
      sortBy,
      sortOrder,
    });
  }, [
    rawProducts,
    selectedCorridor,
    selectedCategory,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
  ]);

  // Client-side pagination slicing of filtered results
  const { paginatedItems, pagination } = useMemo(() => {
    return paginateProducts(sortedProducts, currentPage, DEFAULT_PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const catalogEl = document.getElementById('catalog-browser');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCardClick = (product: ProductCatalogItem) => {
    trackButtonClick('catalog_card_click', {
      product_name: product.title || product.productName || '',
      product_id: product._id,
    });
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleRequestQuote = (productTitle: string, productId: string) => {
    setRequestedProduct({ name: productTitle, id: productId });
    trackProductQuoteRequest(productTitle, productId);
    prefetchProductForQuote(productId);
    window.location.href = `/#contact`;
  };

  const resetAllFilters = () => {
    setSelectedCorridor('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
    router.replace(pathname, { scroll: false });
  };

  // Contextual empty state text
  const emptyContextText = useMemo(() => {
    const parts: string[] = [];
    if (debouncedSearchQuery.trim()) {
      parts.push(`"${debouncedSearchQuery.trim()}"`);
    }
    if (selectedCategory !== 'all') {
      parts.push(formatCategoryLabel(selectedCategory, availableCategories));
    }
    if (selectedCorridor !== 'all') {
      parts.push(
        selectedCorridor === 'canada'
          ? labels.corridorCanada
          : labels.corridorAfrica
      );
    }

    if (parts.length > 0) {
      return isFrench
        ? `Aucune commodité ne correspond à vos critères (${parts.join(', ')}). ${labels.noResults}`
        : isSpanish
          ? `No se encontraron productos agrícolas con sus criterios (${parts.join(', ')}). ${labels.noResults}`
          : `No commodities match your current search criteria (${parts.join(', ')}). ${labels.noResults}`;
    }

    return labels.noResults;
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedCorridor,
    availableCategories,
    isFrench,
    isSpanish,
    labels.noResults,
    labels.corridorCanada,
    labels.corridorAfrica,
  ]);

  return (
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-agro-neutral-950 text-[#281909] dark:text-agro-neutral-50 flex flex-col">
      <Header />

      <main className="flex-grow pt-20">
        {/* Hero Banner Header */}
        <section className="relative w-full py-16 md:py-24 bg-[#281909] text-[#FDF8F0] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-agro-primary-950 via-[#1b1007] to-[#0f0803] opacity-95" />
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-agro-secondary-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-agro-primary-600/30 rounded-full blur-3xl" />
          </div>

          <div className="container-premium max-w-6xl mx-auto relative z-10 px-4">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-agro-neutral-300">
              <Link href="/" className="hover:text-white transition-colors">
                {labels.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-agro-secondary-300 font-medium">
                {labels.catalog}
              </span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif mb-4 text-[#FDF8F0]">
              {labels.pageTitle}
            </h1>
            <p className="text-lead max-w-3xl text-[#FDF8F0]">
              {labels.pageSubtitle}
            </p>
          </div>
        </section>

        {/* Catalog Browser Section */}
        <SectionContainer id="catalog-browser" className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Multi-Dimensional Filter Control Bar (Sticky Unified Toolbar) */}
            <div className="sticky top-20 z-20 backdrop-blur-md bg-white/95 dark:bg-agro-neutral-900/95 border border-agro-primary-200/60 dark:border-agro-primary-800/60 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 space-y-4">
              {/* Corridor Origin Tab Selector */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-agro-neutral-400 mb-2">
                  Trade Corridor
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCorridor('all')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedCorridor === 'all'
                        ? 'bg-agro-primary-700 text-white shadow-md'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700'
                    }`}
                  >
                    <span>{labels.allCorridors}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 dark:bg-black/20">
                      {corridorCounts.all}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCorridor('canada')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedCorridor === 'canada'
                        ? 'bg-agro-primary-700 text-white shadow-md'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700'
                    }`}
                  >
                    <span aria-hidden="true">🍁</span>
                    <span>{labels.corridorCanada}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 dark:bg-black/20">
                      {corridorCounts.canada}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCorridor('africa')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedCorridor === 'africa'
                        ? 'bg-agro-primary-700 text-white shadow-md'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700'
                    }`}
                  >
                    <span aria-hidden="true">🌍</span>
                    <span>{labels.corridorAfrica}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 dark:bg-black/20">
                      {corridorCounts.africa}
                    </span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills (Horizontal scroll on mobile, flex wrap on desktop) */}
              <div className="pt-2 border-t border-agro-primary-100 dark:border-agro-primary-900/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-agro-neutral-400">
                    {labels.commodityCategory}
                  </span>
                  {selectedCategory !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="text-xs text-agro-secondary-600 hover:underline cursor-pointer"
                    >
                      {labels.resetCategory}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-nowrap sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-agro-primary-800 text-white shadow-sm'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700 border border-agro-primary-200/50 dark:border-agro-primary-800/50'
                    }`}
                  >
                    {labels.allCategories}
                  </button>
                  {availableCategories.map(cat => {
                    const isSelected = matchesCategory(selectedCategory, cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-agro-primary-800 text-white shadow-sm'
                            : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700 border border-agro-primary-200/50 dark:border-agro-primary-800/50'
                        }`}
                      >
                        {formatCategoryLabel(cat, availableCategories)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search, Category Dropdown, and Sort Row */}
              <div className="flex flex-col lg:flex-row gap-3 pt-3 border-t border-agro-primary-100 dark:border-agro-primary-900/50">
                {/* Real-time Search Input with clear button */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={labels.searchPlaceholder}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-9 py-2.5 w-full btn-agro-outline bg-white dark:bg-agro-neutral-850"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="w-full lg:w-64">
                  <Select
                    value={
                      selectedCategory === 'all'
                        ? 'all'
                        : availableCategories.find(c => matchesCategory(c, selectedCategory)) || selectedCategory
                    }
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full btn-agro-outline bg-white dark:bg-agro-neutral-850 text-agro-primary-950 dark:text-agro-neutral-50">
                      <Filter size={14} className="mr-2" />
                      <SelectValue placeholder={labels.allCategories} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{labels.allCategories}</SelectItem>
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {formatCategoryLabel(cat, availableCategories)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={val => setSortBy(val as 'name' | 'category')}
                  >
                    <SelectTrigger className="w-36 btn-agro-outline bg-white dark:bg-agro-neutral-850 text-agro-primary-950 dark:text-agro-neutral-50">
                      <SortDesc size={14} className="mr-2" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">{labels.sortByName}</SelectItem>
                      <SelectItem value="category">{labels.sortByCategory}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="btn-agro-outline bg-white dark:bg-agro-neutral-850 cursor-pointer"
                    aria-label={labels.toggleSort}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>

                  {(searchQuery || selectedCategory !== 'all' || selectedCorridor !== 'all') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetAllFilters}
                      className="text-gray-500 hover:text-agro-primary-700 cursor-pointer"
                      title={labels.resetFilters}
                    >
                      <RotateCcw size={15} />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Result Counter & Active Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-agro-neutral-300">
                  {labels.showingCount(sortedProducts.length, rawProducts?.length || 0)}
                </p>

                {/* Removable active filter tags */}
                {(selectedCorridor !== 'all' || selectedCategory !== 'all' || searchQuery.trim()) && (
                  <div className="flex flex-wrap items-center gap-1.5 ml-1">
                    {selectedCorridor !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-agro-primary-100 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 border border-agro-primary-200 dark:border-agro-primary-700">
                        <span>{labels.corridorPrefix}: {selectedCorridor === 'canada' ? labels.corridorCanada : labels.corridorAfrica}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedCorridor('all')}
                          className="hover:text-red-600 ml-0.5 cursor-pointer"
                          aria-label={labels.removeCorridor}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-agro-primary-100 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 border border-agro-primary-200 dark:border-agro-primary-700">
                        <span>{labels.categoryPrefix}: {formatCategoryLabel(selectedCategory, availableCategories)}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('all')}
                          className="hover:text-red-600 ml-0.5 cursor-pointer"
                          aria-label={labels.removeCategory}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {searchQuery.trim() && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-agro-primary-100 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 border border-agro-primary-200 dark:border-agro-primary-700">
                        <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="hover:text-red-600 ml-0.5 cursor-pointer"
                          aria-label="Clear search filter"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetAllFilters}
                      className="text-xs h-7 px-2 text-agro-secondary-700 hover:text-agro-secondary-900 hover:bg-agro-secondary-50 dark:text-agro-secondary-400 dark:hover:bg-agro-neutral-800 cursor-pointer font-semibold"
                    >
                      {labels.clearAllFilters}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-800 border border-red-200">
                <p className="text-sm font-semibold">{labels.loadError}</p>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 mb-8">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            )}

            {/* Empty State with Interactive Recovery */}
            {!isLoading && sortedProducts.length === 0 && (
              <div className="text-center py-16 bg-white/80 dark:bg-agro-neutral-900/80 backdrop-blur-md rounded-2xl border border-dashed border-agro-primary-300 dark:border-agro-primary-700 p-8 max-w-lg mx-auto shadow-sm">
                <div className="mx-auto w-14 h-14 rounded-full bg-agro-primary-50 dark:bg-agro-neutral-800 flex items-center justify-center text-agro-primary-600 dark:text-agro-primary-400 mb-4">
                  <SearchX size={28} />
                </div>
                <h3 className="text-lg font-bold text-agro-primary-950 dark:text-agro-neutral-50 mb-2">
                  No Commodities Found
                </h3>
                <p className="text-sm text-gray-600 dark:text-agro-neutral-300 mb-6 max-w-md mx-auto">
                  {emptyContextText}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={resetAllFilters} className="btn-agro-primary shadow-sm px-6 cursor-pointer">
                    {labels.resetFilters}
                  </Button>
                  <Button onClick={resetAllFilters} variant="outline" className="btn-agro-outline px-6 cursor-pointer">
                    {labels.clearAllFilters}
                  </Button>
                </div>
              </div>
            )}

            {/* Product Catalog Grid (Paginated Slice) */}
            {!isLoading && paginatedItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedItems.map(product => {
                  const title = product.title || product.productName || 'Agricultural Commodity';
                  const origin = product.sourcingOrigin || '';
                  const category = formatCategoryLabel(product.category || '', availableCategories);
                  const image =
                    product.image ||
                    product.image1 ||
                    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop';

                  return (
                    <Card
                      key={product._id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-agro-primary-200/60 dark:border-agro-primary-800/40 bg-white/90 dark:bg-agro-neutral-900/90 backdrop-blur-md hover:shadow-xl hover:bg-white dark:hover:bg-agro-neutral-850 hover:-translate-y-1 hover:border-agro-primary-400 dark:hover:border-agro-primary-600 transition-all duration-300 cursor-pointer"
                      onClick={() => handleCardClick(product)}
                    >
                      <div className="flex flex-col flex-grow">
                        {/* Pure white studio cutout canvas */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-white border-b border-agro-primary-100/60 dark:border-agro-primary-900/40 flex items-center justify-center p-3">
                          <WixImage
                            src={image}
                            alt={title}
                            fill
                            className="object-contain w-full h-full max-h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          {origin && (
                            <div className="absolute top-3 left-3 z-10">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-agro-neutral-900/95 text-agro-primary-900 dark:text-agro-primary-200 shadow-sm backdrop-blur-md border border-agro-primary-200/60 dark:border-agro-primary-800/60">
                                {origin.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? (
                                  <span aria-hidden="true">🍁</span>
                                ) : (
                                  <Globe size={11} className="text-agro-secondary-600" />
                                )}
                                <span>{origin}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <CardHeader className="pb-2 pt-4 px-5">
                          {category && (
                            <span className="text-xs font-bold uppercase tracking-wider text-agro-secondary-600 dark:text-agro-secondary-400">
                              {category}
                            </span>
                          )}
                          <CardTitle className="text-lg font-bold text-agro-primary-950 dark:text-agro-neutral-50 line-clamp-1 group-hover:text-agro-primary-700 dark:group-hover:text-agro-primary-300 transition-colors">
                            {title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pb-3 px-5 flex-grow">
                          {product.description && (
                            <div
                              className="text-sm text-gray-600 dark:text-agro-neutral-300 line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                          )}
                        </CardContent>
                      </div>

                      <CardFooter className="pt-2 pb-5 px-5 flex flex-wrap items-stretch gap-2.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-[1_1_10rem] min-w-0 btn-agro-outline text-xs h-auto min-h-9 py-2 whitespace-normal text-center leading-tight font-semibold cursor-pointer"
                          onClick={e => {
                            e.stopPropagation();
                            handleCardClick(product);
                          }}
                        >
                          {labels.viewSpecs}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-[1_1_10rem] min-w-0 btn-agro-primary text-xs h-auto min-h-9 py-2 whitespace-normal text-center leading-tight font-semibold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleRequestQuote(title, product._id);
                          }}
                        >
                          {labels.requestQuote}
                          <ArrowRight size={12} />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && sortedProducts.length > 0 && (
              <ProductPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                onPageChange={handlePageChange}
              />
            )}

            {/* Footnote Compliance Disclaimer */}
            <div className="mt-16 p-6 rounded-2xl bg-white/60 dark:bg-agro-neutral-900/60 border border-agro-primary-100 dark:border-agro-primary-900/40 text-center">
              <p className="text-xs text-gray-500 dark:text-agro-neutral-400 max-w-3xl mx-auto leading-relaxed italic">
                {labels.disclaimerText}
              </p>
            </div>
          </div>
        </SectionContainer>
      </main>

      {/* Quick-View Typical Quality Parameters Modal */}
      {selectedProduct && (
        <QualityStandardsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          productName={selectedProduct.title || selectedProduct.productName || ''}
          product={selectedProduct}
          typicalQualityParameters={
            selectedProduct.typicalQualityParameters ||
            selectedProduct.qualityStandards ||
            ''
          }
          onRequestQuote={productName => {
            if (selectedProduct) {
              handleRequestQuote(productName, selectedProduct._id);
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function CatalogLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-agro-neutral-950 flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <SectionContainer className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 9 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))}
            </div>
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsClient() {
  return (
    <QuoteRequestProvider>
      <Suspense fallback={<CatalogLoadingFallback />}>
        <CatalogContent />
      </Suspense>
    </QuoteRequestProvider>
  );
}
