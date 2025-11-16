import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Skeleton } from '../components/ui/skeleton'

const HeroHeader = lazy(() => import('../components/header').then(m => ({ default: m.HeroHeader })))
const HeroSection = lazy(() => import('../components/hero-section'))
const ContentSection = lazy(() => import('../components/content-1'))
const MICCurriculum = lazy(() => import('../components/MICCurriculum'))
const Contact = lazy(() => import('../components/contact'))
const FooterSection = lazy(() => import('../components/footer'))
const Team = lazy(() => import('../components/team'))

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      {
        charset: 'UTF-8',
      },
      {
        title: 'Manzil Institute - Quality Islamic Education | MIC Curriculum Bangladesh | Future Leaders',
      },
      {
        name: 'description',
        content: 'Manzil International Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.',
      },
      {
        name: 'keywords',
        content: 'Manzil Institute, MIC Curriculum Bangladesh, Madrasa Education, General Education, Technical Education, Islamic Education Bangladesh, Manzil International Institute admission, Quran education, Hadith studies, Islamic values, Character development, Future leader training, Bangladesh Islamic school, Integrated education Bangladesh, Religious education Bangladesh, Modern Islamic curriculum',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'Manzil Institute - Quality Islamic Education for Future Leaders | MIC Curriculum Bangladesh',
      },
      {
        property: 'og:description',
        content: 'Comprehensive Islamic education with integrated MIC Curriculum, Madrasa, General, and Technical Education in Bangladesh. Building future leaders with Islamic values and modern skills.',
      },
      {
        property: 'og:url',
        content: 'https://institute.manzilgroupbd.com',
      },
      {
        property: 'og:image',
        content: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Manzil International Institute - Quality Islamic Education for Future Leaders',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter Cards
      {
        name: 'twitter:title',
        content: 'Manzil International Institute - Quality Islamic Education | MIC Curriculum Bangladesh',
      },
      {
        name: 'twitter:description',
        content: 'Integrated Islamic education with MIC Curriculum, Madrasa, General & Technical Education in Bangladesh. Developing future leaders with Islamic values and modern academics.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://institute.manzilgroupbd.com',
      },
      // hreflang tags for English and Bangla versions
      {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://institute.manzilgroupbd.com',
      },
      {
        rel: 'alternate',
        hreflang: 'bn',
        href: 'https://institute.manzilgroupbd.com',
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: 'https://institute.manzilgroupbd.com',
      },
    ],
  }),
})

function Home() {
  const coursesSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "MIC Curriculum",
      "description": "Comprehensive Islamic education curriculum combining traditional Islamic knowledge with modern educational standards",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Manzil International Institute"
      },
      "educationalLevel": "Primary to Secondary",
      "teaches": ["Quran Studies", "Hadith Studies", "Islamic Jurisprudence", "Arabic Language", "Modern Subjects"],
      "educationalUse": "Islamic Education",
      "timeRequired": "P12Y"
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Madrasa Education",
      "description": "Traditional Islamic religious education focusing on Quran, Hadith, and Islamic sciences",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Manzil International Institute"
      },
      "educationalLevel": "Primary to Higher Secondary",
      "teaches": ["Quran Memorization", "Tafsir", "Hadith", "Fiqh", "Islamic History"],
      "educationalUse": "Religious Education",
      "timeRequired": "P12Y"
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "General Education",
      "description": "Standard academic curriculum following national education standards with Islamic values integration",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Manzil International Institute"
      },
      "educationalLevel": "Primary to Secondary",
      "teaches": ["Mathematics", "Science", "English", "Bangla", "Social Studies"],
      "educationalUse": "Academic Education",
      "timeRequired": "P12Y"
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Technical Education",
      "description": "Vocational and technical skills training combined with Islamic character development",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Manzil International Institute"
      },
      "educationalLevel": "Secondary",
      "teaches": ["Computer Science", "Robotics", "Technical Drawing", "Vocational Skills"],
      "educationalUse": "Technical Education",
      "timeRequired": "P4Y"
    }
  ]

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Manzil International Institute",
    "alternateName": "MIC Institute",
    "description": "Manzil International Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.",
    "url": "https://institute.manzilgroupbd.com",
    "logo": "https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png",
    "sameAs": [
      "https://www.facebook.com/manzilinstitute",
      "https://www.instagram.com/manzilinstitute",
      "https://www.linkedin.com/company/manzil-institute"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Harunur Rashid Tower (10 Storied Building), House #91, Road #2",
      "addressLocality": "North Rayarbagh Bus Stand, Jatrabari",
      "addressRegion": "Dhaka",
      "postalCode": "1362",
      "addressCountry": "BD"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+8801407046001",
        "contactType": "admissions",
        "areaServed": "BD",
        "availableLanguage": ["en", "bn"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+8801407046002",
        "contactType": "general",
        "areaServed": "BD",
        "availableLanguage": ["en", "bn"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+8801407046003",
        "contactType": "technical support",
        "areaServed": "BD",
        "availableLanguage": ["en", "bn"]
      }
    ],
    "email": "info@manzilinstitute.edu.bd",
    "foundingDate": "2020",
    "educationalCredentialAwarded": [
      "MIC Certificate",
      "Madrasa Certificate",
      "General Education Certificate",
      "Technical Education Certificate"
    ],
    "hasEducationalUse": [
      "Islamic Education",
      "Character Development",
      "Modern Academic Education",
      "Technical Skills Training"
    ],
    "knowsAbout": [
      "Quran Education",
      "Hadith Studies",
      "Islamic Jurisprudence",
      "Arabic Language",
      "Modern Subjects",
      "Computer Science",
      "Robotics",
      "Sports Training"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Bangladesh"
    },
    "priceRange": "$$"
  }

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(coursesSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <Suspense fallback={
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Skeleton className="h-8 w-32" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </div>
      }>
        <HeroHeader />
      </Suspense>
      <Suspense fallback={
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto mb-8" />
              <Skeleton className="h-10 w-40 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <HeroSection />
      </Suspense>
      <Suspense fallback={
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <ContentSection />
      </Suspense>
      <Suspense fallback={
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-72 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="w-6 h-6 rounded-full flex-shrink-0 mt-1" />
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="w-full h-80 rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      }>
        <MICCurriculum />
      </Suspense>
      <Suspense fallback={
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-56 mx-auto mb-4" />
              <Skeleton className="h-6 w-72 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto mb-2" />
                  <Skeleton className="h-4 w-36 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <Team />
      </Suspense>
      <Suspense fallback={
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-8 w-40 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-3/6" />
                </div>
                <div className="mt-8 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded" />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Skeleton className="h-8 w-36 mb-6" />
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-24 w-full rounded" />
                  </div>
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>
      }>
        <Contact />
      </Suspense>
      <Suspense fallback={
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-24 bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-700" />
                    <Skeleton className="h-4 w-3/4 bg-gray-700" />
                    <Skeleton className="h-4 w-5/6 bg-gray-700" />
                    <Skeleton className="h-4 w-2/3 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <Skeleton className="h-4 w-48 bg-gray-700" />
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                  <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                  <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      }>
        <FooterSection />
      </Suspense>
    </>
  )
}
