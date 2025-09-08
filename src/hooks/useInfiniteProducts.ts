import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductContent } from '@/services/wix-data.service';

// Use the proper ProductContent type from wix-data.service.ts instead of defining our own
interface ProductsResponse {
  items: ProductContent[];
  hasNext: boolean;
  totalCount: number;
}

/**
 * Custom hook to fetch products with infinite pagination
 * @param limit Number of products to fetch per page (default: 12)
 */
export const useInfiniteProducts = (limit: number = 6) => {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ['products', limit],
    queryFn: async ({ pageParam = 1 }) => {
      // Pass pagination parameters to the API
      const response = await fetch(
        `/api/collections/Import2?page=${pageParam}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Fix: Remove explicit 'any' type and use proper typing
      return {
        items: data.items.map(
          (item: { data: ProductContent } | ProductContent) =>
            'data' in item ? item.data : item
        ),
        hasNext: data.hasNext || false,
        totalCount: data.totalCount || data.items.length,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
