// contexts/LocaleContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Locale,
  DEFAULT_LOCALE,
  isSupportedLocale,
  getLocaleFromUrl,
} from '@/lib/locale';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || DEFAULT_LOCALE
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved locale in localStorage or URL
    const urlLocale = getLocaleFromUrl();

    if (urlLocale && isSupportedLocale(urlLocale)) {
      setLocaleState(urlLocale as Locale);
    } else {
      const savedLocale =
        typeof window !== 'undefined'
          ? localStorage.getItem('userLocale')
          : null;

      if (savedLocale && isSupportedLocale(savedLocale)) {
        setLocaleState(savedLocale as Locale);
      }
    }

    setIsLoading(false);
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (isSupportedLocale(newLocale)) {
      setLocaleState(newLocale);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userLocale', newLocale);
        // Also set the 'language' key to ensure consistency
        localStorage.setItem('language', newLocale);
      }
      // Update URL parameter
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (newLocale === 'en') {
          url.searchParams.delete('lang');
        } else {
          url.searchParams.set('lang', newLocale);
        }
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
