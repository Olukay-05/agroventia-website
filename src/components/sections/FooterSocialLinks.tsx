'use client';

import React from 'react';
import { Linkedin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  color: string;
}

interface FooterSocialLinksProps {
  phoneNumber?: string; // Add phoneNumber prop
}

const FooterSocialLinks: React.FC<FooterSocialLinksProps> = ({
  phoneNumber,
}) => {
  // Format phone number for WhatsApp link (remove all non-digit characters)
  const formattedPhoneNumber = phoneNumber
    ? phoneNumber.replace(/\D/g, '')
    : '14034776059'; // Default fallback

  const socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/agroventia-inc/',
      color: 'hover:text-blue-500',
    },
    {
      name: 'WhatsApp',
      icon: Phone,
      href: `https://wa.me/${formattedPhoneNumber}`,
      color: 'hover:text-green-500',
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map(social => (
        <Button
          key={social.name}
          variant="ghost"
          size="sm"
          title={`Connect with us on ${social.name}`}
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
