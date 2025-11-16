import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '../styles.css'
import { useLanguageStore } from '../lib/store'
import { ThemeProvider } from '../components/themes/theme-provider'
import FloatingActionButtons from '../components/FloatingActionButtons'

export const Route = createRootRoute({
  component: RootComponent,
})

const queryClient = new QueryClient()

function RootComponent() {
  const { language } = useLanguageStore()

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="manzil-theme">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Outlet />
          </Suspense>
          <FloatingActionButtons />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
