'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function MICAdmissionLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-6 border border-blue-500/20">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-32 h-4" />
          </div>
          <Skeleton className="h-12 md:h-16 mx-auto mb-6 w-96 rounded-lg" />
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Skeleton className="w-6 h-6 rounded" />
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1" />
                <Skeleton className="w-5 h-5 rounded" />
              </div>
              <Skeleton className="h-6 mx-auto w-80 rounded" />
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1" />
                <Skeleton className="w-5 h-5 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-20 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 py-4 justify-center">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="relative px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium"
              >
                <Skeleton className="w-3 h-3 rounded" />
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-8 mx-auto mb-3 w-64 rounded-lg" />
          <Skeleton className="h-4 mx-auto w-80 max-w-2xl rounded" />
        </div>

        {/* Process Timeline */}
        <div className="grid gap-8">
          <div className="relative">
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-60 md:left-1/2 md:-ml-0.5" />

            <div className="space-y-16 md:space-y-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`relative flex items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-20 h-20 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-white dark:border-gray-950 shadow-2xl z-10">
                    <Skeleton className="w-8 h-8 md:w-6 md:h-6 rounded" />
                  </div>

                  <div
                    className={`ml-24 md:ml-0 md:w-1/2 px-6 md:px-4 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}
                  >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-6 rounded-3xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg">
                      <Skeleton className="h-6 w-48 mb-3 rounded" />
                      <Skeleton className="h-4 w-32 mb-4 rounded" />
                      <Skeleton className="h-4 w-full mb-6 max-w-md rounded" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="flex items-center gap-3 text-base md:text-sm"
                          >
                            <Skeleton className="w-5 h-5 rounded-full" />
                            <Skeleton className="h-4 w-40 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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