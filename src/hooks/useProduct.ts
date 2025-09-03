import { useQuery, useInfiniteQuery, QueryClient } from '@tanstack/react-query';
import { wixDataService } from '@/services/wix-data.service';
import { ProductContent as ProductContentType } from '@/types/wix';
import { ProductCategory as ProductCategoryType } from '@/services/wix-data.service';

// Type for the paginated response
interface PaginatedProducts {
  products: ProductContentType[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Type for infinite scroll response
interface InfiniteProducts {
  products: ProductContentType[];
  nextPage: number | undefined;
  totalPages: number;
}

// Enhanced error type for better error handling
interface ProductError {
  message: string;
  code?: string;
  retryAttempts?: number;
}

// Define strategic query keys for product data hierarchy
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number; category?: string }) =>
    [...productQueryKeys.lists(), filters] as const,
  infiniteList: (filters: { limit?: number; category?: string }) =>
    [...productQueryKeys.all, 'infinite', filters] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
  categories: () => [...productQueryKeys.all, 'categories'] as const,
  category: (id: string) => [...productQueryKeys.categories(), id] as const,
  search: (query: string) =>
    [...productQueryKeys.all, 'search', query] as const,
};

// Retry function with exponential backoff
const retryWithExponentialBackoff = (failureCount: number, error: unknown) => {
  // Don't retry on client-side errors (4xx)
  const errorObj = error as { response?: { status?: number } };
  if (
    errorObj?.response?.status !== undefined &&
    errorObj.response.status >= 400 &&
    errorObj.response.status < 500
  ) {
    return false;
  }

  // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const delay = Math.min(1000 * 2 ** failureCount, 30000);

  // Retry up to 3 times for server errors
  return failureCount < 3;
};

/**
 * Prefetches product detail data to improve loading experience
 * @param queryClient The React Query client instance
 * @param productId The ID of the product to prefetch
 */
