import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { withErrorBoundary } from "./ErrorBoundary"
import FallbackComponent from "./FallbackComponent"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <header className="fixed z-20 w-full px-2">
        <div className="mx-auto mt-2 max-w-6xl px-6">
          <div className="bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              {/* Logo Skeleton */}
              <div className="flex w-full justify-between lg:w-auto">
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-6 lg:hidden" />
              </div>

              {/* Desktop Navigation Skeleton */}
              <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                <div className="flex gap-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-16" />
                  ))}
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-6 sm:space-y-0 md:w-fit lg:flex">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <main className="overflow-hidden pt-20">
        <section className="relative hero-gradient py-24 lg:py-28">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                {/* Badge Skeleton */}
                <Skeleton className="mx-auto h-8 w-64 rounded-full" />

                {/* Main Heading Skeleton */}
                <Skeleton className="mt-8 h-12 w-full md:h-16 xl:h-20" />
                <Skeleton className="mt-4 h-8 w-3/4 mx-auto" />

                {/* Sub Heading Skeleton */}
                <Skeleton className="mt-4 h-6 w-2/3 mx-auto" />

                {/* Description Skeleton */}
                <div className="mt-8 space-y-2">
                  <Skeleton className="h-4 w-full mx-auto max-w-3xl" />
                  <Skeleton className="h-4 w-full mx-auto max-w-3xl" />
                  <Skeleton className="h-4 w-4/5 mx-auto max-w-3xl" />
                </div>

                {/* CTA Buttons Skeleton */}
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-40" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default withErrorBoundary(LoadingSkeleton, {
  fallback: <FallbackComponent componentName="Loading Skeleton" />
})
