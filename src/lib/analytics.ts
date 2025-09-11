// src/lib/analytics.ts
// Analytics utility functions for conversion tracking

// Define proper types for gtag function
type GTagCommand =
  | 'config'
  | 'event'
  | 'consent'
  | 'get'
  | 'set'
  | 'js'
  | string;

type GTagEventName = string;

interface GTagEventParams {
  [key: string]: string | number | boolean | undefined | string[] | number[];
  event_category?: string;
  event_label?: string;
  value?: number;
}

interface GTagConfigParams {
  page_path?: string;
  page_title?: string;
  [key: string]: string | number | boolean | undefined;
}

type GTagConsentArg = 'default' | 'update' | string;

type GTagConsentParams = {
  analytics_storage?: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
  security_storage?: 'granted' | 'denied';
  [key: string]: 'granted' | 'denied' | undefined;
};

// Define dataLayer item structure
interface DataLayerItem {
  event?: string;
  [key: string]: string | number | boolean | undefined | null;
}

declare global {
  interface Window {
    gtag?: (
      command: GTagCommand,
      eventNameOrProperty: GTagEventName | string,
      params?: GTagEventParams | GTagConfigParams | GTagConsentParams
    ) => void;
    dataLayer?: DataLayerItem[];
  }
}

// Event types for conversion tracking
export type AnalyticsEvent =
  | 'form_submit'
  | 'product_quote_request'
  | 'newsletter_signup'
  | 'button_click'
  | 'page_view'
  | 'custom_event';

// Event parameters
export interface EventParams {
  [key: string]: string | number | boolean | undefined;
  event_category?: string;
  event_label?: string;
  value?: number;
}

// GTag consent parameters
interface ConsentParams {
  analytics_storage?: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
  security_storage?: 'granted' | 'denied';
  [key: string]: 'granted' | 'denied' | undefined;
}

// Track a custom event
export function trackEvent(
  action: AnalyticsEvent | string,
  params: EventParams = {}
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  } else {
    // Log event in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event:', action, params);
    }
  }
}

// Track form submission
export function trackFormSubmit(
  formName: string,
  additionalParams: EventParams = {}
): void {
  trackEvent('form_submit', {
    event_category: 'engagement',
    event_label: formName,
    ...additionalParams,
  });
}

// Track product quote request
export function trackProductQuoteRequest(
  productName: string,
  productId?: string
): void {
  trackEvent('product_quote_request', {
    event_category: 'engagement',
    event_label: productName,
    product_id: productId,
  });
}

// Track newsletter signup
export function trackNewsletterSignup(email: string): void {
  trackEvent('newsletter_signup', {
    event_category: 'engagement',
    event_label: 'newsletter_subscription',
    email_domain: email.split('@')[1],
  });
}

// Track button clicks
export function trackButtonClick(
  buttonName: string,
  additionalParams: EventParams = {}
): void {
  trackEvent('button_click', {
    event_category: 'engagement',
    event_label: buttonName,
    ...additionalParams,
  });
}

// Track page views
export function trackPageView(
  pagePath: string,
  pageTitle: string,
  additionalParams: EventParams = {}
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: pagePath,
      page_title: pageTitle,
      ...additionalParams,
    });
  } else {
    // Log page view in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Page view:', pagePath, pageTitle, additionalParams);
    }
  }
}

// Update consent preferences
export function updateConsent(
  consentPreferences: Record<string, 'granted' | 'denied'>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', consentPreferences);
  }
}

// Initialize analytics with consent
export function initializeAnalytics(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    // Set default consent to denied
    const defaultConsent: ConsentParams = {
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'denied',
    };
    window.gtag('consent', 'default', defaultConsent);
  }
}
