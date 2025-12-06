import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
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

      {/* Hero Section Skeleton */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Skeleton className="h-12 mx-auto mb-4 w-96" />
            <Skeleton className="h-6 mx-auto mb-8 w-80" />
            <Skeleton className="w-40 h-10 mx-auto" />
          </div>
          <div className="grid gap-8 mb-16 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
                <Skeleton className="w-32 h-6 mx-auto mb-2" />
                <Skeleton className="w-48 h-4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-20 bg-slate-50 dark:bg-[#0B1120]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Skeleton className="w-64 h-10 mx-auto mb-4" />
            <Skeleton className="h-6 mx-auto w-96" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="text-center">
                <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-full" />
                <Skeleton className="w-24 h-6 mx-auto mb-2" />
                <Skeleton className="w-32 h-4 mx-auto mb-4" />
                <Skeleton className="w-40 h-4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MIC Curriculum Skeleton */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Skeleton className="h-10 mx-auto mb-4 w-72" />
            <Skeleton className="h-6 mx-auto w-80" />
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="w-48 h-8 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="flex-shrink-0 w-6 h-6 mt-1 rounded-full" />
                    <div>
                      <Skeleton className="w-40 h-5 mb-2" />
                      <Skeleton className="w-64 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="w-full rounded-lg h-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Skeleton */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Skeleton className="w-56 h-10 mx-auto mb-4" />
            <Skeleton className="h-6 mx-auto w-72" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full" />
                <Skeleton className="w-32 h-6 mx-auto mb-2" />
                <Skeleton className="w-40 h-4 mx-auto mb-2" />
                <Skeleton className="h-4 mx-auto w-36" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <Skeleton className="w-48 h-10 mx-auto mb-4" />
            <Skeleton className="w-64 h-6 mx-auto" />
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <Skeleton className="w-40 h-8 mb-6" />
              <div className="space-y-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-4/6 h-4" />
                <Skeleton className="w-3/6 h-4" />
              </div>
              <div className="mt-8 space-y-4">
                <Skeleton className="w-32 h-6" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="w-full h-16 rounded" />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Skeleton className="h-8 mb-6 w-36" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="w-24 h-4 mb-2" />
                  <Skeleton className="w-full h-10 rounded" />
                </div>
                <div>
                  <Skeleton className="w-20 h-4 mb-2" />
                  <Skeleton className="w-full h-24 rounded" />
                </div>
                <Skeleton className="w-full h-12 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

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
