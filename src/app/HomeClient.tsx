'use client';

import React from 'react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ContactSection from '@/components/sections/ContactSection';
import {
  useHeroContent,
  useAboutContent,
  useProductCatalogContent,
  useContactContent,
} from '@/hooks/useContent';
import useScrollReveal from '@/hooks/useScrollReveal';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';

export default function HomeClient() {
  const { data: heroList, isLoading: isHeroLoading } = useHeroContent();
  const { data: aboutList, isLoading: isAboutLoading } = useAboutContent();
  const { data: productCatalogList, isLoading: isProductsLoading } =
    useProductCatalogContent();
  const { data: contactList, isLoading: isContactLoading } = useContactContent();

  // Initialize scroll reveal animations
  useScrollReveal();

  const heroData = heroList?.[0];
  const aboutData = aboutList?.[0];
  const contactData = contactList?.[0];

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <QuoteRequestProvider>
          <HeroSection
            data={heroData}
            isLoading={isHeroLoading}
          />
          <ProductsSection
            data={productCatalogList}
            isLoading={isProductsLoading}
          />
          <AboutSection
            data={aboutData}
            isLoading={isAboutLoading}
          />
          <ContactSection
            data={contactData}
            isLoading={isContactLoading}
          />
        </QuoteRequestProvider>
      </main>

      <Footer />
    </div>
  );
}
