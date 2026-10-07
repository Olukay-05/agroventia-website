'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import FooterSocialLinks from './FooterSocialLinks';
import FooterLinkSection, { FooterLinkItem } from './FooterLinkSection';
import Image from 'next/image';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import {
  useContactContent,
  useProductCatalogContent,
  useCoreValues,
} from '@/hooks/useContent';
import { useLocale } from '@/contexts/LocaleContext';
import { getFooterUiLabels } from '@/lib/footer-i18n';
import { normalizeCategorySlug } from '@/lib/product-filters';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const { locale } = useLocale();
  const uiLabels = getFooterUiLabels(locale);

  const { data: contactList } = useContactContent();
  const { data: productCatalog } = useProductCatalogContent();
  const { data: coreValuesList } = useCoreValues();

  const contactData = contactList?.[0] || null;
  const router = useRouter();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      router.push(href);
      return;
    }
    if (href.startsWith('/')) {
      router.push(href);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/${href}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationLinks: FooterLinkItem[] = [
    { label: uiLabels.nav.home, href: '/' },
    { label: uiLabels.nav.products, href: '/products' },
    { label: uiLabels.nav.about, href: '/#about' },
    { label: uiLabels.nav.blog, href: '/blog' },
    { label: uiLabels.nav.contact, href: '/#contact' },
  ];

  const productCategories: FooterLinkItem[] = useMemo(() => {
    const categoryHref = (slug: string) =>
      `/products?category=${encodeURIComponent(slug)}&lang=${encodeURIComponent(locale)}`;

    // Canonical categories guarantee 5 items are always displayed and localized
    const canonicalList: FooterLinkItem[] = uiLabels.categories.map(c => ({
      label: c.label,
      slug: c.slug,
      href: categoryHref(c.slug),
    }));

    if (productCatalog && productCatalog.length > 0) {
      const existingSlugs = new Set(canonicalList.map(c => c.slug));
      productCatalog.forEach(product => {
        if (product.category) {
          const slug = normalizeCategorySlug(product.category);
          if (slug && !existingSlugs.has(slug)) {
            existingSlugs.add(slug);
            canonicalList.push({
              label: product.category,
              slug,
              href: categoryHref(slug),
            });
          }
        }
      });
    }

    return canonicalList;
  }, [uiLabels, productCatalog, locale]);

  const handleProductClick = (
    link: string | FooterLinkItem
  ) => {
    const slug = typeof link === 'object' && link.slug
      ? link.slug
      : normalizeCategorySlug(typeof link === 'string' ? link : link.label);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProductCategory', slug);
    }

    // Always use a deterministic catalog URL so the same category works from every route.
    router.push(
      `/products?category=${encodeURIComponent(slug)}&lang=${encodeURIComponent(locale)}`
    );
  };

  return (
    <footer className="relative overflow-hidden bg-[#281909]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#225217]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-premium" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#CD7E0D]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-premium" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#225217]/3 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="container-premium py-16 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/agroventia-logo%201.svg"
                  alt="AgroVentia Inc. Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FDF8F0]">
                  AgroVentia Inc.
                </h3>
                <p className="text-sm text-[#F6F2E7] font-medium">
                  {contactData?.companyTagline || uiLabels.companyTagline}
                </p>
              </div>
            </div>

            <p className="text-[#F6F2E7] leading-relaxed">
              {contactData?.companyBio || uiLabels.companyBio}
            </p>

            <div className="space-y-4">
              {contactData?.businessAddress && (
                <div className="flex items-start space-x-3 text-sm text-[#F6F2E7] group hover:text-[#FDF8F0] transition-colors duration-200">
                  <MapPin
                    size={16}
                    className="text-[#FDF8F0] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>{contactData.businessAddress}</span>
                </div>
              )}
              {contactData?.businessPhone && (
                <div className="flex items-center space-x-3 text-sm text-[#F6F2E7] group hover:text-[#FDF8F0] transition-colors duration-200">
                  <Phone
                    size={16}
                    className="text-[#FDF8F0] flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>{contactData.businessPhone}</span>
                </div>
              )}
              {contactData?.businessEmail && (
                <div className="flex items-center space-x-3 text-sm text-[#F6F2E7] group hover:text-[#FDF8F0] transition-colors duration-200">
                  <Mail
                    size={16}
                    className="text-[#FDF8F0] flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>{contactData.businessEmail}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <p className="text-sm text-[#F6F2E7] mb-3">
                {contactData?.followUsTitle || uiLabels.followUsTitle}
              </p>
              <FooterSocialLinks phoneNumber={contactData?.businessPhone || undefined} />
            </div>
          </div>

          {/* Quick Links */}
          <FooterLinkSection
            title={contactData?.quickLinksTitle || uiLabels.quickLinksTitle}
            links={navigationLinks}
            onLinkClick={link => {
              if (typeof link === 'object' && link.href) {
                handleNavClick(link.href);
              }
            }}
          />

          {/* Core Values */}
          {coreValuesList && coreValuesList.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#FDF8F0]">
                {contactData?.coreValuesTitle || uiLabels.coreValuesTitle}
              </h3>
              <ul className="space-y-2">
                {coreValuesList.map(cv => (
                  <li
                    key={cv._id}
                    className="flex items-center space-x-2 text-sm text-[#F6F2E7]"
                  >
                    <span>{cv.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Commodity Categories */}
          <FooterLinkSection
            title={contactData?.productCategoriesTitle || uiLabels.productCategoriesTitle}
            links={productCategories}
            onLinkClick={handleProductClick}
          />
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-[#F6F2E7]/50 to-transparent" />

      {/* Bottom Footer */}
      <div className="container-premium py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-[#F6F2E7]">
            <p>&copy; {currentYear} {contactData?.copyrightNotice || uiLabels.copyrightNotice}</p>
            <div className="flex gap-6">
              {contactData?.legalLinks && contactData.legalLinks.length > 0 ? (
                contactData.legalLinks.map((link, idx) => (
                  <Link
                    key={link._key || idx}
                    href={link.url}
                    className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    {uiLabels.legal.privacy}
                  </Link>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    {uiLabels.legal.terms}
                  </Link>
                  <Link
                    href="/cookie-policy"
                    className="hover:text-[#FDF8F0] transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    {uiLabels.legal.cookies}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Language Selector and Back to Top */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LanguageSelector className="w-[160px] sm:w-[180px]" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="
                bg-[#FDF8F0] backdrop-blur-sm
                border-2 border-[#281909] text-[#281909]
                hover:bg-[#225217] hover:text-[#FDF8F0]
                hover:border-[#225217] hover:scale-105
                transition-all duration-300 ease-out
                group
              "
            >
              <ArrowUp
                size={16}
                className="text-[#281909] group-hover:text-[#FDF8F0] transition-colors duration-200 mr-1"
              />
              {contactData?.backToTopText || uiLabels.backToTopText}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
