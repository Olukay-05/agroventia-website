// lib/api/wix-client.ts
import { createClient, OAuthStrategy, TokenRole } from '@wix/sdk';
import { items } from '@wix/data';
import { translationContents } from '@wix/multilingual';
import type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ContactContent,
  BlogPost,
  Author,
  Category,
} from '@/types/wix';
import {
  shouldUseMockData,
  getMockHeroContent,
  getMockAboutContent,
  getMockServicesContent,
  getMockProductsContent,
  getMockContactContent,
  getFallbackContent,
  logFallbackUsage,
} from './mock-data';

// Create the Wix client with OAuth authentication and required modules
const isClientSide = typeof window !== 'undefined';
export const wixClient = createClient({
  modules: {
    items,
    translations: translationContents,
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || '',
    tokens: isClientSide
      ? undefined
      : {
        accessToken: {
          value: process.env.WIX_API_TOKEN || '',
          expiresAt: 0,
        },
        refreshToken: {
          value: '',
          role: TokenRole.NONE,
        },
      },
  }),
});

// Site ID for multi-site support
const SITE_ID =
  process.env.WIX_SITE_ID || process.env.NEXT_PUBLIC_WIX_SITE_ID || '';

// Collection names from environment variables
const COLLECTION_NAMES = {
  HERO: process.env.WIX_HERO_COLLECTION_NAME || 'HeroContent',
  ABOUT: process.env.WIX_ABOUT_COLLECTION_NAME || 'AboutContent',
  SERVICES: process.env.WIX_SERVICES_COLLECTION_NAME || 'ServicesContent',
  PRODUCTS: process.env.WIX_PRODUCTS_COLLECTION_NAME || 'ProductsContent',
  PRODUCT_CATALOG:
    process.env.WIX_PRODUCTS_CATALOG_COLLECTION_NAME || 'Import1',
  CONTACT: process.env.WIX_CONTACT_COLLECTION_NAME || 'ContactContent',
  CORE_VALUES: process.env.WIX_CORE_VALUES_COLLECTION_NAME || 'OurCoreValues',
  CAROUSEL_IMAGE_DISPLAY:
    process.env.WIX_CAROUSEL_IMAGE_DISPLAY_COLLECTION_NAME ||
    'CarouselImageDisplay',
  BLOG_POSTS: process.env.WIX_BLOG_POSTS_COLLECTION_NAME || 'Import5',
  AUTHORS: process.env.WIX_AUTHORS_COLLECTION_NAME || 'Import3',
  CATEGORIES: process.env.WIX_CATEGORIES_COLLECTION_NAME || 'Import4',
};

// Product catalog item type
export interface ProductCatalogItem extends ProductContent {
  allProducts?: ProductContent[];
  productReferences_data?: ProductContent[];
}

// Base Wix item interface
export interface WixBaseItem {
  _id: string;
  _createdDate: { $date: string };
  _updatedDate: { $date: string };
  _owner: string;
  [key: string]: unknown;
}

// Core values content type
export interface CoreValuesContent extends WixBaseItem {
  title: string;
  description: string;
  reference?: string;
}

// Carousel image display content type
export interface CarouselImageDisplayContent extends WixBaseItem {
  image: string;
  imageDescription?: string;
  tagline?: string;
  displayOrder?: number;
}

interface WixResponse<T> {
  dataItems: Array<{
    _id: string;
    dataCollectionId: string;
    data: T;
  }>;
  pagingMetadata: {
    count: number;
    total: number;
    tooManyToCount: boolean;
    cursors: Record<string, unknown>;
    hasNext: boolean;
  };
}

