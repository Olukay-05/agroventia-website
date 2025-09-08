# Google Analytics Implementation User Guideline

## Overview

This guideline provides step-by-step instructions for implementing Google Analytics in the AgroVentia website project once the client has activated their Google Analytics account and provided the necessary credentials.

## Prerequisites

- Client has activated Google Analytics account
- Client has provided GA4 Measurement ID (e.g., G-XXXXXXXXXX)
- Development environment is set up and running

## Implementation Steps

### 1. Gather Required Information

Collect the following information from the client:

- [ ] GA4 Measurement ID (format: G-XXXXXXXXXX)
- [ ] Google Tag Manager ID (if applicable, format: GTM-XXXXXXX)
- [ ] Any specific tracking requirements or custom events

### 2. Configure Environment Variables

Add the Google Analytics credentials to the project's environment configuration:

1. Open the `.env.local` file in the project root
2. Add the following line with the provided Measurement ID:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Save the file

### 3. Verify Google Analytics Integration Component

Check that the [GoogleAnalyticsIntegration.tsx](file:///c:/Users/user/Desktop/work/Projects/Clients/AgroVentia%20Inc/AVI-inc/agroventia-homepage/src/components/common/GoogleAnalyticsIntegration.tsx) component exists and is properly configured:

```typescript
// src/components/common/GoogleAnalyticsIntegration.tsx
'use client';

import React, { useEffect } from 'react';
import useCookieConsent from '@/hooks/useCookieConsent';

// Define gtag types
type GTagEvent = 'config' | 'event' | 'consent' | 'get' | 'set';
type GTagCommand =
  | [GTagEvent]
  | [GTagEvent, unknown]
  | [GTagEvent, unknown, unknown];

declare global {
  interface Window {
    gtag: (...args: GTagCommand) => void;
  }
}

const GoogleAnalyticsIntegration: React.FC = () => {
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Check if gtag is available and Measurement ID is configured
    if (
      typeof window !== 'undefined' &&
      typeof window.gtag !== 'undefined' &&
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ) {
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
```

### 4. Create Google Analytics Script Component

Create a new component to handle the Google Analytics script loading:

1. Create a new file: `src/components/common/GoogleAnalyticsScript.tsx`
2. Add the following code:

```typescript
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
```

### 5. Integrate Google Analytics Script in Layout

Update the root layout to include the Google Analytics script:

1. Open `src/app/layout.tsx`
2. Import the GoogleAnalyticsScript component:

```typescript
import GoogleAnalyticsScript from '@/components/common/GoogleAnalyticsScript';
```

3. Add the component before the closing `</html>` tag:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
        <GoogleAnalyticsScript />
      </body>
    </html>
  );
}
```

### 6. Test Google Analytics Integration

Perform the following tests to ensure proper implementation:

1. **Script Loading Test**:
   - Start the development server: `npm run dev`
   - Open browser developer tools
   - Check that the Google Analytics script loads without errors

2. **Consent-Based Tracking Test**:
   - Visit the website as a new user
   - Verify the cookie banner appears
   - Accept analytics cookies
   - Confirm that tracking is enabled in the console
   - Revoke analytics consent
   - Confirm that tracking is disabled

3. **Page View Tracking Test**:
   - With analytics consent granted
   - Navigate to different pages
   - Verify page views are tracked in Google Analytics Realtime reports

4. **Cookie Persistence Test**:
   - Accept analytics cookies
   - Refresh the page
   - Verify that consent status is maintained
   - Close and reopen browser
   - Verify that consent status persists

### 7. Update Documentation

Update the project documentation to include the Google Analytics setup:

1. Open `docs/CookieBannerImplementation.md`
2. Add a new section under "Integration with Third-Party Services":

```markdown
### Google Analytics Integration

To enable Google Analytics tracking:

1. Add your GA4 Measurement ID to `.env.local`:
```

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

```

2. The GoogleAnalyticsScript component will automatically load the tracking script

3. The GoogleAnalyticsIntegration component will handle consent-based tracking

4. Verify implementation by checking Google Analytics Realtime reports
```

### 8. Verify Compliance

Ensure that the implementation meets all compliance requirements:

1. **Consent Management**:
   - [ ] Analytics cookies are only set when user explicitly consents
   - [ ] Revoking consent properly disables tracking
   - [ ] Cookie banner appears for users who haven't made a choice
   - [ ] Cookie policy page accurately reflects Google Analytics usage

2. **Data Handling**:
   - [ ] No personal data is sent to Google Analytics without consent
   - [ ] IP anonymization is enabled
   - [ ] No sensitive data is tracked

3. **User Control**:
   - [ ] Users can easily change their consent preferences
   - [ ] Consent status is clearly displayed
   - [ ] Users can opt-out at any time

### 9. Monitor Implementation

After deployment, monitor the implementation:

1. **Realtime Reports**:
   - Check Google Analytics Realtime reports to verify tracking
   - Monitor for any console errors related to gtag

2. **Behavior Reports**:
   - Review page view data after 24 hours
   - Verify that all pages are being tracked correctly

3. **Technical Monitoring**:
   - Monitor for any 404 errors related to Google Analytics scripts
   - Check browser console for JavaScript errors

## Troubleshooting

### Common Issues and Solutions

1. **Google Analytics Script Not Loading**:
   - Verify that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correctly set in `.env.local`
   - Check browser developer tools for any JavaScript errors
   - Ensure the GoogleAnalyticsScript component is properly integrated in the layout

2. **Tracking Not Working**:
   - Verify that analytics consent has been granted
   - Check browser developer tools Network tab for requests to google-analytics.com
   - Confirm that no ad blockers are interfering with tracking

3. **Consent Not Persisting**:
   - Verify that both localStorage and cookies are functioning properly
   - Check browser settings for cookie restrictions
   - Test in different browsers to isolate the issue

## Best Practices

1. **Privacy First**:
   - Always default to denied consent
   - Only enable tracking after explicit user consent
   - Regularly review and update privacy policies

2. **Performance Optimization**:
   - Use `strategy="afterInteractive"` for Google Analytics scripts
   - Avoid blocking the main thread with analytics code
   - Monitor page load times after implementation

3. **Testing**:
   - Test implementation in both development and production environments
   - Verify functionality across different browsers
   - Regularly check that tracking is working as expected

4. **Documentation**:
   - Keep documentation up to date with any changes
   - Document any custom tracking events
   - Maintain a changelog for analytics-related updates

## Next Steps

Once implementation is complete and verified:

1. [ ] Notify the client that Google Analytics is implemented
2. [ ] Provide the client with access to Google Analytics reports
3. [ ] Schedule a follow-up to review initial tracking data
4. [ ] Document any custom tracking requirements for future implementation

## Support

For any issues or questions regarding the Google Analytics implementation:

1. Check the project documentation
2. Review the implementation steps in this guideline
3. Contact the development team for technical support
4. Refer to Google Analytics documentation for platform-specific issues
