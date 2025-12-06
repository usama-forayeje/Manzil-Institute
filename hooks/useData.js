import { useQuery } from '@tanstack/react-query';

// Mock admission data - replace with actual API calls
const admissionData = {
  en: {
    overview: {
      title: 'Admission Overview',
      description:
        'Comprehensive admission information for Manzil International Institute',
    },
    process: [
      {
        step: '1',
        title: 'Online Application',
        description: 'Submit your application through our online portal',
        duration: '1-2 days',
        color: 'blue',
        requirements: [
          'Valid email address',
          'Parent/Guardian contact information',
          'Basic student details',
        ],
      },
      {
        step: '2',
        title: 'Admission Test',
        description: "Assessment test to evaluate student's academic level",
        duration: '2-3 hours',
        color: 'green',
        requirements: [
          'Age-appropriate assessment',
          'Islamic knowledge evaluation',
          'Academic skills test',
        ],
      },
      {
        step: '3',
        title: 'Nomination & Selection',
        description: 'Review and selection based on test results',
        duration: '3-5 days',
        color: 'purple',
        requirements: [
          'Test result evaluation',
          'Interview (if required)',
          'Final selection decision',
        ],
      },
      {
        step: '4',
        title: 'Document Submission',
        description: 'Submit all required documents for verification',
        duration: '1 week',
        color: 'orange',
        requirements: [
          'Birth certificate',
          'Academic certificates',
          'Medical certificates',
        ],
      },
      {
        step: '5',
        title: 'Fee Payment & Enrollment',
        description: 'Complete payment and finalize enrollment',
        duration: '1-2 days',
        color: 'red',
        requirements: [
          'Fee payment completion',
          'Enrollment form signing',
          'Welcome kit distribution',
        ],
      },
    ],
    requirements: {
      level1: {
        age: 'Below 6 years',
        academic: [
          'Basic alphabet recognition',
          'Simple counting skills',
          'Basic Islamic phrases',
        ],
        documents: [
          'Birth certificate',
          '2 passport size photos',
          'Parent ID copy',
        ],
      },
      level2: {
        age: 'Below 9 years',
        academic: [
          'Basic reading and writing',
          'Simple arithmetic',
          'Basic Islamic knowledge',
        ],
        documents: [
          'Birth certificate',
          'Previous school certificates',
          '2 passport size photos',
          'Medical certificate',
        ],
      },
      level3: {
        age: 'Below 12 years',
        academic: [
          'Reading and writing proficiency',
          'Basic mathematics',
          'Islamic studies foundation',
        ],
        documents: [
          'Birth certificate',
          'Previous school certificates',
          '2 passport size photos',
          'Medical certificate',
          'House registration',
        ],
      },
      huffaz: {
        age: 'Below 12 years',
        academic: [
          'Complete Quran memorization (Hafiz)',
          'Basic Islamic education',
          'Arabic language proficiency',
        ],
        documents: [
          'Birth certificate',
          'Hafiz certificate',
          'Previous school certificates',
          '2 passport size photos',
          'Medical certificate',
        ],
      },
    },
    feeStructure: {
      oneTime: [
        { name: 'Admission Fee', amount: 'BDT 30,000' },
        { name: 'Session Fee', amount: 'BDT 25,000' },
      ],
      monthly: {
        tuition: [
          { name: 'Level 1-2', amount: 'BDT 2,000' },
          { name: 'Level 3', amount: 'BDT 2,500' },
          { name: 'Huffaz', amount: 'BDT 3,000' },
        ],
        residential: [
          { name: 'Standard Room', amount: 'BDT 3,500' },
          { name: 'Premium Room', amount: 'BDT 5,000' },
          { name: 'VIP Room', amount: 'BDT 15,000' },
        ],
        food: [
          { name: 'Basic Package', amount: 'BDT 9,000' },
          { name: 'Standard Package', amount: 'BDT 12,000' },
          { name: 'Premium Package', amount: 'BDT 15,000' },
        ],
      },
    },
    importantDates: [
      {
        event: 'Application Opens',
        date: 'January 1, 2025',
        status: 'open',
      },
      {
        event: 'Admission Test',
        date: 'January 15, 2025',
        status: 'upcoming',
      },
      {
        event: 'Result Declaration',
        date: 'January 20, 2025',
        status: 'upcoming',
      },
      {
        event: 'Classes Begin',
        date: 'February 1, 2025',
        status: 'upcoming',
      },
    ],
    contact: {
      phone: ['+8801407046001', '+8801407046002', '+8801407046003'],
      email: 'info@manzilinstitute.edu.bd',
      address:
        'Harunur Rashid Tower (10 Storied Building), House #91, Road #2, North Rayarbagh Bus Stand, Jatrabari, Dhaka-1362',
      officeHours: 'Saturday - Thursday: 9:00 AM - 5:00 PM',
    },
  },
  bn: {
    overview: {
      title: 'ভর্তি ওভারভিউ',
      description:
        'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটের জন্য বিস্তারিত ভর্তি তথ্য',
    },
    process: [
      {
        step: '১',
        title: 'অনলাইন আবেদন',
        description: 'আমাদের অনলাইন পোর্টালের মাধ্যমে আপনার আবেদন জমা দিন',
        duration: '১-২ দিন',
        color: 'blue',
        requirements: [
          'বৈধ ইমেইল ঠিকানা',
          'অভিভাবক/অভিভাবকের যোগাযোগের তথ্য',
          'মৌলিক ছাত্র তথ্য',
        ],
      },
      {
        step: '২',
        title: 'ভর্তি পরীক্ষা',
        description: 'ছাত্রের একাডেমিক স্তর মূল্যায়নের জন্য পরীক্ষা',
        duration: '২-৩ ঘণ্টা',
        color: 'green',
        requirements: [
          'বয়স অনুযায়ী মূল্যায়ন',
          'ইসলামিক জ্ঞান মূল্যায়ন',
          'একাডেমিক দক্ষতা পরীক্ষা',
        ],
      },
      {
        step: '৩',
        title: 'মনোনয়ন এবং নির্বাচন',
        description: 'পরীক্ষার ফলাফলের ভিত্তিতে পর্যালোচনা এবং নির্বাচন',
        duration: '৩-৫ দিন',
        color: 'purple',
        requirements: [
          'পরীক্ষার ফলাফল মূল্যায়ন',
          'ইন্টারভিউ (প্রয়োজনে)',
          'চূড়ান্ত নির্বাচন সিদ্ধান্ত',
        ],
      },
      {
        step: '৪',
        title: 'ডকুমেন্ট জমা',
        description: 'যাচাইয়ের জন্য সমস্ত প্রয়োজনীয় ডকুমেন্ট জমা দিন',
        duration: '১ সপ্তাহ',
        color: 'orange',
        requirements: ['জন্ম সনদ', 'একাডেমিক সনদপত্র', 'চিকিৎসা সনদপত্র'],
      },
      {
        step: '৫',
        title: 'ফি প্রদান এবং ভর্তি',
        description: 'পেমেন্ট সম্পূর্ণ করে ভর্তি চূড়ান্ত করুন',
        duration: '১-২ দিন',
        color: 'red',
        requirements: [
          'ফি প্রদান সম্পূর্ণ',
          'ভর্তি ফর্ম স্বাক্ষর',
          'স্বাগত কিট বিতরণ',
        ],
      },
    ],
    requirements: {
      level1: {
        age: '৬ বছরের নিচে',
        academic: [
          'মৌলিক বর্ণ চিনতে পারা',
          'সহজ গণনা দক্ষতা',
          'মৌলিক ইসলামিক বাক্যাংশ',
        ],
        documents: [
          'জন্ম সনদ',
          '২ কপি পাসপোর্ট সাইজ ছবি',
          'অভিভাবকের আইডি কপি',
        ],
      },
      level2: {
        age: '৯ বছরের নিচে',
        academic: ['মৌলিক পড়া এবং লেখা', 'সহজ গণিত', 'মৌলিক ইসলামিক জ্ঞান'],
        documents: [
          'জন্ম সনদ',
          'পূর্ববর্তী স্কুলের সনদপত্র',
          '২ কপি পাসপোর্ট সাইজ ছবি',
          'চিকিৎসা সনদপত্র',
        ],
      },
      level3: {
        age: '১২ বছরের নিচে',
        academic: [
          'পড়া এবং লেখা দক্ষতা',
          'মৌলিক গণিত',
          'ইসলামিক স্টাডিজের ভিত্তি',
        ],
        documents: [
          'জন্ম সনদ',
          'পূর্ববর্তী স্কুলের সনদপত্র',
          '২ কপি পাসপোর্ট সাইজ ছবি',
          'চিকিৎসা সনদপত্র',
          'বাড়ির রেজিস্ট্রেশন',
        ],
      },
      huffaz: {
        age: '১২ বছরের নিচে',
        academic: [
          'সম্পূর্ণ কুরআন মুখস্থ (হাফিজ)',
          'মৌলিক ইসলামিক শিক্ষা',
          'আরবি ভাষা দক্ষতা',
        ],
        documents: [
          'জন্ম সনদ',
          'হাফিজ সনদপত্র',
          'পূর্ববর্তী স্কুলের সনদপত্র',
          '২ কপি পাসপোর্ট সাইজ ছবি',
          'চিকিৎসা সনদপত্র',
        ],
      },
    },
    feeStructure: {
      oneTime: [
        { name: 'ভর্তি ফি', amount: '৳৩০,০০০' },
        { name: 'সেশন ফি', amount: '৳২৫,০০০' },
      ],
      monthly: {
        tuition: [
          { name: 'লেভেল ১-২', amount: '৳২,০০০' },
          { name: 'লেভেল ৩', amount: '৳২,৫০০' },
          { name: 'হুফ্ফাজ', amount: '৳৩,০০০' },
        ],
        residential: [
          { name: 'স্ট্যান্ডার্ড রুম', amount: '৳৩,৫০০' },
          { name: 'প্রিমিয়াম রুম', amount: '৳৫,০০০' },
          { name: 'ভিআইপি রুম', amount: '৳১৫,০০০' },
        ],
        food: [
          { name: 'বেসিক প্যাকেজ', amount: '৳৯,০০০' },
          { name: 'স্ট্যান্ডার্ড প্যাকেজ', amount: '৳১২,০০০' },
          { name: 'প্রিমিয়াম প্যাকেজ', amount: '৳১৫,০০০' },
        ],
      },
    },
    importantDates: [
      {
        event: 'আবেদন শুরু',
        date: 'জানুয়ারি ১, ২০২৫',
        status: 'open',
      },
      {
        event: 'ভর্তি পরীক্ষা',
        date: 'জানুয়ারি ১৫, ২০২৫',
        status: 'upcoming',
      },
      {
        event: 'ফলাফল ঘোষণা',
        date: 'জানুয়ারি ২০, ২০২৫',
        status: 'upcoming',
      },
      {
        event: 'ক্লাস শুরু',
        date: 'ফেব্রুয়ারি ১, ২০২৫',
        status: 'upcoming',
      },
    ],
    contact: {
      phone: ['+8801407046001', '+8801407046002', '+8801407046003'],
      email: 'info@manzilinstitute.edu.bd',
      address:
        'হারুনুর রশিদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা-১৩৬২',
      officeHours: 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০',
    },
  },
};

