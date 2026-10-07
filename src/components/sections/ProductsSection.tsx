'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Globe, Search, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import SectionContainer from '@/components/common/SectionContainer';
import WixImage from '@/components/WixImage';
import useScrollToSection from '@/hooks/useScrollToSection';
import { useQuoteRequest } from '@/contexts/QuoteRequestContext';
import { useLocale } from '@/contexts/LocaleContext';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { ProductCategory } from '@/services/wix-data.service';
import QualityStandardsModal from '@/components/common/QualityStandardsModal';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { useProductsSectionContent } from '@/hooks/useContent';
import { trackButtonClick, trackProductQuoteRequest } from '@/lib/analytics';
import { FLAGSHIP_FEATURED_SLUGS } from '@/lib/api/products-portfolio';

import type { ProductCatalogItem } from '@/types/wix';

export interface Product {
  _id: string;
  title?: string;
  name?: string;
  productName?: string;
  slug?: string;
  description?: string;
  image?: string;
  image1?: string;
  categoryImage?: string;
  productCount?: number;
  category?: string;
  sourcingOrigin?: string;
  typicalQualityParameters?: string;
  qualityStandards?: string; // Legacy parameter field maintained for backward compatibility
  isFeatured?: boolean;
  displayLogistics?: boolean;
  packagingLogistics?: string;
  sku?: string;
  _owner?: string;
  _createdDate?: string | { $date: string };
  _updatedDate?: string | { $date: string };
}

interface CategoryWithProducts {
  _id: string;
  title?: string;
  categoryName?: string;
  allProducts?: Product[];
  [key: string]: unknown; // For other properties
}

export interface ProductsSectionProps {
  data?: CategoryWithProducts[] | ProductCategory[] | ProductCatalogItem[] | Product[];
  isLoading: boolean;
  featuredOnly?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  data,
  isLoading,
  featuredOnly = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { scrollToSection } = useScrollToSection();
  const { setRequestedProduct, prefetchProductForQuote } = useQuoteRequest();
  const { data: sectionConfig } = useProductsSectionContent();
  const { locale } = useLocale();

  const isFrench = locale?.startsWith('fr');
  const isSpanish = locale?.startsWith('es') || locale === 'esp';

  const labels = {
    featuredTitle: isFrench
      ? 'Commodités phares et origines commerciales'
      : isSpanish
        ? 'Productos agrícolas destacados y orígenes comerciales'
        : 'Featured Commodities & Trade Origins',
    featuredEyebrow: isFrench
      ? 'PORTEFEUILLE MONDIAL D’ORIGINATION'
      : isSpanish
        ? 'PORTAFOLIO GLOBAL DE ORIGINACIÓN'
        : 'GLOBAL ORIGINATION PORTFOLIO',
    featuredSubtitle: isFrench
      ? 'Sélection rigoureuse de produits agricoles haut de gamme issus des corridors canadien et ouest-africain.'
      : isSpanish
        ? 'Selección rigurosa de productos agrícolas de primera calidad procedentes de los corredores canadiense y de África Occidental.'
        : 'Rigorous selection of premium agricultural commodities sourced across Canadian and West African trade corridors.',
    viewSpecs: isFrench
      ? 'Détails et spécifications'
      : isSpanish
        ? 'Detalles y especificaciones'
        : 'View Details / Specs',
    requestQuote: isFrench
      ? 'Demander un devis'
      : isSpanish
        ? 'Solicitar cotización'
        : 'Request Quote',
    anchorTitle: isFrench
      ? 'À la recherche de grades ou légumineuses spécialisés ?'
      : isSpanish
        ? '¿Busca calidades o legumbres especializadas?'
        : 'Looking for specialized grades, pulses, or specialty crops?',
    anchorDesc: isFrench
      ? 'Explorez notre répertoire complet de plus de 40 commodités avec fiches techniques et origines de traçabilité.'
      : isSpanish
        ? 'Explore nuestro directorio completo de más de 40 productos básicos con especificaciones técnicas y trazabilidad.'
        : 'Explore our complete 40+ commodity directory with detailed quality parameters and transparent corridor origin.',
    exploreCatalog: isFrench
      ? 'Explorer le catalogue complet (43+ commodités) →'
      : isSpanish
        ? 'Explorar el catálogo completo (43+ productos) →'
        : 'Explore Full Product Catalog (43+ Commodities) →',
  };

  // Use the infinite products hook
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteProducts(6);

  const isDataLoading = data !== undefined ? isLoading : (isLoading || isInfiniteLoading);

  // Ensure consistent data structure to prevent conditional hook issues
  const safeData = data || [];

