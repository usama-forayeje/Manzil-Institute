'use client';

import React, { Suspense, useEffect } from 'react';
import { ClientHeader } from '@/components/header';
import FooterSection from '@/components/footer';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { AlertCircle } from 'lucide-react';
import { useMICCurriculum } from '@/hooks/useData';
import { useLanguageStore } from '@/lib/store';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Layers,
  Clock,
  Users,
  Star,
  BookText,
  GraduationCap,
  Cpu,
  Zap,
  Heart,
  Download,
  Target,
  Globe,
  Brain,
  Shield,
  Leaf,
  Code,
  Building,
  Trophy,
} from 'lucide-react';
import { MICCurriculumData, Language } from '@/types/api';

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
        duration: 0.5,
      },
    },
  },
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Star':
      return Star;
    case 'Users':
      return Users;
    case 'GraduationCap':
      return GraduationCap;
    case 'BookText':
      return BookText;
    case 'Layers':
      return Layers;
    case 'Target':
      return Target;
    case 'Globe':
      return Globe;
    case 'Brain':
      return Brain;
    case 'Shield':
      return Shield;
    case 'Leaf':
      return Leaf;
    case 'Code':
      return Code;
    case 'Building':
      return Building;
    case 'Trophy':
      return Trophy;
    case 'Cpu':
      return Cpu;
    default:
      return Star;
  }
};

interface ColorClasses {
  border: string;
  bg50: string;
  border200: string;
  text600: string;
  text700: string;
  bg500: string;
  borderProgram: string;
  bgProgram50: string;
  textProgram600: string;
  textProgram700: string;
  heart: string;
}

const getColorClasses = (color: string): ColorClasses => {
  const colorMap: Record<string, ColorClasses> = {
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
      heart: 'text-[#00AEEF]',
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
      heart: 'text-green-500',
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
      heart: 'text-purple-500',
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
      heart: 'text-orange-500',
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
      heart: 'text-red-500',
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
      heart: 'text-indigo-500',
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
      heart: 'text-pink-500',
    },
  };
  return colorMap[color] || colorMap.blue;
};

const toBengaliNumeral = (num: number, language: Language): string => {
  if (language !== 'bn') return num.toString();
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bengaliDigits[parseInt(d)]);
};

const handleDownloadBrochure = (language: Language): void => {
  const message =
    language === 'bn'
      ? 'ব্রোশার ডাউনলোড প্রক্রিয়া শুরু করা হয়েছে। ফাইলটি শীঘ্রই আপনার ডিভাইসে পৌঁছে যাবে।'
      : 'Brochure download process initiated. The file should arrive on your device shortly.';
  alert(message);
};

