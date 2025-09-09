'use client';

import Script from 'next/script';

const GoogleAnalyticsScript = () => {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
