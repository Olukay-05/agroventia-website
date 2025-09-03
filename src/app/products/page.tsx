// app/products/page.tsx
'use client';

import React from 'react';
import ProductsSection from '@/components/sections/ProductsSection';
import { useProductData } from '@/hooks/useProductData';

export default function ProductsPage() {
  const { data, isLoading, error } = useProductData();

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <ProductsSection data={data || []} isLoading={isLoading} />
    </div>
  );
}
