'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useLanguageStore } from '../../../lib/store';
import { cn } from '../../../lib/utils';
import { AnimatedGroup } from '../../../components/ui/animated-group';
import {
  useAdmissionData,
  usePrefetchAdmissionData,
} from '../../../hooks/useData';
import ErrorBoundary from '../../../components/ErrorBoundary';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import FooterSection from '../../../components/footer';
import HeroHeader from '@/components/header';

// Verification log for import paths
console.log('MNC Admission Page - Import verification:', {
  cn: typeof cn,
  AnimatedGroup: typeof AnimatedGroup,
  useAdmissionData: typeof useAdmissionData,
  ErrorBoundary: typeof ErrorBoundary,
  LoadingSkeleton: typeof LoadingSkeleton,
  FooterSection: typeof FooterSection,
  HeroHeader: typeof HeroHeader,
});

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

export default function MNCAdmissionPage() {
  const [activeTab, setActiveTab] = useState('process');
  const { language } = useLanguageStore();

  const {
    data: admissionData,
    isLoading,
    error,
    refetch,
  } = useAdmissionData(language);

  // Fallback data in case the hook fails
  const fallbackData = {
    overview: {
      title: 'MNC Admission Overview',
      description:
        'Comprehensive admission information for Manzil National Curriculum (MNC)',
    },
    process: [],
    requirements: { level1: {}, level2: {}, level3: {}, huffaz: {} },
    feeStructure: {
      oneTime: [],
      monthly: { tuition: [], residential: [], food: [] },
    },
    importantDates: [],
    contact: { phone: [], email: '', address: '', officeHours: '' },
  };

  const safeAdmissionData = admissionData || fallbackData;

  // Ensure all required properties exist
  const safeData = {
    overview: safeAdmissionData.overview || fallbackData.overview,
    process: Array.isArray(safeAdmissionData.process)
      ? safeAdmissionData.process
      : fallbackData.process,
    requirements: safeAdmissionData.requirements || fallbackData.requirements,
    feeStructure: safeAdmissionData.feeStructure || fallbackData.feeStructure,
    importantDates: Array.isArray(safeAdmissionData.importantDates)
      ? safeAdmissionData.importantDates
      : fallbackData.importantDates,
    contact: safeAdmissionData.contact || fallbackData.contact,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the admission process for MNC curriculum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The MNC admission process includes online application, admission test, nomination & selection, document submission & fee payment, and class commencement. Each step is designed to ensure quality education for deserving students.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the eligibility criteria for MNC levels?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MNC Level 1: Below 6 years with basic alphabet recognition. Level 2: Below 9 years with simple reading/writing. Level 3: Below 12 years with reading/writing skills. Additional levels available for advanced learning.',
        },
      },
      {
        '@type': 'Question',
        name: 'What documents are required for MNC admission?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Required documents include birth certificate, passport-size photos, previous report cards, medical certificates (for some levels), and house registration. Additional documents may be required based on the level.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the fee structure for MNC curriculum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fees include one-time admission charges (30,000 BDT), session fees (25,000 BDT), monthly tuition fees (2,000-3,000 BDT), residential fees (3,500-15,000 BDT), and food fees (9,000-15,000 BDT) depending on the program and level.',
        },
      },
      {
        '@type': 'Question',
        name: 'When does the MNC admission process start?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MNC admission applications are currently open. The admission test is scheduled for January 15, 2024, with classes beginning February 1, 2024. Please check our website for the latest updates.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does MNC offer residential facilities?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, MNC provides residential facilities for both boys and girls with 24/7 security, modern amenities, halal food service, and supervision by qualified staff.',
        },
      },
    ],
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getColorClasses = color => {
    const colorMap = {
      blue: {
        bg100: 'bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10',
        bg500: 'bg-[#00AEEF]',
        text500: 'text-[#00AEEF]',
      },
      green: {
        bg100: 'bg-green-100 dark:bg-green-900/30',
        bg500: 'bg-green-500',
        text500: 'text-green-500',
      },
      purple: {
        bg100: 'bg-purple-100 dark:bg-purple-900/30',
        bg500: 'bg-purple-500',
        text500: 'text-purple-500',
      },
      orange: {
        bg100: 'bg-orange-100 dark:bg-orange-900/30',
        bg500: 'bg-orange-500',
        text500: 'text-orange-500',
      },
      red: {
        bg100: 'bg-red-100 dark:bg-red-900/30',
        bg500: 'bg-red-500',
        text500: 'text-red-500',
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleApplyNow = () => {
    window.location.href = '/apply';
  };

  const handleDownloadForm = () => {
    alert(
      language === 'bn'
        ? 'ভর্তি ফরম ডাউনলোড শুরু হচ্ছে...'
        : 'Downloading admission form...'
    );
  };

  // Make tabs reactive to language changes
  const tabs = [
    {
      id: 'process',
      label: language === 'bn' ? 'ভর্তি প্রক্রিয়া' : 'Admission Process',
    },
    {
      id: 'requirements',
      label:
        language === 'bn' ? 'যোগ্যতা ও ডকুমেন্ট' : 'Eligibility & Documents',
    },
    { id: 'fees', label: language === 'bn' ? 'ফি কাঠামো' : 'Fee Structure' },
    {
      id: 'dates',
      label: language === 'bn' ? 'গুরুত্বপূর্ণ তারিখ' : 'Important Dates',
    },
    {
      id: 'khabarer',
      label: language === 'bn' ? 'খবরের রাউটিং' : 'Khabarer Routing',
    },
    {
      id: '24hour',
      label: language === 'bn' ? '২৪ ঘণ্টা রাউটিং' : '24 Houre Routing',
    },
    { id: 'contact', label: language === 'bn' ? 'যোগাযোগ' : 'Contact' },
  ];

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
        name: 'Admission',
        item: 'https://institute.manzilgroupbd.com/admission',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'MNC Admission',
        item: 'https://institute.manzilgroupbd.com/admission/mnc',
      },
    ],
  };

  // Handle loading state
  if (isLoading) {
    return (
      <ErrorBoundary>
        <div>
          <HeroHeader />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12">
            <LoadingSkeleton />
          </main>
          <FooterSection />
        </div>
      </ErrorBoundary>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ErrorBoundary>
        <div>
          <HeroHeader />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'bn'
                  ? 'তথ্য লোড করতে সমস্যা হয়েছে'
                  : 'Failed to Load Admission Data'}
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
          <FooterSection />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <HeroHeader />

        <main
          className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12"
          dir="ltr"
        >
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
            <section className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
                {language === 'bn'
                  ? 'MNC ভর্তি প্রক্রিয়া'
                  : 'MNC Admission Process'}
              </h1>
              <h2 className="text-lg md:text-xl text-[#00AEEF] dark:text-[#00AEEF]/80 mb-6 kalpurush-font">
                {language === 'bn'
                  ? 'মানযিল ন্যাশনাল কারিকুলাম ভর্তি - অনলাইন আবেদন এবং প্রয়োজনীয়তা'
                  : 'Manzil National Curriculum Admission - Online Application & Requirements'}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font">
                {language === 'bn'
                  ? 'MNC কারিকুলামে ভর্তির জন্য সম্পূর্ণ প্রক্রিয়া, যোগ্যতা, ফি কাঠামো এবং গুরুত্বপূর্ণ তারিখসমূহ জানুন। মাদ্রাসা, জেনারেল এবং কারিগরি শিক্ষার সমন্বয়ে ৭ বছরের পূর্ণাঙ্গ শিক্ষা ব্যবস্থা।'
                  : 'Learn about the complete admission process, eligibility, fee structure, and important dates for MNC curriculum. Complete 7-year education system integrating Madrasa, General & Technical Education.'}
              </p>
            </section>

            {/* Overview Stats */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6 sm:mb-8">
                <h2
                  className={cn(
                    'text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4',
                    language === 'bn' && 'bengali-text'
                  )}
                >
                  {safeData.overview.title}
                </h2>
                <p
                  className={cn(
                    'text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto',
                    language === 'bn' && 'bengali-text'
                  )}
                >
                  {safeData.overview.description}
                </p>
              </div>
            </section>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center sm:justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-colors border border-gray-200 dark:border-gray-700 flex-shrink-0',
                    activeTab === tab.id
                      ? 'bg-[#00AEEF] text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                    language === 'bn' && 'bengali-text'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
              {/* Admission Process */}
              {activeTab === 'process' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'MNC ভর্তি প্রক্রিয়া - ধাপ সমূহ'
                      : 'MNC Admission Process - Steps'}
                  </h3>

                  {safeData.process.map((step, index) => {
                    const colorClasses = getColorClasses(step.color);
                    return (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                      >
                        {/* Step Number */}
                        <div
                          className={`w-12 h-12 sm:w-16 sm:h-16 ${colorClasses.bg100} rounded-2xl flex items-center justify-center flex-shrink-0`}
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses.bg500} rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg`}
                          >
                            {step.step}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                            <h4
                              className={cn(
                                'text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-0',
                                language === 'bn' && 'bengali-text'
                              )}
                            >
                              {step.title}
                            </h4>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span
                                className={cn(
                                  'text-xs sm:text-sm',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {step.duration}
                              </span>
                            </div>
                          </div>

                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {step.description}
                          </p>

                          <div className="grid gap-1 sm:gap-2">
                            {step.requirements.map((requirement, reqIndex) => (
                              <div
                                key={reqIndex}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses.text500}`}
                                />
                                <span
                                  className={cn(
                                    'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                    language === 'bn' && 'bengali-text'
                                  )}
                                >
                                  {requirement}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Requirements & Documents */}
              {activeTab === 'requirements' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'MNC লেভেল অনুযায়ী যোগ্যতা ও প্রয়োজনীয় ডকুমেন্ট'
                      : 'MNC Level-wise Eligibility & Required Documents'}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Level 1 */}
                    <div className="bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5 rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#00AEEF] rounded-full"></div>
                        <h4
                          className={cn(
                            'font-semibold text-[#00AEEF]/90 dark:text-[#00AEEF]/70 text-sm sm:text-base',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn' ? 'MNC লেভেল ১' : 'MNC Level 1'}
                        </h4>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'বয়স:' : 'Age:'}
                          </h5>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {safeData.requirements.level1.age}
                          </p>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'একাডেমিক যোগ্যতা:'
                              : 'Academic Qualification:'}
                          </h5>
                          <ul className="space-y-1">
                            {safeData.requirements.level1.academic.map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span
                                    className={cn(
                                      'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {item}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'প্রয়োজনীয় ডকুমেন্ট:'
                              : 'Required Documents:'}
                          </h5>
                          <ul className="space-y-1">
                            {safeData.requirements.level1.documents.map(
                              (doc, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <AlertCircle className="w-3 h-3 text-orange-500" />
                                  <span
                                    className={cn(
                                      'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {doc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Level 2 */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                        <h4
                          className={cn(
                            'font-semibold text-green-700 dark:text-green-300 text-sm sm:text-base',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn' ? 'MNC লেভেল ২' : 'MNC Level 2'}
                        </h4>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'বয়স:' : 'Age:'}
                          </h5>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {safeData.requirements.level2.age}
                          </p>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'একাডেমিক যোগ্যতা:'
                              : 'Academic Qualification:'}
                          </h5>
                          <ul className="space-y-1">
                            {safeData.requirements.level2.academic.map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span
                                    className={cn(
                                      'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {item}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'প্রয়োজনীয় ডকুমেন্ট:'
                              : 'Required Documents:'}
                          </h5>
                          <ul className="space-y-1">
                            {safeData.requirements.level2.documents.map(
                              (doc, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <AlertCircle className="w-3 h-3 text-orange-500" />
                                  <span
                                    className={cn(
                                      'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {doc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Level 3 */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
                        <h4
                          className={cn(
                            'font-semibold text-purple-700 dark:text-purple-300 text-sm sm:text-base',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn' ? 'MNC লেভেল ৩' : 'MNC Level 3'}
                        </h4>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'বয়স:' : 'Age:'}
                          </h5>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {safeData.requirements.level3.age}
                          </p>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'একাডেমিক যোগ্যতা:'
                              : 'Academic Qualification:'}
                          </h5>
                          <ul className="space-y-1">
                            {safeData.requirements.level3.academic.map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span
                                    className={cn(
                                      'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {item}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'প্রয়োজনীয় ডকুমেন্ট:'
                              : 'Required Documents:'}
                          </h5>
                          <ul className="space-y-1">
                            {safeData.requirements.level3.documents.map(
                              (doc, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <AlertCircle className="w-3 h-3 text-orange-500" />
                                  <span
                                    className={cn(
                                      'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {doc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Additional Level */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                        <h4
                          className={cn(
                            'font-semibold text-orange-700 dark:text-orange-300 text-sm sm:text-base',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? 'MNC উচ্চ লেভেল'
                            : 'MNC Advanced Level'}
                        </h4>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'বয়স:' : 'Age:'}
                          </h5>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? '১২ বছরের উপরে'
                              : 'Above 12 years'}
                          </p>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'একাডেমিক যোগ্যতা:'
                              : 'Academic Qualification:'}
                          </h5>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span
                                className={cn(
                                  'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {language === 'bn'
                                  ? 'পূর্ববর্তী লেভেল সম্পন্ন'
                                  : 'Previous level completed'}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5
                            className={cn(
                              'font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? 'প্রয়োজনীয় ডকুমেন্ট:'
                              : 'Required Documents:'}
                          </h5>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <AlertCircle className="w-3 h-3 text-orange-500" />
                              <span
                                className={cn(
                                  'text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {language === 'bn'
                                  ? 'পূর্ববর্তী রেজাল্ট কার্ড'
                                  : 'Previous result card'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Structure */}
              {activeTab === 'fees' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'MNC ফি কাঠামো - বিস্তারিত তথ্য'
                      : 'MNC Fee Structure - Detailed Information'}
                  </h3>

                  {/* One-time Fees */}
                  <div className="bg-gradient-to-r from-[#00AEEF]/10 to-purple-50 dark:from-[#00AEEF]/5 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6">
                    <h4
                      className={cn(
                        'text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'এককালীন ফি (ভর্তির সময়)'
                        : 'One-time Fees (At Admission)'}
                    </h4>
                    <div className="grid gap-3 sm:gap-4">
                      {safeData.feeStructure.oneTime.map((fee, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <span
                            className={cn(
                              'font-medium text-gray-900 dark:text-white text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {fee.name}
                          </span>
                          <span className="font-bold text-[#00AEEF] text-sm sm:text-base">
                            {fee.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Fees */}
                  <div className="space-y-4">
                    {/* Tuition Fees */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6">
                      <h4
                        className={cn(
                          'text-base sm:text-lg md:text-xl font-semibold text-green-800 dark:text-green-200 mb-4',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'টিউশন ফি (মাসিক)'
                          : 'Tuition Fees (Monthly)'}
                      </h4>
                      <div className="grid gap-3 sm:gap-4">
                        {safeData.feeStructure.monthly.tuition.map(
                          (fee, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span
                                className={cn(
                                  'font-medium text-gray-900 dark:text-white text-sm sm:text-base',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {fee.name}
                              </span>
                              <span className="font-bold text-green-600 text-sm sm:text-base">
                                {fee.amount}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Residential Fees */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6">
                      <h4
                        className={cn(
                          'text-base sm:text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'আবাসিক ফি (মাসিক)'
                          : 'Residential Fees (Monthly)'}
                      </h4>
                      <div className="grid gap-3 sm:gap-4">
                        {safeData.feeStructure.monthly.residential.map(
                          (fee, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span
                                className={cn(
                                  'font-medium text-gray-900 dark:text-white text-sm sm:text-base',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {fee.name}
                              </span>
                              <span className="font-bold text-blue-600 text-sm sm:text-base">
                                {fee.amount}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Food Fees */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 sm:p-6">
                      <h4
                        className={cn(
                          'text-base sm:text-lg md:text-xl font-semibold text-orange-800 dark:text-orange-200 mb-4',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'খাদ্য ফি (মাসিক)'
                          : 'Food Fees (Monthly)'}
                      </h4>
                      <div className="grid gap-3 sm:gap-4">
                        {safeData.feeStructure.monthly.food.map(
                          (fee, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <span
                                className={cn(
                                  'font-medium text-gray-900 dark:text-white text-sm sm:text-base',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {fee.name}
                              </span>
                              <span className="font-bold text-orange-600 text-sm sm:text-base">
                                {fee.amount}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Dates */}
              {activeTab === 'dates' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'MNC গুরুত্বপূর্ণ তারিখসমূহ'
                      : 'MNC Important Dates'}
                  </h3>

                  <div className="grid gap-4 sm:gap-6">
                    {safeData.importantDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#00AEEF] dark:text-[#00AEEF]/80" />
                          </div>
                          <div>
                            <h4
                              className={cn(
                                'font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1',
                                language === 'bn' && 'bengali-text'
                              )}
                            >
                              {date.event}
                            </h4>
                            <p
                              className={cn(
                                'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                                language === 'bn' && 'bengali-text'
                              )}
                            >
                              {date.date}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            date.status === 'open'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          )}
                        >
                          {date.status === 'open'
                            ? language === 'bn'
                              ? 'চলমান'
                              : 'Ongoing'
                            : language === 'bn'
                              ? 'আসন্ন'
                              : 'Upcoming'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Khabarer Routing */}
              {activeTab === 'khabarer' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'খবরের রাউটিং - তথ্য ব্যবস্থাপনা'
                      : 'Khabarer Routing - Information Management'}
                  </h3>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 sm:p-6">
                    <h4
                      className={cn(
                        'text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'কী হলো খবরের রাউটিং?'
                        : 'What is Khabarer Routing?'}
                    </h4>
                    <p
                      className={cn(
                        'text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'খবরের রাউটিং হলো MNC ভর্তি প্রক্রিয়ায় তথ্য এবং আপডেটগুলোকে সঠিক গন্তব্যে পৌঁছে দেওয়ার একটি সিস্টেম। এটি নিশ্চিত করে যে অভিভাবক, শিক্ষার্থী এবং প্রশাসন সকলেই সর্বশেষ তথ্য পান।'
                        : 'Khabarer Routing is a system for directing information and updates to the correct destinations in the MNC admission process. It ensures that parents, students, and administration all receive the latest information.'}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h5
                          className={cn(
                            'font-semibold text-gray-900 dark:text-white mb-2',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? 'তথ্যের ধরন'
                            : 'Types of Information'}
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'ভর্তি আপডেট'
                              : 'Admission Updates'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'পরীক্ষার ফলাফল'
                              : 'Exam Results'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'গুরুত্বপূর্ণ ঘোষণা'
                              : 'Important Announcements'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn' ? 'ফি পরিবর্তন' : 'Fee Changes'}
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h5
                          className={cn(
                            'font-semibold text-gray-900 dark:text-white mb-2',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? 'রাউটিং চ্যানেল'
                            : 'Routing Channels'}
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'ইমেইল বিজ্ঞপ্তি'
                              : 'Email Notifications'}
                          </li>
                          <li>
                            • {language === 'bn' ? 'SMS আপডেট' : 'SMS Updates'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'পোর্টাল ড্যাশবোর্ড'
                              : 'Portal Dashboard'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn' ? 'মোবাইল অ্যাপ' : 'Mobile App'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 24 Hour Routing */}
              {activeTab === '24hour' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? '২৪ ঘণ্টা রাউটিং - সার্বক্ষণিক সহায়তা'
                      : '24 Hour Routing - Round-the-Clock Support'}
                  </h3>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 sm:p-6">
                    <h4
                      className={cn(
                        'text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'কী হলো ২৪ ঘণ্টা রাউটিং?'
                        : 'What is 24 Hour Routing?'}
                    </h4>
                    <p
                      className={cn(
                        'text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? '২৪ ঘণ্টা রাউটিং সিস্টেম MNC ভর্তি প্রক্রিয়ায় সার্বক্ষণিক সহায়তা প্রদান করে। এটি নিশ্চিত করে যে যেকোনো সময়ে জরুরি তথ্য বা সহায়তার প্রয়োজনে আবেদনকারীরা সঠিক সহায়তা পান।'
                        : 'The 24 Hour Routing system provides round-the-clock support for the MNC admission process. It ensures that applicants receive appropriate assistance whenever they need urgent information or help.'}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h5
                          className={cn(
                            'font-semibold text-gray-900 dark:text-white mb-2',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? 'সহায়তার ধরন'
                            : 'Types of Support'}
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'জরুরি যোগাযোগ'
                              : 'Emergency Contact'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'প্রযুক্তিগত সহায়তা'
                              : 'Technical Support'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'আবেদন সহায়তা'
                              : 'Application Assistance'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'পেমেন্ট সাপোর্ট'
                              : 'Payment Support'}
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <h5
                          className={cn(
                            'font-semibold text-gray-900 dark:text-white mb-2',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? 'যোগাযোগের মাধ্যম'
                            : 'Communication Channels'}
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? '২৪/৭ হেল্পলাইন'
                              : '24/7 Helpline'}
                          </li>
                          <li>
                            • {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'ইমেইল সাপোর্ট'
                              : 'Email Support'}
                          </li>
                          <li>
                            •{' '}
                            {language === 'bn'
                              ? 'অ্যাপ নোটিফিকেশন'
                              : 'App Notifications'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {activeTab === 'contact' && (
                <div className="space-y-6 sm:space-y-8">
                  <h3
                    className={cn(
                      'text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'MNC ভর্তি সম্পর্কিত যোগাযোগ'
                      : 'MNC Admission Contact Information'}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Contact Details */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#00AEEF] dark:text-[#00AEEF]/80" />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              'font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'ফোন নম্বর' : 'Phone Numbers'}
                          </h4>
                          <div className="space-y-1">
                            {safeData.contact.phone.map((number, idx) => (
                              <p
                                key={idx}
                                className={cn(
                                  'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {number}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              'font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'ইমেইল' : 'Email'}
                          </h4>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {safeData.contact.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              'font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'ঠিকানা' : 'Address'}
                          </h4>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {safeData.contact.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              'font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn' ? 'অফিস সময়' : 'Office Hours'}
                          </h4>
                          <p
                            className={cn(
                              'text-xs sm:text-sm text-gray-600 dark:text-gray-400',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {safeData.contact.officeHours}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="bg-gradient-to-br from-[#00AEEF] to-purple-600 rounded-2xl p-4 sm:p-6 text-white">
                      <h4
                        className={cn(
                          'text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'দ্রুত MNC ভর্তি প্রক্রিয়া শুরু করুন'
                          : 'Start MNC Admission Process Quickly'}
                      </h4>
                      <p
                        className={cn(
                          'mb-4 sm:mb-6 opacity-90 text-xs sm:text-sm',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'এখনই অনলাইনে আবেদন করুন এবং আপনার সন্তানের MNC কারিকুলামে ভবিষ্যত গড়ার যাত্রা শুরু করুন'
                          : "Apply online now and start your child's future-building journey in MNC curriculum"}
                      </p>

                      <div className="space-y-3 sm:space-y-4">
                        <Button
                          onClick={handleApplyNow}
                          className="w-full bg-white text-[#00AEEF] hover:bg-gray-100 text-sm sm:text-base py-2 sm:py-3"
                        >
                          <span
                            className={cn(language === 'bn' && 'bengali-text')}
                          >
                            {language === 'bn'
                              ? 'অনলাইনে আবেদন করুন'
                              : 'Apply Online'}
                          </span>
                        </Button>

                        <Button
                          onClick={() =>
                            (window.location.href = '/curriculum/mnc')
                          }
                          variant="outline"
                          className="w-full border-white text-white hover:bg-white hover:text-blue-600 text-sm sm:text-base py-2 sm:py-3"
                        >
                          <span
                            className={cn(language === 'bn' && 'bengali-text')}
                          >
                            {language === 'bn'
                              ? 'MNC কারিকুলাম দেখুন'
                              : 'View MNC Curriculum'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimatedGroup>
        </main>
        <FooterSection />
      </div>
    </ErrorBoundary>
  );
}
