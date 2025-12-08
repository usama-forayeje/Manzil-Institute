"use client"

import { useState, useEffect } from 'react';

export const metadata = {
  title: 'MIC Admission Process - Manzil International Curriculum Bangladesh',
  description: 'Complete admission process for MIC Curriculum at Manzil International Institute. Comprehensive Islamic and modern education program integrating Madrasa, General and Technical education for 7 years.',
  keywords: [
    'MIC admission',
    'Manzil International Curriculum admission',
    'Islamic education Bangladesh',
    'Madrasa curriculum admission',
    'Technical education admission',
    'Bangladesh Islamic curriculum',
    'MIC program admission',
    'Manzil Institute MIC',
  ],
  openGraph: {
    title: 'MIC ভর্তি প্রক্রিয়া - বাংলাদেশে মানজিল ইন্টারন্যাশনাল কারিকুলাম',
    description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে MIC কারিকুলামের সম্পূর্ণ ভর্তি প্রক্রিয়া। 7 বছরের জন্য মাদ্রাসা, সাধারণ এবং প্রযুক্তিগত শিক্ষাকে একীভূত করে ব্যাপক ইসলামী এবং আধুনিক শিক্ষা প্রোগ্রাম।',
    url: 'https://institute.manzilgroupbd.com/admission/mic',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'MIC ভর্তি প্রক্রিয়া',
      },
    ],
    locale: 'bn_BD',
    alternateLocales: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIC ভর্তি প্রক্রিয়া - বাংলাদেশে মানজিল ইন্টারন্যাশনাল কারিকুলাম',
    description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে MIC কারিকুলামের সম্পূর্ণ ভর্তি প্রক্রিয়া। 7 বছরের জন্য মাদ্রাসা, সাধারণ এবং প্রযুক্তিগত শিক্ষাকে একীভূত করে ব্যাপক ইসলামী এবং আধুনিক শিক্ষা প্রোগ্রাম।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};
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
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { useLanguageStore } from '../../../lib/store';
import { cn } from '../../../lib/utils';
import { AnimatedGroup } from '../../../components/ui/animated-group';
import { useAdmissionData } from '../../../hooks/useData';
import ErrorBoundary from '../../../components/ErrorBoundary';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import FooterSection from '../../../components/footer';
import HeroHeader from '@/components/header';