// Function to get data based on language
const getMockAdmissionData = (language = 'en') => {
  return admissionData[language] || admissionData.en;
};

// Simulate API delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function useAdmissionData(language = 'en') {
  return useQuery({
    queryKey: ['admission-data', language],
    queryFn: async () => {
      await delay(100); // Reduced delay for faster loading
      return getMockAdmissionData(language);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: getMockAdmissionData(language), // Provide initial data immediately
  });
}

// MIC Curriculum Data - 100% Corrected according to screenshot
const micCurriculumData = {
  en: {
    overview: {
      totalLevels: 6,
      levelsLabel: 'Levels',
      totalYears: 22,
      yearsLabel: 'Years',
      ageRange: '4-25',
      ageRangeLabel: 'Years',
      streamsLabel: 'Streams',
    },
    title: 'Manzil International Curriculum - The Manual of Manzil',
    subtitle: 'MIC - An Integrated Education System',
    levels: [
      {
        level: 'Level 1',
        title: 'Foundation Stage',
        age: '04-08 Years',
        duration: '5 Years',
        color: 'blue',
        icon: 'Star',
        darseNizami: 'Nurami, Nazara',
        generalEducation: ['Ibtidaiyyah / Junior / PSC'],
        internationalEducation: ['Grade 1 to Grade 5 / Primary Level'],
        technicalActivities: [
          'Extracurricular: Nice Handwriting, Drawing, Arts, Origami',
          'Real-life: Cooking, Sewing, Block, Batik',
          'Computer: Computer History Wust. Why, How?',
        ],
        languageSports: [
          'Language: Bengali',
          'Sports: Swimming, Marathon, Cycling Staking',
        ],
        economyTarbiyah: [
          'Faith in Allah & Pray for Parents',
          'All Tarafis discussed one by one in Every week indoor',
        ],
        foodSurvival: [
          'Food: All Foods will be collected from Organic and natural sources.',
          'Survival: Survive Fire, Water, floods, and Earthquakes Accident',
        ],
      },
      {
        level: 'Level 2',
        title: 'Intermediate Stage',
        age: '09-13 Years',
        duration: '5 Years',
        color: 'green',
        icon: 'BookText',
        darseNizami: 'Hifzul Quran',
        generalEducation: ['Motawasatiah / Middle / SSC'],
        internationalEducation: ['Grade 6 to Grade 10 / (Ordinary) O Level'],
        technicalActivities: [
          'Extracurricular: Craft and Calligraphy',
          'Real-life: Gardening, Hydroponic, Agriculture, Green House Farming',
          'Computer: MS Office, Ps., AI',
        ],
        languageSports: ['Language: English', 'Sports: Archery'],
        economyTarbiyah: [
          'Memorizing the economic verses and habits',
          'All Tarafis discussed one by one in Every week indoor',
        ],
        foodSurvival: [
          'Food: Sources, Mustard oil, 20% Fiber, 70% Vegetable & Fruits, 10% Fish, chicken, Sweeteners',
          'Survival: Survive Launch & Speed Board accident',
        ],
      },
      {
        level: 'Level 3',
        title: 'Secondary Stage',
        age: '14-15 Years',
        duration: '2 Years',
        color: 'purple',
        icon: 'Cpu',
        darseNizami: 'Urdu, Farsi',
        generalEducation: ['Sanawiyyah / Senior / HSC'],
        internationalEducation: ['Grade 11 to Grade 12 / (Advanced) A-level'],
        technicalActivities: [
          'Extracurricular: Robotics, Drone, 3D & CMC Designing',
          'Real-life: Waste Management, Housekeeping',
          'Computer: Photographic, Eating (Dr., Art)',
        ],
        languageSports: ['Languages: Urdu, Hindi, Persian', 'Sports: Shooting'],
        economyTarbiyah: [
          'Understanding the meaning and knowing the rules and regulations',
          'All Tarafis discussed one by one in Every week indoor',
        ],
        foodSurvival: [
          'Food: Total, car & Other Meat-Motion.',
          'Survival: Survive Road, car & Other Vehicle accident',
        ],
      },
      {
        level: 'Level 4',
        title: 'Higher Secondary Stage',
        age: '16-19 Years',
        duration: '4 Years',
        color: 'orange',
        icon: 'Target',
        darseNizami: 'Mizan to Sharhe Jami',
        generalEducation: ['Sanawiyyah-Ulya / Honours / BSc'],
        internationalEducation: [
          'Diploma in Science or Others Subjects in University / Undergraduate',
        ],
        technicalActivities: [
          'Extracurricular: Mobile & Hardware Service, Nano & Microsolar Technologies',
          'Real-life: Food Processing & Packaging',
          'Computer: EduQuad Level 3 DCCS',
        ],
        languageSports: ['Language: Arabic', 'Sports: Wushu, Fencing'],
        economyTarbiyah: [
          'Knowing job opportunities and sources of income',
          'All Tarafis practised one by one in Every week outdoor',
        ],
        foodSurvival: [
          'Food: ', // Empty in screenshot
          'Survival: Survive Phone & Drone accident',
        ],
      },
      {
        level: 'Level 5',
        title: 'Undergraduate Stage',
        age: '20-23 Years',
        duration: '4 Years',
        color: 'red',
        icon: 'GraduationCap',
        darseNizami: 'Sharhe Wekaya to Dawray Hadith',
        generalEducation: [
          "Fushi wa Tarbiyat / Master's-Whash / MEd-PGD-1 & 2",
        ],
        internationalEducation: ["Master's Degree / Graduate"],
        technicalActivities: [
          'Extracurricular: Lathe and Willing Machine Operating',
          'Real-life: Leather Products Making',
          'Computer: EduQuad Level 4,5 DDSO',
        ],
        languageSports: [
          'Languages: Chinese, Korean, Japanese, Spanish',
          'Sports: Tai-Chi, Wing-Chun',
        ],
        economyTarbiyah: [
          'Adopting a source of income and spending is according to Sharia',
          'All Tarafis presented Nationally',
        ],
        foodSurvival: [
          'Food: ', // Empty in screenshot
          'Survival: Survive Other any bad situation',
        ],
      },
      {
        level: 'Level 6',
        title: 'Postgraduate Stage',
        age: '24-25 Years',
        duration: '2 Years',
        color: 'indigo',
        icon: 'Trophy',
        darseNizami: 'Takhassus fil Tafsir wal Fiqh',
        generalEducation: ['Takhassus / PID-3 Thesis / Doctor'],
        internationalEducation: [
          'Doctoral Degree / Postgraduate / Scholarship',
        ],
        technicalActivities: [
          'Extracurricular: Media Handling and Journalism',
          'Real-life: Skill Networking & Being an Entrepreneur',
          'Computer: AIOps Diploma 6',
        ],
        languageSports: ['Languages: Hebrew, African', 'Sports: Equestrian'],
        economyTarbiyah: [
          'Increasing income and spending is on Islam',
          'All Tarafis presented internationally',
        ],
        foodSurvival: [
          'Food: ', // Empty in screenshot
          'Survival: Survive False cases & Seeking justice in court',
        ],
      },
    ],
    sectionTitles: {
      curriculumLevels: 'Complete Curriculum Roadmap (22 Years)',
      keyFeatures: 'Key Features of MIC System',
      specialPrograms: 'Special Programs',
      ctaTitle: 'Join the Future of Integrated Education',
      ctaDescription:
        'Start your journey with Manzil International Curriculum today',
      contactButton: 'Apply Now',
      downloadButton: 'Download Full Curriculum',
    },
    keyFeatures: [
      {
        title: 'Integrated Education',
        description:
          'Combines Darse Nizami, International Curriculum & Technical Education in one system',
        color: 'blue',
        icon: 'Layers',
      },
      {
        title: 'Global Certification',
        description:
          'Internationally recognized certifications from primary to doctoral level',
        color: 'green',
        icon: 'Globe',
      },
      {
        title: 'Practical Skills',
        description:
          'Real-life activities, technical training and survival skills',
        color: 'purple',
        icon: 'Brain',
      },
      {
        title: 'Language Mastery',
        description:
          'Multiple language courses including Arabic, English, Chinese and more',
        color: 'orange',
        icon: 'BookText',
      },
      {
        title: 'Islamic Economy',
        description:
          'Comprehensive Islamic economic education and practical implementation',
        color: 'red',
        icon: 'Target',
      },
      {
        title: 'Safety & Survival',
        description:
          'Training for various accident survival and emergency situations',
        color: 'indigo',
        icon: 'Shield',
      },
    ],
  },
  bn: {
    overview: {
      totalLevels: 6,
      levelsLabel: 'লেভেল',
      totalYears: 22,
      yearsLabel: 'বছর',
      ageRange: '৪-২৫',
      ageRangeLabel: 'বছর',
      streamsLabel: 'স্ট্রিম',
    },
    title: 'মানযিল আন্তর্জাতিক কারিকুলাম - মানযিল ম্যানুয়াল',
    subtitle: 'এমআইসি - একটি সমন্বিত শিক্ষা ব্যবস্থা',
    levels: [
      {
        level: 'লেভেল ১',
        title: 'ভিত্তি স্তর',
        age: '০৪-০৮ বছর',
        duration: '৫ বছর',
        color: 'blue',
        icon: 'Star',
        darseNizami: 'নূরানী, নাজেরা',
        generalEducation: ['ইবতেদায়ী / জুনিয়র / পিএসসি'],
        internationalEducation: ['গ্রেড ১ থেকে গ্রেড ৫ / প্রাইমারি লেভেল'],
        technicalActivities: [
          'সহশিক্ষা: সুন্দর হাতের লেখা, ড্রয়িং, আর্ট, অরিগামি',
          'বাস্তব জীবনের: রান্না, সেলাই, ব্লক, বাটিক',
          'কম্পিউটার: কম্পিউটার ইতিহাস, বুঝা, কেন, কিভাবে?',
        ],
        languageSports: [
          'ভাষা: বাংলা',
          'ক্রীড়া: সাঁতার, ম্যারাথন, সাইক্লিং, স্কেটিং',
        ],
        economyTarbiyah: [
          'আল্লাহর উপর বিশ্বাস ও বাবা-মায়ের জন্য দোয়া',
          'সব তারাফিস সাপ্তাহিক আলোচনা (ইনডোর)',
        ],
        foodSurvival: [
          'খাদ্য: সমস্ত খাবার অর্গানিক এবং প্রাকৃতিক উৎস থেকে সংগ্রহ করা হবে।',
          'বেঁচে থাকা: আগুন, পানি, বন্যা এবং ভূমিকম্প থেকে বেঁচে থাকা',
        ],
      },
      {
        level: 'লেভেল ২',
        title: 'মধ্যবর্তী স্তর',
        age: '০৯-১৩ বছর',
        duration: '৫ বছর',
        color: 'green',
        icon: 'BookText',
        darseNizami: 'হিফজুল কুরআন',
        generalEducation: ['মুতাওয়াসসিতাহ / মিডল / এসএসসি'],
        internationalEducation: ['গ্রেড ৬ থেকে গ্রেড ১০ / (অর্ডিনারি) ও লেভেল'],
        technicalActivities: [
          'সহশিক্ষা: ক্রাফট ও ক্যালিগ্রাফি',
          'বাস্তব জীবনের: বাগান করা, হাইড্রোপনিক, কৃষি, গ্রিন হাউস ফার্মিং',
          'কম্পিউটার: এমএস অফিস, ফটোশপ, এআই',
        ],
        languageSports: ['ভাষা: ইংরেজি', 'ক্রীড়া: তীরন্দাজি'],
        economyTarbiyah: [
          'অর্থনৈতিক আয়াত ও অভ্যাস মুখস্থ করা',
          'সব তারাফিস সাপ্তাহিক আলোচনা (ইনডোর)',
        ],
        foodSurvival: [
          'খাদ্য: উৎস, সরিষার তেল, ২০% ফাইবার, ৭০% শাকসবজি ও ফল, ১০% মাছ, মুরগি, মিষ্টি',
          'বেঁচে থাকা: লঞ্চ ও স্পিড বোর্ড দুর্ঘটনা থেকে বেঁচে থাকা',
        ],
      },
      {
        level: 'লেভেল ৩',
        title: 'মাধ্যমিক স্তর',
        age: '১৪-১৫ বছর',
        duration: '২ বছর',
        color: 'purple',
        icon: 'Cpu',
        darseNizami: 'উর্দু, ফার্সি',
        generalEducation: ['সানাউইয়্যাহ / সিনিয়র / এইচএসসি'],
        internationalEducation: [
          'গ্রেড ১১ থেকে গ্রেড ১২ / (অ্যাডভান্সড) এ-লেভেল',
        ],
        technicalActivities: [
          'সহশিক্ষা: রোবোটিক্স, ড্রোন, 3D ও CMC ডিজাইনিং',
          'বাস্তব জীবনের: বর্জ্য ব্যবস্থাপনা, ঘরোয়া কাজ',
          'কম্পিউটার: ফটোগ্রাফিক, ইটিং (ডক্টর, আর্ট)',
        ],
        languageSports: ['ভাষা: উর্দু, হিন্দি, ফার্সি', 'ক্রীড়া: শুটিং'],
        economyTarbiyah: [
          'অর্থ বোঝা এবং নিয়মকানুন জানা',
          'সব তারাফিস সাপ্তাহিক আলোচনা (ইনডোর)',
        ],
        foodSurvival: [
          'খাদ্য: তুতাহ, গাড়ি ও অন্যান্য মাংস-মোশন।',
          'বেঁচে থাকা: রাস্তা, গাড়ি ও অন্যান্য যানবাহন দুর্ঘটনা থেকে বেঁচে থাকা',
        ],
      },
      {
        level: 'লেভেল ৪',
        title: 'উচ্চ মাধ্যমিক স্তর',
        age: '১৬-১৯ বছর',
        duration: '৪ বছর',
        color: 'orange',
        icon: 'Target',
        darseNizami: 'মীযান থেকে শরহে জামি',
        generalEducation: ['সানাউইয়্যাহ-উলইয়া / অনার্স / বিএসসি'],
        internationalEducation: [
          'বিজ্ঞান বা বিশ্ববিদ্যালয় বিষয়ে ডিপ্লোমা / আন্ডারগ্রাজুয়েট',
        ],
        technicalActivities: [
          'সহশিক্ষা: মোবাইল ও হার্ডওয়্যার সার্ভিস, ন্যানো ও মাইক্রোসোলার টেকনোলজি',
          'বাস্তব জীবনের: খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং',
          'কম্পিউটার: এডুকোয়াড লেভেল ৩ DCCS',
        ],
        languageSports: ['ভাষা: আরবি', 'ক্রীড়া: উশু, ফেন্সিং'],
        economyTarbiyah: [
          'চাকরির সুযোগ ও আয়ের উৎস জানা',
          'সব তারাফিস সাপ্তাহিক অনুশীলন (আউটডোর)',
        ],
        foodSurvival: [
          'খাদ্য: ', // Screenshot-এ ফাঁকা
          'বেঁচে থাকা: ফোন ও ড্রোন দুর্ঘটনা থেকে বেঁচে থাকা',
        ],
      },
      {
        level: 'লেভেল ৫',
        title: 'স্নাতক স্তর',
        age: '২০-২৩ বছর',
        duration: '৪ বছর',
        color: 'red',
        icon: 'GraduationCap',
        darseNizami: 'শরহে বেকায়া থেকে দাওরায়ে হাদিস',
        generalEducation: [
          'ফুষি ওয়া তারবিয়াত / মাস্টার্স-হোয়াশ / এমএড-পিজিডি-১ ও ২',
        ],
        internationalEducation: ['মাস্টার্স ডিগ্রি / গ্র্যাজুয়েট'],
        technicalActivities: [
          'সহশিক্ষা: লেদার ও মিলিং মেশিন চালনা',
          'বাস্তব জীবনের: চামড়ার পণ্য তৈরি',
          'কম্পিউটার: এডুকোয়াড লেভেল ৪,৫ DDSO',
        ],
        languageSports: [
          'ভাষা: চীনা, কোরিয়ান, জাপানিজ, স্প্যানিশ',
          'ক্রীড়া: তাই-চি, উইং-চুন',
        ],
        economyTarbiyah: [
          'হালাল আয়ের উৎস গ্রহণ ও শরিয়াহ অনুযায়ী ব্যয়',
          'সব তারাফিস জাতীয়ভাবে উপস্থাপন',
        ],
        foodSurvival: [
          'খাদ্য: ', // Screenshot-এ ফাঁকা
          'বেঁচে থাকা: অন্য যেকোনো খারাপ অবস্থা থেকে বেঁচে থাকা',
        ],
      },
      {
        level: 'লেভেল ৬',
        title: 'স্নাতকোত্তর স্তর',
        age: '২৪-২৫ বছর',
        duration: '২ বছর',
        color: 'indigo',
        icon: 'Trophy',
        darseNizami: 'তাখাসসুস ফিল তাফসীর ওয়াল ফিকহ',
        generalEducation: ['তাখাসসুস / পিআইডি-৩ থিসিস / ডক্টর'],
        internationalEducation: ['ডক্টরেট ডিগ্রি / স্নাতকোত্তর / স্কলারশিপ'],
        technicalActivities: [
          'সহশিক্ষা: মিডিয়া হ্যান্ডলিং ও সাংবাদিকতা',
          'বাস্তব জীবনের: দক্ষতা নেটওয়ার্কিং ও উদ্যোক্তা হওয়া',
          'কম্পিউটার: এআইওপস ডিপ্লোমা ৬',
        ],
        languageSports: ['ভাষা: হিব্রু, আফ্রিকান', 'ক্রীড়া: ঘোড়দৌড়'],
        economyTarbiyah: [
          'আয় বৃদ্ধি ও ইসলামী ব্যয়',
          'সব তারাফিস আন্তর্জাতিকভাবে উপস্থাপন',
        ],
        foodSurvival: [
          'খাদ্য: ', // Screenshot-এ ফাঁকা
          'বেঁচে থাকা: মিথ্যা মামলা ও আদালতে ন্যায়বিচার খোঁজা থেকে বেঁচে থাকা',
        ],
      },
    ],
    sectionTitles: {
      curriculumLevels: 'সম্পূর্ণ কারিকুলাম রোডম্যাপ (২২ বছর)',
      keyFeatures: 'এমআইসি ব্যবস্থার প্রধান বৈশিষ্ট্য',
      specialPrograms: 'বিশেষ প্রোগ্রামসমূহ',
      ctaTitle: 'সমন্বিত শিক্ষার ভবিষ্যতে যোগ দিন',
      ctaDescription: 'আজই শুরু করুন মানযিল আন্তর্জাতিক কারিকুলামের যাত্রা',
      contactButton: 'এখনই আবেদন করুন',
      downloadButton: 'সম্পূর্ণ কারিকুলাম ডাউনলোড',
    },
    keyFeatures: [
      {
        title: 'সমন্বিত শিক্ষা',
        description:
          'দরসে নিজামী, আন্তর্জাতিক কারিকুলাম ও কারিগরি শিক্ষা একই ব্যবস্থায়',
        color: 'blue',
        icon: 'Layers',
      },
      {
        title: 'বৈশ্বিক সার্টিফিকেশন',
        description:
          'প্রাইমারি থেকে ডক্টরেট পর্যন্ত আন্তর্জাতিকভাবে স্বীকৃত সার্টিফিকেশন',
        color: 'green',
        icon: 'Globe',
      },
      {
        title: 'ব্যবহারিক দক্ষতা',
        description:
          'বাস্তব জীবনের কার্যক্রম, কারিগরি প্রশিক্ষণ ও বেঁচে থাকার দক্ষতা',
        color: 'purple',
        icon: 'Brain',
      },
      {
        title: 'ভাষা দক্ষতা',
        description: 'আরবি, ইংরেজি, চীনা সহ একাধিক ভাষা কোর্স',
        color: 'orange',
        icon: 'BookText',
      },
      {
        title: 'ইসলামী অর্থনীতি',
        description: 'সম্পূর্ণ ইসলামী অর্থনৈতিক শিক্ষা ও ব্যবহারিক বাস্তবায়ন',
        color: 'red',
        icon: 'Target',
      },
      {
        title: 'নিরাপত্তা ও বেঁচে থাকা',
        description: 'বিভিন্ন দুর্ঘটনা থেকে বেঁচে থাকার প্রশিক্ষণ',
        color: 'indigo',
        icon: 'Shield',
      },
    ],
  },
};

