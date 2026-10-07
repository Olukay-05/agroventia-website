import './globals.css';
import Providers from './providers';
import CookieBanner from '@/components/common/CookieBanner';
import GoogleAnalyticsScript from '@/components/common/GoogleAnalyticsScript';
import { Metadata } from 'next';
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, BASE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | AgroVentia Inc.',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: BASE_URL,
    siteName: 'AgroVentia Inc.',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/agroventia-logo.jpg`,
        width: 1200,
        height: 630,
        alt: 'AgroVentia Inc.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: '@agroventia',
    creator: '@agroventia',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <CookieBanner />
          <GoogleAnalyticsScript />
        </Providers>
      </body>
    </html>
  );
}
