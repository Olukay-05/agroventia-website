// app/products/page.tsx
'use client';

import React from 'react';
import ProductsSection from '@/components/sections/ProductsSection';
import { useProductData } from '@/hooks/useProductData';
import SeoHead from '@/components/common/SeoHead';

export default function ProductsPage() {
  const { data, isLoading, error } = useProductData();

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <SeoHead
          title="AgroVentia Inc. - Products Error"
          description="There was an error loading our agricultural products. Please try again."
          noIndex={true}
        />
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
      <SeoHead
        title="Agricultural Products - AgroVentia Inc."
        description="Explore our premium agricultural products including kolanut, ginger, hibiscus, cocoa, and more sourced directly from West Africa."
        keywords="agricultural products, kolanut, ginger, hibiscus, cocoa, West African products, ethically sourced, premium quality"
      />
      <ProductsSection data={data || []} isLoading={isLoading} />
    </div>
  );
}
