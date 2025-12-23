import React from 'react';
import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Agricultural Products - AgroVentia Inc.',
  description:
    'Explore our premium agricultural products including kolanut, ginger, hibiscus, cocoa, and more sourced directly from West Africa.',
  keywords:
    'agricultural products, kolanut, ginger, hibiscus, cocoa, West African products, ethically sourced, premium quality',
};

export default function ProductsPage() {
  return <ProductsClient />;
}
