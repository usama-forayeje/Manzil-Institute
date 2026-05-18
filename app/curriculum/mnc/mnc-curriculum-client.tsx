'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientHeader } from '@/components/layout/header';
import LoadingSkeleton from '@/components/core/LoadingSkeleton';
import { Suspense } from 'react';
import {
  BookOpen,
  Clock,
  GraduationCap,
  Cpu,
  School,
  Star,
  Users,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useMNCCurriculum } from '@/hooks/useData';
import { useLanguageStore } from '@/store/language';
import { AnimatedGroup } from '@/components/ui/animated-group';

import { MNCCurriculumData, Language } from '@/types/api';

// Stage icons mapping
const stageIcons = {
  'Khususi Jamat': Star,
  'Taiseer Jamat 1st': Users,
  'Taiseer Jamat 2nd': Users,
  'Mizan Jamat': GraduationCap,
  'Nahbemir Jamat': GraduationCap,
  'Hedayetun Nahw Jamat': GraduationCap,
  'Kafia Jamat': GraduationCap,
  'খুসুসী জামাত': Star,
  'তাইসীর জামাত ১ম': Users,
  'তাইসীর জামাত ২য়': Users,
  'মিজান জামাত': GraduationCap,
  'নাহবেমীর জামাত': GraduationCap,
  'হেদায়েতুন নাহু জামাত': GraduationCap,
  'কাফিয়া জামাত': GraduationCap,
};

// Color mapping for stages
const stageColors = [
  '#3B82F6', // blue
  '#22C55E', // green
  '#A855F7', // purple
  '#F97316', // orange
  '#EF4444', // red
  '#6366F1', // indigo
  '#14B8A6', // teal
];

