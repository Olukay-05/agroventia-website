'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface FooterLinkItem {
  label: string;
  href?: string;
  slug?: string;
}

interface FooterLinkSectionProps {
  title: string;
  links: (string | FooterLinkItem)[];
  onLinkClick?: (link: string | FooterLinkItem) => void;
}

const FooterLinkSection: React.FC<FooterLinkSectionProps> = ({
  title,
  links,
  onLinkClick,
}) => {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-[#FDF8F0] relative">
        {title}
        <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[#FDF8F0] to-[#F6F2E7] rounded-full" />
      </h4>

      <nav className="space-y-3" aria-label={title}>
        {links.map((link, index) => {
          const isObject = typeof link === 'object';
          const linkText = isObject ? link.label : link;
          const href = isObject ? link.href : undefined;

          const innerContent = (
            <>
              <span className="text-sm leading-relaxed">{linkText}</span>
              <ChevronRight
                size={14}
                className="
                  opacity-0 group-hover:opacity-100 
                  transform translate-x-[-8px] group-hover:translate-x-0
                  transition-all duration-200 ease-out
                  text-[#FDF8F0]
                "
              />
            </>
          );

          const className = `
            group flex items-center justify-between w-full text-left
            text-[#F6F2E7] hover:text-[#FDF8F0]
            transition-all duration-200 ease-out
            hover:translate-x-1 focus:outline-none focus:underline
          `;

          if (href) {
            return (
              <Link
                key={index}
                href={href}
                onClick={event => {
                  if (onLinkClick) {
                    event.preventDefault();
                    onLinkClick(link);
                  }
                }}
                className={className}
              >
                {innerContent}
              </Link>
            );
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => onLinkClick?.(link)}
              className={className}
            >
              {innerContent}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FooterLinkSection;
