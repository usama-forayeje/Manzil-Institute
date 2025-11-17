import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Skeleton } from '../components/ui/skeleton'
import { MetaTags, StructuredData } from '../components/seo'

const HeroHeader = lazy(() => import('../components/header').then(m => ({ default: m.HeroHeader })))
const HeroSection = lazy(() => import('../components/hero-section'))
const ContentSection = lazy(() => import('../components/content-1'))
const MICCurriculum = lazy(() => import('../components/MICCurriculum'))
const Contact = lazy(() => import('../components/contact'))
const FooterSection = lazy(() => import('../components/footer'))
const Team = lazy(() => import('../components/team'))

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  // English SEO data for the homepage
  const seoDataEn = {
    title: 'Manzil Institute - Quality Islamic Education | MIC Curriculum Bangladesh | Future Leaders',
    description: 'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.',
    keywords: [
      'Manzil Institute', 'MIC Curriculum Bangladesh', 'Madrasa Education', 'General Education',
      'Technical Education', 'Islamic Education Bangladesh', 'Manzil International Institute admission',
      'Quran education', 'Hadith studies', 'Islamic values', 'Character development',
      'Future leader training', 'Bangladesh Islamic school', 'Integrated education Bangladesh',
      'Religious education Bangladesh', 'Modern Islamic curriculum'
    ],
    url: 'https://institute.manzilgroupbd.com',
    image: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png'
  }

  // Bengali SEO data for the homepage
  const seoDataBn = {
    title: 'মানজিল ইনস্টিটিউট - মানসম্পন্ন ইসলামিক শিক্ষা | এমআইসি কারিকুলাম বাংলাদেশ | ভবিষ্যত নেতৃত্ব',
    description: 'মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত এমআইসি কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং কারিগরি শিক্ষা প্রদান করে। কুরআন, হাদিস, আধুনিক একাডেমিক এবং কারিগরি দক্ষতার সাথে ভবিষ্যত নেতৃত্ব গঠনের জন্য ব্যাপক ইসলামিক শিক্ষা।',
    keywords: [
      'মানজিল ইনস্টিটিউট', 'এমআইসি কারিকুলাম বাংলাদেশ', 'মাদ্রাসা শিক্ষা', 'সাধারণ শিক্ষা',
      'কারিগরি শিক্ষা', 'ইসলামিক শিক্ষা বাংলাদেশ', 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট ভর্তি',
      'কুরআন শিক্ষা', 'হাদিস অধ্যয়ন', 'ইসলামিক মূল্যবোধ', 'চরিত্র উন্নয়ন',
      'ভবিষ্যত নেতা প্রশিক্ষণ', 'বাংলাদেশ ইসলামিক স্কুল', 'একীভূত শিক্ষা বাংলাদেশ',
      'ধর্মীয় শিক্ষা বাংলাদেশ', 'আধুনিক ইসলামিক কারিকুলাম'
    ],
    url: 'https://institute.manzilgroupbd.com',
    image: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png'
  }


  // English structured data for courses
  const coursesDataEn = [
    {
      name: "MIC Curriculum",
      description: "Comprehensive Islamic education curriculum combining traditional Islamic knowledge with modern educational standards",
      educationalLevel: "Primary to Secondary",
      teaches: ["Quran Studies", "Hadith Studies", "Islamic Jurisprudence", "Arabic Language", "Modern Subjects"],
      educationalUse: "Islamic Education",
      timeRequired: "P12Y"
    },
    {
      name: "Madrasa Education",
      description: "Traditional Islamic religious education focusing on Quran, Hadith, and Islamic sciences",
      educationalLevel: "Primary to Higher Secondary",
      teaches: ["Quran Memorization", "Tafsir", "Hadith", "Fiqh", "Islamic History"],
      educationalUse: "Religious Education",
      timeRequired: "P12Y"
    },
    {
      name: "General Education",
      description: "Standard academic curriculum following national education standards with Islamic values integration",
      educationalLevel: "Primary to Secondary",
      teaches: ["Mathematics", "Science", "English", "Bangla", "Social Studies"],
      educationalUse: "Academic Education",
      timeRequired: "P12Y"
    },
    {
      name: "Technical Education",
      description: "Vocational and technical skills training combined with Islamic character development",
      educationalLevel: "Secondary",
      teaches: ["Computer Science", "Robotics", "Technical Drawing", "Vocational Skills"],
      educationalUse: "Technical Education",
      timeRequired: "P4Y"
    }
  ]

  // Bengali structured data for courses
  const coursesDataBn = [
    {
      name: "এমআইসি কারিকুলাম",
      description: "প্রথাগত ইসলামিক জ্ঞান এবং আধুনিক শিক্ষা মানদণ্ডের সাথে ব্যাপক ইসলামিক শিক্ষা কারিকুলাম",
      educationalLevel: "প্রাথমিক থেকে মাধ্যমিক",
      teaches: ["কুরআন অধ্যয়ন", "হাদিস অধ্যয়ন", "ইসলামিক আইনশাস্ত্র", "আরবি ভাষা", "আধুনিক বিষয়সমূহ"],
      educationalUse: "ইসলামিক শিক্ষা",
      timeRequired: "P12Y"
    },
    {
      name: "মাদ্রাসা শিক্ষা",
      description: "কুরআন, হাদিস এবং ইসলামিক বিজ্ঞানে ফোকাস করে প্রথাগত ইসলামিক ধর্মীয় শিক্ষা",
      educationalLevel: "প্রাথমিক থেকে উচ্চ মাধ্যমিক",
      teaches: ["কুরআন মুখস্থকরণ", "তাফসির", "হাদিস", "ফিকহ", "ইসলামিক ইতিহাস"],
      educationalUse: "ধর্মীয় শিক্ষা",
      timeRequired: "P12Y"
    },
    {
      name: "সাধারণ শিক্ষা",
      description: "ইসলামিক মূল্যবোধের সাথে জাতীয় শিক্ষা মানদণ্ড অনুসরণ করে স্ট্যান্ডার্ড একাডেমিক কারিকুলাম",
      educationalLevel: "প্রাথমিক থেকে মাধ্যমিক",
      teaches: ["গণিত", "বিজ্ঞান", "ইংরেজি", "বাংলা", "সামাজিক বিজ্ঞান"],
      educationalUse: "একাডেমিক শিক্ষা",
      timeRequired: "P12Y"
    },
    {
      name: "কারিগরি শিক্ষা",
      description: "ইসলামিক চরিত্র উন্নয়নের সাথে বৃত্তিমূলক এবং কারিগরি দক্ষতা প্রশিক্ষণ",
      educationalLevel: "মাধ্যমিক",
      teaches: ["কম্পিউটার বিজ্ঞান", "রোবোটিক্স", "কারিগরি অঙ্কন", "বৃত্তিমূলক দক্ষতা"],
      educationalUse: "কারিগরি শিক্ষা",
      timeRequired: "P4Y"
    }
  ]

  // English organization structured data
  const organizationDataEn = {
    name: "Manzil International Institute",
    alternateName: "MIC Institute",
    description: "Manzil International Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.",
    url: "https://institute.manzilgroupbd.com",
    logo: "https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png",
    sameAs: [
      "https://www.facebook.com/manzilinstitute",
      "https://www.instagram.com/manzilinstitute",
      "https://www.linkedin.com/company/manzil-institute"
    ],
    address: {
      streetAddress: "Harunur Rashid Tower (10 Storied Building), House #91, Road #2",
      addressLocality: "North Rayarbagh Bus Stand, Jatrabari",
      addressRegion: "Dhaka",
      postalCode: "1362",
      addressCountry: "BD"
    },
    contactPoint: [
      {
        telephone: "+8801407046001",
        contactType: "admissions",
        areaServed: "BD",
        availableLanguage: ["en", "bn"]
      },
      {
        telephone: "+8801407046002",
        contactType: "general",
        areaServed: "BD",
        availableLanguage: ["en", "bn"]
      },
      {
        telephone: "+8801407046003",
        contactType: "technical support",
        areaServed: "BD",
        availableLanguage: ["en", "bn"]
      }
    ],
    email: "info@manzilinstitute.edu.bd",
    foundingDate: "2020",
    educationalCredentialAwarded: [
      "MIC Certificate",
      "Madrasa Certificate",
      "General Education Certificate",
      "Technical Education Certificate"
    ],
    hasEducationalUse: [
      "Islamic Education",
      "Character Development",
      "Modern Academic Education",
      "Technical Skills Training"
    ],
    knowsAbout: [
      "Quran Education",
      "Hadith Studies",
      "Islamic Jurisprudence",
      "Arabic Language",
      "Modern Subjects",
      "Computer Science",
      "Robotics",
      "Sports Training"
    ],
    areaServed: "Bangladesh",
    priceRange: "$$"
  }

  // Bengali organization structured data
  const organizationDataBn = {
    name: "মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট",
    alternateName: "এমআইসি ইনস্টিটিউট",
    description: "মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট বাংলাদেশে একীভূত এমআইসি কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং কারিগরি শিক্ষা প্রদান করে। কুরআন, হাদিস, আধুনিক একাডেমিক এবং কারিগরি দক্ষতার সাথে ভবিষ্যত নেতৃত্ব গঠনের জন্য ব্যাপক ইসলামিক শিক্ষা।",
    url: "https://institute.manzilgroupbd.com",
    logo: "https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png",
    sameAs: [
      "https://www.facebook.com/manzilinstitute",
      "https://www.instagram.com/manzilinstitute",
      "https://www.linkedin.com/company/manzil-institute"
    ],
    address: {
      streetAddress: "হারুনুর রশিদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২",
      addressLocality: "উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী",
      addressRegion: "ঢাকা",
      postalCode: "১৩৬২",
      addressCountry: "BD"
    },
    contactPoint: [
      {
        telephone: "+8801407046001",
        contactType: "admissions",
        areaServed: "BD",
        availableLanguage: ["en", "bn"]
      },
      {
        telephone: "+8801407046002",
        contactType: "general",
        areaServed: "BD",
        availableLanguage: ["en", "bn"]
      },
      {
        telephone: "+8801407046003",
        contactType: "technical support",
        areaServed: "BD",
        availableLanguage: ["en", "bn"]
      }
    ],
    email: "info@manzilinstitute.edu.bd",
    foundingDate: "2020",
    educationalCredentialAwarded: [
      "এমআইসি সার্টিফিকেট",
      "মাদ্রাসা সার্টিফিকেট",
      "সাধারণ শিক্ষা সার্টিফিকেট",
      "কারিগরি শিক্ষা সার্টিফিকেট"
    ],
    hasEducationalUse: [
      "ইসলামিক শিক্ষা",
      "চরিত্র উন্নয়ন",
      "আধুনিক একাডেমিক শিক্ষা",
      "কারিগরি দক্ষতা প্রশিক্ষণ"
    ],
    knowsAbout: [
      "কুরআন শিক্ষা",
      "হাদিস অধ্যয়ন",
      "ইসলামিক আইনশাস্ত্র",
      "আরবি ভাষা",
      "আধুনিক বিষয়সমূহ",
      "কম্পিউটার বিজ্ঞান",
      "রোবোটিক্স",
      "খেলাধুলা প্রশিক্ষণ"
    ],
    areaServed: "বাংলাদেশ",
    priceRange: "$$"
  }

  return (
    <>
      {/* English SEO Meta Tags */}
      <MetaTags
        title={seoDataEn.title}
        description={seoDataEn.description}
        keywords={seoDataEn.keywords}
        url={seoDataEn.url}
        image={seoDataEn.image}
      />

      {/* Bengali SEO Meta Tags */}
      <MetaTags
        title={seoDataBn.title}
        description={seoDataBn.description}
        keywords={seoDataBn.keywords}
        url={seoDataBn.url}
        image={seoDataBn.image}
      />

      {/* English Structured Data */}
      {coursesDataEn.map((course, index) => (
        <StructuredData key={`course-en-${index}`} type="course" data={course} />
      ))}
      <StructuredData type="organization" data={organizationDataEn} />

      {/* Bengali Structured Data */}
      {coursesDataBn.map((course, index) => (
        <StructuredData key={`course-bn-${index}`} type="course" data={course} />
      ))}
      <StructuredData type="organization" data={organizationDataBn} />

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
