// Force dynamic rendering because the header uses cookies for session
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import FloatingActionButtons from '@/components/shared/FloatingActionButtons';
import nextDynamic from 'next/dynamic';
import HeroHeader from '@/components/layout/header';
import HeroSection from '@/components/landing/hero-section';
import ContentSection from '@/components/landing/about-section';
import StructuredData from '@/components/seo/StructuredData';

const MICCurriculum = nextDynamic(() => import('@/components/landing/mic-curriculum-section'), {
  loading: () => (
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
                  <Skeleton className="shrink-0 w-6 h-6 mt-1 rounded-full" />
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
  ),
});

const Team = nextDynamic(() => import('@/components/landing/team-section'), {
  loading: () => (
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
  ),
});

const Contact = nextDynamic(() => import('@/components/landing/contact-section'), {
  loading: () => (
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
  ),
});

const FooterSection = nextDynamic(() => import('@/components/layout/footer'), {
  loading: () => (
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
  ),
});

export const metadata: Metadata = {
  title: 'Manzil Institute - Quality Islamic Education | MIC Curriculum Bangladesh | Future Leaders',
  description: 'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.',
  keywords: [
    'Manzil Institute',
    'MIC Curriculum Bangladesh',
    'MNC Curriculum',
    'Madrasa Education',
    'General Education',
    'Technical Education',
    'Islamic Education Bangladesh',
    'Manzil International Institute admission',
    'Quran education',
    'Hadith studies',
    'Islamic values',
    'Future leader training',
    'Integrated education Bangladesh',
    'Modern Islamic curriculum',
    'Best Hifz Madrasa in Dhaka',
    'Jatrabari Islamic School',
    
    // Bengali Keywords
    'মানযিল ইনস্টিটিউট',
    'মানজিল ইনস্টিটিউট',
    'মানযিল মাদরাসা',
    'মানযিল কারিকুলাম',
    'ঢাকায় সেরা হিফজ মাদরাসা',
    'মানযিল গ্রুপ যাত্রাবাড়ী',
    'যাত্রাবাড়ী কারিগরি মাদরাসা',
    
    // Misspellings and Phonetic Matches
    'Monzil Institute',
    'Manjil Institute',
    'Monjil Institute',
    'Manjil International',
    'Monzil group bd',
    'Manzil madrasa dhaka',
    'Manjil madrasa',
    'মাঞ্জিল গ্রুপ',
    'মঞ্জিল ইন্সটিটিউট',
    'মানযীল'
  ],
  openGraph: {
    title: 'মানজিল ইনস্টিটিউট - মাদরাসা । জেনারেল । কারিগরি শিক্ষার সমন্বয়',
    description: 'মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং কারিগরি শিক্ষা প্রদান করে। কুরআন, হাদিস, আধুনিক একাডেমিক এবং কারিগরি দক্ষতার সাথে ভবিষ্যত নেতৃত্ব গঠনের জন্য ব্যাপক ইসলামিক শিক্ষা।',
    url: 'https://institute.manzilgroupbd.com',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'মানজিল ইনস্টিটিউট - মানসম্পন্ন ইসলামিক শিক্ষা | এমআইসি কারিকুলাম বাংলাদেশ | ভবিষ্যত নেতৃত্ব',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'মানজিল ইনস্টিটিউট - মাদরাসা । জেনারেল । কারিগরি শিক্ষার সমন্বয়',
    description: 'মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং কারিগরি শিক্ষা প্রদান করে। কুরআন, হাদিস, আধুনিক একাডেমিক এবং কারিগরি দক্ষতার সাথে ভবিষ্যত নেতৃত্ব গঠনের জন্য ব্যাপক ইসলামিক শিক্ষা।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};

export default function Home() {
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Manzil Institute',
    url: 'https://institute.manzilgroupbd.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://institute.manzilgroupbd.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <StructuredData type="WebSite" data={websiteStructuredData} />
      <HeroHeader />
      <HeroSection />
      <ContentSection />
      <MICCurriculum />
      <Team />
      <Contact />
      <FooterSection />
      <FloatingActionButtons />
    </>
  );
}