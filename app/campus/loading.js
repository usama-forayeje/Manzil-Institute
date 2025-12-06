import { Skeleton } from '@/components/ui/skeleton';

export default function CampusLoading() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-[#030712] to-[#030712]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-40 h-4" />
          </div>

          <Skeleton className="h-12 md:h-16 lg:h-20 mx-auto mb-6 w-96" />

          <Skeleton className="h-6 mx-auto mb-10 w-80 max-w-2xl" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Skeleton className="h-14 w-40 rounded-full" />
            <Skeleton className="h-14 w-48 rounded-full" />
          </div>
        </div>

        {/* 3D Floor Effect */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-500/10 to-transparent transform perspective-[500px] rotate-x-60 origin-bottom" />
      </section>

      {/* Tour Section */}
      <section className="relative bg-[#030712] py-24">
        <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-24">
          <Skeleton className="h-12 md:h-16 mx-auto mb-4 w-64" />
          <Skeleton className="h-1 w-20 mx-auto rounded-full" />
        </div>

        {/* Mobile Tour Skeletons */}
        <div className="md:hidden">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="min-h-[100vh] flex flex-col mb-20">
              {/* Image */}
              <div className="h-[50vh] w-full rounded-2xl overflow-hidden relative mb-6">
                <Skeleton className="w-full h-full" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Text */}
              <div className="px-4">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-1 w-20" />
                </div>

                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Tour Skeletons */}
        <div className="hidden md:flex max-w-7xl mx-auto min-h-[500vh]">
          {/* Sticky Image Area */}
          <div className="w-1/2 sticky top-20 h-[calc(100vh-80px)] p-4">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center p-8 h-full w-full"
              >
                <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scrolling Text Area */}
          <div className="w-1/2 p-4 px-4">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="h-[100vh] flex flex-col justify-center">
                <div className="p-6 rounded-2xl bg-transparent">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <Skeleton className="h-1 w-20" />
                  </div>

                  <Skeleton className="h-8 md:h-12 w-80 mb-4" />
                  <Skeleton className="h-6 md:h-8 w-96 mb-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-8 relative overflow-hidden border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Skeleton className="h-8 md:h-12 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Video Grid */}
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing px-2 md:px-0 no-scrollbar">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="snap-center shrink-0 w-[240px] sm:w-[280px] md:w-[320px] h-[240px] sm:h-[350px] md:h-[450px] rounded-[32px] overflow-hidden relative group border border-white/10 bg-gray-900 shadow-2xl"
              >
                <Skeleton className="w-full h-full" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <Skeleton className="h-6 w-48 mb-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 px-4 relative z-10 bg-[#030712] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-8 md:h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-80 mx-auto max-w-2xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div
                key={i}
                className="relative overflow-hidden rounded-3xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group"
              >
                <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-8 -mt-8" />

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Skeleton className="w-6 h-6 rounded" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-8">
            <Skeleton className="h-8 md:h-12 w-80 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto max-w-2xl" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Skeleton className="h-14 w-48 rounded-full" />
              <Skeleton className="h-14 w-40 rounded-full" />
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
