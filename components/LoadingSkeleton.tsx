'use client';

import { Skeleton } from './ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header Skeleton - Matching header.tsx structure with realistic layout */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left Side */}
            <div className="flex items-center flex-shrink-0">
              <Skeleton className="h-10 w-[170px] rounded-xl" />
            </div>

            {/* Desktop Navigation - Center (5 menu items matching actual header) */}
            <nav className="hidden lg:flex items-center justify-center flex-grow px-8">
              <div className="flex items-center gap-6">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            </nav>

            {/* Action Buttons - Right Side (Theme toggle, Language, Apply Now) */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>

            {/* Mobile Action Buttons - Right Side (Theme, Language, Menu) */}
            <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section Skeleton - Matching hero-section.tsx */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30 dark:from-gray-950/95 dark:via-gray-950/80 dark:to-gray-950/40" />
          
          <div className="relative z-10 w-full py-20 lg:py-32">
            <div className="max-w-7xl px-6 mx-auto md:px-12">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-6">
                  <Skeleton className="h-4 w-40" />
                </div>

                {/* Main Heading */}
                <div className="space-y-4 max-w-4xl">
                  <Skeleton className="h-14 md:h-16 lg:h-20 w-full max-w-3xl mx-auto rounded-lg" />
                  <Skeleton className="h-8 md:h-10 lg:h-12 w-4/5 max-w-2xl mx-auto rounded-lg" />
                </div>

                {/* Description */}
                <div className="max-w-2xl mt-6 space-y-3">
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-5 w-11/12 rounded" />
                  <Skeleton className="h-5 w-10/12 rounded" />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                  <Skeleton className="h-12 w-48 rounded-xl" />
                  <Skeleton className="h-12 w-40 rounded-xl" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-12 mx-auto rounded" />
                      <Skeleton className="h-4 w-16 mx-auto mt-2 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About/Content Section Skeleton - Matching content-1.tsx */}
        <section className="relative py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
              <Skeleton className="h-6 w-48 mx-auto rounded-full mb-6" />
              <Skeleton className="h-12 w-64 mx-auto rounded-lg mb-4" />
              <Skeleton className="h-6 w-96 mx-auto rounded" />
            </div>

            {/* Introduction Cards */}
            <div className="grid gap-8 lg:grid-cols-2 mb-24">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-6 w-32 rounded" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-11/12 rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <Skeleton className="h-10 w-64 mx-auto rounded-lg mb-4" />
                <Skeleton className="h-5 w-96 mx-auto rounded" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-5 w-40 mb-2 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center flex-wrap gap-4 mt-10">
                <Skeleton className="h-12 w-44 rounded-xl" />
                <Skeleton className="h-12 w-40 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-6 w-28 rounded" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-11/12 rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-10 w-20 mx-auto rounded" />
                  <Skeleton className="h-4 w-24 mx-auto mt-2 rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum Preview Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-8 w-72 mx-auto rounded-lg mb-4" />
              <Skeleton className="h-5 w-96 mx-auto rounded" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* MIC Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div>
                    <Skeleton className="h-6 w-40 mb-2 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-11/12 rounded" />
                  <Skeleton className="h-4 w-10/12 rounded" />
                </div>
                <div className="flex gap-3 mt-6">
                  <Skeleton className="h-10 w-28 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              </div>

              {/* MNC Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div>
                    <Skeleton className="h-6 w-40 mb-2 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-11/12 rounded" />
                  <Skeleton className="h-4 w-10/12 rounded" />
                </div>
                <div className="flex gap-3 mt-6">
                  <Skeleton className="h-10 w-28 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section Skeleton */}
        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-8 w-56 mx-auto rounded-lg mb-4" />
              <Skeleton className="h-5 w-72 mx-auto rounded" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-40 w-40 mx-auto rounded-full mb-4" />
                  <Skeleton className="h-5 w-40 mx-auto mb-2 rounded" />
                  <Skeleton className="h-4 w-32 mx-auto mb-2 rounded" />
                  <Skeleton className="h-4 w-48 mx-auto rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section Skeleton */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-8 w-48 mx-auto rounded-lg mb-4" />
              <Skeleton className="h-5 w-64 mx-auto rounded" />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <Skeleton className="h-6 w-40 mb-6 rounded" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-11/12 rounded" />
                  <Skeleton className="h-4 w-10/12 rounded" />
                  <Skeleton className="h-4 w-9/12 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <Skeleton className="h-8 w-8 mx-auto mb-2 rounded" />
                      <Skeleton className="h-4 w-20 mx-auto rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Skeleton className="h-6 w-36 mb-6 rounded" />
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-6 w-32 rounded" />
              </div>
              <Skeleton className="h-4 w-full mb-2 rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-10/12 rounded" />
            </div>

            {/* Link Columns */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-5 w-24 mb-4 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Skeleton className="h-4 w-48 rounded" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}