  // Type guard to check if data is ProductCategory[]
  const isProductCategoryArray = (
    dataArr: unknown[]
  ): dataArr is ProductCategory[] => {
    return (
      dataArr.length > 0 &&
      Boolean(dataArr[0]) &&
      typeof dataArr[0] === 'object' &&
      'categoryImage' in (dataArr[0] as object)
    );
  };

  // Transform ProductCategory[] to CategoryWithProducts[] if needed
  const transformedData = Array.isArray(safeData)
    ? isProductCategoryArray(safeData)
      ? safeData.map(category => ({
        _id: category._id,
        title: category.title,
        categoryName: category.title,
        description: category.description,
        image: category.categoryImage,
        categoryImage: category.categoryImage,
        allProducts: category.allProducts,
        productReferences_data: category.productReferences_data,
        ...Object.fromEntries(
          Object.entries(category).filter(
            ([key]) =>
              ![
                '_id',
                'title',
                'description',
                'categoryImage',
                'allProducts',
                'productReferences_data',
              ].includes(key)
          )
        ),
      }))
      : safeData
    : [];

  if (isDataLoading) {
    return (
      <SectionContainer id="products" background="gradient">
        <div className="max-w-6xl mx-auto">
          {/* Section Header Skeleton */}
          <div className="text-center mb-16 scroll-reveal">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
          </div>

          {/* Search and Filter Controls Skeleton */}
          {!featuredOnly && (
            <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12 scroll-reveal px-4">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full md:w-64 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Products Grid Skeleton */}
          <div className="scroll-reveal mb-8 md:mb-12 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  // Check if safeData directly contains individual products (e.g. from useProductCatalogContent)
  const isDirectProductArray =
    Array.isArray(safeData) &&
    safeData.length > 0 &&
    !isProductCategoryArray(safeData);

  // Extract individual products: prioritize direct product array, then category products, then infinite query
  let individualProducts: Product[] = [];

  if (isDirectProductArray) {
    individualProducts = safeData as Product[];
  } else if (
    transformedData &&
    (transformedData as unknown as { allProducts?: Product[] }).allProducts
  ) {
    individualProducts = (
      transformedData as unknown as { allProducts: Product[] }
    ).allProducts;
  } else if (transformedData && transformedData.length > 0) {
    const categoryWithProducts = transformedData.find(cat => {
      if ('allProducts' in cat && Array.isArray(cat.allProducts)) {
        return cat.allProducts.length > 0;
      }
      return false;
    });
    if (categoryWithProducts && 'allProducts' in categoryWithProducts && Array.isArray(categoryWithProducts.allProducts)) {
      individualProducts = categoryWithProducts.allProducts || [];
    }
  } else if (infiniteData && infiniteData.pages && infiniteData.pages.length > 0) {
    individualProducts = infiniteData.pages.flatMap(page => page.items);
  }

  const effectiveIndividualProducts = individualProducts;
  const defaultProducts: Product[] = [];

  const isDisplayingIndividualProducts =
    effectiveIndividualProducts && effectiveIndividualProducts.length > 0;

  const products =
    isDisplayingIndividualProducts
      ? effectiveIndividualProducts
      : Array.isArray(transformedData)
        ? transformedData
        : defaultProducts;

  // Map data to display format
  const mappedProducts: Product[] = (products
    .map((product: CategoryWithProducts | Product, index: number) => {
      if (!product) {
        return null;
      }

      const isProductCategory = (p: unknown): p is ProductCategory => {
        return p !== null && typeof p === 'object' && 'categoryImage' in p;
      };

      const wixProduct = product as unknown as {
        name?: string;
        image1?: string;
        categoryImage?: string;
        category?: string;
      };
      const productObj = product as Product;

      let imageSource =
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center&auto=format';

      const potentialImages = [
        'image' in product && typeof product.image === 'string' && product.image,
        productObj.image1 && typeof productObj.image1 === 'string' && productObj.image1,
        wixProduct.categoryImage && typeof wixProduct.categoryImage === 'string' && wixProduct.categoryImage,
        isProductCategory(product) && product.categoryImage && typeof product.categoryImage === 'string' && product.categoryImage,
      ].filter(Boolean) as string[];

      if (potentialImages.length > 0) {
        imageSource = potentialImages[0];
      }

      let title = '';
      if ('name' in product && typeof product.name === 'string' && product.name) {
        title = product.name;
      } else if (wixProduct.name && typeof wixProduct.name === 'string') {
        title = wixProduct.name;
      } else if ('title' in product && typeof product.title === 'string' && product.title) {
        title = product.title;
      } else if (productObj.productName && typeof productObj.productName === 'string') {
        title = productObj.productName;
      } else if (isProductCategory(product) && product.title && typeof product.title === 'string') {
        title = product.title;
      }

      // Extract quality parameters
      let typicalQualityParameters = '';
      if ('typicalQualityParameters' in product && typeof (product as Product).typicalQualityParameters === 'string') {
        typicalQualityParameters = (product as Product).typicalQualityParameters || '';
      } else if ('qualityStandards' in product && typeof (product as Product).qualityStandards === 'string') {
        typicalQualityParameters = (product as Product).qualityStandards || '';
      }

      let productCount = 1;
      if ('productCount' in product && typeof product.productCount === 'number') {
        productCount = product.productCount;
      }

      let category = '';
      if ('category' in product && typeof product.category === 'string' && product.category) {
        category = product.category;
      } else if (wixProduct.category && typeof wixProduct.category === 'string') {
        category = wixProduct.category;
      } else if (isProductCategory(product) && product.title && typeof product.title === 'string') {
        category = product.title;
      }

      let description = '';
      if (typeof product.description === 'string') {
        description = product.description;
      } else if (product.description && typeof product.description === 'object') {
        description = JSON.stringify(product.description);
      }

      let id = `product-${index}`;
      if (productObj._id && typeof productObj._id === 'string') {
        id = productObj._id;
      }

      const slug = productObj.slug || '';
      const sourcingOrigin = productObj.sourcingOrigin || '';
      const isFeatured = Boolean(productObj.isFeatured);
      const displayLogistics = Boolean(productObj.displayLogistics);
      const packagingLogistics = productObj.packagingLogistics || '';

      return {
        _id: id,
        title,
        slug,
        description,
        image: imageSource,
        productCount,
        category,
        sourcingOrigin,
        typicalQualityParameters,
        qualityStandards: typicalQualityParameters,
        isFeatured,
        displayLogistics,
        packagingLogistics,
      };
    })
    .filter(Boolean)) as Product[];

  // Get unique categories for filter dropdown
  const categories = [
    'all',
    ...Array.from(
      new Set(
        mappedProducts
          .map(p => (p.category ? p.category.trim().toLowerCase() : ''))
          .filter(cat => Boolean(cat) && cat.length > 0)
      )
    ),
  ];

  // Filter products by category
  const categoryFilteredProducts =
    selectedCategory === 'all'
      ? mappedProducts
      : mappedProducts.filter(
        p => p.category && p.category.toLowerCase() === selectedCategory
      );

  // Filter products by search query
  const searchFilteredProducts = categoryFilteredProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (product.title && product.title.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower)) ||
      (product.sourcingOrigin && product.sourcingOrigin.toLowerCase().includes(searchLower))
    );
  });

