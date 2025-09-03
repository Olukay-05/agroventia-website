// CookieBanner.example.tsx
// Example of how to use the cookie consent functionality in your components

import React from 'react';
import useCookieConsent from '@/hooks/useCookieConsent';

// Example component that conditionally renders content based on cookie consent
const AnalyticsComponent: React.FC = () => {
  const { consent } = useCookieConsent();

  // Only render analytics content if user has given consent
  if (!consent.analytics) {
    return null;
  }

  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h3>Analytics Dashboard</h3>
      <p>This content is only visible when analytics cookies are accepted.</p>
      {/* Your analytics components would go here */}
    </div>
  );
};

// Example component that shows consent status
const ConsentStatus: React.FC = () => {
  const { consent, setConsent, resetConsent } = useCookieConsent();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3>Cookie Consent Status</h3>
      <ul className="list-disc pl-5 mt-2">
        <li>Necessary: {consent.necessary ? 'Enabled' : 'Disabled'}</li>
        <li>Analytics: {consent.analytics ? 'Enabled' : 'Disabled'}</li>
        <li>Marketing: {consent.marketing ? 'Enabled' : 'Disabled'}</li>
        <li>Functional: {consent.functional ? 'Enabled' : 'Disabled'}</li>
      </ul>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setConsent({ analytics: true })}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Enable Analytics
        </button>
        <button
          onClick={resetConsent}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Reset Consent
        </button>
      </div>
    </div>
  );
};

// Example of how to integrate with third-party services
const ThirdPartyIntegration: React.FC = () => {
  const { consent } = useCookieConsent();

  React.useEffect(() => {
    if (consent.analytics) {
      // Initialize analytics service
      // Example: gtag('consent', 'update', { analytics_storage: 'granted' });
      console.log('Analytics cookies enabled - initializing analytics service');
    } else {
      // Disable analytics service
      // Example: gtag('consent', 'update', { analytics_storage: 'denied' });
      console.log('Analytics cookies disabled - disabling analytics service');
    }
  }, [consent.analytics]);

  return (
    <div className="p-4 bg-yellow-100 rounded-lg">
      <h3>Third-Party Integration</h3>
      <p>Analytics service integration based on consent status.</p>
    </div>
  );
};

export { AnalyticsComponent, ConsentStatus, ThirdPartyIntegration };
