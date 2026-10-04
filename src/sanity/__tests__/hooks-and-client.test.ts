import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext';
import {
  normalizeLocale,
  extractLocalizedText,
  resolveSanityImageUrl,
  HERO_QUERY,
  ABOUT_QUERY,
  SERVICES_QUERY,
  PRODUCTS_QUERY,
  CONTACT_QUERY,
  CORE_VALUES_QUERY,
  CAROUSEL_IMAGES_QUERY,
  transformHeroContent,
  transformAboutContent,
  transformServiceContent,
  transformProductContent,
  transformContactContent,
  transformCoreValue,
  transformCoreValuesContent,
  transformCarouselSlide,
  getHeroContent,
  getAboutContent,
  getServicesContent,
  getProductsContent,
  getProductCatalogContent,
  getContactContent,
  getCoreValues,
  getCarouselImages,
} from '@/lib/api/sanity-client';
import {
  useHeroContent,
  useAboutContent,
  useServicesContent,
  useProductsContent,
  useProductCatalogContent,
  useContactContent,
  useCoreValues,
  useCarouselImages,
} from '@/hooks/useContent';
import * as useWixContentModule from '@/hooks/useWixContent';
import { client } from '@/sanity/client';

// Mock Sanity client for controlled unit testing
jest.mock('@/sanity/client', () => ({
  client: {
    fetch: jest.fn(),
  },
  urlFor: jest.fn(() => ({
    url: () => 'https://cdn.sanity.io/images/mock/test/image.jpg',
  })),
}));

const mockClientFetch = client.fetch as jest.Mock;

