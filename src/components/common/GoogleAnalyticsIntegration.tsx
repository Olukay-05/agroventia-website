'use client';

import React, { useEffect } from 'react';
import useCookieConsent from '@/hooks/useCookieConsent';

const GoogleAnalyticsIntegration: React.FC = () => {
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Check if gtag is available (Google Analytics is loaded)
    if (typeof window !== 'undefined' && window.gtag) {
      if (consent.analytics) {
        // Grant consent for analytics storage
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
        console.log('Google Analytics cookies enabled');
      } else {
        // Deny consent for analytics storage
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
        console.log('Google Analytics cookies disabled');
      }
    }
  }, [consent.analytics]);

  return null; // This component doesn't render anything
};

export default GoogleAnalyticsIntegration;
