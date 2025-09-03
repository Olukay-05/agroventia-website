# QuoteRequestContext Documentation

## Overview

The `QuoteRequestContext` is a React context that enables sharing of quote request data between components in the application. It allows passing product information from the Products section to the Contact section when a user requests a quote.

## Purpose

The context solves the problem of sharing state between distant components in the React component tree without having to pass props through multiple levels.

## Implementation

### Provider Component

The `QuoteRequestProvider` wraps the components that need access to the quote request state:

```typescript
<QuoteRequestProvider>
  <ProductsSection />
  <ContactSection />
</QuoteRequestProvider>
```

### Context Interface

```typescript
interface QuoteRequestContextType {
  requestedProduct: string | null;
  setRequestedProduct: (product: string | null) => void;
}
```

- `requestedProduct`: Holds the name of the product for which a quote has been requested, or null if no request is pending
- `setRequestedProduct`: Function to update the requested product state

## Usage

### 1. Setting up the Provider

In the main application component (e.g., `page.tsx`):

```typescript
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';

export default function HomePage() {
  return (
    <main>
      <QuoteRequestProvider>
        <ProductsSection />
        <ContactSection />
      </QuoteRequestProvider>
    </main>
  );
}
```

### 2. Consuming the Context

In components that need to access or modify the quote request state:

```typescript
import { useQuoteRequest } from '@/contexts/QuoteRequestContext';

const MyComponent = () => {
  const { requestedProduct, setRequestedProduct } = useQuoteRequest();

  // Use the values as needed
  const handleRequest = () => {
    setRequestedProduct('Premium Fertilizer');
  };

  return (
    <div>
      {requestedProduct && <p>Quote requested for: {requestedProduct}</p>}
      <button onClick={handleRequest}>Request Quote</button>
    </div>
  );
};
```

## API Reference

### `QuoteRequestProvider`

A React component that provides the quote request context to its children.

**Props:**

- `children`: React nodes that will have access to the context

### `useQuoteRequest()`

A custom hook that returns the current quote request context value.

**Returns:**

- `requestedProduct` (string | null): The name of the requested product
- `setRequestedProduct` (function): Function to update the requested product

**Throws:**

- Error if used outside of a `QuoteRequestProvider`

## Example Implementation

```typescript
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuoteRequestContextType {
  requestedProduct: string | null;
  setRequestedProduct: (product: string | null) => void;
}

const QuoteRequestContext = createContext<QuoteRequestContextType | undefined>(undefined);

export const QuoteRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requestedProduct, setRequestedProduct] = useState<string | null>(null);

  return (
    <QuoteRequestContext.Provider value={{ requestedProduct, setRequestedProduct }}>
      {children}
    </QuoteRequestContext.Provider>
  );
};

export const useQuoteRequest = () => {
  const context = useContext(QuoteRequestContext);
  if (context === undefined) {
    throw new Error('useQuoteRequest must be used within a QuoteRequestProvider');
  }
  return context;
};
```

## Best Practices

1. **Provider Placement**: Place the provider at the appropriate level in the component tree to ensure all components that need access are children
2. **Error Handling**: Always handle the case where `useQuoteRequest` is used outside of a provider
3. **State Management**: Keep the context state minimal and focused on its specific purpose
4. **Performance**: Use `useCallback` or `useMemo` if complex computations are involved in context values

## Related Components

- `useScrollToSection`: Often used in conjunction with this context for navigation
- `ProductsSection`: Sets the requested product
- `ContactSection`: Consumes the requested product to pre-fill the form
