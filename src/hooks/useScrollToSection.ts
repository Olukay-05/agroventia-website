'use client';

import { useCallback } from 'react';

export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId: string, offset = 0) => {
    console.log(`Attempting to scroll to section with ID: ${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`Found element with ID: ${sectionId}`, element);
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      console.warn(`Element with id "${sectionId}" not found`);
    }
  }, []);

  return { scrollToSection };
};

export default useScrollToSection;
