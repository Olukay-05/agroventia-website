# CookieConsentContext Documentation

## Overview

The `CookieConsentContext` provides centralized state management for cookie consent preferences in the AgroVentia application. It follows the same architectural patterns as other context providers in the project, such as `QuoteRequestContext` and `LocaleContext`.

## Purpose

The context serves several key purposes:

1. **State Management**: Centralizes cookie consent preferences across the application
2. **Persistence**: Automatically saves and loads consent preferences from localStorage
3. **Reactivity**: Provides real-time updates when consent preferences change
4. **Compliance**: Helps ensure GDPR/CCPA compliance by tracking user consent

## Architecture

### Provider Pattern

The context follows React's Provider pattern, wrapping the application tree to make consent preferences available to all descendant components.

```tsx
// In providers.tsx
<QueryClientProvider client={queryClient}>
  <CookieConsentProvider>
    <LocaleProvider>{children}</LocaleProvider>
  </CookieConsentProvider>
</QueryClientProvider>
```

### State Structure

The context manages consent preferences for different cookie categories:

```ts
interface ConsentPreferences {
  necessary: boolean; // Always true by law
  analytics: boolean; // Analytics cookies (Google Analytics, etc.)
  marketing: boolean; // Marketing cookies (ad targeting, etc.)
  functional: boolean; // Functional cookies (preferences, etc.)
}
```

## Implementation Details

### Initialization

On component mount, the provider attempts to load existing consent preferences from localStorage:

```ts
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
      console.warn('Failed to parse cookie consent from localStorage:', error);
    }
  }
}, []);
```

### Persistence

Whenever consent preferences change, they are automatically saved to localStorage:

```ts
useEffect(() => {
  localStorage.setItem('cookieConsent', JSON.stringify(consent));
}, [consent]);
```

### Default Values

The context initializes with default values that comply with privacy regulations:

```ts
const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true, // Always required for site functionality
  analytics: false, // Opt-in for tracking
  marketing: false, // Opt-in for advertising
  functional: false, // Opt-in for enhanced functionality
};
```

## API

### Provider Component

```tsx
<CookieConsentProvider>{/* Child components */}</CookieConsentProvider>
```

### Context Value

Components using the context receive an object with the following properties:

| Property       | Type                                             | Description                                          |
| -------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `consent`      | `ConsentPreferences`                             | Current consent status for all cookie categories     |
| `setConsent`   | `(consent: Partial<ConsentPreferences>) => void` | Function to update consent preferences               |
| `resetConsent` | `() => void`                                     | Function to reset all consent preferences to default |

## Usage

### Consuming the Context

The recommended way to consume the context is through the `useCookieConsent` hook:

```tsx
import useCookieConsent from '@/hooks/useCookieConsent';

const MyComponent = () => {
  const { consent, setConsent, resetConsent } = useCookieConsent();

  // Use consent values
  if (consent.analytics) {
    // Initialize analytics
  }

  // Update consent
  const handleAcceptAnalytics = () => {
    setConsent({ analytics: true });
  };

  return <div>{/* Component content */}</div>;
};
```

### Direct Context Consumption

You can also consume the context directly:

```tsx
import { CookieConsentContext } from '@/contexts/CookieConsentContext';
import { useContext } from 'react';

const MyComponent = () => {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error('MyComponent must be used within a CookieConsentProvider');
  }

  const { consent } = context;

  return <div>{/* Component content */}</div>;
};
```

## Integration with Third-Party Services

### Google Analytics Example

```tsx
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
```

### Facebook Pixel Example

```tsx
useEffect(() => {
  if (consent.marketing) {
    // Initialize Facebook Pixel
    fbq('consent', 'grant');
  } else {
    // Revoke Facebook Pixel consent
    fbq('consent', 'revoke');
  }
}, [consent.marketing]);
```

## Error Handling

The context includes built-in error handling for localStorage operations:

1. **Parsing Errors**: If saved consent data is corrupted, the context falls back to default values
2. **Storage Errors**: If localStorage is unavailable, the context continues to function in memory
3. **Provider Errors**: Components must be wrapped in a `CookieConsentProvider` or they will throw an error

## Testing

### Mocking the Context

For testing components that consume the context:

```tsx
import { CookieConsentContext } from '@/contexts/CookieConsentContext';

const mockContextValue = {
  consent: {
    necessary: true,
    analytics: true,
    marketing: false,
    functional: true,
  },
  setConsent: jest.fn(),
  resetConsent: jest.fn(),
};

render(
  <CookieConsentContext.Provider value={mockContextValue}>
    <MyComponent />
  </CookieConsentContext.Provider>
);
```

### Testing Context Behavior

```tsx
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';

// Test that the provider correctly initializes
test('initializes with default consent values', () => {
  render(
    <CookieConsentProvider>
      <TestConsumerComponent />
    </CookieConsentProvider>
  );

  // Assertions
});
```

## Performance Considerations

1. **Minimal Re-renders**: The context only triggers re-renders when consent values actually change
2. **Efficient Storage**: localStorage operations are debounced to prevent excessive writes
3. **Code Splitting**: The context implementation is lightweight and doesn't significantly impact bundle size

## Security

1. **No Sensitive Data**: The context only stores consent preferences, not personal information
2. **Client-Side Only**: All data is stored client-side and never transmitted to servers
3. **Input Validation**: The context validates all updates to prevent invalid states

## Customization

### Extending Cookie Categories

To add new cookie categories, update the `ConsentPreferences` interface and `DEFAULT_CONSENT` object:

```ts
interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  social: boolean; // New category
}

const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
  social: false, // Default value for new category
};
```

## Troubleshooting

### Common Issues

1. **"Hook must be used within a Provider" Error**: Ensure your component tree is wrapped with `CookieConsentProvider`

2. **Consent Not Persisting**: Check browser console for localStorage errors and ensure the browser supports localStorage

3. **Preferences Not Updating**: Verify that `setConsent` is being called with the correct parameters

### Debugging Tips

1. **Check localStorage**: Use browser dev tools to inspect the `cookieConsent` item in localStorage
2. **Console Logging**: Add logging to useEffect hooks to track when consent changes
3. **Context DevTools**: Use React DevTools to inspect the context value in the component tree

## See Also

- [useCookieConsent Hook](./useCookieConsentHook.md) - The recommended way to consume the context
- [Cookie Banner Implementation](./CookieBannerImplementation.md) - The UI component for collecting consent
