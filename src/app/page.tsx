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

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-red-700 mb-4">
            Error Loading Data
          </h2>
          <p className="text-red-600 mb-4 text-sm md:text-base">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 text-sm md:text-base transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use data if available, otherwise use mock data (especially if loading is taking too long)
  const shouldUseData = safeData && !showFallback;
  const effectiveLoading = isLoading && !showFallback;

  // Extract data using the centralized utility function
  const { heroData, aboutData, servicesData, productsData, contactData } =
    extractHomepageData(safeData, shouldUseData);

  return (
    <div className="min-h-screen">
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
