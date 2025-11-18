import React from 'react'
import { Skeleton } from "./ui/skeleton"
import { withErrorBoundary } from "./ErrorBoundary"
import FallbackComponent from "./FallbackComponent"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <header className="fixed z-20 w-full px-2">
        <div className="max-w-6xl px-6 mx-auto mt-2">
          <div className="max-w-4xl border bg-background/50 rounded-2xl backdrop-blur-lg">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              {/* Logo Skeleton */}
              <div className="flex justify-between w-full lg:w-auto">
                <div className="flex items-center space-x-1">
                  <Skeleton className="w-8 h-8 rounded" />
                  <Skeleton className="w-32 h-4" />
                </div>
                <Skeleton className="w-6 h-6 lg:hidden" />
              </div>

              {/* Desktop Navigation Skeleton */}
              <div className="absolute inset-0 hidden m-auto size-fit lg:block">
                <div className="flex gap-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-16 h-4" />
                  ))}
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col w-full space-y-3 sm:flex-row sm:gap-6 sm:space-y-0 md:w-fit lg:flex">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <main className="pt-20 overflow-hidden">
        <section className="relative py-24 hero-gradient lg:py-28">
          <div className="relative py-24 lg:py-28">
            <div className="px-6 mx-auto max-w-7xl md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                {/* Badge Skeleton */}
                <Skeleton className="w-64 h-8 mx-auto rounded-full" />

                {/* Main Heading Skeleton */}
                <Skeleton className="w-full h-12 mt-8 md:h-16 xl:h-20" />
                <Skeleton className="w-3/4 h-8 mx-auto mt-4" />

                {/* Sub Heading Skeleton */}
                <Skeleton className="w-2/3 h-6 mx-auto mt-4" />

                {/* Description Skeleton */}
                <div className="mt-8 space-y-2">
                  <Skeleton className="w-full h-4 max-w-3xl mx-auto" />
                  <Skeleton className="w-full h-4 max-w-3xl mx-auto" />
                  <Skeleton className="w-4/5 h-4 max-w-3xl mx-auto" />
                </div>

                {/* CTA Buttons Skeleton */}
                <div className="flex flex-col justify-center gap-4 mt-12 sm:flex-row">
                  <Skeleton className="w-32 h-12" />
                  <Skeleton className="w-40 h-12" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LoadingSkeleton
