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

// --- Image Assets (Replace with real paths) ---
const images = {
  bridge:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/building.jpg',
  building:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/building-2.jpg',
  corridor:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/coridor.jpg',
  reception:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/office.jpg',
  arabicClass:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/arabicClass-1.jpg',
  generalClass:
    'https://ik.imagekit.io/lgd2hue3i/Manzil-Institute/generalClass.jpg',
  languageLab:
    '/languageclass.webp',
  computerLab:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop',
  engineering:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2670&auto=format&fit=crop',
  auditorium:
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2669&auto=format&fit=crop',
  students:
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2669&auto=format&fit=crop',
  dorm: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2669&auto=format&fit=crop',
  videoThumb1:
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2674&auto=format&fit=crop',
  videoThumb2:
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=2674&auto=format&fit=crop',
  videoThumb3:
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2674&auto=format&fit=crop',
  videoThumb4:
    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2674&auto=format&fit=crop',
  videoThumb5:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2674&auto=format&fit=crop',
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
    id: 1,
    title: {
      bn: 'ক্যাম্পাস লাইফ ভ্লগ - পার্ট ১',
      en: 'Campus Life Vlog - Part 1',
    },
    tiktokUrl: 'https://www.tiktok.com/@jamalmasrur/video/7504959872937577746',
    thumbnail: images.videoThumb1,
  },
  {
    id: 2,
    title: { bn: 'ক্লাসের এক ঝলক', en: 'A Glimpse of the Class' },
    tiktokUrl:
      'https://www.tiktok.com/@placeholder_manzil/video/7302484732168345858',
    thumbnail: images.videoThumb2,
  },
  {
    id: 3,
    title: { bn: 'শিক্ষক-শিক্ষার্থী সম্পর্ক', en: 'Teacher-Student Bond' },
    tiktokUrl:
      'https://www.tiktok.com/@placeholder_manzil/video/7302484732168345858',
    thumbnail: images.videoThumb3,
  },
  {
    id: 4,
    title: { bn: 'ল্যাবের কিছু মুহূর্ত', en: 'Moments in the Lab' },
    tiktokUrl:
      'https://www.tiktok.com/@placeholder_manzil/video/7302484732168345858',
    thumbnail: images.videoThumb4,
  },
  {
    id: 5,
    title: { bn: 'ডর্মের পরিবেশ', en: 'Dormitory Environment' },
    tiktokUrl:
      'https://www.tiktok.com/@placeholder_manzil/video/7302484732168345858',
    thumbnail: images.videoThumb5,
  },
  {
    id: 6,
    title: { bn: 'স্পোর্টস ডে ফান', en: 'Sports Day Fun' },
    tiktokUrl:
      'https://www.tiktok.com/@placeholder_manzil/video/7302484732168345858',
    thumbnail: images.videoThumb6,
  },
];

