// services/wix-data.service.ts
import { wixApiService, TransformedResponse } from './wix-api.service';

// Collection Types (same as before)
export interface WixBaseItem {
  _id: string;
  _owner: string;
  _createdDate: { $date: string }; // This is the system field
  _updatedDate: { $date: string };
  isActive?: boolean;
}

// Updated interface for CarouselImageDisplay collection to match actual field names
export interface CarouselImageDisplay extends WixBaseItem {
  imageUrl: string; // Changed from 'image' to 'imageUrl'
  title: string; // Changed from 'imageDescription' to 'title'
  description: string; // Added to match your data
  tagline?: string; // Will be used as hero tagline text
  displayOrder?: number; // Added to match your data
}

export interface AboutContent extends WixBaseItem {
  sectionTitle: string;
  mission: string;
  vision: string;
  story: string;
  headquarters: string;
  foundingYear: string;
  certifications: string;
  aboutImage: string;
  coreValues?: CoreValue[];
}

export interface CoreValue extends WixBaseItem {
  title: string;
  description: string;
  reference: string;
}

export interface ProductContent extends WixBaseItem {
  name: string;
  description: string;
  category: string;
  origin: string;
  specifications: Record<string, unknown>;
  images: string[];
  price?: number;
  availability: boolean;
}

export interface ProductCategory extends WixBaseItem {
  title: string;
  description: string;
  categoryImage: string;
  productReferences?: string[];
  allProducts?: ProductContent[];
  productReferences_data?: ProductContent[];
}

export interface HeroContent extends WixBaseItem {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  companyLogo: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink?: string;
  ctaSecondaryLink?: string;
  overlayOpacity?: number;
}

export interface ServiceContent extends WixBaseItem {
  title: string;
  description: string;
  icon: string;
  features: string[];
  sectionTitle?: string;
  sectionDescription?: string;
  importServices?: string;
  customSourcing?: string;
  qualityAssurance?: string;
  logistics?: string;
  documentation?: string;
  servicesImage?: string;
}

export interface ContactContent extends WixBaseItem {
  businessPhone: string;
  socialLinks: string;
  businessAddress: string;
  sectionTitle: string;
  responseTime: string;
  sectionDescription: string;
  businessHours: string;
  businessEmail: string;
  contactImage?: string;
}

export enum CollectionNames {
  HERO_CONTENT = 'HeroContent',
  ABOUT_CONTENT = 'AboutContent',
  SERVICES_CONTENT = 'ServicesContent',
  PRODUCTS_CONTENT = 'ProductsContent',
  IMPORT1 = 'Import1',
  IMPORT2 = 'Import2', // Products collection
  CONTACT_CONTENT = 'ContactContent',
  OUR_CORE_VALUES = 'OurCoreValues',
  CAROUSEL_IMAGE_DISPLAY = 'CarouselImageDisplay', // New collection
}

// Add missing interfaces
interface ProductSummary {
  totalProducts: number;
  productsSource: string;
  fetchedAt: string;
  note: string;
}

export class WixDataService {
  /**
   * Fetch Carousel Image Display content
   */
  async fetchCarouselImageDisplay(): Promise<
    TransformedResponse<CarouselImageDisplay>
  > {
    // Check if configuration is available
    if (!process.env.WIX_API_TOKEN || !process.env.WIX_SITE_ID) {
      console.warn(
        'Wix configuration missing, returning empty response for CarouselImageDisplay'
      );
      return {
        items: [],
        totalCount: 0,
        count: 0,
        hasNext: false,
        pagingMetadata: {
          count: 0,
          total: 0,
          tooManyToCount: false,
          cursors: {},
          hasNext: false,
        },
        _rawWixData: {
          dataItems: [],
          pagingMetadata: {
            count: 0,
            total: 0,
            tooManyToCount: false,
            cursors: {},
            hasNext: false,
          },
        },
      };
    }

    return wixApiService.queryCollection<CarouselImageDisplay>(
      CollectionNames.CAROUSEL_IMAGE_DISPLAY
    );
  }

  /**
   * Fetch About Content with Core Values - EXACT same logic as Node.js
   */
  async fetchAboutContent(): Promise<TransformedResponse<AboutContent>> {
    const aboutResponse = await wixApiService.queryCollection<AboutContent>(
      CollectionNames.ABOUT_CONTENT
    );

    // If we have about content, fetch related core values
    if (aboutResponse.items.length > 0) {
      const aboutId = aboutResponse.items[0].data._id;

      console.log(
        `Fetching core values that reference AboutContent ID: ${aboutId}`
      );

      try {
        const coreValuesResponse =
          await wixApiService.queryCollection<CoreValue>(
            CollectionNames.OUR_CORE_VALUES,
            {
              filter: {
                reference: {
                  $eq: aboutId,
                },
              },
              includeReferencedItems: ['*'],
            }
          );

        console.log(`Found ${coreValuesResponse.items.length} core values`);

        // Add core values to about content - same pattern as Node.js
        aboutResponse.items[0].data.coreValues = coreValuesResponse.items.map(
          item => item.data
        );
      } catch (error) {
        console.error('Error fetching core values:', error);
        // Continue without core values if there's an error
      }
    }

    return aboutResponse;
  }

