'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import SectionContainer from '@/components/common/SectionContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DotGrid from '@/components/ui/DotGrid';
import TiltedContainer from '@/components/ui/TiltedContainer';
import Carousel from '@/components/common/Carousel';
import MissionVisionCarousel from '@/components/common/MissionVisionCarousel';
import { cn } from '@/lib/utils';
import type { HighlightItem, CoreValue, AboutContent } from '@/types/content';
import { useLocale } from '@/contexts/LocaleContext';

export interface AboutSectionData extends Partial<AboutContent> {
  title?: string;
  description?: string;
}

interface AboutSectionProps {
  data?: AboutSectionData | null;
  isLoading: boolean;
}

const getVariantStyles = (variant?: string) => {
  switch (variant) {
    case 'secondary':
      return {
        bgColor: 'var(--agro-secondary-100)',
        textColor: 'text-yellow-700',
        textSize: 'text-[16px]',
      };
    case 'bronze':
      return {
        bgColor: 'var(--agro-accent-bronze-400)',
        textColor: 'text-brown-700',
        textSize: 'text-[14px]',
      };
    case 'neutral':
      return {
        bgColor: 'var(--agro-neutral-100)',
        textColor: 'text-green-700',
        textSize: 'text-[16px]',
      };
    case 'forest':
      return {
        bgColor: 'var(--agro-primary-200)',
        textColor: 'text-green-800',
        textSize: 'text-[14px]',
      };
    case 'primary':
    default:
      return {
        bgColor: 'var(--agro-primary-100)',
        textColor: 'text-green-600',
        textSize: 'text-[16px]',
      };
  }
};

const defaultHighlightsEn: HighlightItem[] = [
  {
    _key: 'hl-1',
    metric: '10+',
    title: 'Premium Products',
    description: 'Comprehensive range of agricultural solutions.',
    colorVariant: 'primary',
  },
  {
    _key: 'hl-2',
    metric: '20+',
    title: 'Global Markets Served',
    description:
      'Connecting African producers with buyers across North America, Europe, and beyond.',
    colorVariant: 'secondary',
  },
  {
    _key: 'hl-3',
    metric: '100%',
    title: 'Quality Guaranteed',
    description:
      'Every shipment undergoes strict checks for freshness, purity, and compliance.',
    colorVariant: 'bronze',
  },
  {
    _key: 'hl-4',
    metric: '10+',
    title: 'Years of Trade Expertise',
    description:
      'Over a decade of building strong supply chains with African producers.',
    colorVariant: 'neutral',
  },
  {
    _key: 'hl-5',
    metric: '100%',
    title: 'Reliable Logistics',
    description:
      'Seamless supply chain and dependable shipping so you can source with confidence.',
    colorVariant: 'forest',
  },
];

const defaultHighlightsFr: HighlightItem[] = [
  {
    _key: 'hl-1',
    metric: '10+',
    title: 'Produits haut de gamme',
    description: 'Gamme complète de commodités agricoles certifiées.',
    colorVariant: 'primary',
  },
  {
    _key: 'hl-2',
    metric: '20+',
    title: 'Marchés mondiaux desservis',
    description:
      'Connexion directe des producteurs aux acheteurs en Amérique du Nord et à l’international.',
    colorVariant: 'secondary',
  },
  {
    _key: 'hl-3',
    metric: '100%',
    title: 'Qualité garantie',
    description:
      'Contrôles rigoureux de pureté, fraîcheur et conformité réglementaire sur chaque lot.',
    colorVariant: 'bronze',
  },
  {
    _key: 'hl-4',
    metric: '10+',
    title: 'Années d’expertise commerciale',
    description:
      'Plus d’une décennie d’expertise dans le développement de chaînes d’approvisionnement durables.',
    colorVariant: 'neutral',
  },
  {
    _key: 'hl-5',
    metric: '100%',
    title: 'Logistique fiable',
    description:
      'Gestion logistique intégrée et traçabilité complète pour un approvisionnement sans risque.',
    colorVariant: 'forest',
  },
];

