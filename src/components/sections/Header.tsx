'use client';

import React, { useState, useEffect } from 'react';
import PillNav from '@/components/common/PillNav';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useLocale } from '@/contexts/LocaleContext';

const NAV_LABELS: Record<string, { home: string; products: string; about: string; blog: string; contact: string }> = {
  en: { home: 'Home', products: 'Products', about: 'About', blog: 'Blog', contact: 'Contact' },
  fr: { home: 'Accueil', products: 'Produits', about: 'À Propos', blog: 'Blogue', contact: 'Contact' },
  esp: { home: 'Inicio', products: 'Productos', about: 'Nosotros', blog: 'Blog', contact: 'Contacto' },
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale } = useLocale();

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

  const langKey = locale.startsWith('fr')
    ? 'fr'
    : locale.startsWith('es') || locale === 'esp'
      ? 'esp'
      : 'en';
  const labels = NAV_LABELS[langKey] || NAV_LABELS.en;

  const navigationItems = [
    { label: labels.home, href: '/' },
    { label: labels.products, href: '/#products' },
    { label: labels.about, href: '/#about' },
    { label: labels.blog, href: '/blog' },
    { label: labels.contact, href: '/#contact' },
  ];


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-4'
        }`}
    >
      <div className="container-premium flex justify-between items-center">
        <PillNav
          logo="/agroventia-logo%201.svg"
          logoAlt="AgroVentia Inc. Logo"
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
        {/* Language selector only visible on desktop (hidden on mobile and tablet) */}
        <div className="ml-4 hidden lg:block">
          <LanguageSelector className="w-[180px]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
