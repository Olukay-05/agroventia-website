'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ContactSection from '@/components/sections/ContactSection';
import { useAllCollections } from '@/hooks/useAllCollections';
import { extractHomepageData } from '@/lib/utils/extractHomepageData';
import useScrollReveal from '@/hooks/useScrollReveal';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import SeoHead from '@/components/common/SeoHead';

export default function HomePage() {
  const { data, isLoading, error } = useAllCollections();

  // Initialize scroll reveal animations
  useScrollReveal();

  // Don't show loading state for too long - fallback to mock data
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowFallback(true);
      }
    }, 8000); // Show fallback after 8 seconds

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Ensure we always have consistent data structures
  const safeData = data || null;

  // Handle error state more gracefully
  if (error) {
    console.warn(
      'Error loading collections data, using fallback:',
      error.message
    );
    // Continue with fallback data instead of showing error page
  }

  // Use data if available, otherwise use mock data (especially if loading is taking too long)
  const shouldUseData = safeData && !showFallback;
  const effectiveLoading = isLoading && !showFallback;

  // Extract data using the centralized utility function
  const { heroData, aboutData, servicesData, productsData, contactData } =
    extractHomepageData(safeData, shouldUseData);

  return (
    <div className="min-h-screen">
      <SeoHead
        title="AgroVentia Inc. - Premium Agricultural Imports from West Africa"
        description="Connecting global markets with quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources."
        keywords="agricultural exports, African produce sourcing, premium agro products, kolanut, ginger, hibiscus, cocoa, West Africa, agricultural imports, ethically sourced"
      />
      <Header />

      <main>
        <QuoteRequestProvider>
          <HeroSection
            data={heroData}
            collectionsData={safeData}
            isLoading={effectiveLoading}
          />
          <AboutSection data={aboutData} isLoading={effectiveLoading} />
          <ServicesSection data={servicesData} isLoading={effectiveLoading} />
          <ProductsSection data={productsData} isLoading={effectiveLoading} />
          <ContactSection data={contactData} isLoading={effectiveLoading} />
        </QuoteRequestProvider>
      </main>

      <Footer />
    </div>
  );
}
