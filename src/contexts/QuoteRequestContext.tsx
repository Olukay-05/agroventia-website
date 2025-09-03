'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchProduct } from '@/hooks/useProduct';

interface QuoteRequestContextType {
  requestedProduct: string | null;
  requestedProductId: string | null;
  setRequestedProduct: (product: { name: string; id: string } | null) => void;
  prefetchProductForQuote: (productId: string) => Promise<void>;
}

const QuoteRequestContext = createContext<QuoteRequestContextType | undefined>(
  undefined
);

export const QuoteRequestProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [requestedProduct, setRequestedProductState] = useState<string | null>(
    null
  );
  const [requestedProductId, setRequestedProductId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const setRequestedProduct = (
    product: { name: string; id: string } | null
  ) => {
    if (product) {
      setRequestedProductState(product.name);
      setRequestedProductId(product.id);
    } else {
      setRequestedProductState(null);
      setRequestedProductId(null);
    }
  };

  // Prefetch product data when a quote is requested to ensure fast loading
  const prefetchProductForQuote = async (productId: string) => {
    try {
      await prefetchProduct(queryClient, productId);
    } catch (error) {
      console.warn('Failed to prefetch product for quote:', error);
      // Don't throw error as this is just prefetching for performance
    }
  };

  return (
    <QuoteRequestContext.Provider
      value={{
        requestedProduct,
        requestedProductId,
        setRequestedProduct,
        prefetchProductForQuote,
      }}
    >
      {children}
    </QuoteRequestContext.Provider>
  );
};

export const useQuoteRequest = () => {
  const context = useContext(QuoteRequestContext);
  if (context === undefined) {
    throw new Error(
      'useQuoteRequest must be used within a QuoteRequestProvider'
    );
  }
  return context;
};
