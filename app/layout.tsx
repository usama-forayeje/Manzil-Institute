import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/components/core/providers';
import { Skeleton } from '@/components/ui/skeleton';
import StructuredData from '@/components/seo/StructuredData';
import ServiceWorkerRegister from '@/components/core/service-worker-register';

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

export const metadata: Metadata = {
  title: 'Manzil Institute - Quality Islamic Education',
  keywords: [
    // Standard English
    'Manzil Institute',
    'Manzil International Institute',
    'Manzil Group',
    'Islamic Education',
    'MIC Curriculum',
    'MNC Curriculum',
    'Madrasa Education',
    'Technical Education',
    'Bangladesh Islamic School',
    'Best Madrasa in Dhaka',
    
    // Standard Bengali
    'মানযিল ইনস্টিটিউট',
    'মানজিল ইনস্টিটিউট',
    'মানযিল গ্রুপ',
    'মানজিল গ্রুপ',
    'মাদরাসা শিক্ষা',
    'হিফজ মাদরাসা',
    'জেনারেল শিক্ষা',
    'কারিগরি শিক্ষা',
    'এমআইসি কারিকুলাম',
    "MNC Curriculum",
    
    // Spelling Mistakes / Typos (English)
    'Monzil Institute',
    'Manjil Institute',
    'Monjil Institute',
    'Manzil Institiut',
    'Monjil Group',
    'Manjil Madrasha',
    'Monzil Madrasha',
    'manzil institute jatrabari',
    
    // Spelling Mistakes / Typos (Bengali)
    'মঞ্জিল ইন্স্টিটিউট',
    'মানজিল ইনিস্টিটিউট',
    'মাঞ্জিল মাদ্রাসা',
    'মঞ্জিল মাদ্রাসা'
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
    title: 'মানজিল ইনস্টিটিউট - মাদরাসা জেনারেল কারিগরি শিক্ষার সমন্বয়',
    description:
      'মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত কারিকুলাম, মাদ্রাসা শিক্ষা, জেনারেল শিক্ষা এবং প্রযুক্তিগত শিক্ষা প্রদান করে। ছাত্রদের জন্য ব্যাপক ইসলামী এবং আধুনিক শিক্ষা প্রদান করে।',
    url: 'https://institute.manzilgroupbd.com',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'মানজিল ইনস্টিটিউট - মাদরাসা জেনারেল কারিগরি শিক্ষার সমন্বয়',
      },
    ],
    locale: 'bn_BD',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'মানজিল ইনস্টিটিউট - মাদরাসা জেনারেল কারিগরি শিক্ষার সমন্বয়',
    description:
      'মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত কারিকুলাম, মাদ্রাসা শিক্ষা, জেনারেল শিক্ষা এবং প্রযুক্তিগত শিক্ষা প্রদান করে।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  appleWebApp: {
    title: 'Manzil Institute',
    statusBarStyle: 'default',
    capable: true,
  },
  manifest: '/manifest.json', // If you have a PWA manifest
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured data for the organization
  const organizationData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://institute.manzilgroupbd.com/#organization',
        name: 'Manzil Institute',
        alternateName: ['Manzil Institute', 'মানযিল ইনস্টিটিউট', 'মানজিল গ্রুপ'],
        description:
          'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh.',
        url: 'https://institute.manzilgroupbd.com',
        logo: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        sameAs: [
          'https://www.facebook.com/ManzilInstituteBD',
          'https://www.youtube.com/c/ManzilTV',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Harunur Rashid Tower (10th Floor Building), House #91, Road #2, North Rayerbag Bus Stand',
          addressLocality: 'Jatrabari',
          addressRegion: 'Dhaka',
          postalCode: '1362',
          addressCountry: 'BD',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+8801407046003',
            contactType: 'Admissions',
            availableLanguage: ['English', 'Bengali'],
          },
          {
            '@type': 'ContactPoint',
            telephone: '+8801407046008',
            contactType: 'Customer Support',
            availableLanguage: ['English', 'Bengali'],
          }
        ],
        email: 'manzilinstitute24@gmail.com',
        foundingDate: '2020',
        founder: {
          '@type': 'Person',
          name: 'Mawlana Jamal Masrur',
        },
        hasEducationalUse: 'Islamic and Modern Education',
        knowsAbout: [
          'Islamic Studies',
          'Modern Education',
          'Technical Education',
          'Hifz',
          'Dars-e-Nizami'
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://institute.manzilgroupbd.com/#localBusiness',
        name: 'Manzil Institute Campus',
        image: 'https://institute.manzilgroupbd.com/computer-class.webp',
        telephone: '+8801407046003',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House #91, Road #2, North Rayerbag Bus Stand, Jatrabari',
          addressLocality: 'Dhaka',
          postalCode: '1362',
          addressCountry: 'BD',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 23.7006988,
          longitude: 90.4566508,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Saturday',
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday'
            ],
            opens: '08:00',
            closes: '18:00',
          }
        ],
      }
    ]
  };
  const isDevelopment = process.env.NODE_ENV === 'development';
  const csp = `default-src 'self'; script-src 'self' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval' " : ''}https://fonts.googleapis.com https://www.google.com https://www.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://www.google.com https://www.googleapis.com; img-src 'self' blob: data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google.com https://www.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com; frame-src 'self' https://www.google.com https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self';`;

  return (
    <html lang="bn" suppressHydrationWarning={true}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/manzil-institute.png"
          as="image"
          type="image/webp"
        />
        {/* Preload LCP image */}
        <link
          rel="preload"
          href="/computer-class.webp"
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
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.facebook.com" />
        <link rel="dns-prefetch" href="//www.instagram.com" />
        <link rel="dns-prefetch" href="//www.linkedin.com" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7DZC9QPNDG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7DZC9QPNDG');
          `}
        </Script>

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

        {/* Preload Google Fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
        </noscript>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          />
        </noscript>

        {/* Module preload for critical JS */}
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />

        {/* Content Security Policy */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />

        {/* Bengali metadata */}
        <meta
          name="title"
          lang="bn"
          content="মানজিল ইনস্টিটিউট - মাদরাসা জেনারেল কারিগরি শিক্ষার সমন্বয়"
        />
        <meta
          name="description"
          lang="bn"
          content="মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং প্রযুক্তিগত শিক্ষা প্রদান করে। ছাত্রদের জন্য ব্যাপক ইসলামী এবং আধুনিক শিক্ষা প্রদান করে।"
        />
        <meta
          name="keywords"
          lang="bn"
          content="মানজিল ইনস্টিটিউট, ইসলামী শিক্ষা, মাদ্রাসা শিক্ষা, বাংলাদেশ শিক্ষা, ধর্মীয় শিক্ষা, আধুনিক শিক্ষা, প্রযুক্তিগত শিক্ষা, গুণগত শিক্ষা, ইসলামী অধ্যয়ন"
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
        </Providers>
      </body>
    </html>
  );
}