const defaultHighlightsEsp: HighlightItem[] = [
  {
    _key: 'hl-1',
    metric: '10+',
    title: 'Productos prémium',
    description:
      'Portafolio integral de productos agrícolas certificados para importación y exportación.',
    colorVariant: 'primary',
  },
  {
    _key: 'hl-2',
    metric: '20+',
    title: 'Mercados internacionales',
    description:
      'Conectando productores agrícolas con compradores estratégicos en Norteamérica y Europa.',
    colorVariant: 'secondary',
  },
  {
    _key: 'hl-3',
    metric: '100%',
    title: 'Calidad garantizada',
    description:
      'Inspecciones técnicas de pureza, humedad y cumplimiento de estándares internacionales.',
    colorVariant: 'bronze',
  },
  {
    _key: 'hl-4',
    metric: '10+',
    title: 'Años de experiencia comercial',
    description:
      'Más de diez años construyendo alianzas sólidas en cadenas de suministro agroalimentarias.',
    colorVariant: 'neutral',
  },
  {
    _key: 'hl-5',
    metric: '100%',
    title: 'Logística confiable',
    description:
      'Flujo logístico integral y entregas puntuales para asegurar su abastecimiento continuo.',
    colorVariant: 'forest',
  },
];

const ABOUT_UI = {
  en: {
    mission: 'Our Mission',
    vision: 'Our Vision',
    slideLabel: (index: number) => `Go to slide ${index + 1}`,
    ourStory: 'Our Story',
    readMore: 'Read More',
    readLess: 'Read Less',
    coreValues: 'Core Values',
    whyChoose: 'Why Choose AgroVentia Inc.?',
    highlights: defaultHighlightsEn,
  },
  fr: {
    mission: 'Notre mission',
    vision: 'Notre vision',
    slideLabel: (index: number) => `Aller à la diapositive ${index + 1}`,
    ourStory: 'Notre histoire',
    readMore: 'En savoir plus',
    readLess: 'Moins de détails',
    coreValues: 'Nos valeurs fondamentales',
    whyChoose: 'Pourquoi choisir AgroVentia Inc. ?',
    highlights: defaultHighlightsFr,
  },
  esp: {
    mission: 'Nuestra misión',
    vision: 'Nuestra visión',
    slideLabel: (index: number) => `Ir a la diapositiva ${index + 1}`,
    ourStory: 'Nuestra historia',
    readMore: 'Leer más',
    readLess: 'Leer menos',
    coreValues: 'Nuestros valores fundamentales',
    whyChoose: '¿Por qué elegir AgroVentia Inc.?',
    highlights: defaultHighlightsEsp,
  },
};

