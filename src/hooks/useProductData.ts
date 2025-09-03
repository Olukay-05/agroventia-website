// hooks/useProductData.ts
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  title?: string;
  name?: string;
  productName?: string;
  description: string;
  image?: string;
  image1?: string;
  categoryImage?: string;
  productCount?: number;
  category?: string;
  _owner?: string;
  _createdDate?: string | { $date: string };
  _updatedDate?: string | { $date: string };
}

interface CategoryWithProducts {
  _id: string;
  title?: string;
  categoryName?: string;
  allProducts?: Product[];
  [key: string]: unknown;
}

interface UseProductDataReturn {
  data: CategoryWithProducts[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useProductData = (): UseProductDataReturn => {
  const [data, setData] = useState<CategoryWithProducts[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch data from the API endpoint for Import1 collection
        const response = await fetch('/api/collections/Import1');

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product data: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        setData(
          result.items.map((item: { data: CategoryWithProducts }) => item.data)
        );
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
