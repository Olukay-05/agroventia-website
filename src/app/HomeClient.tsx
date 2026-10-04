'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
// import ServicesSection from '@/components/sections/ServicesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ContactSection from '@/components/sections/ContactSection';
import { useAllCollections } from '@/hooks/useAllCollections';
import {
  useHeroContent,
  useAboutContent,
  useContactContent,
} from '@/hooks/useContent';
import { extractHomepageData } from '@/lib/utils/extractHomepageData';
import useScrollReveal from '@/hooks/useScrollReveal';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';

export default function HomeClient() {
  const { data, isLoading, error } = useAllCollections();
  const { data: heroList, isLoading: isHeroLoading } = useHeroContent();
  const { data: aboutList, isLoading: isAboutLoading } = useAboutContent();
  const { data: contactList, isLoading: isContactLoading } = useContactContent();

  // Initialize scroll reveal animations
  useScrollReveal();

  // Don't show loading state for too long - fallback to mock data
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && isHeroLoading) {
        setShowFallback(true);
      }
    }, 8000); // Show fallback after 8 seconds

    return () => clearTimeout(timer);
  }, [isLoading, isHeroLoading]);

  // Ensure we always have consistent data structures
  const safeData = data || null;

  // Handle error state more gracefully
  if (error) {
    console.warn(
      'Error loading collections data, using fallback:',
      error.message
    );
  }

  // Use data if available, otherwise use mock data (especially if loading is taking too long)
  const shouldUseData = safeData && !showFallback;
  const effectiveLoading = isLoading && !showFallback;

  // Extract data using the centralized utility function
  const { heroData, aboutData, productsData, contactData } =
    extractHomepageData(safeData, shouldUseData);

  // Localized data from Sanity hooks takes priority
  const effectiveHeroData = heroList?.[0] || heroData;
  const effectiveAboutData = aboutList?.[0] || aboutData;
  const effectiveContactData = contactList?.[0] || contactData;

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <QuoteRequestProvider>
          <HeroSection
            data={effectiveHeroData}
            collectionsData={safeData}
            isLoading={isHeroLoading && effectiveLoading}
          />
          <ProductsSection data={productsData} isLoading={effectiveLoading} />
          <AboutSection
            data={effectiveAboutData}
            isLoading={isAboutLoading && effectiveLoading}
          />
          {/* <ServicesSection data={servicesData} isLoading={effectiveLoading} /> */}
          <ContactSection
            data={effectiveContactData}
            isLoading={isContactLoading && effectiveLoading}
          />
        </QuoteRequestProvider>
      </main>

      <Footer />
    </div>
  );
}
