'use client';

import {
  GraduationCap,
  BookText,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { useLanguageStore } from '@/store/language';
import { cn } from '@/lib/utils';

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
};

export default function CurriculumSelector() {
  const { language } = useLanguageStore();

  const curricula = [
    {
      id: 'mnc',
      name: language === 'bn' ? 'MNC কারিকুলাম' : 'MNC Curriculum',
      shortName: 'MNC',
      description:
        language === 'bn'
          ? 'মানযিল ন্যাশনাল কারিকুলাম - জাতীয় শিক্ষা ব্যবস্থার সাথে সমন্বয়'
          : 'Manzil National Curriculum - Integrated with National Education System',
      features:
        language === 'bn'
          ? [
              'জাতীয় কারিকুলাম অনুসরণ',
              'স্থানীয় শিক্ষা ব্যবস্থার সাথে সমন্বয়',
              'বিসিএস প্রস্তুতি অন্তর্ভুক্ত',
            ]
          : [
              'Follows National Curriculum',
              'Compatible with Local Education System',
              'Includes BCS Preparation',
            ],
      color: 'green',
      route: '/curriculum/mnc',
    },
    {
      id: 'mic',
      name: language === 'bn' ? 'MIC কারিকুলাম' : 'MIC Curriculum',
      shortName: 'MIC',
      description:
        language === 'bn'
          ? 'মানযিল ইন্টারন্যাশনাল কারিকুলাম - আন্তর্জাতিক মানের শিক্ষা ব্যবস্থার সাথে সমন্বয়'
          : 'Manzil International Curriculum - International Standard Education',
      features:
        language === 'bn'
          ? [
              'আন্তর্জাতিক কারিকুলাম',
              'মাদরাসা, জেনারেল ও কারিগরি শিক্ষার সমন্বয়',
              '২২ বছরের পূর্ণাঙ্গ শিক্ষা ব্যবস্থার সাথে সমন্বয়',
            ]
          : [
              'International Curriculum',
              'Integration of Madrasa, General & Technical Education',
              'Complete 22-year Education System',
            ],
      color: 'blue',
      route: '/curriculum/mic',
    },
  ];

  const getColorClasses = (color: 'blue' | 'green' | 'purple' | 'orange') => {
    const colorMap = {
      blue: {
        hoverBorder: 'hover:border-[#00AEEF]/60 dark:hover:border-[#00AEEF]/40',
        bg50: 'bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5',
        border200: 'border-[#00AEEF]/40 dark:border-[#00AEEF]/20',
        text600: 'text-[#00AEEF] dark:text-[#00AEEF]/80',
        text700: 'text-[#00AEEF]/90 dark:text-[#00AEEF]/70',
        bg500: 'bg-[#00AEEF]',
        border500: 'border-[#00AEEF]',
        bg100: 'bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10',
        text400: 'text-[#00AEEF]/80',
      },
      green: {
        hoverBorder: 'hover:border-green-300 dark:hover:border-green-600',
        bg50: 'bg-green-50 dark:bg-green-900/30',
        border200: 'border-green-200 dark:border-green-800',
        text600: 'text-green-600 dark:text-green-400',
        text700: 'text-green-700 dark:text-green-300',
        bg500: 'bg-green-500',
        border500: 'border-green-500',
        bg100: 'bg-green-100 dark:bg-green-900/30',
        text400: 'text-green-400',
      },
      purple: {
        hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
        bg50: 'bg-purple-50 dark:bg-purple-900/30',
        border200: 'border-purple-200 dark:border-purple-800',
        text600: 'text-purple-600 dark:text-purple-400',
        text700: 'text-purple-700 dark:text-purple-300',
        bg500: 'bg-purple-500',
        border500: 'border-purple-500',
        bg100: 'bg-purple-100 dark:bg-purple-900/30',
        text400: 'text-purple-400',
      },
      orange: {
        hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-600',
        bg50: 'bg-orange-50 dark:bg-orange-900/30',
        border200: 'border-orange-200 dark:border-orange-800',
        text600: 'text-orange-600 dark:text-orange-400',
        text700: 'text-orange-700 dark:text-orange-300',
        bg500: 'bg-orange-500',
        border500: 'border-orange-500',
        bg100: 'bg-orange-100 dark:bg-orange-900/30',
        text400: 'text-orange-400',
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const levels = [
    {
      level: language === 'bn' ? 'লেভেল ১' : 'Level 1',
      age: language === 'bn' ? '৪-৮ বছর' : '4-8 Years',
      duration: language === 'bn' ? '৫ বছর' : '5 Years',
      description:
        language === 'bn'
          ? 'মৌলিক শিক্ষা প্রতিষ্ঠান'
          : 'Foundation of Basic Education',
      features:
        language === 'bn'
          ? ['কায়েদা ও নাযেরা', 'বেসিক ভাষা শিক্ষা', 'খেলাধুলা ও শারীরিক বিকাশ']
          : [
              'Qaida & Nazira',
              'Basic Language Skills',
              'Sports & Physical Development',
            ],
      color: 'blue',
    },
    {
      level: language === 'bn' ? 'লেভেল ২' : 'Level 2',
      age: language === 'bn' ? '৯-১৩ বছর' : '9-13 Years',
      duration: language === 'bn' ? '৫ বছর' : '5 Years',
      description:
        language === 'bn'
          ? 'হিফজ ও মৌলিক শিক্ষার সমন্বয়'
          : 'Hifz & Basic Education Integration',
      features:
        language === 'bn'
          ? ['হিফজুল কুরআন', 'আন্তর্জাতিক কারিকুলাম', 'কারিগরি হাতেখড়ি']
          : [
              'Quran Memorization',
              'International Curriculum',
              'Technical Introduction',
            ],
      color: 'orange',
    },
    {
      level: language === 'bn' ? 'লেভেল ৩' : 'Level 3',
      age: language === 'bn' ? '১৪-১৫ বছর' : '14-15 Years',
      duration: language === 'bn' ? '২ বছর' : '2 Years',
      description:
        language === 'bn'
          ? 'বিশেষায়িত শিক্ষা'
          : 'Beginning of Specialized Education',
      features:
        language === 'bn'
          ? ['দরসে নিজামী', 'O-Level প্রস্তুতি', 'এডভান্সড কারিগরি হাতেখড়ি']
          : ['Dars-e-Nizami', 'O-Level Preparation', 'Advanced Technical'],
      color: 'purple',
    },
    {
      level: language === 'bn' ? 'লেভেল ৪-৬' : 'Level 4-6',
      age: language === 'bn' ? '১৬-২৫ বছর' : '16-25 Years',
      duration: language === 'bn' ? '১৫ বছর' : '15 Years',
      description:
        language === 'bn'
          ? 'পেশাগত ও উচ্চতর শিক্ষা'
          : 'Professional & Higher Education',
      features:
        language === 'bn'
          ? ['আলেম/মুফতি', 'বিশ্ববিদ্যালয় শিক্ষা', 'পেশাগত প্রশিক্ষণ']
          : ['Alim/Mufti', 'University Education', 'Professional Training'],
      color: 'green',
    },
  ];

  const streams = [
    {
      icon: BookText,
      title: language === 'bn' ? 'মাদরাসা শিক্ষা' : 'Madrasa Education',
      description:
        language === 'bn'
          ? 'হিফজ, তাফসীর, হাদীস, ফিকহ সহ সম্পূর্ণ দরসে নিজামী - ইসলামিক শিক্ষার পূর্ণাঙ্গ ব্যবস্থার সাথে সমন্বয়'
          : 'Complete Dars-e-Nizami including Hifz, Tafsir, Hadith, Fiqh - Comprehensive Islamic Education System',
      color: 'blue',
      features:
        language === 'bn'
          ? ['হিফজুল কুরআন', 'তাজভিদ শিক্ষা', 'ইসলামিক স্টাডিজ', 'আরবি সাহিত্য']
          : [
              'Quran Memorization',
              'Tajweed Education',
              'Islamic Studies',
              'Arabic Literature',
            ],
    },
    {
      icon: GraduationCap,
      title: language === 'bn' ? 'জেনারেল শিক্ষা' : 'General Education',
      description:
        language === 'bn'
          ? 'কেমব্রি জ এনসিটিবি কারিকুলামে আন্তর্জাতিক মানের শিক্ষা ব্যবস্থার সাথে সমন্বয়'
          : 'International standard education with Cambridge & NCTB curriculum',
      color: 'orange',
      features:
        language === 'bn'
          ? ['সাইন্স & আর্ট', 'ইংলিশ মিডিয়াম', 'বিসিএস প্রস্তুতি অন্তর্ভুক্ত']
          : ['Science & Arts', 'English Medium', 'BCS Preparation'],
    },
    {
      icon: Layers,
      title: language === 'bn' ? 'কারিগরি শিক্ষা' : 'Technical Education',
      description:
        language === 'bn'
          ? 'আধুনিক প্রযুক্তি ও কারিগরি দক্ষতা উন্নয়ন'
          : 'Modern technology and technical skills development',
      color: 'purple',
      features:
        language === 'bn'
          ? ['কম্পিউটার সাইন্স', 'রোবোটিক্স', 'গ্রাফিক ডিজাইন']
          : ['Computer Science', 'Robotics', 'Graphic Design'],
    },
  ];

  return (
    <section
      id="curriculum"
      dir="ltr"
      className="relative py-6 overflow-hidden md:py-32 bg-gray-50 dark:bg-gray-900"
    >
      <div className="relative px-6 mx-auto space-y-16 max-w-7xl">
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
          className="space-y-8 text-center"
        >
          {/* Header Section */}
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00AEEF] dark:bg-[#00AEEF]/5 border border-[#00AEEF]/40 dark:border-[#00AEEF]/20">
              <Layers className="w-4 h-4 text-white dark:text-[#00AEEF]" />
              <span
                className={cn(
                  'text-sm font-medium text-white  dark:text-[#00AEEF]',
                  language === 'bn' ? 'bengali-text' : ''
                )}
              >
                {language === 'bn'
                  ? 'শিক্ষা কারিকুলাম'
                  : 'Education Curriculum'}
              </span>
            </div>
            <h2
              className={cn(
                'max-w-4xl mx-auto text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight',
                language === 'bn' ? 'bengali-text' : ''
              )}
            >
              {language === 'bn' ? 'মানযিল' : 'Manzil'}
              <span className="text-[#00AEEF] dark:text-[#00AEEF] mx-2">
                {language === 'bn' ? 'কারিকুলাম' : 'Curriculum'}
              </span>
            </h2>
          </div>

          {/* Highlighted Curriculum Options */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF]/5 via-transparent to-green-500/5 rounded-xl"></div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.5,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="relative grid grid-cols-1 gap-8 md:grid-cols-2 p-8"
            >
              {curricula.map((curriculum, index) => {
                const colorClasses = getColorClasses(curriculum.color as 'blue' | 'green' | 'purple' | 'orange');
                const isMIC = curriculum.id === 'mic';
                const isMNC = curriculum.id === 'mnc';

                return (
                  <Link
                    key={curriculum.id}
                    href={curriculum.route}
                    className="block group"
                  >
                    <div
                      className={cn(
                        'relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden',
                        isMIC
                          ? 'border-[#00AEEF]/30 hover:border-[#00AEEF] bg-gradient-to-br from-[#00AEEF]/5 to-transparent'
                          : '',
                        isMNC
                          ? 'border-green-500/30 hover:border-green-500 bg-gradient-to-br from-green-500/5 to-transparent'
                          : '',
                        colorClasses.hoverBorder
                      )}
                    >
                      {/* Cute Background Pattern */}
                      <div
                        className={cn(
                          'absolute top-0 right-0 w-20 h-20 opacity-8 rounded-full -translate-y-6 translate-x-6',
                          isMIC ? 'bg-[#00AEEF]' : 'bg-green-500'
                        )}
                      ></div>

                      {/* Cute Curriculum Badge */}
                      <div
                        className={cn(
                          'inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 mb-4 font-bold text-sm shadow-md',
                          isMIC
                            ? 'bg-[#00AEEF] text-white border-[#00AEEF]'
                            : 'bg-green-500 text-white border-green-500'
                        )}
                      >
                        <Layers className="w-4 h-4" />
                        <span>{curriculum.shortName}</span>
                      </div>

                      {/* Title */}
                      <h3
                        className={cn(
                          'text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight',
                          language === 'bn' ? 'bengali-text' : ''
                        )}
                      >
                        {curriculum.name}
                      </h3>

                      {/* Description */}
                      <p
                        className={cn(
                          'text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm font-medium',
                          language === 'bn' ? 'bengali-text' : ''
                        )}
                      >
                        {curriculum.description}
                      </p>

                      {/* Cute Features */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                        <ul className="space-y-2">
                          {curriculum.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-2"
                            >
                              <div
                                className={cn(
                                  'w-2 h-2 rounded-full flex-shrink-0',
                                  isMIC ? 'bg-[#00AEEF]' : 'bg-green-500'
                                )}
                              ></div>
                              <span
                                className={cn(
                                  'text-gray-800 dark:text-gray-200 text-sm font-medium',
                                  language === 'bn' ? 'bengali-text' : ''
                                )}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cute CTA Button */}
                      <div className="flex items-center justify-center">
                        <div
                          className={cn(
                            'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg',
                            isMIC
                              ? 'bg-[#00AEEF] hover:bg-[#00AEEF]/90'
                              : 'bg-green-500 hover:bg-green-500/90'
                          )}
                        >
                          <span
                            className={cn(
                              'text-sm',
                              language === 'bn' ? 'bengali-text' : ''
                            )}
                          >
                            {language === 'bn'
                              ? 'বিস্তারিত দেখুন'
                              : 'View Details'}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Cute Hover Effect */}
                      <div
                        className={cn(
                          'absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none',
                          isMIC ? 'border-[#00AEEF]/40' : 'border-green-500/40'
                        )}
                      ></div>

                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    </div>
                  </Link>
                );
              })}
            </AnimatedGroup>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}