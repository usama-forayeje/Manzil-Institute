'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { ActiveThemeProvider } from '@/components/themes/active-theme';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const client = getQueryClient();


  return (
    <QueryClientProvider client={client}>
      <ActiveThemeProvider initialTheme="manzil">
        <ThemeProvider defaultTheme="dark" storageKey="manzil-theme">
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              duration: 4000,
              className: 'kalpurush-font',
              style: {
                background: 'var(--background, #fff)',
                color: 'var(--foreground, #000)',
                border: '1px solid #00AEEF',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                opacity: 1,
              },
            }}
          />
        </ThemeProvider>
      </ActiveThemeProvider>
    </QueryClientProvider>
  );
}
