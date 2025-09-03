import React from 'react';
import Image from 'next/image';

const HeroSkeleton: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Blurry background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/skeleton-image.jpg"
          alt="Loading background"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
      </div>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content skeleton with shimmer effect */}
      <div className="relative z-10 container-premium text-center text-white max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-0">
        {/* Heading skeleton */}
        <div className="space-y-3 md:space-y-4">
          <div className="h-16 md:h-24 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse mx-auto max-w-3xl" />
          <div className="h-6 md:h-8 bg-white/15 backdrop-blur-sm rounded animate-pulse mx-auto max-w-2xl" />
        </div>

        {/* Button skeletons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <div className="h-12 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse w-full sm:w-48" />
          <div className="h-12 sm:h-14 bg-white/15 backdrop-blur-sm rounded-lg animate-pulse w-full sm:w-48" />
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
