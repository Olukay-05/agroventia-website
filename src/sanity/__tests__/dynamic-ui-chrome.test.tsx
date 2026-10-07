/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import AboutSection from '@/components/sections/AboutSection';
import ProductsSection from '@/components/sections/ProductsSection';
import Footer from '@/components/sections/Footer';
import PrivacyPolicyPage from '@/app/privacy-policy/page';
import TermsOfServicePage from '@/app/terms-of-service/page';
import CookiePolicyPage from '@/app/cookie-policy/page';
import {
  getMockProductsSectionContent,
  getMockAboutContent,
  getMockContactContent,
  getMockLegalPageBySlug,
} from '@/lib/api/mock-data';
import {
  getProductsSectionContent,
  getLegalPageBySlug,
  transformProductsSectionContent,
  transformLegalPageContent,
  transformAboutContent,
  transformContactContent,
} from '@/lib/api/sanity-client';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

// Mock Next.js Image
jest.mock('next/image', () => {
  return ({ src, alt, ...rest }: any) => (
    <img src={src} alt={alt} {...rest} />
  );
});


// Mock DotGrid
jest.mock('@/components/ui/DotGrid', () => {
  return () => <div data-testid="dot-grid" />;
});

// Mock TiltedContainer
jest.mock('@/components/ui/TiltedContainer', () => {
  return ({ children, className }: any) => (
    <div data-testid="tilted-container" className={className}>
      {children}
    </div>
  );
});

// Mock Carousel
jest.mock('@/components/common/Carousel', () => {
  return ({ items }: any) => (
    <div data-testid="mobile-carousel">
      {items?.map((it: any) => (
        <div key={it.id} data-testid={`carousel-item-${it.id}`}>
          {it.title}
        </div>
      ))}
    </div>
  );
});

// Mock MissionVisionCarousel
jest.mock('@/components/common/MissionVisionCarousel', () => {
  return () => <div data-testid="mission-vision-carousel" />;
});

import { CookieConsentProvider } from '@/contexts/CookieConsentContext';

// Mock FooterSocialLinks
jest.mock('@/components/sections/FooterSocialLinks', () => {
  return () => <div data-testid="footer-social-links" />;
});

// Mock LanguageSelector
jest.mock('@/components/common/LanguageSelector', () => ({
  __esModule: true,
  LanguageSelector: () => <div data-testid="language-selector" />,
}));

