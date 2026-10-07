import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import BlogListingClient from '@/app/blog/BlogListingClient';
import BlogPostClient from '@/app/blog/[slug]/BlogPostClient';
import Footer from '@/components/sections/Footer';
import CookieBanner from '@/components/common/CookieBanner';
import { getMockBlogPosts, getMockBlogPostBySlug } from '@/lib/api/mock-data';
import { getBlogUiLabels, BLOG_UI } from '@/lib/blog-i18n';
import { getFooterUiLabels, FOOTER_UI } from '@/lib/footer-i18n';
import { getLegalUiLabels, formatLegalDate, LEGAL_UI } from '@/lib/legal-i18n';
import { normalizeCategorySlug } from '@/lib/product-filters';
import {
  LOCALIZED_SCHEMA_TYPES,
  DocumentActionProps,
} from '@/sanity/actions/autoTranslateAction';

// Mock Next.js router and navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('CAP-13: Multilingual Parity, Blog System Localization & Global Footer Category Links', () => {
  let queryClient: QueryClient;

  const renderWithProviders = (
    ui: React.ReactElement,
    initialLocale: string = 'en'
  ) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider initialLocale={initialLocale}>
          <CookieConsentProvider>{ui}</CookieConsentProvider>
        </LocaleProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Scenario 1: Blog Listing Client Localization', () => {
    it('renders English blog listing with authentic headings and mock posts', async () => {
      const posts = await getMockBlogPosts('en');
      renderWithProviders(<BlogListingClient initialPosts={posts} />, 'en');

      expect(screen.getByText('Our Blog')).toBeInTheDocument();
      expect(screen.getByText('Latest Insights & News')).toBeInTheDocument();
      expect(
        screen.getByText('Bridging Industries with Premium Produce')
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Read Article/i).length).toBeGreaterThan(0);
      expect(screen.getByText('View All Articles')).toBeInTheDocument();
    });

    it('renders Canadian French blog listing with full UI and article localization', async () => {
      const posts = await getMockBlogPosts('fr');
      renderWithProviders(<BlogListingClient initialPosts={posts} />, 'fr');

      expect(screen.getByText('Notre Blogue')).toBeInTheDocument();
      expect(
        screen.getByText('Actualités et perspectives du marché')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Faire le pont entre les industries avec des produits agricoles de qualité'
        )
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Lire l'article/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Voir tous les articles')).toBeInTheDocument();
    });

    it('renders International Spanish blog listing with full UI and article localization', async () => {
      const posts = await getMockBlogPosts('esp');
      renderWithProviders(<BlogListingClient initialPosts={posts} />, 'esp');

      expect(screen.getByText('Nuestro Blog')).toBeInTheDocument();
      expect(
        screen.getByText('Últimas perspectivas y noticias')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Uniendo industrias con productos agrícolas prémium')
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Leer artículo/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Ver todos los artículos')).toBeInTheDocument();
    });

    it('returns valid UI dictionaries for en, fr, and esp via getBlogUiLabels', () => {
      const enLabels = getBlogUiLabels('en');
      const frLabels = getBlogUiLabels('fr-CA');
      const esLabels = getBlogUiLabels('es');

      expect(enLabels.backToBlog).toBe('Back to Blog');
      expect(frLabels.backToBlog).toBe('Retour au blogue');
      expect(esLabels.backToBlog).toBe('Volver al blog');
    });
  });

  describe('Scenario 2: Blog Post Detail Client Localization', () => {
    it('renders English blog post detail with breadcrumb, metadata, and share triggers', async () => {
      const post = (await getMockBlogPostBySlug(
        'bridging-industries-with-premium-produce',
        'en'
      ))!;
      const allPosts = await getMockBlogPosts('en');

      renderWithProviders(
        <BlogPostClient
          initialPost={post}
          initialRelatedPosts={allPosts.slice(1)}
          slug="bridging-industries-with-premium-produce"
        />,
        'en'
      );

      expect(screen.getByText('Back to Blog')).toBeInTheDocument();
      expect(screen.getByText('Share this article')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('Keep Reading')).toBeInTheDocument();
      expect(
        screen.getByText('More Insights from AgroVentia')
      ).toBeInTheDocument();
    });

    it('renders Canadian French blog post detail with localized breadcrumb, share, and related labels', async () => {
      const post = (await getMockBlogPostBySlug(
        'bridging-industries-with-premium-produce',
        'fr'
      ))!;
      const allPosts = await getMockBlogPosts('fr');

      renderWithProviders(
        <BlogPostClient
          initialPost={post}
          initialRelatedPosts={allPosts.slice(1)}
          slug="bridging-industries-with-premium-produce"
        />,
        'fr'
      );

      expect(screen.getByText('Retour au blogue')).toBeInTheDocument();
      expect(screen.getByText('Partager cet article')).toBeInTheDocument();
      expect(screen.getByText('Lecture 5 min')).toBeInTheDocument();
      expect(screen.getByText('Poursuivre la lecture')).toBeInTheDocument();
      expect(
        screen.getByText("Plus d'analyses d'AgroVentia")
      ).toBeInTheDocument();
    });

    it('renders International Spanish blog post detail with localized breadcrumb, share, and related labels', async () => {
      const post = (await getMockBlogPostBySlug(
        'bridging-industries-with-premium-produce',
        'esp'
      ))!;
      const allPosts = await getMockBlogPosts('esp');

      renderWithProviders(
        <BlogPostClient
          initialPost={post}
          initialRelatedPosts={allPosts.slice(1)}
          slug="bridging-industries-with-premium-produce"
        />,
        'esp'
      );

      expect(screen.getByText('Volver al blog')).toBeInTheDocument();
      expect(screen.getByText('Compartir este artículo')).toBeInTheDocument();
      expect(screen.getByText('Lectura 5 min')).toBeInTheDocument();
      expect(screen.getByText('Continuar leyendo')).toBeInTheDocument();
      expect(
        screen.getByText('Más análisis de AgroVentia')
      ).toBeInTheDocument();
    });
  });

  describe('Scenario 3: Global Footer 5 Canonical Commodity Categories & Deep Linking', () => {
    it('always displays the 5 canonical commodity categories in English with deep links to /products?category=slug', () => {
      renderWithProviders(<Footer />, 'en');

      const expectedCategories = [
        { label: 'Grains & Cereals', slug: 'grains-and-cereals' },
        { label: 'Pulses & Legumes', slug: 'pulses-and-legumes' },
        { label: 'Oilseeds & Special Crops', slug: 'oilseeds-and-special-crops' },
        { label: 'Spices & Botanicals', slug: 'spices-and-botanicals' },
        {
          label: 'Horticulture & Specialty Products',
          slug: 'horticulture-and-specialty',
        },
      ];

      expectedCategories.forEach(({ label, slug }) => {
        const link = screen.getByRole('link', { name: new RegExp(label, 'i') });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/products?category=${slug}`);
      });
    });

    it('displays the 5 canonical categories in Canadian French with matching deep links', () => {
      renderWithProviders(<Footer />, 'fr');

      const frenchCategories = [
        { label: 'Grains et céréales', slug: 'grains-and-cereals' },
        { label: 'Légumineuses', slug: 'pulses-and-legumes' },
        {
          label: 'Oléagineux et cultures spéciales',
          slug: 'oilseeds-and-special-crops',
        },
        { label: 'Épices et plantes médicinales', slug: 'spices-and-botanicals' },
        {
          label: 'Horticulture et produits de spécialité',
          slug: 'horticulture-and-specialty',
        },
      ];

      frenchCategories.forEach(({ label, slug }) => {
        const link = screen.getByRole('link', { name: new RegExp(label, 'i') });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/products?category=${slug}`);
      });

      // Quick links localized in French
      expect(screen.getByRole('link', { name: /Accueil/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Produits$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /À Propos/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Blogue/i })).toBeInTheDocument();
    });

    it('displays the 5 canonical categories in International Spanish with matching deep links', () => {
      renderWithProviders(<Footer />, 'esp');

      const spanishCategories = [
        { label: 'Granos y cereales', slug: 'grains-and-cereals' },
        { label: 'Legumbres', slug: 'pulses-and-legumes' },
        {
          label: 'Oleaginosas y cultivos especiales',
          slug: 'oilseeds-and-special-crops',
        },
        { label: 'Especias y botánicos', slug: 'spices-and-botanicals' },
        {
          label: 'Horticultura y productos especiales',
          slug: 'horticulture-and-specialty',
        },
      ];

      spanishCategories.forEach(({ label, slug }) => {
        const link = screen.getByRole('link', { name: new RegExp(label, 'i') });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/products?category=${slug}`);
      });

      // Quick links localized in Spanish
      expect(screen.getByRole('link', { name: /Inicio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Productos$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Nosotros/i })).toBeInTheDocument();
    });

    it('stores selectedProductCategory in sessionStorage on category click', () => {
      renderWithProviders(<Footer />, 'en');

      const pulsesLink = screen.getByRole('link', {
        name: /Pulses & Legumes/i,
      });
      fireEvent.click(pulsesLink);

      expect(sessionStorage.getItem('selectedProductCategory')).toBe(
        'pulses-and-legumes'
      );
    });
  });

  describe('Scenario 4: Legal Pages & Cookie Banner Multilingual Coverage', () => {
    it('provides French and Spanish UI dictionaries via getLegalUiLabels', () => {
      const frLabels = getLegalUiLabels('fr');
      const esLabels = getLegalUiLabels('esp');

      expect(frLabels.backToHome).toBe('Retour à l’accueil');
      expect(frLabels.defaultTitles.privacy).toBe('Politique de confidentialité');
      expect(frLabels.cookieBanner.acceptAll).toBe('Tout accepter');

      expect(esLabels.backToHome).toBe('Volver al inicio');
      expect(esLabels.defaultTitles.terms).toBe('Términos de servicio');
      expect(esLabels.cookieBanner.acceptAll).toBe('Aceptar todas');
    });

    it('formats dates appropriately per locale in formatLegalDate', () => {
      const dateStr = '2026-10-04T12:00:00.000Z';
      const frDate = formatLegalDate(dateStr, 'fr');
      const esDate = formatLegalDate(dateStr, 'esp');
      const enDate = formatLegalDate(dateStr, 'en');

      expect(frDate.toLowerCase()).toContain('2026');
      expect(esDate.toLowerCase()).toContain('2026');
      expect(enDate.toLowerCase()).toContain('2026');
    });

    it('renders CookieBanner with localized copy and interactive controls', async () => {
      localStorage.clear();
      renderWithProviders(<CookieBanner />, 'fr');

      // CookieBanner appears after delay
      await waitFor(
        () => {
          expect(
            screen.getByText('Consentement relatif aux témoins')
          ).toBeInTheDocument();
        },
        { timeout: 2500 }
      );

      expect(screen.getByText('Tout accepter')).toBeInTheDocument();
      expect(screen.getByText('Tout refuser')).toBeInTheDocument();
      expect(screen.getByText('Accepter la sélection')).toBeInTheDocument();
    });
  });

  describe('Scenario 5: Sanity Studio autoTranslateAction Schema Completeness', () => {
    it('confirms blogPost, product, and legalPage belong to LOCALIZED_SCHEMA_TYPES', () => {
      expect(LOCALIZED_SCHEMA_TYPES.has('blogPost')).toBe(true);
      expect(LOCALIZED_SCHEMA_TYPES.has('product')).toBe(true);
      expect(LOCALIZED_SCHEMA_TYPES.has('legalPage')).toBe(true);
      expect(LOCALIZED_SCHEMA_TYPES.has('heroSection')).toBe(true);
    });
  });
});
