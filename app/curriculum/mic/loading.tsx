'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function MICCurriculumLoading() {
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
        {/* Hero Section */}
        <section className="text-center mb-12 bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Skeleton className="h-12 md:h-16 lg:h-20 mx-auto mb-4 w-96 rounded-lg" />
            <Skeleton className="h-6 md:h-8 mx-auto mb-6 w-80 rounded" />
            <Skeleton className="h-4 md:h-6 mx-auto w-96 max-w-3xl rounded" />
          </div>
        </section>

        {/* Overview Stats */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700 mx-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
                <Skeleton className="h-6 w-16 mx-auto mb-2 rounded" />
                <Skeleton className="h-4 w-24 mx-auto rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum Levels */}
        <section className="space-y-6 px-4 max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto text-center mb-8 rounded-lg" />

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Level Header */}
                <div className="lg:w-1/4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-24 h-4" />
                  </div>

                  <Skeleton className="h-6 w-48 mb-2 rounded" />
                  <Skeleton className="h-4 w-32 mb-4 rounded" />

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                  </div>

                  <Skeleton className="h-4 w-40 mb-3 rounded" />

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-32 rounded" />
                    </div>
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                </div>

                {/* Subjects Grid */}
                <div className="lg:w-3/4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* General Education */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-40 rounded" />
                      </div>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map((j) => (
                          <li key={j} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                            <Skeleton className="h-4 w-32 rounded" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* International Education */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-48 rounded" />
                      </div>
                      <ul className="space-y-2">
                        {[1, 2, 3].map((j) => (
                          <li key={j} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                            <Skeleton className="h-4 w-36 rounded" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-44 rounded" />
                      </div>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map((j) => (
                          <li key={j} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                            <Skeleton className="h-4 w-40 rounded" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-28 rounded" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 rounded" />
                          <Skeleton className="h-4 w-24 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Key Features */}
        <section className="mt-12 px-4 max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto text-center mb-8 rounded-lg" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
                <Skeleton className="h-6 w-48 mb-3 rounded" />
                <Skeleton className="h-4 w-56 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mt-12 bg-blue-500/10 rounded-lg p-6 mx-4 max-w-7xl mx-auto">
          <Skeleton className="h-6 w-64 mx-auto mb-3 rounded" />
          <Skeleton className="h-4 w-80 mx-auto mb-4 rounded" />
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-48 rounded-xl" />
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>
        </section>
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
