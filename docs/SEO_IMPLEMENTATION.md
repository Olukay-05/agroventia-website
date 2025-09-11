# SEO Implementation Documentation

This document outlines the comprehensive SEO implementation for the AgroVentia Inc. website, covering all aspects from meta tags to conversion tracking.

## Table of Contents

1. [Meta & Head Tags](#meta--head-tags)
2. [Structured Data (Schema.org)](#structured-data-schemaorg)
3. [Performance & Technical SEO](#performance--technical-seo)
4. [Content SEO](#content-seo)
5. [Analytics & Conversion Tracking](#analytics--conversion-tracking)
6. [Social Media Integration](#social-media-integration)
7. [TypeScript Implementation Details](#typescript-implementation-details)
8. [Implementation Files](#implementation-files)

## Meta & Head Tags

### Dynamic Meta Tags

- Implemented dynamic `<title>`, `<meta name="description">`, and `<meta name="keywords">` tags for each page
- Added Open Graph (OG) tags for social sharing optimization
- Added Twitter Card tags for Twitter sharing
- Implemented canonical URLs to prevent duplicate content issues
- Added hreflang tags for multilingual support

### Implementation

The SEO implementation uses a centralized `SeoHead` component that can be imported and used across all pages:

```tsx
import SeoHead from '@/components/common/SeoHead';

// In your page component
<SeoHead
  title="AgroVentia Inc. - Premium Agricultural Imports from West Africa"
  description="Connecting global markets with quality agricultural products including kolanut, ginger, hibiscus, cocoa, and more from trusted West African sources."
  keywords="agricultural exports, African produce sourcing, premium agro products, kolanut, ginger, hibiscus, cocoa, West Africa, agricultural imports, ethically sourced"
/>;
```

## Structured Data (Schema.org)

### Organization Schema

JSON-LD structured data for the organization is automatically included on all pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AgroVentia Inc.",
  "url": "https://agroventia.ca",
  "logo": "https://agroventia.ca/agroventia-logo.jpg",
  "sameAs": [
    "https://www.linkedin.com/company/agroventia-inc/"
    // Twitter and Facebook links removed to match footer implementation
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "403 - 65 Mutual Street",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "postalCode": "M5B 0E5",
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-403-477-6059",
    "contactType": "Customer Service",
    "email": "info@agroventia.ca",
    "availableLanguage": ["English", "French"]
  }
}
```

### Product Schema

Product schema markup is dynamically generated for product pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://agroventia.ca/product-image.jpg",
  "category": "Product Category",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock"
  }
}
```

## Performance & Technical SEO

### Image Optimization

- All images use `next/image` component with proper alt text
- Responsive images with appropriate sizing
- Lazy loading for improved performance

### Sitemap & Robots.txt

Dynamically generated sitemap and robots.txt files:

- `/sitemap.xml` - Lists all important pages and products
- `/robots.txt` - Provides instructions for search engine crawlers

### Core Web Vitals

- Optimized loading states with skeleton screens
- Efficient component rendering
- Proper image loading strategies

## Content SEO

### Heading Hierarchy

Improved semantic heading structure across all sections:

- H1: Page titles
- H2: Section titles
- H3: Subsection titles
- Proper keyword usage in headings

### Content Optimization

- Unique, compelling meta descriptions for each page
- Keyword-rich content with natural language
- Proper internal linking structure

## Analytics & Conversion Tracking

### Google Analytics Integration

Full Google Analytics 4 integration with cookie consent handling:

- Page view tracking
- Event tracking for user interactions
- Consent management based on cookie preferences

### Conversion Tracking

Implemented tracking for key business actions:

1. **Form Submissions**
   - Contact form submissions
   - Quote request forms

2. **Product Interactions**
   - Product quote requests
   - Product card clicks

3. **Newsletter Signups**
   - Email subscription tracking

4. **Button Clicks**
   - CTA button tracking
   - Navigation element tracking

### Tracking Functions

Utility functions for consistent tracking implementation:

```typescript
// Track form submissions
trackFormSubmit('contact_form', { enquiry_type: 'quote' });

// Track product quote requests
trackProductQuoteRequest('Kolanut', 'product-123');

// Track newsletter signups
trackNewsletterSignup('user@example.com');

// Track button clicks
trackButtonClick('hero_cta_explore_products');
```

## Social Media Integration

### Social Media Handles

The SEO implementation uses verified social media handles that match those in the website footer:

```typescript
export const SOCIAL_HANDLES = {
  linkedin: 'agroventia-inc',
  // Twitter and Facebook were removed as they're not used in the footer
  // WhatsApp is a communication platform, not typically included in SEO metadata
};
```

### Organization Schema

The structured data for the organization includes only the social media platforms that are actively used:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AgroVentia Inc.",
  "url": "https://agroventia.ca",
  "logo": "https://agroventia.ca/agroventia-logo.jpg",
  "sameAs": [
    "https://www.linkedin.com/company/agroventia-inc/"
    // Twitter and Facebook links removed to match footer implementation
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "403 - 65 Mutual Street",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "postalCode": "M5B 0E5",
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-403-477-6059",
    "contactType": "Customer Service",
    "email": "info@agroventia.ca",
    "availableLanguage": ["English", "French"]
  }
}
```

### Twitter Card Metadata

Although Twitter is not actively used in the footer, Twitter Card metadata is still included for compatibility with social sharing:

```typescript
// Default Twitter handle for metadata purposes
twitterSite = '@agroventia';
twitterCreator = '@agroventia';
```

## TypeScript Implementation Details

### OpenGraph Type Safety

To ensure proper type safety and adherence to the Open Graph protocol, the SEO implementation includes strict typing for OpenGraph properties. The [SeoMetadata](file://c:\Users\user\Desktop\work\Projects\Clients\AgroVentia%20Inc\AVI-inc\agroventia-homepage\src\lib\seo.ts#L70-L82) interface in [src/lib/seo.ts](file://c:\Users\user\Desktop\work\Projects\Clients\AgroVentia%20Inc\AVI-inc\agroventia-homepage\src\lib\seo.ts) defines specific string literal types for the `ogType` property, limiting it to only those values that are relevant to AgroVentia's business:

```typescript
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
  // ... other properties
}
```

This approach:

1. Prevents invalid OpenGraph type values that could cause social media sharing issues
2. Restricts the options to only those relevant to AgroVentia's agricultural business
3. Provides better IDE autocompletion and error detection
4. Ensures compliance with the Open Graph protocol

### Twitter Card Type Safety

Similarly, Twitter card types are strictly typed to ensure proper social media card generation:

```typescript
twitterCard?: 'summary_large_image' | 'summary' | 'player' | 'app';
```

## Implementation Files

### Core SEO Files

- `src/lib/seo.ts` - SEO utility functions and constants
- `src/components/common/SeoHead.tsx` - SEO head component
- `src/app/sitemap.xml/route.ts` - Dynamic sitemap generation
- `src/app/robots.txt/route.ts` - Dynamic robots.txt generation

### Analytics Files

- `src/lib/analytics.ts` - Analytics utility functions
- `src/components/common/GoogleAnalyticsScript.tsx` - Google Analytics integration

### Updated Components

- `src/app/page.tsx` - Main page with SEO implementation
- `src/app/products/page.tsx` - Products page with SEO
- `src/components/sections/HeroSection.tsx` - Hero section with tracking
- `src/components/sections/AboutSection.tsx` - About section with improved headings
- `src/components/sections/ServicesSection.tsx` - Services section with improved headings
- `src/components/sections/ProductsSection.tsx` - Products section with tracking
- `src/components/sections/ContactSection.tsx` - Contact section with tracking
- `src/components/sections/Footer.tsx` - Footer with improved headings
- `src/components/sections/FooterNewsletter.tsx` - Newsletter with tracking

## Environment Variables

Required environment variables for SEO and analytics:

```env
NEXT_PUBLIC_SITE_URL=https://agroventia.ca
NEXT_PUBLIC_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_EMAILJS_SERVICE_ID=EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=EMAILJS_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=EMAILJS_PUBLIC_KEY
```

## Testing

### SEO Testing

1. Validate meta tags with browser developer tools
2. Test Open Graph tags with social sharing preview tools
3. Validate structured data with Google's Rich Results Test
4. Check sitemap.xml and robots.txt accessibility
5. Verify hreflang tags implementation

### Analytics Testing

1. Verify Google Analytics page view tracking
2. Test event tracking for key user actions
3. Validate consent management functionality
4. Check conversion tracking for business metrics

## Best Practices Implemented

1. **Mobile-First Indexing**
   - Responsive design for all SEO elements
   - Mobile-friendly meta descriptions

2. **International SEO**
   - hreflang tags for multilingual support
   - Proper canonicalization

3. **Accessibility**
   - Semantic HTML structure
   - Proper alt text for images
   - ARIA attributes where needed

4. **Performance**
   - Optimized loading states
   - Efficient component rendering
   - Image optimization

This comprehensive SEO implementation ensures that the AgroVentia Inc. website is well-optimized for search engines while providing excellent user experience and robust analytics tracking.
