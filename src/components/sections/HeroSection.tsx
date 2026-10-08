'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import BlurredHeroSkeleton from '@/components/common/BlurredHeroSkeleton';
import SanityImage from '@/components/SanityImage';
import { cn } from '@/lib/utils';
import { HeroContent } from '@/types/content';
import { useHeroContent, useCarouselImages } from '@/hooks/useContent';
import useScrollToSection from '@/hooks/useScrollToSection';
import { trackButtonClick } from '@/lib/analytics';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

export interface CarouselItem {
  imageUrl: string;
  title: string;
  description: string;
  tagline?: string;
  displayOrder?: number;
}

interface HeroSectionProps {
  data?: HeroContent;
  isLoading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  isLoading,
}) => {
  // Hooks for fetching hero singleton and carousel slides from Sanity
  const {
    data: heroContentData,
    isLoading: hookIsLoading,
    error: heroContentError,
  } = useHeroContent();
  const {
    data: sanityCarouselSlides,
    isLoading: isCarouselSlidesLoading,
  } = useCarouselImages();
  const heroContent = data || heroContentData?.[0];
  const { scrollToSection } = useScrollToSection();

  // Calculate effectiveIsLoading first to avoid reference error
  const effectiveIsLoading =
    isLoading !== undefined ? isLoading : hookIsLoading;

  // Determine display mode: 'carousel' (default) vs 'static' singleton banner
  const isCarouselMode = (heroContent?.displayMode ?? 'carousel') === 'carousel';

  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  // State for background image carousel
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselError, setCarouselError] = useState<string | null>(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Set up Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
    },
    [Fade(), Autoplay({ delay: 7000, stopOnInteraction: false })]
  );

  // Fetch carousel data from Sanity carouselSlide collection or fallback
  useEffect(() => {
    // If not in carousel mode, no need to process or wait for carousel data
    // If not in carousel mode, no need to process or wait for carousel data
    if (!isCarouselMode) {
      setCarouselLoading(false);
      return;
    }

    // Prioritize live Sanity Carousel Slides
    if (sanityCarouselSlides && sanityCarouselSlides.length > 0) {
      const items: CarouselItem[] = sanityCarouselSlides.map(slide => ({
        imageUrl: slide.image,
        title: slide.title || '',
        description: slide.description || slide.imageDescription || '',
        tagline: slide.tagline || '',
        displayOrder: slide.displayOrder,
      }));
      setCarouselItems(items);
      setCarouselLoading(false);
      return;
    }

    if (!isCarouselSlidesLoading) {
      setCarouselLoading(false);
    }
  }, [isCarouselMode, sanityCarouselSlides, isCarouselSlidesLoading]);

  // Handle carousel selection changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect(); // Set initial selection

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Re-initialize Embla when carousel slides change
  useEffect(() => {
    if (emblaApi && carouselItems.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, carouselItems]);

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2;
        backgroundRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effective carousel loading only blocks skeleton when carousel mode is active
  const effectiveCarouselLoading = isCarouselMode
    ? (carouselLoading || isCarouselSlidesLoading)
    : false;

  // Handle content loading state
  useEffect(() => {
    if (!effectiveIsLoading && !effectiveCarouselLoading) {
      // Add a small delay to ensure content is rendered before showing
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setContentLoaded(false);
    }
  }, [effectiveIsLoading, effectiveCarouselLoading]);

  // Show skeleton only during initial data loading or active carousel loading
  if (effectiveIsLoading || effectiveCarouselLoading) {
    return <BlurredHeroSkeleton />;
  }

  // If we have an error with hero content and no fallback data, show a minimal version
  if (heroContentError && !heroContent) {
    console.warn(
      'Hero content error, using minimal fallback:',
      heroContentError.message
    );
    // Continue with minimal content
  }

  if (carouselError) {
    console.debug('Carousel error (non-critical):', carouselError);
  }

  // Get the currently selected carousel item
  const selectedCarouselItem = carouselItems[selectedIndex];


  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background: Image Carousel with Parallax OR Static Singleton Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] overflow-hidden"
      >
        {isCarouselMode && carouselItems.length > 0 ? (
          <div className="w-full h-full" ref={emblaRef}>
            <div className="flex h-full">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative w-full h-full"
                >
                  <SanityImage
                    src={item.imageUrl}
                    alt={`Carousel background ${index + 1}`}
                    fill={true}
                    sizes="100vw"
                    quality={90}
                    className="w-full h-full"
                    style={{ objectFit: 'cover' }}
                    loading={index === 0 ? 'eager' : 'lazy'} // Load first image eagerly, others lazily
                    placeholderColor="bg-gradient-to-br from-green-600/20 via-emerald-700/20 to-teal-800/20"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : // Fallback to singleton background image or gradient
          heroContent?.backgroundImage &&
            heroContent.backgroundImage.trim() !== '' ? (
            <div className="responsive-image w-full h-full">
              <SanityImage
                src={heroContent.backgroundImage || ''}
                alt="Agricultural landscape background"
                fill={true}
                sizes="100vw"
                quality={90}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
                loading="eager"
                placeholderColor="bg-gradient-to-br from-green-600/20 via-emerald-700/20 to-teal-800/20"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-600 via-green-700 to-green-800" />
          )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30"
        style={
          heroContent?.overlayOpacity !== undefined
            ? { opacity: heroContent.overlayOpacity / 100 }
            : undefined
        }
      />

      {/* Content */}
      <div className="relative z-10 container-premium text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-0">
          {/* Main Heading */}
          <div className="space-y-3 md:space-y-4 scroll-reveal">
            {(isCarouselMode && selectedCarouselItem?.title
              ? selectedCarouselItem.title
              : heroContent?.title) && (
                <h1
                  className={cn(
                    'heading-hero px-2 transition-opacity duration-1000 ease-in-out',
                    contentLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {isCarouselMode && selectedCarouselItem?.title
                    ? selectedCarouselItem.title
                    : heroContent?.title}
                </h1>
              )}
            {(isCarouselMode
              ? selectedCarouselItem?.tagline ||
              selectedCarouselItem?.description
              : heroContent?.subtitle) && (
                <p
                  className={cn(
                    'text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-gray-200 max-w-3xl mx-auto px-2 transition-opacity duration-1000 ease-in-out',
                    contentLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {isCarouselMode
                    ? selectedCarouselItem?.tagline ||
                    selectedCarouselItem?.description
                    : heroContent?.subtitle}
                </p>
              )}
            {!isCarouselMode && heroContent?.description && (
              <p
                className={cn(
                  'text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-2 transition-opacity duration-1000 ease-in-out',
                  contentLoaded ? 'opacity-100' : 'opacity-0'
                )}
              >
                {heroContent.description}
              </p>
            )}
          </div>

          {/* Call to Action Buttons */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 scroll-reveal px-4">
            {heroContent?.ctaPrimary && (
              <Button
                size="lg"
                className={cn(
                  'btn-agro-primary cursor-pointer text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto sm:min-w-[200px] group transition-opacity duration-1000 ease-in-out',
                  contentLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onClick={() => {
                  scrollToSection('products');
                  trackButtonClick('hero_cta_explore_products');
                }}
              >
                {heroContent.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            {heroContent?.ctaSecondary && (
              <Button
                variant="glass"
                size="lg"
                className={cn(
                  'text-base cursor-pointer sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto sm:min-w-[200px] group border-white/30 text-white hover:bg-white/20 backdrop-blur-lg shadow-lg transition-opacity duration-1000 ease-in-out',
                  contentLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onClick={() => {
                  scrollToSection('contact');
                  trackButtonClick('hero_cta_contact_us');
                }}
              >
                {heroContent.ctaSecondary}
                <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
