'use client';

import React from 'react';
import { Facebook, UserX, Images, SquareUserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  color: string;
}

const FooterSocialLinks: React.FC = () => {
  const socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/agroventia',
      color: 'hover:text-blue-400',
    },
    {
      name: 'Twitter',
      icon: UserX,
      href: 'https://twitter.com/agroventia',
      color: 'hover:text-sky-400',
    },
    {
      name: 'Instagram',
      icon: Images,
      href: 'https://instagram.com/agroventia',
      color: 'hover:text-pink-400',
    },
    {
      name: 'LinkedIn',
      icon: SquareUserRound,
      href: 'https://linkedin.com/company/agroventia',
      color: 'hover:text-blue-500',
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map(social => (
        <Button
          key={social.name}
          variant="ghost"
          size="sm"
          title={`Follow us on ${social.name}`}
          className={`
            w-10 h-10 p-0 rounded-full
            bg-[#FDF8F0]
            border-2 border-[#281909]
            text-[#281909]
            hover:bg-[#225217]
            hover:border-[#225217]
            hover:text-[#FDF8F0]
            hover:scale-110
            transition-all duration-300 ease-out
            ${social.color}
          `}
          onClick={() => window.open(social.href, '_blank')}
        >
          <social.icon size={18} />
        </Button>
      ))}
    </div>
  );
};

export default FooterSocialLinks;
