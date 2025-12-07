'use client';

import { useState, useEffect, useRef } from 'react';
import { LazyImage } from '../../components/ui/lazy-image';
import {
  MapPin,
  Home,
  Utensils,
  Shield,
  BookOpen,
  Clock,
  Phone,
  Mail,
  Play,
  ChevronRight,
  Star,
  Cpu,
  Monitor,
  Languages,
  Microscope,
  Award,
  ArrowDown,
  MoveRight,
  Wifi,
  Zap,
  Users,
  Dices,
  Layers,
  FlaskConical,
  Globe,
} from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { Button } from '../../components/ui/button';
import { useLanguageStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import ErrorBoundary from '../../components/ErrorBoundary';
import FooterSection from '../../components/footer';
import HeroHeader from '@/components/header';
import { Pause } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../../components/themes/theme-provider';

// --- Image Assets (Replace with real paths) ---
const images = {
  bridge: 'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/building.jpg',
  building: 'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/building-2.jpg',
  corridor: 'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/coridor.jpg',
  reception: 'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/office.jpg',
  arabicClass:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/arabicClass-1.jpg',
  generalClass:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/generalClass.jpg',
  dorm: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2669&auto=format&fit=crop',
  // Video Thumbnails (High Quality Vertical preferred for Chaicode style)
  videoThumb1:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/office.jpg',
  videoThumb2:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/building-2.jpg',
  videoThumb3:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/arabicClass-1.jpg',
  videoThumb4:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/generalClass.jpg',
  videoThumb5:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/building.jpg',
  videoThumb6:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2674&auto=format&fit=crop',
};

// --- Data for Section 2 (Campus Tour) ---
const tourSteps = [
  {
    title: { bn: 'লোকেশন ও ল্যান্ডমার্ক', en: 'Location & Landmark' },
    desc: {
      bn: 'রায়েরবাগ ফুটওভার ব্রিজ থেকে দৃশ্য। সহজ যাতায়াত ব্যবস্থার সাথে উত্তর রায়েরবাগ বাস স্ট্যান্ড সংলগ্ন আমাদের ক্যাম্পাস।',
      en: 'View from Rayerbag Footover Bridge. Located right next to North Rayerbag Bus Stand for easy commute.',
    },
    image: images.bridge,
  },
  {
    title: { bn: 'মানযিল ভবন', en: 'Manzil Building' },
    desc: {
      bn: 'হারুনুর রশীদ টাওয়ার। আধুনিক স্থাপত্যে নির্মিত আমাদের নিজস্ব ক্যাম্পাস। ২য় ও ৪র্থ তলায় একাডেমিক কার্যক্রম।',
      en: 'Harunur Rashid Tower. Modern architecture housing our academic activities on 2nd and 4th floors.',
    },
    image: images.building,
  },
  {
    title: { bn: 'প্রশস্ত করিডোর', en: 'Spacious Corridors' },
    desc: {
      bn: 'শিক্ষার্থীদের চলাচলের জন্য পর্যাপ্ত আলো-বাতাস সমৃদ্ধ প্রশস্ত এবং পরিষ্কার-পরিচ্ছন্ন করিডোর।',
      en: 'Wide, well-lit, and clean corridors ensuring comfortable student movement.',
    },
    image: images.corridor,
  },
  {
    title: { bn: 'রিসেপশন', en: 'Reception Area' },
    desc: {
      bn: 'আগত মেহমান ও অভিভাবকদের জন্য সুসজ্জিত রিসিপশন এবং প্রাতিষ্ঠানিক কার্যক্রমের জন্য আধুনিক অফিস।',
      en: 'Well-furnished reception for guests and modern office rooms for administration.',
    },
    image: images.reception,
  },
  {
    title: { bn: 'আরবি ক্লাসরুম', en: 'Arabic Classroom' },
    desc: {
      bn: 'দ্বীনি শিক্ষার ভাবগাম্ভীর্য বজায় রেখে আধুনিক আসবাবপত্রে সজ্জিত বিশেষায়িত আরবি ক্লাসরুম।',
      en: 'Dedicated Arabic classrooms furnished with modern furniture maintaining Islamic ambiance.',
    },
    image: images.arabicClass,
  },
  {
    title: { bn: 'জেনারেল ক্লাসরুম', en: 'General Classroom' },
    desc: {
      bn: 'মাল্টিমিডিয়া ও স্মার্ট বোর্ড সুবিধা সম্বলিত জেনারেল শিক্ষার জন্য পৃথক ক্লাসরুম।',
      en: 'Separate classrooms for general education equipped with multimedia and smart boards.',
    },
    image: images.generalClass,
  },
  {
    title: { bn: 'আবাসিক ব্যবস্থা', en: 'Residential' },
    desc: {
      bn: 'ছাত্রদের আরামদায়ক ঘুমের জন্য এসি রুম এবং স্বাস্থ্যকর খাবারের জন্য পৃথক ডাইনিং ব্যবস্থা।',
      en: 'AC rooms for comfortable sleep and separate dining arrangements for healthy meals.',
    },
    image: images.dorm,
  },
];

// --- Data for Section 4 (Premium Amenities - with Sub-text) ---
const amenitiesData = [
  {
    icon: Monitor,
    title: { bn: 'ডিজিটাল স্মার্ট ল্যাব', en: 'Digital Smart Lab' },
    subTitle: {
      bn: 'প্রত্যেক শিক্ষার্থীর জন্য অত্যাধুনিক কম্পিউটার ও ইন্টারনেট সুবিধা।',
      en: 'State-of-the-art computers and internet access for every student.',
    },
    color: 'blue',
    colSpan: 'md:col-span-2',
  },
  {
    icon: Cpu,
    title: { bn: 'রোবটিক্স ও ড্রোন', en: 'Robotics & Drone Tech' },
    subTitle: {
      bn: 'ভবিষ্যতের প্রযুক্তি নিয়ে হাতে-কলমে শেখার সুবিধা।',
      en: 'Hands-on learning with future technologies like robotics and drones.',
    },
    color: 'purple',
    colSpan: '',
  },
  {
    icon: Globe,
    title: { bn: 'ল্যাঙ্গুয়েজ ক্লাব', en: 'Language Club' },
    subTitle: {
      bn: 'আরবি ও ইংরেজি ভাষায় দক্ষতা অর্জনের জন্য বিশেষ প্রশিক্ষণ।',
      en: 'Specialized training to achieve fluency in Arabic and English.',
    },
    color: 'green',
    colSpan: '',
  },
  {
    icon: FlaskConical,
    title: { bn: 'সায়েন্স ল্যাব', en: 'Modern Science Lab' },
    subTitle: {
      bn: 'বায়োলজি, কেমিস্ট্রি ও ফিজিক্সের জন্য সুসজ্জিত পরীক্ষাগার।',
      en: 'Well-equipped labs for practical sessions in Biology, Chemistry, and Physics.',
    },
    color: 'pink',
    colSpan: '',
  },
  {
    icon: Home,
    title: { bn: 'এসি ডর্ম ও আবাসন', en: 'AC Dormitory & Housing' },
    subTitle: {
      bn: 'নিরাপদ, আরামদায়ক ও শীতাতপ নিয়ন্ত্রিত থাকার ব্যবস্থা।',
      en: 'Safe, comfortable, and air-conditioned residential facilities.',
    },
    color: 'orange',
    colSpan: 'md:col-span-2',
  },
  {
    icon: Utensils,
    title: { bn: 'প্রিমিয়াম ডাইনিং', en: 'Premium Dining' },
    subTitle: {
      bn: 'স্বাস্থ্যকর ও মানসম্পন্ন খাবারের সুব্যবস্থা।',
      en: 'Provision for healthy and high-quality meals.',
    },
    color: 'red',
    colSpan: '',
  },
  {
    icon: Shield,
    title: { bn: '২৪/৭ নিরাপত্তা', en: '24/7 Security & CCTV' },
    subTitle: {
      bn: 'পুরো ক্যাম্পাস সিসিটিভি দ্বারা নিয়ন্ত্রিত এবং সুরক্ষিত।',
      en: 'The entire campus is monitored and secured by CCTV round the clock.',
    },
    color: 'cyan',
    colSpan: '',
  },
  {
    icon: Dices,
    title: { bn: 'স্পোর্টস জোন', en: 'Indoor Sports Zone' },
    subTitle: {
      bn: 'শিক্ষার্থীদের মানসিক বিকাশের জন্য ইনডোর গেমসের সুবিধা।',
      en: 'Indoor sports facilities for the mental and physical growth of students.',
    },
    color: 'yellow',
    colSpan: 'md:col-span-3 lg:col-span-2',
  },
  {
    icon: BookOpen,
    title: { bn: 'ডিজিটাল লাইব্রেরি', en: 'Digital Library' },
    subTitle: {
      bn: 'ইসলামিক ও আধুনিক জ্ঞান সমৃদ্ধ হাজারো বইয়ের সংগ্রহ।',
      en: 'Collection of thousands of books encompassing Islamic and modern knowledge.',
    },
    color: 'indigo',
    colSpan: '',
  },
];

// --- TikTok Video Data (Placeholders) ---
const tiktokVideos = [
  {
    id: 'video1',
    ytId: 'qkMoppbvb9w',
    title: { bn: 'ক্যাম্পাস ট্যুর', en: 'Campus Tour' },
    thumbnail: images.videoThumb1,
  },
  {
    id: 'video2',
    ytId: '-qeY4TS1sNQ',
    title: { bn: 'ক্লাস টাইম', en: 'Class Time' },
    thumbnail: images.videoThumb2,
  },
  {
    id: 'video3',
    ytId: 'nuKcyV8_pUc',
    title: { bn: 'স্টুডেন্ট লাইফ', en: 'Student Life' },
    thumbnail: images.videoThumb3,
  },
  {
    id: 'video4',
    ytId: 'G5EP-mxhABo',
    title: { bn: 'ল্যাব মোমেন্টস', en: 'Lab Moments' },
    thumbnail: images.videoThumb4,
  },
  {
    id: 'video5',
    ytId: 'WpeqBxqgHwg',
    title: { bn: 'খেলাধুলা', en: 'Sports Fun' },
    thumbnail: images.videoThumb5,
  },
];

export default function CampusPage() {
  const { language } = useLanguageStore();
  const { theme } = useTheme(); // Subscribe to theme changes to ensure re-renders

  // --- Global Background Pattern (Subtle) ---
  const bgPattern =
    'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ErrorBoundary>
      <div
        className={`min-h-screen bg-white dark:bg-[#030712] text-black dark:text-white selection:bg-[#00AEEF] selection:text-white ${bgPattern}`}
      >
        <HeroHeader />

        <main className="relative pt-20">
          {/* ==================== 1. NEXT LEVEL HERO SECTION ==================== */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-white dark:via-[#030712] to-white dark:to-[#030712]" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00AEEF]/20 rounded-full blur-[120px] animate-pulse"
                style={{ animationDuration: '6s' }}
              />
            </div>

            <div className="container relative z-10 px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: 'spring' }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md mb-8 hover:bg-[#00AEEF]/20 transition-colors cursor-default">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AEEF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00AEEF]"></span>
                  </span>
                  <span className="text-sm font-medium tracking-wide text-[#00AEEF]">
                    {language === 'bn'
                      ? 'নেক্সট জেনারেশন ক্যাম্পাস'
                      : 'Next Gen Campus'}
                  </span>
                </div>

                <h1
                  className={cn(
                    'text-5xl md:text-7xl lg:text-9xl font-bold mb-6 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-black to-black dark:from-white dark:to-white',
                    language === 'bn' && 'kalpurush-font leading-normal'
                  )}
                >
                  {language === 'bn' ? 'মানযিল ক্যাম্পাস' : 'MANZIL CAMPUS'}
                </h1>

                <p
                  className={cn(
                    'text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed',
                    language === 'bn' && 'kalpurush-font'
                  )}
                >
                  {language === 'bn'
                    ? 'আধুনিক প্রযুক্তি ও ইসলামিক মূল্যবোধের এক অনন্য স্থাপত্য।'
                    : 'A unique architecture of modern technology and Islamic values.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    className={cn(
                      'group h-14 px-8 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0099CC] hover:from-[#00AEEF]/90 hover:to-[#0099CC]/90 text-white text-lg font-bold shadow-[0_0_40px_-10px_rgba(0,174,239,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,174,239,0.8)] transition-all duration-500 hover:scale-110',
                      language === 'bn' && 'kalpurush-font'
                    )}
                    onClick={() =>
                      document
                        .getElementById('tour')
                        .scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    {language === 'bn' ? 'ক্যাম্পাস দেখুন' : 'Explore Campus'}{' '}
                    <ArrowDown className="ml-2 group-hover:animate-pulse transition-all duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      'group h-14 px-8 rounded-full border-black/20 dark:border-white/20 hover:border-[#00AEEF]/50 text-black dark:text-white hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 text-lg backdrop-blur-md transition-all duration-300 hover:scale-105',
                      language === 'bn' && 'kalpurush-font'
                    )}
                    onClick={() =>
                      document
                        .getElementById('gallery')
                        .scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    {language === 'bn' ? 'ভিডিও গ্যালারি' : 'Video Gallery'}{' '}
                    <Play className="ml-2 w-4 h-4 fill-current group-hover:animate-pulse transition-all duration-300" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* 3D Floor Effect at bottom */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#00AEEF]/10 to-transparent dark:from-[#00AEEF]/20 transform perspective-[500px] rotate-x-60 origin-bottom" />
          </section>

          {/* ==================== 2. NEXT LEVEL STICKY SCROLL TOUR (MOBILE RESPONSIVE FIXED) ==================== */}
          <section id="tour" className="relative bg-white dark:bg-[#020617] py-32">
            <div className="max-w-7xl mx-auto px-6 mb-24">
              <SectionHeading
                title={language === 'bn' ? 'ক্যাম্পাস ইনসাইড' : 'Inside Campus'}
                subtitle={
                  language === 'bn'
                    ? 'আধুনিক শিক্ষার পরিবেশ'
                    : 'Environment for modern learning'
                }
                lang={language}
              />
            </div>
            <StickyScroll steps={tourSteps} lang={language} />
          </section>

          {/* ==================== 3. TIKTOK STYLE VIDEO SECTION (AUTO-SCROLL & NO SCROLLBAR) ==================== */}
          <section
            id="gallery"
            className="py-24 relative overflow-hidden bg-gray-100 dark:bg-[#000000]"
          >
            {/* Fancy Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                {' '}
                <div>
                  <h2
                    className={cn(
                      'text-4xl md:text-6xl font-bold text-black dark:text-white mb-3',
                      language === 'bn' && 'kalpurush-font'
                    )}
                  >
                    {language === 'bn' ? 'ক্যাম্পাস রিলস' : 'Campus Reels'}
                  </h2>
                  <p className="text-black dark:text-white text-lg">
                    {language === 'bn'
                      ? 'ভিডিওর মাধ্যমে আমাদের দেখুন'
                      : 'Experience us through visuals'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[#00AEEF] font-medium cursor-pointer hover:underline underline-offset-4">
                  <span>
                    {language === 'bn' ? 'সব ভিডিও দেখুন' : 'Watch all videos'}
                  </span>{' '}
                  <MoveRight size={20} />
                </div>
              </div>

              {/* THE REELS COMPONENT */}
              <ReelsGallery videos={tiktokVideos} lang={language} />
            </div>
          </section>

          {/* ==================== 4. BENTO GRID AMENITIES (PREMIUM WITH SUB-TEXT) ==================== */}
          <section className="py-24 px-4 relative z-10 bg-white dark:bg-[#030712] border-t border-black/5 dark:border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  className={cn(
                    'text-3xl md:text-5xl font-bold text-black dark:text-white mb-4',
                    language === 'bn' && 'kalpurush-font'
                  )}
                >
                  {language === 'bn'
                    ? 'প্রিমিয়াম সুবিধাসমূহ'
                    : 'Premium Amenities'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {language === 'bn'
                    ? 'আন্তর্জাতিক মানের শিক্ষার জন্য আন্তর্জাতিক মানের সুবিধা'
                    : 'International standard facilities for international standard education'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {amenitiesData.map((item, idx) => (
                  <BentoCard key={idx} {...item} lang={language} />
                ))}
              </div>
            </div>
          </section>

          {/* ==================== 5. CALL TO ACTION (CTA) ==================== */}
          <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#00AEEF] to-blue-600 rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden group">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-[80px] group-hover:bg-white/30 transition-colors" />

              <div className="relative z-10 space-y-8">
                <h2
                  className={cn(
                    'text-3xl md:text-5xl font-bold text-white',
                    language === 'bn' && 'kalpurush-font'
                  )}
                >
                  {language === 'bn'
                    ? 'সরাসরি ক্যাম্পাস ভিজিট করুন'
                    : 'Visit Campus in Person'}
                </h2>
                <p
                  className={cn(
                    'text-blue-100 text-lg md:text-xl max-w-2xl mx-auto',
                    language === 'bn' && 'kalpurush-font'
                  )}
                >
                  {language === 'bn'
                    ? 'হারুনুর রশীদ টাওয়ার, বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, ঢাকা'
                    : 'Harunur Rashid Tower, House #91, Road #2, North Rayerbag Bus Stand, Dhaka'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    className={cn(
                      'h-14 px-10 rounded-full bg-white text-[#00AEEF] hover:bg-gray-100 text-lg font-bold w-full sm:w-auto',
                      language === 'bn' && 'kalpurush-font'
                    )}
                    onClick={() => (window.location.href = '/contact')}
                  >
                    {language === 'bn'
                      ? 'ভর্তির জন্য এপ্লাই করুন'
                      : 'Apply Now'}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 px-10 rounded-full border-white text-white hover:bg-white/10 dark:hover:bg-black/10 text-lg w-full sm:w-auto"
                  >
                    <Phone className="mr-2 h-5 w-5" /> 01407-046001
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <FooterSection />
      </div>
    </ErrorBoundary>
  );
}

// ----------------------------------------------------------------------
// SUB COMPONENTS (ANIMATED & ENHANCED)
// ----------------------------------------------------------------------

// Sub-component for the scrolling text (Desktop only)
const ScrollTextItem = ({ data, index, lang, isActive }) => {
  const ref = useRef(null);

  const activeClass = cn(
    'transition-all duration-700',
    isActive ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-16'
  );

  return (
    <div ref={ref} className="h-[100vh] flex flex-col justify-center">
      <motion.div
        className={cn('p-6 rounded-2xl bg-transparent', activeClass)}
        initial={{ scale: 0.98 }}
        animate={{ scale: isActive ? 1 : 0.98 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <span
            className={cn(
              'text-7xl font-mono transition-colors duration-500',
              isActive ? 'text-[#00AEEF]' : 'text-black/10 dark:text-white/10'
            )}
          >
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
          <div
            className={cn(
              'h-[2px] w-20 transition-colors duration-500',
              isActive ? 'bg-[#00AEEF]' : 'bg-black/20 dark:bg-white/20'
            )}
          />
        </div>

        <h3
          className={cn(
            'text-3xl md:text-5xl font-bold leading-tight mb-4 text-black dark:text-white',
            lang === 'bn' && 'kalpurush-font'
          )}
        >
          {data.title[lang === 'bn' ? 'bn' : 'en']}
        </h3>

        <p
          className={cn(
            'text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg',
            lang === 'bn' && 'kalpurush-font'
          )}
        >
          {data.desc[lang === 'bn' ? 'bn' : 'en']}
        </p>
      </motion.div>
    </div>
  );
};

// 2. Bento Grid Card (Updated with Sub-text)
const BentoCard = ({
  icon: Icon,
  title,
  subTitle,
  colSpan = '',
  color,
  lang,
}) => {
  const colorMap = {
    blue: 'text-blue-400 group-hover:text-blue-300',
    purple: 'text-purple-400 group-hover:text-purple-300',
    green: 'text-green-400 group-hover:text-green-300',
    orange: 'text-orange-400 group-hover:text-orange-300',
    red: 'text-red-400 group-hover:text-red-300',
    cyan: 'text-cyan-400 group-hover:text-cyan-300',
    yellow: 'text-yellow-400 group-hover:text-yellow-300',
    pink: 'text-pink-400 group-hover:text-pink-300',
    indigo: 'text-indigo-400 group-hover:text-indigo-300',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        'relative p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 overflow-hidden group hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300',
        colSpan
      )}
    >
      <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm',
            colorMap[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3
            className={cn(
              'text-xl font-bold text-black dark:text-white',
              lang === 'bn' && 'kalpurush-font'
            )}
          >
            {title[lang === 'bn' ? 'bn' : 'en']}
          </h3>
          <p
            className={cn(
              'text-sm text-gray-600 dark:text-gray-400',
              lang === 'bn' && 'kalpurush-font'
            )}
          >
            {subTitle[lang === 'bn' ? 'bn' : 'en']}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// 3. Video Swiper (Auto-Scroll & No Scrollbar)
const VideoSwiper = ({ videos, lang }) => {
  const scrollRef = useRef(null);
  const playersRef = useRef([]);
  const embedUrls = ['qkMoppbvb9w', '-qeY4TS1sNQ'];

  useEffect(() => {
    const initializePlayers = () => {
      videos.forEach((video, idx) => {
        const player = new window.YT.Player(`video-${idx}`, {
          videoId: embedUrls[idx % embedUrls.length],
          playerVars: {
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1,
            autoplay: 0,
          },
          events: {
            onStateChange: event => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                playersRef.current.forEach((p, i) => {
                  if (i !== idx && p && typeof p.pauseVideo === 'function') {
                    p.pauseVideo();
                  }
                });
              }
            },
          },
        });
        playersRef.current[idx] = player;
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayers();
    } else {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = initializePlayers;
    }

    return () => {
      playersRef.current.forEach(player => {
        if (player && typeof player.destroy === 'function') {
          player.destroy();
        }
      });
      playersRef.current = [];
    };
  }, [videos]);

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing px-2 md:px-0 no-scrollbar"
    >
      {videos.map((video, idx) => (
        <motion.div
          key={idx}
          className="snap-center shrink-0 w-[240px] sm:w-[280px] md:w-[320px] h-[240px] sm:h-[350px] md:h-[450px] rounded-[32px] overflow-hidden relative group border border-black/10 dark:border-white/10 bg-gray-900 shadow-2xl cursor-pointer"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          onClick={() =>
            window.open(
              `https://youtube.com/shorts/${embedUrls[idx % embedUrls.length]}`,
              '_blank'
            )
          }
        >
          <div
            id={`video-${idx}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          ></div>
          <div className="absolute bottom-4 left-4 right-4 text-black dark:text-white">
            <h3
              className={cn(
                'text-lg font-bold',
                lang === 'bn' && 'kalpurush-font'
              )}
            >
              {video.title[lang === 'bn' ? 'bn' : 'en']}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ReelsGallery = ({ videos, lang }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Function to handle play click - Stops others, plays selected
  const handlePlay = id => {
    if (playingVideoId === id) {
      setPlayingVideoId(null); // Toggle off if clicked again
    } else {
      setPlayingVideoId(id);
    }
  };

  return (
    <div className="relative w-full overflow-x-auto pb-12 pt-4 px-2 no-scrollbar cursor-grab active:cursor-grabbing">
      <div className="flex gap-6 md:gap-8 w-max mx-auto md:mx-0">
        {videos.map((video, idx) => (
          <ReelCard
            key={video.id}
            video={video}
            lang={lang}
            isPlaying={playingVideoId === video.id}
            onPlay={() => handlePlay(video.id)}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};

const ReelCard = ({ video, lang, isPlaying, onPlay, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[32px] overflow-hidden bg-gray-900 border border-white/10 shadow-2xl shrink-0 group transition-transform duration-300',
        isPlaying
          ? 'ring-2 ring-[#00AEEF] scale-[1.02]'
          : 'hover:-translate-y-2'
      )}
    >
      {/* 1. Thumbnail / Cover Image */}
      <div
        className={cn(
          'absolute inset-0 z-10 transition-opacity duration-500',
          isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      >
        <LazyImage
          src={video.thumbnail}
          alt="thumbnail"
          width={800}
          height={600}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

        {/* Play Button Icon Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onPlay}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>

        {/* Text Details at Bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3
            className={cn(
              'text-xl font-bold text-white leading-tight',
              lang === 'bn' && 'kalpurush-font'
            )}
          >
            {video.title[lang === 'bn' ? 'bn' : 'en']}
          </h3>
        </div>
      </div>

      {/* 2. YouTube Iframe (Only loads when playing) */}
      <div className="absolute inset-0 z-0 bg-black">
        {isPlaying ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${video.ytId}&playsinline=1`}
            //  title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* 3. Close/Stop Button (Visible only when playing) */}
      {isPlaying && (
        <button
          onClick={onPlay} // Toggles to null (stop)
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <Pause className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};

const SectionHeading = ({ title, subtitle, center, lang }) => (
  <div className={cn('mb-8', center && 'text-center')}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={cn(
        'text-3xl md:text-5xl font-bold text-black dark:text-white mb-3',
        lang === 'bn' && 'kalpurush-font'
      )}
    >
      {title}
    </motion.h2>
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: center ? 80 : 60 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className={cn('h-1 bg-[#00AEEF] rounded-full mb-4', center && 'mx-auto')}
    />
    {subtitle && (
      <p
        className={cn(
          'text-gray-400 text-lg',
          lang === 'bn' && 'kalpurush-font'
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const MobileFirstStickyScroll = ({ steps, lang }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const cardLength = steps.length;

  useTransform(scrollYProgress, [0, 1], [0, cardLength]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', latest => {
      const cardsBreakpoints = steps.map((_, index) => index / cardLength);
      const closestBreakpointIndex = cardsBreakpoints.reduce(
        (acc, breakpoint, index) => {
          const distance = Math.abs(latest - breakpoint);
          if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
            return index;
          }
          return acc;
        },
        0
      );
      setActiveCard(closestBreakpointIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, cardLength, steps]);

  return (
    <div
      ref={ref}
      className="flex justify-center relative space-x-0 md:space-x-10 p-4 md:p-10"
    >
      {/* Text Side */}
      <div className="relative flex items-start px-4 md:w-5/12">
        <div className="max-w-2xl">
          {steps.map((item, index) => (
            <div
              key={index}
              className="my-20 md:my-40 md:h-[60vh] flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="transition-opacity duration-500"
              >
                <div className="text-sm font-mono text-[#00AEEF] mb-4">
                  0{index + 1}.
                </div>
                <h2
                  className={cn(
                    'text-3xl md:text-5xl font-bold text-black dark:text-white mb-6',
                    lang === 'bn' && 'kalpurush-font'
                  )}
                >
                  {item.title[lang === 'bn' ? 'bn' : 'en']}
                </h2>
                <p
                  className={cn(
                    'text-lg text-black dark:text-white max-w-sm leading-relaxed',
                    lang === 'bn' && 'kalpurush-font'
                  )}
                >
                  {item.desc[lang === 'bn' ? 'bn' : 'en']}
                </p>
              </motion.div>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>

      {/* Image Side (Sticky) */}
      <div className="hidden md:block w-6/12 sticky top-32 h-[500px] rounded-[30px] overflow-hidden border border-white/10 bg-[#0f172a]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <LazyImage
              src={steps[activeCard].image}
              alt="campus"
              width={800}
              height={500}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// STICKY SCROLL (Improved for dark mode)
const StickyScroll = ({ steps, lang }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const cardLength = steps.length;

  useTransform(scrollYProgress, [0, 1], [0, cardLength]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', latest => {
      const cardsBreakpoints = steps.map((_, index) => index / cardLength);
      const closestBreakpointIndex = cardsBreakpoints.reduce(
        (acc, breakpoint, index) => {
          const distance = Math.abs(latest - breakpoint);
          if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
            return index;
          }
          return acc;
        },
        0
      );
      setActiveCard(closestBreakpointIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, cardLength, steps]);

  return (
    <div
      ref={ref}
      className="flex justify-center relative space-x-0 md:space-x-10 p-4 md:p-10"
    >
      {/* Text Side */}
      <div className="relative flex items-start px-4 md:w-5/12">
        <div className="max-w-2xl">
          {steps.map((item, index) => (
            <div
              key={index}
              className="my-20 md:my-40 md:h-[60vh] flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="transition-opacity duration-500"
              >
                <div className="text-sm font-mono text-[#00AEEF] mb-4">
                  0{index + 1}.
                </div>
                <h2
                  className={cn(
                    'text-3xl md:text-5xl font-bold text-black dark:text-white mb-6',
                    lang === 'bn' && 'kalpurush-font'
                  )}
                >
                  {item.title[lang === 'bn' ? 'bn' : 'en']}
                </h2>
                <p
                  className={cn(
                    'text-lg text-gray-400 max-w-sm leading-relaxed',
                    lang === 'bn' && 'kalpurush-font'
                  )}
                >
                  {item.desc[lang === 'bn' ? 'bn' : 'en']}
                </p>
              </motion.div>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>

      {/* Image Side (Sticky) */}
      <div className="hidden md:block w-6/12 sticky top-32 h-[500px] rounded-[30px] overflow-hidden border border-white/10 dark:border-black/10 bg-[#0f172a] dark:bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <LazyImage
              src={steps[activeCard].image}
              width={800}
              height={500}
              alt="campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 dark:bg-white/20" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Subtle Background Effect for Hero
const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#020617] overflow-hidden">
      <div
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
    </div>
  );
};
