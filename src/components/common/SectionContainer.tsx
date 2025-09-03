'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import WixImage from '@/components/WixImage';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'gradient' | 'image';
  backgroundImage?: string;
  padding?: 'default' | 'large' | 'small';
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
  id,
  background = 'default',
  backgroundImage,
  padding = 'default',
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const backgroundClasses = {
    default: 'bg-white',
    muted: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-green-50 via-white to-blue-50',
    image: imageError ? 'bg-gray-200' : 'bg-cover bg-center bg-no-repeat',
  };

  const paddingClasses = {
    small: 'py-8 md:py-12 lg:py-16',
    default: 'py-12 md:py-16 lg:py-24',
    large: 'py-16 md:py-20 lg:py-32',
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        'overflow-hidden',
        background === 'image' ? 'relative' : '',
        className
      )}
    >
      {background === 'image' && backgroundImage && (
        <>
          {/* Background image using WixImage component */}
          <div className="absolute inset-0 z-0">
            <WixImage
              src={backgroundImage}
              alt=""
              fill={true}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
              onLoadError={handleImageError}
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        </>
      )}

      <div className="container-premium relative z-20">{children}</div>
    </section>
  );
};

export default SectionContainer;
