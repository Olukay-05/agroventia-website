// lib/locale.ts

// Supported locales
export const SUPPORTED_LOCALES = ['en', 'fr-CA'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Default locale
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Get the user's preferred locale based on URL parameter or default
 * This simplified version works in client components
 */
export function getLocaleFromUrl(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocale = urlParams.get('lang');

  if (urlLocale && isSupportedLocale(urlLocale)) {
    return urlLocale as Locale;
  }

  // Check for stored locale in localStorage
  if (typeof localStorage !== 'undefined') {
    const storedLocale = localStorage.getItem('userLocale');

    if (storedLocale && isSupportedLocale(storedLocale)) {
      return storedLocale as Locale;
    }

    // Also check for 'language' key
    const languageKey = localStorage.getItem('language');

    if (languageKey && isSupportedLocale(languageKey)) {
      return languageKey as Locale;
    }
  }

  // Default to English
  return DEFAULT_LOCALE;
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/**
 * Get locale from URL path (e.g., /fr-CA/about)
 */
export function getLocaleFromPath(pathname: string): {
  locale: Locale | null;
  pathname: string;
} {
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0) {
    const potentialLocale = pathSegments[0];
    if (isSupportedLocale(potentialLocale)) {
      // Remove locale from path
      const newPathname = '/' + pathSegments.slice(1).join('/');
      return {
        locale: potentialLocale as Locale,
        pathname: newPathname || '/',
      };
    }
  }

  return { locale: null, pathname };
}
