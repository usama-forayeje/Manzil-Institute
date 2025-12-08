"use client";
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
  Pause,
} from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { Button } from '../../components/ui/button';
import { useLanguageStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import ErrorBoundary from '../../components/ErrorBoundary';
import FooterSection from '../../components/footer';
import HeroHeader from '@/components/header';
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
  // Video Thumbnails
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

// --- Data for Section 4 (Premium Amenities) ---
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

// --- TikTok Video Data ---
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
  const { theme } = useTheme();

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
                      'group h-14 px-8 bg-gradient-to-r from-[#00AEEF] to-[#0099CC] hover:from-[#00AEEF]/90 hover:to-[#0099CC]/90 text-white text-lg font-bold shadow-[0_0_40px_-10px_rgba(0,174,239,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,174,239,0.8)] transition-all duration-500 hover:scale-110',
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
                      'group h-14 px-8 border-black/20 dark:border-white/20 hover:border-[#00AEEF]/50 text-black dark:text-white hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 text-lg backdrop-blur-md transition-all duration-300 hover:scale-105',
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

          {/* ==================== 2. AWESOME STICKY SCROLL TOUR (FIXED RESPONSIVE) ==================== */}
          <section id="tour" className="relative bg-white dark:bg-[#020617] py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-24">
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

            {/* The Main Responsive Sticky Component */}
            <StickyScroll steps={tourSteps} lang={language} />

          </section>

          {/* ==================== 3. TIKTOK STYLE VIDEO SECTION ==================== */}
          <section
            id="gallery"
            className="py-24 relative overflow-hidden bg-gray-100 dark:bg-[#000000]"
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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

              {/* REELS COMPONENT */}
              <ReelsGallery videos={tiktokVideos} lang={language} />
            </div>
          </section>

          {/* ==================== 4. BENTO GRID AMENITIES ==================== */}
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
                    size="sm"
                    className={cn(
                      'bg-white text-[#00AEEF] hover:bg-gray-100 font-bold w-full sm:w-auto',
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
                    size="sm"
                    className="border-white text-white hover:bg-white/10 dark:hover:bg-black/10 w-full sm:w-auto"
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
// SUB COMPONENTS (OPTIMIZED)
// ----------------------------------------------------------------------

// 1. Bento Grid Card
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

// 2. Reels Gallery
const ReelsGallery = ({ videos, lang }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const handlePlay = id => {
    if (playingVideoId === id) {
      setPlayingVideoId(null);
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onPlay}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>

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

      <div className="absolute inset-0 z-0 bg-black">
        {isPlaying ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${video.ytId}&playsinline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {isPlaying && (
        <button
          onClick={onPlay}
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

// ====================================================================
// NEXT LEVEL STICKY SCROLL (ULTRA RESPONSIVE & PREMIUM UI)
// ====================================================================
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
      className="relative flex flex-col lg:flex-row justify-center lg:space-x-12 px-4 md:px-10 max-w-[1500px] mx-auto"
    >

      {/* --------------------------------------------------
          CONTENT SIDE (TEXT) - Wider on Desktop
          -------------------------------------------------- */}
      <div className="relative z-10 w-full lg:w-[50%] order-2 lg:order-1 mt-[5vh] lg:mt-0">
        <div className="flex flex-col">
          {steps.map((item, index) => {
            // Check if this card is active
            const isActive = activeCard === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-20% 0px -20% 0px" }}
                className={cn(
                  "flex flex-col justify-center mb-[40vh] lg:mb-0 lg:h-[70vh] transition-all duration-500 ease-out", // Reduced height and faster transition
                  // Desktop: Remove blur, increased inactive opacity
                  isActive ? "lg:opacity-100 lg:scale-100" : "lg:opacity-50 lg:scale-[0.98]"
                )}
              >
                {/* CARD CONTAINER */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[24px] p-8 md:p-12 transition-all duration-500",
                    // Mobile: Glassmorphism Card Style (kept for awesome mobile look)
                    "bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 dark:border-white/10",
                    // Desktop: Clearer style with active border
                    "lg:bg-transparent lg:shadow-none lg:border-l-4",
                    isActive
                      ? "lg:border-[#00AEEF] lg:bg-gradient-to-r lg:from-[#00AEEF]/5 lg:to-transparent"
                      : "lg:border-transparent"
                  )}
                >

                  {/* Number Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className={cn(
                        "text-sm font-bold font-mono px-3 py-1 rounded-full transition-colors duration-500",
                        isActive
                          ? "bg-[#00AEEF] text-white"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                      {lang === 'bn' ? 'ফিচার' : 'FEATURE'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className={cn(
                      'text-2xl md:text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-500',
                      // Inactive text color slightly improved
                      isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-500",
                      lang === 'bn' && 'kalpurush-font'
                    )}
                  >
                    {item.title[lang === 'bn' ? 'bn' : 'en']}
                  </h2>

                  {/* Description */}
                  <p
                    className={cn(
                      'text-base md:text-xl leading-relaxed transition-colors duration-500',
                      // Inactive text color slightly improved
                      isActive ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-600",
                      lang === 'bn' && 'kalpurush-font'
                    )}
                  >
                    {item.desc[lang === 'bn' ? 'bn' : 'en']}
                  </p>

                  {/* Mobile Only: Small Image Indicator if needed or decorative element */}
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/10 rounded-full blur-3xl -z-10 transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-0"
                  )} />
                </div>
              </motion.div>
            );
          })}
          {/* Bottom spacer for comfortable scrolling */}
          <div className="h-[20vh] lg:h-0" />
        </div>
      </div>

      {/* --------------------------------------------------
          IMAGE SIDE (STICKY) - Reduced Width and Height
          -------------------------------------------------- */}
      <div
        className={cn(
          "w-full lg:w-[40%] order-1 lg:order-2", // Reduced width
          // Mobile Sticky: Top overlay style
          "sticky top-[80px] h-[40vh] z-0 mb-[-15vh]",
          // Desktop Sticky: Tighter vertical centering
          "lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center lg:mb-0 lg:py-20"
        )}
      >
        <div className="relative w-full h-full lg:h-[500px] rounded-[32px] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-gray-900 group">

          {/* Animated Gradient Border Effect */}
          <div className="absolute inset-0 z-20 pointer-events-none rounded-[32px] ring-1 ring-inset ring-black/10 dark:ring-white/10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <LazyImage
                src={steps[activeCard].image}
                width={1000}
                height={800}
                alt="campus-tour"
                className="w-full h-full object-cover"
              />

              {/* Overlay Gradient for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

              {/* Desktop Only: Image Caption/Title overlay at bottom of image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-6 z-30 hidden lg:block"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
                  <p className={cn("text-white font-medium", lang === 'bn' && 'kalpurush-font')}>
                    {steps[activeCard].title[lang === 'bn' ? 'bn' : 'en']}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};