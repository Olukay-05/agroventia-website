# Cookie Banner Implementation Strategy

## Overview

This document outlines the implementation strategy for adding a cookie consent banner to the AgroVentia Inc homepage. The implementation follows Next.js best practices and aligns with the project's existing architecture, design system, and coding standards.

## Related Documentation

- [CookieConsentContext](./CookieConsentContext.md) - Detailed documentation for the context implementation
- [useCookieConsent Hook](./useCookieConsentHook.md) - Documentation for the custom hook
- [Cookie Banner Component](./CookieBannerImplementation.md) - This document
- [Legal Pages Implementation](./LegalPagesImplementation.md) - Documentation for legal pages and footer integration

This document outlines the implementation strategy for adding a cookie consent banner to the AgroVentia Inc homepage. The implementation follows Next.js best practices and aligns with the project's existing architecture, design system, and coding standards.

## Implementation Goals

1. **Compliance**: Ensure GDPR/CCPA compliance for cookie consent management
2. **User Experience**: Provide a non-intrusive yet clear consent mechanism
3. **Integration**: Seamlessly integrate with the existing Next.js architecture
4. **Consistency**: Follow the project's design system and coding patterns
5. **Performance**: Minimize impact on page load and rendering performance

## Technical Architecture

### Component Structure

The implementation will consist of the following components:

1. **CookieConsentContext** - State management for cookie preferences
2. **CookieBanner** - UI component for the consent banner
3. **useCookieConsent** - Custom hook for accessing consent status
4. **CookieSettingsModal** - Optional detailed settings panel

### File Structure

```
src/
├── contexts/
│   └── CookieConsentContext.tsx
├── components/
│   └── common/
│       └── CookieBanner.tsx
├── hooks/
│   └── useCookieConsent.ts
└── app/
    └── layout.tsx (integration point)
```

## Implementation Details

### 1. CookieConsentContext

#### Purpose

Centralized state management for cookie consent preferences, following the same pattern as QuoteRequestContext.

#### Features

- Store user preferences in localStorage
- Provide consent status to all components
- Handle different cookie categories (necessary, analytics, marketing, functional)
- Server-side rendering compatibility
- Track whether user has explicitly made a consent choice

#### Interface

```typescript
interface CookieConsentContextType {
  consent: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
  };
  setConsent: (consent: ConsentPreferences) => void;
  resetConsent: () => void;
  hasMadeChoice: boolean; // New: Track if user has explicitly made a choice
}

interface ConsentPreferences {
  necessary?: boolean;
  analytics?: boolean;
  marketing?: boolean;
  functional?: boolean;
}
```

### 2. CookieBanner Component

#### Purpose

Visual component that presents the consent options to users.

#### Features

- Responsive design following project's Tailwind CSS patterns
- Brand-consistent styling with color role reversal
- Animation timing synchronized with existing UI elements (2000ms transitions)
- Accessible with proper ARIA attributes
- Conditional rendering based on consent status
- Only shows when user hasn't explicitly made a choice

#### Design Requirements

