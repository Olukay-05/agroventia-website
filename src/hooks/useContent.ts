// hooks/useContent.ts
import { useQuery, type QueryClient } from '@tanstack/react-query';
import {
  getHeroContent,
  getAboutContent,
  getServicesContent,
  getProductsContent,
  getProductCatalogContent,
  getContactContent,
  getCoreValues,
  getCarouselImages,
  getProductsSectionContent,
  getLegalPageBySlug,
  getProductBySlug,
  getBlogPosts,
  getBlogPostBySlug,
} from '@/lib/api/sanity-client';
import type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ContactContent,
  ProductCatalogItem,
  CoreValuesContent,
  CarouselImageDisplayContent,
  ProductsSectionContent,
  LegalPageContent,
  HighlightItem,
  LegalLinkItem,
  PolicySectionItem,
  BlogPost,
} from '@/types/content';
import { useLocale } from '@/contexts/LocaleContext';

// Re-export content types for backward and forward compatibility
export type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ProductCatalogItem,
  ContactContent,
  CoreValuesContent,
  CarouselImageDisplayContent,
  ProductsSectionContent,
  LegalPageContent,
  HighlightItem,
  LegalLinkItem,
  PolicySectionItem,
  BlogPost,
};

// Common caching constants
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Hook for fetching localized hero section content
 */
export const useHeroContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<HeroContent[], Error>({
    queryKey: ['heroContent', locale],
    queryFn: () => getHeroContent(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching localized about section content
 */
export const useAboutContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<AboutContent[], Error>({
    queryKey: ['aboutContent', locale],
    queryFn: () => getAboutContent(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching localized services section content
 */
export const useServicesContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ServiceContent[], Error>({
    queryKey: ['servicesContent', locale],
    queryFn: () => getServicesContent(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching localized products overview content
 */
export const useProductsContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductContent[], Error>({
    queryKey: ['productsContent', locale],
    queryFn: () => getProductsContent(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching localized product catalog item list
 */
export const useProductCatalogContent = (options?: { all?: boolean }) => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductCatalogItem[], Error>({
    queryKey: ['productCatalogContent', locale, options?.all],
    queryFn: () => getProductCatalogContent(locale, options),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching a single localized product by its slug or ID
 */
export const useProductBySlug = (slug: string) => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductCatalogItem | null, Error>({
    queryKey: ['product', slug, locale],
    queryFn: () => getProductBySlug(slug, locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading && Boolean(slug),
  });
};

/**
 * Prefetch a single product for fast RFQ/quote modal rendering
 */
export const prefetchProduct = async (
  queryClient: QueryClient,
  slugOrId: string,
  locale = 'en'
) => {
  if (!slugOrId) return;
  await queryClient.prefetchQuery({
    queryKey: ['product', slugOrId, locale],
    queryFn: () => getProductBySlug(slugOrId, locale),
    staleTime: STALE_TIME,
  });
};

/**
 * Hook for fetching the 9 featured products for homepage 3x3 grid
 */
export const useFeaturedProducts = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductCatalogItem[], Error>({
    queryKey: ['featuredProducts', locale],
    queryFn: async () => {
      const all = await getProductCatalogContent(locale);
      const featured = all.filter(p => p.isFeatured);
      if (featured.length >= 9) {
        return featured.slice(0, 9);
      }
      // If fewer than 9 are explicitly featured, fill with top commodities
      return all.slice(0, 9);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching localized contact and footer information
 */
export const useContactContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ContactContent[], Error>({
    queryKey: ['contactContent', locale],
    queryFn: () => getContactContent(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching company core values
 */
export const useCoreValues = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<CoreValuesContent[], Error>({
    queryKey: ['coreValues', locale],
    queryFn: () => getCoreValues(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching carousel image display slides
 */
export const useCarouselImages = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<CarouselImageDisplayContent[], Error>({
    queryKey: ['carouselImages', locale],
    queryFn: () => getCarouselImages(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching localized products section header and CTA banner content
 */
export const useProductsSectionContent = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<ProductsSectionContent | null, Error>({
    queryKey: ['productsSectionContent', locale],
    queryFn: () => getProductsSectionContent(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching a localized legal policy page by slug
 */
export const useLegalPage = (slug: string) => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<LegalPageContent | null, Error>({
    queryKey: ['legalPage', slug, locale],
    queryFn: () => getLegalPageBySlug(slug, locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading && Boolean(slug),
  });
};

/**
 * Hook for fetching localized blog posts list
 */
export const useBlogPosts = () => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<BlogPost[], Error>({
    queryKey: ['blogPosts', locale],
    queryFn: () => getBlogPosts(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading,
  });
};

/**
 * Hook for fetching a single localized blog post by slug
 */
export const useBlogPostBySlug = (slug: string) => {
  const { locale, isLoading: isLocaleLoading } = useLocale();

  return useQuery<BlogPost | null, Error>({
    queryKey: ['blogPost', slug, locale],
    queryFn: () => getBlogPostBySlug(slug, locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !isLocaleLoading && Boolean(slug),
  });
};

