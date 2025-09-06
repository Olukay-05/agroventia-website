'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Filter, Search, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const { scrollToSection } = useScrollToSection();
  const { setRequestedProduct, prefetchProductForQuote } = useQuoteRequest();

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
      title: 'Farm Equipment',
      description:
        'Modern farming equipment and machinery for efficient agricultural operations.',
      image:
        'https://images.unsplash.com/photo-1634584604333-75c849472112?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx0cmFjdG9yJTIwZmFybSUyMGVxdWlwbWVudCUyMG1hY2hpbmVyeSUyMGhhcnZlc3RlcnxlbnwwfDB8fHwxNzU2MjE4Mzc0fDA&ixlib=rb-4.1.0&q=85',
      productCount: 25,
    },
    {
      _id: 'category-2',
      title: 'Crop Protection',
      description:
        'Advanced crop protection solutions including pesticides and disease management products.',
      image:
        'https://images.unsplash.com/photo-1708266658968-a9e1dc40ab17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxjcm9wJTIwc3ByYXlpbmclMjBwbGFudCUyMHByb3RlY3Rpb24lMjBhZ3JpY3VsdHVyZSUyMHBlc3RpY2lkZXxlbnwwfDB8fGdyZWVufDE3NTYyMTgzNzR8MA&ixlib=rb-4.1.0&q=85',
      productCount: 18,
    },
    {
      _id: 'category-3',
      title: 'Fertilizers & Nutrients',
      description:
        'Premium fertilizers and plant nutrients for optimal crop growth and yield.',
      image:
        'https://images.unsplash.com/photo-1682785868646-f2353d226849?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxmZXJ0aWxpemVyJTIwcGxhbnQlMjBudXRyaWVudHMlMjBzb2lsJTIwYWdyaWN1bHR1cmV8ZW58MHwwfHx8MTc1NjIxODM3NHww&ixlib=rb-4.1.0&q=85',
      productCount: 32,
    },
  ];

  if (isLoading) {
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

  // Extract individual products from the allProducts array
  let individualProducts: Product[] = [];

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

      return {
        _id: product._id || `product-${index}`, // Fallback to index if no _id
        title,
        description:
          product.description ||
          'Premium agricultural product sourced from trusted suppliers.',
        image: imageSource,
        productCount,
        category,
      };
    })
    .filter(product => product !== null) as {
    _id: string;
    title: string;
    description: string;
    image: string;
    productCount: number;
    category: string;
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

    // Prefetch product data for better performance in the quote flow
    prefetchProductForQuote(productId);

    // Scroll to contact section
    scrollToSection('contact', 100);
  };

  return (
    <SectionContainer
      id="products"
      background="gradient"
      padding="large"
      data-testid="products-section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="heading-section">
            {isDisplayingIndividualProducts
              ? 'Our Premium Products'
              : 'Product Categories'}
          </h2>
          <p className="text-lead max-w-3xl mx-auto">
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
                      className="flex cursor-pointer flex-col overflow-hidden gap-3 hover:shadow-lg transition-shadow duration-300"
                      onMouseEnter={() => setHoveredProductId(product._id)}
                      onMouseLeave={() => setHoveredProductId(null)}
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
                        {hoveredProductId === product._id && (
                          <Badge className="absolute top-2 right-2 bg-green-600 text-white z-10">
                            {isDisplayingIndividualProducts
                              ? 'In Stock'
                              : `${product.productCount} Products`}
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-2">
                          {product.title || 'Product Title'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3 flex-grow">
                        <p className="text-gray-600 dark:text-agro-neutral-300 line-clamp-3">
                          {product.description || 'Product description'}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            handleRequestQuote(product.title, product._id)
                          }
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
                className="btn-agro-primary text-sm md:text-base py-3 md:py-4"
              >
                Request Product Catalog
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="btn-agro-outline text-sm md:text-base py-3 md:py-4"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ProductsSection;
