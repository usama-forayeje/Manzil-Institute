'use client';

import { useLanguageStore } from '@/store/language';
import { cn } from '@/lib/utils';
import {
  Target,
  Users,
  Sparkles,
  BookOpen,
  GraduationCap,
  Building,
  ArrowRight,
  Star,
  Quote,
  Languages,
  Palette,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { LogoCloud } from '@/components/shared/logo-cloud';
import { LazyImage } from '@/components/ui/lazy-image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';


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

export default function ContentSection() {
  const { language } = useLanguageStore();

  const contentData = {
    introduction: {
      bn: '“মানযিল" একটি মহৎ ভাবনা থেকে উদ্ভূত নাম। ইসলামী মূল্যবোধ ও আধুনিক উন্নয়নের সমন্বয়ে এটি একটি আদর্শ সমাজ গড়ার স্বপ্ন। এটি শুধু প্রতিষ্ঠান নয়, বরং আল্লাহভীতি ও মানবকল্যাণকে কেন্দ্রে রেখে দুনিয়া ও আখিরাতে সফল একটি আদর্শ জাতি গড়ার দিকনির্দেশনা। ইনশাআল্লাহ।',
      en: '"Manzil" is born from a noble thought—a dream to build an ideal society by blending Islamic values and development. More than an institution, it is a guidance centered on God-consciousness and human welfare, aiming to build a nation successful in both worlds. InshaAllah.',
    },
    journey: {
      bn: '“মানযিল গ্রুপের" যাত্রা শুরু হয় ইসলামিক ও সামাজিক কার্যক্রম দিয়ে। বর্তমানে শিক্ষা, ব্যবসা, আবাসন, চিকিৎসা ও সমাজসেবাসহ প্রতিটি খাতে আমাদের পরিসর বিস্তৃত হয়েছে। আমরা প্রতিটি ক্ষেত্রেই আমানত ও দায়িত্ববোধের সাথে কাজ করে যাচ্ছি।',
      en: 'Starting with Islamic and social activities, "Manzil Group" has expanded into education, business, healthcare, and housing. We operate in every sector with a deep sense of responsibility and trustworthiness.',
    },
    educationFocus: {
      bn: 'মানযিল গ্রুপের কেন্দ্রবিন্দুতে রয়েছে শিক্ষা—যা জাতির আত্মা ও ভবিষ্যতের আলো। এই বিশ্বাস থেকেই মানযিল ইনস্টিটিউট (বালক শাখা) এবং প্রস্তাবিত বালিকা শাখার মাধ্যমে আমাদের শিক্ষা কার্যক্রমের সূচনা।',
      en: "Education lies at the heart of Manzil Group—it is the nation's soul and future light. Driven by this belief, we launched our educational journey with Manzil Institute (Male branch) and the proposed Female branch.",
    },
    belief: {
      bn: 'আমরা বিশ্বাস করি, জাতির পরিবর্তনে প্রয়োজন সুশিক্ষা। যে শিক্ষা মানুষকে শুধু চাকুরিজীবী নয়, বরং নৈতিক ও দায়িত্বশীল মানুষ হিসেবে গড়ে তোলে। মানযিল ইনস্টিটিউট আগামী প্রজন্মের জন্য সেই নৈতিকতার পাঠশালা।',
      en: 'We believe transforming a nation requires education that builds ethical and responsible human beings, not just jobholders. Manzil Institute serves as this moral school for our future generation.',
    },
    chairman: {
      bn: 'বিজ্ঞ ওলামায়ে কেরাম ও তরুণ আলেমদের দীর্ঘ গবেষণার ফলে দেশে প্রথম এমন এক ব্যতিক্রমধর্মী মাদরাসা চালু হয়েছে, যেখানে ধর্মীয়, সাধারণ ও কারিগরি শিক্ষার আধুনিক ও বিজ্ঞানসম্মত সমন্বয় ঘটানো হয়েছে।',
      en: "Through extensive research by scholars, we launched the country's first exceptional madrasa that scientifically integrates Religious, General, and Technical education.",
    },
    studentOutcome: {
      bn: 'মানযিল ইনস্টিটিউটের ছাত্ররা কেবল হাফেজ বা আলেম নয়; তারা ডাক্তার, ইঞ্জিনিয়ার, গবেষক ও বিসিএস ক্যাডার হয়ে জাতীয় ও আন্তর্জাতিক অঙ্গনে নিজেদের অবস্থান গড়তে সক্ষম হবে, ইনশাআল্লাহ।',
      en: 'Students of Manzil Institute will not only be Hafiz or Alim but also Doctors, Engineers, Researchers, and BCS cadres, establishing themselves on national and international platforms. InshaAllah.',
    },
    alhamdulillah: {
      bn: '"আলহামদুলিল্লাহ", দীর্ঘ গবেষণায় আমরা এমন এক মাদরাসা চালু করেছি যেখানে কদিম নেসাব ও আন্তর্জাতিক মানের কারিকুলামের সমন্বয়ে দ্বীনি ও জাগতিক শিক্ষার অপূর্ব মিলন ঘটানো হয়েছে।',
      en: '"Alhamdulillah", through extensive research, we established a unique madrasa integrating traditional curriculum with international standards, seamlessly blending religious and modern education.',
    },
  };

  const visionMission = {
    vision: {
      bn: 'এমন নেতৃত্ব তৈরি করা, যারা মুসলিম উম্মাহ ও বিশ্ব মানবতার যে কোনো অমীমাংসিত চ্যালেঞ্জ মোকাবেলা করতে সক্ষম। একই সাথে তারা ইসলামী ঐতিহ্যের প্রতি বিশ্বস্ত থেকে ঐশ্বরিক, বুদ্ধিবৃত্তিক, নৈতিক ও বিশ্বাসভিত্তিক নেতৃত্ব প্রদান করবে।',
      en: 'To create leadership capable of addressing any unresolved challenges facing the Muslim Ummah and humanity at large, while remaining faithful to Islamic traditions and providing divine, intellectual, moral, and faith-based leadership.',
    },
    mission: {
      bn: 'ঐতিহ্যবাহী ও সমসাময়িক শিক্ষার সমন্বয়ে এমন এক অনন্য শিক্ষা কারিকুলাম ও পরিবেশ গড়ে তোলা, যেখানে শিক্ষার্থীরা দ্বীন ও দুনিয়া - উভয় জগতের উৎকৃষ্ট জ্ঞান ও অভিজ্ঞতা অর্জন করতে সক্ষম।',
      en: 'To build a unique educational curriculum and environment through the integration of traditional and contemporary education, where students can acquire the best knowledge and experience of both religious and worldly affairs.',
    },
  };

  const features = [
    {
      icon: Building2,
      title: { bn: 'প্রিমিয়াম রেসিডেন্সিয়াল', en: 'Premium Residential' },
      desc: {
        bn: 'সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত (AC) বেডরুম ও ক্লাসরুম, সাথে মানসম্মত পৃথক ডাইনিং ব্যবস্থা।',
        en: 'Fully air-conditioned (AC) bedrooms & classrooms with separate premium dining facilities.',
      },
    },
    {
      icon: Languages,
      title: { bn: 'বহুভাষী দক্ষতা', en: 'Multilingual Proficiency' },
      desc: {
        bn: 'বাংলা, ইংরেজির পাশাপাশি আরবি, উর্দু, হিন্দি ও ফারসি ভাষায় পারদর্শী করার বিশেষ ল্যাঙ্গুয়েজ কোর্স।',
        en: 'Special Language Courses to master Arabic, Urdu, Hindi, and Persian alongside Bangla & English.',
      },
    },
    {
      icon: Sprout,
      title: { bn: 'মানযিল এগ্রো ও স্বনির্ভরতা', en: 'Agro & Self-Reliance' },
      desc: {
        bn: 'বাগান করা, কৃষি পণ্য উৎপাদন এবং হালাল খাদ্য ও পণ্য সম্পর্কে হাতে-কলমে বাস্তব শিক্ষা।',
        en: 'Practical education on gardening, agriculture production, and Halal food & product knowledge.',
      },
    },
    {
      icon: ShieldCheck,
      title: { bn: 'সারভাইভাল ট্রেনিং', en: 'Survival Training' },
      desc: {
        bn: 'আগুন, বিদ্যুৎ, গ্যাস, ভূমিকম্প ও পানিতে ডুবা থেকে আত্মরক্ষার জন্য বিশেষ প্রশিক্ষণ ব্যবস্থা।',
        en: 'Specialized training for survival against fire, electricity, gas, earthquakes, and drowning.',
      },
    },
    {
      icon: Palette,
      title: { bn: 'স্মার্ট স্কিলস', en: 'Smart Skills' },
      desc: {
        bn: 'গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং, ফটোগ্রাফি, ক্যালিগ্রাফি ও গৃহস্থালি কাজের বাস্তব প্রশিক্ষণ।',
        en: 'Practical training in Graphics, Video Editing, Photography, Calligraphy & Housekeeping.',
      },
    },
    {
      icon: Users, // লিডারশিপের জন্য
      title: { bn: 'লিডারশিপ ডেভেলপমেন্ট', en: 'Leadership Development' },
      desc: {
        bn: 'জাতীয় ও আন্তর্জাতিক মঞ্চে নেতৃত্ব দেওয়ার উপযোগী সৎ ও যোগ্য নাগরিক তৈরি করা।',
        en: 'Creating honest and competent citizens capable of leading on national & international stages.',
      },
    },
  ];

  const classTranslations: Record<string, string> = {
    'Computer Class': language === 'bn' ? 'কম্পিউটার ক্লাস' : 'Computer Class',
    Classroom:
      language === 'bn' ? 'আরবি ক্লাসের একাংশ' : 'A Section of Arabic Class',
    'Category Class': language === 'bn' ? 'প্রযুক্তি ক্লাস' : 'Technical Class',
    'Arabic Class': language === 'bn' ? 'আরবি ক্লাসরুম' : 'Arabic Classroom',
    'Robotics Class': language === 'bn' ? 'রোবোটিক্স ক্লাস' : 'Robotics Class',
    'Language Class':
      language === 'bn' ? 'ভাষা ক্লাসের একাংশ' : 'Language Class Section',
    'Arts Class': language === 'bn' ? 'শিল্প ক্লাস' : 'Arts Class',
    'Arabic Class Section':
      language === 'bn' ? 'আরবি ক্লাসের একাংশ' : 'A Section of Arabic Class',
  };

  const images = [
    {
      src: '/computer-class.webp',
      alt: 'Computer Class',
      fallback: '/computer-class.jpg',
    },
    {
      src: '/carigory-class.webp',
      alt: 'Category Class',
      fallback: '/manzil logo.jpg',
    },
    {
      src: '/arabic-class.webp',
      alt: 'Arabic Class',
      fallback: '/manzil institutte logo.jpg',
    },
    {
      src: '/roboticsclass.webp',
      alt: 'Robotics Class',
      fallback: '/manzil institutte logo.jpg',
    },
    {
      src: '/languageclass.webp',
      alt: 'Language Class',
      fallback: '/manzil institutte logo.jpg',
    },
    {
      src: '/artsclass.webp',
      alt: 'Arts Class',
      fallback: '/manzil institutte logo.jpg',
    },
    {
      src: '/class-1.webp',
      alt: 'Arabic Class Section',
      fallback: '/manzil institutte logo.jpg',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden"
      dir="ltr"
    >
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />

      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.2 },
            },
          },
          ...transitionVariants,
        }}
        className="relative w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        {/* ===== HEADER ===== */}
        <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-24">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-2" />
            <span
              className={cn(
                'text-xs font-bold tracking-wide uppercase text-slate-600 dark:text-slate-300',
                language === 'bn' && 'bengali-text font-normal'
              )}
            >
              {language === 'bn' ? 'সংক্ষিপ্ত পরিচিতি' : 'Brief Introduction'}
            </span>
          </div>
          <h2
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight',
              language === 'bn' && 'bengali-text'
            )}
          >
            {language === 'bn' ? 'মানযিল সম্পর্কে' : 'About Manzil'}
          </h2>
          <p
            className={cn(
              'text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed',
              language === 'bn' && 'bengali-text'
            )}
          >
            {language === 'bn'
              ? 'আবাসন, খাদ্য ও কৃষি, ব্যবসা, শিক্ষা, সামাজিক সেবায় বিশ্বমানের উদ্যোগ'
              : 'World-class initiatives in housing, food & agriculture, business, education, and social services'}
          </p>
        </div>

        {/* ===== OVERVIEW CARDS ===== */}
        <div className="grid gap-8 lg:grid-cols-2 mb-24 lg:mb-32">
          <div className="group relative bg-white dark:bg-slate-900 rounded-xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-900/5 transition-shadow duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen className="w-24 h-24 text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3
                className={cn(
                  'text-2xl font-bold text-slate-900 dark:text-white mb-4',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn' ? 'পরিচিতি' : 'Introduction'}
              </h3>
              <p
                className={cn(
                  'text-slate-600 dark:text-slate-400 leading-relaxed text-base',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn'
                  ? contentData.introduction.bn
                  : contentData.introduction.en}
              </p>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-slate-900 rounded-xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-green-900/5 transition-shadow duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building className="w-24 h-24 text-green-600" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Building className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3
                className={cn(
                  'text-2xl font-bold text-slate-900 dark:text-white mb-4',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn' ? 'আমাদের যাত্রা' : 'Our Journey'}
              </h3>
              <p
                className={cn(
                  'text-slate-600 dark:text-slate-400 leading-relaxed text-base',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn'
                  ? contentData.journey.bn
                  : contentData.journey.en}
              </p>
            </div>
          </div>
        </div>

        {/* ===== MANZIL INSTITUTE SECTION ===== */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
              <GraduationCap className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span
                className={cn(
                  'text-sm font-semibold text-green-700 dark:text-green-300',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn'
                  ? 'শিক্ষা প্রতিষ্ঠান'
                  : 'Educational Institution'}
              </span>
            </div>
            <h3
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6',
                language === 'bn' && 'bengali-text'
              )}
            >
              {language === 'bn' ? 'মানযিল ইনস্টিটিউট' : 'Manzil Institute'}
            </h3>
            <p
              className={cn(
                'text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed',
                language === 'bn' && 'bengali-text'
              )}
            >
              {language === 'bn'
                ? contentData.educationFocus.bn
                : contentData.educationFocus.en}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-8">
                <div className="space-y-3">
                  <h4
                    className={cn(
                      'text-2xl text-center  font-bold text-slate-900 dark:text-white flex items-center gap-3',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Star className="w-5 h-5 fill-current" />
                    </span>
                    <p className="text-center">
                      {language === 'bn' ? 'মূল বৈশিষ্ট্যসমূহ' : 'Key Features'}
                    </p>
                  </h4>
                  <p
                    className={cn(
                      'text-slate-600 dark:text-slate-400 text-base pl-[3.25rem] font-medium',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn'
                      ? 'মাদরাসা, জেনারেল এবং কারিগরি শিক্ষার সমন্বয়'
                      : 'Integration of Madrasa, General, and Technical Education'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={idx}
                        className="group/item p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-900/5 transition-colors duration-300"
                      >
                        <div className="mb-4 inline-flex p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h5
                          className={cn(
                            'font-bold text-slate-900 dark:text-white mb-2 text-lg',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? feature.title.bn
                            : feature.title.en}
                        </h5>
                        <p
                          className={cn(
                            'text-sm text-slate-600 dark:text-slate-400 leading-relaxed',
                            language === 'bn' && 'bengali-text'
                          )}
                        >
                          {language === 'bn'
                            ? feature.desc.bn
                            : feature.desc.en}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  className="bg-[#00AEEF] hover:bg-blue-400 text-white rounded-lg h-12 px-8 text-base font-medium transition-colors duration-300 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5"
                >
                  <Link
                    href="/curriculum"
                    className={cn(
                      'flex items-center gap-2',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn' ? 'কারিকুলাম দেখুন' : 'View Curriculum'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-lg h-12 px-8 text-base font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <Link
                    href="/admission"
                    className={cn(
                      'flex items-center gap-2',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn' ? 'ভর্তি তথ্য' : 'Admission Info'}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-lg h-12 px-8 text-base font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <Link
                    href="/campus"
                    className={cn(
                      'flex items-center gap-2',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'bn' ? 'ক্যাম্পাস দেখুন' : 'Visit Campus'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="relative order-1 lg:order-2 w-full">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl" />

              <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/20 dark:border-slate-700">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  loop
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  effect="slide"
                  modules={[Autoplay]}
                  className="w-full aspect-[4/3] md:aspect-[16/10] [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet]:transition-all"
                >
                  {images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800">
                        <LazyImage
                          src={image.src || '/placeholder.svg'}
                          alt={image.alt}
                          title={image.alt}
                          fallback={image.fallback}
                          width={800}
                          height={600}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <div
                            className={cn(
                              'inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-medium text-sm sm:text-base',
                              language === 'bn' ? 'bengali-text' : ''
                            )}
                          >
                            {classTranslations[image.alt]}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Floating Stats Card - Redesigned */}
              <div className="absolute -bottom-6 -right-6 z-10 hidden md:block">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700 animate-float">
                  <div className="flex items-center gap-4">
                    <div>
                      <div
                        className={cn(
                          'text-2xl font-bold text-slate-900 dark:text-white',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn' ? '৩ in ১' : '3 in 1'}
                      </div>
                      <div
                        className={cn(
                          'text-sm text-slate-500 dark:text-slate-400 font-medium',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'শিক্ষা পদ্ধতি'
                          : 'Education System'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== ALHAMDULILLAH ===== */}
        <div className="max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 p-8 md:p-10 text-center shadow-md">
            <Quote className="w-8 h-8 text-white/40 mx-auto mb-4" />
            <blockquote
              className={cn(
                'text-lg md:text-xl text-white/95 font-medium leading-relaxed',
                language === 'bn' && 'bengali-text'
              )}
            >
              &ldquo;
              {language === 'bn'
                ? contentData.alhamdulillah.bn
                : contentData.alhamdulillah.en}
              &rdquo;
            </blockquote>
          </div>
        </div>

        {/* ===== VISION & MISSION ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-green-200 dark:hover:border-green-900/50 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3
                className={cn(
                  'text-2xl font-bold text-slate-900 dark:text-white',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision'}
              </h3>
            </div>
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400 leading-relaxed text-base',
                language === 'bn' && 'bengali-text'
              )}
            >
              {language === 'bn'
                ? visionMission.vision.bn
                : visionMission.vision.en}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3
                className={cn(
                  'text-2xl font-bold text-slate-900 dark:text-white',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
              </h3>
            </div>
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400 leading-relaxed text-base',
                language === 'bn' && 'bengali-text'
              )}
            >
              {language === 'bn'
                ? visionMission.mission.bn
                : visionMission.mission.en}
            </p>
          </div>
        </div>

        {/* ===== LOGO CLOUD ===== */}
        <div className="pt-6">
          <LogoCloud />
        </div>
      </AnimatedGroup>
    </section>
  );
}