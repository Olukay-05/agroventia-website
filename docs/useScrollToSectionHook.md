# useScrollToSection Hook Documentation

## Overview

The `useScrollToSection` hook provides a simple and reusable way to smoothly scroll to any section of the page by its ID. This hook is particularly useful for single-page applications where navigation between sections is required.

## Installation

The hook is already included in the project. No additional installation is required.

## Usage

### Importing the Hook

```typescript
import useScrollToSection from '@/hooks/useScrollToSection';
```

### Using in a Component

```typescript
import React from 'react';
import useScrollToSection from '@/hooks/useScrollToSection';

const MyComponent = () => {
  const { scrollToSection } = useScrollToSection();

  const handleClick = () => {
    scrollToSection('target-section-id', 100); // 100px offset
  };

  return (
    <button onClick={handleClick}>
      Scroll to Section
    </button>
  );
};

export default MyComponent;
```

## API

### `useScrollToSection()`

Returns an object with the following properties:

#### `scrollToSection(sectionId: string, offset: number)`

Function to scroll to a specific section.

**Parameters:**

- `sectionId` (string): The ID of the target section element
- `offset` (number, optional): Vertical offset in pixels. Defaults to 0.

**Example:**

```typescript
// Scroll to element with id="contact" with 50px offset
scrollToSection('contact', 50);

// Scroll to element with id="about" with no offset
scrollToSection('about');
```

## How It Works

1. The hook uses `document.getElementById()` to find the target element
2. It calculates the target position by getting the element's top position relative to the viewport and adding the current scroll position
3. It applies the optional offset to the final position
4. It uses `window.scrollTo()` with `behavior: 'smooth'` for smooth scrolling

## Browser Support

The hook uses the modern `window.scrollTo()` method with options, which is supported in:

- Chrome 61+
- Firefox 36+
- Safari 14+
- Edge 79+

For older browsers, a polyfill may be required.

## Error Handling

The hook gracefully handles cases where:

- The target element doesn't exist (no error, just does nothing)
- The sectionId parameter is invalid
- The offset parameter is not a number

## Example Implementation

```typescript
'use client';

import { useCallback } from 'react';

export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId: string, offset = 0) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  return { scrollToSection };
};

export default useScrollToSection;
```

## Best Practices

1. **Use Semantic IDs**: Ensure the target sections have meaningful IDs
2. **Consider Accessibility**: Combine with proper anchor links for better accessibility
3. **Test Responsiveness**: Verify scrolling behavior on different screen sizes
4. **Handle Edge Cases**: Consider what should happen if the element is not found

## Related Components

This hook works well with:

- Navigation components
- "Back to top" buttons
- Table of contents
- Anchor link components
