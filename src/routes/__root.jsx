import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '../styles.css'
import { useLanguageStore } from '../lib/store'
import { ThemeProvider } from '../components/themes/theme-provider'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorBoundary from '../components/ErrorBoundary'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title:
          'Manzil International Institute - Quality Education for Future Leaders',
      },
    ],
    links: [],
  }),

  shellComponent: RootDocument,
})
const queryClient = new QueryClient()

function RootDocument({ children }) {
  const { language } = useLanguageStore()
  const isDevelopment = import.meta.env.DEV

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <ErrorBoundary>
            <div
              lang={language}
              dir={language === 'bn' ? 'rtl' : 'ltr'}
              className={language === 'bn' ? 'bn-font' : ''}
            >
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Suspense fallback={<LoadingSkeleton />}>
                  <div>{children}</div>
                </Suspense>
              </ThemeProvider>
            </div>
          </ErrorBoundary>
          {isDevelopment && (
            <>
              {import('./dev-tools.jsx').then(({ DevTools }) => (
                <DevTools />
              )).catch(() => null)}
            </>
          )}
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  )
}
