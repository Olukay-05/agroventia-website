'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { AutoplayType } from 'embla-carousel-autoplay';

// Simple classnames function since we can't import from utils
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface MissionVisionCarouselProps {
  mission: string;
  vision: string;
}

const MissionVisionCarousel: React.FC<MissionVisionCarouselProps> = ({
  mission,
  vision,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: 'y',
      loop: true,
      duration: 30,
      slidesToScroll: 1,
      align: 'start',
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const autoplayRef = React.useRef<AutoplayType | null>(null);

  React.useEffect(() => {
    if (emblaApi) {
      autoplayRef.current = emblaApi.plugins().autoplay as AutoplayType;
    }
  }, [emblaApi]);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden h-52 lg:h-28" ref={emblaRef}>
        <div className="flex flex-col h-full">
          <div className="flex-[0_0_100%] flex items-center justify-center p-6 w-full">
            <div className="flex flex-col items-center justify-between gap-2">
              <h4 className="font-bold">Our Mission</h4>
              <div
                className="text-[#281909] text-center leading-relaxed"
                dangerouslySetInnerHTML={{ __html: mission }}
              />
            </div>
          </div>
          <div className="flex-[0_0_100%] flex items-center justify-center p-6 w-full">
            <div className="flex flex-col items-center justify-between gap-2">
              <h4 className="font-bold">Our Vision</h4>
              <div
                className="text-[#281909] text-center leading-relaxed"
                dangerouslySetInnerHTML={{ __html: vision }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      {/* <div className="flex justify-center mt-6 space-x-2">
        {[0, 1].map(index => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              index === (emblaApi?.selectedScrollSnap() ?? 0)
                ? 'bg-[#281909] scale-125'
                : 'bg-[#281909]/30'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default MissionVisionCarousel;