export const prefetchProduct = async (
  queryClient: QueryClient,
  productId: string
) => {
  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: async () => {
      try {
        const response = await wixDataService.fetchProductsFromImport2();
        const product = response.items.find(
          item => item.data._id === productId
        )?.data;

        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        // Transform the service ProductContent to match the types ProductContent
        const transformedProduct: ProductContentType = {
          _id: product._id,
          _owner: product._owner,
          _createdDate: product._createdDate,
          _updatedDate: product._updatedDate,
          isActive: product.isActive,
          title: product.name || 'Agricultural Product',
          description: product.description,
          category: product.category,
          image1: product.images?.[0] || '',
        };

        return transformedProduct;
      } catch (error: unknown) {
        console.error(`Error prefetching product ${productId}:`, error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to prefetch product: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    retry: retryWithExponentialBackoff,
  });
};

/**
 * Prefetches product list data to improve loading experience
 * @param queryClient The React Query client instance
 * @param page The page number to prefetch
 * @param limit The number of items per page
 * @param category Optional category filter
 */
export const prefetchProductList = async (
  queryClient: QueryClient,
  page: number = 1,
  limit: number = 12,
  category?: string
) => {
  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.list({ page, limit, category }),
    queryFn: async () => {
      try {
        const response = await wixDataService.fetchProductsFromImport2();

        // Filter by category if provided
        let filteredItems = response.items;
        if (category) {
          filteredItems = response.items.filter(
            item => item.data.category?.toLowerCase() === category.toLowerCase()
          );
        }

        // Transform all products to match the types ProductContent
        const allProducts: ProductContentType[] = filteredItems.map(item => {
          const product = item.data;
          return {
            _id: product._id,
            _owner: product._owner,
            _createdDate: product._createdDate,
            _updatedDate: product._updatedDate,
            isActive: product.isActive,
            title: product.name || 'Agricultural Product',
            description: product.description,
            category: product.category,
            image1: product.images?.[0] || '',
          };
        });

        const totalCount = allProducts.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const products = allProducts.slice(startIndex, endIndex);

        return {
          products,
          totalCount,
          hasNextPage: endIndex < totalCount,
          hasPreviousPage: page > 1,
        };
      } catch (error: unknown) {
        console.error('Error prefetching products:', error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to prefetch products: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    retry: retryWithExponentialBackoff,
  });
};

/**
 * Custom hook to fetch individual product data from Wix CMS
 * Provides detailed product information with caching and error handling
 */
export const useProduct = (productId: string | null) => {
  return useQuery<ProductContentType, ProductError>({
    queryKey: productQueryKeys.detail(productId || ''),
    queryFn: async () => {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      try {
        // We need to transform the service ProductContent to match the types ProductContent
        const response = await wixDataService.fetchProductsFromImport2();
        const product = response.items.find(
          item => item.data._id === productId
        )?.data;

        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        // Transform the service ProductContent to match the types ProductContent
        const transformedProduct: ProductContentType = {
          _id: product._id,
          _owner: product._owner,
          _createdDate: product._createdDate,
          _updatedDate: product._updatedDate,
          isActive: product.isActive,
          title: product.name || 'Agricultural Product',
          description: product.description,
          category: product.category,
          image1: product.images?.[0] || '',
        };

        return transformedProduct;
      } catch (error: unknown) {
        console.error(`Error fetching product ${productId}:`, error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: retryWithExponentialBackoff,
    refetchOnWindowFocus: true, // Enable background updates when window regains focus
    refetchOnReconnect: true, // Enable background updates when connection is reestablished
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for fresh data
  });
};

/**
 * Custom hook to fetch a list of products with pagination
 * Provides paginated product listings with caching and error handling
 */
export const useProducts = (
  page: number = 1,
  limit: number = 12,
  category?: string
) => {
  return useQuery<PaginatedProducts, ProductError>({
    queryKey: productQueryKeys.list({ page, limit, category }),
    queryFn: async () => {
      try {
        const response = await wixDataService.fetchProductsFromImport2();

        // Filter by category if provided
        let filteredItems = response.items;
        if (category) {
          filteredItems = response.items.filter(
            item => item.data.category?.toLowerCase() === category.toLowerCase()
          );
        }

        // Transform all products to match the types ProductContent
        const allProducts: ProductContentType[] = filteredItems.map(item => {
          const product = item.data;
          return {
            _id: product._id,
            _owner: product._owner,
            _createdDate: product._createdDate,
            _updatedDate: product._updatedDate,
            isActive: product.isActive,
            title: product.name || 'Agricultural Product',
            description: product.description,
            category: product.category,
            image1: product.images?.[0] || '',
          };
        });

        const totalCount = allProducts.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const products = allProducts.slice(startIndex, endIndex);

        return {
          products,
          totalCount,
          hasNextPage: endIndex < totalCount,
          hasPreviousPage: page > 1,
        };
      } catch (error: unknown) {
        console.error('Error fetching products:', error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: retryWithExponentialBackoff,
    refetchOnWindowFocus: true, // Enable background updates when window regains focus
    refetchOnReconnect: true, // Enable background updates when connection is reestablished
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for fresh data
  });
};

/**
 * Custom hook to fetch products with infinite scrolling
 * Provides infinite scroll functionality with automatic pagination
 */
export const useInfiniteProducts = (limit: number = 12, category?: string) => {
  return useInfiniteQuery<InfiniteProducts, ProductError>({
    queryKey: productQueryKeys.infiniteList({ limit, category }),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await wixDataService.fetchProductsFromImport2();

        // Filter by category if provided
        let filteredItems = response.items;
        if (category) {
          filteredItems = response.items.filter(
            item => item.data.category?.toLowerCase() === category.toLowerCase()
          );
        }

        // Transform all products to match the types ProductContent
        const allProducts: ProductContentType[] = filteredItems.map(item => {
          const product = item.data;
          return {
            _id: product._id,
            _owner: product._owner,
            _createdDate: product._createdDate,
            _updatedDate: product._updatedDate,
            isActive: product.isActive,
            title: product.name || 'Agricultural Product',
            description: product.description,
            category: product.category,
            image1: product.images?.[0] || '',
          };
        });

        const totalCount = allProducts.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = ((pageParam as number) - 1) * limit;
        const endIndex = startIndex + limit;
        const products = allProducts.slice(startIndex, endIndex);

        return {
          products,
          nextPage:
            (pageParam as number) < totalPages
              ? (pageParam as number) + 1
              : undefined,
          totalPages,
        };
      } catch (error: unknown) {
        console.error('Error fetching products:', error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: retryWithExponentialBackoff,
    refetchOnWindowFocus: true, // Enable background updates when window regains focus
    refetchOnReconnect: true, // Enable background updates when connection is reestablished
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for fresh data
    initialPageParam: 1, // Add the missing initialPageParam
  });
};

/**
 * Custom hook to fetch product categories
 * Provides category information with caching and error handling
 */
export const useProductCategories = () => {
  return useQuery<ProductCategoryType[], ProductError>({
    queryKey: productQueryKeys.categories(),
    queryFn: async () => {
      try {
        const response = await wixDataService.fetchProductCategories();
        return response.items.map(item => item.data);
      } catch (error: unknown) {
        console.error('Error fetching product categories:', error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to fetch product categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: retryWithExponentialBackoff,
    refetchOnWindowFocus: true, // Enable background updates when window regains focus
    refetchOnReconnect: true, // Enable background updates when connection is reestablished
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes for fresh data (categories change less frequently)
  });
};

/**
 * Custom hook to search products by query term
 * Provides search functionality with caching and error handling
 */
export const useProductSearch = (query: string) => {
  return useQuery<ProductContentType[], ProductError>({
    queryKey: productQueryKeys.search(query),
    queryFn: async () => {
      if (!query) {
        return [];
      }

      try {
        const response = await wixDataService.fetchProductsFromImport2();

        // Filter products based on query term
        const filteredItems = response.items.filter(item => {
          const product = item.data;
          const searchTerm = query.toLowerCase();
          return (
            product.name?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm)
          );
        });

        // Transform all products to match the types ProductContent
        return filteredItems.map(item => {
          const product = item.data;
          return {
            _id: product._id,
            _owner: product._owner,
            _createdDate: product._createdDate,
            _updatedDate: product._updatedDate,
            isActive: product.isActive,
            title: product.name || 'Agricultural Product',
            description: product.description,
            category: product.category,
            image1: product.images?.[0] || '',
          };
        });
      } catch (error: unknown) {
        console.error(`Error searching products for query "${query}":`, error);

        // Create enhanced error object
        const enhancedError: ProductError = {
          message: `Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          retryAttempts: 0,
        };

        throw enhancedError;
      }
    },
    enabled: !!query,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // For search, retry only once and only for server errors
      const errorObj = error as { response?: { status?: number } };
      if (
        errorObj?.response?.status !== undefined &&
        errorObj.response.status >= 400 &&
        errorObj.response.status < 500
      ) {
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false, // Disable for search as it's user-initiated
    refetchOnReconnect: true, // Enable background updates when connection is reestablished
  });
};

const useProductHooks = {
  useProduct,
  useProducts,
  useInfiniteProducts,
  useProductCategories,
  useProductSearch,
  prefetchProduct,
  prefetchProductList,
};

export default useProductHooks;
