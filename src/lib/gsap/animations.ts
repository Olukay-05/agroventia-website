// lib/gsap/animations.ts
import gsap from 'gsap';

export const fadeInUp = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
};

export const staggeredFadeIn = (elements: HTMLElement[]) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
    }
  );
};
