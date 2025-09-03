// services/carousel.service.ts
// import { wixApiService, TransformedResponse } from './wix-api.service';

// This interface matches the actual structure of your Wix CarouselImageDisplay collection
export interface WixCarouselItem {
  imageUrl: string;
  title: string;
  description: string;
  tagline?: string;
  displayOrder?: number;
  _id: string;
  _owner: string;
  _createdDate: { $date: string };
  _updatedDate: { $date: string };
  isActive?: boolean;
}

// This interface is what the carousel component expects
export interface CarouselItem {
  imageUrl: string;
  title: string;
  description: string;
  tagline?: string;
  displayOrder?: number;
}

export class CarouselService {
  /**
   * Fetch and transform CarouselImageDisplay data from Wix
   */
  async fetchCarouselItems(): Promise<CarouselItem[]> {
    try {
      // Fetch data from our API endpoint instead of directly from Wix
      const response = await fetch('/api/collections/CarouselImageDisplay');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Carousel data fetched:', data); // Add debugging

      // Transform the data to match what the carousel component expects
      const carouselItems: CarouselItem[] = data.items
        .map((item: { data: WixCarouselItem }) => ({
          imageUrl: item.data.imageUrl,
          title: item.data.title,
          description: item.data.description,
          tagline: item.data.tagline,
        }))
        // Sort by displayOrder if available
        .sort((a: CarouselItem, b: CarouselItem) => {
          const itemA = data.items.find(
            (item: { data: WixCarouselItem }) => item.data.title === a.title
          );
          const itemB = data.items.find(
            (item: { data: WixCarouselItem }) => item.data.title === b.title
          );
          const orderA = itemA?.data?.displayOrder || 0;
          const orderB = itemB?.data?.displayOrder || 0;
          return (orderA || 0) - (orderB || 0);
        });

      console.log('Transformed carousel items:', carouselItems); // Add debugging
      return carouselItems;
    } catch (error) {
      console.error('Error fetching carousel data:', error);
      throw new Error(
        `Failed to fetch carousel data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Export singleton instance
export const carouselService = new CarouselService();
