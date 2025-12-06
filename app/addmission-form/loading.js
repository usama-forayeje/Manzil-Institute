import { Skeleton } from '@/components/ui/skeleton';

export default function AdmissionFormLoading() {
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

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-4xl px-4 sm:px-6 pt-12 pb-12">
        {/* Main Heading Section */}
        <section className="text-center mb-8 sm:mb-12">
          <Skeleton className="h-12 md:h-16 lg:h-20 mx-auto mb-4 w-96" />
          <Skeleton className="h-6 md:h-8 mx-auto mb-6 w-80" />
          <Skeleton className="h-4 md:h-6 mx-auto w-96 max-w-3xl" />
        </section>

        {/* Options Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <Skeleton className="h-6 w-48 mx-auto mb-6" />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Online Application Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
                <Skeleton className="h-6 w-40 mx-auto mb-3" />
                <Skeleton className="h-4 w-56 mx-auto mb-6" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            {/* Download Form Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-200 dark:bg-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
                <Skeleton className="h-6 w-36 mx-auto mb-3" />
                <Skeleton className="h-4 w-52 mx-auto mb-6" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <Skeleton className="h-6 w-48 mb-6" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Skeleton className="w-3 h-3 rounded" />
                </div>
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-12 w-52 rounded-xl" />
        </div>
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