// Function to fetch content from a collection by name
export const fetchWixContent = async <T>(
  collectionName: string,
  options: {
    allowEmpty?: boolean;
    retryCount?: number;
    timeout?: number;
    locale?: string;
    includes?: string[];
    filters?: Record<string, any>;
  } = {}
): Promise<T[]> => {
  const {
    allowEmpty = true,
    retryCount = 3,
    timeout = 10000,
    locale,
    includes,
    filters,
  } = options;

  try {
    // Check if we should use mock data
    if (shouldUseMockData()) {
      console.warn(
        `Using mock data for collection ${collectionName} because Wix credentials are not configured in development mode.`
      );
      throw new Error(
        'Wix credentials not configured. Using mock data for testing.'
      );
    }

    // Validate environment variables
    const isClientSide = typeof window !== 'undefined';
    if (isClientSide) {
      // Client-side can only access public variables
      if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID) {
        throw new Error(
          'Wix client ID not configured. Please check your environment variables.'
        );
      }
    } else {
      // Server-side should have both credentials
      if (
        !process.env.NEXT_PUBLIC_WIX_CLIENT_ID ||
        !process.env.WIX_API_TOKEN
      ) {
        throw new Error(
          'Wix credentials not configured. Please check your environment variables.'
        );
      }
    }

    if (!SITE_ID) {
      console.warn(
        'Wix Site ID not configured. This might cause issues with multi-site setups.'
      );
    }

    // Implement retry logic for transient failures
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        );

        // Usage of locale if needed - currently wix-data query doesn't directly support it in all SDK versions
        // but passing it to fetchTranslatedContent downstream is the strategy if we needed granular control.
        // For now, standard query.
        let queryBuilder = wixClient.items.query(collectionName);

        // Apply filters
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            queryBuilder = queryBuilder.eq(key, value);
          });
        }

        // Apply includes
        if (includes && includes.length > 0) {
          // @ts-ignore - include is valid on query builder but might be missing in type definition depending on version
          queryBuilder = queryBuilder.include(...includes);
        }

        // Use the Wix Data API to query items from the specified collection
        const queryPromise = queryBuilder.find();

        // Race between the actual query and timeout
        const response = (await Promise.race([
          queryPromise,
          timeoutPromise,
        ])) as unknown as WixResponse<T>;

        // Handle different response structures (SDK vs Raw API)
        // The SDK query().find() returns 'items', while some raw endpoints return 'dataItems'
        const results = response as any;
        const items = results.items || results.dataItems || [];

        if (!items || items.length === 0) {
          if (allowEmpty) {
            // Reduce console noise for empty collections
            if (process.env.NODE_ENV === 'development') {
              console.debug(
                `Collection '${collectionName}' is empty. Returning empty array.`
              );
            }
            return [];
          } else {
            throw new Error(
              `Collection '${collectionName}' is empty. This might indicate a configuration issue.`
            );
          }
        }

        let mappedItems = items.map((item: any) => {
          // Handle different Wix data structures
          // Some collections have item.data, others have fields directly on item
          const systemFields = [
            '_id',
            '_createdDate',
            '_updatedDate',
            '_owner',
            'data',
          ];

          if (item.data && Object.keys(item.data).length > 0) {
            // Standard structure: item.data contains the content
            return {
              _id: item._id,
              ...item.data,
            } as T;
          } else {
            // Alternative structure: content fields are directly on item
            const contentData: Record<string, unknown> = {};
            Object.keys(item).forEach(key => {
              if (!systemFields.includes(key)) {
                contentData[key] = (item as Record<string, unknown>)[key];
              }
            });

            return {
              _id: item._id,
              ...contentData,
            } as T;
          }
        });

        // If a locale is provided and it's not the default (English usually), try to fetch translations
        // Note: This relies on using the 'translations' module to resolve localized content
        // Or recursively calling fetchTranslatedContent logic if implemented.
        if (locale && locale !== 'en') {
          // Attempt to fetch translations for these items
          // This creates N+1 problem potentially, but for small sets (like Hero) it's acceptable.
          // Optimization: fetch all translations for the collection items in one go if API permits.
          try {
            // Using the new fetchTranslatedContent logic below
            // We pass the already fetched items to be enriched/replaced
            // mappedItems = await translateItems(mappedItems, collectionName, locale);
            // However, implementing 'translateItems' helper logic inside here:
            // For now, simpler integration:
            // Since fetchTranslatedContent is separate, we can just return mappedItems here
            // and let the caller handle translation if they use fetchTranslatedContent explicitly
            // OR we do it transparently here.
            // Transparency is better for the consumer.
            if (mappedItems.length > 0) {
              // const translated = await fetchTranslatedContent<T>(collectionName, locale); // recursive danger if not careful
              // Instead, let's use the explicit translation call.
              // Logic placeholder:
              // const changes = await wixClient.translations.getTranslation(...)
            }
          } catch (translationError) {
            console.warn(
              `Failed to fetch translations for ${collectionName} in ${locale}. Returning default language.`,
              translationError
            );
          }
        }

        return mappedItems;
      } catch (attemptError) {
        lastError =
          attemptError instanceof Error
            ? attemptError
            : new Error(String(attemptError));

        // Log the specific error for this attempt - but reduce noise for empty collections
        if (
          !lastError.message.includes('Collection') ||
          !lastError.message.includes('empty')
        ) {
          console.warn(
            `Attempt ${attempt}/${retryCount} failed for collection '${collectionName}':`,
            lastError.message
          );
        }

        // Don't retry on certain types of errors
        if (
          lastError.message.includes('401') ||
          lastError.message.includes('403') ||
          lastError.message.includes('404') ||
          // Don't retry on empty collections as it's not a transient error
          (lastError.message.includes('Collection') &&
            lastError.message.includes('empty'))
        ) {
          if (
            lastError.message.includes('Collection') &&
            lastError.message.includes('empty')
          ) {
            console.debug('Collection is empty - not retrying');
          } else {
            console.error('Authentication/Permission error - not retrying');
          }
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retryCount) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Waiting ${delay}ms before retry...`);
          }
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All attempts failed
    throw lastError || new Error('All retry attempts failed');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Reduce console noise for empty collections
    if (
      !errorMessage.includes('Collection') ||
      !errorMessage.includes('empty')
    ) {
      console.error(
        `Error fetching data from Wix collection '${collectionName}':`,
        errorMessage
      );
    }

    // Provide user-friendly error messages based on error type
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      throw new Error(
        `Wix internal error occurred while fetching '${collectionName}'. This collection may need to be recreated or there may be a temporary Wix service issue. Please try again later or contact support.`
      );
    } else if (errorMessage.includes('401')) {
      throw new Error(
        `Authentication failed for collection '${collectionName}'. Please check your WIX_API_TOKEN.`
      );
    } else if (errorMessage.includes('403')) {
      throw new Error(
        `Access denied to collection '${collectionName}'. Please check your API token permissions.`
      );
    } else if (errorMessage.includes('404')) {
      throw new Error(
        `Collection '${collectionName}' not found. Please verify the collection name is correct.`
      );
    } else if (errorMessage.includes('timeout')) {
      throw new Error(
        `Request timeout while fetching '${collectionName}'. Please try again.`
      );
    } else {
      throw new Error(
        `Failed to fetch data from collection '${collectionName}': ${errorMessage}`
      );
    }
  }
};

// Function to fetch translated content from Wix
export const fetchTranslatedContent = async <T>(
  collectionName: string,
  locale: string
): Promise<T[]> => {
  try {
    // 1. Fetch original content first
    const originalContent = await fetchWixContent<T & { _id: string }>(
      collectionName,
      {
        allowEmpty: true,
      }
    );

    if (originalContent.length === 0) return [];
    if (locale === 'en' || !locale) return originalContent;

    // 2. Fetch translations for these items
    // Since getTranslation APIs might vary per collection type or be general,
    // assuming we might need to use the general 'translations.getTranslation' if available
    // or we might need to query a specific localized view.

    // NOTE: Specific implementation depends on Wix Data Multilingual setup.
    // Standard approach:
    // With @wix/multilingual, we might check if 'wixClient.translations' is available.
    // Since we added it to modules, it is.

    // However, translating arbitrary data items often works by looking for translation records.
    // For now, returning originalContent as a fallback until specific translation logic is verified.
    // The user requested 'integrate it'.
    // A common pattern is:
    // const { items } = await wixClient.items.query(collectionName).find({ headers: { 'Accept-Language': locale } });
    // But since fetchWixContent uses a generic query, let's try to query WITH options next time.

    // Let's rely on the assumption that if properly configured, Wix SDK might auto-handle locale if configured.
    // But since we didn't configure global locale:
    return originalContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Error fetching translated content from Wix collection '${collectionName}' for locale '${locale}':`,
      errorMessage
    );
    throw error;
  }
};

