# useCookieConsent Hook Documentation

## Overview

The `useCookieConsent` hook provides a simple way to access and manage cookie consent preferences throughout your application. It's built on top of the `CookieConsentContext` and follows the same patterns as other hooks in the AgroVentia project.

## Installation

The hook is automatically available after implementing the cookie consent feature. No additional installation is required.

## Usage

### Basic Usage

```tsx
import useCookieConsent from '@/hooks/useCookieConsent';

const MyComponent = () => {
  const { consent } = useCookieConsent();

  // Check if analytics cookies are allowed
  if (consent.analytics) {
    // Initialize analytics service
  }

  return <div>{/* Component content */}</div>;
};
```

### Updating Consent Preferences

```tsx
import useCookieConsent from '@/hooks/useCookieConsent';

const ConsentManager = () => {
  const { consent, setConsent } = useCookieConsent();

  const handleAnalyticsToggle = (enabled: boolean) => {
    setConsent({ analytics: enabled });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={consent.analytics}
          onChange={e => handleAnalyticsToggle(e.target.checked)}
        />
        Enable Analytics Cookies
      </label>
    </div>
  );
};
```

### Resetting Consent

```tsx
import useCookieConsent from '@/hooks/useCookieConsent';

const ConsentReset = () => {
  const { resetConsent } = useCookieConsent();

  const handleReset = () => {
    resetConsent();
    // Optionally refresh the page to ensure all services respect the reset
    window.location.reload();
  };

  return <button onClick={handleReset}>Reset Cookie Preferences</button>;
};
```

## API Reference

### Return Value

The hook returns an object with the following properties:

| Property       | Type                                             | Description                                          |
| -------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `consent`      | `ConsentPreferences`                             | Current consent status for all cookie categories     |
| `setConsent`   | `(consent: Partial<ConsentPreferences>) => void` | Function to update consent preferences               |
| `resetConsent` | `() => void`                                     | Function to reset all consent preferences to default |

### ConsentPreferences Interface

```ts
interface ConsentPreferences {
  necessary: boolean; // Always true by law
  analytics: boolean; // Analytics cookies (Google Analytics, etc.)
  marketing: boolean; // Marketing cookies (ad targeting, etc.)
  functional: boolean; // Functional cookies (preferences, etc.)
}
```

## Integration Examples

### Conditional Component Rendering

```tsx
import useCookieConsent from '@/hooks/useCookieConsent';

const AnalyticsDashboard = () => {
  const { consent } = useCookieConsent();

  // Don't render if analytics cookies aren't allowed
  if (!consent.analytics) {
    return null;
  }

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      {/* Analytics components */}
    </div>
  );
};
```

### Third-Party Service Integration

```tsx
import useCookieConsent from '@/hooks/useCookieConsent';
import { useEffect } from 'react';

const GoogleAnalyticsIntegration = () => {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      if (consent.analytics) {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      } else {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }
  }, [consent.analytics]);

  return null; // This component doesn't render anything
};
```

## Best Practices

1. **Always Check Consent**: Before initializing any third-party services, check the appropriate consent status.

2. **Handle Updates**: Use `useEffect` to respond to consent changes and update services accordingly.

3. **Respect User Choices**: Never enable cookies that the user has explicitly disabled.

4. **Provide Controls**: Always give users a way to update their preferences, typically through a settings page.

5. **Default to Privacy**: When in doubt, default to the most private option (disabled cookies).

## Error Handling

The hook will throw an error if used outside of a `CookieConsentProvider`. Make sure your component tree is wrapped with the provider:

```tsx
// This will cause an error if CookieConsentProvider is not in the tree
const App = () => (
  <CookieConsentProvider>
    <MyComponent />
  </CookieConsentProvider>
);
```

## Testing

When testing components that use the hook, you can mock the context value:

```tsx
import { CookieConsentContext } from '@/contexts/CookieConsentContext';

const mockConsent = {
  consent: {
    necessary: true,
    analytics: true,
    marketing: false,
    functional: true,
  },
  setConsent: jest.fn(),
  resetConsent: jest.fn(),
};

// In your test
render(
  <CookieConsentContext.Provider value={mockConsent}>
    <MyComponent />
  </CookieConsentContext.Provider>
);
```

## See Also

- [CookieConsentContext](./CookieConsentContext.md) - The underlying context implementation
- [CookieBanner](./CookieBannerImplementation.md) - The UI component for collecting consent
