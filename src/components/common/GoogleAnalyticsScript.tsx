'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useEffect } from 'react';

const GoogleAnalyticsScript = () => {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { consent } = useCookieConsent();

  const applyConsent = () => {
    if (gaMeasurementId && typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
      });
    }
  };

  // Update Google Analytics consent based on user preferences
  useEffect(() => {
    applyConsent();
  }, [consent.analytics, gaMeasurementId]);

  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        onLoad={applyConsent}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Default to denied consent
            gtag('consent', 'default', {
              analytics_storage: 'denied'
            });
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalyticsScript;
