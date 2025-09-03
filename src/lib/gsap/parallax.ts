// lib/gsap/parallax.ts
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initParallax = (element: HTMLElement, speed: number = 0.5) => {
  gsap.to(element, {
    yPercent: -speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};
