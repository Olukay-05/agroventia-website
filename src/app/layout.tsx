import './globals.css';
import Providers from './providers';
import CookieBanner from '@/components/common/CookieBanner';
import GoogleAnalyticsScript from '@/components/common/GoogleAnalyticsScript';

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
