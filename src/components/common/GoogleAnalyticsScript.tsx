'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useEffect } from 'react';

const GoogleAnalyticsScript = () => {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { consent } = useCookieConsent();

  // Update Google Analytics consent based on user preferences
  useEffect(() => {
    if (gaMeasurementId && typeof window !== 'undefined' && window.gtag) {
      // Map cookie consent to Google Analytics consent
      const consentState = {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
      };

      window.gtag('consent', 'update', consentState);
    }
  }, [consent.analytics, gaMeasurementId]);

  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
            // Default to denied consent
            gtag('consent', 'default', {
              analytics_storage: 'denied'
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalyticsScript;
