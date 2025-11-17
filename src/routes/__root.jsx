import React, { Suspense } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '../styles.css'
import { useLanguageStore } from '../lib/store'
import { ThemeProvider } from '../components/themes/theme-provider'
import FloatingActionButtons from '../components/FloatingActionButtons'
import ErrorBoundary from '../components/ErrorBoundary'

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
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error('Mutation error:', error)
        },
      },
    },
  })
}

let queryClient

function getQueryClient() {
  if (!queryClient) queryClient = makeQueryClient()
  return queryClient
}

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { language } = useLanguageStore()
  const client = getQueryClient()

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={client}>
          <ThemeProvider defaultTheme="light" storageKey="manzil-theme">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Outlet />
            </Suspense>
            <FloatingActionButtons />
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}
