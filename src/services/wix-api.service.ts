// services/wix-api.service.ts
import { wixConfig } from '@/lib/wix-config';

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
  pagingMetadata: WixApiResponse<T>['pagingMetadata'];
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
    // For client-side requests, we need to use a different approach
    // since we can't access the private API token directly
    const isClientSide = typeof window !== 'undefined';

    if (isClientSide) {
      // On client side, make a request to our own API endpoint
      try {
        const response = await fetch(`/api/collections/${collectionName}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform the response to match our expected format
        return this.transformResponse({
          dataItems: data.items,
          pagingMetadata: data.pagingMetadata || {
            count: data.items.length,
            total: data.totalCount || data.items.length,
            tooManyToCount: false,
            cursors: {},
            hasNext: false,
          },
        });
      } catch (error) {
        console.error(
          `Error fetching ${collectionName} via client-side proxy:`,
          error
        );
        // Return empty response on error
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
    } else {
      // Server-side logic (original implementation)
      // Check if configuration is available
      if (!wixConfig.apiToken || !wixConfig.siteId) {
        console.warn('Wix configuration missing, returning empty response');
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

      const {
        includeReferencedItems = ['*'],
        filter = {},
        limit = 100,
        returnTotalCount = true,
      } = options;

      const requestBody = {
        dataCollectionId: collectionName,
        includeReferencedItems,
        returnTotalCount,
        cursorPaging: {
          limit,
        },
        ...(Object.keys(filter).length > 0 && { filter }),
      };

      try {
        const response = await fetch(this.queryUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${wixConfig.apiToken}`,
            'Content-Type': 'application/json',
            'wix-site-id': wixConfig.siteId,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();

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

        return transformedData;
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        throw new Error(
          `Failed to fetch ${collectionName}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }
  }
}

// Export singleton instance
export const wixApiService = new WixApiService();
