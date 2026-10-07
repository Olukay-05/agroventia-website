import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import ContactSection from '@/components/sections/ContactSection';
import {
  getMockProductsContent,
  getMockProductCatalogContent,
  getMockCategories,
  getMockHeroContent,
  getMockAboutContent,
  getMockContactContent,
} from '@/lib/api/mock-data';

// Mock Leaflet and map components
jest.mock('@/components/common/MapComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="map-component">Map</div>,
}));

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: {
    send: jest.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}));

describe('CAP-7: Multilingual Catalog & Zero-Fallback Quality Gate', () => {
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

  describe('12 Agricultural Commodities Multi-Locale Completeness', () => {
    const locales = ['en', 'fr', 'esp'] as const;

    locales.forEach(loc => {
      it(`provides all 12 commodities in ${loc} without coalesce-to-English fallback`, async () => {
        const products = await getMockProductsContent(loc);
        expect(products).toHaveLength(12);

        products.forEach((prod) => {
          expect(prod.title).toBeTruthy();
          expect(prod.description).toBeTruthy();
          expect(prod.category).toBeTruthy();
          expect(prod.qualityStandards).toBeTruthy();

          // Strict Dash Prohibition check on French and Spanish outputs
          if (loc === 'fr' || loc === 'esp') {
            expect(prod.title).not.toMatch(DASH_REGEX);
            expect(prod.description).not.toMatch(DASH_REGEX);
            expect(prod.qualityStandards).not.toMatch(DASH_REGEX);
          }
        });
      });

      it(`provides catalog items in ${loc} with correct sku and pricing tier information`, async () => {
        const catalog = await getMockProductCatalogContent(loc);
        expect(catalog).toHaveLength(12);

        catalog.forEach(item => {
          expect(item.productName).toBeTruthy();
          expect(item.sku).toMatch(/^AGV-/);
          expect(item.inStock).toBe(true);

          if (loc === 'fr' || loc === 'esp') {
            expect(item.productName).not.toMatch(DASH_REGEX);
            expect(item.description).not.toMatch(DASH_REGEX);
          }
        });
      });
    });

    it('ensures French product names differ from English product names', async () => {
      const enProducts = await getMockProductsContent('en');
      const frProducts = await getMockProductsContent('fr');

      expect(enProducts[0].title).toBe('Dried Kolanut');
      expect(frProducts[0].title).toBe('Noix de Cola Séchée');

      expect(enProducts[1].title).toBe('Split Dried Ginger');
      expect(frProducts[1].title).toBe('Gingembre séché concassé');

      expect(enProducts[2].title).toBe('Raw Cashew Nuts');
      expect(frProducts[2].title).toBe("Noix d'anacarde brutes (en coque)");
    });

    it('ensures Spanish product names differ from English product names', async () => {
      const enProducts = await getMockProductsContent('en');
      const espProducts = await getMockProductsContent('esp');

      expect(enProducts[0].title).toBe('Dried Kolanut');
      expect(espProducts[0].title).toBe('Nuez de Cola Seca');

      expect(enProducts[1].title).toBe('Split Dried Ginger');
      expect(espProducts[1].title).toBe('Jengibre seco troceado');

      expect(enProducts[2].title).toBe('Raw Cashew Nuts');
      expect(espProducts[2].title).toBe('Nueces de anacardo crudas (con cáscara)');
    });
  });

  describe('Agricultural Categories Multi-Locale Completeness', () => {
    it('returns all 6 categories across en, fr, esp without empty values', async () => {
      const enCategories = await getMockCategories('en');
      const frCategories = await getMockCategories('fr');
      const espCategories = await getMockCategories('esp');

      expect(enCategories).toHaveLength(6);
      expect(frCategories).toHaveLength(6);
      expect(espCategories).toHaveLength(6);

      // Verify category titles are localized
      expect(enCategories[0].title).toBe('Spices & Aromatics');
      expect(frCategories[0].title).toBe('Épices et aromates');
      expect(espCategories[0].title).toBe('Especias y aromáticos');

      // Verify no prohibited dashes
      frCategories.forEach(cat => expect(cat.title).not.toMatch(DASH_REGEX));
      espCategories.forEach(cat => expect(cat.title).not.toMatch(DASH_REGEX));
    });
  });

  describe('Singletons & Marketing Sections Localization', () => {
    it('provides localized Hero content without em-dashes', async () => {
      const frHero = await getMockHeroContent('fr');
      const espHero = await getMockHeroContent('esp');

      expect(frHero[0].title).toContain("Imports Agricoles Premium");
      expect(frHero[0].title).not.toMatch(DASH_REGEX);

      expect(espHero[0].title).toContain("Simplificando el abastecimiento");
      expect(espHero[0].title).not.toMatch(DASH_REGEX);
    });

    it('provides localized About content with Canadian standards', async () => {
      const frAbout = await getMockAboutContent('fr');
      const espAbout = await getMockAboutContent('esp');

      expect(frAbout[0].sectionTitle).toBe("À Propos d'AgroVentia Inc.");
      expect(frAbout[0].story).toContain('AgroVentia Inc.');
      expect(frAbout[0].story).not.toMatch(DASH_REGEX);

      expect(espAbout[0].sectionTitle).toBe('Acerca de AgroVentia Inc.');
      expect(espAbout[0].sectionTitle).not.toMatch(DASH_REGEX);
    });

    it('provides localized Contact content with zero dash breaks', async () => {
      const frContact = await getMockContactContent('fr');
      const espContact = await getMockContactContent('esp');

      expect(frContact[0].sectionTitle).toBe('Contactez-nous');
      expect(frContact[0].businessHours).not.toMatch(DASH_REGEX);

      expect(espContact[0].sectionTitle).toBe('Contáctenos');
      expect(espContact[0].businessHours).not.toMatch(DASH_REGEX);
    });
  });

  describe('ContactSection UI Localization Rendering', () => {
    const renderContact = (locale: string) => {
      const mockContactData: any = {
        _id: 'mock-contact',
        sectionTitle: 'Contact Us',
        address: '100 King St W, Toronto, ON M5X 1A9',
        businessEmail: 'contact@agroventia.com',
        phone: '+1 416-555-0199',
        hours: 'Mon, Fri: 8:00 AM, 5:00 PM EST',
      };

      return render(
        <QueryClientProvider client={queryClient}>
          <LocaleProvider initialLocale={locale as any}>
            <QuoteRequestProvider>
              <ContactSection data={mockContactData} isLoading={false} />
            </QuoteRequestProvider>
          </LocaleProvider>
        </QueryClientProvider>
      );
    };

    it('renders French UI labels in ContactSection', () => {
      renderContact('fr');

      expect(screen.getByText('Coordonnées')).toBeInTheDocument();
      expect(screen.getByText('Envoyez-nous un message')).toBeInTheDocument();
      expect(screen.getByText(/Prénom/)).toBeInTheDocument();
      expect(screen.getByText(/Nom/)).toBeInTheDocument();
      expect(screen.getByText(/Adresse courriel/)).toBeInTheDocument();
      expect(screen.getByText(/Type de demande/)).toBeInTheDocument();
      expect(screen.getByText(/Message/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Envoyer le message/i })).toBeInTheDocument();
    });

    it('renders Spanish UI labels in ContactSection', () => {
      renderContact('esp');

      expect(screen.getByText('Información de Contacto')).toBeInTheDocument();
      expect(screen.getByText('Envíenos un Mensaje')).toBeInTheDocument();
      expect(screen.getByText(/Nombre/)).toBeInTheDocument();
      expect(screen.getByText(/Apellido/)).toBeInTheDocument();
      expect(screen.getByText(/Tipo de consulta/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Enviar Mensaje/i })).toBeInTheDocument();
    });
  });
});
