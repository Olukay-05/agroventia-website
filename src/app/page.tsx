import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'AgroVentia Inc. - Premium Agricultural from Africa',
  description:
    'Connecting global markets with quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources.',
  keywords:
    'agricultural exports, African produce sourcing, premium agro products, kolanut, ginger, hibiscus, cocoa, West Africa, agricultural imports, ethically sourced',
};

export default function HomePage() {
  return <HomeClient />;
}