const AboutSection: React.FC<AboutSectionProps> = ({ data, isLoading }) => {
  const { locale } = useLocale();
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  const cleanLocale = (locale || 'en').toLowerCase().trim();
  const langKey = cleanLocale.startsWith('fr')
    ? 'fr'
    : cleanLocale.startsWith('es') || cleanLocale === 'esp'
      ? 'esp'
      : 'en';
  const ui = ABOUT_UI[langKey];

  // Set the character limit for the story text preview
  const STORY_PREVIEW_LENGTH = 300;

  // Get the full story text
  const fullStory = data?.story || '';

  // Determine if we need to show the "Read More" button
  const shouldShowReadMore = fullStory.length > STORY_PREVIEW_LENGTH;

  // Get the preview text (first 300 characters + ...)
  const storyPreview = shouldShowReadMore
    ? fullStory.substring(0, STORY_PREVIEW_LENGTH) + '...'
    : fullStory;

  const effectiveHighlights =
    data?.highlights && data.highlights.length > 0
      ? data.highlights
      : ui.highlights;

  // Define carousel items for the mobile carousel using dynamic highlights
  const carouselItems = effectiveHighlights.map((hl, index) => {
    const styles = getVariantStyles(hl.colorVariant);
    return {
      title: hl.title,
      description: hl.description,
      id: index + 1,
      spanContent: {
        text: hl.metric,
        bgColor: styles.bgColor,
        textColor: styles.textColor,
        textSize: 'text-[14px]',
      },
    };
  });

  if (isLoading) {
    return (
      <SectionContainer id="about" background="muted" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto space-y-12 animate-pulse">
          <div className="text-center space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-14 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="h-80 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <section id="about" className="py-16 md:py-24 overflow-visible relative">
      {/* DotGrid Background - Full Section Coverage - Desktop Only */}
      <div className="absolute inset-0 w-screen left-1/2 transform -translate-x-1/2 hidden md:block">
        <DotGrid
          dotSize={3}
          gap={40}
          baseColor="#4a3e33"
          activeColor="#4a3e33"
          proximity={120}
          shockRadius={200}
          shockStrength={4}
          resistance={800}
          returnDuration={1.8}
          className="opacity-30 w-full h-full"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          {(data?.sectionTitle || data?.title) && (
            <h2 className="heading-section text-[#281909]">
              {data.sectionTitle || data.title}
            </h2>
          )}

          {/* Mission/Vision Carousel - Replaces static mission display */}
          {data?.mission && data?.vision && (
            <div className="my-8">
              <MissionVisionCarousel
                mission={data.mission}
                vision={data.vision}
                missionLabel={ui.mission}
                visionLabel={ui.vision}
              />
            </div>
          )}
        </div>

        {/* Added even spacing for mobile screens */}
        <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-16">
          {/* Left Content - Centered on mobile */}
          <div className="space-y-16 scroll-reveal">
            {fullStory && (
              <div className="space-y-6 ">
                <h3 className="heading-subsection text-center text-[#281909]">
                  {ui.ourStory}
                </h3>
                <div
                  className={cn(
                    'text-body-large leading-relaxed expandable-text text-center lg:text-left relative overflow-hidden text-[#281909]',
                    isStoryExpanded
                      ? 'expanded opacity-100'
                      : 'collapsed opacity-90'
                  )}
                  dangerouslySetInnerHTML={{
                    __html: isStoryExpanded ? fullStory : storyPreview,
                  }}
                />
                {shouldShowReadMore && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                      className="text-agro-primary-600 font-semibold hover:text-agro-primary-800 cursor-pointer focus:outline-none focus:underline transform hover:scale-105 transition-transform duration-200"
                    >
                      {isStoryExpanded ? ui.readLess : ui.readMore}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Core Values - Centered on mobile */}
            {data?.coreValues &&
              Array.isArray(data.coreValues) &&
              data.coreValues.length > 0 && (
                <div className="space-y-6">
                  <h4 className="heading-card text-center">{ui.coreValues}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {data.coreValues.map((valueObj, index) => (
                      <div
                        key={valueObj._id || index}
                        className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CheckCircle
                          size={18}
                          className="text-green-600 flex-shrink-0"
                        />
                        <span className="text-gray-800 font-medium text-base">
                          {valueObj.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Right Content - Carousel for mobile, TiltedContainer for desktop */}
          <div className="space-y-16 md:space-y-0">
            {/* Mobile Carousel - Reduced bottom spacing */}
            <div className="md:hidden scroll-reveal flex flex-col items-center justify-center -mb-52">
              <h4 className="heading-card mb-10 text-center">
                {data?.whyChooseTitle || ui.whyChoose}
              </h4>
              <div
                style={{
                  height: '600px',
                  width: '100%',
                  maxWidth: '300px',
                  position: 'relative',
                }}
              >
                <Carousel
                  items={carouselItems}
                  slideLabel={ui.slideLabel}
                  baseWidth={300}
                  autoplay={true}
                  autoplayDelay={5000}
                  pauseOnHover={true}
                  loop={true}
                  round={true}
                />
              </div>
            </div>

            {/* Desktop: TiltedContainer component - Centered */}
            <div className="hidden md:block flex justify-center h-full">
              <TiltedContainer
                rotateAmplitude={8}
                scaleOnHover={1.02}
                className="scroll-reveal w-full"
              >
                <div className="space-y-8 h-full flex flex-col justify-center">
                  <div className="glass-card p-8 shadow-md">
                    <h4 className="heading-card mb-6 text-center">
                      {data?.whyChooseTitle || ui.whyChoose}
                    </h4>

                    <div className="space-y-6">
                      {effectiveHighlights.map((hl, index) => {
                        const styles = getVariantStyles(hl.colorVariant);
                        return (
                          <div
                            key={hl._key || index}
                            className="flex items-start space-x-4"
                          >
                            <div
                              className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold',
                                styles.textColor,
                                styles.textSize
                              )}
                              style={{ backgroundColor: styles.bgColor }}
                            >
                              {hl.metric}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-semibold text-gray-900 mb-1 text-base">
                                {hl.title}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {hl.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TiltedContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
