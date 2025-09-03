// components/common/LanguageSelector.tsx
'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocale } from '@/contexts/LocaleContext';
import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/locale';

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as Locale);

    // Update the URL with the new locale
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('lang', newLocale);

    // Preserve any existing query parameters
    const newUrl = `${pathname}?${currentParams.toString()}`;
    router.push(newUrl);
  };

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr-CA', label: 'Français (Canada)' },
  ];

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[180px] h-[42px] rounded-full border-2 border-[#281909] bg-[#FDF8F0] text-[#281909] font-semibold text-[16px] leading-[1] tracking-[0.2px] hover:bg-[#225217] hover:text-[#FDF8F0] hover:border-[#225217] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent className="rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] bg-[#FDF8F0] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 duration-200">
        {languageOptions.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] text-[#281909] hover:bg-[#225217] hover:text-[#FDF8F0]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
