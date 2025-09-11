// hooks/useWixContent.ts
import { useQuery } from '@tanstack/react-query';
import {
  getHeroContent,
  getAboutContent,
  getServicesContent,
  getProductsContent,
  getProductCatalogContent,
  getContactContent,
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ProductCatalogItem,
  ContactContent,
} from '@/lib/api/wix-client';
import { useLocale } from '@/contexts/LocaleContext';

// Hook for fetching hero content
export const useHeroContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<HeroContent[], Error>({
    queryKey: ['heroContent', locale],
    queryFn: () => getHeroContent(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on empty collection errors as they're not transient
      if (
        error.message.includes('Collection') &&
        error.message.includes('empty')
      ) {
        return false;
      }
      // For other errors, retry up to 2 times
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

// Hook for fetching about content
export const useAboutContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<AboutContent[], Error>({
    queryKey: ['aboutContent', locale],
    queryFn: () => getAboutContent(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

// Hook for fetching services content
export const useServicesContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ServiceContent[], Error>({
    queryKey: ['servicesContent', locale],
    queryFn: () => getServicesContent(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

// Hook for fetching products content
export const useProductsContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductContent[], Error>({
    queryKey: ['productsContent', locale],
    queryFn: () => getProductsContent(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

// Hook for fetching product catalog content
export const useProductCatalogContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductCatalogItem[], Error>({
    queryKey: ['productCatalogContent', locale],
    queryFn: () => getProductCatalogContent(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

// Hook for fetching contact content
export const useContactContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ContactContent[], Error>({
    queryKey: ['contactContent', locale],
    queryFn: () => getContactContent(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};