// --- Constants (Data) ---
const mealSchedule = {
  saturday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['ছোলা', 'খেজুর'], en: ['Chola', 'Dates'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snacks' },
      items: { bn: ['ডিম', 'সিঙ্গারা'], en: ['Egg', 'Samosa'] },
      icon: Coffee,
    },
    {
      time: '1:00 PM',
      name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
      items: { bn: ['ভাত', 'ডাল', 'ভাজি'], en: ['Rice', 'Dal', 'Fry'] },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['মুড়ি', 'চা'], en: ['Muri', 'Tea'] },
      icon: Coffee,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: { bn: ['ভাত', 'মাছ', 'ডাল'], en: ['Rice', 'Fish', 'Dal'] },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Before Sleep Snacks' },
      items: { bn: ['ফল', 'মধু'], en: ['Fruits', 'Honey'] },
      icon: Apple,
    },
  ],

  sunday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['ছোলা', 'কলা'], en: ['Chola', 'Banana'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snacks' },
      items: { bn: ['ফ্রুটস', 'সালাদ'], en: ['Fruits', 'Salad'] },
      icon: Apple,
    },
    {
      time: '1:00 PM',
      name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
      items: {
        bn: ['ভাত', 'সোমালিয়া মুরগি', 'ডাল'],
        en: ['Rice', 'Somali Chicken', 'Dal'],
      },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['নুডলস'], en: ['Noodles'] },
      icon: Apple,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: {
        bn: ['ভাত', 'মুরগির সাগল', 'ডাল'],
        en: ['Rice', 'Chicken Curry', 'Dal'],
      },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Before Sleep Snacks' },
      items: { bn: ['ফল', 'মধু'], en: ['Fruits', 'Honey'] },
      icon: Apple,
    },
  ],

  monday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['কিসমিস', 'বাদাম'], en: ['Raisins', 'Nuts'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snack' },
      items: { bn: ['ডিম', 'সালাদ'], en: ['Egg', 'Salad'] },
      icon: Coffee,
    },
    {
      time: '1:00 PM',
      name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
      items: {
        bn: ['ভাত', 'মিষ্টি কুমড়া', 'সুপ'],
        en: ['Rice', 'Pumpkin', 'Soup'],
      },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['মুড়ি', 'চা'], en: ['Muri', 'Tea'] },
      icon: Coffee,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: { bn: ['ভাত', 'তরকারি', 'ডাল'], en: ['Rice', 'Curry', 'Dal'] },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Before Sleep Snacks' },
      items: { bn: ['ফল', 'মধু'], en: ['Fruits', 'Honey'] },
      icon: Apple,
    },
  ],

  tuesday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['ছোলা', 'খেজুর'], en: ['Chola', 'Dates'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snacks' },
      items: { bn: ['ফ্রুটস'], en: ['Fruits'] },
      icon: Apple,
    },
    {
      time: '1:00 PM',
      name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
      items: { bn: ['ভাত', 'ডাল', 'গাজর'], en: ['Rice', 'Dal', 'Carrot'] },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['কমলা'], en: ['Orange'] },
      icon: Apple,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: { bn: ['খিচুড়ি', 'ডিম'], en: ['Khichuri', 'Egg'] },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Night Snacks' },
      items: { bn: ['মধু'], en: ['Honey'] },
      icon: Coffee,
    },
  ],

  wednesday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['ছোলা', 'কলা'], en: ['Chola', 'Banana'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snacks' },
      items: { bn: ['ডিম', 'সালাদ'], en: ['Egg', 'Salad'] },
      icon: Coffee,
    },
    {
      time: '1:00 PM',
      name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
      items: {
        bn: ['ভাত', 'মাছের গোস্ত', 'ডাল'],
        en: ['Rice', 'Fish Curry', 'Dal'],
      },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['সালাদ'], en: ['Salad'] },
      icon: Apple,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: { bn: ['ভাত', 'তরকারি'], en: ['Rice', 'Curry'] },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Night Snacks' },
      items: { bn: ['মধু'], en: ['Honey'] },
      icon: Coffee,
    },
  ],

  thursday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['মাংস ভুনা'], en: ['Meat Fry'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snacks' },
      items: { bn: ['ডিম', 'রুটি'], en: ['Egg', 'Bread'] },
      icon: Coffee,
    },
    {
      time: '1:00 PM',
      name: { bn: 'দুপুরের খাবার', en: 'Lunch' },
      items: {
        bn: ['ভাত', 'মাংস', 'সবজি'],
        en: ['Rice', 'Meat', 'Vegetables'],
      },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['সুপ'], en: ['Soup'] },
      icon: Coffee,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: { bn: ['খিচুড়ি', 'তরকারি'], en: ['Khichuri', 'Curry'] },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Night Snacks' },
      items: { bn: ['ফল'], en: ['Fruits'] },
      icon: Apple,
    },
  ],

  friday: [
    {
      time: '7:00 AM',
      name: { bn: 'বাদ ফজর নাস্তা', en: 'Breakfast' },
      items: { bn: ['ছোলা', 'খেজুর'], en: ['Chola', 'Dates'] },
      icon: Utensils,
    },
    {
      time: '10:00 AM',
      name: { bn: 'সকালের স্ন্যাকস', en: 'Morning Snacks' },
      items: { bn: ['ফল'], en: ['Fruits'] },
      icon: Apple,
    },
    {
      time: '1:00 PM',
      name: { bn: 'জুমার লাঞ্চ', en: 'Jummah Lunch' },
      items: { bn: ['ভাত', 'মাংস', 'সালাদ'], en: ['Rice', 'Meat', 'Salad'] },
      icon: Utensils,
    },
    {
      time: '4:00 PM',
      name: { bn: 'বিকেলের নাস্তা', en: 'Evening Snacks' },
      items: { bn: ['মুড়ি', 'চা'], en: ['Muri', 'Tea'] },
      icon: Coffee,
    },
    {
      time: '8:00 PM',
      name: { bn: 'রাতের খাবার', en: 'Dinner' },
      items: { bn: ['খিচুড়ি'], en: ['Khichuri'] },
      icon: Utensils,
    },
    {
      time: '10:00 PM',
      name: { bn: 'ঘুমের পূর্বে নাস্তা', en: 'Night Snacks' },
      items: { bn: ['ফল'], en: ['Fruits'] },
      icon: Apple,
    },
  ],
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