// MIC Curriculum Data based on the provided screenshot image
export const curriculumLevels = [
  {
    id: 1,
    level: { bn: 'লেভেল ১', en: 'Level 1' },
    age: { bn: '০৪-০৮ বছর', en: '04-08 Years' },
    duration: { bn: '৫ বছর', en: '5 Years' },
    color: 'blue',
    // Main 3 Streams
    madrasa: { bn: ['নূরানী', 'নাজেরা'], en: ['Nurani', 'Nazera'] },
    general: {
      bn: ['প্রাইমারি লেভেল (১ম-৫ম)', 'PSC / ইবতেদায়ী'],
      en: ['Primary Level (Gr 1-5)', 'PSC / Ibtidaiyyah'],
    },
    technical: {
      bn: ['হাতের লেখা ও আর্ট', 'রান্নাবান্না ও সেলাই', 'কম্পিউটার পরিচিতি'],
      en: ['Handwriting & Arts', 'Cooking & Sewing', 'Computer Basics'],
    },
    // Others / Highlights (Language, Sports, Survival, Rizq)
    others: {
      bn: [
        'বাংলা ভাষা',
        'সাঁতার ও স্কেটিং',
        'আগুন ও ভূমিকম্প থেকে আত্মরক্ষা',
        'অর্গানিক খাবার',
      ],
      en: [
        'Bengali Language',
        'Swimming & Skating',
        'Fire & Earthquake Safety',
        'Organic Food',
      ],
    },
  },
  {
    id: 2,
    level: { bn: 'লেভেল ২', en: 'Level 2' },
    age: { bn: '০৯-১৩ বছর', en: '09-13 Years' },
    duration: { bn: '৫ বছর', en: '5 Years' },
    color: 'green',
    madrasa: {
      bn: ['হিফজুল কুরআন', 'তাজভিদ'],
      en: ['Hifzul Quran', 'Tajweed'],
    },
    general: {
      bn: ['O-Level (London)', 'JSC / SSC'],
      en: ['O-Level (London)', 'JSC / SSC'],
    },
    technical: {
      bn: ['ক্যালিগ্রাফি ও ক্রাফট', 'বাগান ও কৃষি কাজ', 'MS Office, PS, AI'],
      en: ['Calligraphy & Craft', 'Agriculture/Gardening', 'MS Office, PS, AI'],
    },
    others: {
      bn: [
        'ইংরেজি ভাষা',
        'তীরন্দাজি (Archery)',
        'লঞ্চ ও স্পিডবোট সেফটি',
        'পুষ্টিকর খাদ্যাভ্যাস',
      ],
      en: [
        'English Language',
        'Archery',
        'Boat & Launch Safety',
        'Nutritious Diet',
      ],
    },
  },
  {
    id: 3,
    level: { bn: 'লেভেল ৩', en: 'Level 3' },
    age: { bn: '১৪-১৫ বছর', en: '14-15 Years' },
    duration: { bn: '২ বছর', en: '2 Years' },
    color: 'purple',
    madrasa: {
      bn: ['উর্দু ও ফার্সি ভাষা', 'কিতাব বিভাগ'],
      en: ['Urdu & Farsi', 'Kitab Division'],
    },
    general: {
      bn: ['A-Level (Advanced)', 'HSC / আলিম'],
      en: ['A-Level (Advanced)', 'HSC / Alim'],
    },
    technical: {
      bn: ['রোবোটিক্স ও ড্রোন', '3D ও CNC ডিজাইনিং', 'ভিডিও এডিটিং'],
      en: ['Robotics & Drone', '3D & CNC Design', 'Video Editing'],
    },
    others: {
      bn: [
        'হিন্দি ও ফার্সি ভাষা',
        'শুটিং (Shooting)',
        'সড়ক দুর্ঘটনা থেকে আত্মরক্ষা',
        'অর্থনীতি জ্ঞান',
      ],
      en: ['Hindi & Persian', 'Shooting', 'Road Safety', 'Economic Rules'],
    },
  },
  {
    id: 4,
    level: { bn: 'লেভেল ৪', en: 'Level 4' },
    age: { bn: '১৬-১৯ বছর', en: '16-19 Years' },
    duration: { bn: '৪ বছর', en: '4 Years' },
    color: 'orange',
    madrasa: {
      bn: ['মিজান থেকে শরহে জামি', 'উচ্চতর ফিকহ'],
      en: ['Mizan to Sarhe Jami', 'Advanced Fiqh'],
    },
    general: {
      bn: ['অনার্স / বিএসসি', 'ডিপ্লোমা ইন সায়েন্স'],
      en: ['Honours / BSc', 'Diploma in Science'],
    },
    technical: {
      bn: ['হার্ডওয়্যার সার্ভিসিং', 'ন্যানো টেকনোলজি', 'ফুড প্রসেসিং'],
      en: ['Hardware Servicing', 'Nano Tech', 'Food Processing'],
    },
    others: {
      bn: [
        'আরবি কথ্য ভাষা',
        'উশু ও ফেন্সিং',
        'বিমান দুর্ঘটনা সেফটি',
        'আয়ের উৎস তৈরি',
      ],
      en: [
        'Spoken Arabic',
        'Wushu & Fencing',
        'Plane Crash Safety',
        'Job Opportunities',
      ],
    },
  },
  {
    id: 5,
    level: { bn: 'লেভেল ৫', en: 'Level 5' },
    age: { bn: '২০-২৩ বছর', en: '20-23 Years' },
    duration: { bn: '৪ বছর', en: '4 Years' },
    color: 'red',
    madrasa: {
      bn: ['শরহে বেকায়া থেকে দাওরা', 'হাদিস বিশারদ'],
      en: ['Sarhe Wekaya to Dawra', 'Hadith Scholar'],
    },
    general: {
      bn: ['মাস্টার্স / এমফিল', 'উচ্চতর গবেষণা'],
      en: ['Masters / MPhil', 'Advanced Research'],
    },
    technical: {
      bn: ['মেশিন অপারেটিং', 'লেদার প্রসেসিং', 'উন্নত আইটি স্কিল'],
      en: ['Machine Operating', 'Leather Processing', 'Advanced IT'],
    },
    others: {
      bn: [
        'চীনা ও স্প্যানিশ ভাষা',
        'তাই-চি ও উইং-চুন',
        'যেকোন বিপদ মোকাবেলা',
        'হালাল উপার্জন',
      ],
      en: [
        'Chinese & Spanish',
        'Tai-Chi & Wing-Chun',
        'All Hazard Survival',
        'Halal Income',
      ],
    },
  },
  {
    id: 6,
    level: { bn: 'লেভেল ৬', en: 'Level 6' },
    age: { bn: '২৪-২৫ বছর', en: '24-25 Years' },
    duration: { bn: '২ বছর', en: '2 Years' },
    color: 'indigo',
    madrasa: {
      bn: ['তাখাসসুস (পিএইচডি)', 'মুফতি ও মুফাসসির'],
      en: ['Takhassus (PhD)', 'Mufti & Mufassir'],
    },
    general: {
      bn: ['পিএইচডি থিসিস', 'ডক্টরেট ডিগ্রি'],
      en: ['PhD Thesis', 'Doctorate Degree'],
    },
    technical: {
      bn: ['সাংবাদিকতা ও মিডিয়া', 'উদ্যোক্তা উন্নয়ন', 'AIOps ডিপ্লোমা'],
      en: ['Journalism & Media', 'Entrepreneurship', 'AIOps Diploma'],
    },
    others: {
      bn: [
        'হিব্রু ও আফ্রিকান ভাষা',
        'ঘোড়দৌড় (Equestrian)',
        'আইনি সুরক্ষা (কোর্ট)',
        'আন্তর্জাতিক প্রচার',
      ],
      en: ['Hebrew & African', 'Equestrian', 'Legal Justice', "Global Da'wah"],
    },
  },
];

