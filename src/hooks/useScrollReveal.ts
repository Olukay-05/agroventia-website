'use client';

import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Fallback: Show all elements after a short delay if intersection observer fails
    const fallbackTimeout = setTimeout(() => {
      const hiddenElements = document.querySelectorAll(
        '.scroll-reveal:not(.revealed)'
      );
      hiddenElements.forEach(el => {
        el.classList.add('revealed');
      });
    }, 1000);

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      clearTimeout(fallbackTimeout);
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Get all elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Immediately reveal elements that are already in viewport
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // If element is already visible, reveal it immediately
      if (rect.top < windowHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }

      observer.observe(el);
    });

    return () => {
      clearTimeout(fallbackTimeout);
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);
};

export default useScrollReveal;
