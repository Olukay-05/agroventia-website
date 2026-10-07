import React from 'react';
import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'B2B Agricultural Commodity Catalog | AgroVentia Inc.',
  description:
    'Explore AgroVentia’s comprehensive multi-corridor catalog of Canadian Prairies grains, pulses, and oilseeds alongside West African ginger, sesame, cocoa, and botanicals with typical quality parameters.',
  keywords:
    'agricultural commodities, Canadian grains, durum wheat, red lentils, canola, Nigerian ginger, sesame seeds, shea butter, cocoa beans, typical quality parameters, B2B wholesale agriculture',
};

export default function ProductsPage() {
  return <ProductsClient />;
}
