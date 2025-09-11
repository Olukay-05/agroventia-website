'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import BlurredHeroSkeleton from '@/components/common/BlurredHeroSkeleton';
import WixImage from '@/components/WixImage';
import { cn } from '@/lib/utils';
import {
  carouselService,
  CarouselItem,
  WixCarouselItem,
} from '@/services/carousel.service';
import { HeroContent } from '@/types/wix';
import useScrollToSection from '@/hooks/useScrollToSection';
import { trackButtonClick } from '@/lib/analytics';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

interface HeroSectionProps {
  data?: HeroContent;
  collectionsData?: {
    carouselImages?: {
      items: Array<{ data: WixCarouselItem }>;
    };
  };
  isLoading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  collectionsData,
  isLoading,
}) => {
  // For backward compatibility, we'll still use the hook if no data is provided
  const {
    data: heroContentData,
    isLoading: hookIsLoading,
    error: heroContentError,
  } = useHeroContent();
  const heroContent = data || heroContentData?.[0];
  const { scrollToSection } = useScrollToSection();

  // Calculate effectiveIsLoading first to avoid reference error
  const effectiveIsLoading =
    isLoading !== undefined ? isLoading : hookIsLoading;

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

  // Fetch carousel data from CarouselImageDisplay collection
  useEffect(() => {
    // If collectionsData is provided, use it instead of fetching
    if (
      collectionsData &&
      collectionsData.carouselImages &&
      collectionsData.carouselImages.items
    ) {
      try {
        const items = collectionsData.carouselImages.items
          .map(item => ({
            imageUrl: item.data.imageUrl,
            title: item.data.title,
            description: item.data.description,
            tagline: item.data.tagline,
          }))
          .sort((a: CarouselItem, b: CarouselItem) => {
            const itemA = collectionsData.carouselImages?.items.find(
              item => item.data.title === a.title
            );
            const itemB = collectionsData.carouselImages?.items.find(
              item => item.data.title === b.title
            );
            const orderA = itemA?.data?.displayOrder || 0;
            const orderB = itemB?.data?.displayOrder || 0;
            return (orderA || 0) - (orderB || 0);
          });

        if (items.length > 0) {
          setCarouselItems(items);
        }
        setCarouselLoading(false);
        return;
      } catch (err) {
        console.error('Error processing carousel data:', err);
      }
    }

    const fetchCarouselData = async () => {
      try {
        setCarouselLoading(true);
        setCarouselError(null);

        const items = await carouselService.fetchCarouselItems();

        if (items.length > 0) {
          setCarouselItems(items);
        } else {
          // If no carousel data, fall back to original implementation
          console.debug('No carousel data found, using fallback');
        }
      } catch (error) {
        console.error('Error fetching carousel data:', error);
        setCarouselError(
          error instanceof Error
            ? error.message
            : 'Failed to load carousel data'
        );
        // Fall back to original implementation on error
      } finally {
        setCarouselLoading(false);
      }
    };

    // Fetch carousel data
    fetchCarouselData();
  }, [collectionsData]);

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

  // Handle content loading state
  useEffect(() => {
    if (!effectiveIsLoading && !carouselLoading) {
      // Add a small delay to ensure content is rendered before showing
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setContentLoaded(false);
    }
  }, [effectiveIsLoading, carouselLoading]);

  // Show skeleton only during initial data loading or carousel loading
  if (effectiveIsLoading || carouselLoading) {
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
      {/* Background Image Carousel with Parallax */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] overflow-hidden"
      >
        {carouselItems.length > 0 ? (
          <div className="w-full h-full" ref={emblaRef}>
            <div className="flex h-full">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative w-full h-full"
                >
                  <WixImage
                    src={item.imageUrl}
                    alt={`Carousel background ${index + 1}`}
                    fill={true}
                    className="w-full h-full"
                    style={{ objectFit: 'cover' }}
                    loading={index === 0 ? 'eager' : 'lazy'} // Load first image eagerly, others lazily
                    placeholderColor="bg-gradient-to-br from-green-600/20 via-emerald-700/20 to-teal-800/20"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : // Fallback to original background image or gradient
        heroContent?.backgroundImage &&
          heroContent.backgroundImage.trim() !== '' ? (
          <div className="responsive-image w-full h-full">
            <WixImage
              src={heroContent.backgroundImage || ''}
              alt="Agricultural landscape background"
              fill={true}
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />

      {/* Content */}
      <div className="relative z-10 container-premium text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-0">
          {/* Main Heading */}
          <div className="space-y-3 md:space-y-4 scroll-reveal">
            <h1
              className={cn(
                'heading-hero px-2 transition-opacity duration-1000 ease-in-out',
                contentLoaded ? 'opacity-100' : 'opacity-0'
              )}
            >
              {selectedCarouselItem?.title ||
                heroContent?.title ||
                'Premium Agricultural Imports from West Africa'}
            </h1>
            <p
              className={cn(
                'text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-gray-200 max-w-3xl mx-auto px-2 transition-opacity duration-1000 ease-in-out',
                contentLoaded ? 'opacity-100' : 'opacity-0'
              )}
            >
              {selectedCarouselItem?.tagline ||
                selectedCarouselItem?.description ||
                heroContent?.subtitle ||
                'Connecting Global Markets with Quality Agricultural Products'}
            </p>
          </div>

          {/* Call to Action Buttons */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 scroll-reveal px-4">
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
              {heroContent?.ctaPrimary || 'Explore Products'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {(heroContent?.ctaSecondary || (data && data.ctaSecondary)) && (
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
                {heroContent?.ctaSecondary ||
                  data?.ctaSecondary ||
                  'Contact Us'}
                <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// We still need to import the hook for backward compatibility
import { useHeroContent } from '@/hooks/useWixContent';

export default HeroSection;