describe('CAP-8: Dynamic UI Chrome, Footer CMS Management & Legal Pages', () => {
  const DASH_REGEX = /[—–]|\s-\s/;
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

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <CookieConsentProvider>
            <QuoteRequestProvider>{ui}</QuoteRequestProvider>
          </CookieConsentProvider>
        </LocaleProvider>
      </QueryClientProvider>
    );
  };

  describe('Products Section Content & CTA Banner (en, fr, esp)', () => {
    const locales = ['en', 'fr', 'esp'] as const;

    locales.forEach(loc => {
      it(`retrieves products section content in ${loc} without fallback slop`, async () => {
        const content = await getMockProductsSectionContent(loc);
        expect(content).not.toBeNull();
        expect(content?.sectionTitle).toBeTruthy();
        expect(content?.sectionDescription).toBeTruthy();
        expect(content?.categoriesTitle).toBeTruthy();
        expect(content?.categoriesSubtitle).toBeTruthy();
        expect(content?.searchPlaceholder).toBeTruthy();

        // CTA Banner
        expect(content?.ctaBanner).toBeDefined();
        expect(content?.ctaBanner?.heading).toBeTruthy();
        expect(content?.ctaBanner?.description).toBeTruthy();
        expect(content?.ctaBanner?.primaryButtonText).toBeTruthy();
        expect(content?.ctaBanner?.secondaryButtonText).toBeTruthy();
        expect(content?.ctaBanner?.isActive).toBe(true);

        if (loc === 'fr' || loc === 'esp') {
          expect(content?.sectionTitle).not.toMatch(DASH_REGEX);
          expect(content?.ctaBanner?.heading).not.toMatch(DASH_REGEX);
          expect(content?.ctaBanner?.description).not.toMatch(DASH_REGEX);
        }
      });
    });

    it('transforms raw Sanity products section payload properly', () => {
      const raw = {
        _id: 'prodSection-123',
        sectionTitle: { en: 'Our Products', fr: 'Nos Produits', esp: 'Nuestros Productos' },
        ctaBanner: {
          heading: { en: 'Top Quality', fr: 'Qualite Superieure', esp: 'Maxima Calidad' },
          description: { en: 'Trusted trade.', fr: 'Commerce de confiance.', esp: 'Comercio confiable.' },
          primaryButtonText: { en: 'Catalog', fr: 'Catalogue', esp: 'Catalogo' },
          secondaryButtonText: { en: 'Call', fr: 'Appel', esp: 'Llamar' },
          isActive: true,
        },
      };

      const transformed = transformProductsSectionContent(raw, 'fr');
      expect(transformed.sectionTitle).toBe('Nos Produits');
      expect(transformed.ctaBanner?.heading).toBe('Qualite Superieure');
      expect(transformed.ctaBanner?.primaryButtonText).toBe('Catalogue');
    });
  });

  describe('About Highlights & Why Choose Section (en, fr, esp)', () => {
    const locales = ['en', 'fr', 'esp'] as const;

    locales.forEach(loc => {
      it(`retrieves about content with highlights in ${loc}`, async () => {
        const aboutList = await getMockAboutContent(loc);
        expect(aboutList.length).toBeGreaterThan(0);
        const about = aboutList[0];

        expect(about.whyChooseTitle).toBeTruthy();
        expect(about.highlights).toBeDefined();
        expect(about.highlights?.length).toBe(5);

        about.highlights?.forEach(hl => {
          expect(hl.metric).toBeTruthy();
          expect(hl.title).toBeTruthy();
          expect(hl.description).toBeTruthy();
          expect(hl.colorVariant).toBeTruthy();

          if (loc === 'fr' || loc === 'esp') {
            expect(hl.title).not.toMatch(DASH_REGEX);
            expect(hl.description).not.toMatch(DASH_REGEX);
          }
        });
      });
    });

    it('transforms raw Sanity about section with highlights array', () => {
      const raw = {
        _id: 'about-1',
        whyChooseTitle: { en: 'Why AgroVentia?', fr: 'Pourquoi AgroVentia?', esp: 'Por que AgroVentia?' },
        highlights: [
          {
            _key: 'h1',
            metric: '10+',
            title: { en: 'Products', fr: 'Produits', esp: 'Productos' },
            description: { en: 'Diverse range', fr: 'Gamme diversifiee', esp: 'Gama diversa' },
            colorVariant: 'primary',
            isActive: true,
          },
        ],
      };

      const transformed = transformAboutContent(raw, 'esp');
      expect(transformed.whyChooseTitle).toBe('Por que AgroVentia?');
      expect(transformed.highlights?.[0].title).toBe('Productos');
      expect(transformed.highlights?.[0].description).toBe('Gama diversa');
    });
  });

  describe('Footer CMS Management & Contact Content (en, fr, esp)', () => {
    const locales = ['en', 'fr', 'esp'] as const;

    locales.forEach(loc => {
      it(`retrieves contact info with footer fields in ${loc}`, async () => {
        const contactList = await getMockContactContent(loc);
        expect(contactList.length).toBeGreaterThan(0);
        const contact = contactList[0];

        expect(contact.companyTagline).toBeTruthy();
        expect(contact.companyBio).toBeTruthy();
        expect(contact.followUsTitle).toBeTruthy();
        expect(contact.quickLinksTitle).toBeTruthy();
        expect(contact.coreValuesTitle).toBeTruthy();
        expect(contact.productCategoriesTitle).toBeTruthy();
        expect(contact.copyrightNotice).toBeTruthy();
        expect(contact.backToTopText).toBeTruthy();
        expect(contact.legalLinks).toBeDefined();
        expect(contact.legalLinks?.length).toBe(3);

        if (loc === 'fr' || loc === 'esp') {
          expect(contact.companyBio).not.toMatch(DASH_REGEX);
          expect(contact.copyrightNotice).not.toMatch(DASH_REGEX);
        }
      });
    });

    it('transforms raw Sanity contact info with footer branding & legal links', () => {
      const raw = {
        _id: 'contact-1',
        companyTagline: { en: 'Solutions', fr: 'Solutions Agricoles', esp: 'Soluciones' },
        legalLinks: [
          { _key: 'l1', url: '/privacy-policy', label: { en: 'Privacy', fr: 'Confidentialite', esp: 'Privacidad' } },
        ],
      };

      const transformed = transformContactContent(raw, 'fr');
      expect(transformed.companyTagline).toBe('Solutions Agricoles');
      expect(transformed.legalLinks?.[0].label).toBe('Confidentialite');
    });
  });

  describe('Legal Policy Pages by Slug (privacy-policy, terms-of-service, cookie-policy)', () => {
    const slugs = ['privacy-policy', 'terms-of-service', 'cookie-policy'] as const;
    const locales = ['en', 'fr', 'esp'] as const;

    slugs.forEach(slug => {
      locales.forEach(loc => {
        it(`loads ${slug} in ${loc} with title, intro, and structured sections`, async () => {
          const page = await getMockLegalPageBySlug(slug, loc);
          expect(page).not.toBeNull();
          expect(page?.slug).toBe(slug);
          expect(page?.title).toBeTruthy();
          expect(page?.lastUpdated).toBeTruthy();
          expect(page?.introduction).toBeTruthy();
          expect(page?.sections.length).toBeGreaterThan(0);

          page?.sections.forEach(sec => {
            expect(sec.heading).toBeTruthy();
            expect(sec.content).toBeTruthy();

            if (loc === 'fr' || loc === 'esp') {
              expect(sec.heading).not.toMatch(DASH_REGEX);
            }
          });
        });
      });
    });

    it('transforms raw legalPage document correctly', () => {
      const raw = {
        _id: 'legal-1',
        slug: { current: 'privacy-policy' },
        title: { en: 'Privacy Policy', fr: 'Politique de Confidentialite', esp: 'Politica de Privacidad' },
        sections: [
          {
            _key: 'sec-1',
            sectionId: 'intro',
            heading: { en: 'Introduction', fr: 'Introduction', esp: 'Introduccion' },
            content: { en: 'Body en', fr: 'Corps fr', esp: 'Cuerpo esp' },
          },
        ],
      };

      const transformed = transformLegalPageContent(raw, 'esp');
      expect(transformed.title).toBe('Politica de Privacidad');
      expect(transformed.sections[0].heading).toBe('Introduccion');
      expect(transformed.sections[0].content).toBe('Cuerpo esp');
    });
  });

  describe('UI Component Dynamic Rendering', () => {
    it('renders AboutSection with dynamic whyChooseTitle and highlight cards', async () => {
      const [aboutData] = await getMockAboutContent('en');
      renderWithProviders(<AboutSection data={aboutData} isLoading={false} />);

      const headings = screen.getAllByText(aboutData.whyChooseTitle!);
      expect(headings.length).toBeGreaterThan(0);
      aboutData.highlights?.forEach(hl => {
        const titles = screen.getAllByText(hl.title);
        expect(titles.length).toBeGreaterThan(0);
      });
    });

    it('renders ProductsSection with dynamic CTA banner heading and action buttons', async () => {
      const sectionConfig = await getMockProductsSectionContent('en');
      renderWithProviders(<ProductsSection data={[]} isLoading={false} />);

      if (sectionConfig?.ctaBanner?.heading) {
        expect(
          await screen.findByText(sectionConfig.ctaBanner.heading)
        ).toBeInTheDocument();
      }
      if (sectionConfig?.ctaBanner?.primaryButtonText) {
        expect(
          await screen.findByText(sectionConfig.ctaBanner.primaryButtonText)
        ).toBeInTheDocument();
      }
    });

    it('renders Footer with dynamic company tagline, bio, and legal links', async () => {
      const [contactData] = await getMockContactContent('en');
      renderWithProviders(<Footer />);

      if (contactData.companyTagline) {
        expect(await screen.findByText(contactData.companyTagline)).toBeInTheDocument();
      }
      if (contactData.companyBio) {
        expect(await screen.findByText(contactData.companyBio)).toBeInTheDocument();
      }
      for (const link of contactData.legalLinks || []) {
        const els = await screen.findAllByText(link.label);
        expect(els.length).toBeGreaterThan(0);
      }
    });

    it('renders PrivacyPolicyPage with dynamic content', async () => {
      renderWithProviders(<PrivacyPolicyPage />);
      const titles = await screen.findAllByText('Privacy Policy');
      expect(titles.length).toBeGreaterThan(0);
    });

    it('renders TermsOfServicePage with dynamic content', async () => {
      renderWithProviders(<TermsOfServicePage />);
      const titles = await screen.findAllByText('Terms of Service');
      expect(titles.length).toBeGreaterThan(0);
    });

    it('renders CookiePolicyPage and preserves cookie consent preference panel', async () => {
      renderWithProviders(<CookiePolicyPage />);
      const titles = await screen.findAllByText('Cookie Policy');
      expect(titles.length).toBeGreaterThan(0);
      await waitFor(() => {
        expect(screen.getByText('Your Current Cookie Preferences')).toBeInTheDocument();
      });
      expect(screen.getByText('Accept All')).toBeInTheDocument();
      expect(screen.getByText('Reject All')).toBeInTheDocument();
    });
  });
});
