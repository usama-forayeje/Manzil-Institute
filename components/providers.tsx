'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { ActiveThemeProvider } from '@/components/themes/active-theme';

interface ProvidersProps {
  children: React.ReactNode;
}

// Configure QueryClient for client-side rendering
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        onError: error => {
          console.error('Mutation error:', error);
        },
      },
    },
  });
}

let queryClient: QueryClient | undefined;

function getQueryClient() {
  if (!queryClient) queryClient = makeQueryClient();
  return queryClient;
}

export function Providers({ children }: ProvidersProps) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ActiveThemeProvider initialTheme="light">
        <ThemeProvider defaultTheme="dark" storageKey="manzil-theme">
          {children}
        </ThemeProvider>
      </ActiveThemeProvider>
    </QueryClientProvider>
  );
}
