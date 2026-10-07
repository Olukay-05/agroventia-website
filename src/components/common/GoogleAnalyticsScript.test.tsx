import React from 'react';
import { render, waitFor } from '@testing-library/react';
import GoogleAnalyticsScript from './GoogleAnalyticsScript';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';

jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ onLoad, ...props }: React.ComponentProps<'script'> & { onLoad?: () => void }) => {
    React.useEffect(() => {
      onLoad?.();
    }, [onLoad]);
    return <script {...props} />;
  },
}));

describe('GoogleAnalyticsScript consent lifecycle', () => {
  const originalMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
    localStorage.clear();
    (window as typeof window & { gtag?: jest.Mock }).gtag = jest.fn();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalMeasurementId;
    delete (window as typeof window & { gtag?: jest.Mock }).gtag;
  });

  it('establishes denied consent before analytics configuration', () => {
    const { container } = render(
      <CookieConsentProvider>
        <GoogleAnalyticsScript />
      </CookieConsentProvider>
    );

    const initScript = container.querySelector('#gtag-init');
    const scriptText = initScript?.textContent || '';
    expect(scriptText.indexOf("gtag('consent', 'default'")).toBeGreaterThan(-1);
    expect(scriptText.indexOf("gtag('consent', 'default'")).toBeLessThan(
      scriptText.indexOf("gtag('config'")
    );
  });

  it('reapplies stored analytics consent when the script becomes ready', async () => {
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify({ necessary: true, analytics: true, marketing: false, functional: false })
    );

    render(
      <CookieConsentProvider>
        <GoogleAnalyticsScript />
      </CookieConsentProvider>
    );

    await waitFor(() => {
      expect((window as typeof window & { gtag: jest.Mock }).gtag).toHaveBeenCalledWith(
        'consent',
        'update',
        { analytics_storage: 'granted' }
      );
    });
  });
});
