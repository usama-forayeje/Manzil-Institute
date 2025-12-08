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
  Utensils,
  Coffee,
  Apple,
  ChevronDown,
  Moon,
  Droplets,
  BookOpen,
  Calculator,
  Monitor,
  Sun,
  Book,
  Sunset,
  Activity,
  Languages,
  Wrench,
  ChefHat,
  Bed,
  ChevronRight,
  Star,
  AlarmClock,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useLanguageStore } from '../../../lib/store';
import { cn } from '../../../lib/utils';
import { AnimatedGroup } from '../../../components/ui/animated-group';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../../../components/ui/table';
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
  
  const rulesData = {
    briefRules: {
      title: { bn: 'সংক্ষিপ্ত কানুন', en: 'Brief Rules' },
      rules: [
        {
          bn: 'প্রত্যেক শিক্ষার্থীকে প্রতিষ্ঠানের সকল নিয়ম কানুন মেনে চলতে হবে।',
          en: 'Every student must follow all the rules and regulations of the institution.',
        },
        {
          bn: 'প্রতিদিন নির্ধারিত রুটিন অনুসরণ করতে হবে।',
          en: 'The daily routine must be followed every day.',
        },
        {
          bn: 'শালীন, মার্জিত ও বিশুদ্ধ ভাষায় কথা কণা অপরিহার্য।',
          en: 'Speaking in decent, polite and pure language is essential.',
        },
        {
          bn: 'শিক্ষার্থীকে যথাসময়ে প্রতিষ্ঠানে উপস্থিত হতে হবে।',
          en: 'Students must be present at the institution on time.',
        },
        {
          bn: 'শার্ট-প্যান্ট ও আঁটসাঁট পোশাক পরিধান করা যাবে না।',
          en: 'Shirt-pant and tight clothing cannot be worn.',
        },
        {
          bn: 'কর্তৃপক্ষের অনুমতি ছাড়া প্রতিষ্ঠানের বাহিরে যাওয়া যাবে না।',
          en: 'Going outside the institution without permission from the authorities is not allowed.',
        },
        {
          bn: 'প্রতিষ্ঠানের শিক্ষক, কর্মচারী, অভিভাবকসহ সকলের সাথে শিক্ষার্থীর আচরণ হতে হবে মার্জিত, ভদ্র এবং শোভনীয়।',
          en: 'The behavior of students towards teachers, staff, guardians and everyone at the institution must be polite, decent and appropriate.',
        },
        {
          bn: 'প্রত্যেক শিক্ষার্থীকে প্রতিষ্ঠান কর্তৃক নির্ধারিত পরিচয়পত্র সাথে রাখতে হবে।',
          en: 'Every student must carry the identity card issued by the institution.',
        },
        {
          bn: 'নূন্যতম ৯০ শতাংশ ক্লাসের উপস্থিতি বাধ্যতামূলক।',
          en: 'Minimum 90% class attendance is mandatory.',
        },
        {
          bn: 'কোন শিক্ষার্থীর আচরণ প্রতিষ্ঠানের শৃঙ্খলা ও স্বার্থের পরিপন্থী বিবেচিত হলে কর্তৃপক্ষ শিক্ষার্থীকে বহিষ্কার করতে পারবে।',
          en: 'If any student\'s behavior is considered contrary to the discipline and interests of the institution, the authorities may expel the student.',
        },
        {
          bn: 'কোন শিক্ষার্থী প্রতিষ্ঠান পরিবর্তন করতে চাইলে লিখিত আবেদন করতে হবে।',
          en: 'If any student wants to change institution, a written application must be submitted.',
        },
        {
          bn: 'পাঁচ ওয়াক্ত সালাত জামাতের সাথে পড়তে হবে।',
          en: 'Five daily prayers must be performed with congregation.',
        },
        {
          bn: 'নিজের রুম, জামা, সিট, কাপড় গুছিয়ে পরিচ্ছন্ন রাখতে হবে।',
          en: 'One\'s room, clothes, seat, and clothes must be kept clean and organized.',
        },
        {
          bn: 'পড়ালেখা, ঘুম, খাওয়া ইত্যাদির সময় শৃঙ্খলা বজায় রাখতে হবে। ছাত্রাবাসে শৃঙ্খলাবদ্ধ জীবন যাপনে অভ্যন্ত হতে হবে।',
          en: 'Discipline must be maintained during study, sleep, eating, etc. One must get accustomed to disciplined life in the dormitory.',
        },
        {
          bn: 'কোনো সমস্যা হলে দায়িত্বশীল উত্তাদ বা কর্তৃপক্ষকে অবহিত করতে হবে।',
          en: 'In case of any problem, the responsible teacher or authorities must be informed.',
        },
        {
          bn: 'শিক্ষার্থীর কাছে টাকা রাখা যাবে না। খরচের টাকা অফিসে এবং নির্দিষ্ট জিম্মাদারের কাছে জমা রাখার ব্যবস্থা রয়েছে।',
          en: 'Students cannot keep money with them. Arrangements are made to deposit spending money in the office and with specific custodians.',
        },
        {
          bn: 'অফিস এবং শিক্ষকদের রুমে প্রবেশের সময় অনুমতি নিতে হবে।',
          en: 'Permission must be taken before entering the office and teachers\' rooms.',
        },
        {
          bn: 'যথাসময়ে খাবার খেতে করতে হবে।',
          en: 'Food must be eaten on time.',
        },
        {
          bn: 'মাদরাসা ত্যাগ এবং মাদরাসায় প্রবেশের সময় অফিসে দেখা করতে হবে এবং রেজিষ্ট্রি খাতায় সময় উল্লেখসহ স্বাক্ষর করতে হবে।',
          en: 'When leaving and entering the madrasa, one must visit the office and sign the register with time mentioned.',
        },
        {
          bn: 'মাদরাসায় আসা যাওয়া এবং ক্লাস চলাকালিন আইডি কার্ড পরিহিত থাকা বাধ্যতামূলক।',
          en: 'Wearing ID card is mandatory while coming to and from madrasa and during class hours.',
        },
        {
          bn: 'আবাসিক ছাত্রদের সিট বিন্যাস কর্তৃপক্ষ করবেন। এ ক্ষেত্রে অভিভাবকের কোন হস্তক্ষেপ গ্রহণযোগ্য নয়।',
          en: 'The authorities will arrange the seats for residential students. No intervention from guardians is acceptable in this regard.',
        },
        {
          bn: 'কোনো ছাত্রের নৈতিক চরিত্রের অবনতি হলে তাকে বহিষ্কার করা হবে।',
          en: 'If any student\'s moral character deteriorates, he will be expelled.',
        },
      ],
    },
    nonResidentialRules: {
      title: { bn: 'অনাবাসিক শিক্ষার্থীদের ক্ষেত্রে', en: 'For Non-residential Students' },
      rules: [
        {
          bn: 'অভিভাবকগণ যথাসময়ে মাদরাসায় শিক্ষার্থীর আসা-যাওয়া নিশ্চিত করবেন।',
          en: 'Guardians will ensure timely arrival and departure of students to/from the madrasa.',
        },
        {
          bn: 'শিক্ষার্থীকে মাদরাসা কর্তৃক নির্ধারিত ইউনিফর্ম পরিধান করে আসতে হবে।',
          en: 'Students must come wearing the uniform prescribed by the madrasa.',
        },
        {
          bn: 'মাদরাসা ছুটিকালীন অভিভাবক নিজ দায়িত্বে বাসায় পড়ালেখার ব্যবস্থা করবেন এবং নামাযের প্রতি বিশেষ যত্ন নিবেন।',
          en: 'During madrasa holidays, guardians will arrange for studies at home and pay special attention to prayers.',
        },
        {
          bn: 'কোনো সমস্যা হলে এম.এন.সি কর্তৃপক্ষকে অবহিত করবেন।',
          en: 'In case of any problem, inform the MNC authorities.',
        },
        {
          bn: 'কোনো কারণে অনুপস্থিত থাকলে লিখিতভাবে আবেদন করতে হবে।',
          en: 'If absent for any reason, a written application must be submitted.',
        },
        {
          bn: 'বাসায় শিক্ষার্থীর জন্য দ্বীনি পরিবেশের ব্যবস্থা করবেন।',
          en: 'Arrange for a religious environment for the student at home.',
        },
        {
          bn: 'শিক্ষার্থীকে শুধুমাত্র নির্দিষ্ট অভিভাবকগণই মাদরাসায় আনা নেওয়া করবেন।',
          en: 'Only specific guardians will bring and take the students to/from the madrasa.',
        },
        {
          bn: 'অভিভাবকগণ মাদরাসার অনুষ্ঠান এবং সমাবেশে উপস্থিত থেকে গুরুত্বপূর্ণ মতামত দেওয়ার চেষ্টা করবেন।',
          en: 'Guardians will try to attend madrasa events and gatherings and give important opinions.',
        },
        {
          bn: 'অভিভাবক নিজেও কুরআন ও দ্বীনি শিক্ষার সাথে সম্পৃক্ত থাকবেন।',
          en: 'Guardians themselves will remain associated with Quran and religious education.',
        },
      ],
    },
    guardiansResponsibilities: {
      title: { bn: 'অভিভাবকদের করণীয়ঃ', en: 'Guardians\' Responsibilities:' },
      rules: [
        {
          bn: 'অভিভাবকগণ প্রতিষ্ঠানের নিয়ম কানুন সম্পর্কে অবহিত থাকবেন।',
          en: 'Guardians will be aware of the rules and regulations of the institution.',
        },
        {
          bn: 'দ্বীনি শিক্ষার জ্ঞান অর্জনে সচেষ্ট থাকবেন।',
          en: 'They will be diligent in acquiring knowledge of religious education.',
        },
        {
          bn: 'কোন সমস্যা দেখলে সরাসরি এম.এন.সি কর্তৃপক্ষকে অবহিত করবেন।',
          en: 'If they see any problem, they will directly inform the MNC authorities.',
        },
        {
          bn: 'শিক্ষার্থীকে প্রতিষ্ঠানের সকল নিয়ম কানুন মেনে চলতে সহযোগিতা করবেন।',
          en: 'They will help the student follow all the rules and regulations of the institution.',
        },
        {
          bn: 'প্রতিষ্ঠানের নিয়ম কানুন ভঙ্গ করলে কর্তৃপক্ষের সিদ্ধান্তই চূড়ান্ত বলে বিবেচিত হবে।',
          en: 'If the rules and regulations of the institution are violated, the decision of the authorities will be considered final.',
        },
        {
          bn: 'মহিলা অভিভাবকগণ অবশ্যই শরয়ী পর্দা সহকারে প্রতিষ্ঠানে আসবেন।',
          en: 'Female guardians must come to the institution with proper Islamic hijab.',
        },
        {
          bn: 'বাসায় শিক্ষার্থীর জন্য ধর্মীয় পরিবেশের ব্যবস্থা রাখবেন।',
          en: 'They will arrange a religious environment for the student at home.',
        },
        {
          bn: 'সন্তানের পড়ার অগ্রগতির জন্য শিক্ষক ও প্রতিষ্ঠান প্রধানের সাথে পরামর্শ করবেন।',
          en: 'They will consult with teachers and the head of the institution regarding their child\'s academic progress.',
        },
        {
          bn: 'সানকে নির্ধারিত সময়ে প্রতিষ্ঠানে পৌঁছাবেন এবং নিয়ে যাবেন।',
          en: 'They will bring and take their children to the institution at the specified time.',
        },
        {
          bn: 'ইনস্টিটিউটের বিভিন্ন প্রোগ্রামে উপস্থিত থাকবেন।',
          en: 'They will be present at various programs of the institute.',
        },
        {
          bn: 'নির্দিষ্ট সময়ে যাবতীয় ফি পরিশোধ করবেন।',
          en: 'They will pay all fees at the specified time.',
        },
        {
          bn: 'প্রতিষ্ঠানের নিয়ম-শৃঙ্খলা বজায় রাখবেন।',
          en: 'They will maintain the rules and discipline of the institution.',
        },
        {
          bn: 'প্রতিষ্ঠানের কর্মকর্তা ও শিক্ষকদের সাথে সম্মানজনক আচরণ করবেন।',
          en: 'They will behave respectfully with the officers and teachers of the institution.',
        },
        {
          bn: 'প্রতিষ্ঠানের কল্যাণে ভূমিকা রাখবেন।',
          en: 'They will play a role in the welfare of the institution.',
        },
        {
          bn: 'অভিভাবক নিজেও কুরআন ও দ্বীনি শিক্ষার সাথে সম্পৃক্ত থাকবেন।',
          en: 'Guardians themselves will remain associated with Quran and religious education.',
        },
      ],
    },
    importantNotes: {
      title: { bn: 'জ্ঞাতব্যঃ', en: 'Important Note:' },
      notes: [
        {
          bn: 'আমাদের সার্বিক ব্যবস্থাপনার পরও যদি কোন শিক্ষার্থী মাদরাসা থেকে যথাযথ অনুমতি না নিয়ে প্রতিষ্ঠান ত্যাগ করে তবে এর কোন দায় দায়িত্ব প্রতিষ্ঠানের উপর বর্তাবে না।',
          en: 'Even after our overall management, if any student leaves the institution without proper permission from the madrasa, the institution will not bear any responsibility for it.',
        },
        {
          bn: '১. হায়াত-মওতের মালিক আল্লাহ তা\'য়ালা। তাই কোন শিক্ষার্থীর এক্সিডেন্ট বা আকস্মিক মৃত্যুর দায়-দায়িত্ব প্রতিষ্ঠান বহন করবে না। তবে ঘটনার সঠিক তদন্তের ব্যাপারে প্রতিষ্ঠান আন্তরিক ও সচেষ্ট থাকবে।',
          en: '1. Allah Ta\'ala is the owner of life and death. Therefore, the institution will not bear the responsibility for any accident or sudden death of any student. However, the institution will be sincere and diligent in investigating the incident.',
        },
        {
          bn: '৩. রাজনৈতিক কোন দল বা নিষিদ্ধ কোন সংস্থা অথবা কোন জঙ্গি সংগঠনের সাথে সম্পর্ক রাখা ইনস্টিটিউটের কানুন বহির্ভূত হওয়ায় এর পরিপূর্ণ দায়-দায়িত্ব শিক্ষার্থী নিজে এবং তার অভিভাবক বহন করিবে। এক্ষেত্রে প্রতিষ্ঠানের কোন দায়বদ্ধতা থাকবে না।',
          en: '3. Keeping relations with any political party or any banned organization or any terrorist organization is against the law of the institute, so the student himself and his guardian will bear the full responsibility for it. In this case, the institution will have no liability.',
        },
      ],
    },
  };
  
  const micDailyRoutine = {
    morning: [
      {
        time: '4:30 AM - 5:00 AM',
        name: { bn: 'ঘুম থেকে ওঠা', en: 'Wake Up' },
        description: {
          bn: 'ঘুম ভাঙা, পানি পান ও প্রস্তুতি',
          en: 'Waking up, drinking water and preparation',
        },
        duration: '30 min',
        icon: 'AlarmClock',
        category: 'preparation',
      },
      {
        time: '5:00 AM - 5:30 AM',
        name: { bn: 'ফজর নামাজ', en: 'Fajr Prayer' },
        description: {
          bn: 'ফজর নামাজ ও সকাল যিকির',
          en: 'Fajr prayer and morning dhikr',
        },
        duration: '30 min',
        icon: 'Moon',
        category: 'prayer',
      },
      {
        time: '5:30 AM - 6:00 AM',
        name: { bn: 'কুরআন তিলাওয়াত', en: 'Quran Recitation' },
        description: { bn: 'হিফজ ও তিলাওয়াত', en: 'Hifz and recitation' },
        duration: '30 min',
        icon: 'Book',
        category: 'study',
      },
      {
        time: '6:00 AM - 7:00 AM',
        name: { bn: 'সকালের নাস্তা', en: 'Breakfast' },
        description: {
          bn: 'হালাল পুষ্টিকর খাবার',
          en: 'Healthy halal breakfast',
        },
        duration: '1 hour',
        icon: 'Utensils',
        category: 'meal',
      },
      {
        time: '7:00 AM - 9:00 AM',
        name: { bn: 'ইসলামী শিক্ষা', en: 'Islamic Studies' },
        description: { bn: 'ফিকহ, হাদিস, আকাইদ', en: 'Fiqh, Hadith, Aqeedah' },
        duration: '2 hours',
        icon: 'BookOpen',
        category: 'class',
      },
      {
        time: '9:00 AM - 10:00 AM',
        name: { bn: 'সাধারণ শিক্ষা', en: 'General Education' },
        description: { bn: 'গণিত, বিজ্ঞান', en: 'Math & Science' },
        duration: '1 hour',
        icon: 'Calculator',
        category: 'class',
      },
      {
        time: '10:00 AM - 10:30 AM',
        name: { bn: 'চা বিরতি', en: 'Tea Break' },
        description: { bn: 'চা ও বিস্কুট', en: 'Tea & biscuits' },
        duration: '30 min',
        icon: 'Coffee',
        category: 'break',
      },
      {
        time: '10:30 AM - 12:00 PM',
        name: { bn: 'কম্পিউটার শিক্ষা', en: 'Computer Education' },
        description: {
          bn: 'আইটি, টাইপিং, প্রোগ্রামিং',
          en: 'IT, typing, programming',
        },
        duration: '1.5 hours',
        icon: 'Monitor',
        category: 'class',
      },
    ],
  
    afternoon: [
      {
        time: '12:00 PM - 1:00 PM',
        name: { bn: 'যোহর নামাজ', en: 'Dhuhr Prayer' },
        description: { bn: 'যোহর নামাজ ও যিকির', en: 'Dhuhr prayer & dhikr' },
        duration: '1 hour',
        icon: 'Sun',
        category: 'prayer',
      },
      {
        time: '1:00 PM - 2:00 PM',
        name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
        description: { bn: 'ভাত, মাছ/মাংস, ডাল', en: 'Rice, fish/meat, dal' },
        duration: '1 hour',
        icon: 'Utensils',
        category: 'meal',
      },
      {
        time: '2:00 PM - 3:00 PM',
        name: { bn: 'বিশ্রাম', en: 'Rest' },
        description: {
          bn: 'দুপুরের ঘুম ও তিলাওয়াত',
          en: 'Rest & light recitation',
        },
        duration: '1 hour',
        icon: 'Bed',
        category: 'rest',
      },
      {
        time: '3:00 PM - 4:00 PM',
        name: { bn: 'আসর নামাজ', en: 'Asr Prayer' },
        description: { bn: 'আসর নামাজ ও যিকির', en: 'Asr prayer & dhikr' },
        duration: '1 hour',
        icon: 'Sunset',
        category: 'prayer',
      },
      {
        time: '4:00 PM - 5:00 PM',
        name: { bn: 'খেলাধুলা', en: 'Sports' },
        description: {
          bn: 'ফুটবল, ক্রিকেট, ব্যায়াম',
          en: 'Football, cricket, exercise',
        },
        duration: '1 hour',
        icon: 'Activity',
        category: 'activity',
      },
      {
        time: '5:00 PM - 6:00 PM',
        name: { bn: 'ভাষা শিক্ষা', en: 'Language Learning' },
        description: { bn: 'আরবি ও ইংরেজি', en: 'Arabic & English' },
        duration: '1 hour',
        icon: 'Languages',
        category: 'class',
      },
    ],
  
    evening: [
      {
        time: '6:00 PM - 7:00 PM',
        name: { bn: 'মাগরিব নামাজ', en: 'Maghrib Prayer' },
        description: { bn: 'মাগরিব নামাজ ও যিকির', en: 'Maghrib prayer & dhikr' },
        duration: '1 hour',
        icon: 'Moon',
        category: 'prayer',
      },
      {
        time: '7:00 PM - 8:00 PM',
        name: { bn: 'রাতের খাবার', en: 'Dinner' },
        description: { bn: 'ভাত, তরকারি, সালাদ', en: 'Rice, curry, salad' },
        duration: '1 hour',
        icon: 'Utensils',
        category: 'meal',
      },
      {
        time: '8:00 PM - 9:00 PM',
        name: { bn: 'কারিগরি শিক্ষা', en: 'Vocational Training' },
        description: {
          bn: 'হস্তশিল্প ও স্কিল ডেভেলপমেন্ট',
          en: 'Crafts & skill development',
        },
        duration: '1 hour',
        icon: 'Wrench',
        category: 'class',
      },
      {
        time: '9:00 PM - 10:00 PM',
        name: { bn: 'ইশা নামাজ', en: 'Isha Prayer' },
        description: { bn: 'ইশা নামাজ ও যিকির', en: 'Isha prayer & dhikr' },
        duration: '1 hour',
        icon: 'Moon',
        category: 'prayer',
      },
    ],
  
    night: [
      {
        time: '10:00 PM - 11:00 PM',
        name: { bn: 'রাতের পড়াশোনা', en: 'Night Study' },
        description: { bn: 'হোমওয়ার্ক ও রিভিশন', en: 'Homework & revision' },
        duration: '1 hour',
        icon: 'BookOpen',
        category: 'study',
      },
      {
        time: '11:00 PM - 12:00 AM',
        name: { bn: 'দক্ষতা প্রশিক্ষণ', en: 'Skill Training' },
        description: {
          bn: 'রান্না, ফার্স্ট এইড, লাইফ স্কিল',
          en: 'Cooking, first aid, life skills',
        },
        duration: '1 hour',
        icon: 'ChefHat',
        category: 'class',
      },
      {
        time: '12:00 AM - 1:00 AM',
        name: { bn: 'রাতের স্ন্যাকস', en: 'Night Snacks' },
        description: {
          bn: 'দুধ, কুকি, হালাল স্ন্যাকস',
          en: 'Milk, cookies, halal snacks',
        },
        duration: '1 hour',
        icon: 'Coffee',
        category: 'meal',
      },
      {
        time: '1:00 AM - 4:00 AM',
        name: { bn: 'রাতের ঘুম', en: 'Night Sleep' },
        description: {
          bn: 'পর্যাপ্ত ঘুম ও বিশ্রাম',
          en: 'Adequate sleep & rest',
        },
        duration: '3 hours',
        icon: 'Bed',
        category: 'rest',
      },
    ],
  };
  
  const periodNames = {
    morning: { bn: 'সকাল', en: 'Morning' },
    afternoon: { bn: 'দুপুর', en: 'Afternoon' },
    evening: { bn: 'সন্ধ্যা', en: 'Evening' },
    night: { bn: 'রাত', en: 'Night' },
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
      label: language === 'bn' ? 'রুটিন' : 'Daily Routine',
    },
    {
      id: 'rules',
      label: language === 'bn' ? 'কানুন' : 'Rules',
      icon: AlertCircle,
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
  
  // --- Sub Components ---
  
  const SectionHeader = ({ title, subtitle }) => (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );

  return (
    <ErrorBoundary>
      <div>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <HeroHeader />

        <main
          className="min-h-screen  mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12"
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
                <div></div>
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

                  {/* Residential Fees Table */}
                  <div className="bg-gradient-to-r from-[#00AEEF]/10 to-purple-50 dark:from-[#00AEEF]/5 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6">
                    <h4
                      className={cn(
                        'text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'আবাসিক ফি'
                        : 'Residential Fees'}
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'বিবরণ' : 'Description'}
                          </TableHead>
                          <TableHead className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'পরিমাণ' : 'Amount'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'ভর্তি ফি' : 'Admission Fee'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">৫০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'আইডি কার্ড' : 'ID Card'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">২০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'আবাসিক ফি' : 'Residential Fee'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">১০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'মাসিক বেতন' : 'Monthly Salary'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">২০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'খাবার' : 'Food'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">৮০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'কোচিং (বাধ্যতামূলক)' : 'Coaching (mandatory)'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">১০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'এককালীন' : 'One-time'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">১৩৪০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'মাসিক ক্লাস ৬ থেকে' : 'Monthly Class up to 6'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">৮০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'মাসিক ক্লাস ৬ এর নিচে' : 'Monthly Class Below 6'}
                          </TableCell>
                          <TableCell className="font-bold text-[#00AEEF]">৭০০০</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Non-Residential Fees Table */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6">
                    <h4
                      className={cn(
                        'text-base sm:text-lg md:text-xl font-semibold text-green-800 dark:text-green-200 mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'অনাবাসিক ফি'
                        : 'Non-Residential Fees'}
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'বিবরণ' : 'Description'}
                          </TableHead>
                          <TableHead className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'পরিমাণ' : 'Amount'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'কোচিং সহ' : 'With Coaching'}
                          </TableCell>
                          <TableCell className="font-bold text-green-600">৪০০০</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={cn(language === 'bn' && 'bengali-text')}>
                            {language === 'bn' ? 'কোচিং ছাড়া' : 'Without Coaching'}
                          </TableCell>
                          <TableCell className="font-bold text-green-600">৩০০০</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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

              {/* === Daily Routine (Timeline V2) === */}
              {activeTab === '24hour' && (
                <div className="max-w-4xl mx-auto space-y-12">
                  <SectionHeader
                    title={
                      language === 'bn' ? 'দৈনন্দিন রুটিন' : 'Daily Routine'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'MIC শিক্ষার্থীদের সারাদিনের কার্যক্রম'
                        : 'Day-to-day activities of MIC students'
                    }
                  />

                  {Object.entries(micDailyRoutine).map(
                    ([period, activities], pIdx) => (
                      <div key={pIdx} className="relative pl-8 md:pl-0">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 dark:border-gray-700">
                          {periodNames[period][language === 'bn' ? 'bn' : 'en']}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {activities.map((activity, aIdx) => {
                            const IconComponent =
                              {
                                Moon,
                                Droplets,
                                Utensils,
                                BookOpen,
                                Calculator,
                                Monitor,
                                Sun,
                                Book,
                                Sunset,
                                Activity,
                                Languages,
                                Wrench,
                                ChefHat,
                                Bed,
                                Coffee,
                                AlarmClock,
                              }[activity.icon] || Clock;
                            return (
                              <div
                                key={aIdx}
                                className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                              >
                                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center shrink-0 text-[#00AEEF]">
                                  <IconComponent className="w-6 h-6" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-[#00AEEF] block mb-1">
                                    {activity.time}
                                  </span>
                                  <h4
                                    className={cn(
                                      'font-bold text-gray-900 dark:text-white text-sm mb-1',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {
                                      activity.name[
                                      language === 'bn' ? 'bn' : 'en'
                                      ]
                                    }
                                  </h4>
                                  <p
                                    className={cn(
                                      'text-xs text-gray-500',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {
                                      activity.description[
                                      language === 'bn' ? 'bn' : 'en'
                                      ]
                                    }
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* === Rules Section === */}
              {activeTab === 'rules' && (
                <div className="space-y-8">
                  <SectionHeader
                    title={
                      language === 'bn'
                        ? 'কানুন ও নীতিমালা'
                        : 'Rules and Regulations'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'MNC-এর নিয়ম কানুন এবং শৃঙ্খলা'
                        : 'MNC Rules, Regulations and Discipline'
                    }
                  />

                  {/* Brief Rules Section */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-8 rounded-3xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <Book className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className={cn(
                        'text-2xl font-bold text-purple-800 dark:text-purple-200',
                        language === 'bn' && 'bengali-text'
                      )}>
                        {rulesData.briefRules.title[language === 'bn' ? 'bn' : 'en']}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {rulesData.briefRules.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                          <span className={cn(
                            'text-purple-700 dark:text-purple-300 leading-relaxed',
                            language === 'bn' && 'bengali-text'
                          )}>
                            {rule[language === 'bn' ? 'bn' : 'en']}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Non-residential Students Section */}
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className={cn(
                        'text-2xl font-bold text-gray-900 dark:text-white',
                        language === 'bn' && 'bengali-text'
                      )}>
                        {rulesData.nonResidentialRules.title[language === 'bn' ? 'bn' : 'en']}
                      </h3>
                    </div>
                    <ul className="space-y-4">
                      {rulesData.nonResidentialRules.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          <span className={cn(
                            'text-gray-700 dark:text-gray-300 leading-relaxed',
                            language === 'bn' && 'bengali-text'
                          )}>
                            {rule[language === 'bn' ? 'bn' : 'en']}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Guardians' Responsibilities Section */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className={cn(
                        'text-2xl font-bold text-green-800 dark:text-green-200',
                        language === 'bn' && 'bengali-text'
                      )}>
                        {rulesData.guardiansResponsibilities.title[language === 'bn' ? 'bn' : 'en']}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {rulesData.guardiansResponsibilities.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                          <span className={cn(
                            'text-green-700 dark:text-green-300 leading-relaxed',
                            language === 'bn' && 'bengali-text'
                          )}>
                            {rule[language === 'bn' ? 'bn' : 'en']}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Important Note Section */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className={cn(
                        'text-2xl font-bold text-red-800 dark:text-red-200',
                        language === 'bn' && 'bengali-text'
                      )}>
                        {rulesData.importantNotes.title[language === 'bn' ? 'bn' : 'en']}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {rulesData.importantNotes.notes.map((note, idx) => (
                        <div key={idx} className={cn(
                          idx > 0 && 'bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-red-300 dark:border-red-700'
                        )}>
                          <p className={cn(
                            'text-red-700 dark:text-red-300 leading-relaxed font-medium',
                            language === 'bn' && 'bengali-text'
                          )}>
                            {note[language === 'bn' ? 'bn' : 'en']}
                          </p>
                        </div>
                      ))}
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
