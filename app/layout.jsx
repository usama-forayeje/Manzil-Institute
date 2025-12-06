import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';

import './globals.css';
import { Providers } from '@/components/providers';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import { Skeleton } from '@/components/ui/skeleton';
import StructuredData from '@/components/seo/StructuredData';
import ServiceWorkerRegister from '@/components/service-worker-register';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// Server-safe Loading Skeleton for root layout
function RootLoadingSkeleton() {
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
  );
}

export const metadata = {
  title: 'Manzil Institute - Quality Islamic Education',
  description:
    'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Providing comprehensive Islamic and modern education for students.',
  viewport: 'width=device-width, initial-scale=1',
  keywords: [
    'Manzil Institute',
    'Islamic Education',
    'MIC Curriculum',
    'Madrasa Education',
    'Bangladesh Education',
    'Religious Education',
    'Modern Education',
    'Technical Education',
    'Quality Education',
    'Islamic Studies',
  ],
  authors: [{ name: 'Manzil Institute' }],
  creator: 'Manzil Institute',
  publisher: 'Manzil Institute',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://institute.manzilgroupbd.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'bn-BD': '/bn',
    },
  },
  openGraph: {
    title: 'Manzil Institute - Quality Islamic Education',
    description:
      'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Providing comprehensive Islamic and modern education for students.',
    url: 'https://institute.manzilgroupbd.com',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.webp',
        width: 1200,
        height: 630,
        alt: 'Manzil Institute - Quality Islamic Education',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manzil Institute - Quality Islamic Education',
    description:
      'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh.',
    images: [
      'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.webp',
    ],
    creator: '@manzilinstitute',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }) {
  // Structured data for the organization
  const organizationData = {
    name: 'Manzil Institute',
    alternateName: 'Manzil International Institute',
    description:
      'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh.',
    url: 'https://institute.manzilgroupbd.com',
    logo: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.webp',
    sameAs: [
      'https://www.facebook.com/manzilinstitute',
      'https://www.instagram.com/manzilinstitute',
      'https://www.linkedin.com/company/manzil-institute',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressRegion: 'Dhaka',
      addressLocality: 'Dhaka',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1234-567890',
      contactType: 'customer service',
      availableLanguage: ['English', 'Bengali'],
    },
    email: 'info@manzilinstitute.edu.bd',
    foundingDate: '2020',
    educationalCredentialAwarded: [
      'MIC Certificate',
      'Madrasa Certificate',
      'Technical Certificate',
    ],
    hasEducationalUse: 'Islamic and Modern Education',
    knowsAbout: [
      'Islamic Studies',
      'Modern Education',
      'Technical Education',
      'Bangladesh Education System',
    ],
    areaServed: 'Bangladesh',
    priceRange: '$$',
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/manzil-institute-logo-dark.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/fonts/kalpurush.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link
          rel="dns-prefetch"
          href="//fonts.googleapis.com"
        />
        <link
          rel="dns-prefetch"
          href="//fonts.gstatic.com"
        />
        <link
          rel="dns-prefetch"
          href="//www.facebook.com"
        />
        <link
          rel="dns-prefetch"
          href="//www.instagram.com"
        />
        <link
          rel="dns-prefetch"
          href="//www.linkedin.com"
        />

        {/* Preconnect for faster connections */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Prefetch likely next pages */}
        <link
          rel="prefetch"
          href="/admission"
        />
        <link
          rel="prefetch"
          href="/curriculum"
        />
        <link
          rel="prefetch"
          href="/campus"
        />

        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="/globals.css"
          as="style"
        />

        {/* Module preload for critical JS */}
        <link
          rel="modulepreload"
          href="/_next/static/chunks/webpack.js"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <StructuredData
          type="EducationalOrganization"
          data={organizationData}
        />
        <ServiceWorkerRegister />
        <Providers>
          <Suspense fallback={<RootLoadingSkeleton />}>{children}</Suspense>
          <FloatingActionButtons />
        </Providers>
      </body>
    </html>
  );
}