  // Sort products
  const sortedProducts = [...searchFilteredProducts].sort((a, b) => {
    let comparison = 0;
    const aTitle = a.title || '';
    const bTitle = b.title || '';
    const aCat = a.category || '';
    const bCat = b.category || '';

    switch (sortBy) {
      case 'name':
        comparison = aTitle.localeCompare(bTitle);
        break;
      case 'category':
        comparison = aCat.localeCompare(bCat);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Determine display list: if featuredOnly is requested, curate exactly 9 items
  let displayProducts = sortedProducts;
  if (featuredOnly) {
    const featuredItems = mappedProducts.filter(p => p.isFeatured);
    if (featuredItems.length >= 9) {
      displayProducts = featuredItems.slice(0, 9);
    } else {
      const flagshipItems = mappedProducts.filter(p =>
        FLAGSHIP_FEATURED_SLUGS.some(
          slug => p.slug === slug || p._id === slug || p._id === `prod-${slug}`
        )
      );
      const combined = [
        ...featuredItems,
        ...flagshipItems.filter(f => !featuredItems.some(item => item._id === f._id)),
      ];
      if (combined.length >= 9) {
        displayProducts = combined.slice(0, 9);
      } else {
        const remaining = mappedProducts.filter(
          p => !combined.some(item => item._id === p._id)
        );
        displayProducts = [...combined, ...remaining].slice(0, 9);
      }
    }
  }

  // Handle quote request button click
  const handleRequestQuote = (productTitle: string, productId: string) => {
    const cleanProductTitle = productTitle || '';
    setRequestedProduct({ name: cleanProductTitle, id: productId });
    trackProductQuoteRequest(cleanProductTitle, productId);
    prefetchProductForQuote(productId);
    scrollToSection('contact', 100);
  };

  // Handle card click to open Typical Quality Parameters modal
  const handleCardClick = (product: Product) => {
    trackButtonClick('product_card_click', {
      product_name: product.title || product.name || '',
      product_id: product._id,
    });
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuoteRequestFromModal = (productName: string) => {
    if (selectedProduct) {
      handleRequestQuote(productName, selectedProduct._id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <SectionContainer id="products" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 scroll-reveal">
          {featuredOnly && (
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-agro-secondary-600 dark:text-agro-secondary-400 mb-2 block">
              {labels.featuredEyebrow}
            </span>
          )}
          <h2 className="heading-section text-agro-primary-950 dark:text-agro-neutral-50">
            {featuredOnly
              ? labels.featuredTitle
              : isDisplayingIndividualProducts
                ? (sectionConfig?.sectionTitle || 'Our Premium Products')
                : (sectionConfig?.categoriesTitle || 'Product Categories')}
          </h2>
          <p className="text-lead max-w-3xl mx-auto text-gray-700 dark:text-agro-neutral-300">
            {featuredOnly
              ? labels.featuredSubtitle
              : isDisplayingIndividualProducts
                ? (sectionConfig?.sectionDescription ||
                  'Explore our complete collection of premium agricultural products, carefully sourced and selected for quality and authenticity')
                : (sectionConfig?.categoriesSubtitle ||
                  'Discover our comprehensive range of premium agricultural products sourced from trusted global partners')}
          </p>
        </div>

        {/* Search and Filter Controls (only rendered when browsing full catalog) */}
        {!featuredOnly && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12 scroll-reveal px-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={sectionConfig?.searchPlaceholder || 'Search products...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full btn-agro-outline"
                />
              </div>

              <div className="w-full md:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full btn-agro-outline bg-white dark:bg-agro-neutral-900 border-agro-primary-200 dark:border-agro-primary-700 text-agro-primary-900 dark:text-agro-neutral-50 cursor-pointer hover:text-gray-400">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All Categories
                    </SelectItem>
                    {categories
                      .filter(cat => Boolean(cat) && typeof cat === 'string' && cat.trim() !== '' && cat !== 'all')
                      .map(category => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="text-agro-primary-900 dark:text-agro-neutral-50 hover:text-gray-400 cursor-pointer"
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 btn-agro-outline bg-white dark:bg-agro-neutral-900 border-agro-primary-200 dark:border-agro-primary-700 text-agro-primary-900 dark:text-agro-neutral-50 cursor-pointer hover:text-gray-400">
                    <SortDesc size={14} className="mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="name"
                      className="text-agro-primary-900 dark:text-agro-neutral-50 hover:text-gray-400 cursor-pointer"
                    >
                      Name
                    </SelectItem>
                    <SelectItem
                      value="category"
                      className="text-agro-primary-900 dark:text-agro-neutral-50 hover:text-gray-400 cursor-pointer"
                    >
                      Category
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSortOrder}
                  className="btn-agro-outline"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            <div className="px-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-agro-neutral-200">
                Showing {sortedProducts.length} of {mappedProducts.length} products
              </p>
            </div>
          </>
        )}

        {/* Products Grid (3x3 on desktop) */}
        <div className="scroll-reveal mb-8 md:mb-12 px-4">
          {displayProducts && displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayProducts.map(
                product =>
                  product &&
                  product._id && (
                    <Card
                      key={`${product._id}-${product.image}-${sortBy}-${sortOrder}`}
                      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-agro-primary-200/60 dark:border-agro-primary-800/40 bg-white/90 dark:bg-agro-neutral-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-agro-neutral-850 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-agro-primary-400 dark:hover:border-agro-primary-600 transition-all duration-300"
                      onClick={() => handleCardClick(product)}
                    >
                      <div className="flex flex-col flex-grow">
                        {/* Image Canvas: Fixed 4:3 Aspect Container with pure white background */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-white border-b border-agro-primary-100/60 dark:border-agro-primary-900/40 flex items-center justify-center p-3">
                          <WixImage
                            key={product.image}
                            src={
                              product.image ||
                              'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center&auto=format'
                            }
                            alt={product.title || 'Product image'}
                            fill
                            className="object-contain w-full h-full max-h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.sourcingOrigin && (
                            <div className="absolute top-3 left-3 z-10">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-agro-neutral-900/95 text-agro-primary-900 dark:text-agro-primary-200 shadow-sm backdrop-blur-md border border-agro-primary-200/60 dark:border-agro-primary-800/60">
                                {product.sourcingOrigin.toLowerCase().match(/canada|prairie|saskatchewan|alberta|manitoba|ontario/) ? (
                                  <span aria-hidden="true">🍁</span>
                                ) : (
                                  <Globe size={11} className="text-agro-secondary-600" />
                                )}
                                <span>{product.sourcingOrigin}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <CardHeader className="pb-2 pt-4 px-5">
                          {product.category && (
                            <span className="text-xs font-bold uppercase tracking-wider text-agro-secondary-600 dark:text-agro-secondary-400">
                              {product.category}
                            </span>
                          )}
                          {product.title && (
                            <CardTitle className="line-clamp-1 text-lg font-bold text-agro-primary-950 dark:text-agro-neutral-50 group-hover:text-agro-primary-700 dark:group-hover:text-agro-primary-300 transition-colors">
                              {product.title}
                            </CardTitle>
                          )}
                        </CardHeader>
                        <CardContent className="pb-3 px-5 flex-grow">
                          {product.description && (
                            <div
                              className="text-gray-600 dark:text-agro-neutral-300 text-sm line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: product.description,
                              }}
                            />
                          )}
                        </CardContent>
                      </div>

                      <CardFooter className="pt-2 pb-5 px-5 flex items-center gap-2.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 btn-agro-outline text-xs h-9 font-semibold cursor-pointer"
                          onClick={e => {
                            e.stopPropagation();
                            handleCardClick(product);
                          }}
                        >
                          {labels.viewSpecs}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 btn-agro-primary text-xs h-9 font-semibold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleRequestQuote(product.title || '', product._id);
                          }}
                        >
                          {labels.requestQuote}
                          <ArrowRight size={12} />
                        </Button>
                      </CardFooter>
                    </Card>
                  )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 dark:text-agro-neutral-400">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Load More Button (only for infinite query mode when not in featuredOnly) */}
        {!featuredOnly && hasNextPage && (
          <div className="text-center mb-8">
            <Button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="btn-agro-primary cursor-pointer"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More Products'}
            </Button>
          </div>
        )}

        {/* Anchor CTA Banner to Dedicated /products Catalog (Homepage Featured Mode) */}
        {featuredOnly && (
          <div className="text-center px-4 mt-12 mb-4 scroll-reveal">
            <div className="bg-white/80 dark:bg-agro-neutral-900/90 backdrop-blur-md border border-agro-primary-200/60 dark:border-agro-primary-800/60 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-left max-w-xl">
                <h4 className="text-lg sm:text-xl font-bold text-agro-primary-950 dark:text-agro-neutral-50 mb-1">
                  {labels.anchorTitle}
                </h4>
                <p className="text-sm text-gray-600 dark:text-agro-neutral-300">
                  {labels.anchorDesc}
                </p>
              </div>
              <Link href="/products" className="shrink-0 w-full sm:w-auto">
                <Button size="lg" className="btn-agro-primary w-full sm:w-auto flex items-center justify-center gap-2 px-6 shadow-md hover:shadow-lg">
                  {labels.exploreCatalog}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Typical Quality Parameters Modal */}
        {selectedProduct && (
          <QualityStandardsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            productName={
              selectedProduct.title ||
              selectedProduct.name ||
              selectedProduct.productName ||
              ''
            }
            product={selectedProduct}
            typicalQualityParameters={selectedProduct.typicalQualityParameters || selectedProduct.qualityStandards || ''}
            qualityStandards={selectedProduct.qualityStandards || ''}
            onRequestQuote={handleQuoteRequestFromModal}
          />
        )}

        {/* Call to Action */}
        {sectionConfig?.ctaBanner?.isActive !== false && (
          <div className="text-center scroll-reveal px-4 mt-[4rem]">
            <div className="glass-card p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
              <h3 className="heading-subsection mb-3 md:mb-4">
                {sectionConfig?.ctaBanner?.heading ||
                  'Quality You Can Trust. Supply You Can Rely On Always.'}
              </h3>
              <p className="text-body mb-6 md:mb-8 max-w-2xl mx-auto">
                {sectionConfig?.ctaBanner?.description ||
                  "AgroVentia Inc. delivers Africa's best consistently, transparently, and on time. Every shipment is managed with precision, professionalism, and integrity; so you can focus on scaling your business. Partner with us, and grow with confidence."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button
                  size="lg"
                  className="btn-agro-primary text-sm md:text-base py-3 md:py-4 cursor-pointer"
                  onClick={() => scrollToSection('contact')}
                >
                  {sectionConfig?.ctaBanner?.primaryButtonText || 'Request Product Catalog'}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="btn-agro-outline text-sm md:text-base py-3 md:py-4 cursor-pointer"
                  onClick={() => scrollToSection('contact')}
                >
                  {sectionConfig?.ctaBanner?.secondaryButtonText || 'Schedule a Call'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default ProductsSection;