const dayNames = {
  saturday: { bn: 'শনিবার', en: 'Saturday' },
  sunday: { bn: 'রবিবার', en: 'Sunday' },
  monday: { bn: 'সোমবার', en: 'Monday' },
  tuesday: { bn: 'মঙ্গলবার', en: 'Tuesday' },
  wednesday: { bn: 'বুধবার', en: 'Wednesday' },
  thursday: { bn: 'বৃহস্পতিবার', en: 'Thursday' },
  friday: { bn: 'শুক্রবার', en: 'Friday' },
};

const periodNames = {
  morning: { bn: 'সকাল', en: 'Morning' },
  afternoon: { bn: 'দুপুর', en: 'Afternoon' },
  evening: { bn: 'সন্ধ্যা', en: 'Evening' },
  night: { bn: 'রাত', en: 'Night' },
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
        bn: 'কোনো সমস্যা হলে এম.আই.সি কর্তৃপক্ষকে অবহিত করবেন।',
        en: 'In case of any problem, inform the MIC authorities.',
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
        bn: 'কোন সমস্যা দেখলে সরাসরি এম.আই.সি কর্তৃপক্ষকে অবহিত করবেন।',
        en: 'If they see any problem, they will directly inform the MIC authorities.',
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
// --- Utility Functions ---
const bengaliNumerals = {
  0: '০',
  1: '১',
  2: '২',
  3: '৩',
  4: '৪',
  5: '৫',
  6: '৬',
  7: '৭',
  8: '৮',
  9: '৯',
  ',': ',',
};

const toBengaliNumerals = str => {
  return str
    .split('')
    .map(char => bengaliNumerals[char] || char)
    .join('');
};

// --- Main Component ---
export default function MICAdmissionPage() {
  const [activeTab, setActiveTab] = useState('process');
  const [selectedDay, setSelectedDay] = useState('saturday');
  const { language } = useLanguageStore();
  const {
    data: admissionData,
    isLoading,
    error,
    refetch,
  } = useAdmissionData(language);

  // Fallback Data Logic
  const fallbackData = {
    overview: {
      title: 'MIC Admission Overview',
      description:
        'Comprehensive admission information for Manzil International Curriculum (MIC)',
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    {
      id: 'requirements',
      label: language === 'bn' ? 'যোগ্যতা' : 'Requirements',
      icon: CheckCircle,
    },
    {
      id: 'fees',
      label: language === 'bn' ? 'ফি কাঠামো' : 'Fee Structure',
      icon: Calculator,
    },
    {
      id: 'process',
      label: language === 'bn' ? 'ভর্তি প্রক্রিয়া' : 'Admission Process',
      icon: BookOpen,
    },
    {
      id: 'dates',
      label: language === 'bn' ? 'তারিখ' : 'Important Dates',
      icon: Calendar,
    },
    {
      id: 'khabarer',
      label: language === 'bn' ? 'খাবার' : 'Meal Plan',
      icon: Utensils,
    },
    {
      id: '24hour',
      label: language === 'bn' ? 'রুটিন' : 'Daily Routine',
      icon: Clock,
    },
    {
      id: 'rules',
      label: language === 'bn' ? 'কানুন' : 'Rules',
      icon: AlertCircle,
    },
    {
      id: 'contact',
      label: language === 'bn' ? 'যোগাযোগ' : 'Contact',
      icon: Phone,
    },
  ];

  if (isLoading)
    return (
      <ErrorBoundary>
        <LoadingSkeleton />
      </ErrorBoundary>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#00AEEF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <Button onClick={() => refetch()} className="bg-[#00AEEF]">
            Try Again
          </Button>
        </div>
      </div>
    );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
        <HeroHeader />

        {/* --- Hero Section with Pattern --- */}
        <section className="relative pt-32 pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AEEF]/10 text-[#00AEEF] text-sm font-medium mb-6 border border-[#00AEEF]/20">
                <Star className="w-4 h-4 fill-current" />
                {language === 'bn' ? 'ভর্তি চলছে ২০২৫' : 'Admission Open 2025'}
              </div>
              <h1
                className={cn(
                  'text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight',
                  language === 'bn' && 'kalpurush-font'
                )}
              >
                {language === 'bn' ? 'MIC' : 'MIC'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-purple-600">
                  {language === 'bn' ? 'ভর্তি প্রক্রিয়া' : 'Admission Process'}
                </span>
              </h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative max-w-2xl mx-auto mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF]/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-2xl">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-[#00AEEF] animate-pulse" />
                    <div className="h-px bg-gradient-to-r from-transparent via-[#00AEEF] to-transparent flex-1"></div>
                    <Star className="w-5 h-5 text-purple-500 animate-bounce" />
                  </div>
                  <p
                    className={cn(
                      'text-xl md:text-2xl font-medium text-center leading-relaxed',
                      language === 'bn' && 'kalpurush-font'
                    )}
                  >
                    {language === 'bn' ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.8,
                          type: 'spring',
                        }}
                        className="bg-gradient-to-r from-[#00AEEF] via-purple-600 to-pink-500 bg-clip-text text-transparent font-bold"
                      >
                        মানযিল ইন্টারন্যাশনাল কারিকুলাম - যেখানে আধুনিক শিক্ষার
                        সাথে সমন্বয় ঘটেছে ইসলামী মূল্যবোধের।
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.8,
                          type: 'spring',
                        }}
                        className="bg-gradient-to-r from-[#00AEEF] via-purple-600 to-pink-500 bg-clip-text text-transparent font-bold"
                      >
                        Manzil International Curriculum - Where modern education
                        meets Islamic values.
                      </motion.span>
                    )}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
                    <Languages className="w-5 h-5 text-pink-500 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- Sticky Tabs Navigation --- */}
        <div className="sticky top-20 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-2 py-4 justify-center">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-300 flex-shrink-0',
                      isActive
                        ? 'text-white ring-2 ring-[#00AEEF]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-[#00AEEF] dark:hover:text-[#00AEEF] ring-1 ring-gray-200 dark:ring-gray-700',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#00AEEF] rounded-full shadow-lg shadow-[#00AEEF]/30"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-3 h-3" />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatedGroup className="max-w-7xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* === Process Section (Timeline) === */}
              {activeTab === 'process' && (
                <div className="grid gap-8">
                  <SectionHeader
                    title={
                      language === 'bn'
                        ? 'ভর্তি কার্যক্রমের ধাপসমূহ'
                        : 'Admission Steps'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'সহজ ৫টি ধাপে আপনার ভর্তি নিশ্চিত করুন'
                        : 'Confirm your admission in 5 simple steps'
                    }
                  />

                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00AEEF] via-purple-500 to-pink-500 opacity-60 md:left-1/2 md:-ml-0.5" />

                    <motion.div
                      className="space-y-16 md:space-y-12"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.15,
                          },
                        },
                      }}
                    >
                      {safeData.process.map((step, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <motion.div
                            key={idx}
                            className={cn(
                              'relative flex items-start md:items-center',
                              isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                            )}
                            variants={{
                              hidden: { opacity: 0, y: 30, scale: 0.95 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                  type: 'spring',
                                  stiffness: 100,
                                  damping: 15,
                                  duration: 0.6,
                                },
                              },
                            }}
                          >
                            {/* Icon Bubble */}
                            <motion.div
                              className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-20 h-20 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#00AEEF] to-blue-600 border-4 border-white dark:border-gray-900 shadow-2xl z-10"
                              whileHover={{
                                scale: 1.1,
                                rotate: 5,
                                transition: {
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 10,
                                },
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.span
                                className="text-2xl md:text-xl font-bold text-white"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: idx * 0.1 + 0.3,
                                  type: 'spring',
                                  stiffness: 500,
                                }}
                              >
                                {step.step}
                              </motion.span>
                            </motion.div>

                            {/* Content Card */}
                            <motion.div
                              className={cn(
                                'ml-24 md:ml-0 md:w-1/2 px-6 md:px-4',
                                isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'
                              )}
                              whileHover={{
                                y: -5,
                                transition: {
                                  type: 'spring',
                                  stiffness: 300,
                                  damping: 20,
                                },
                              }}
                            >
                              <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 md:p-6 rounded-3xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:border-[#00AEEF]/40 transition-all duration-500">
                                <motion.h3
                                  className={cn(
                                    'text-2xl md:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#00AEEF] transition-colors',
                                    language === 'bn' && 'bengali-text'
                                  )}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 + 0.5 }}
                                >
                                  {step.title}
                                </motion.h3>
                                <motion.div
                                  className={cn(
                                    'inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#00AEEF] mb-4 bg-[#00AEEF]/10 px-3 py-1.5 rounded-full border border-[#00AEEF]/20',
                                    isEven && 'md:ml-auto'
                                  )}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1 + 0.7 }}
                                >
                                  <Clock className="w-4 h-4" /> {step.duration}
                                </motion.div>
                                <motion.p
                                  className={cn(
                                    'text-gray-600 dark:text-gray-400 text-base md:text-sm mb-6 leading-relaxed',
                                    language === 'bn' && 'bengali-text'
                                  )}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: idx * 0.1 + 0.9 }}
                                >
                                  {step.description}
                                </motion.p>
                                <motion.div
                                  className={cn(
                                    'space-y-3',
                                    isEven && 'md:flex md:flex-col md:items-end'
                                  )}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 + 1.1 }}
                                >
                                  {step.requirements.map((req, rIdx) => (
                                    <motion.div
                                      key={rIdx}
                                      className="flex items-center gap-3 text-base md:text-sm text-gray-500 dark:text-gray-400"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        delay: idx * 0.1 + 1.1 + rIdx * 0.1,
                                      }}
                                    >
                                      <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{
                                          type: 'spring',
                                          stiffness: 400,
                                        }}
                                      >
                                        <CheckCircle className="w-5 h-5 md:w-4 md:h-4 text-green-500 shrink-0" />
                                      </motion.div>
                                      <span
                                        className={
                                          language === 'bn'
                                            ? 'bengali-text'
                                            : ''
                                        }
                                      >
                                        {req}
                                      </span>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>
              )}

              {/* === Requirements Section (Bento Grid) === */}
              {activeTab === 'requirements' && (
                <div>
                  <SectionHeader
                    title={
                      language === 'bn'
                        ? 'ভর্তির যোগ্যতা ও শর্তাবলী'
                        : 'Eligibility & Requirements'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'প্রতিটি লেভেলের জন্য নির্দিষ্ট মানদণ্ড'
                        : 'Specific criteria for each level'
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Helper to create cards */}
                    {[
                      {
                        data: safeData.requirements.level1,
                        title: 'Level 1',
                        color: 'blue',
                        bnTitle: 'লেভেল ১',
                      },
                      {
                        data: safeData.requirements.level2,
                        title: 'Level 2',
                        color: 'green',
                        bnTitle: 'লেভেল ২',
                      },
                      {
                        data: safeData.requirements.level3,
                        title: 'Level 3',
                        color: 'purple',
                        bnTitle: 'লেভেল ৩',
                      },
                      {
                        data: safeData.requirements.huffaz,
                        title: 'Huffaz',
                        color: 'orange',
                        bnTitle: 'হুফ্ফাজ',
                      },
                    ].map((level, idx) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden rounded-3xl p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 group`}
                      >
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 bg-${level.color}-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}
                        />

                        <div className="relative z-10">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-${level.color}-100 dark:bg-${level.color}-900/30 flex items-center justify-center mb-6`}
                          >
                            <BookOpen
                              className={`w-6 h-6 text-${level.color}-600 dark:text-${level.color}-400`}
                            />
                          </div>

                          <h3
                            className={cn(
                              'text-2xl font-bold text-gray-900 dark:text-white mb-4',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {language === 'bn'
                              ? level.bnTitle
                              : `MIC ${level.title}`}
                          </h3>

                          <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                                {language === 'bn' ? 'বয়স' : 'Age Limit'}
                              </span>
                              <p
                                className={cn(
                                  'font-medium text-gray-900 dark:text-white',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {level.data.age}
                              </p>
                            </div>

                            <div>
                              <h4
                                className={cn(
                                  'font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                <CheckCircle className="w-4 h-4 text-[#00AEEF]" />{' '}
                                {language === 'bn'
                                  ? 'যোগ্যতা'
                                  : 'Qualification'}
                              </h4>
                              <ul className="space-y-2">
                                {level.data.academic.map((item, i) => (
                                  <li
                                    key={i}
                                    className={cn(
                                      'text-sm text-gray-600 dark:text-gray-400 pl-6 relative before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4
                                className={cn(
                                  'font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                <Download className="w-4 h-4 text-[#00AEEF]" />{' '}
                                {language === 'bn' ? 'ডকুমেন্টস' : 'Documents'}
                              </h4>
                              <ul className="space-y-2">
                                {level.data.documents.map((item, i) => (
                                  <li
                                    key={i}
                                    className={cn(
                                      'text-sm text-gray-600 dark:text-gray-400 pl-6 relative before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300',
                                      language === 'bn' && 'bengali-text'
                                    )}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === Fees Section (Clean Tables) === */}
              {activeTab === 'fees' && (
                <div className="space-y-12">
                  <SectionHeader
                    title={
                      language === 'bn' ? 'ফি এবং পেমেন্ট' : 'Fees & Payments'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'স্বচ্ছ এবং সাশ্রয়ী ফি কাঠামো'
                        : 'Transparent and affordable fee structure'
                    }
                  />

                  {/* One Time Fees */}
                  <div className="bg-gradient-to-br from-[#00AEEF] to-blue-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <h3
                      className={cn(
                        'text-2xl font-bold mb-6 relative z-10',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'এককালীন ভর্তি ফি'
                        : 'One-time Admission Fees'}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                      {[
                        {
                          name: { bn: 'ভর্তি ফরম', en: 'Admission Form' },
                          price: '500',
                          icon: Book,
                        },
                        {
                          name: { bn: 'নতুন ভর্তি', en: 'New Admission' },
                          price: '30,000',
                          icon: CheckCircle,
                        },
                        {
                          name: { bn: 'সেশন ফি', en: 'Session Fee' },
                          price: '25,000',
                          icon: Calendar,
                        },
                        {
                          name: { bn: 'ইনস্টলেইশন ফি', en: 'Installation Fee' },
                          price: '10,000',
                          icon: Wrench,
                        },
                        {
                          name: { bn: 'আবাসন ফি', en: 'Accommodation' },
                          price: '10,000',
                          icon: Bed,
                        },
                        {
                          name: {
                            bn: 'স্টেশনারী ও অন্যান্য',
                            en: 'Stationary & Others',
                          },
                          price: '10,000',
                          icon: Calculator,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <item.icon className="w-5 h-5 text-blue-200" />
                            <span className="text-xl font-bold">
                              {language === 'bn'
                                ? `${toBengaliNumerals(item.price)}/=`
                                : `BDT ${item.price}`}
                            </span>
                          </div>
                          <p
                            className={cn(
                              'text-blue-100 text-sm',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {item.name[language === 'bn' ? 'bn' : 'en']}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Fees Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Tuition */}
                    <FeeCard
                      title={
                        language === 'bn' ? 'মাসিক টিউশন' : 'Monthly Tuition'
                      }
                      icon={BookOpen}
                      color="green"
                      items={[
                        {
                          label: { bn: 'দারস-ই-নিজামী', en: 'Dars-e-Nizami' },
                          price: '2000',
                        },
                        {
                          label: {
                            bn: 'জাতীয় পাঠ্যক্রম',
                            en: 'National Curriculum',
                          },
                          price: '2000',
                        },
                        {
                          label: {
                            bn: 'কেমব্রিজ আন্তর্জাতিক',
                            en: 'Cambridge Intl.',
                          },
                          price: '3000',
                        },
                        {
                          label: { bn: 'বৃত্তিমূলক', en: 'Vocational' },
                          price: '2000',
                        },
                      ]}
                      lang={language}
                    />
                    {/* Residential */}
                    <FeeCard
                      title={language === 'bn' ? 'আবাসিক' : 'Residential'}
                      icon={Bed}
                      color="purple"
                      items={[
                        {
                          label: { bn: 'ফ্লোর ভাড়া', en: 'Floor Rent' },
                          price: '3500',
                        },
                        {
                          label: { bn: 'ইউটিলিটিস', en: 'Utilities' },
                          price: '1500',
                        },
                      ]}
                      lang={language}
                    />
                    {/* Food */}
                    <FeeCard
                      title={language === 'bn' ? 'খাবার' : 'Food'}
                      icon={Utensils}
                      color="orange"
                      items={[
                        {
                          label: { bn: 'স্তর ১', en: 'Level 1' },
                          price: '9000',
                        },
                        {
                          label: { bn: 'স্তর ২', en: 'Level 2' },
                          price: '12000',
                        },
                        {
                          label: { bn: 'স্তর ৩', en: 'Level 3' },
                          price: '15000',
                        },
                        {
                          label: { bn: 'হুফ্ফাজ', en: 'Huffaz' },
                          price: '15000',
                        },
                      ]}
                      lang={language}
                    />
                  </div>
                </div>
              )}

              {/* === Important Dates === */}
              {activeTab === 'dates' && (
                <div className="max-w-3xl mx-auto">
                  <SectionHeader
                    title={
                      language === 'bn' ? 'গুরুত্বপূর্ণ তারিখসমূহ' : 'Key Dates'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'ভর্তি ক্যালেন্ডার ২০২৬'
                        : 'Admission Calendar 2026'
                    }
                  />

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00AEEF] via-purple-500 to-pink-500 opacity-50"></div>
                    <div className="space-y-6">
                      {safeData.importantDates.map((date, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15, duration: 0.5 }}
                          className="relative flex items-start gap-6 group"
                        >
                          {/* Timeline dot */}
                          <div className="absolute left-6 flex items-center justify-center w-4 h-4 bg-[#00AEEF] rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10 group-hover:scale-125 transition-transform"></div>
                          {/* Date card */}
                          <div className="w-20 h-20 bg-gradient-to-br from-[#00AEEF] to-purple-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                            <Calendar className="w-5 h-5 mb-1" />
                            <span className="text-xs font-bold uppercase">
                              {date.date.split(' ')[0]}
                            </span>
                            <span className="text-lg font-bold">
                              {date.date.split(' ')[1].replace(',', '')}
                            </span>
                          </div>
                          {/* Content card */}
                          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-[#00AEEF]/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                              <h4
                                className={cn(
                                  'text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#00AEEF] transition-colors',
                                  language === 'bn' && 'bengali-text'
                                )}
                              >
                                {date.event}
                              </h4>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${date.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}
                              >
                                {date.status === 'open' ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                {date.status}
                              </div>
                            </div>
                            <p
                              className={cn(
                                'text-sm text-gray-500 dark:text-gray-400',
                                language === 'bn' && 'bengali-text'
                              )}
                            >
                              {date.status === 'open'
                                ? language === 'bn'
                                  ? 'আবেদন চলছে'
                                  : 'Application Open'
                                : language === 'bn'
                                  ? 'আসন্ন'
                                  : 'Upcoming'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* === Meal Plan (Interactive) === */}
              {activeTab === 'khabarer' && (
                <div className="space-y-8">
                  <SectionHeader
                    title={
                      language === 'bn'
                        ? 'পুষ্টিকর খাদ্য তালিকা'
                        : 'Nutritious Meal Plan'
                    }
                    subtitle={
                      language === 'bn'
                        ? 'সপ্তাহের ৭ দিনের বিস্তারিত মেনু'
                        : 'Detailed menu for 7 days of the week'
                    }
                  />

                  {/* Day Selector */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {Object.keys(mealSchedule).map(day => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                          selectedDay === day
                            ? 'bg-[#00AEEF] text-white shadow-lg shadow-blue-500/30 scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {dayNames[day][language === 'bn' ? 'bn' : 'en']}
                      </button>
                    ))}
                  </div>

                  {/* Meal Cards Grid */}
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                  >
                    {mealSchedule[selectedDay].map((meal, idx) => {
                      const Icon = meal.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#00AEEF]/50 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 text-[#00AEEF]">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h5
                            className={cn(
                              'font-bold text-gray-900 dark:text-white text-sm mb-1',
                              language === 'bn' && 'bengali-text'
                            )}
                          >
                            {meal.name[language === 'bn' ? 'bn' : 'en']}
                          </h5>
                          <p className="text-xs text-gray-500 font-medium mb-3">
                            {meal.time}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {meal.items[language === 'bn' ? 'bn' : 'en'].map(
                              (item, i) => (
                                <span
                                  key={i}
                                  className={cn(
                                    'text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300',
                                    language === 'bn' && 'bengali-text'
                                  )}
                                >
                                  {item}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
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
                        ? 'MIC-এর নিয়ম কানুন এবং শৃঙ্খলা'
                        : 'MIC Rules, Regulations and Discipline'
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

              {/* === Contact Section === */}
              {activeTab === 'contact' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-8">
                    <div>
                      <h2
                        className={cn(
                          'text-3xl font-bold text-gray-900 dark:text-white mb-4',
                          language === 'bn' && 'bengali-text'
                        )}
                      >
                        {language === 'bn'
                          ? 'আমাদের সাথে যোগাযোগ করুন'
                          : 'Get in Touch'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === 'bn'
                          ? 'ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের কল করুন অথবা সরাসরি ভিজিট করুন।'
                          : 'Call us or visit directly for any admission related information.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <ContactItem
                        icon={Phone}
                        title={language === 'bn' ? 'হটলাইন' : 'Hotline'}
                        content={safeData.contact.phone.join(', ')}
                      />
                      <ContactItem
                        icon={Mail}
                        title={language === 'bn' ? 'ইমেইল' : 'Email'}
                        content={safeData.contact.email}
                      />
                      <ContactItem
                        icon={MapPin}
                        title={language === 'bn' ? 'লোকেশন' : 'Location'}
                        content={safeData.contact.address}
                      />
                      <ContactItem
                        icon={Clock}
                        title={language === 'bn' ? 'অফিস সময়' : 'Office Hours'}
                        content={safeData.contact.officeHours}
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl text-center">
                    <div className="w-20 h-20 bg-[#00AEEF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Download className="w-8 h-8 text-[#00AEEF]" />
                    </div>
                    <h3
                      className={cn(
                        'text-2xl font-bold mb-4',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {language === 'bn'
                        ? 'অনলাইনে আবেদন করুন'
                        : 'Apply Online Now'}
                    </h3>
                    <p className="text-gray-500 mb-8 text-sm">
                      {language === 'bn'
                        ? 'আপনার সন্তানের উজ্জ্বল ভবিষ্যতের জন্য আজই আবেদন করুন।'
                        : "Apply today for your child's bright future."}
                    </p>
                    <Button
                      className="w-full h-12 text-lg bg-[#00AEEF] hover:bg-blue-600 rounded-xl"
                      onClick={() => (window.location.href = '/apply')}
                    >
                      {language === 'bn'
                        ? 'আবেদন শুরু করুন'
                        : 'Start Application'}{' '}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedGroup>

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

const FeeCard = ({ title, items, color, icon: Icon, lang }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
    <div
      className={`w-12 h-12 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center mb-4`}
    >
      <Icon className={`w-6 h-6 text-${color}-500`} />
    </div>
    <h4
      className={cn(
        'text-xl font-bold text-gray-900 dark:text-white mb-6',
        lang === 'bn' && 'bengali-text'
      )}
    >
      {title}
    </h4>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0 last:pb-0"
        >
          <span
            className={cn(
              'text-sm text-gray-600 dark:text-gray-400',
              lang === 'bn' && 'bengali-text'
            )}
          >
            {typeof item.label === 'object'
              ? item.label[lang === 'bn' ? 'bn' : 'en']
              : item.label}
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {lang === 'bn'
              ? `${toBengaliNumerals(item.price)}/=`
              : `BDT ${item.price}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ContactItem = ({ icon: Icon, title, content }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
    <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm shrink-0">
      <Icon className="w-5 h-5 text-[#00AEEF]" />
    </div>
    <div>
      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{content}</p>
    </div>
  </div>
);
