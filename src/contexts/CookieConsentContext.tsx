'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentContextType {
  consent: ConsentPreferences;
  setConsent: (consent: Partial<ConsentPreferences>) => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true, // Always true by law
  analytics: false,
  marketing: false,
  functional: false,
};

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [consent, setConsentState] =
    useState<ConsentPreferences>(DEFAULT_CONSENT);

  // Load consent from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsentState({
          ...DEFAULT_CONSENT,
          ...parsedConsent,
        });
      } catch (error) {
        console.warn(
          'Failed to parse cookie consent from localStorage:',
          error
        );
      }
    }
  }, []);

  // Save consent to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
  }, [consent]);

  const setConsent = (newConsent: Partial<ConsentPreferences>) => {
    setConsentState(prev => ({
      ...prev,
      ...newConsent,
    }));
  };

  const resetConsent = () => {
    setConsentState(DEFAULT_CONSENT);
    localStorage.removeItem('cookieConsent');
  };

  return (
    <CookieConsentContext.Provider
      value={{ consent, setConsent, resetConsent }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      'useCookieConsent must be used within a CookieConsentProvider'
    );
  }
  return context;
};
