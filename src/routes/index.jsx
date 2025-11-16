import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { HeroHeader } from '../components/header'
import HeroSection from '../components/hero-section'
const ContentSection = lazy(() => import('../components/content-1'))
import MICCurriculum from '../components/MICCurriculum'
import Contact from '../components/contact'
import FooterSection from '../components/footer'
import Team from '../components/team'

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
      <HeroHeader />
      <HeroSection />
      <Suspense fallback={<div>Loading...</div>}>
        <ContentSection />
      </Suspense>
      <MICCurriculum />
      <Team />
      <Contact />
      <FooterSection />
    </>
  )
}