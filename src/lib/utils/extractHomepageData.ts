import { mockRootProps } from '@/data/homepageMockData';
import {
  HeroContent,
  AboutContent,
  ServiceContent,
  ContactContent,
} from '@/types/wix';
import { ProductCategory, ProductContent } from '@/services/wix-data.service';

/**
 * Interface for the raw data structure from Wix Collections API
 */
interface WixCollectionsData {
  hero?: {
    items?: Array<{ data: HeroContent }>;
  };
  about?: {
    items?: Array<{ data: AboutContent }>;
  };
  services?: {
    items?: Array<{ data: ServiceContent }>;
  };
  categories?: {
    items?: Array<{ data: ProductCategory }>;
    allProducts?: ProductContent[];
  };
  products?: {
    items?: Array<{ data: ProductContent }>;
  };
  contact?: {
    items?: Array<{ data: ContactContent }>;
  };
}

/**
 * Interface for extracted homepage data
 */
export interface ExtractedHomepageData {
  heroData: HeroContent | typeof mockRootProps.heroData;
  aboutData: AboutContent | typeof mockRootProps.aboutData;
  servicesData: ServiceContent | typeof mockRootProps.servicesData;
  productsData: ProductCategory[] | typeof mockRootProps.productsData;
  contactData: ContactContent | typeof mockRootProps.contactData;
}

/**
 * Extracts and processes homepage data from Wix Collections API response
 * Provides fallback to mock data when real data is unavailable
 *
 * @param data - Raw data from Wix Collections API
 * @param shouldUseData - Whether to use the fetched data or fallback to mock data
 * @returns Processed data for all homepage sections
 */
export const extractHomepageData = (
  data: WixCollectionsData | null | undefined,
  shouldUseData: boolean = true
): ExtractedHomepageData => {
  // Extract data for each section, fallback to mock data
  const heroData = shouldUseData
    ? data?.hero?.items?.[0]?.data || mockRootProps.heroData
    : mockRootProps.heroData;

  const aboutData = shouldUseData
    ? data?.about?.items?.[0]?.data || mockRootProps.aboutData
    : mockRootProps.aboutData;

  const servicesData = shouldUseData
    ? data?.services?.items?.[0]?.data || mockRootProps.servicesData
    : mockRootProps.servicesData;

  const productsData = shouldUseData
    ? data?.categories?.items?.map(item => item.data) ||
      mockRootProps.productsData
    : mockRootProps.productsData;

  const contactData = shouldUseData
    ? data?.contact?.items?.[0]?.data || mockRootProps.contactData
    : mockRootProps.contactData;

  return {
    heroData,
    aboutData,
    servicesData,
    productsData,
    contactData,
  };
};
