# Next.js Wix CMS Integration Without Official SDK

## Overview

This implementation uses the **exact same HTTP request technique** from our Node.js proxy server, but adapted for Next.js without any official Wix SDK packages. We make direct POST requests to the Wix Data API endpoints.

## Environment Setup

### Dependencies (No Wix SDK Required)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0"
  }
}
```

### Environment Variables

```env
# .env.local
WIX_API_TOKEN=IST.eyJraWQi...your-api-token-here
WIX_SITE_ID=your-site-id-here
WIX_API_BASE_URL=https://www.wixapis.com/wix-data/v2/items
```

## Core Configuration

### Wix Config (No SDK)

```typescript
// lib/wix-config.ts
export interface WixConfig {
  apiToken: string;
  siteId: string;
  baseUrl: string;
}

export const wixConfig: WixConfig = {
  apiToken: process.env.WIX_API_TOKEN!,
  siteId: process.env.WIX_SITE_ID!,
  baseUrl: process.env.WIX_API_BASE_URL!,
};

// Validate configuration
if (!wixConfig.apiToken || !wixConfig.siteId || !wixConfig.baseUrl) {
  throw new Error(
    "Missing required Wix configuration. Check your environment variables."
  );
}
```

## Direct HTTP API Service

### Base Wix API Service

```typescript
// services/wix-api.service.ts
import { wixConfig } from "@/lib/wix-config";

export interface WixApiResponse<T> {
  dataItems: Array<{
    id: string;
    dataCollectionId: string;
    data: T;
  }>;
  pagingMetadata: {
    count: number;
    total: number;
    tooManyToCount: boolean;
    cursors: Record<string, any>;
    hasNext: boolean;
  };
}

export interface TransformedResponse<T> {
  items: Array<{
    id: string;
    dataCollectionId: string;
    data: T;
  }>;
  totalCount: number;
  count: number;
  hasNext: boolean;
  pagingMetadata: WixApiResponse<T>["pagingMetadata"];
  _rawWixData: WixApiResponse<T>;
}

export interface WixQueryOptions {
  includeReferencedItems?: string[];
  filter?: Record<string, any>;
  limit?: number;
  returnTotalCount?: boolean;
}

export class WixApiService {
  private readonly queryUrl = `${wixConfig.baseUrl}/query`;

  /**
   * Transform Wix API response to frontend-compatible format
   * Same transformation as our Node.js proxy server
   */
  private transformResponse<T>(
    data: WixApiResponse<T>
  ): TransformedResponse<T> {
    return {
      items: data.dataItems || [],
      totalCount: data.pagingMetadata?.total || 0,
      count: data.pagingMetadata?.count || 0,
      hasNext: data.pagingMetadata?.hasNext || false,
      pagingMetadata: data.pagingMetadata,
      _rawWixData: data,
    };
  }

