'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdmissionFormLoading() {
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Skeleton className="h-12 md:h-16 lg:h-20 mx-auto mb-4 w-96 rounded-lg" />
            <Skeleton className="h-6 md:h-8 mx-auto mb-6 w-80 rounded" />
            <Skeleton className="h-4 md:h-6 mx-auto w-96 max-w-3xl rounded" />
          </div>
        </section>

        {/* Options Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 mx-4 mb-8 max-w-4xl mx-auto">
          <Skeleton className="h-6 w-48 mx-auto mb-6 rounded-lg" />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Online Application */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
                <Skeleton className="h-6 w-40 mx-auto mb-3 rounded" />
                <Skeleton className="h-4 w-56 mx-auto mb-6 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            {/* Download Form */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-200 dark:bg-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
                <Skeleton className="h-6 w-36 mx-auto mb-3 rounded" />
                <Skeleton className="h-4 w-52 mx-auto mb-6 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 mx-4 mb-8 max-w-4xl mx-auto">
          <Skeleton className="h-6 w-48 mb-6 rounded-lg" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Skeleton className="w-3 h-3 rounded" />
                </div>
                <Skeleton className="h-4 w-full max-w-md rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 pb-12">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-12 w-52 rounded-xl" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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