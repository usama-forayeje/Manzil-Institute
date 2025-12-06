import { Skeleton } from '@/components/ui/skeleton';

export default function MNCCurriculumLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="w-32 h-8" />
            <div className="flex items-center space-x-4">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-20 h-8" />
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-18">
        {/* Main Heading Section */}
        <section className="text-center mb-12 bg-white dark:bg-gray-900 py-16 rounded-2xl">
          <Skeleton className="h-12 md:h-16 lg:h-20 mx-auto mb-4 w-96" />
          <Skeleton className="h-6 md:h-8 mx-auto mb-6 w-80" />
          <Skeleton className="h-4 md:h-6 mx-auto w-96 max-w-3xl" />
        </section>

        {/* Curriculum Levels Grid */}
        <section className="space-y-6">
          <Skeleton className="h-8 w-64 mx-auto text-center mb-8" />

          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Level Header */}
                <div className="lg:w-1/4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 mb-4">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="w-24 h-4" />
                  </div>

                  <Skeleton className="h-6 w-48 mb-2" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>

                  <Skeleton className="h-4 w-40 mt-3" />
                </div>

                {/* Subjects Grid */}
                <div className="lg:w-3/4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Madrasa Subjects */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map(j => (
                          <li key={j} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                            <Skeleton className="h-4 w-28" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* General Subjects */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <ul className="space-y-2">
                        {[1, 2, 3].map(j => (
                          <li key={j} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Subjects */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <ul className="space-y-2">
                        {[1, 2, 3, 4].map(j => (
                          <li key={j} className="flex items-center gap-2">
                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                            <Skeleton className="h-4 w-36" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Special Programs Section */}
        <section className="mt-12">
          <Skeleton className="h-8 w-64 mx-auto text-center mb-8" />

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 mb-4">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-20 h-4" />
                </div>

                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-64 mb-4" />

                <ul className="space-y-2">
                  {[1, 2, 3].map(j => (
                    <li key={j} className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-40" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="text-white bg-gray-900">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-24 h-6 bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="w-full h-4 bg-gray-700" />
                  <Skeleton className="w-3/4 h-4 bg-gray-700" />
                  <Skeleton className="w-5/6 h-4 bg-gray-700" />
                  <Skeleton className="w-2/3 h-4 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 mt-8 border-t border-gray-800">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <Skeleton className="w-48 h-4 bg-gray-700" />
              <div className="flex mt-4 space-x-4 md:mt-0">
                <Skeleton className="w-8 h-8 bg-gray-700 rounded" />
                <Skeleton className="w-8 h-8 bg-gray-700 rounded" />
                <Skeleton className="w-8 h-8 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