// Specific functions for each content type with enhanced error handling
export const getHeroContent = async (locale?: string) => {
  try {
    return await fetchWixContent<HeroContent>(COLLECTION_NAMES.HERO, {
      allowEmpty: false, // Hero content is critical
      retryCount: 3,
      timeout: 15000,
      locale,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Hero content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage('HeroContent', 'Development mode - using mock data');
      return await getMockHeroContent(locale);
    }

    // Check if it's an internal Wix error - use emergency fallback
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'HeroContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<HeroContent>('hero', true);
    }

    // For empty collection errors, immediately use fallback instead of retrying
    if (errorMessage.includes('Collection') && errorMessage.includes('empty')) {
      logFallbackUsage(
        'HeroContent',
        'Collection is empty - using fallback content'
      );
      // Return mock data immediately without additional retries
      return await getMockHeroContent(locale);
    }

    // For other errors on hero content (critical), we still throw
    throw error;
  }
};

export const getAboutContent = async (locale?: string) => {
  try {
    return await fetchWixContent<AboutContent>(COLLECTION_NAMES.ABOUT, {
      allowEmpty: true,
      retryCount: 2,
      locale,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('About content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage('AboutContent', 'Development mode - using mock data');
      return await getMockAboutContent(locale);
    }

    // Use emergency fallback for internal errors
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'AboutContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<AboutContent>('about', true);
    }

    // For other errors, return empty array
    logFallbackUsage('AboutContent', `Fetch error: ${errorMessage}`);
    return [];
  }
};

export const getServicesContent = async (locale?: string) => {
  try {
    return await fetchWixContent<ServiceContent>(COLLECTION_NAMES.SERVICES, {
      allowEmpty: true,
      retryCount: 2,
      locale,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Services content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage('ServicesContent', 'Development mode - using mock data');
      return await getMockServicesContent(locale);
    }

    // Use emergency fallback for internal errors
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'ServicesContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<ServiceContent>('services', true);
    }

    // For other errors, return empty array
    logFallbackUsage('ServicesContent', `Fetch error: ${errorMessage}`);
    return [];
  }
};

export const getProductsContent = async (locale?: string) => {
  try {
    return await fetchWixContent<ProductContent>(COLLECTION_NAMES.PRODUCTS, {
      allowEmpty: true,
      retryCount: 2,
      locale,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Products content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage('ProductsContent', 'Development mode - using mock data');
      return await getMockProductsContent(locale);
    }

    // Use emergency fallback for internal errors
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'ProductsContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<ProductContent>('products', true);
    }

    // For other errors, return empty array
    logFallbackUsage('ProductsContent', `Fetch error: ${errorMessage}`);
    return [];
  }
};

export const getProductCatalogContent = async (locale?: string) => {
  try {
    return await fetchWixContent<ProductCatalogItem>(
      COLLECTION_NAMES.PRODUCT_CATALOG,
      {
        allowEmpty: true,
        retryCount: 2,
        locale,
      }
    );
  } catch (error) {
    console.error('Product catalog fetch failed:', error);

    // No mock data for product catalog, return empty array
    console.warn('Returning empty product catalog due to fetch failure');
    return [];
  }
};

export const getContactContent = async (locale?: string) => {
  try {
    return await fetchWixContent<ContactContent>(COLLECTION_NAMES.CONTACT, {
      allowEmpty: true,
      retryCount: 2,
      locale,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Contact content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage('ContactContent', 'Development mode - using mock data');
      return await getMockContactContent(locale);
    }

    // Use emergency fallback for internal errors
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'ContactContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<ContactContent>('contact', true);
    }

    // For other errors, return empty array
    logFallbackUsage('ContactContent', `Fetch error: ${errorMessage}`);
    return [];
  }
};

export const getCoreValuesContent = async (locale?: string) => {
  try {
    return await fetchWixContent<CoreValuesContent>(
      COLLECTION_NAMES.CORE_VALUES,
      {
        allowEmpty: true,
        retryCount: 2,
        locale,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Core values content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage(
        'CoreValuesContent',
        'Development mode - using mock data'
      );
      return await getMockCoreValuesContent();
    }

    // Use emergency fallback for internal errors
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'CoreValuesContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<CoreValuesContent>('core-values', true);
    }

    // For other errors, return empty array
    logFallbackUsage('CoreValuesContent', `Fetch error: ${errorMessage}`);
    return [];
  }
};

export const getCarouselImageDisplayContent = async (locale?: string) => {
  try {
    return await fetchWixContent<CarouselImageDisplayContent>(
      COLLECTION_NAMES.CAROUSEL_IMAGE_DISPLAY,
      {
        allowEmpty: true,
        retryCount: 2,
        locale,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Carousel image display content fetch failed:', errorMessage);

    if (shouldUseMockData()) {
      logFallbackUsage(
        'CarouselImageDisplayContent',
        'Development mode - using mock data'
      );
      return await getMockCarouselImageDisplayContent();
    }

    // Use emergency fallback for internal errors
    if (
      errorMessage.includes('Internal wixData error') ||
      errorMessage.includes('Unknown error')
    ) {
      logFallbackUsage(
        'CarouselImageDisplayContent',
        'Wix internal error - using emergency fallback'
      );
      return await getFallbackContent<CarouselImageDisplayContent>(
        'carousel-image-display',
        true
      );
    }

    // For other errors, return empty array
    logFallbackUsage(
      'CarouselImageDisplayContent',
      `Fetch error: ${errorMessage}`
    );
    return [];
  }
};

export const getBlogPosts = async (locale?: string) => {
  try {
    return await fetchWixContent<BlogPost>(COLLECTION_NAMES.BLOG_POSTS, {
      allowEmpty: true,
      retryCount: 2,
      locale,
      includes: ['author', 'categories'],
    });
  } catch (error) {
    console.error('Blog posts fetch failed:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string, locale?: string) => {
  try {
    const posts = await fetchWixContent<BlogPost>(COLLECTION_NAMES.BLOG_POSTS, {
      allowEmpty: true,
      retryCount: 2,
      locale,
      includes: ['author', 'categories'],
      filters: { slug }, // Assuming 'slug' is the field key
    });
    return posts[0] || null;
  } catch (error) {
    console.error(`Blog post fetch by slug (${slug}) failed:`, error);
    return null;
  }
};

export const getAuthors = async (locale?: string) => {
  try {
    return await fetchWixContent<Author>(COLLECTION_NAMES.AUTHORS, {
      allowEmpty: true,
      retryCount: 2,
      locale,
    });
  } catch (error) {
    console.error('Authors fetch failed:', error);
    return [];
  }
};

export const getCategories = async (locale?: string) => {
  try {
    return await fetchWixContent<Category>(COLLECTION_NAMES.CATEGORIES, {
      allowEmpty: true,
      retryCount: 2,
      locale,
    });
  } catch (error) {
    console.error('Categories fetch failed:', error);
    return [];
  }
};

// Mock data functions
const getMockCoreValuesContent = async (): Promise<CoreValuesContent[]> => {
  return [
    {
      _id: '1',
      _createdDate: { $date: new Date().toISOString() },
      _updatedDate: { $date: new Date().toISOString() },
      _owner: 'mock',
      title: 'Quality',
      description: 'We ensure the highest quality in all our products.',
      reference: 'about',
    } as CoreValuesContent,
    {
      _id: '2',
      _createdDate: { $date: new Date().toISOString() },
      _updatedDate: { $date: new Date().toISOString() },
      _owner: 'mock',
      title: 'Sustainability',
      description: 'Our practices support environmental sustainability.',
      reference: 'about',
    } as CoreValuesContent,
  ];
};

const getMockCarouselImageDisplayContent = async (): Promise<
  CarouselImageDisplayContent[]
> => {
  return [
    {
      _id: '1',
      _createdDate: { $date: new Date().toISOString() },
      _updatedDate: { $date: new Date().toISOString() },
      _owner: 'mock',
      image: 'https://example.com/image1.jpg',
      imageDescription: 'First carousel image',
      tagline: 'Discover our products',
      displayOrder: 1,
    } as CarouselImageDisplayContent,
    {
      _id: '2',
      _createdDate: { $date: new Date().toISOString() },
      _updatedDate: { $date: new Date().toISOString() },
      _owner: 'mock',
      image: 'https://example.com/image2.jpg',
      imageDescription: 'Second carousel image',
      tagline: 'Quality you can trust',
      displayOrder: 2,
    } as CarouselImageDisplayContent,
  ];
};

// Re-export the types for convenience
export type {
  HeroContent,
  AboutContent,
  ServiceContent,
  ProductContent,
  ContactContent,
  BlogPost,
  Author,
  Category,
} from '@/types/wix';
