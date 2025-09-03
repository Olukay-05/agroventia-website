import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch all collections data from Wix CMS
 * Provides centralized data fetching with consistent configuration
 */
export const useAllCollections = () => {
  return useQuery({
    queryKey: ['allCollections'],
    queryFn: () =>
      fetch('/api/collections').then(res => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch collections: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    // Ensure consistent return value
    placeholderData: () => null,
  });
};

export default useAllCollections;
