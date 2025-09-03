'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface StatCardProps {
  number: string;
  label: string;
  icon: LucideIcon;
  variant?: 'light' | 'dark';
}

const StatCard: React.FC<StatCardProps> = ({
  number,
  label,
  icon: Icon,
  variant = 'light',
}) => {
  return (
    <GlassCard
      variant={variant === 'dark' ? 'dark' : 'light'}
      className="p-6 text-center hover:scale-105 transition-all duration-300"
    >
      <Icon
        className={`w-8 h-8 mx-auto mb-3 ${
          variant === 'dark'
            ? 'text-agro-accent-amber-400'
            : 'text-agro-primary'
        }`}
      />
      <div
        className={`text-3xl font-bold mb-2 ${
          variant === 'dark' ? 'text-white' : 'text-agro-neutral-900'
        }`}
      >
        {number}
      </div>
      <div
        className={`text-sm font-medium ${
          variant === 'dark' ? 'text-white/80' : 'text-gray-600'
        }`}
      >
        {label}
      </div>
    </GlassCard>
  );
};

export default StatCard;
