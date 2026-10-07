'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Filter,
  Globe,
  RotateCcw,
  Search,
  SortDesc,
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
import { useProductCatalogContent } from '@/hooks/useContent';
import { useLocale } from '@/contexts/LocaleContext';
import { QuoteRequestProvider, useQuoteRequest } from '@/contexts/QuoteRequestContext';
import { trackButtonClick, trackProductQuoteRequest } from '@/lib/analytics';
import type { ProductCatalogItem } from '@/types/wix';

function CatalogContent() {
  const { data: rawProducts, isLoading, error } = useProductCatalogContent({ all: true });
  const { locale } = useLocale();
  const { setRequestedProduct, prefetchProductForQuote } = useQuoteRequest();

  const isFrench = locale?.startsWith('fr');
  const isSpanish = locale?.startsWith('es') || locale === 'esp';

  // Filters State
  const [selectedCorridor, setSelectedCorridor] = useState<'all' | 'canada' | 'africa'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem | null>(null);

  const labels = useMemo(() => ({
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
    viewSpecs: isFrench ? 'Détails et spécifications' : isSpanish ? 'Detalles y especificaciones' : 'View Details / Specs',
    requestQuote: isFrench ? 'Demander un devis' : isSpanish ? 'Solicitar cotización' : 'Request Quote',
    disclaimerText: isFrench
      ? 'Toutes les commodités sont rigoureusement sourcées auprès de coopératives agricoles vérifiées et de terminaux de grains certifiés. Les spécifications indiquées représentent des repères contractuels typiques et sont adaptées aux exigences des acheteurs et aux certificats phytosanitaires de destination.'
      : isSpanish
        ? 'Todos los productos básicos provienen directamente de cooperativas agrícolas verificadas y terminales de granos certificados. Las especificaciones indicadas representan puntos de referencia contractuales típicos y se personalizan según los requisitos de compra y las certificaciones fitosanitarias de destino.'
        : 'All commodities are sourced directly from verified farm cooperatives and certified grain terminals. Specifications represent typical contract benchmarks and are tailored to buyer purchase agreements and destination phytosanitary certifications.',
  }), [isFrench, isSpanish]);

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

  // Multi-dimensional filtering logic
  const filteredProducts = useMemo(() => {
    if (!rawProducts) return [];

    return rawProducts.filter(product => {
      // 1. Corridor Filter
      if (selectedCorridor === 'canada') {
        const isCanada =
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
        if (!isCanada) return false;
      } else if (selectedCorridor === 'africa') {
        const isAfrica =
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
        if (!isAfrica) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        const productCat = (product.category || '').toLowerCase();
        if (productCat !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (product.title || product.productName || '').toLowerCase();
        const desc = (product.description || '').toLowerCase();
        const origin = (product.sourcingOrigin || '').toLowerCase();
        const cat = (product.category || '').toLowerCase();

        const matches =
          title.includes(q) ||
          desc.includes(q) ||
          origin.includes(q) ||
          cat.includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [rawProducts, selectedCorridor, selectedCategory, searchQuery]);

  // Sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let cmp = 0;
      const aTitle = a.title || a.productName || '';
      const bTitle = b.title || b.productName || '';
      const aCat = a.category || '';
      const bCat = b.category || '';

      if (sortBy === 'name') {
        cmp = aTitle.localeCompare(bTitle);
      } else if (sortBy === 'category') {
        cmp = aCat.localeCompare(bCat);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filteredProducts, sortBy, sortOrder]);

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
    // Navigate smoothly to homepage contact section
    window.location.href = `/#contact`;
  };

  const resetAllFilters = () => {
    setSelectedCorridor('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
  };

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
            <p className="text-lead max-w-3xl text-agro-neutral-200">
              {labels.pageSubtitle}
            </p>
          </div>
        </section>

        {/* Catalog Browser Section */}
        <SectionContainer id="catalog-browser" className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Multi-Dimensional Filter Control Bar */}
            <div className="bg-white/80 dark:bg-agro-neutral-900 border border-agro-primary-200/60 dark:border-agro-primary-800/60 rounded-2xl p-4 sm:p-6 shadow-sm mb-8 space-y-5">
              {/* Corridor Origin Tab Selector */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-agro-neutral-400 mb-2">
                  Trade Corridor
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCorridor('all')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedCorridor === 'all'
                        ? 'bg-agro-primary-700 text-white shadow-md'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700'
                    }`}
                  >
                    {labels.allCorridors}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCorridor('canada')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedCorridor === 'canada'
                        ? 'bg-agro-primary-700 text-white shadow-md'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700'
                    }`}
                  >
                    <Globe size={13} />
                    {labels.corridorCanada}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCorridor('africa')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedCorridor === 'africa'
                        ? 'bg-agro-primary-700 text-white shadow-md'
                        : 'bg-agro-primary-50 dark:bg-agro-neutral-800 text-agro-primary-900 dark:text-agro-neutral-200 hover:bg-agro-primary-100 dark:hover:bg-agro-neutral-700'
                    }`}
                  >
                    <Globe size={13} />
                    {labels.corridorAfrica}
                  </button>
                </div>
              </div>

              {/* Search, Category, and Sort Row */}
              <div className="flex flex-col lg:flex-row gap-3 pt-2 border-t border-agro-primary-100 dark:border-agro-primary-900/50">
                {/* Real-time Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={labels.searchPlaceholder}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full btn-agro-outline bg-white dark:bg-agro-neutral-850"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="w-full lg:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full btn-agro-outline bg-white dark:bg-agro-neutral-850 text-agro-primary-950 dark:text-agro-neutral-50">
                      <Filter size={14} className="mr-2" />
                      <SelectValue placeholder={labels.allCategories} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{labels.allCategories}</SelectItem>
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
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
                    aria-label="Toggle sort order"
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

            {/* Live Result Counter */}
            <div className="flex justify-between items-center mb-6 px-1">
              <p className="text-sm font-medium text-gray-600 dark:text-agro-neutral-300">
                {labels.showingCount(sortedProducts.length, rawProducts?.length || 0)}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-800 border border-red-200">
                <p className="text-sm font-semibold">Failed to load product catalog.</p>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && sortedProducts.length === 0 && (
              <div className="text-center py-16 bg-white/60 dark:bg-agro-neutral-900 rounded-2xl border border-dashed border-agro-primary-200 dark:border-agro-primary-800 p-8">
                <p className="text-base text-gray-600 dark:text-agro-neutral-300 mb-4">
                  {labels.noResults}
                </p>
                <Button onClick={resetAllFilters} variant="outline" className="btn-agro-outline">
                  {labels.resetFilters}
                </Button>
              </div>
            )}

            {/* Product Catalog Grid */}
            {!isLoading && sortedProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => {
                  const title = product.title || product.productName || 'Agricultural Commodity';
                  const origin = product.sourcingOrigin || '';
                  const category = product.category || '';
                  const image =
                    product.image ||
                    product.image1 ||
                    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop';

                  return (
                    <Card
                      key={product._id}
                      className="group flex flex-col overflow-hidden border border-agro-primary-200 dark:border-agro-primary-800 bg-white dark:bg-agro-neutral-900 hover:shadow-xl hover:bg-[#FDF8F0] dark:hover:bg-agro-neutral-850 transition-all duration-300 cursor-pointer"
                      onClick={() => handleCardClick(product)}
                    >
                      <div className="relative h-52 w-full overflow-hidden bg-white/50 dark:bg-agro-neutral-800">
                        <WixImage
                          src={image}
                          alt={title}
                          fill
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {origin && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-agro-neutral-900/95 text-agro-primary-800 dark:text-agro-primary-300 shadow-sm backdrop-blur-sm border border-agro-primary-100 dark:border-agro-primary-800">
                              <Globe size={11} className="text-agro-secondary-600" />
                              {origin}
                            </span>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        {category && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-agro-secondary-600 dark:text-agro-secondary-400">
                            {category}
                          </span>
                        )}
                        <CardTitle className="text-lg font-bold text-agro-primary-950 dark:text-agro-neutral-50 line-clamp-1">
                          {title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-4 flex-grow">
                        {product.description && (
                          <div
                            className="text-sm text-gray-600 dark:text-agro-neutral-300 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                          />
                        )}
                      </CardContent>

                      <CardFooter className="pt-0 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 btn-agro-outline text-xs h-9 cursor-pointer"
                          onClick={e => {
                            e.stopPropagation();
                            handleCardClick(product);
                          }}
                        >
                          {labels.viewSpecs}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 btn-agro-primary text-xs h-9 cursor-pointer flex items-center justify-center gap-1"
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

export default function ProductsClient() {
  return (
    <QuoteRequestProvider>
      <CatalogContent />
    </QuoteRequestProvider>
  );
}