- Position at bottom of viewport
- Use primary brand colors (#225217, #CD7E0D) with proper contrast
- Implement color role reversal (text becomes background and vice versa)
- Smooth animations with 2000ms timing to match existing transitions
- Mobile-responsive layout

### 3. useCookieConsent Hook

#### Purpose

Simplified access to cookie consent status for components.

#### Features

- Easy consumption of consent preferences
- Type-safe access to consent status
- Reactivity to consent changes
- Access to hasMadeChoice flag

### 4. Integration Points

#### Providers Integration

The CookieConsentProvider will be added to the existing Providers component:

```tsx
// src/app/providers.tsx
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <CookieConsentProvider>
          <QuoteRequestProvider>{children}</QuoteRequestProvider>
        </CookieConsentProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
```

#### Layout Integration

The CookieBanner component will be added to the root layout:

```tsx
// src/app/layout.tsx
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
      </body>
    </html>
  );
}
```

## Cookie Categories

### Necessary Cookies (Always Enabled)

- Authentication cookies
- Consent preference cookies
- Load balancing cookies
- Security cookies

### Analytics Cookies

- Google Analytics
- Performance monitoring
- Usage statistics

### Marketing Cookies

- Ad targeting
- Social media tracking
- Retargeting pixels

### Functional Cookies

- Language preferences
- Region settings
- Video preferences

## Storage Strategy

### Client-Side Storage

- **localStorage**: Persistent storage of consent preferences
- **sessionStorage**: Temporary session data (if needed)

### Server-Side Storage

- **Next.js cookies API**: For server-side cookie handling in Route Handlers
- Format:

```json
{
  "necessary": true,
  "analytics": false,
  "marketing": false,
  "functional": false,
  "timestamp": "2025-09-02T10:00:00Z"
}
```

## UI/UX Design

### Visual Design

- Follow existing brand color palette:
  - Primary: Cal Poly Green (#225217)
  - Secondary: Bronze (#CD7E0D)
  - Background: Floral White (#FDF8F0)
  - Text: Bistre (#281909)
- Implement color role reversal as per user preference
- Use Tailwind CSS for styling with existing utility classes

### Animation

- Fade-in animation with 2000ms timing to match existing transitions
- Smooth transitions for all interactive elements
- Subtle entrance animation for the banner

### Responsive Design

- Mobile-first approach
- Full-width on mobile devices
- Centered card layout on desktop
- Appropriate spacing and sizing for all viewports

## Compliance Considerations

### GDPR Requirements

- Clear explanation of cookie usage
- Explicit opt-in for non-essential cookies
- Easy access to cookie settings
- Clear withdrawal mechanism

### CCPA Requirements

- "Do Not Sell My Personal Information" link
- Clear opt-out mechanism
- Notice of financial incentive (if applicable)

## Performance Optimization

### Loading Strategy

- Code-split the cookie banner component
- Lazy-load non-critical functionality
- Minimize bundle impact

### Rendering Optimization

- Client-side only rendering to prevent hydration issues
- Conditional rendering based on consent status
- Efficient state updates

## Testing Strategy

### Unit Tests

- Test CookieConsentContext functionality
- Test useCookieConsent hook
- Test CookieBanner component rendering
- Test consent persistence
- Test hasMadeChoice flag behavior

### Integration Tests

- Test localStorage persistence
- Test server-side cookie handling
- Test integration with existing context providers
- Test banner visibility logic

### Accessibility Tests

- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance
- ARIA attribute correctness

## Deployment Considerations

### Environment Configuration

- No special environment variables required
- Works with existing Next.js configuration
- No additional build steps

### Rollout Strategy

- Feature flag for gradual rollout (optional)
- Monitoring for consent rates
- Error tracking for consent management

## Future Enhancements

### Potential Improvements

- Cookie policy link integration
- Detailed cookie information panel
- Consent statistics dashboard
- Automatic cookie scanning and categorization

### Integration Opportunities

- Analytics platform integration (Google Analytics, etc.)
- Marketing platform integration (Facebook Pixel, etc.)
- Performance monitoring integration

## Implementation Timeline

### Phase 1: Core Implementation (2 days)

- Create CookieConsentContext
- Implement useCookieConsent hook
- Create CookieBanner component
- Basic styling and integration

### Phase 2: Advanced Features (1 day)

- Detailed settings modal
- Server-side cookie handling
- Enhanced animations

### Phase 3: Testing and Refinement (1 day)

- Unit tests
- Integration tests
- Accessibility testing
- Performance optimization

## Dependencies

### Required Dependencies

- None (uses existing project dependencies)

### Optional Enhancements

- `js-cookie` for advanced cookie handling (if needed)

## References

- Next.js cookies API documentation
- Existing project context implementations (QuoteRequestContext, LocaleContext)
- Tailwind CSS styling patterns
- WAI-ARIA accessibility guidelines

## Integration with Third-Party Services

### Google Analytics Integration

To enable Google Analytics tracking:

1. Add your GA4 Measurement ID to `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. The GoogleAnalyticsScript component will automatically load the tracking script

3. The GoogleAnalyticsIntegration component will handle consent-based tracking

4. Verify implementation by checking Google Analytics Realtime reports

## Bug Fixes and Improvements

### Fixed Cookie Banner Visibility Issue

**Problem**: The cookie banner was not showing up for new users because the logic incorrectly identified users who had explicitly rejected all cookies as users who had not made any choices yet.

**Solution**: Added a `hasMadeChoice` flag to the CookieConsentContext to explicitly track whether a user has made an explicit consent choice. The CookieBanner now only shows when this flag is false, ensuring that:

1. New users who haven't made any choices see the banner
2. Users who have explicitly accepted or rejected cookies do not see the banner again
3. Users who have closed the banner without making a choice will see it again on subsequent visits

**Implementation Details**:

- Added `hasMadeChoice` state to CookieConsentContext
- Set `hasMadeChoice` to true when `setConsent` is called
- Set `hasMadeChoice` to false when `resetConsent` is called
- Updated CookieBanner to use `hasMadeChoice` instead of trying to infer user choice from consent values
- Preserved existing behavior for legal pages (banner never shows on privacy, terms, cookie-policy, or policy pages)
