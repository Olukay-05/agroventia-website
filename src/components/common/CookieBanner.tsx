'use client';

import React, { useState, useEffect } from 'react';
import useCookieConsent from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CookieBanner: React.FC = () => {
  const { consent, setConsent } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  // Check if we should show the banner
  useEffect(() => {
    // Don't show on legal pages
    const isLegalPage =
      window.location.pathname.includes('privacy') ||
      window.location.pathname.includes('terms') ||
      window.location.pathname.includes('cookie-policy') ||
      window.location.pathname.includes('policy');

    // Check if user has made any consent choice (not in default state)
    // hasMadeChoice is true if any cookie type has been explicitly set to true
    // or if all optional cookies have been explicitly set to false (reject all)
    // Check if user has made any consent choice (not in default state)
    // hasMadeChoice is true if any cookie type has been explicitly set to true
    // or if all optional cookies have been explicitly set to false (reject all)
    const hasMadeChoice =
      consent.analytics === true ||
      consent.marketing === true ||
      consent.functional === true ||
      (consent.analytics === false &&
        consent.marketing === false &&
        consent.functional === false);

    // Show if no explicit consent has been given and not on legal pages
    // Only show if user hasn't made a choice yet
    if (!hasMadeChoice && !isLegalPage) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [consent]);

  const handleAcceptAll = () => {
    setConsent({
      analytics: true,
      marketing: true,
      functional: true,
    });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    setConsent({
      analytics: false,
      marketing: false,
      functional: false,
    });
    setIsVisible(false);
  };

  const handleAcceptSelection = () => {
    // Only necessary cookies are always enabled
    setIsVisible(false);
  };

  const handleClose = () => {
    // This will keep the current consent state (which defaults to only necessary)
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-2000',
        'bg-[#281909] text-[#FDF8F0]', // Bistre background with Floral White text (color role reversal)
        'border-t-4 border-[#CD7E0D]' // Bronze accent border
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
            <p className="text-sm md:text-base mb-4">
              We use cookies to improve your experience, analyze traffic, and
              for marketing purposes. You can choose which cookies to allow.
              Read our{' '}
              <a
                href="/privacy-policy"
                className="underline hover:text-[#CD7E0D]"
              >
                Privacy Policy
              </a>{' '}
              for more information.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="necessary"
                  checked={consent.necessary}
                  disabled
                  className="mr-2"
                />
                <label htmlFor="necessary" className="text-sm">
                  Necessary (always required)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={consent.analytics}
                  onChange={e => setConsent({ analytics: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="analytics" className="text-sm">
                  Analytics
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={consent.marketing}
                  onChange={e => setConsent({ marketing: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="marketing" className="text-sm">
                  Marketing
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="functional"
                  checked={consent.functional}
                  onChange={e => setConsent({ functional: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="functional" className="text-sm">
                  Functional
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 md:items-center">
            <Button
              onClick={handleAcceptAll}
              className="bg-[#CD7E0D] hover:bg-[#225217] text-[#281909]"
            >
              Accept All
            </Button>
            <Button
              onClick={handleAcceptSelection}
              variant="outline"
              className="border-[#FDF8F0] text-[#FDF8F0] hover:bg-[#FDF8F0] hover:text-[#281909]"
            >
              Accept Selection
            </Button>
            <Button
              onClick={handleRejectAll}
              variant="outline"
              className="border-[#FDF8F0] text-[#FDF8F0] hover:bg-[#FDF8F0] hover:text-[#281909]"
            >
              Reject All
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="ml-2 md:ml-0 text-[#FDF8F0] hover:bg-[#225217]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-[#FDF8F0]/80">
          <p>
            Your privacy is important to us. You can change your cookie
            preferences at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
