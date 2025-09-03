'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'stagger';
  delay?: number;
  stagger?: number;
  triggerStart?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fadeUp',
  delay = 0,
  stagger = 0.1,
  triggerStart = 'top 80%',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const element = sectionRef.current;
    const targets = animationType === 'stagger' ? element.children : element;

    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {};

    switch (animationType) {
      case 'fadeUp':
        fromVars = { opacity: 0, y: 50 };
        toVars = { opacity: 1, y: 0 };
        break;
      case 'fadeLeft':
        fromVars = { opacity: 0, x: -50 };
        toVars = { opacity: 1, x: 0 };
        break;
      case 'fadeRight':
        fromVars = { opacity: 0, x: 50 };
        toVars = { opacity: 1, x: 0 };
        break;
      case 'scale':
        fromVars = { opacity: 0, scale: 0.8 };
        toVars = { opacity: 1, scale: 1 };
        break;
      case 'stagger':
        fromVars = { opacity: 0, y: 30 };
        toVars = { opacity: 1, y: 0 };
        break;
    }

    gsap.fromTo(targets, fromVars, {
      ...toVars,
      duration: 0.8,
      delay,
      stagger: animationType === 'stagger' ? stagger : 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: triggerStart,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animationType, delay, stagger, triggerStart]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;
