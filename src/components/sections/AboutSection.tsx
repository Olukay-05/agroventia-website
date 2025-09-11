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

interface CoreValue {
  title: string;
  description: string;
  _id: string;
  _owner: string;
  _createdDate: { $date: string };
  _updatedDate: { $date: string };
  isActive?: boolean;
  reference?: string;
}

interface AboutSectionProps {
  data?: {
    title?: string;
    sectionTitle?: string;
    description?: string;
    mission?: string;
    vision?: string;
    story?: string;
    coreValues?: CoreValue[];
  };
  isLoading: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ data, isLoading }) => {
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

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

  // Define carousel items for the mobile carousel using the same span components
  const carouselItems = [
    {
      title: 'Premium Products',
      description: 'Comprehensive range of agricultural solutions.',
      id: 1,
      spanContent: {
        text: '10+',
        bgColor: 'var(--agro-primary-100)',
        textColor: 'text-green-600',
        textSize: 'text-[14px]',
      },
    },
    {
      title: 'Global Markets Served',
      description:
        'Connecting African producers with buyers across North America, Europe, and beyond.',
      id: 2,
      spanContent: {
        text: '20+',
        bgColor: 'var(--agro-secondary-100)',
        textColor: 'text-yellow-700',
        textSize: 'text-[14px]',
      },
    },
    {
      title: 'Quality Guaranteed',
      description:
        'Every shipment undergoes strict checks for freshness, purity, and compliance.',
      id: 3,
      spanContent: {
        text: '100%',
        bgColor: 'var(--agro-accent-bronze-400)',
        textColor: 'text-brown-700',
        textSize: 'text-[14px]',
      },
    },
    {
      title: 'Years of Trade Expertise',
      description:
        'Over a decade of building strong supply chains with African producers.',
      id: 4,
      spanContent: {
        text: '10+',
        bgColor: 'var(--agro-neutral-100)',
        textColor: 'text-green-700',
        textSize: 'text-[14px]',
      },
    },
    {
      title: 'Reliable Logistics',
      description:
        'Seamless supply chain and dependable shipping — so you can source with confidence.',
      id: 5,
      spanContent: {
        text: '100%',
        bgColor: 'var(--agro-primary-200)',
        textColor: 'text-green-800',
        textSize: 'text-[14px]',
      },
    },
  ];

  if (isLoading) {
    return (
      <SectionContainer id="about" background="muted">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" text="Loading about content..." />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="about" className="py-16 md:py-24">
      {/* DotGrid Background - Full Section Coverage - Desktop Only */}
      <div className="absolute inset-0 w-full h-full hidden md:block">
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
          <h2 className="heading-section text-[#281909]">
            {data?.sectionTitle || data?.title || 'About AgroVentia'}
          </h2>

          {/* Mission/Vision Carousel - Replaces static mission display */}
          {data?.mission && data?.vision && (
            <div className="my-8">
              <MissionVisionCarousel
                mission={data.mission}
                vision={data.vision}
              />
            </div>
          )}
        </div>

        {/* Added even spacing for mobile screens */}
        <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-16">
          {/* Left Content - Centered on mobile */}
          <div className="space-y-16 scroll-reveal">
            <div className="space-y-6 ">
              <h3 className="heading-subsection text-center text-[#281909]">
                Our Story
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
                    className="text-agro-primary-600 font-semibold hover:text-agro-primary-800 transition-colors focus:outline-none focus:underline transform hover:scale-105 transition-transform duration-200"
                  >
                    {isStoryExpanded ? 'Read Less' : 'Read More'}
                  </button>
                </div>
              )}
            </div>

            {/* Core Values - Centered on mobile */}
            <div className="space-y-6">
              <h4 className="heading-card text-center">Core Values</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {data?.coreValues && Array.isArray(data.coreValues)
                  ? data.coreValues.map((valueObj, index) => (
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
                    ))
                  : [
                      'Quality Assurance',
                      'Sustainable Practices',
                      'Innovation Focus',
                      'Customer Excellence',
                    ].map((value, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CheckCircle
                          size={18}
                          className="text-green-600 flex-shrink-0"
                        />
                        <span className="text-gray-800 font-medium text-base">
                          {value}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Right Content - Carousel for mobile, TiltedContainer for desktop */}
          <div className="space-y-16 md:space-y-0">
            {/* Mobile Carousel - Reduced bottom spacing */}
            <div className="md:hidden scroll-reveal flex flex-col items-center justify-center -mb-52">
              <h4 className="heading-card mb-10 text-center">
                Why Choose AgroVentia?
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
                  baseWidth={300}
                  autoplay={true}
                  autoplayDelay={5000}
                  pauseOnHover={true}
                  loop={true}
                  round={false}
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
                      Why Choose AgroVentia?
                    </h4>

                    <div className="space-y-6">
                      {/* Premium Products */}
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-[16px]"
                          style={{ backgroundColor: 'var(--agro-primary-100)' }}
                        >
                          10+
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-gray-900 mb-1 text-base">
                            Premium Products
                          </h5>
                          <p className="text-sm text-gray-600">
                            Comprehensive range of agricultural solutions.
                          </p>
                        </div>
                      </div>

                      {/* Global Markets Served */}
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-yellow-700 font-bold text-[16px]"
                          style={{
                            backgroundColor: 'var(--agro-secondary-100)',
                          }}
                        >
                          20+
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-gray-900 mb-1 text-base">
                            Global Markets Served
                          </h5>
                          <p className="text-sm text-gray-600">
                            Connecting African producers with buyers across
                            North America, Europe, and beyond.
                          </p>
                        </div>
                      </div>

                      {/* Quality Guaranteed */}
                      <div className="flex items-start space-x-4">
                        <div
                          className="p-3 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-brown-700 font-bold text-[14px]"
                          style={{
                            backgroundColor: 'var(--agro-accent-bronze-400)',
                          }}
                        >
                          100%
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-gray-900 mb-1 text-base">
                            Quality Guaranteed
                          </h5>
                          <p className="text-sm text-gray-600">
                            Every shipment undergoes strict checks for
                            freshness, purity, and compliance.
                          </p>
                        </div>
                      </div>

                      {/* Years of Trade Expertise */}
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-[16px]"
                          style={{ backgroundColor: 'var(--agro-neutral-100)' }}
                        >
                          10+
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-gray-900 mb-1 text-base">
                            Years of Trade Expertise
                          </h5>
                          <p className="text-sm text-gray-600">
                            Over a decade of building strong supply chains with
                            African producers.
                          </p>
                        </div>
                      </div>

                      {/* Reliable Logistics */}
                      <div className="flex items-start space-x-4">
                        <div
                          className="p-3 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-green-800 font-bold text-[14px]"
                          style={{ backgroundColor: 'var(--agro-primary-200)' }}
                        >
                          100%
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-gray-900 mb-1 text-base">
                            Reliable Logistics
                          </h5>
                          <p className="text-sm text-gray-600">
                            Seamless supply chain and dependable shipping — so
                            you can source with confidence.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltedContainer>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutSection;
