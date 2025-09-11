'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Filter, Search, SortDesc } from 'lucide-react';
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
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { ProductCategory } from '@/services/wix-data.service';
import QualityStandardsModal from '@/components/common/QualityStandardsModal';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { trackButtonClick, trackProductQuoteRequest } from '@/lib/analytics';

interface Product {
  _id: string;
  title?: string;
  name?: string;
  productName?: string;
  description: string;
  image?: string;
  image1?: string;
  categoryImage?: string;
  productCount?: number;
  category?: string;
  _owner?: string;
  _createdDate?: string | { $date: string };
  _updatedDate?: string | { $date: string };
  qualityStandards?: string; // Add quality standards field
}

interface CategoryWithProducts {
  _id: string;
  title?: string;
  categoryName?: string;
  allProducts?: Product[];
  [key: string]: unknown; // For other properties
}

interface ProductsSectionProps {
  data?: CategoryWithProducts[] | ProductCategory[];
  isLoading: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  data,
  isLoading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { scrollToSection } = useScrollToSection();
  const { setRequestedProduct, prefetchProductForQuote } = useQuoteRequest();

  // Use the new infinite products hook
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(12);

  // Combine data from infinite query with existing data prop
  const combinedData = infiniteData?.pages.flatMap(page => page.items) || [];
  const isDataLoading = isLoading || isFetchingNextPage;

  // Ensure we have a consistent data structure to prevent conditional hook issues
  const safeData = data || [];

