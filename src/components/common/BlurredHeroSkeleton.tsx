import React from 'react';
import Image from 'next/image';
import './shimmer.css';

const BlurredHeroSkeleton: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Blurry background image */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] overflow-hidden">
        <Image
          src="/skeleton-image.jpg"
          alt="Loading background"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content skeleton with shimmer effect */}
      <div className="relative z-10 container-premium text-center text-white max-w-4xl mx-auto space-y-6 md:space-y-8 px-4 sm:px-0">
        {/* Heading skeleton with blur effect */}
        <div className="space-y-3 md:space-y-4">
          <div
            className="mx-auto max-w-3xl h-16 md:h-24 rounded-lg shimmer-animation backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
              filter: 'blur(8px)',
            }}
            aria-hidden="true"
          />
          <div
            className="mx-auto max-w-2xl h-6 md:h-8 rounded shimmer-animation backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)',
              filter: 'blur(6px)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Button skeletons with blur effect */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <div
            className="h-12 sm:h-14 rounded-lg shimmer-animation w-full sm:w-48 backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
              filter: 'blur(6px)',
            }}
            aria-hidden="true"
          />
          <div
            className="h-12 sm:h-14 rounded-lg shimmer-animation w-full sm:w-48 backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)',
              filter: 'blur(6px)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default BlurredHeroSkeleton;