  /**
   * Fetch Product Categories with ALL Products Embedded - EXACT same logic as Node.js
   */
  async fetchProductCategories(): Promise<
    TransformedResponse<ProductCategory>
  > {
    console.log(
      'Processing Import1 - fetching ALL products from Import2 collection'
    );

    // First fetch the product categories
    const categoriesResponse =
      await wixApiService.queryCollection<ProductCategory>(
        CollectionNames.IMPORT1
      );

    try {
      // Fetch ALL products from Import2 collection
      console.log('Fetching complete Import2 products collection...');

      const allProductsResponse =
        await wixApiService.queryCollection<ProductContent>(
          CollectionNames.IMPORT2,
          {
            includeReferencedItems: ['*'],
            limit: 100,
          }
        );

      const allProducts = allProductsResponse.items.map(item => item.data);

      console.log(
        `Successfully fetched ${allProducts.length} total products from Import2`
      );

      // Create a map of product ID to product data for easy lookup
      const productMap: Record<string, ProductContent> = {};
      allProducts.forEach(product => {
        productMap[product._id] = product;
      });

      // Process each catalog item and add referenced products + all products
      categoriesResponse.items.forEach((categoryItem, i) => {
        const categoryData = categoryItem.data as ProductCategory & {
          allProducts?: ProductContent[];
          productSummary?: ProductSummary;
        };

        console.log(
          `Processing catalog item ${i + 1}:`,
          categoryData.title || `Item ${i + 1}`
        );

        // Look for reference fields - same logic as Node.js
        const referenceFields = Object.keys(categoryData).filter(
          key =>
            (key.toLowerCase().includes('product') ||
              key.toLowerCase().includes('reference') ||
              key.toLowerCase().includes('category') ||
              key.toLowerCase().includes('item')) &&
            !key.startsWith('_')
        );

        console.log('Found potential reference fields:', referenceFields);

        // Add referenced product data to each field (if any references exist)
        referenceFields.forEach(refField => {
          const refValue = categoryData[refField as keyof ProductCategory];
          if (!refValue) return;

          const refIds = Array.isArray(refValue) ? refValue : [refValue];
          const referencedProducts: ProductContent[] = [];

          refIds.forEach(refId => {
            if (typeof refId === 'string' && productMap[refId]) {
              referencedProducts.push(productMap[refId]);
            }
          });

          if (referencedProducts.length > 0) {
            const referencedDataField =
              `${refField}_data` as keyof ProductCategory;
            (categoryData as Partial<ProductCategory>)[referencedDataField] =
              referencedProducts as never;
            console.log(
              `Added ${
                referencedProducts.length
              } referenced products to ${refField}_data for catalog item ${
                i + 1
              }`
            );
          }
        });

        // IMPORTANT: Add ALL products to each catalog item - same as Node.js
        categoryData.allProducts = allProducts;
        console.log(
          `Added ALL ${allProducts.length} products to catalog item ${i + 1}`
        );
      });

      // Add all products at the collection level as well - same as Node.js
      const categoriesResponseWithExtras =
        categoriesResponse as TransformedResponse<ProductCategory> & {
          allProducts?: ProductContent[];
          productSummary?: ProductSummary;
        };

      categoriesResponseWithExtras.allProducts = allProducts;

      categoriesResponseWithExtras.productSummary = {
        totalProducts: allProducts.length,
        productsSource: 'Complete Import2 collection',
        fetchedAt: new Date().toISOString(),
        note: 'All products from Import2 are embedded in each catalog item and at collection level',
      };

      console.log(
        `Successfully embedded ALL ${allProducts.length} products from Import2 in Import1 collection`
      );
    } catch (error) {
      console.error('Error processing Import1 with all products:', error);
      // Continue without products if there's an error
    }

    console.log('Completed processing Import1 with ALL products embedded');
    return categoriesResponse;
  }

  /**
   * Fetch all other collections - simple queries
   */
  async fetchHeroContent() {
    return wixApiService.queryCollection<HeroContent>(
      CollectionNames.HERO_CONTENT
    );
  }

  async fetchServicesContent() {
    return wixApiService.queryCollection<ServiceContent>(
      CollectionNames.SERVICES_CONTENT
    );
  }

  async fetchProductsContent() {
    // Use Import2 as the main products collection
    return wixApiService.queryCollection<ProductContent>(
      CollectionNames.IMPORT2
    );
  }

  async fetchProductsFromImport2() {
    console.log('Fetching products from Import2 collection...');

    const response = await wixApiService.queryCollection<ProductContent>(
      CollectionNames.IMPORT2,
      {
        includeReferencedItems: ['*'],
        limit: 100,
      }
    );

    console.log(
      `Successfully fetched ${response.items.length} products from Import2`
    );
    return response;
  }

  /**
   * Fetch Contact Content
   */
  async fetchContactContent(): Promise<TransformedResponse<ContactContent>> {
    return wixApiService.queryCollection<ContactContent>(
      CollectionNames.CONTACT_CONTENT
    );
  }

  /**
   * Fetch all collections - same as Node.js
   */
  async fetchAllCollections() {
    try {
      const [
        hero,
        about,
        services,
        products,
        categories,
        contact,
        carouselImages,
      ] = await Promise.all([
        this.fetchHeroContent(),
        this.fetchAboutContent(),
        this.fetchServicesContent(),
        this.fetchProductsFromImport2(), // Use Import2 for products
        this.fetchProductCategories(),
        this.fetchContactContent(),
        this.fetchCarouselImageDisplay(), // New collection
      ]);

      return {
        hero,
        about,
        services,
        products,
        categories,
        contact,
        carouselImages,
      };
    } catch (error) {
      console.error('Error fetching all collections:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const wixDataService = new WixDataService();
