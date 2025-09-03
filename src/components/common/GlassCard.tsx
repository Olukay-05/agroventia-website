'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'premium';
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'light',
  hover = true,
}) => {
  const baseClasses =
    'backdrop-blur-xl border rounded-2xl transition-all duration-300';

  const variantClasses = {
    light: 'glass-card',
    dark: 'glass-card-dark',
    premium: 'card-premium',
  };

  const hoverClasses = hover ? 'hover-lift' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
