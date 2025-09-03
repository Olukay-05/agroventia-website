'use client';

import React, { useState, useEffect } from 'react';
import PillNav from '@/components/common/PillNav';
import { LanguageSelector } from '@/components/common/LanguageSelector';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Products', href: '/#products' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-4'
      }`}
    >
      <div className="container-premium flex justify-between items-center">
        <PillNav
          logo="/agroventia-logo.jpg"
          logoAlt="AgroVentia Logo"
          items={navigationItems}
          activeHref="/"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#281909" /* Cal Poly Green - Primary Brand Color */
          pillColor="#FDF8F0" /* Floral White - Neutral Background */
          hoveredPillTextColor="#FDF8F0" /* Floral White for hover text */
          pillTextColor="#281909" /* Bistre - Dark text for contrast */
          logoBackgroundColor="#f9ede0" /* Custom logo background color */
          initialLoadAnimation={false}
        />
        <div className="ml-4">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