describe('Story 3: Sanity Client and React Query Hooks Adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC 1: GROQ query localization & fallback', () => {
    it('normalizes browser and country locales to Sanity schema keys (en, fr, esp)', () => {
      expect(normalizeLocale('en')).toBe('en');
      expect(normalizeLocale('en-US')).toBe('en');
      expect(normalizeLocale('fr')).toBe('fr');
      expect(normalizeLocale('fr-CA')).toBe('fr');
      expect(normalizeLocale('esp')).toBe('esp');
      expect(normalizeLocale('es')).toBe('esp');
      expect(normalizeLocale('es-ES')).toBe('esp');
      expect(normalizeLocale(undefined)).toBe('en');
    });

    it('extracts localized text with fallback to en if requested language is missing', () => {
      const field = {
        en: 'English Title',
        fr: 'Titre Français',
      };

      expect(extractLocalizedText(field, 'en')).toBe('English Title');
      expect(extractLocalizedText(field, 'fr')).toBe('Titre Français');
      expect(extractLocalizedText(field, 'esp')).toBe('English Title');
      expect(extractLocalizedText('Direct String', 'fr')).toBe('Direct String');
      expect(extractLocalizedText(null, 'fr')).toBe('');
    });

    it('ensures GROQ queries include coalesce with dynamic locale and en fallback', () => {
      expect(HERO_QUERY).toContain('coalesce(title[$locale], title.en, "")');
      expect(HERO_QUERY).toContain('coalesce(subtitle[$locale], subtitle.en, "")');
      expect(ABOUT_QUERY).toContain('coalesce(sectionTitle[$locale], sectionTitle.en, "")');
      expect(SERVICES_QUERY).toContain('coalesce(sectionTitle[$locale], sectionTitle.en, "")');
      expect(PRODUCTS_QUERY).toContain('coalesce(productName[$locale], productName.en, "")');
      expect(CONTACT_QUERY).toContain('coalesce(sectionTitle[$locale], sectionTitle.en, "")');
      expect(CORE_VALUES_QUERY).toContain('coalesce(title[$locale], title.en, "")');
      expect(CAROUSEL_IMAGES_QUERY).toContain('coalesce(title[$locale], title.en, "")');
    });

    it('passes $locale parameter when querying Sanity client', async () => {
      mockClientFetch.mockResolvedValueOnce({
        _id: 'heroSection',
        title: 'Titre Français',
        subtitle: 'Sous-titre',
        companyLogo: 'https://cdn.sanity.io/logo.png',
        backgroundImage: 'https://cdn.sanity.io/bg.png',
      });

      const result = await getHeroContent('fr-CA');
      expect(client.fetch).toHaveBeenCalledWith(HERO_QUERY, { locale: 'fr' });
      expect(result[0].title).toBe('Titre Français');
    });
  });

  describe('AC 2: TypeScript model parity & transformers', () => {
    it('transforms raw hero payload into strict HeroContent interface', () => {
      const raw = {
        _id: 'hero-1',
        _createdAt: '2026-10-04T12:00:00Z',
        _updatedAt: '2026-10-04T12:00:00Z',
        isActive: true,
        title: 'Hero Title',
        subtitle: 'Hero Subtitle',
        description: 'Hero Description',
        ctaPrimary: 'Explore',
        ctaSecondary: 'Contact',
        companyLogo: 'https://cdn.sanity.io/logo.png',
        backgroundImage: 'https://cdn.sanity.io/bg.png',
        overlayOpacity: 40,
      };

      const transformed = transformHeroContent(raw, 'en');

      expect(transformed._id).toBe('hero-1');
      expect(transformed._owner).toBe('sanity');
      expect(transformed._createdDate.$date).toBe('2026-10-04T12:00:00Z');
      expect(transformed._updatedDate.$date).toBe('2026-10-04T12:00:00Z');
      expect(transformed.isActive).toBe(true);
      expect(transformed.title).toBe('Hero Title');
      expect(transformed.subtitle).toBe('Hero Subtitle');
      expect(transformed.description).toBe('Hero Description');
      expect(transformed.backgroundImage).toBe('https://cdn.sanity.io/bg.png');
      expect(transformed.companyLogo).toBe('https://cdn.sanity.io/logo.png');
      expect(transformed.ctaPrimary).toBe('Explore');
      expect(transformed.ctaSecondary).toBe('Contact');
      expect(transformed.overlayOpacity).toBe(40);
    });

    it('transforms raw about payload with nested coreValues into AboutContent interface', () => {
      const raw = {
        _id: 'about-1',
        sectionTitle: 'About AgroVentia',
        mission: 'Our Mission',
        vision: 'Our Vision',
        story: 'Our Story',
        headquarters: 'Ontario, CA',
        foundingYear: '2025',
        certifications: 'ISO 14001',
        aboutImage: 'https://cdn.sanity.io/about.jpg',
        coreValues: [
          {
            _id: 'cv-1',
            reference: 'quality',
            title: 'Quality First',
            description: 'Top standards',
          },
        ],
      };

      const transformed = transformAboutContent(raw, 'en');

      expect(transformed._id).toBe('about-1');
      expect(transformed.sectionTitle).toBe('About AgroVentia');
      expect(transformed.mission).toBe('Our Mission');
      expect(transformed.coreValues).toHaveLength(1);
      expect(transformed.coreValues[0].title).toBe('Quality First');
      expect(transformed.coreValues[0].reference).toBe('quality');
    });

    it('transforms raw services payload into ServiceContent interface', () => {
      const raw = {
        _id: 'services-1',
        sectionTitle: 'Our Process',
        sectionDescription: 'Process overview',
        importServices: 'Import detail',
        customSourcing: 'Sourcing detail',
        qualityAssurance: 'QA detail',
        logistics: 'Logistics detail',
        documentation: 'Docs detail',
        servicesImage: 'https://cdn.sanity.io/services.jpg',
      };

      const transformed = transformServiceContent(raw, 'en');

      expect(transformed.sectionTitle).toBe('Our Process');
      expect(transformed.importServices).toBe('Import detail');
      expect(transformed.servicesImage).toBe('https://cdn.sanity.io/services.jpg');
    });

    it('transforms raw product payload into ProductContent and ProductCatalogItem interface', () => {
      const raw = {
        _id: 'prod-1',
        productName: 'Dried Kolanut',
        productDescription: 'Premium dried kolanut',
        productImage: 'https://cdn.sanity.io/kola.jpg',
        images: ['https://cdn.sanity.io/kola-gallery.jpg'],
        price: 50,
        sku: 'AGV-KOLA',
        inStock: true,
        sortOrder: 1,
        qualityStandards: 'Grade A',
        category: 'Beverages',
      };

      const transformed = transformProductContent(raw, 'en');

      expect(transformed._id).toBe('prod-1');
      expect(transformed.title).toBe('Dried Kolanut');
      expect(transformed.productName).toBe('Dried Kolanut');
      expect(transformed.description).toBe('Premium dried kolanut');
      expect(transformed.category).toBe('Beverages');
      expect(transformed.image1).toBe('https://cdn.sanity.io/kola.jpg');
      expect(transformed.sku).toBe('AGV-KOLA');
      expect(transformed.inStock).toBe(true);
      expect(transformed.qualityStandards).toBe('Grade A');
    });

    it('transforms raw contact payload into ContactContent interface', () => {
      const raw = {
        _id: 'contact-1',
        sectionTitle: 'Contact Us',
        sectionDescription: 'Reach our team',
        businessEmail: 'info@agroventia.ca',
        businessPhone: '+1 (403) 477-6059',
        businessAddress: 'Ontario, CA',
        businessHours: '8am - 6pm',
        responseTime: 'Within 24 hours',
        socialLinks: 'https://linkedin.com',
        contactImage: 'https://cdn.sanity.io/contact.jpg',
      };

      const transformed = transformContactContent(raw, 'en');

      expect(transformed.sectionTitle).toBe('Contact Us');
      expect(transformed.businessEmail).toBe('info@agroventia.ca');
      expect(transformed.responseTime).toBe('Within 24 hours');
      expect(transformed.contactImage).toBe('https://cdn.sanity.io/contact.jpg');
    });

    it('transforms coreValue and carouselSlide collection items', () => {
      const rawValue = {
        _id: 'cv-1',
        title: 'Integrity',
        description: 'High ethics',
        reference: 'about',
        sortOrder: 2,
      };
      const cvTransformed = transformCoreValuesContent(rawValue, 'en');
      expect(cvTransformed.title).toBe('Integrity');
      expect(cvTransformed.sortOrder).toBe(2);

      const rawSlide = {
        _id: 'slide-1',
        title: 'Slide Title',
        tagline: 'Slide Tagline',
        description: 'Slide Description',
        image: 'https://cdn.sanity.io/slide.jpg',
        displayOrder: 1,
      };
      const slideTransformed = transformCarouselSlide(rawSlide, 'en');
      expect(slideTransformed.image).toBe('https://cdn.sanity.io/slide.jpg');
      expect(slideTransformed.tagline).toBe('Slide Tagline');
      expect(slideTransformed.displayOrder).toBe(1);
    });
  });

  describe('AC 3 & AC 4: React Query hook compatibility & multi-language switching', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
    });

    const createWrapper = (initialLocale: 'en' | 'fr-CA' = 'en') => {
      return ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(LocaleProvider, { initialLocale, children })
        );
    };

    it('queries Sanity with [queryName, locale] query key and returns data', async () => {
      mockClientFetch.mockResolvedValueOnce({
        _id: 'heroSection',
        title: 'Hero Live Title',
        subtitle: 'Hero Live Subtitle',
      });

      const { result } = renderHook(() => useHeroContent(), {
        wrapper: createWrapper('en'),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.[0].title).toBe('Hero Live Title');
      const queryState = queryClient.getQueryState(['heroContent', 'en']);
      expect(queryState).toBeDefined();
      expect(queryState?.status).toBe('success');
    });

    it('supports all required hook signatures from useContent and useWixContent alias', async () => {
      const hooks = [
        'useHeroContent',
        'useAboutContent',
        'useServicesContent',
        'useProductsContent',
        'useProductCatalogContent',
        'useContactContent',
        'useCoreValues',
        'useCarouselImages',
      ];

      hooks.forEach(hookName => {
        expect(typeof (useWixContentModule as any)[hookName]).toBe('function');
      });
    });

    it('reacts to language changes and updates content across English, French, and Spanish', async () => {
      mockClientFetch.mockImplementation((query: string, params: any) => {
        if (params?.locale === 'esp') {
          return Promise.resolve({
            _id: 'heroSection',
            title: 'Título en Español',
            subtitle: 'Subtítulo',
          });
        }
        return Promise.resolve({
          _id: 'heroSection',
          title: 'English Title',
          subtitle: 'Subtitle',
        });
      });

      const { result } = renderHook(
        () => {
          const localeCtx = useLocale();
          const heroQuery = useHeroContent();
          return { localeCtx, heroQuery };
        },
        { wrapper: createWrapper('en') }
      );

      await waitFor(() => expect(result.current.heroQuery.isSuccess).toBe(true));
      expect(result.current.heroQuery.data?.[0].title).toBe('English Title');

      act(() => {
        result.current.localeCtx.setLocale('esp' as any);
      });

      await waitFor(() =>
        expect(result.current.heroQuery.data?.[0].title).toBe('Título en Español')
      );
    });
  });

  describe('Offline Fallback (CAP-5 compliance)', () => {
    it('gracefully falls back to localized mock data when Sanity fetch fails', async () => {
      mockClientFetch.mockRejectedValue(new Error('Network error or offline'));

      // Test English fallback
      const heroEn = await getHeroContent('en');
      expect(heroEn[0].title).toBe('Premium Agricultural Imports from West Africa');

      // Test French fallback
      const heroFr = await getHeroContent('fr');
      expect(heroFr[0].title).toContain('Afrique de l\'Ouest');

      // Test Spanish fallback
      const heroEsp = await getHeroContent('esp');
      expect(heroEsp[0].title).toContain('Simplificando el abastecimiento global');

      // Test Contact fallback
      const contactEsp = await getContactContent('esp');
      expect(contactEsp[0].sectionTitle).toBe('Contáctenos');

      // Test Products fallback
      const productsEsp = await getProductsContent('esp');
      expect(productsEsp[0].title).toBe('Nuez de Cola Seca');
    });
  });
});
