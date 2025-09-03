# ServiceFeatureCard Component

## Overview

The ServiceFeatureCard is an interactive React component designed to showcase services with 3D hover effects and smooth animations. It enhances the user experience by providing visual feedback when interacting with service items.

## Features

- 3D tilt effect on hover
- Smooth spring animations
- Interactive icon movement
- Active state highlighting
- Responsive design
- Accessible and semantic HTML

## Installation

The component is already included in the project. No additional installation is required.

## Usage

```tsx
import ServiceFeatureCard from '@/components/ui/ServiceFeatureCard';
import { Handshake } from 'lucide-react';

<ServiceFeatureCard
  title="Agricultural Consulting"
  description="Expert advice and consulting services for modern farming practices."
  icon={<Handshake />}
  index={0}
  isActive={true}
  onClick={() => console.log('Card clicked')}
/>;
```

## Props

| Prop        | Type      | Required | Description                                  |
| ----------- | --------- | -------- | -------------------------------------------- |
| title       | string    | Yes      | The service title                            |
| description | string    | Yes      | The service description                      |
| icon        | ReactNode | Yes      | The icon to display                          |
| index       | number    | Yes      | The index of the card (for animation delays) |
| isActive    | boolean   | No       | Whether the card is in active state          |
| onClick     | function  | No       | Click handler function                       |

## Implementation Details

The component uses Framer Motion for animations and implements:

- 3D tilt effect using `rotateX` and `rotateY`
- Spring physics for smooth animations
- Mouse tracking for interactive icon movement
- Hover states with scale transformations
- Active state styling

## Customization

To customize the appearance, you can modify the Tailwind classes in the component:

- Background colors: `bg-white`, `bg-gradient-to-br`
- Border colors: `border-gray-200`, `border-green-500`
- Text colors: `text-gray-900`, `text-green-700`
- Shadow effects: `shadow-md`, `shadow-lg`

## Example Integration

The ServiceFeatureCard is currently integrated into the ServicesSection component, replacing the previous static card implementation. Each service item now has interactive capabilities with visual feedback.

## Dependencies

- framer-motion: For animations
- lucide-react: For icons (already used throughout the project)