// Subject details for modal
const getSubjectDetails = (subjectName, type, language) => {
  const subjectData = {
    // Madrasa subjects
    'Qaida & Nazira': {
      name: language === 'bn' ? 'কায়েদা ও নাজেরা' : 'Qaida & Nazira',
      description: language === 'bn'
        ? 'আরবি ভাষা শেখার প্রাথমিক পদ্ধতি। কুরআন পড়ার জন্য মৌলিক জ্ঞান অর্জন।'
        : 'Basic method for learning Arabic language. Fundamental knowledge for reading the Quran.',
      objectives: [
        language === 'bn' ? 'আরবি বর্ণমালা শেখা' : 'Learn Arabic alphabet',
        language === 'bn' ? 'সঠিক উচ্চারণ অনুশীলন' : 'Practice correct pronunciation',
        language === 'bn' ? 'সহজ আয়াত পড়া' : 'Read simple verses',
      ],
    },
    'Dars-e-Nizami': {
      name: language === 'bn' ? 'দরসে নিজামী' : 'Dars-e-Nizami',
      description: language === 'bn'
        ? 'ইসলামিক শিক্ষার একটি ব্যাপক পাঠ্যক্রম যার মধ্যে রয়েছে ফিকহ, উসুল, তাফসীর ও হাদিস।'
        : 'A comprehensive curriculum of Islamic studies including Fiqh, Usul, Tafsir and Hadith.',
      objectives: [
        language === 'bn' ? 'ইসলামিক জ্ঞানের মৌলিক বিষয়' : 'Fundamentals of Islamic knowledge',
        language === 'bn' ? 'আরবি ভাষা দক্ষতা' : 'Arabic language proficiency',
        language === 'bn' ? 'ইসলামী আইন ও বিধান' : 'Islamic jurisprudence',
      ],
    },
    'Tajweed Rules': {
      name: language === 'bn' ? 'তাজভিদের নিয়ম' : 'Tajweed Rules',
      description: language === 'bn'
        ? 'কুরআনের সঠিক উচ্চারণ ও আবৃত্তির নিয়মাবলী।'
        : 'Rules for correct pronunciation and recitation of the Quran.',
      objectives: [
        language === 'bn' ? 'মাখারিজ আল-হুরুফ' : 'Makharij al-Huruf',
        language === 'bn' ? 'সিফাত আল-হুরুফ' : 'Sifat al-Huruf',
        language === 'bn' ? 'তাজভিদ আহকাম' : 'Tajweed Ahkam',
      ],
    },
    'Hadith Studies': {
      name: language === 'bn' ? 'হাদিস অধ্যয়ন' : 'Hadith Studies',
      description: language === 'bn'
        ? 'নবী করীম (সা.) এর হাদিস সমূহ অধ্যয়ন ও বিশ্লেষণ।'
        : 'Study and analysis of the sayings of Prophet Muhammad (peace be upon him).',
      objectives: [
        language === 'bn' ? 'সহিহ বুখারী ও মুসলিম' : 'Sahih Bukhari & Muslim',
        language === 'bn' ? 'হাদিসের শর্তাবলী' : 'Conditions of Hadith',
        language === 'bn' ? 'ইসলামী জীবনবিধান' : 'Islamic lifestyle',
      ],
    },
    'Islamic History': {
      name: language === 'bn' ? 'ইসলামিক ইতিহাস' : 'Islamic History',
      description: language === 'bn'
        ? 'ইসলামের ইতিহাস ও সভ্যতার বিকাশ।'
        : 'History and development of Islamic civilization.',
      objectives: [
        language === 'bn' ? 'খেলাফতের ইতিহাস' : 'History of Caliphate',
        language === 'bn' ? 'ইসলামী সভ্যতা' : 'Islamic civilization',
        language === 'bn' ? 'মুসলিম উম্মাহর একতা' : 'Unity of Muslim Ummah',
      ],
    },
    // General subjects
    'English Alphabet': {
      name: language === 'bn' ? 'ইংলিশ বর্ণমালা' : 'English Alphabet',
      description: language === 'bn'
        ? 'ইংরেজি ভাষার মৌলিক বর্ণ ও উচ্চারণ শেখা।'
        : 'Learning basic English letters and pronunciation.',
      objectives: [
        language === 'bn' ? '২৬টি বর্ণ শেখা' : 'Learn 26 letters',
        language === 'bn' ? 'সঠিক উচ্চারণ' : 'Correct pronunciation',
        language === 'bn' ? 'সহজ শব্দ পড়া' : 'Read simple words',
      ],
    },
    'Basic Mathematics': {
      name: language === 'bn' ? 'মৌলিক গণিত' : 'Basic Mathematics',
      description: language === 'bn'
        ? 'গাণিতিক মৌল্যায়নের প্রাথমিক ধারণা।'
        : 'Basic concepts of mathematical evaluation.',
      objectives: [
        language === 'bn' ? 'যোগ-বিয়োগ' : 'Addition and subtraction',
        language === 'bn' ? 'গুণ-ভাগ' : 'Multiplication and division',
        language === 'bn' ? 'সহজ সমস্যা সমাধান' : 'Simple problem solving',
      ],
    },
    'Bangla Language': {
      name: language === 'bn' ? 'বাংলা ভাষা' : 'Bangla Language',
      description: language === 'bn'
        ? 'মাতৃভাষা বাংলার মৌলিক শিক্ষা।'
        : 'Basic education in native language Bangla.',
      objectives: [
        language === 'bn' ? 'বর্ণমালা শেখা' : 'Learn alphabet',
        language === 'bn' ? 'পড়া ও লেখা' : 'Reading and writing',
        language === 'bn' ? 'ব্যাকরণ' : 'Grammar',
      ],
    },
    'NCTB Curriculum': {
      name: language === 'bn' ? 'NCTB কারিকুলাম' : 'NCTB Curriculum',
      description: language === 'bn'
        ? 'জাতীয় পাঠ্যক্রম অনুযায়ী সাধারণ শিক্ষা।'
        : 'General education according to National Curriculum.',
      objectives: [
        language === 'bn' ? 'সাধারণ শিক্ষার মান' : 'Standard general education',
        language === 'bn' ? 'পরীক্ষার প্রস্তুতি' : 'Exam preparation',
        language === 'bn' ? 'সার্টিফিকেশন' : 'Certification',
      ],
    },
    // Technical subjects
    'Computer Basics': {
      name: language === 'bn' ? 'কম্পিউটার বেসিক' : 'Computer Basics',
      description: language === 'bn'
        ? 'কম্পিউটারের মৌলিক জ্ঞান ও ব্যবহার।'
        : 'Basic knowledge and use of computers.',
      objectives: [
        language === 'bn' ? 'কম্পিউটার পরিচিতি' : 'Computer introduction',
        language === 'bn' ? 'কীবোর্ড ও মাউস ব্যবহার' : 'Keyboard and mouse use',
        language === 'bn' ? 'অফিস অ্যাপ্লিকেশন' : 'Office applications',
      ],
    },
    'Art & Craft': {
      name: language === 'bn' ? 'আর্ট এবং ক্রাফ্ট' : 'Art & Craft',
      description: language === 'bn'
        ? 'সৃজনশীল শিল্প ও কারুশিল্প।'
        : 'Creative arts and crafts.',
      objectives: [
        language === 'bn' ? 'চিত্রাঙ্কন' : 'Painting',
        language === 'bn' ? 'কারুশিল্প' : 'Craft work',
        language === 'bn' ? 'সৃজনশীলতা' : 'Creativity',
      ],
    },
    'Web Development': {
      name: language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development',
      description: language === 'bn'
        ? 'আধুনিক ওয়েব সাইট তৈরি ও ডিজাইন।'
        : 'Modern website creation and design.',
      objectives: [
        language === 'bn' ? 'HTML, CSS, JavaScript' : 'HTML, CSS, JavaScript',
        language === 'bn' ? 'রেসপন্সিভ ডিজাইন' : 'Responsive design',
        language === 'bn' ? 'ফ্রন্টএন্ড ফ্রেমওয়ার্ক' : 'Frontend frameworks',
      ],
    },
    'Graphic Design': {
      name: language === 'bn' ? 'গ্রাফিক ডিজাইন' : 'Graphic Design',
      description: language === 'bn'
        ? 'ভিজ্যুয়াল ডিজাইন ও গ্রাফিক্স।'
        : 'Visual design and graphics.',
      objectives: [
        language === 'bn' ? 'ফটোশপ' : 'Photoshop',
        language === 'bn' ? 'ইলাস্ট্রেটর' : 'Illustrator',
        language === 'bn' ? 'ইউআই ডিজাইন' : 'UI Design',
      ],
    },
  };

  // Check if subject exists in our data
  for (const key in subjectData) {
    if (subjectName.includes(key) || key.includes(subjectName)) {
      return subjectData[key];
    }
  }

  // Default subject data
  return {
    name: subjectName,
    description: language === 'bn'
      ? `${subjectName} বিষয়ের বিস্তারিত তথ্য।`
      : `Detailed information about ${subjectName}.`,
    objectives: [
      language === 'bn' ? 'মৌলিক ধারণা' : 'Basic concepts',
      language === 'bn' ? 'ব্যবহারিক প্রয়োগ' : 'Practical application',
      language === 'bn' ? 'দক্ষতা উন্নয়ন' : 'Skill development',
    ],
  };
};

