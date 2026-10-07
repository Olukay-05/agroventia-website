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
  getBlogPosts,
  getBlogPostBySlug,
} from '@/lib/api/sanity-client';
import {
  shouldUseMockData,
  getMockHeroContent,
  getMockAboutContent,
  getMockServicesContent,
  getMockProductsContent,
  getMockProductCatalogContent,
  getMockContactContent,
  getMockCoreValues,
  getMockCarouselImages,
  getMockBlogPosts,
  getMockBlogPostBySlug,
} from '@/lib/api/mock-data';
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
import * as useContentModule from '@/hooks/useContent';
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
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-sanity-project';
    delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
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
      expect(transformed._createdDate).toBeDefined();
      expect(transformed._updatedDate).toBeDefined();
      expect((transformed._createdDate as { $date: string })?.$date).toBe('2026-10-04T12:00:00Z');
      expect((transformed._updatedDate as { $date: string })?.$date).toBe('2026-10-04T12:00:00Z');
      expect(transformed.isActive).toBe(true);
      expect(transformed.title).toBe('Hero Title');
      expect(transformed.subtitle).toBe('Hero Subtitle');
      expect(transformed.description).toBe('Hero Description');
      expect(transformed.backgroundImage).toBe('https://cdn.sanity.io/bg.png');
      expect(transformed.companyLogo).toBe('https://cdn.sanity.io/logo.png');
      expect(transformed.ctaPrimary).toBe('Explore');
      expect(transformed.ctaSecondary).toBe('Contact');
      expect(transformed.overlayOpacity).toBe(40);
      expect(transformed.displayMode).toBe('carousel');

      const staticHero = transformHeroContent({ ...raw, displayMode: 'static' }, 'en');
      expect(staticHero.displayMode).toBe('static');
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

    it('supports all required hook signatures from canonical useContent module', async () => {
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
        expect(typeof (useContentModule as any)[hookName]).toBe('function');
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

  describe('Story 5: Offline Fallback & Credential-less Operation (CAP-5 compliance)', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      mockClientFetch.mockRejectedValue(new Error('Network error or offline'));
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('evaluates shouldUseMockData correctly in various credential configurations', () => {
      // Missing project ID
      delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
      expect(shouldUseMockData()).toBe(true);

      // Empty project ID
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '';
      expect(shouldUseMockData()).toBe(true);

      // Placeholder project ID
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'your_sanity_project_id_here';
      expect(shouldUseMockData()).toBe(true);

      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'agrov-production';
      expect(shouldUseMockData()).toBe(true);

      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'undefined';
      expect(shouldUseMockData()).toBe(true);

      // Valid project ID with explicit mock flag
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'validproj123';
      process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
      expect(shouldUseMockData()).toBe(true);

      // Valid project ID with live mode
      delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
      expect(shouldUseMockData()).toBe(false);
    });

    it('provides complete mock fallback across all 8 collections and blog in English', async () => {
      const hero = await getMockHeroContent('en');
      expect(hero[0].title).toBe('Premium Agricultural Imports from West Africa');
      expect(hero[0].ctaPrimary).toBe('Explore Products');

      const about = await getMockAboutContent('en');
      expect(about[0].sectionTitle).toBe('About AgroVentia Inc.');
      expect(about[0].coreValues.length).toBeGreaterThanOrEqual(4);

      const services = await getMockServicesContent('en');
      expect(services[0].sectionTitle).toBe('Our Services');

      const products = await getMockProductsContent('en');
      expect(products.length).toBeGreaterThanOrEqual(2);
      expect(products[0].title).toBe('Dried Kolanut');

      const catalog = await getMockProductCatalogContent('en');
      expect(catalog.length).toBeGreaterThanOrEqual(2);
      expect(catalog[0].inStock).toBe(true);

      const contact = await getMockContactContent('en');
      expect(contact[0].sectionTitle).toBe('Get In Touch');
      expect(contact[0].businessEmail).toBe('info@agroventia.ca');

      const coreValues = await getMockCoreValues('en');
      expect(coreValues.length).toBeGreaterThanOrEqual(4);
      expect(coreValues[0].title).toBe('Quality First');

      const carousel = await getMockCarouselImages('en');
      expect(carousel.length).toBeGreaterThanOrEqual(2);

      const blogPosts = await getMockBlogPosts('en');
      expect(blogPosts.length).toBeGreaterThanOrEqual(1);
      expect(blogPosts[0].slug).toBe('bridging-industries-with-premium-produce');

      const singlePost = await getMockBlogPostBySlug('bridging-industries-with-premium-produce', 'en');
      expect(singlePost?.title).toBe('Bridging Industries with Premium Produce');
    });

    it('provides complete mock fallback across all collections and blog in French', async () => {
      const hero = await getMockHeroContent('fr');
      expect(hero[0].title).toContain('Afrique de l\'Ouest');
      expect(hero[0].ctaPrimary).toBe('Explorer les Produits');

      const about = await getMockAboutContent('fr');
      expect(about[0].sectionTitle).toBe('À Propos d\'AgroVentia Inc.');

      const services = await getMockServicesContent('fr');
      expect(services[0].sectionTitle).toBe('Nos Services');

      const products = await getMockProductsContent('fr');
      expect(products[0].title).toBe('Noix de Cola Séchée');

      const catalog = await getMockProductCatalogContent('fr');
      expect(catalog[0].productName).toBe('Noix de Cola Séchée');

      const contact = await getMockContactContent('fr');
      expect(contact[0].sectionTitle).toBe('Contactez-nous');

      const coreValues = await getMockCoreValues('fr');
      expect(coreValues[0].title).toBe("Qualité d'Abord");

      const carousel = await getMockCarouselImages('fr');
      expect(carousel[0].tagline).toContain('Approvisionnement');

      const blogPosts = await getMockBlogPosts('fr');
      expect(blogPosts[0].title).toContain('Faire le pont');

      const singlePost = await getMockBlogPostBySlug('bridging-industries-with-premium-produce', 'fr');
      expect(singlePost?.title).toContain('Faire le pont');
    });

    it('provides complete mock fallback across all collections and blog in Spanish', async () => {
      const hero = await getMockHeroContent('esp');
      expect(hero[0].title).toContain('Simplificando el abastecimiento global');
      expect(hero[0].ctaPrimary).toBe('Explorar Productos');

      const about = await getMockAboutContent('esp');
      expect(about[0].sectionTitle).toBe('Acerca de AgroVentia Inc.');

      const services = await getMockServicesContent('esp');
      expect(services[0].sectionTitle).toBe('Nuestros Servicios');

      const products = await getMockProductsContent('esp');
      expect(products[0].title).toBe('Nuez de Cola Seca');

      const catalog = await getMockProductCatalogContent('esp');
      expect(catalog[0].productName).toBe('Nuez de Cola Seca');

      const contact = await getMockContactContent('esp');
      expect(contact[0].sectionTitle).toBe('Contáctenos');

      const coreValues = await getMockCoreValues('esp');
      expect(coreValues[0].title).toBe('Calidad Primero');

      const carousel = await getMockCarouselImages('esp');
      expect(carousel[0].tagline).toContain('Abastecimiento');

      const blogPosts = await getMockBlogPosts('esp');
      expect(blogPosts[0].title).toContain('Uniendo industrias');

      const singlePost = await getMockBlogPostBySlug('bridging-industries-with-premium-produce', 'esp');
      expect(singlePost?.title).toContain('Uniendo industrias');
    });

    it('verifies that all fallback data across all collections contains valid modern media paths', async () => {
      const hero = await getMockHeroContent('en');
      expect(hero[0].backgroundImage).toMatch(/^(\/|https?:\/\/)/);
      expect(hero[0].companyLogo).toMatch(/^(\/|https?:\/\/)/);

      const about = await getMockAboutContent('en');
      expect(about[0].aboutImage).toMatch(/^(\/|https?:\/\/)/);

      const services = await getMockServicesContent('en');
      expect(services[0].servicesImage).toMatch(/^(\/|https?:\/\/)/);

      const products = await getMockProductsContent('en');
      for (const p of products) {
        expect(p.image1).toMatch(/^(\/|https?:\/\/)/);
        p.images?.forEach(img => expect(img).toMatch(/^(\/|https?:\/\/)/));
      }

      const contact = await getMockContactContent('en');
      expect(contact[0].contactImage).toMatch(/^(\/|https?:\/\/)/);

      const carousel = await getMockCarouselImages('en');
      for (const c of carousel) {
        expect(c.image).toMatch(/^(\/|https?:\/\/)/);
      }

      const blogPosts = await getMockBlogPosts('en');
      for (const post of blogPosts) {
        expect(post.coverImage).toMatch(/^(\/|https?:\/\/)/);
      }
    });

    it('surfaces errors via sanity-client methods when client fetch fails in live mode', async () => {
      mockClientFetch.mockRejectedValue(new Error('Sanity API offline or unauthorized'));

      await expect(getHeroContent('en')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getAboutContent('fr')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getServicesContent('esp')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getProductsContent('en')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getProductCatalogContent('en')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getContactContent('esp')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getCoreValues('en')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getCarouselImages('fr')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getBlogPosts('en')).rejects.toThrow('Sanity API offline or unauthorized');
      await expect(getBlogPostBySlug('bridging-industries-with-premium-produce', 'en')).rejects.toThrow('Sanity API offline or unauthorized');
    });
  });
});
