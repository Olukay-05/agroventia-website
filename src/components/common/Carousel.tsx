import { useEffect, useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import React, { JSX } from 'react';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  // Changed to match the span components from AboutSection
  spanContent: {
    text: string;
    bgColor: string;
    textColor: string;
    textSize: string;
  };
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

// Updated default items to use span content similar to AboutSection
const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: 'Premium Products',
    description: 'Comprehensive range of agricultural solutions.',
    id: 1,
    spanContent: {
      text: '10+',
      bgColor: 'var(--agro-primary-100)',
      textColor: 'text-green-600',
      textSize: 'text-lg',
    },
  },
  {
    title: 'Global Markets',
    description:
      'Connecting African producers with buyers across North America, Europe, and beyond.',
    id: 2,
    spanContent: {
      text: '20+',
      bgColor: 'var(--agro-secondary-100)',
      textColor: 'text-yellow-700',
      textSize: 'text-lg',
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
    title: 'Trade Expertise',
    description:
      'Over a decade of building strong supply chains with African producers.',
    id: 4,
    spanContent: {
      text: '10+',
      bgColor: 'var(--agro-neutral-100)',
      textColor: 'text-green-700',
      textSize: 'text-lg',
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

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
// Fixed the type issue by properly defining the spring options
const SPRING_OPTIONS: { type: 'spring'; stiffness: number; damping: number } = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
    pauseOnHover,
  ]);

  // Fixed the type issue by properly defining the effectiveTransition
  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(prev => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${
        round
          ? 'rounded-full border border-white'
          : 'rounded-[24px] border border-[#222]'
      }`}
      style={{
        width: `${baseWidth}px`,
        backgroundColor: '#fcf9f1', // Changed from default to #fcf9f1
        ...(round && { height: `${baseWidth}px` }),
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const range = [
            -(index + 1) * trackItemOffset,
            -index * trackItemOffset,
            -(index - 1) * trackItemOffset,
          ];
          const outputRange = [90, 0, -90];
          const rotateY = useTransform(x, range, outputRange, { clamp: false }); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <motion.div
              key={index}
              className={`relative shrink-0 flex flex-col ${
                round
                  ? 'items-center justify-center text-center bg-[#fcf9f1] border-0' // Changed from #060010 to #fcf9f1
                  : 'items-start justify-between bg-[#fcf9f1] border border-[#222] rounded-[12px]' // Changed from #222 to #fcf9f1
              } overflow-hidden cursor-grab active:cursor-grabbing`}
              style={{
                width: itemWidth,
                height: round ? itemWidth : '100%',
                rotateY: rotateY,
                ...(round && { borderRadius: '50%' }),
              }}
              transition={effectiveTransition}
            >
              <div className={`${round ? 'p-0 m-0' : 'mb-4 p-5'}`}>
                {/* Using the same span component structure as in AboutSection */}
                <div
                  className={`p-[24px] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.spanContent.textSize} font-bold ${item.spanContent.textColor}`}
                  style={{ backgroundColor: item.spanContent.bgColor }}
                >
                  {item.spanContent.text}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-1 font-black text-lg text-[#016630]">
                  {' '}
                  {/* Changed text color to match brand */}
                  {item.title}
                </div>
                <p className="text-sm text-[#281909]">
                  {' '}
                  {/* Changed text color to match brand */}
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div
        className={`flex w-full justify-center ${round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : ''}`}
      >
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index
                  ? round
                    ? 'bg-[#281909]' // Changed to brand color
                    : 'bg-[#333333]'
                  : round
                    ? 'bg-[#555]'
                    : 'bg-[rgba(51,51,51,0.4)]'
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1,
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