export default function MICCurriculumClientPage(): JSX.Element {
  const { language } = useLanguageStore();
  const {
    data: curriculumData,
    isLoading,
    error,
    refetch,
  } = useMICCurriculum(language);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientHeader />
        </Suspense>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-18">
          <LoadingSkeleton />
        </main>
        <Suspense fallback={<div>Loading...</div>}>
          <FooterSection />
        </Suspense>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientHeader />
        </Suspense>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-18">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'bn'
                ? 'তথ্য লোড করতে সমস্যা হয়েছে'
                : 'Failed to Load Curriculum Data'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error.message ||
                (language === 'bn'
                  ? 'অনুগ্রহ করে পুনরায় চেষ্টা করুন'
                  : 'Please try again later')}
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-[#00AEEF] hover:bg-[#00AEEF]/90"
            >
              {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
            </Button>
          </div>
        </main>
        <Suspense fallback={<div>Loading...</div>}>
          <FooterSection />
        </Suspense>
      </div>
    );
  }

  // If no data, show loading
  if (!curriculumData) {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientHeader />
        </Suspense>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-18">
          <LoadingSkeleton />
        </main>
        <Suspense fallback={<div>Loading...</div>}>
          <FooterSection />
        </Suspense>
      </div>
    );
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://institute.manzilgroupbd.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Curriculum',
        item: 'https://institute.manzilgroupbd.com/curriculum',
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ClientHeader />
      </Suspense>

      <main
        className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-18"
        dir="ltr"
      >
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.02,
                  delayChildren: 0.1,
                },
              },
            },
            ...transitionVariants,
          }}
          className="space-y-8"
        >
          {/* Main Heading Section */}
          <section className="text-center mb-12 bg-white dark:bg-gray-900 py-16 rounded-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
              {curriculumData.title}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-700 dark:text-[#00AEEF]/80 mb-6 kalpurush-font">
              {curriculumData.subtitle}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font">
              {language === 'bn'
                ? '৬টি লেভেলে ২২ বছরের পূর্ণাঙ্গ শিক্ষা ব্যবস্থা - হিফজ, দরসে নিজামী, আন্তর্জাতিক কারিকুলাম এবং কারিগরি প্রশিক্ষণের সমন্বয়'
                : 'Complete 22-year education system in 6 levels - Integration of Hifz, Dars-e-Nizami, International Curriculum & Technical Training'}
            </p>
          </section>

          {/* Overview Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-8 h-8 text-[#00AEEF] dark:text-[#00AEEF]/80" />
                </div>
                <div
                  className={`text-2xl font-bold text-[#00AEEF] dark:text-[#00AEEF]/80 ${
                    language === 'bn' ? 'kalpurush-font' : ''
                  }`}
                >
                  {toBengaliNumeral(curriculumData.overview.totalLevels, language)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
                  {curriculumData.overview.levelsLabel}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div
                  className={`text-2xl font-bold text-green-600 dark:text-green-400 ${
                    language === 'bn' ? 'kalpurush-font' : ''
                  }`}
                >
                  {toBengaliNumeral(curriculumData.overview.totalYears, language)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
                  {curriculumData.overview.yearsLabel}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div
                  className={`text-xl font-bold text-purple-600 dark:text-purple-400 ${
                    language === 'bn' ? 'kalpurush-font' : ''
                  }`}
                >
                  {curriculumData.overview.ageRange
                    .split('-')
                    .map(n => toBengaliNumeral(parseInt(n), language))
                    .join('-')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
                  {curriculumData.overview.ageRangeLabel}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div
                  className={`text-2xl font-bold text-orange-600 dark:text-orange-400 ${
                    language === 'bn' ? 'kalpurush-font' : ''
                  }`}
                >
                  {language === 'bn' ? '৩' : '3'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
                  {curriculumData.overview.streamsLabel}
                </div>
              </div>
            </div>
          </section>

          {/* Curriculum Levels Grid */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white kalpurush-font text-center mb-8">
              {curriculumData.sectionTitles.curriculumLevels}
            </h2>

            {curriculumData.levels.map((level, index) => {
              const colorClasses = getColorClasses(level.color);
              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 ${colorClasses.border} shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {/* Level Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="lg:w-1/4">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colorClasses.bg50} border ${colorClasses.border200} mb-4`}
                      >
                        {React.createElement(getIcon(level.icon), {
                          className: `w-4 h-4 ${colorClasses.text600}`,
                        })}
                        <span
                          className={`font-semibold ${colorClasses.text700} kalpurush-font`}
                        >
                          {level.level}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 kalpurush-font">
                        {level.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {level.age}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {level.duration}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-3 kalpurush-font text-sm">
                        {level.description}
                      </p>

                      {/* Darse Nizami Section */}
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <BookText className="w-4 h-4 text-[#00AEEF]" />
                          <h4 className="text-sm font-semibold text-[#00AEEF] kalpurush-font">
                            {language === 'bn' ? 'দরসে নিজামী' : 'Darse Nizami'}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">
                          {Array.isArray(level.darseNizami) ? level.darseNizami.join(', ') : level.darseNizami}
                        </p>
                      </div>
                    </div>

                    {/* Subjects Grid */}
                    <div className="lg:w-3/4">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* General Education */}
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <GraduationCap className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <h4 className="font-semibold text-green-700 dark:text-green-300 kalpurush-font">
                              {language === 'bn'
                                ? 'মাদ্রাসা/সাধারণ শিক্ষা'
                                : 'Madrasa/General Education'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {level.generalEducation.map((subject, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">
                                  {subject}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* International Education */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <h4 className="font-semibold text-purple-700 dark:text-purple-300 kalpurush-font">
                              {language === 'bn'
                                ? 'আন্তর্জাতিক শিক্ষা সার্টিফিকেশন'
                                : 'International Education Certification'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {level.internationalEducation.map(
                              (subject, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">
                                    {subject}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Technical & Activities */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Cpu className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <h4 className="font-semibold text-orange-700 dark:text-orange-300 kalpurush-font">
                              {language === 'bn'
                                ? 'কারিগরি ও কার্যক্রম'
                                : 'Technical & Activities'}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {level.technicalActivities.map((subject, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font">
                                  {subject}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Additional Info Grid */}
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {/* Language & Sports */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 kalpurush-font text-sm">
                              {language === 'bn'
                                ? 'ভাষা ও ক্রীড়া'
                                : 'Language & Sports'}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {level.languageSports.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Economy & Tarbiyah */}
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <h4 className="font-semibold text-red-700 dark:text-red-300 kalpurush-font text-sm">
                              {language === 'bn'
                                ? 'অর্থনীতি ও তরবিয়ত'
                                : 'Economy & Tarbiyah'}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {level.economyTarbiyah.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Food & Survival */}
                        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                            <h4 className="font-semibold text-pink-700 dark:text-pink-300 kalpurush-font text-sm">
                              {language === 'bn'
                                ? 'খাদ্য ও বেঁচে থাকা'
                                : 'Food & Survival'}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {level.foodSurvival.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-700 dark:text-gray-300 kalpurush-font"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Key Features Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white kalpurush-font text-center mb-8">
              {curriculumData.sectionTitles.keyFeatures}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curriculumData.keyFeatures.map((feature, index) => {
                const fTheme = getColorClasses(feature.color);
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                  >
                    <div
                      className={`w-12 h-12 ${fTheme.bg50} rounded-xl flex items-center justify-center mb-4`}
                    >
                      {React.createElement(getIcon(feature.icon), {
                        className: `w-6 h-6 ${fTheme.text600}`,
                      })}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 kalpurush-font">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 kalpurush-font text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center mt-12 bg-blue-500 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3">
              {curriculumData.sectionTitles.ctaTitle}
            </h3>
            <p className="mb-4 text-sm opacity-90">
              {curriculumData.sectionTitles.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/admission">
                <Button className="bg-white text-blue-500 hover:bg-gray-100 font-semibold">
                  <span className={language === 'bn' ? 'kalpurush-font' : ''}>
                    {curriculumData.sectionTitles.contactButton}
                  </span>
                </Button>
              </Link>
              <Link href="/curriculum/mnc">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold">
                  <span className={language === 'bn' ? 'kalpurush-font' : ''}>
                    {language === 'bn' ? 'MNC কারিকুলাম' : 'View MNC'}
                  </span>
                </Button>
              </Link>
              <Button
                className="bg-green-600 text-white hover:bg-green-700 font-semibold"
                onClick={() => handleDownloadBrochure(language)}
              >
                <Download className="w-4 h-4 mr-2" />
                <span className={language === 'bn' ? 'kalpurush-font' : ''}>
                  {curriculumData.sectionTitles.downloadButton}
                </span>
              </Button>
            </div>
          </section>
        </AnimatedGroup>
      </main>
      <Suspense fallback={<div>Loading...</div>}>
        <FooterSection />
      </Suspense>
    </div>
  );
}