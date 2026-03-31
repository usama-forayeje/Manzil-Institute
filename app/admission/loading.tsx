'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdmissionLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-32 hidden sm:block" />
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </nav>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 min-h-screen">
        {/* Main Heading */}
        <section className="text-center mb-8 sm:mb-12 pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Skeleton className="h-12 md:h-16 lg:h-20 mx-auto mb-4 w-96 rounded-lg" />
            <Skeleton className="h-6 md:h-8 mx-auto mb-6 w-80 rounded" />
            <Skeleton className="h-4 md:h-6 mx-auto w-96 max-w-3xl rounded" />
          </div>
        </section>

        {/* Overview Stats */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-6 sm:mx-4 max-w-7xl mx-auto border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <Skeleton className="h-8 mx-auto mb-4 w-64 rounded-lg" />
            <Skeleton className="h-4 mx-auto w-80 max-w-3xl rounded" />
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-xl" />
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 mx-4 max-w-7xl mx-auto border border-gray-200 dark:border-gray-700">
          <div className="space-y-6 sm:space-y-8">
            <Skeleton className="h-8 w-64 mb-4 sm:mb-6 rounded-lg" />

            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                    <Skeleton className="h-6 w-48 mb-1 sm:mb-0 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>

                  <Skeleton className="h-4 w-full mb-3 max-w-md rounded" />

                  <div className="grid gap-1 sm:gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-4 w-40 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-24 h-6 bg-gray-700 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-700 rounded" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700 rounded" />
                  <Skeleton className="h-4 w-5/6 bg-gray-700 rounded" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 mt-8 border-t border-gray-800">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <Skeleton className="h-4 w-48 bg-gray-700 rounded" />
              <div className="flex mt-4 space-x-4 md:mt-0">
                <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