export default function CampusPage() {
  const { language } = useLanguageStore();

  // --- Global Background Pattern (Subtle) ---
  const bgPattern =
    'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ErrorBoundary>
      <div
        className={`min-h-screen bg-[#030712] text-white selection:bg-[#00AEEF] selection:text-white ${bgPattern}`}
      >
        <HeroHeader />

        <main className="relative pt-20">
          {/* ==================== 1. NEXT LEVEL HERO SECTION ==================== */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-[#030712] to-[#030712]" />
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-[#00AEEF]/20 transition-colors cursor-default">
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
                    'text-5xl md:text-7xl lg:text-9xl font-bold mb-6 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40',
                    language === 'bn' && 'kalpurush-font leading-normal'
                  )}
                >
                  {language === 'bn' ? 'মানযিল ক্যাম্পাস' : 'MANZIL CAMPUS'}
                </h1>

                <p
                  className={cn(
                    'text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed',
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
                      'group h-14 px-8 rounded-full border-white/20 hover:border-[#00AEEF]/50 text-white hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 text-lg backdrop-blur-md transition-all duration-300 hover:scale-105',
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
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#00AEEF]/10 to-transparent transform perspective-[500px] rotate-x-60 origin-bottom" />
          </section>

          {/* ==================== 2. NEXT LEVEL STICKY SCROLL TOUR (MOBILE RESPONSIVE FIXED) ==================== */}
          <section id="tour" className="relative bg-[#030712] py-24">
            <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-24">
              <h2
                className={cn(
                  'text-4xl md:text-6xl font-bold text-white mb-4',
                  language === 'bn' && 'kalpurush-font'
                )}
              >
                {language === 'bn' ? 'ক্যাম্পাস ইনসাইড' : 'Inside Campus'}
              </h2>
              <div className="h-1 w-20 bg-[#00AEEF] rounded-full" />
            </div>

            <MobileFirstStickyScroll steps={tourSteps} lang={language} />
          </section>

          {/* ==================== 3. TIKTOK STYLE VIDEO SECTION (AUTO-SCROLL & NO SCROLLBAR) ==================== */}
          <section
            id="gallery"
            className="py-8 relative overflow-hidden border-t border-white/5"
          >
            <div className="max-w-[1400px] mx-auto px-4 relative z-10">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2
                    className={cn(
                      'text-3xl md:text-5xl font-bold text-white mb-2',
                      language === 'bn' && 'kalpurush-font'
                    )}
                  >
                    {language === 'bn' ? 'ক্যাম্পাস রিলস' : 'Campus Reels'}
                  </h2>
                  <p className="text-gray-400">
                    {language === 'bn'
                      ? 'শিক্ষার্থীদের জীবনের খন্ডচিত্র'
                      : 'Glimpses of student life'}
                  </p>
                </div>
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="link"
                    className="text-[#00AEEF] hover:text-blue-400"
                  >
                    {language === 'bn' ? 'সব ভিডিও দেখুন' : 'View All Videos'}{' '}
                    <MoveRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>

              <VideoSwiper videos={tiktokVideos} lang={language} />
            </div>
          </section>

          {/* ==================== 4. BENTO GRID AMENITIES (PREMIUM WITH SUB-TEXT) ==================== */}
          <section className="py-24 px-4 relative z-10 bg-[#030712] border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  className={cn(
                    'text-3xl md:text-5xl font-bold text-white mb-4',
                    language === 'bn' && 'kalpurush-font'
                  )}
                >
                  {language === 'bn'
                    ? 'প্রিমিয়াম সুবিধাসমূহ'
                    : 'Premium Amenities'}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
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
                    className="h-14 px-10 rounded-full border-white text-white hover:bg-white/10 text-lg w-full sm:w-auto"
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

// 1. MOBILE-FIRST Sticky Scroll Component (Fixed for mobile)
const MobileFirstStickyScroll = ({ steps, lang }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const itemHeight = 1 / steps.length;

  useEffect(() => {
    return scrollYProgress.on('change', latest => {
      const newIndex = Math.min(
        steps.length - 1,
        Math.floor(latest / itemHeight)
      );

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    });
  }, [scrollYProgress, itemHeight, activeIndex, steps.length]);

  return (
    <div ref={containerRef} className="relative">
      {/* MOBILE VIEW: Stacked Image and Text */}
      <div className="md:hidden">
        {steps.map((step, i) => (
          <div key={i} className="min-h-[100vh] flex flex-col mb-20">
            {/* Image at TOP */}
            <div className="h-[50vh] w-full rounded-2xl overflow-hidden relative mb-6">
              <LazyImage
                src={step.image}
                alt={step.title[lang === 'bn' ? 'bn' : 'en']}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <h3
                  className={cn(
                    'text-xl font-bold text-white',
                    lang === 'bn' && 'kalpurush-font'
                  )}
                >
                  {step.title[lang === 'bn' ? 'bn' : 'en']}
                </h3>
                <p className="text-sm text-[#00AEEF]">
                  {lang === 'bn'
                    ? `ছবি ${i + 1} / ${steps.length}`
                    : `Photo ${i + 1} / ${steps.length}`}
                </p>
              </div>
            </div>

            {/* Text BELOW Image */}
            <div className="px-4">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={cn(
                    'text-5xl font-mono',
                    i === activeIndex ? 'text-[#00AEEF]' : 'text-white/10'
                  )}
                >
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </span>
                <div
                  className={cn(
                    'h-[2px] w-20',
                    i === activeIndex ? 'bg-[#00AEEF]' : 'bg-white/20'
                  )}
                />
              </div>

              <h3
                className={cn(
                  'text-2xl font-bold mb-4',
                  lang === 'bn' && 'kalpurush-font'
                )}
              >
                {step.title[lang === 'bn' ? 'bn' : 'en']}
              </h3>

              <p
                className={cn(
                  'text-gray-400',
                  lang === 'bn' && 'kalpurush-font'
                )}
              >
                {step.desc[lang === 'bn' ? 'bn' : 'en']}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Original Sticky Layout */}
      <div className="hidden md:flex max-w-7xl mx-auto min-h-[500vh]">
        {/* Sticky Image Area (Right) */}
        <div className="w-1/2 sticky top-20 h-[calc(100vh-80px)] p-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center p-8 transition-all duration-700 h-full w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: i === activeIndex ? 1 : 0,
                scale: i === activeIndex ? 1 : 0.95,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <LazyImage
                  src={step.image}
                  alt={step.title[lang === 'bn' ? 'bn' : 'en']}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3
                    className={cn(
                      'text-2xl font-bold text-white mb-1',
                      lang === 'bn' && 'kalpurush-font'
                    )}
                  >
                    {step.title[lang === 'bn' ? 'bn' : 'en']}
                  </h3>
                  <p className="text-[#00AEEF] text-sm font-mono">
                    {lang === 'bn'
                      ? `ছবি ${i + 1} / ${steps.length}`
                      : `Photo ${i + 1} / ${steps.length}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scrolling Text Area (Left) */}
        <div className="w-1/2 p-4 px-4">
          {steps.map((step, i) => (
            <ScrollTextItem
              key={i}
              data={step}
              index={i}
              lang={lang}
              isActive={i === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

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
              isActive ? 'text-[#00AEEF]' : 'text-white/10'
            )}
          >
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
          <div
            className={cn(
              'h-[2px] w-20 transition-colors duration-500',
              isActive ? 'bg-[#00AEEF]' : 'bg-white/20'
            )}
          />
        </div>

        <h3
          className={cn(
            'text-3xl md:text-5xl font-bold leading-tight mb-4',
            lang === 'bn' && 'kalpurush-font'
          )}
        >
          {data.title[lang === 'bn' ? 'bn' : 'en']}
        </h3>

        <p
          className={cn(
            'text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg',
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
        'relative p-6 rounded-3xl bg-white/5 border border-white/10 overflow-hidden group hover:bg-white/10 transition-colors duration-300',
        colSpan
      )}
    >
      <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm',
            colorMap[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3
            className={cn(
              'text-xl font-bold text-white',
              lang === 'bn' && 'kalpurush-font'
            )}
          >
            {title[lang === 'bn' ? 'bn' : 'en']}
          </h3>
          <p
            className={cn(
              'text-sm text-gray-400',
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
          className="snap-center shrink-0 w-[240px] sm:w-[280px] md:w-[320px] h-[240px] sm:h-[350px] md:h-[450px] rounded-[32px] overflow-hidden relative group border border-white/10 bg-gray-900 shadow-2xl cursor-pointer"
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
          <div className="absolute bottom-4 left-4 right-4 text-white">
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
