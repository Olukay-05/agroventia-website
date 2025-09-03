# Quote Request Functionality Documentation

## Overview

This document explains the implementation of the quote request functionality that allows users to request quotes for products directly from the product cards. When a user clicks the "Request Quote" button on a product card, they are automatically scrolled to the contact form with the product information pre-filled.

## Architecture

The functionality is implemented using React Context API to share state between components and a custom hook for smooth scrolling. The implementation consists of the following components:

1. **QuoteRequestContext** - Manages the state of the requested product
2. **useScrollToSection** - Provides smooth scrolling to page sections
3. **ProductsSection** - Handles the "Request Quote" button clicks
4. **ContactSection** - Pre-fills the form when a product is requested

## Implementation Details

### 1. Quote Request Context

The `QuoteRequestContext` is a React context that manages the state of the requested product:

```typescript
interface QuoteRequestContextType {
  requestedProduct: string | null;
  setRequestedProduct: (product: string | null) => void;
}
```

- `requestedProduct`: Stores the name of the product for which a quote is requested
- `setRequestedProduct`: Function to update the requested product state

### 2. Scroll To Section Hook

The `useScrollToSection` hook provides a smooth scrolling functionality:

```typescript
const { scrollToSection } = useScrollToSection();
```

- Scrolls smoothly to any section identified by its ID
- Accepts an optional offset parameter for fine-tuning the scroll position

### 3. Products Section Integration

In the `ProductsSection` component:

1. The hook and context are imported:

   ```typescript
   import useScrollToSection from '@/hooks/useScrollToSection';
   import { useQuoteRequest } from '@/contexts/QuoteRequestContext';
   ```

2. The hook is initialized:

   ```typescript
   const { scrollToSection } = useScrollToSection();
   const { setRequestedProduct } = useQuoteRequest();
   ```

3. The "Request Quote" button click handler:
   ```typescript
   const handleRequestQuote = (productTitle: string) => {
     // Set the requested product in context
     setRequestedProduct(productTitle);

     // Scroll to contact section
     scrollToSection('contact', 100);
   };
   ```

### 4. Contact Section Integration

In the `ContactSection` component:

1. The context is imported:

   ```typescript
   import { useQuoteRequest } from '@/contexts/QuoteRequestContext';
   ```

2. The context is used:

   ```typescript
   const { requestedProduct, setRequestedProduct } = useQuoteRequest();
   ```

3. A useEffect hook listens for changes to the requested product:
   ```typescript
   useEffect(() => {
     if (requestedProduct) {
       setFormData(prev => ({
         ...prev,
         enquiryType: 'quote',
         message: `I'm interested in ${requestedProduct}. Please provide a quote.\n\n`,
       }));

       // Clear the requested product after setting the form
       setRequestedProduct(null);
     }
   }, [requestedProduct, setRequestedProduct]);
   ```

## User Flow

1. User browses products in the Products section
2. User clicks "Request Quote" button on a product card
3. The product name is stored in the context
4. The page smoothly scrolls to the Contact section
5. The contact form is automatically updated with:
   - Enquiry type set to "Request a Quote"
   - Message field pre-filled with product information
6. User completes and submits the form

## Benefits

- **Seamless Experience**: Users can quickly request quotes without manually filling product information
- **Reduced Friction**: Eliminates the need for users to remember or retype product names
- **Increased Conversions**: Makes it easier for users to request quotes, potentially increasing conversion rates
- **Smooth Navigation**: Provides smooth scrolling to the contact form for better user experience

## Technical Considerations

1. **State Management**: Uses React Context API for global state management
2. **Performance**: Implements efficient scrolling with offset positioning
3. **Accessibility**: Maintains standard form behavior while enhancing user experience
4. **Error Handling**: Gracefully handles cases where context is not available

## Future Enhancements

1. **Product Details**: Pass additional product details (SKU, category, etc.) to the contact form
2. **Analytics**: Track quote request events for analytics purposes
3. **Validation**: Add validation to ensure required product information is available
4. **Persistence**: Store quote requests in localStorage for persistence across sessions
