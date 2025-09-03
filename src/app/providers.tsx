'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import { QuoteRequestProvider } from '@/contexts/QuoteRequestContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <LocaleProvider>
          <QuoteRequestProvider>{children}</QuoteRequestProvider>
        </LocaleProvider>
      </CookieConsentProvider>
    </QueryClientProvider>
  );
}