export default function MNCCurriculumClientPage() {
  const { language } = useLanguageStore();
  const {
    data: curriculumData,
    isLoading,
    error,
    refetch,
  } = useMNCCurriculum(language);

  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-18">
          <LoadingSkeleton />
        </main>
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
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-18">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
              {language === 'bn'
                ? 'তথ্য লোড করতে সমস্যা হয়েছে'
                : 'Failed to Load Curriculum Data'}
            </h2>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white rounded-xl font-semibold kalpurush-font transition-colors"
            >
              {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!curriculumData) {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientHeader />
        </Suspense>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-18">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientHeader />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-18">
        <AnimatedGroup
          className="space-y-8"
        >
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00AEEF]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00AEEF]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center py-12 md:py-16">
              {/* Icon */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00AEEF] to-[#00AEEF]/80 rounded-2xl flex items-center justify-center shadow-lg shadow-[#00AEEF]/30">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font tracking-tight">
                {language === 'bn' ? 'MNC কারিকুলাম' : 'MNC Curriculum'}
              </h1>

              {/* Subtitle */}
              <h2 className="text-xl md:text-2xl text-[#00AEEF] mb-6 kalpurush-font font-medium">
                {language === 'bn' ? 'মানযিল ন্যাশনাল কারিকুলাম' : 'Manzil National Curriculum'}
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font leading-relaxed">
                {language === 'bn'
                  ? 'মাদ্রাসা, সাধারণ শিক্ষা ও কারিগরি শিক্ষার সমন্বয়ে ৭ বছরের পূর্ণাঙ্গ শিক্ষা ব্যবস্থা'
                  : '7-year complete education system combining Madrasa, General & Technical Education'}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                  <div className="w-8 h-8 bg-[#00AEEF]/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[#00AEEF]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 kalpurush-font">
                    {language === 'bn' ? '৭টি স্টেজ' : '7 Stages'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                  <div className="w-8 h-8 bg-[#00AEEF]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#00AEEF]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 kalpurush-font">
                    {language === 'bn' ? '৭ বছর' : '7 Years'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                  <div className="w-8 h-8 bg-[#00AEEF]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#00AEEF]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 kalpurush-font">
                    {language === 'bn' ? 'বয়স ১০-২০' : 'Age 10-20'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Curriculum Stages - Horizontal Timeline */}
          <section className="py-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white kalpurush-font mb-4">
                {language === 'bn' ? 'কারিকুলাম স্টেজসমূহ' : 'Curriculum Stages'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 kalpurush-font max-w-2xl mx-auto">
                {language === 'bn'
                  ? 'MNC তে ৭ বছরের শিক্ষা যাত্রায় ৭টি ধাপ'
                  : '7 Stages in the 7-year educational journey at MNC'}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-[#00AEEF] hover:text-white transition-all duration-300 transform hover:scale-110 border border-gray-200 dark:border-gray-700"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-[#00AEEF] hover:text-white transition-all duration-300 transform hover:scale-110 border border-gray-200 dark:border-gray-700"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Horizontal Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory no-scrollbar"
              >
                {/* Connecting Line */}
                <div className="absolute top-[90px] left-0 right-0 h-1 bg-gradient-to-r from-[#00AEEF] via-[#00AEEF]/50 to-[#00AEEF] opacity-20 dark:opacity-10 pointer-events-none" />

                {curriculumData.levels.map((level, idx) => {
                  const IconComponent = stageIcons[level.level] || Star;
                  const stageColor = stageColors[idx % stageColors.length];

                  return (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-[340px] md:w-[360px] snap-center"
                    >
                      {/* Connecting Dot and Line */}
                      <div className="relative mb-4">
                        {/* Timeline Dot */}
                        <div
                          className="w-4 h-4 rounded-full mx-auto relative z-10 shadow-lg"
                          style={{ backgroundColor: stageColor }}
                        />
                        {/* Timeline Line (before) */}
                        {idx > 0 && (
                          <div
                            className="absolute top-2 left-0 right-1/2 h-0.5 -translate-y-1/2"
                            style={{
                              background: `linear-gradient(to right, ${stageColors[(idx - 1) % stageColors.length]}, ${stageColor})`
                            }}
                          />
                        )}
                        {/* Timeline Line (after) */}
                        {idx < curriculumData.levels.length - 1 && (
                          <div
                            className="absolute top-2 left-1/2 right-0 h-0.5 -translate-y-1/2"
                            style={{
                              background: `linear-gradient(to right, ${stageColor}, ${stageColors[(idx + 1) % stageColors.length]})`
                            }}
                          />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                      >
                        {/* Card Header */}
                        <div
                          className="relative p-6 pb-8"
                          style={{
                            background: `linear-gradient(135deg, ${stageColor}15 0%, ${stageColor}05 100%)`
                          }}
                        >
                          {/* Stage Number */}
                          <div className="absolute top-4 right-4">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                              style={{ backgroundColor: stageColor }}
                            >
                              {idx + 1}
                            </div>
                          </div>

                          {/* Icon */}
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                            style={{ backgroundColor: `${stageColor}20` }}
                          >
                            <IconComponent className="w-7 h-7" style={{ color: stageColor }} />
                          </div>

                          {/* Level Name */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white kalpurush-font mb-2">
                            {level.level}
                          </h3>

                          {/* Title */}
                          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 kalpurush-font mb-3">
                            {level.title}
                          </h4>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400 kalpurush-font">{level.age}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400 kalpurush-font">{level.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Body - Subjects */}
                        <div className="p-6 pt-0 space-y-4">
                          {/* Madrasa Subjects */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <School className="w-4 h-4 text-[#00AEEF]" />
                              <span className="text-xs font-semibold text-[#00AEEF] uppercase tracking-wide kalpurush-font">
                                {level.madrasaLabel}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {level.subjects.madrasa.slice(0, 3).map((subject, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => setSelectedSubject(getSubjectDetails(subject, 'madrasa', language))}
                                  className="px-3 py-1.5 bg-gradient-to-r from-[#00AEEF]/10 to-[#00AEEF]/5 hover:from-[#00AEEF]/20 hover:to-[#00AEEF]/10 text-[#00AEEF] dark:text-[#00AEEF] text-xs font-medium rounded-lg transition-all hover:scale-105 kalpurush-font"
                                >
                                  {subject}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* General Subjects */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="w-4 h-4 text-green-500" />
                              <span className="text-xs font-semibold text-green-500 uppercase tracking-wide kalpurush-font">
                                {level.generalLabel}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {level.subjects.general.slice(0, 3).map((subject, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => setSelectedSubject(getSubjectDetails(subject, 'general', language))}
                                  className="px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-lg transition-all hover:scale-105 kalpurush-font"
                                >
                                  {subject}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Technical Subjects */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Cpu className="w-4 h-4 text-purple-500" />
                              <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide kalpurush-font">
                                {level.technicalLabel}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {level.subjects.technical.slice(0, 3).map((subject, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => setSelectedSubject(getSubjectDetails(subject, 'technical', language))}
                                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-lg transition-all hover:scale-105 kalpurush-font"
                                >
                                  {subject}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-6 pb-6">
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 kalpurush-font">
                              {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Bottom Info */}
          <section className="py-8">
            <div className="bg-gradient-to-r from-[#00AEEF] to-[#00AEEF]/80 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 kalpurush-font">
                  {language === 'bn' ? 'সম্পূর্ণ শিক্ষা ব্যবস্থা' : 'Complete Education System'}
                </h3>
                <p className="text-white/90 max-w-2xl mx-auto kalpurush-font text-lg">
                  {language === 'bn'
                    ? 'আমরা আপনার সন্তানকে আধুনিক শিক্ষার সাথে ইসলামিক মূল্যবোধ শেখাতে প্রতিশ্রুতিবদ্ধ।'
                    : 'We are committed to teaching your children modern education with Islamic values.'}
                </p>
              </div>
            </div>
          </section>
        </AnimatedGroup>
      </main>

      {/* Subject Modal - Temporarily removed */}
      {/* {selectedSubject && (
        <SubjectModal
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
        />
      )} */}
    </div>
  );
}