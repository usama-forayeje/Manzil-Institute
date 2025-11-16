import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, lazy, Suspense } from 'react'
import { Download, ArrowLeft, BookOpen, Users, Clock, Star, GraduationCap, Layers, Target, Zap, BookText, Award, Globe, Cpu, Heart } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useTranslation } from '../hooks/useTranslation'
import { AnimatedGroup } from '../components/ui/animated-group'

const HeroHeader = lazy(() => import('../components/header').then(m => ({ default: m.HeroHeader })))
const FooterSection = lazy(() => import('../components/footer'))

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export const Route = createFileRoute('/curriculum')({
  component: CurriculumPage,
  head: () => ({
    meta: [
      {
        title: 'MIC Curriculum Details Bangladesh - Manzil International Institute Education System',
      },
      {
        name: 'description',
        content: 'Explore the comprehensive MIC Curriculum at Manzil International Institute. 6 levels, 22 years of integrated Madrasa, General, and Technical education in Bangladesh.',
      },
      {
        name: 'keywords',
        content: 'MIC Curriculum, Manzil Institute curriculum, Madrasa Education Bangladesh, General Education, Technical Education, Islamic Education curriculum',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'MIC Curriculum Details - Manzil International Institute',
      },
      {
        property: 'og:description',
        content: 'Comprehensive 22-year education system with Madrasa, General, and Technical streams. MIC Curriculum Bangladesh.',
      },
      {
        property: 'og:url',
        content: 'https://institute.manzilgroupbd.com/curriculum',
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
        content: 'MIC Curriculum Details - Manzil International Institute Education System',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter Cards
      {
        name: 'twitter:title',
        content: 'MIC Curriculum Details - Manzil International Institute',
      },
      {
        name: 'twitter:description',
        content: 'Comprehensive 22-year education system with Madrasa, General, and Technical streams. MIC Curriculum Bangladesh.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://institute.manzilgroupbd.com/curriculum',
      },
      // hreflang tags for English and Bangla versions
      {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://institute.manzilgroupbd.com/curriculum',
      },
      {
        rel: 'alternate',
        hreflang: 'bn',
        href: 'https://institute.manzilgroupbd.com/curriculum',
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: 'https://institute.manzilgroupbd.com/curriculum',
      },
    ],
  }),
})

function CurriculumPage() {
  const { language, t } = useTranslation()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://institute.manzilgroupbd.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Curriculum",
        "item": "https://institute.manzilgroupbd.com/curriculum"
      }
    ]
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        border: 'border-[#00AEEF]',
        bg50: 'bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5',
        border200: 'border-[#00AEEF]/40 dark:border-[#00AEEF]/20',
        text600: 'text-[#00AEEF] dark:text-[#00AEEF]/80',
        text700: 'text-[#00AEEF]/90 dark:text-[#00AEEF]/70',
        bg500: 'bg-[#00AEEF]',
        borderProgram: 'border-[#00AEEF]/40 dark:border-[#00AEEF]/20',
        bgProgram50: 'bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5',
        textProgram600: 'text-[#00AEEF] dark:text-[#00AEEF]/80',
        textProgram700: 'text-[#00AEEF]/90 dark:text-[#00AEEF]/70',
        heart: 'text-[#00AEEF]'
      },
      green: {
        border: 'border-green-500',
        bg50: 'bg-green-50 dark:bg-green-900/30',
        border200: 'border-green-200 dark:border-green-800',
        text600: 'text-green-600 dark:text-green-400',
        text700: 'text-green-700 dark:text-green-300',
        bg500: 'bg-green-500',
        borderProgram: 'border-green-200 dark:border-green-800',
        bgProgram50: 'bg-green-50 dark:bg-green-900/30',
        textProgram600: 'text-green-600 dark:text-green-400',
        textProgram700: 'text-green-700 dark:text-green-300',
        heart: 'text-green-500'
      },
      purple: {
        border: 'border-purple-500',
        bg50: 'bg-purple-50 dark:bg-purple-900/30',
        border200: 'border-purple-200 dark:border-purple-800',
        text600: 'text-purple-600 dark:text-purple-400',
        text700: 'text-purple-700 dark:text-purple-300',
        bg500: 'bg-purple-500',
        borderProgram: 'border-purple-200 dark:border-purple-800',
        bgProgram50: 'bg-purple-50 dark:bg-purple-900/30',
        textProgram600: 'text-purple-600 dark:text-purple-400',
        textProgram700: 'text-purple-700 dark:text-purple-300',
        heart: 'text-purple-500'
      },
      orange: {
        border: 'border-orange-500',
        bg50: 'bg-orange-50 dark:bg-orange-900/30',
        border200: 'border-orange-200 dark:border-orange-800',
        text600: 'text-orange-600 dark:text-orange-400',
        text700: 'text-orange-700 dark:text-orange-300',
        bg500: 'bg-orange-500',
        borderProgram: 'border-orange-200 dark:border-orange-800',
        bgProgram50: 'bg-orange-50 dark:bg-orange-900/30',
        textProgram600: 'text-orange-600 dark:text-orange-400',
        textProgram700: 'text-orange-700 dark:text-orange-300',
        heart: 'text-orange-500'
      },
      red: {
        border: 'border-red-500',
        bg50: 'bg-red-50 dark:bg-red-900/30',
        border200: 'border-red-200 dark:border-red-800',
        text600: 'text-red-600 dark:text-red-400',
        text700: 'text-red-700 dark:text-red-300',
        bg500: 'bg-red-500',
        borderProgram: 'border-red-200 dark:border-red-800',
        bgProgram50: 'bg-red-50 dark:bg-red-900/30',
        textProgram600: 'text-red-600 dark:text-red-400',
        textProgram700: 'text-red-700 dark:text-red-300',
        heart: 'text-red-500'
      },
      indigo: {
        border: 'border-indigo-500',
        bg50: 'bg-indigo-50 dark:bg-indigo-900/30',
        border200: 'border-indigo-200 dark:border-indigo-800',
        text600: 'text-indigo-600 dark:text-indigo-400',
        text700: 'text-indigo-700 dark:text-indigo-300',
        bg500: 'bg-indigo-500',
        borderProgram: 'border-indigo-200 dark:border-indigo-800',
        bgProgram50: 'bg-indigo-50 dark:bg-indigo-900/30',
        textProgram600: 'text-indigo-600 dark:text-indigo-400',
        textProgram700: 'text-indigo-700 dark:text-indigo-300',
        heart: 'text-indigo-500'
      },
      pink: {
        border: 'border-pink-500',
        bg50: 'bg-pink-50 dark:bg-pink-900/30',
        border200: 'border-pink-200 dark:border-pink-800',
        text600: 'text-pink-600 dark:text-pink-400',
        text700: 'text-pink-700 dark:text-pink-300',
        bg500: 'bg-pink-500',
        borderProgram: 'border-pink-200 dark:border-pink-800',
        bgProgram50: 'bg-pink-50 dark:bg-pink-900/30',
        textProgram600: 'text-pink-600 dark:text-pink-400',
        textProgram700: 'text-pink-700 dark:text-pink-300',
        heart: 'text-pink-500'
      }
    }
    return colorMap[color] || colorMap.blue
  }

  const curriculumData = {
    overview: {
      totalLevels: language === "bn" ? "৬ লেভেল" : 6,
      totalYears: language === "bn" ? "২২ বছর" : 22,
      ageRange: language === "bn" ? "৪-২৫ বছর" : "4-25 Years",
      streams: language === "bn" ? ["মাদরাসা", "জেনারেল", "কারিগরি"] : ["Madrasa", "General", "Technical"],
      levelsLabel: language === "bn" ? "লেভেল" : "Levels",
      yearsLabel: language === "bn" ? "বছর" : "Years",
      ageRangeLabel: language === "bn" ? "বয়সসীমা" : "Age Range",
      streamsLabel: language === "bn" ? "শিক্ষা ধারা" : "Education Streams"
    },
    levels: [
      {
        level: language === "bn" ? "লেভেল ১" : "Level 1",
        title: language === "bn" ? "মৌলিক শিক্ষার ভিত্তি" : "Foundation of Basic Education",
        age: language === "bn" ? "৪-৮ বছর" : "4-8 Years",
        duration: language === "bn" ? "৫ বছর" : "5 Years",
        color: "blue",
        icon: BookOpen,
        description: language === "bn" ? "প্রাথমিক শিক্ষার ভিত্তি প্রস্তুত ও মূল্যবোধ গঠন" : "Preparation of basic education foundation and value building",
        subjects: {
          madrasa: language === "bn" 
            ? ["কায়েদা ও নাযেরা", "বাংলা-ইংরেজি-আরবি বর্ণমালা", "প্রাথমিক দুআ ও সুরা"]
            : ["Qaida & Nazira", "Bengali-English-Arabic Alphabets", "Basic Duas & Surahs"],
          general: language === "bn" 
            ? ["IPC কারিকুলাম", "বেসিক গণিত", "বাংলা ও ইংরেজি ভাষা"]
            : ["IPC Curriculum", "Basic Mathematics", "Bengali & English Language"],
          technical: language === "bn" 
            ? ["কম্পিউটার পরিচিতি", "হাতের লেখা", "অঙ্কন"]
            : ["Computer Basics", "Handwriting", "Drawing"]
        },
        madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
        generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
        technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
      },
      {
        level: language === "bn" ? "লেভেল ২" : "Level 2",
        title: language === "bn" ? "হিফজ ও মৌলিক শিক্ষা" : "Hifz & Basic Education",
        age: language === "bn" ? "৯-১৩ বছর" : "9-13 Years",
        duration: language === "bn" ? "৫ বছর" : "5 Years", 
        color: "orange",
        icon: BookText,
        description: language === "bn" ? "হিফজুল কুরআন ও মৌলিক শিক্ষার সমন্বয়" : "Integration of Quran Memorization and Basic Education",
        subjects: {
          madrasa: language === "bn" 
            ? ["হিফজুল কুরআন", "তাজভিদ শিক্ষা", "নুরানি কায়েদা"]
            : ["Quran Memorization", "Tajweed Education", "Noorani Qaida"],
          general: language === "bn" 
            ? ["IMYC কারিকুলাম", "O-Level প্রস্তুতি", "বিজ্ঞান ও গণিত"]
            : ["IMYC Curriculum", "O-Level Preparation", "Science & Mathematics"],
          technical: language === "bn" 
            ? ["গ্রাফিক্স ডিজাইন", "রান্না প্রশিক্ষণ", "সেলাই প্রশিক্ষণ"]
            : ["Graphics Design", "Cooking Training", "Sewing Training"]
        },
        madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
        generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
        technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
      },
      {
        level: language === "bn" ? "লেভেল ৩" : "Level 3",
        title: language === "bn" ? "বিশেষায়িত শিক্ষার সূচনা" : "Beginning of Specialized Education", 
        age: language === "bn" ? "১৪-১৫ বছর" : "14-15 Years",
        duration: language === "bn" ? "২ বছর" : "2 Years",
        color: "purple",
        icon: GraduationCap,
        description: language === "bn" ? "দরসে নিজামী ও আন্তর্জাতিক শিক্ষার সমন্বয়" : "Integration of Dars-e-Nizami and International Education",
        subjects: {
          madrasa: language === "bn" 
            ? ["দরসে নিজামী", "উর্দু ও ফার্সি ভাষা", "ইসলামিক জ্যোতির্বিদ্যা"]
            : ["Dars-e-Nizami", "Urdu & Persian Language", "Islamic Astronomy"],
          general: language === "bn" 
            ? ["O-Level সম্পূর্ণ", "SSC প্রস্তুতি", "বিজ্ঞান বিভাগ"]
            : ["O-Level Completion", "SSC Preparation", "Science Division"],
          technical: language === "bn" 
            ? ["রোবোটিক্স", "ড্রোন টেকনোলজি", "৩D প্রিন্টিং"]
            : ["Robotics", "Drone Technology", "3D Printing"]
        },
        madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
        generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
        technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
      },
      {
        level: language === "bn" ? "লেভেল ৪" : "Level 4",
        title: language === "bn" ? "উচ্চ মাধ্যমিক শিক্ষা" : "Higher Secondary Education",
        age: language === "bn" ? "১৬-১৯ বছর" : "16-19 Years", 
        duration: language === "bn" ? "৪ বছর" : "4 Years",
        color: "orange",
        icon: Target,
        description: language === "bn" ? "উচ্চতর শিক্ষা ও পেশাগত দিকনির্দেশনা" : "Higher Education and Career Guidance",
        subjects: {
          madrasa: language === "bn" 
            ? ["তাফসীর ও হাদীস", "ফিকহ শিক্ষা", "আরবি সাহিত্য"]
            : ["Tafsir & Hadith", "Fiqh Education", "Arabic Literature"],
          general: language === "bn" 
            ? ["A-Level/এইচএসসি", "বিশ্ববিদ্যালয় প্রস্তুতি", "বিসিএস গাইডলাইন"]
            : ["A-Level/HSC", "University Preparation", "BCS Guidance"],
          technical: language === "bn" 
            ? ["ভিডিও এডিটিং", "ওয়েব ডেভেলপমেন্ট", "সাইবার সিকিউরিটি"]
            : ["Video Editing", "Web Development", "Cyber Security"]
        },
        madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
        generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
        technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
      },
      {
        level: language === "bn" ? "লেভেল ৫" : "Level 5",
        title: language === "bn" ? "স্নাতক পর্যায়" : "Undergraduate Level",
        age: language === "bn" ? "২০-২৩ বছর" : "20-23 Years",
        duration: language === "bn" ? "৪ বছর" : "4 Years", 
        color: "red",
        icon: Award,
        description: language === "bn" ? "স্নাতক ও স্নাতকোত্তর শিক্ষা সমন্বয়" : "Integration of Undergraduate and Postgraduate Education",
        subjects: {
          madrasa: language === "bn" 
            ? ["মুফতি কোর্স", "তাকমিল পর্যায়", "ইসলামিক রিসার্চ"]
            : ["Mufti Course", "Takmeel Level", "Islamic Research"],
          general: language === "bn" 
            ? ["স্নাতক ডিগ্রী", "পিএইচডি প্রস্তুতি", "পেশাগত প্রশিক্ষণ"]
            : ["Undergraduate Degree", "PhD Preparation", "Professional Training"],
          technical: language === "bn" 
            ? ["সফটওয়্যার ইঞ্জিনিয়ারিং", "ডাটা সাইন্স", "AI & ML"]
            : ["Software Engineering", "Data Science", "AI & ML"]
        },
        madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
        generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
        technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
      },
      {
        level: language === "bn" ? "লেভেল ৬" : "Level 6",
        title: language === "bn" ? "ডক্টরেট ও বিশেষায়িত গবেষণা" : "Doctorate & Specialized Research",
        age: language === "bn" ? "২৪-২৫ বছর" : "24-25 Years",
        duration: language === "bn" ? "২ বছর" : "2 Years",
        color: "indigo",
        icon: Globe,
        description: language === "bn" ? "গবেষণা ও বিশেষায়িত উচ্চতর শিক্ষা" : "Research and Specialized Higher Education",
        subjects: {
          madrasa: language === "bn" 
            ? ["ইসলামিক রিসার্চ", "আন্তর্জাতিক বক্তা", "লেখালেখি"]
            : ["Islamic Research", "International Speaker", "Writing"],
          general: language === "bn" 
            ? ["পিএইচডি সম্পূর্ণ", "পোস্ট-ডক্টরাল", "একাডেমিক ক্যারিয়ার"]
            : ["PhD Completion", "Post-Doctoral", "Academic Career"],
          technical: language === "bn" 
            ? ["রিসার্চ এন্ড ডেভেলপমেন্ট", "টেক উদ্যোক্তা", "ইনোভেশন"]
            : ["Research & Development", "Tech Entrepreneurship", "Innovation"]
        },
        madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
        generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
        technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
      }
    ],
    specialPrograms: [
      {
        title: language === "bn" ? "হুফ্ফাজ এডুকেশন সিস্টেম" : "Huffaz Education System",
        description: language === "bn" ? "হাফেজ শিক্ষার্থীদের জন্য বিশেষায়িত কারিকুলাম" : "Specialized curriculum for Hafiz students",
        duration: language === "bn" ? "১৪ বছর" : "14 Years",
        features: language === "bn" 
          ? ["হিফজ রিভিশন", "দরসে নিজামী", "আন্তর্জাতিক শিক্ষা", "কারিগরি প্রশিক্ষণ"]
          : ["Hifz Revision", "Dars-e-Nizami", "International Education", "Technical Training"],
        color: "orange"
      },
      {
        title: language === "bn" ? "মহিলা শাখা" : "Women's Section",
        description: language === "bn" ? "নারী শিক্ষার্থীদের জন্য বিশেষ ব্যবস্থা" : "Special arrangements for female students",
        duration: language === "bn" ? "শীঘ্রই আসছে" : "Coming Soon",
        features: language === "bn" 
          ? ["পরিবেশ উপযোগী শিক্ষা", "নারী শিক্ষিকার তত্ত্বাবধান", "আধুনিক সুযোগ-সুবিধা"]
          : ["Environment-friendly Education", "Female Teacher Supervision", "Modern Facilities"],
        color: "pink"
      }
    ],
    sectionTitles: {
      curriculumLevels: language === "bn" ? "কারিকুলাম লেভেল সমূহ" : "Curriculum Levels",
      specialPrograms: language === "bn" ? "বিশেষ কার্যক্রম" : "Special Programs",
      ctaTitle: language === "bn" ? "আপনার সন্তানের ভবিষ্যত গড়তে আজই যোগাযোগ করুন" : "Contact today to build your child's future",
      ctaDescription: language === "bn" ? "আমাদের কারিকুলাম সম্পর্কে বিস্তারিত জানতে এবং ভর্তি প্রক্রিয়া শুরু করতে" : "To learn more about our curriculum and start the admission process",
      contactButton: language === "bn" ? "ভর্তির জন্য যোগাযোগ" : "Contact for Admission",
      downloadButton: language === "bn" ? "ব্রোশার ডাউনলোড" : "Download Brochure"
    }
  }

  const handleDownloadBrochure = () => {
    const message = language === "bn" ? 'ব্রোশার ডাউনলোড শুরু হচ্ছে...' : 'Brochure download starting...'
    alert(message)
    // window.open('/path-to-brochure.pdf', '_blank')
  }

  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroHeader />
      </Suspense>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-18" dir="ltr">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="space-y-8"
        >
        {/* Main Heading Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
            {language === "bn" ? "MIC কারিকুলাম - মানযিল ইন্টারন্যাশনাল ইনস্টিটিউট" : "MIC Curriculum - Manzil International Institute"}
          </h1>
          <h2 className="text-xl md:text-2xl text-[#00AEEF] dark:text-[#00AEEF]/80 mb-6 kalpurush-font">
              {language === "bn" ? "মাদরাসা, জেনারেল এবং কারিগরি শিক্ষার সমন্বয়" : "Integration of Madrasa, General & Technical Education"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font">
            {language === "bn"
              ? "৬টি লেভেলে ২২ বছরের পূর্ণাঙ্গ শিক্ষা ব্যবস্থা - হিফজ, দরসে নিজামী, আন্তর্জাতিক কারিকুলাম এবং কারিগরি প্রশিক্ষণের সমন্বয়"
              : "Complete 22-year education system in 6 levels - Integration of Hifz, Dars-e-Nizami, International Curriculum & Technical Training"
            }
          </p>
        </section>

        {/* Overview Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Layers className="w-8 h-8 text-[#00AEEF] dark:text-[#00AEEF]/80" />
              </div>
              <div className="text-2xl font-bold text-[#00AEEF] dark:text-[#00AEEF]/80">{curriculumData.overview.totalLevels}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">{curriculumData.overview.levelsLabel}</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{curriculumData.overview.totalYears}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">{curriculumData.overview.yearsLabel}</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{curriculumData.overview.ageRange}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">{curriculumData.overview.ageRangeLabel}</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{language === "bn" ? '৩' : '3'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">{curriculumData.overview.streamsLabel}</div>
            </div>
          </div>
        </section>

        {/* Curriculum Levels */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white kalpurush-font text-center mb-8">
            {curriculumData.sectionTitles.curriculumLevels}
          </h2>
          
          {curriculumData.levels.map((level, index) => {
            const colorClasses = getColorClasses(level.color)
            return (
            <div key={index} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 ${colorClasses.border} shadow-lg`}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Level Header */}
                <div className="lg:w-1/4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colorClasses.bg50} border ${colorClasses.border200} mb-4`}>
                    <level.icon className={`w-4 h-4 ${colorClasses.text600}`} />
                    <span className={`font-semibold ${colorClasses.text700} kalpurush-font`}>{level.level}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 kalpurush-font">
                    {level.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{level.age}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{level.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mt-3 kalpurush-font text-sm">
                    {level.description}
                  </p>
                </div>

                {/* Subjects Grid */}
                <div className="lg:w-3/4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Madrasa Subjects */}
                    <div className="bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BookText className="w-4 h-4 text-[#00AEEF] dark:text-[#00AEEF]/80" />
                        <h4 className="font-semibold text-[#00AEEF]/90 dark:text-[#00AEEF]/70 kalpurush-font">{level.madrasaLabel}</h4>
                      </div>
                      <ul className="space-y-2">
                        {level.subjects.madrasa.map((subject, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#00AEEF] rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* General Subjects */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-green-700 dark:text-green-300 kalpurush-font">{level.generalLabel}</h4>
                      </div>
                      <ul className="space-y-2">
                        {level.subjects.general.map((subject, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Subjects */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 kalpurush-font">{level.technicalLabel}</h4>
                      </div>
                      <ul className="space-y-2">
                        {level.subjects.technical.map((subject, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </section>

        {/* Special Programs */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white kalpurush-font text-center mb-8">
            {curriculumData.sectionTitles.specialPrograms}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {curriculumData.specialPrograms.map((program, index) => {
              const programColorClasses = getColorClasses(program.color)
              return (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${programColorClasses.borderProgram}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${programColorClasses.bgProgram50} border ${programColorClasses.borderProgram} mb-4`}>
                  <Zap className={`w-4 h-4 ${programColorClasses.textProgram600}`} />
                  <span className={`text-sm font-medium ${programColorClasses.textProgram700}`}>{program.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 kalpurush-font">
                  {program.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 kalpurush-font">
                  {program.description}
                </p>

                <ul className="space-y-2">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Heart className={`w-4 h-4 ${programColorClasses.heart}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              )
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mt-12 bg-gradient-to-r from-[#00AEEF] to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 kalpurush-font">
            {curriculumData.sectionTitles.ctaTitle}
          </h3>
          <p className="mb-6 opacity-90 kalpurush-font">
            {curriculumData.sectionTitles.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admission">
              <Button className="bg-white text-[#00AEEF] hover:bg-gray-100">
                <span className="kalpurush-font">{curriculumData.sectionTitles.contactButton}</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={handleDownloadBrochure}
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="kalpurush-font">{curriculumData.sectionTitles.downloadButton}</span>
            </Button>
          </div>
        </section>
        </AnimatedGroup>
      </main>
      <Suspense fallback={<div>Loading...</div>}>
        <FooterSection />
      </Suspense>
    </div>
  )
}
