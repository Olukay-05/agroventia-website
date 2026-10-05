import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';
import HomeClient from '@/app/HomeClient';
import { client } from '@/sanity/client';
import {
  getHeroContent,
  getAboutContent,
  getContactContent,
  getProductsContent,
  getProductCatalogContent,
  transformContactContent,
  transformHeroContent,
} from '@/lib/api/sanity-client';

// Mock Lucide icons and Next components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

jest.mock('@/components/WixImage', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ''} data-testid="wix-image" {...props} />;
  },
}));

// Mock embla carousel
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [jest.fn(), { selectedScrollSnap: () => 0, on: jest.fn(), off: jest.fn(), reInit: jest.fn() }],
}));
jest.mock('embla-carousel-autoplay', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));
jest.mock('embla-carousel-fade', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

// Mock GSAP and canvas UI components
jest.mock('@/components/ui/DotGrid', () => ({
  __esModule: true,
  default: () => <div data-testid="dot-grid" />,
}));
jest.mock('@/components/ui/TiltedContainer', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="tilted-container">{children}</div>,
}));
jest.mock('@/components/common/Carousel', () => ({
  __esModule: true,
  default: () => <div data-testid="carousel" />,
}));
jest.mock('@/components/common/MissionVisionCarousel', () => ({
  __esModule: true,
  default: ({ mission, vision }: any) => (
    <div data-testid="mission-vision-carousel">
      <div>{mission}</div>
      <div>{vision}</div>
    </div>
  ),
}));

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    send: jest.fn().mockResolvedValue({ status: 200 }),
  },
}));

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackButtonClick: jest.fn(),
  trackFormSubmit: jest.fn(),
  trackProductQuoteRequest: jest.fn(),
}));

// Mock Sanity client
jest.mock('@/sanity/client', () => ({
  client: {
    fetch: jest.fn(),
  },
  urlFor: jest.fn(() => ({
    url: () => 'https://cdn.sanity.io/images/mock/test/image.jpg',
  })),
}));

const mockClientFetch = client.fetch as jest.Mock;