  // Type guard to check if data is ProductCategory[]
  const isProductCategoryArray = (
    data: CategoryWithProducts[] | ProductCategory[]
  ): data is ProductCategory[] => {
    return (
      data.length > 0 &&
      (data as ProductCategory[])[0] &&
      'categoryImage' in (data as ProductCategory[])[0]
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
          // Add index signature properties
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

  // Check for category filter from sessionStorage on component mount
  useEffect(() => {
    const storedCategory = sessionStorage.getItem('selectedProductCategory');
    if (storedCategory) {
      setSelectedCategory(storedCategory);
      // Clear the sessionStorage item after using it
      sessionStorage.removeItem('selectedProductCategory');
    }

    // Listen for custom event from Footer component
    const handleCategorySelection = (event: CustomEvent) => {
      const { category } = event.detail;
      setSelectedCategory(category);
    };

    window.addEventListener(
      'productCategorySelected',
      handleCategorySelection as EventListener
    );

    return () => {
      window.removeEventListener(
        'productCategorySelected',
        handleCategorySelection as EventListener
      );
    };
  }, []);

  const defaultProducts = [
    {
      _id: 'category-1',
      title: 'Charcoal',
      description:
        'Durable, clean-burning charcoal made from sustainably sourced wood. Perfect for cooking, grilling, and artisanal uses.',
      image: '/charcoal.jpg',
      productCount: 15,
    },
    {
      _id: 'category-2',
      title: 'Fresh Kola nuts',
      description:
        'Fresh, handpicked kola nut with full natural aroma and potency. Perfect for culinary, cultural, and beverage applications.',
      image: '/fresh-kolanuts.jpg',
      productCount: 22,
    },
    {
      _id: 'category-3',
      title: 'Cocoa Pods',
      description:
        'Fresh cocoa pods with rich, aromatic pulp and beans. Ideal for chocolate production and artisanal cocoa products.',
      image: '/cocoa-pod.jpg',
      productCount: 18,
    },
  ];

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
          <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12 scroll-reveal px-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full md:w-64 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="scroll-reveal mb-8 md:mb-12 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Show 6 skeleton loaders */}
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  // Extract individual products from the allProducts array or use infinite data
  let individualProducts: Product[] =
    combinedData.length > 0 ? combinedData : [];

  // Check if data has allProducts at the collection level (as per the JSON structure)
  if (
    transformedData &&
    (transformedData as unknown as { allProducts?: Product[] }).allProducts
  ) {
    individualProducts = (
      transformedData as unknown as { allProducts: Product[] }
    ).allProducts;
  }
  // Check if any category has allProducts
  else if (transformedData && transformedData.length > 0) {
    const categoryWithProducts = transformedData.find(cat => {
      // Type guard to check if cat has allProducts property
      if ('allProducts' in cat && Array.isArray(cat.allProducts)) {
        return cat.allProducts.length > 0;
      }
      return false;
    });
    if (categoryWithProducts) {
      // Type guard to ensure categoryWithProducts has allProducts
      if (
        'allProducts' in categoryWithProducts &&
        Array.isArray(categoryWithProducts.allProducts)
      ) {
        individualProducts = categoryWithProducts.allProducts || [];
      }
    }
  }

  // Use individual products if available, otherwise fallback to categories or default
  const products =
    individualProducts && individualProducts.length > 0
      ? individualProducts
      : Array.isArray(transformedData)
        ? transformedData
        : defaultProducts;

  // Check if we're displaying individual products or categories
  const isDisplayingIndividualProducts =
    individualProducts && individualProducts.length > 0;

  // Debug: Log the data structures to see what we're working with
  // console.log('safeData:', safeData);
  // console.log('individualProducts:', individualProducts);
  // console.log('products:', products);
  // console.log('isDisplayingIndividualProducts:', isDisplayingIndividualProducts);

  // Map data to display format
  const mappedProducts = products
    .map((product, index) => {
      // Skip null or undefined products
      if (!product) {
        return null;
      }

      // Type guard to check if product is ProductCategory
      const isProductCategory = (p: unknown): p is ProductCategory => {
        return p !== null && typeof p === 'object' && 'categoryImage' in p;
      };

      const wixProduct = product as unknown as {
        name?: string;
        image1?: string;
        categoryImage?: string;
        category?: string;
      }; // Type assertion for Wix data structure
      const productWithName = product as Product; // Type assertion for Product with productName

      // Handle image source based on product type
      let imageSource =
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center&auto=format';
      if ('image' in product && typeof product.image === 'string') {
        imageSource = product.image;
      } else if (wixProduct.image1) {
        imageSource = wixProduct.image1;
      } else if (wixProduct.categoryImage) {
        imageSource = wixProduct.categoryImage;
      } else if (isProductCategory(product) && product.categoryImage) {
        imageSource = product.categoryImage;
      }

      // Handle title based on product type
      let title = 'Agricultural Product';
      if ('name' in product && typeof product.name === 'string') {
        title = product.name;
      } else if (wixProduct.name) {
        title = wixProduct.name;
      } else if ('title' in product && typeof product.title === 'string') {
        title = product.title;
      } else if (productWithName.productName) {
        title = productWithName.productName;
      } else if (productWithName.title) {
        title = productWithName.title;
      } else if (isProductCategory(product)) {
        title = product.title;
      }

      // Extract quality standards if available
      let qualityStandards = '';
      if (
        'qualityStandards' in product &&
        typeof product.qualityStandards === 'string'
      ) {
        qualityStandards = product.qualityStandards;
      } else if (
        product &&
        typeof product === 'object' &&
        'qualityStandards' in product &&
        typeof (product as { qualityStandards?: unknown }).qualityStandards ===
          'string'
      ) {
        qualityStandards = (product as { qualityStandards: string })
          .qualityStandards;
      }

      // Handle product count based on product type
      let productCount = 1;
      if (
        'productCount' in product &&
        typeof product.productCount === 'number'
      ) {
        productCount = product.productCount;
      }

      // Handle category based on product type
      let category = 'Not categorized';
      if ('category' in product && typeof product.category === 'string') {
        category = product.category;
      } else if (wixProduct.category) {
        category = wixProduct.category;
      } else if (isProductCategory(product)) {
        category = product.title;
      }

      // Ensure description is a string
      let description =
        'Premium agricultural product sourced from trusted suppliers.';
      if (typeof product.description === 'string') {
        description = product.description;
      } else if (
        product.description &&
        typeof product.description === 'object'
      ) {
        // If description is an object, convert to string
        description = JSON.stringify(product.description);
      }

      return {
        _id: product._id || `product-${index}`, // Fallback to index if no _id
        title,
        description,
        image: imageSource,
        productCount,
        category,
        qualityStandards, // Include quality standards in the mapped product
      };
    })
    .filter(product => product !== null) as {
    _id: string;
    title: string;
    description: string;
    image: string;
    productCount: number;
    category: string;
    qualityStandards: string; // Add quality standards to the type
  }[]; // Filter out null values

  // Get unique categories for filter dropdown
  const categories = [
    'all',
    ...new Set(mappedProducts.map(p => p.category.toLowerCase())),
  ];

  // Filter products by category
  const categoryFilteredProducts =
    selectedCategory === 'all'
      ? mappedProducts
      : mappedProducts.filter(
          p => p.category.toLowerCase() === selectedCategory
        );

  // Filter products by search query
  const searchFilteredProducts = categoryFilteredProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  // Sort products
  const sortedProducts = [...searchFilteredProducts].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle quote request button click
  const handleRequestQuote = (productTitle: string, productId: string) => {
    // Set the requested product in context with both name and ID
    // Ensure we use the correctly mapped product title
    const cleanProductTitle = productTitle || 'Agricultural Product';
    setRequestedProduct({ name: cleanProductTitle, id: productId });

    // Track product quote request
    trackProductQuoteRequest(cleanProductTitle, productId);

    // Prefetch product data for better performance in the quote flow
    prefetchProductForQuote(productId);

    // Scroll to contact section
    scrollToSection('contact', 100);
  };

  // Handle card click to open quality standards modal
  const handleCardClick = (product: Product) => {
    // Track button click
    trackButtonClick('product_card_click', {
      product_name: product.title || product.name || 'Unknown Product',
      product_id: product._id,
    });

    // Open modal regardless of whether quality standards data exists
    // The modal will handle displaying a message if no data is available
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle quote request from modal
  const handleQuoteRequestFromModal = (productName: string) => {
    if (selectedProduct) {
      handleRequestQuote(productName, selectedProduct._id);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle load more products
  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <SectionContainer id="products" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="heading-section text-[#281909]">
            {isDisplayingIndividualProducts
              ? 'Our Premium Products'
              : 'Product Categories'}
          </h2>
          <p className="text-lead max-w-3xl mx-auto text-[#281909]">
            {isDisplayingIndividualProducts
              ? 'Explore our complete collection of premium agricultural products, carefully sourced and selected for quality and authenticity'
              : 'Discover our comprehensive range of premium agricultural products sourced from trusted global partners'}
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12 scroll-reveal px-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full btn-agro-outline"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full btn-agro-outline bg-white dark:bg-agro-neutral-900 border-agro-primary-200 dark:border-agro-primary-700 text-agro-primary-900 dark:text-agro-neutral-50">
                <Filter size={14} className="mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories
                  .filter(cat => cat !== 'all')
                  .map(category => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-agro-primary-900 dark:text-agro-neutral-50"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 btn-agro-outline bg-white dark:bg-agro-neutral-900 border-agro-primary-200 dark:border-agro-primary-700 text-agro-primary-900 dark:text-agro-neutral-50">
                <SortDesc size={14} className="mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="name"
                  className="text-agro-primary-900 dark:text-agro-neutral-50"
                >
                  Name
                </SelectItem>
                <SelectItem
                  value="category"
                  className="text-agro-primary-900 dark:text-agro-neutral-50"
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

        {/* Results Count */}
        <div className="px-4 mb-4">
          <p className="text-sm text-gray-600 dark:text-agro-neutral-200">
            Showing {sortedProducts.length} of {mappedProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="scroll-reveal mb-8 md:mb-12 px-4">
          {sortedProducts && sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(
                product =>
                  product &&
                  product._id && (
                    <Card
                      key={product._id}
                      className="flex cursor-pointer flex-col overflow-hidden gap-3 border-[#281909] hover:shadow-lg transition-all duration-300 border border-agro-primary-200 dark:border-agro-primary-700 bg-white dark:bg-agro-neutral-900 hover:bg-[#FDF8F0] dark:hover:bg-agro-neutral-800"
                      onClick={() => handleCardClick(product)} // Add click handler for the entire card
                    >
                      <div
                        className="overflow-hidden rounded-t-lg relative wix-image-container"
                        style={{ height: '12rem' }}
                      >
                        <WixImage
                          src={
                            product.image ||
                            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center&auto=format'
                          }
                          alt={product.title || 'Product image'}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-2">
                          {product.title || 'Product Title'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3 flex-grow">
                        {/* <p className="text-gray-600 dark:text-agro-neutral-300 line-clamp-3">
                          {product.description || 'Product description'}
                        </p> */}
                        <div
                          className="text-gray-600 dark:text-agro-neutral-300 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html:
                              product.description || 'Product description',
                          }}
                        />
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={e => {
                            e.stopPropagation(); // Prevent card click event from firing
                            handleRequestQuote(product.title, product._id);
                          }}
                        >
                          {isDisplayingIndividualProducts
                            ? 'Request Quote'
                            : 'View Details'}
                          <ArrowRight size={14} className="ml-2" />
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

        {/* Load More Button */}
        {hasNextPage && (
          <div className="text-center mb-8">
            <Button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="btn-agro-primary"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More Products'}
            </Button>
          </div>
        )}

        {/* Add the Quality Standards Modal */}
        {selectedProduct && (
          <QualityStandardsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            productName={
              selectedProduct.title ||
              selectedProduct.name ||
              selectedProduct.productName ||
              'Product'
            }
            qualityStandards={selectedProduct.qualityStandards || ''} // Pass the quality standards data
            onRequestQuote={handleQuoteRequestFromModal} // Pass the quote request handler
          />
        )}

        {/* Call to Action */}
        <div className="text-center scroll-reveal px-4 mt-[4rem]">
          <div className="glass-card p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="heading-subsection mb-3 md:mb-4">
              Quality You Can Trust. Supply You Can Rely On Always.
            </h3>
            <p className="text-body mb-6 md:mb-8 max-w-2xl mx-auto">
              AgroVentia delivers Africa&#39;s best consistently, transparently,
              and on time. Every shipment is managed with precision,
              professionalism, and integrity; so you can focus on scaling your
              business. Partner with us, and grow with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                size="lg"
                className="btn-agro-primary text-sm md:text-base py-3 md:py-4 cursor-pointer"
                onClick={() => scrollToSection('contact')}
              >
                Request Product Catalog
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="btn-agro-outline text-sm md:text-base py-3 md:py-4 cursor-pointer"
                onClick={() => scrollToSection('contact')}
              >
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ProductsSection;
