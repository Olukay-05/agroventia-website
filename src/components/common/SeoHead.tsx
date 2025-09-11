// src/components/common/SeoHead.tsx
'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import {
  BASE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  generateHreflangLinks,
  ORGANIZATION_SCHEMA,
} from '@/lib/seo';
import { ProductContent } from '@/types/wix';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  product?: ProductContent;
  noIndex?: boolean;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image,
  type = 'website',
  product,
  noIndex = false,
}) => {
  const pathname = usePathname();
  const { locale } = useLocale();

  // Generate hreflang links based on current locale
  const hreflangLinks = generateHreflangLinks(pathname, locale);

  // Update Google Analytics consent based on cookie preferences
  useEffect(() => {
    // This would be implemented in conjunction with the cookie consent system
    // For now, we'll just log that we're tracking a page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_path: pathname,
        page_title: title,
      });
    }
  }, [pathname, title]);

  return (
    <Head>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Author and generator */}
      <meta name="author" content="AgroVentia Inc." />
      <meta name="generator" content="Next.js" />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={`${BASE_URL}${pathname}`} />

      {/* Hreflang tags for multilingual support */}
      {hreflangLinks.map((link, index) => (
        <link
          key={index}
          rel={link.rel}
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`${BASE_URL}${pathname}`} />
      <meta property="og:site_name" content="AgroVentia Inc." />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:site" content="@agroventia" />
      <meta name="twitter:creator" content="@agroventia" />

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_SCHEMA),
        }}
      />

      {/* Structured Data - Product (if provided) */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              description: product.description,
              image: product.image1
                ? `${BASE_URL}${product.image1}`
                : `${BASE_URL}/agroventia-logo.jpg`,
              category: product.category,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'CAD',
                availability: 'https://schema.org/InStock',
              },
            }),
          }}
        />
      )}

      {/* Favicon and icons */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
    </Head>
  );
};

export default SeoHead;
