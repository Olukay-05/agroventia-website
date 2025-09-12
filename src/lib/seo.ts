// src/lib/seo.ts
import { Metadata } from 'next';
import { ProductContent } from '@/types/wix';

// SEO constants
export const DEFAULT_SITE_NAME = 'AgroVentia Inc.';
export const DEFAULT_TITLE =
  'AgroVentia Inc. - Premium Agricultural Produce from Africa';
export const DEFAULT_DESCRIPTION =
  'Connecting global markets with quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources.';
export const DEFAULT_KEYWORDS =
  'agricultural exports, African produce sourcing, premium agro products, kolanut, ginger, hibiscus, cocoa, West Africa, agricultural imports, ethically sourced';
export const DEFAULT_AUTHOR = 'AgroVentia Inc.';
export const DEFAULT_CREATOR = 'AgroVentia Inc.';

// Base URL - should be set in environment variables
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://agroventia.ca';

// Social media handles
export const SOCIAL_HANDLES = {
  linkedin: 'agroventia-inc',
  // Added WhatsApp information
};

// Organization structured data
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AgroVentia Inc.',
  url: BASE_URL,
  logo: `${BASE_URL}/agroventia-logo.jpg`,
  sameAs: [
    `https://www.linkedin.com/company/${SOCIAL_HANDLES.linkedin}`,
    // Note: WhatsApp is a communication platform, not typically included in sameAs
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '403 - 65 Mutual Street',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    postalCode: 'M5B 0E5',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-403-477-6059',
    contactType: 'Customer Service',
    email: 'info@agroventia.ca',
    availableLanguage: ['English', 'French'],
  },
};

// Product structured data template
export const PRODUCT_SCHEMA_TEMPLATE = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '',
  description: '',
  image: '',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    availability: 'https://schema.org/InStock',
  },
};

// SEO metadata generator
export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?:
    | 'website' // For main pages, product categories, general information
    | 'article' // For blog posts, news, educational content about agricultural products
    | 'profile'; // For team members, partner profiles
  ogUrl?: string;
  twitterCard?: 'summary_large_image' | 'summary' | 'player' | 'app';
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
}

// Generate metadata for Next.js pages
export function generateMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterSite = '@agroventia', // Use direct value instead of referencing removed SOCIAL_HANDLES.twitter
  twitterCreator = '@agroventia', // Use direct value instead of referencing removed SOCIAL_HANDLES.twitter
  robots = 'index, follow',
}: SeoMetadata): Metadata {
  const fullTitle = title;
  const fullDescription = description;
  const fullCanonical = canonical || BASE_URL;
  const fullOgUrl = ogUrl || fullCanonical;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.split(',').map(k => k.trim()),
    authors: [{ name: DEFAULT_AUTHOR }],
    creator: DEFAULT_CREATOR,
    publisher: DEFAULT_SITE_NAME,
    alternates: {
      canonical: fullCanonical,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullOgUrl,
      siteName: DEFAULT_SITE_NAME,
      images: ogImage ? [{ url: ogImage }] : [],
      type: ogType,
      locale: 'en_CA',
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description: fullDescription,
      site: twitterSite,
      creator: twitterCreator,
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: !robots.includes('noindex'),
      follow: !robots.includes('nofollow'),
    },
  };
}

// Generate product schema markup
export function generateProductSchema(
  product: ProductContent,
  baseUrl: string = BASE_URL
) {
  return {
    ...PRODUCT_SCHEMA_TEMPLATE,
    name: product.title,
    description: product.description,
    image: product.image1
      ? `${baseUrl}${product.image1}`
      : `${baseUrl}/agroventia-logo.jpg`,
    category: product.category,
  };
}

// Generate hreflang tags for multilingual support
export function generateHreflangLinks(
  pathname: string,
  currentLocale?: string
) {
  const locales: { [key: string]: string } = {
    en: 'en-CA',
    'fr-CA': 'fr-CA',
  };

  const links: { rel: string; hrefLang: string; href: string }[] = [];

  // Generate hreflang links for all supported locales
  Object.entries(locales).forEach(([locale, hreflang]) => {
    const url =
      locale === 'en'
        ? `${BASE_URL}${pathname}`
        : `${BASE_URL}/${locale}${pathname}`;

    links.push({
      rel: 'alternate',
      hrefLang: hreflang,
      href: url,
    });
  });

  // Add x-default pointing to the default language version
  links.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: `${BASE_URL}${pathname}`,
  });

  return links;
}

// Generate sitemap entry
export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

export function generateSitemapEntry(
  path: string,
  lastmod?: string,
  changefreq: SitemapEntry['changefreq'] = 'weekly',
  priority: number = 0.8
): SitemapEntry {
  return {
    loc: `${BASE_URL}${path}`,
    lastmod: lastmod || new Date().toISOString(),
    changefreq,
    priority,
  };
}