// MNC Curriculum data (7-year system)
const mncCurriculumData = {
  en: {
    overview: {
      totalLevels: 7,
      levelsLabel: 'Stages',
      totalYears: 7,
      yearsLabel: 'Years',
      ageRange: '10-20',
      ageRangeLabel: 'Years',
      streamsLabel: 'Streams',
    },
    sectionTitles: {
      curriculumLevels: 'Curriculum Stages',
      specialPrograms: 'Special Programs',
      ctaTitle: 'Ready to Join Our Educational Journey?',
      ctaDescription:
        'Start your comprehensive Islamic and modern education today',
      contactButton: 'Apply Now',
      downloadButton: 'Download Brochure',
    },
    levels: [
      {
        level: 'Khususi Jamat',
        title: 'Foundation (1-2 Years)',
        age: '10-12 Years',
        duration: '1 Year',
        color: 'blue',
        icon: 'Star',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Building strong foundations in Islamic and basic education',
        subjects: {
          madrasa: [
            'Qaida & Nazira',
            'Dars-e-Nizami',
            'Quran Memorization (Partial)',
            'Islamic Manners',
          ],
          general: [
            'English Alphabet',
            'Basic Mathematics',
            'Bangla Language',
            'Environmental Studies',
          ],
          technical: [
            'Computer Basics',
            'Art & Craft',
            'Music & Movement',
            'Basic Science Experiments',
          ],
        },
      },
      {
        level: 'Taiseer Jamat 1st',
        title: 'Primary (1 Year)',
        age: '13-14 Years',
        duration: '1 Year',
        color: 'green',
        icon: 'Users',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Comprehensive development with Quran memorization and academic excellence',
        subjects: {
          madrasa: ['Tajweed Rules', 'Hadith Studies', 'Islamic History'],
          general: [
            'Befaq Syllabus',
            'Dars-e-Nizami',
            'NCTB Curriculum',
            'Class Five Subjects',
          ],
          technical: [
            'Computer Applications',
            'Basic Programming',
            'Digital Art',
            'Robotics Introduction',
          ],
        },
      },
      {
        level: 'Taiseer Jamat 2nd',
        title: 'Primary (1 Year)',
        age: '14-15 Years',
        duration: '1 Year',
        color: 'purple',
        icon: 'Users',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Comprehensive development with Quran memorization and academic excellence',
        subjects: {
          madrasa: ['Tajweed Rules', 'Hadith Studies', 'Islamic History'],
          general: [
            'Befaq Syllabus',
            'Dars-e-Nizami',
            'NCTB Curriculum',
            'Class Six Subjects',
          ],
          technical: [
            'Computer Applications',
            'Basic Programming',
            'Digital Art',
            'Robotics Introduction',
          ],
        },
      },
      {
        level: 'Mizan Jamat',
        title: 'Intermediate (1-2 Years)',
        age: '15-16 Years',
        duration: '1 Year',
        color: 'orange',
        icon: 'GraduationCap',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Advanced studies preparing for higher education and specialization',
        subjects: {
          madrasa: [
            'Dars-e-Nizami',
            'Arabic Literature',
            'Fiqh & Usul',
            'Islamic Philosophy',
          ],
          general: [
            'English Literature',
            'NCTB Curriculum',
            'Class Seven Subjects',
            'History/Geography',
          ],
          technical: [
            'Web Development',
            'Graphic Design',
            'Electronics',
            'Advanced Programming',
          ],
        },
      },
      {
        level: 'Nahbemir Jamat',
        title: '1 Year',
        age: '17-18 Years',
        duration: '1 Year',
        color: 'red',
        icon: 'GraduationCap',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Advanced studies preparing for higher education and specialization',
        subjects: {
          madrasa: [
            'Dars-e-Nizami',
            'Arabic Literature',
            'Fiqh & Usul',
            'Islamic Philosophy',
          ],
          general: [
            'English Literature',
            'NCTB Curriculum',
            'Class Eight Subjects',
            'History/Geography',
          ],
          technical: [
            'Web Development',
            'Graphic Design',
            'Electronics',
            'Advanced Programming',
          ],
        },
      },
      {
        level: 'Hedayetun Nahw Jamat',
        title: '1 Year',
        age: '18-19 Years',
        duration: '1 Year',
        color: 'indigo',
        icon: 'GraduationCap',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Advanced studies preparing for higher education and specialization',
        subjects: {
          madrasa: [
            'Dars-e-Nizami',
            'Arabic Literature',
            'Fiqh & Usul',
            'Islamic Philosophy',
          ],
          general: [
            'English Literature',
            'NCTB Curriculum',
            'Class Nine Subjects',
            'History/Geography',
          ],
          technical: [
            'Web Development',
            'Graphic Design',
            'Electronics',
            'Advanced Programming',
          ],
        },
      },
      {
        level: 'Kafia Jamat',
        title: '1 Year',
        age: '19-20 Years',
        duration: '1 Year',
        color: 'teal',
        icon: 'GraduationCap',
        madrasaLabel: 'Madrasa',
        generalLabel: 'General',
        technicalLabel: 'Technical',
        description:
          'Advanced studies preparing for higher education and specialization',
        subjects: {
          madrasa: [
            'Dars-e-Nizami',
            'Arabic Literature',
            'Fiqh & Usul',
            'Islamic Philosophy',
          ],
          general: [
            'English Literature',
            'NCTB Curriculum',
            'Class Ten Subjects',
            'SSC Preparation',
          ],
          technical: [
            'Web Development',
            'Graphic Design',
            'Electronics',
            'Advanced Programming',
          ],
        },
      },
    ],
    specialPrograms: [
      {
        title: 'Nazera Program',
        duration: '1 Year',
        color: 'blue',
        description:
          'Complete Quran recitation with proper Tajweed and understanding',
        features: [
          'Complete Quran Recitation',
          'Tajweed Mastery',
          'Islamic Character Development',
        ],
      },
      {
        title: 'Hifz Program',
        duration: '2-3 Years',
        color: 'blue',
        description:
          'Complete Quran memorization with proper Tajweed and understanding',
        features: [
          'Complete Quran Memorization',
          'Tajweed Mastery',
          'Islamic Character Development',
        ],
      },
    ],
  },
  bn: {
    overview: {
      totalLevels: 7,
      levelsLabel: 'স্টেজ',
      totalYears: 7,
      yearsLabel: 'বছর',
      ageRange: '১০-২০',
      ageRangeLabel: 'বছর',
      streamsLabel: 'স্ট্রিম',
    },
    sectionTitles: {
      curriculumLevels: 'কারিকুলাম স্টেজসমূহ',
      specialPrograms: 'বিশেষ প্রোগ্রামসমূহ',
      ctaTitle: 'আমাদের শিক্ষা যাত্রায় যোগ দিতে প্রস্তুত?',
      ctaDescription: 'আজই আপনার ব্যাপক ইসলামিক এবং আধুনিক শিক্ষা শুরু করুন',
      contactButton: 'এখনই আবেদন করুন',
      downloadButton: 'ব্রোশার ডাউনলোড',
    },
    levels: [
      {
        level: 'খুসুসী জামাত',
        title: 'ভিত্তি (১-২ বছর)',
        age: '১০-১২ বছর',
        duration: '১ বছর',
        color: 'blue',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'ইসলামিক এবং মৌলিক শিক্ষায় শক্ত ভিত্তি নির্মাণ',
        subjects: {
          madrasa: [
            'কায়েদা ও নাজেরা',
            'দরসে নিজামী',
            'কুরআন মুখস্থ (আংশিক)',
            'ইসলামিক আচরণ',
          ],
          general: [
            'ইংলিশ বর্ণমালা',
            'মৌলিক গণিত',
            'বাংলা ভাষা',
            'পরিবেশ বিদ্যা',
          ],
          technical: [
            'কম্পিউটারে বেসিক',
            'আর্ট এবং ক্রাফ্ট',
            'সংগীত এবং আন্দোলন',
            'মৌলিক বিজ্ঞান পরীক্ষা',
          ],
        },
      },
      {
        level: 'তাইসীর জামাত ১ম',
        title: 'প্রাথমিক (১ বছর)',
        age: '১৩-১৪ বছর',
        duration: '১ বছর',
        color: 'green',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'কুরআন মুখস্থ এবং একাডেমিক উৎকর্ষতার সাথে ব্যাপক উন্নয়ন',
        subjects: {
          madrasa: ['তাজভিদের নিয়ম', 'হাদিস অধ্যয়ন', 'ইসলামিক ইতিহাস'],
          general: [
            'বেফাক সিলেবাস',
            'দরসে নিজামী',
            'NCTB কারিকুলাম',
            'ক্লাস ফাইভের বিষয়সমূহ',
          ],
          technical: [
            'কম্পিউটার অ্যাপ্লিকেশন',
            'মৌলিক প্রোগ্রামিং',
            'ডিজিটাল আর্ট',
            'রোবোটিক্স পরিচিতি',
          ],
        },
      },
      {
        level: 'তাইসীর জামাত ২য়',
        title: 'প্রাথমিক (১ বছর)',
        age: '১৪-১৫ বছর',
        duration: '১ বছর',
        color: 'purple',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'কুরআন মুখস্থ এবং একাডেমিক উৎকর্ষতার সাথে ব্যাপক উন্নয়ন',
        subjects: {
          madrasa: ['তাজভিদের নিয়ম', 'হাদিস অধ্যয়ন', 'ইসলামিক ইতিহাস'],
          general: [
            'বেফাক সিলেবাস',
            'দরসে নিজামী',
            'NCTB কারিকুলাম',
            'ক্লাস সিক্সের বিষয়সমূহ',
          ],
          technical: [
            'কম্পিউটার অ্যাপ্লিকেশন',
            'মৌলিক প্রোগ্রামিং',
            'ডিজিটাল আর্ট',
            'রোবোটিক্স পরিচিতি',
          ],
        },
      },
      {
        level: 'মিজান জামাত',
        title: 'মধ্যবর্তী (১-২ বছর)',
        age: '১৫-১৬ বছর',
        duration: '১ বছর',
        color: 'orange',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'উচ্চতর শিক্ষা এবং বিশেষায়নের জন্য প্রস্তুতি',
        subjects: {
          madrasa: [
            'দরসে নিজামী',
            'আরবি সাহিত্য',
            'ফিকহ ও উসুল',
            'ইসলামিক দর্শন',
          ],
          general: [
            'ইংলিশ সাহিত্য',
            'NCTB কারিকুলাম',
            'ক্লাস সেভেনের বিষয়সমূহ',
            'ইতিহাস/ভূগোল',
          ],
          technical: [
            'ওয়েব ডেভেলপমেন্ট',
            'গ্রাফিক ডিজাইন',
            'ইলেকট্রনিক্স',
            'উন্নত প্রোগ্রামিং',
          ],
        },
      },
      {
        level: 'নাহবেমীর জামাত',
        title: '১ বছর',
        age: '১৭-১৮ বছর',
        duration: '১ বছর',
        color: 'red',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'উচ্চতর শিক্ষা এবং বিশেষায়নের জন্য প্রস্তুতি',
        subjects: {
          madrasa: [
            'দরসে নিজামী',
            'আরবি সাহিত্য',
            'ফিকহ ও উসুল',
            'ইসলামিক দর্শন',
          ],
          general: [
            'ইংলিশ সাহিত্য',
            'NCTB কারিকুলাম',
            'ক্লাস ৮ এর বিষয়সমূহ',
            'ইতিহাস/ভূগোল',
          ],
          technical: [
            'ওয়েব ডেভেলপমেন্ট',
            'গ্রাফিক ডিজাইন',
            'ইলেকট্রনিক্স',
            'উন্নত প্রোগ্রামিং',
          ],
        },
      },
      {
        level: 'হেদায়েতুন নাহু জামাত',
        title: '১ বছর',
        age: '১৮-১৯ বছর',
        duration: '১ বছর',
        color: 'indigo',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'উচ্চতর শিক্ষা এবং বিশেষায়নের জন্য প্রস্তুতি',
        subjects: {
          madrasa: [
            'দরসে নিজামী',
            'আরবি সাহিত্য',
            'ফিকহ ও উসুল',
            'ইসলামিক দর্শন',
          ],
          general: [
            'ইংলিশ সাহিত্য',
            'NCTB কারিকুলাম',
            'ক্লাস ৯ এর বিষয়সমূহ',
            'ইতিহাস/ভূগোল',
          ],
          technical: [
            'ওয়েব ডেভেলপমেন্ট',
            'গ্রাফিক ডিজাইন',
            'ইলেকট্রনিক্স',
            'উন্নত প্রোগ্রামিং',
          ],
        },
      },
      {
        level: 'কাফিয়া জামাত',
        title: '১ বছর',
        age: '১৯-২০ বছর',
        duration: '১ বছর',
        color: 'teal',
        madrasaLabel: 'মাদরাসা',
        generalLabel: 'জেনারেল',
        technicalLabel: 'কারিগরি',
        description: 'উচ্চতর শিক্ষা এবং বিশেষায়নের জন্য প্রস্তুতি',
        subjects: {
          madrasa: [
            'দরসে নিজামী',
            'আরবি সাহিত্য',
            'ফিকহ ও উসুল',
            'ইসলামিক দর্শন',
          ],
          general: [
            'ইংলিশ সাহিত্য',
            'NCTB কারিকুলাম',
            'ক্লাস ১০ এর বিষয়সমূহ',
            'SSC প্রস্তুতি',
          ],
          technical: [
            'ওয়েব ডেভেলপমেন্ট',
            'গ্রাফিক ডিজাইন',
            'ইলেকট্রনিক্স',
            'উন্নত প্রোগ্রামিং',
          ],
        },
      },
    ],
    specialPrograms: [
      {
        title: 'নাজেরা',
        duration: '১ বছর',
        color: 'blue',
        description: 'সঠিক তাজভিদ এবং বোঝার সাথে সম্পূর্ণ কুরআন পড়া',
        features: [
          'সম্পূর্ণ কুরআন পড়া',
          'তাজভিদ দক্ষতা',
          'ইসলামিক চরিত্র উন্নয়ন',
        ],
      },
      {
        title: 'হিফজ',
        duration: '২-৩ বছর',
        color: 'blue',
        description: 'সঠিক তাজভিদ এবং বোঝার সাথে সম্পূর্ণ কুরআন মুখস্থ',
        features: [
          'সম্পূর্ণ কুরআন মুখস্থ',
          'তাজভিদ দক্ষতা',
          'ইসলামিক চরিত্র উন্নয়ন',
        ],
      },
    ],
  },
};

// Function to get MIC curriculum data based on language
const getStaticMICCurriculumData = (language = 'en') => {
  return micCurriculumData[language] || micCurriculumData.en;
};

// Function to get MNC curriculum data based on language
const getStaticMNCCurriculumData = (language = 'en') => {
  return mncCurriculumData[language] || mncCurriculumData.en;
};

// MIC Curriculum data hook
export function useMICCurriculumData(language = 'en') {
  return useQuery({
    queryKey: ['mic-curriculum', language],
    queryFn: async () => {
      await delay(100); // Reduced delay for faster loading
      return getStaticMICCurriculumData(language);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: getStaticMICCurriculumData(language), // Provide initial data immediately
  });
}

// MNC Curriculum data hook
export function useMNCCurriculumData(language = 'en') {
  return useQuery({
    queryKey: ['mnc-curriculum', language],
    queryFn: async () => {
      await delay(100); // Reduced delay for faster loading
      return getStaticMNCCurriculumData(language);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: getStaticMNCCurriculumData(language), // Provide initial data immediately
  });
}

export function usePrefetchAdmissionData() {
  // This would prefetch data in a parent component
  // For now, just return a function that does nothing
  return () => {
    // Prefetch logic would go here
  };
}