describe('Story 6 (CAP-6): In-Code Fallback Elimination & True Headless CMS Architecture', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-sanity-project';
    delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider initialLocale="en">
          <QuoteRequestProvider>{ui}</QuoteRequestProvider>
        </LocaleProvider>
      </QueryClientProvider>
    );
  };

  describe('AC 1 & AC 2: Zero hardcoded marketing strings in JSX and safe conditional rendering', () => {
    it('HeroSection does NOT render hardcoded fallback title, subtitle, or secondary CTA when data is empty', async () => {
      // Pass an empty hero singleton
      const emptyHero: any = {
        _id: 'hero-empty',
        title: '',
        subtitle: '',
        description: '',
        ctaPrimary: '',
        ctaSecondary: '',
        displayMode: 'static',
      };

      renderWithProviders(<HeroSection data={emptyHero} isLoading={false} />);

      // Ensure stale copy does NOT exist
      expect(
        screen.queryByText(/Premium Agricultural Imports from West Africa/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Connecting Global Markets with Quality Agricultural Products/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Contact Us')).not.toBeInTheDocument();
    });

    it('AboutSection does NOT render hardcoded title or dummy core values when data is empty', () => {
      const emptyAbout: any = {
        _id: 'about-empty',
        sectionTitle: '',
        title: '',
        story: '',
        mission: '',
        vision: '',
        coreValues: [],
      };

      renderWithProviders(<AboutSection data={emptyAbout} isLoading={false} />);

      // Must not render hardcoded agency title or fabricated core values
      expect(screen.queryByText('About AgroVentia Inc.')).not.toBeInTheDocument();
      expect(screen.queryByText('Quality Assurance')).not.toBeInTheDocument();
      expect(screen.queryByText('Sustainable Practices')).not.toBeInTheDocument();
      expect(screen.queryByText('Innovation Focus')).not.toBeInTheDocument();
      expect(screen.queryByText('Customer Excellence')).not.toBeInTheDocument();
    });

    it('ProductsSection renders exact products without inventing dummy titles or fallbacks', () => {
      const liveProducts: any[] = [
        {
          _id: 'p-1',
          title: 'Specialty Kola Seed',
          productName: 'Specialty Kola Seed',
          description: 'Authentic harvest seed',
          category: 'Seeds',
          image1: 'https://cdn.sanity.io/seed.jpg',
          inStock: true,
        },
      ];

      renderWithProviders(<ProductsSection data={liveProducts} isLoading={false} />);

      expect(screen.getByText('Specialty Kola Seed')).toBeInTheDocument();
      expect(screen.queryByText('Agricultural Product')).not.toBeInTheDocument();
      expect(screen.queryByText('Product Title')).not.toBeInTheDocument();
    });

    it('ContactSection omits address, phone, email, and hours when CMS fields are empty', () => {
      const emptyContact: any = {
        _id: 'contact-empty',
        sectionTitle: '',
        sectionDescription: '',
        businessAddress: '',
        businessPhone: '',
        businessEmail: '',
        businessHours: '',
      };

      renderWithProviders(<ContactSection data={emptyContact} isLoading={false} />);

      // Must NOT render obsolete addresses or contact info
      expect(screen.queryByText(/403 - 65 Mutual Street/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/\+1 \(403\) 477-6059/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/info@agroventia\.ca/i)).not.toBeInTheDocument();
    });

    it('Footer omits contact info and product categories when not provided in CMS', () => {
      renderWithProviders(<Footer />);

      // Stale defaults must not be present
      expect(screen.queryByText(/403 - 65 Mutual Street/i)).not.toBeInTheDocument();
      expect(screen.queryByText('Farm Equipment')).not.toBeInTheDocument();
      expect(screen.queryByText('Crop Protection')).not.toBeInTheDocument();
      expect(screen.queryByText('Fertilizers & Nutrients')).not.toBeInTheDocument();
    });
  });

  describe('AC 3: Pure Sanity hook data flow in HomeClient', () => {
    it('HomeClient renders live CMS content directly from Sanity hooks', async () => {
      mockClientFetch.mockImplementation((query: string) => {
        if (query.includes('heroSection')) {
          return Promise.resolve({
            _id: 'heroSection',
            title: 'Live Headless Hero Title',
            subtitle: 'Live Headless Subtitle',
            ctaPrimary: 'Explore Live',
            displayMode: 'static',
          });
        }
        if (query.includes('aboutSection')) {
          return Promise.resolve({
            _id: 'aboutSection',
            sectionTitle: 'Live About Title',
            story: 'Live Headless Story text here.',
            coreValues: [],
          });
        }
        if (query.includes('product')) {
          return Promise.resolve([
            {
              _id: 'prod-live-1',
              productName: 'Live Sanity Ginger',
              description: 'Fresh organic ginger',
              category: 'Spices',
              productImage: 'https://cdn.sanity.io/ginger.jpg',
            },
          ]);
        }
        if (query.includes('contactInfo')) {
          return Promise.resolve({
            _id: 'contactInfo',
            sectionTitle: 'Live Contact Title',
            businessAddress: '100 King St West, Toronto, ON',
            businessPhone: '+1 (416) 555-0199',
            businessEmail: 'contact@agroventia.ca',
          });
        }
        return Promise.resolve(null);
      });

      renderWithProviders(<HomeClient />);

      await waitFor(() => {
        expect(screen.getByText('Live Headless Hero Title')).toBeInTheDocument();
        expect(screen.getByText('Live Headless Subtitle')).toBeInTheDocument();
        expect(screen.getByText('Explore Live')).toBeInTheDocument();
      });
    });
  });

  describe('AC 4: Mock data strictly isolated & production query error surfacing', () => {
    it('surfaces errors in production mode without silently returning mock data', async () => {
      mockClientFetch.mockRejectedValue(new Error('Sanity lake 503 service unavailable'));

      await expect(getHeroContent('en')).rejects.toThrow('Sanity lake 503 service unavailable');
      await expect(getAboutContent('en')).rejects.toThrow('Sanity lake 503 service unavailable');
      await expect(getContactContent('en')).rejects.toThrow('Sanity lake 503 service unavailable');
      await expect(getProductCatalogContent('en')).rejects.toThrow('Sanity lake 503 service unavailable');
    });

    it('transformers default missing strings to empty rather than hardcoding legacy agency text', () => {
      const transformedContact = transformContactContent({ _id: 'raw-1' });
      expect(transformedContact.businessAddress).toBe('');
      expect(transformedContact.businessPhone).toBe('');
      expect(transformedContact.businessEmail).toBe('');

      const transformedHero = transformHeroContent({ _id: 'raw-2' });
      expect(transformedHero.title).toBe('');
      expect(transformedHero.subtitle).toBe('');
    });
  });
});
