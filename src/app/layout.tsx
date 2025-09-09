import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import CookieBanner from '@/components/common/CookieBanner';
import GoogleAnalyticsScript from '@/components/common/GoogleAnalyticsScript';

export const metadata: Metadata = {
  title: 'AgroVentia',
  description: 'Agricultural Solutions for Modern Farming',
  icons: {
    icon: '/favicon.ico',
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
        </Providers>
        <GoogleAnalyticsScript />
      </body>
    </html>
  );
}