  /**
   * Make direct HTTP request to Wix API - EXACT same technique as Node.js
   */
  async queryCollection<T>(
    collectionName: string,
    options: WixQueryOptions = {}
  ): Promise<TransformedResponse<T>> {
    const {
      includeReferencedItems = ["*"],
      filter = {},
      limit = 100,
      returnTotalCount = true,
    } = options;

    console.log(`\n=== Fetching Collection: ${collectionName} ===`);
    console.log("Time:", new Date().toISOString());

    const requestBody = {
      dataCollectionId: collectionName,
      includeReferencedItems,
      returnTotalCount,
      cursorPaging: {
        limit,
      },
      ...(Object.keys(filter).length > 0 && { filter }),
    };

    console.log("Request URL:", this.queryUrl);
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch(this.queryUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${wixConfig.apiToken}`,
          "Content-Type": "application/json",
          "wix-site-id": wixConfig.siteId,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Wix API Error:", errorText);

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
          if (errorJson.details) {
            errorMessage += ` (${JSON.stringify(errorJson.details)})`;
          }
        } catch (e) {
          // Keep original error message if JSON parsing fails
        }

        throw new Error(errorMessage);
      }

      const data = (await response.json()) as WixApiResponse<T>;
      const transformedData = this.transformResponse(data);

      console.log(`Success: Retrieved ${transformedData.items.length} items`);

      return transformedData;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw new Error(
        `Failed to fetch ${collectionName}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Export singleton instance
export const wixApiService = new WixApiService();
```

## Collection-Specific Services

### Enhanced Data Service with Reference Handling

```typescript
// services/wix-data.service.ts
import { wixApiService, TransformedResponse } from "./wix-api.service";

// Collection Types (same as before)
export interface WixBaseItem {
  _id: string;
  _owner: string;
  _createdDate: { $date: string };
  _updatedDate: { $date: string };
  isActive?: boolean;
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
  specifications: Record<string, any>;
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

export enum CollectionNames {
  HERO_CONTENT = "HeroContent",
  ABOUT_CONTENT = "AboutContent",
  SERVICES_CONTENT = "ServicesContent",
  PRODUCTS_CONTENT = "ProductsContent",
  IMPORT1 = "Import1",
  CONTACT_CONTENT = "ContactContent",
  OUR_CORE_VALUES = "OurCoreValues",
}

export class WixDataService {
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
              includeReferencedItems: ["*"],
            }
          );

        console.log(`Found ${coreValuesResponse.items.length} core values`);

        // Add core values to about content - same pattern as Node.js
        aboutResponse.items[0].data.coreValues = coreValuesResponse.items.map(
          (item) => item.data
        );
      } catch (error) {
        console.error("Error fetching core values:", error);
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
      "Processing Import1 - fetching ALL products from ProductsContent collection"
    );

    // First fetch the product categories
    const categoriesResponse =
      await wixApiService.queryCollection<ProductCategory>(
        CollectionNames.IMPORT1
      );

    try {
      // Fetch ALL products from ProductsContent collection
      console.log("Fetching complete ProductsContent collection...");

      const allProductsResponse =
        await wixApiService.queryCollection<ProductContent>(
          CollectionNames.PRODUCTS_CONTENT,
          {
            includeReferencedItems: ["*"],
            limit: 100,
          }
        );

      const allProducts = allProductsResponse.items.map((item) => item.data);

      console.log(
        `Successfully fetched ${allProducts.length} total products from ProductsContent`
      );

      // Create a map of product ID to product data for easy lookup
      const productMap: Record<string, ProductContent> = {};
      allProducts.forEach((product) => {
        productMap[product._id] = product;
      });

      // Process each catalog item and add referenced products + all products
      categoriesResponse.items.forEach((categoryItem, i) => {
        const categoryData = categoryItem.data;

        console.log(
          `Processing catalog item ${i + 1}:`,
          categoryData.title || `Item ${i + 1}`
        );

        // Look for reference fields - same logic as Node.js
        const referenceFields = Object.keys(categoryData).filter(
          (key) =>
            (key.toLowerCase().includes("product") ||
              key.toLowerCase().includes("reference") ||
              key.toLowerCase().includes("category") ||
              key.toLowerCase().includes("item")) &&
            !key.startsWith("_")
        );

        console.log("Found potential reference fields:", referenceFields);

        // Add referenced product data to each field (if any references exist)
        referenceFields.forEach((refField) => {
          const refValue = categoryData[refField as keyof ProductCategory];
          if (!refValue) return;

          const refIds = Array.isArray(refValue) ? refValue : [refValue];
          const referencedProducts: ProductContent[] = [];

          refIds.forEach((refId) => {
            if (typeof refId === "string" && productMap[refId]) {
              referencedProducts.push(productMap[refId]);
            }
          });

          if (referencedProducts.length > 0) {
            const referencedDataField =
              `${refField}_data` as keyof ProductCategory;
            (categoryData as any)[referencedDataField] = referencedProducts;
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
      (categoriesResponse as any).allProducts = allProducts;
      (categoriesResponse as any).productSummary = {
        totalProducts: allProducts.length,
        productsSource: "Complete ProductsContent collection",
        fetchedAt: new Date().toISOString(),
        note: "All products from ProductsContent are embedded in each catalog item and at collection level",
      };

      console.log(
        `Successfully embedded ALL ${allProducts.length} products in Import1 collection`
      );
    } catch (error) {
      console.error("Error processing Import1 with all products:", error);
      // Continue without products if there's an error
    }

    console.log("Completed processing Import1 with ALL products embedded");
    return categoriesResponse;
  }

  /**
   * Fetch all other collections - simple queries
   */
  async fetchHeroContent() {
    return wixApiService.queryCollection(CollectionNames.HERO_CONTENT);
  }

  async fetchServicesContent() {
    return wixApiService.queryCollection(CollectionNames.SERVICES_CONTENT);
  }

  async fetchProductsContent() {
    return wixApiService.queryCollection(CollectionNames.PRODUCTS_CONTENT);
  }

  async fetchContactContent() {
    return wixApiService.queryCollection(CollectionNames.CONTACT_CONTENT);
  }

  /**
   * Fetch all collections - same as Node.js
   */
  async fetchAllCollections() {
    try {
      const [hero, about, services, products, categories, contact] =
        await Promise.all([
          this.fetchHeroContent(),
          this.fetchAboutContent(),
          this.fetchServicesContent(),
          this.fetchProductsContent(),
          this.fetchProductCategories(),
          this.fetchContactContent(),
        ]);

      return { hero, about, services, products, categories, contact };
    } catch (error) {
      console.error("Error fetching all collections:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const wixDataService = new WixDataService();
```

## Next.js API Routes

### Individual Collection Route

```typescript
// app/api/collections/[collection]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { wixDataService } from "@/services/wix-data.service";
import { CollectionNames } from "@/services/wix-data.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  try {
    const { collection } = params;

    let data;

    switch (collection) {
      case CollectionNames.HERO_CONTENT:
        data = await wixDataService.fetchHeroContent();
        break;
      case CollectionNames.ABOUT_CONTENT:
        data = await wixDataService.fetchAboutContent();
        break;
      case CollectionNames.SERVICES_CONTENT:
        data = await wixDataService.fetchServicesContent();
        break;
      case CollectionNames.PRODUCTS_CONTENT:
        data = await wixDataService.fetchProductsContent();
        break;
      case CollectionNames.IMPORT1:
        data = await wixDataService.fetchProductCategories();
        break;
      case CollectionNames.CONTACT_CONTENT:
        data = await wixDataService.fetchContactContent();
        break;
      default:
        return NextResponse.json(
          { error: `Unknown collection: ${collection}` },
          { status: 404 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in collections API:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch collection data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

### All Collections Route

```typescript
// app/api/collections/route.ts
import { NextResponse } from "next/server";
import { wixDataService } from "@/services/wix-data.service";

export async function GET() {
  try {
    const allData = await wixDataService.fetchAllCollections();

    return NextResponse.json({
      ...allData,
      _metadata: {
        fetchedAt: new Date().toISOString(),
        totalCollections: Object.keys(allData).length,
      },
    });
  } catch (error) {
    console.error("Error fetching all collections:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch collections",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

## Server Components Usage

### Direct Server-Side Data Fetching

```typescript
// app/products/page.tsx (Server Component)
import { wixDataService } from "@/services/wix-data.service";
import { ProductCategory, ProductContent } from "@/services/wix-data.service";

export default async function ProductsPage() {
  // Direct server-side data fetching - no client-side requests needed!
  const categoriesData = await wixDataService.fetchProductCategories();

  const categories = categoriesData.items.map((item) => item.data);
  const allProducts = (categoriesData as any).allProducts as ProductContent[];
  const productSummary = (categoriesData as any).productSummary;

  return (
    <main className="products-page">
      <header>
        <h1>Product Catalog</h1>
        <p>Total Products: {allProducts.length}</p>
        <p>Source: {productSummary.productsSource}</p>
      </header>

      <section className="categories">
        {categories.map((category) => (
          <div key={category._id} className="category-section">
            <h2>{category.title}</h2>
            <p>{category.description}</p>

            <div className="products-count">
              <p>All Products Available: {category.allProducts?.length || 0}</p>
              {category.productReferences_data && (
                <p>
                  Featured Products: {category.productReferences_data.length}
                </p>
              )}
            </div>

            {/* Display first 6 products from the complete collection */}
            <div className="products-grid">
              {category.allProducts?.slice(0, 6).map((product) => (
                <div key={product._id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <span>Category: {product.category}</span>
                    <span>Origin: {product.origin}</span>
                    <span>
                      Available: {product.availability ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="all-products-summary">
        <h2>Complete Product Directory</h2>
        <div className="products-list">
          {allProducts.map((product) => (
            <div key={product._id} className="product-item">
              <span className="product-name">{product.name}</span>
              <span className="product-category">{product.category}</span>
              <span className="product-origin">{product.origin}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

## Client-Side Usage (Optional)

### Client Component with API Route

```typescript
// components/ClientProductCatalog.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductCategory, ProductContent } from "@/services/wix-data.service";

export default function ClientProductCatalog() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [allProducts, setAllProducts] = useState<ProductContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/collections/Import1");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        setCategories(data.items.map((item: any) => item.data));
        setAllProducts(data.allProducts || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading product catalog...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="client-product-catalog">
      <h2>Product Catalog (Client-Side)</h2>
      <p>Total Products: {allProducts.length}</p>

      {categories.map((category) => (
        <div key={category._id} className="category">
          <h3>{category.title}</h3>
          <p>All Products Available: {category.allProducts?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}
```

## Key Benefits of This Approach

### ✅ **Exact Same Technique as Node.js**

- Direct HTTP POST requests to Wix API
- Same request structure and headers
- Identical data transformation logic
- Same reference handling patterns

### ✅ **No Wix SDK Dependencies**

- Zero additional npm packages
- Smaller bundle size
- Complete control over requests
- No SDK version conflicts

### ✅ **Next.js Advantages**

- Server Components for zero client-side JS
- API Routes for client-side access
- Built-in TypeScript support
- Automatic optimization

### ✅ **Server-Side Benefits**

- API tokens stay secure
- No CORS issues
- Server-side caching possible
- Better SEO with SSR

## Summary

This implementation uses the **exact same HTTP request technique** from our Node.js proxy server, adapted for Next.js without any official Wix SDK packages. You get:

1. **Direct API Access**: Same POST requests to `/wix-data/v2/items/query`
2. **Reference Handling**: Same `includeReferencedItems: ['*']` usage
3. **Data Transformation**: Same `dataItems` → `items` conversion
4. **Complete Product Embedding**: Same logic for embedding all products
5. **Error Handling**: Same robust error management

The only difference is the deployment environment - instead of a standalone Node.js server, everything runs within Next.js server-side functions! 🚀
