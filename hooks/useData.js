import { useQuery } from '@tanstack/react-query'

// Mock admission data - replace with actual API calls
const admissionData = {
  en: {
    overview: {
      title: "Admission Overview",
      description: "Comprehensive admission information for Manzil International Institute"
    },
  process: [
    {
      step: "1",
      title: "Online Application",
      description: "Submit your application through our online portal",
      duration: "1-2 days",
      color: "blue",
      requirements: [
        "Valid email address",
        "Parent/Guardian contact information",
        "Basic student details"
      ]
    },
    {
      step: "2",
      title: "Admission Test",
      description: "Assessment test to evaluate student's academic level",
      duration: "2-3 hours",
      color: "green",
      requirements: [
        "Age-appropriate assessment",
        "Islamic knowledge evaluation",
        "Academic skills test"
      ]
    },
    {
      step: "3",
      title: "Nomination & Selection",
      description: "Review and selection based on test results",
      duration: "3-5 days",
      color: "purple",
      requirements: [
        "Test result evaluation",
        "Interview (if required)",
        "Final selection decision"
      ]
    },
    {
      step: "4",
      title: "Document Submission",
      description: "Submit all required documents for verification",
      duration: "1 week",
      color: "orange",
      requirements: [
        "Birth certificate",
        "Academic certificates",
        "Medical certificates"
      ]
    },
    {
      step: "5",
      title: "Fee Payment & Enrollment",
      description: "Complete payment and finalize enrollment",
      duration: "1-2 days",
      color: "red",
      requirements: [
        "Fee payment completion",
        "Enrollment form signing",
        "Welcome kit distribution"
      ]
    }
  ],
  requirements: {
    level1: {
      age: "Below 6 years",
      academic: [
        "Basic alphabet recognition",
        "Simple counting skills",
        "Basic Islamic phrases"
      ],
      documents: [
        "Birth certificate",
        "2 passport size photos",
        "Parent ID copy"
      ]
    },
    level2: {
      age: "Below 9 years",
      academic: [
        "Basic reading and writing",
        "Simple arithmetic",
        "Basic Islamic knowledge"
      ],
      documents: [
        "Birth certificate",
        "Previous school certificates",
        "2 passport size photos",
        "Medical certificate"
      ]
    },
    level3: {
      age: "Below 12 years",
      academic: [
        "Reading and writing proficiency",
        "Basic mathematics",
        "Islamic studies foundation"
      ],
      documents: [
        "Birth certificate",
        "Previous school certificates",
        "2 passport size photos",
        "Medical certificate",
        "House registration"
      ]
    },
    huffaz: {
      age: "Below 12 years",
      academic: [
        "Complete Quran memorization (Hafiz)",
        "Basic Islamic education",
        "Arabic language proficiency"
      ],
      documents: [
        "Birth certificate",
        "Hafiz certificate",
        "Previous school certificates",
        "2 passport size photos",
        "Medical certificate"
      ]
    }
  },
  feeStructure: {
    oneTime: [
      { name: "Admission Fee", amount: "৳30,000" },
      { name: "Session Fee", amount: "৳25,000" }
    ],
    monthly: {
      tuition: [
        { name: "Level 1-2", amount: "৳2,000" },
        { name: "Level 3", amount: "৳2,500" },
        { name: "Huffaz", amount: "৳3,000" }
      ],
      residential: [
        { name: "Standard Room", amount: "৳3,500" },
        { name: "Premium Room", amount: "৳5,000" },
        { name: "VIP Room", amount: "৳15,000" }
      ],
      food: [
        { name: "Basic Package", amount: "৳9,000" },
        { name: "Standard Package", amount: "৳12,000" },
        { name: "Premium Package", amount: "৳15,000" }
      ]
    }
  },
  importantDates: [
    {
      event: "Application Opens",
      date: "January 1, 2024",
      status: "open"
    },
    {
      event: "Admission Test",
      date: "January 15, 2024",
      status: "upcoming"
    },
    {
      event: "Result Declaration",
      date: "January 20, 2024",
      status: "upcoming"
    },
    {
      event: "Classes Begin",
      date: "February 1, 2024",
      status: "upcoming"
    }
  ],
  contact: {
    phone: ["+8801407046001", "+8801407046002", "+8801407046003"],
    email: "info@manzilinstitute.edu.bd",
    address: "Harunur Rashid Tower (10 Storied Building), House #91, Road #2, North Rayarbagh Bus Stand, Jatrabari, Dhaka-1362",
    officeHours: "Saturday - Thursday: 9:00 AM - 5:00 PM"
  }
  },
  bn: {
    overview: {
      title: "ভর্তি ওভারভিউ",
      description: "মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটের জন্য বিস্তারিত ভর্তি তথ্য"
    },
    process: [
      {
        step: "১",
        title: "অনলাইন আবেদন",
        description: "আমাদের অনলাইন পোর্টালের মাধ্যমে আপনার আবেদন জমা দিন",
        duration: "১-২ দিন",
        color: "blue",
        requirements: [
          "বৈধ ইমেইল ঠিকানা",
          "অভিভাবক/অভিভাবকের যোগাযোগের তথ্য",
          "মৌলিক ছাত্র তথ্য"
        ]
      },
      {
        step: "২",
        title: "ভর্তি পরীক্ষা",
        description: "ছাত্রের একাডেমিক স্তর মূল্যায়নের জন্য পরীক্ষা",
        duration: "২-৩ ঘণ্টা",
        color: "green",
        requirements: [
          "বয়স অনুযায়ী মূল্যায়ন",
          "ইসলামিক জ্ঞান মূল্যায়ন",
          "একাডেমিক দক্ষতা পরীক্ষা"
        ]
      },
      {
        step: "৩",
        title: "নামকরণ এবং নির্বাচন",
        description: "পরীক্ষার ফলাফলের ভিত্তিতে পর্যালোচনা এবং নির্বাচন",
        duration: "৩-৫ দিন",
        color: "purple",
        requirements: [
          "পরীক্ষার ফলাফল মূল্যায়ন",
          "ইন্টারভিউ (প্রয়োজনে)",
          "চূড়ান্ত নির্বাচন সিদ্ধান্ত"
        ]
      },
      {
        step: "৪",
        title: "ডকুমেন্ট জমা",
        description: "যাচাইয়ের জন্য সমস্ত প্রয়োজনীয় ডকুমেন্ট জমা দিন",
        duration: "১ সপ্তাহ",
        color: "orange",
        requirements: [
          "জন্ম সনদ",
          "একাডেমিক সনদপত্র",
          "চিকিৎসা সনদপত্র"
        ]
      },
      {
        step: "৫",
        title: "ফি প্রদান এবং ভর্তি",
        description: "পেমেন্ট সম্পূর্ণ করে ভর্তি চূড়ান্ত করুন",
        duration: "১-২ দিন",
        color: "red",
        requirements: [
          "ফি প্রদান সম্পূর্ণ",
          "ভর্তি ফর্ম স্বাক্ষর",
          "স্বাগত কিট বিতরণ"
        ]
      }
    ],
    requirements: {
      level1: {
        age: "৬ বছরের নিচে",
        academic: [
          "মৌলিক বর্ণ চিনতে পারা",
          "সহজ গণনা দক্ষতা",
          "মৌলিক ইসলামিক বাক্যাংশ"
        ],
        documents: [
          "জন্ম সনদ",
          "২ কপি পাসপোর্ট সাইজ ছবি",
          "অভিভাবকের আইডি কপি"
        ]
      },
      level2: {
        age: "৯ বছরের নিচে",
        academic: [
          "মৌলিক পড়া এবং লেখা",
          "সহজ গণিত",
          "মৌলিক ইসলামিক জ্ঞান"
        ],
        documents: [
          "জন্ম সনদ",
          "পূর্ববর্তী স্কুলের সনদপত্র",
          "২ কপি পাসপোর্ট সাইজ ছবি",
          "চিকিৎসা সনদপত্র"
        ]
      },
      level3: {
        age: "১২ বছরের নিচে",
        academic: [
          "পড়া এবং লেখা দক্ষতা",
          "মৌলিক গণিত",
          "ইসলামিক স্টাডিজের ভিত্তি"
        ],
        documents: [
          "জন্ম সনদ",
          "পূর্ববর্তী স্কুলের সনদপত্র",
          "২ কপি পাসপোর্ট সাইজ ছবি",
          "চিকিৎসা সনদপত্র",
          "বাড়ির রেজিস্ট্রেশন"
        ]
      },
      huffaz: {
        age: "১২ বছরের নিচে",
        academic: [
          "সম্পূর্ণ কুরআন মুখস্থ (হাফিজ)",
          "মৌলিক ইসলামিক শিক্ষা",
          "আরবি ভাষা দক্ষতা"
        ],
        documents: [
          "জন্ম সনদ",
          "হাফিজ সনদপত্র",
          "পূর্ববর্তী স্কুলের সনদপত্র",
          "২ কপি পাসপোর্ট সাইজ ছবি",
          "চিকিৎসা সনদপত্র"
        ]
      }
    },
    feeStructure: {
      oneTime: [
        { name: "ভর্তি ফি", amount: "৳৩০,০০০" },
        { name: "সেশন ফি", amount: "৳২৫,০০০" }
      ],
      monthly: {
        tuition: [
          { name: "লেভেল ১-২", amount: "৳২,০০০" },
          { name: "লেভেল ৩", amount: "৳২,৫০০" },
          { name: "হুফ্ফাজ", amount: "৳৩,০০০" }
        ],
        residential: [
          { name: "স্ট্যান্ডার্ড রুম", amount: "৳৩,৫০০" },
          { name: "প্রিমিয়াম রুম", amount: "৳৫,০০০" },
          { name: "ভিআইপি রুম", amount: "৳১৫,০০০" }
        ],
        food: [
          { name: "বেসিক প্যাকেজ", amount: "৳৯,০০০" },
          { name: "স্ট্যান্ডার্ড প্যাকেজ", amount: "৳১২,০০০" },
          { name: "প্রিমিয়াম প্যাকেজ", amount: "৳১৫,০০০" }
        ]
      }
    },
    importantDates: [
      {
        event: "আবেদন শুরু",
        date: "জানুয়ারি ১, ২০২৪",
        status: "open"
      },
      {
        event: "ভর্তি পরীক্ষা",
        date: "জানুয়ারি ১৫, ২০২৪",
        status: "upcoming"
      },
      {
        event: "ফলাফল ঘোষণা",
        date: "জানুয়ারি ২০, ২০২৪",
        status: "upcoming"
      },
      {
        event: "ক্লাস শুরু",
        date: "ফেব্রুয়ারি ১, ২০২৪",
        status: "upcoming"
      }
    ],
    contact: {
      phone: ["+8801407046001", "+8801407046002", "+8801407046003"],
      email: "info@manzilinstitute.edu.bd",
      address: "হারুনুর রশিদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা-১৩৬২",
      officeHours: "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০"
    }
  }
};

// Function to get data based on language
const getMockAdmissionData = (language = 'en') => {
  return admissionData[language] || admissionData.en;
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// Curriculum data
const curriculumData = {
  en: {
    overview: {
      totalLevels: 6,
      levelsLabel: "Levels",
      totalYears: 22,
      yearsLabel: "Years",
      ageRange: "4-25",
      ageRangeLabel: "Years",
      streamsLabel: "Streams"
    },
    sectionTitles: {
      curriculumLevels: "Curriculum Levels",
      specialPrograms: "Special Programs",
      ctaTitle: "Ready to Join Our Educational Journey?",
      ctaDescription: "Start your comprehensive Islamic and modern education today",
      contactButton: "Apply Now",
      downloadButton: "Download Brochure"
    },
    levels: [
      {
        level: "Level 1",
        title: "Foundation (4-8 Years)",
        age: "4-8 Years",
        duration: "5 Years",
        color: "blue",
        icon: "Star",
        madrasaLabel: "Madrasa",
        generalLabel: "General",
        technicalLabel: "Technical",
        description: "Building strong foundations in Islamic and basic education",
        subjects: {
          madrasa: ["Qaida & Nazira", "Basic Islamic Phrases", "Quran Memorization (Partial)", "Islamic Manners"],
          general: ["English Alphabet", "Basic Mathematics", "Bangla Language", "Environmental Studies"],
          technical: ["Computer Basics", "Art & Craft", "Music & Movement", "Basic Science Experiments"]
        }
      },
      {
        level: "Level 2",
        title: "Intermediate (9-13 Years)",
        age: "9-13 Years",
        duration: "5 Years",
        color: "green",
        icon: "Users",
        madrasaLabel: "Madrasa",
        generalLabel: "General",
        technicalLabel: "Technical",
        description: "Comprehensive development with Quran memorization and academic excellence",
        subjects: {
          madrasa: ["Complete Quran Memorization", "Tajweed Rules", "Hadith Studies", "Islamic History"],
          general: ["English Language", "Mathematics", "Science", "Social Studies", "Bangla Literature"],
          technical: ["Computer Applications", "Basic Programming", "Digital Art", "Robotics Introduction"]
        }
      },
      {
        level: "Level 3",
        title: "Secondary (14-15 Years)",
        age: "14-15 Years",
        duration: "2 Years",
        color: "purple",
        icon: "GraduationCap",
        madrasaLabel: "Madrasa",
        generalLabel: "General",
        technicalLabel: "Technical",
        description: "Advanced studies preparing for higher education and specialization",
        subjects: {
          madrasa: ["Dars-e-Nizami", "Arabic Literature", "Fiqh & Usul", "Islamic Philosophy"],
          general: ["English Literature", "Advanced Mathematics", "Physics/Chemistry", "History/Geography"],
          technical: ["Web Development", "Graphic Design", "Electronics", "Advanced Programming"]
        }
      },
      {
        level: "Level 4",
        title: "Higher Secondary (16-17 Years)",
        age: "16-17 Years",
        duration: "2 Years",
        color: "orange",
        icon: "BookText",
        madrasaLabel: "Madrasa",
        generalLabel: "General",
        technicalLabel: "Technical",
        description: "Specialized education leading to professional qualifications",
        subjects: {
          madrasa: ["Advanced Fiqh", "Tafsir Studies", "Islamic Economics", "Arabic Rhetoric"],
          general: ["O-Level Subjects", "Pre-University Math", "Biology/Computer Science", "Business Studies"],
          technical: ["Software Engineering", "Network Administration", "Digital Marketing", "AI & Machine Learning"]
        }
      },
      {
        level: "Level 5",
        title: "Undergraduate (18-21 Years)",
        age: "18-21 Years",
        duration: "4 Years",
        color: "red",
        icon: "Layers",
        madrasaLabel: "Madrasa",
        generalLabel: "General",
        technicalLabel: "Technical",
        description: "University-level education with professional training",
        subjects: {
          madrasa: ["Takhasus Programs", "Research Methodology", "Islamic Jurisprudence", "Comparative Religion"],
          general: ["Bachelor Degrees", "Literature & Humanities", "Social Sciences", "Natural Sciences"],
          technical: ["Engineering Programs", "IT Certifications", "Business Administration", "Medical Technology"]
        }
      },
      {
        level: "Level 6",
        title: "Postgraduate (22-25 Years)",
        age: "22-25 Years",
        duration: "4 Years",
        color: "indigo",
        icon: "Star",
        madrasaLabel: "Madrasa",
        generalLabel: "General",
        technicalLabel: "Technical",
        description: "Advanced specialization and professional excellence",
        subjects: {
          madrasa: ["Doctorate in Islamic Studies", "Advanced Research", "Islamic Leadership", "Interfaith Studies"],
          general: ["Master's Programs", "PhD Research", "Professional Certifications", "Academic Research"],
          technical: ["Specialized Engineering", "Advanced Technology", "Innovation & Research", "Entrepreneurship"]
        }
      }
    ],
    specialPrograms: [
      {
        title: "Hifz Program",
        duration: "3-5 Years",
        color: "blue",
        description: "Complete Quran memorization with proper Tajweed and understanding",
        features: [
          "Complete Quran Memorization",
          "Tajweed Mastery",
          "Meaning & Tafsir",
          "Islamic Character Development"
        ]
      },
      {
        title: "Alim Course",
        duration: "8 Years",
        color: "green",
        description: "Traditional Islamic scholarship program equivalent to Master's degree",
        features: [
          "Complete Dars-e-Nizami",
          "Arabic Language Mastery",
          "Islamic Sciences",
          "Teaching Certification"
        ]
      },
      {
        title: "Technical Excellence",
        duration: "4-6 Years",
        color: "purple",
        description: "Modern technical education integrated with Islamic values",
        features: [
          "Industry Certifications",
          "Practical Training",
          "Innovation Projects",
          "Entrepreneurship Skills"
        ]
      }
    ]
  },
  bn: {
    overview: {
      totalLevels: 6,
      levelsLabel: "লেভেল",
      totalYears: 22,
      yearsLabel: "বছর",
      ageRange: "৪-২৫",
      ageRangeLabel: "বছর",
      streamsLabel: "স্ট্রিম"
    },
    sectionTitles: {
      curriculumLevels: "কারিকুলাম লেভেলসমূহ",
      specialPrograms: "বিশেষ প্রোগ্রামসমূহ",
      ctaTitle: "আমাদের শিক্ষা যাত্রায় যোগ দিতে প্রস্তুত?",
      ctaDescription: "আজই আপনার ব্যাপক ইসলামিক এবং আধুনিক শিক্ষা শুরু করুন",
      contactButton: "এখনই আবেদন করুন",
      downloadButton: "ব্রোশার ডাউনলোড"
    },
    levels: [
      {
        level: "লেভেল ১",
        title: "ভিত্তি (৪-৮ বছর)",
        age: "৪-৮ বছর",
        duration: "৫ বছর",
        color: "blue",
        madrasaLabel: "মাদরাসা",
        generalLabel: "জেনারেল",
        technicalLabel: "কারিগরি",
        description: "ইসলামিক এবং মৌলিক শিক্ষায় শক্ত ভিত্তি নির্মাণ",
        subjects: {
          madrasa: ["কায়েদা ও নাজেরা", "মৌলিক ইসলামিক বাক্যাংশ", "কুরআন মুখস্থ (আংশিক)", "ইসলামিক আচরণ"],
          general: ["ইংলিশ বর্ণমালা", "মৌলিক গণিত", "বাংলা ভাষা", "পরিবেশ বিদ্যা"],
          technical: ["কম্পিউটারের মৌলিক", "আর্ট এবং ক্রাফ্ট", "সংগীত এবং আন্দোলন", "মৌলিক বিজ্ঞান পরীক্ষা"]
        }
      },
      {
        level: "লেভেল ২",
        title: "মধ্যবর্তী (৯-১৩ বছর)",
        age: "৯-১৩ বছর",
        duration: "৫ বছর",
        color: "green",
        madrasaLabel: "মাদরাসা",
        generalLabel: "জেনারেল",
        technicalLabel: "কারিগরি",
        description: "কুরআন মুখস্থ এবং একাডেমিক উৎকর্ষতার সাথে ব্যাপক উন্নয়ন",
        subjects: {
          madrasa: ["সম্পূর্ণ কুরআন মুখস্থ", "তাজভিদের নিয়ম", "হাদিস অধ্যয়ন", "ইসলামিক ইতিহাস"],
          general: ["ইংলিশ ভাষা", "গণিত", "বিজ্ঞান", "সামাজিক বিদ্যা", "বাংলা সাহিত্য"],
          technical: ["কম্পিউটার অ্যাপ্লিকেশন", "মৌলিক প্রোগ্রামিং", "ডিজিটাল আর্ট", "রোবোটিক্স পরিচিতি"]
        }
      },
      {
        level: "লেভেল ৩",
        title: "মাধ্যমিক (১৪-১৫ বছর)",
        age: "১৪-১৫ বছর",
        duration: "২ বছর",
        color: "purple",
        madrasaLabel: "মাদরাসা",
        generalLabel: "জেনারেল",
        technicalLabel: "কারিগরি",
        description: "উচ্চতর শিক্ষা এবং বিশেষায়নের জন্য প্রস্তুতি",
        subjects: {
          madrasa: ["দরসে নিজামী", "আরবি সাহিত্য", "ফিকহ ও উসুল", "ইসলামিক দর্শন"],
          general: ["ইংলিশ সাহিত্য", "উন্নত গণিত", "পদার্থ/রসায়ন", "ইতিহাস/ভূগোল"],
          technical: ["ওয়েব ডেভেলপমেন্ট", "গ্রাফিক ডিজাইন", "ইলেকট্রনিক্স", "উন্নত প্রোগ্রামিং"]
        }
      },
      {
        level: "লেভেল ৪",
        title: "উচ্চ মাধ্যমিক (১৬-১৭ বছর)",
        age: "১৬-১৭ বছর",
        duration: "২ বছর",
        color: "orange",
        madrasaLabel: "মাদরাসা",
        generalLabel: "জেনারেল",
        technicalLabel: "কারিগরি",
        description: "পেশাগত যোগ্যতার দিকে নিয়ে যাওয়া বিশেষায়িত শিক্ষা",
        subjects: {
          madrasa: ["উন্নত ফিকহ", "তাফসীর অধ্যয়ন", "ইসলামিক অর্থনীতি", "আরবি বাগ্মিতা"],
          general: ["O-লেভেল বিষয়", "প্রি-ইউনিভার্সিটি গণিত", "জীববিজ্ঞান/কম্পিউটার সাইন্স", "ব্যবসায় অধ্যয়ন"],
          technical: ["সফ্টওয়্যার ইঞ্জিনিয়ারিং", "নেটওয়ার্ক অ্যাডমিনিস্ট্রেশন", "ডিজিটাল মার্কেটিং", "AI এবং মেশিন লার্নিং"]
        }
      },
      {
        level: "লেভেল ৫",
        title: "স্নাতক (১৮-২১ বছর)",
        age: "১৮-২১ বছর",
        duration: "৪ বছর",
        color: "red",
        madrasaLabel: "মাদরাসা",
        generalLabel: "জেনারেল",
        technicalLabel: "কারিগরি",
        description: "পেশাগত প্রশিক্ষণের সাথে বিশ্ববিদ্যালয়-স্তরের শিক্ষা",
        subjects: {
          madrasa: ["তখাসুস প্রোগ্রাম", "গবেষণা পদ্ধতি", "ইসলামিক জুরিসপ্রুডেন্স", "তুলনামূলক ধর্ম"],
          general: ["স্নাতক ডিগ্রি", "সাহিত্য ও মানবিক", "সামাজিক বিজ্ঞান", "প্রাকৃতিক বিজ্ঞান"],
          technical: ["ইঞ্জিনিয়ারিং প্রোগ্রাম", "আইটি সার্টিফিকেশন", "ব্যবসায় প্রশাসন", "চিকিৎসা প্রযুক্তি"]
        }
      },
      {
        level: "লেভেল ৬",
        title: "স্নাতকোত্তর (২২-২৫ বছর)",
        age: "২২-২৫ বছর",
        duration: "৪ বছর",
        color: "indigo",
        madrasaLabel: "মাদরাসা",
        generalLabel: "জেনারেল",
        technicalLabel: "কারিগরি",
        description: "উন্নত বিশেষায়ন এবং পেশাগত উৎকর্ষতা",
        subjects: {
          madrasa: ["ইসলামিক স্টাডিজে ডক্টরেট", "উন্নত গবেষণা", "ইসলামিক নেতৃত্ব", "আন্তঃধর্মীয় অধ্যয়ন"],
          general: ["মাস্টার্স প্রোগ্রাম", "পিএইচডি গবেষণা", "পেশাগত সার্টিফিকেশন", "একাডেমিক গবেষণা"],
          technical: ["বিশেষায়িত ইঞ্জিনিয়ারিং", "উন্নত প্রযুক্তি", "উদ্ভাবন ও গবেষণা", "উদ্যোক্তা"]
        }
      }
    ],
    specialPrograms: [
      {
        title: "হিফজ প্রোগ্রাম",
        duration: "৩-৫ বছর",
        color: "blue",
        description: "সঠিক তাজভিদ এবং বোঝার সাথে সম্পূর্ণ কুরআন মুখস্থ",
        features: [
          "সম্পূর্ণ কুরআন মুখস্থ",
          "তাজভিদ দক্ষতা",
          "অর্থ এবং তাফসীর",
          "ইসলামিক চরিত্র উন্নয়ন"
        ]
      },
      {
        title: "আলিম কোর্স",
        duration: "৮ বছর",
        color: "green",
        description: "মাস্টার্স ডিগ্রির সমতুল্য ঐতিহ্যবাহী ইসলামিক পণ্ডিত প্রোগ্রাম",
        features: [
          "সম্পূর্ণ দরসে নিজামী",
          "আরবি ভাষা দক্ষতা",
          "ইসলামিক বিজ্ঞান",
          "শিক্ষকতা সার্টিফিকেশন"
        ]
      },
      {
        title: "কারিগরি উৎকর্ষতা",
        duration: "৪-৬ বছর",
        color: "purple",
        description: "ইসলামিক মূল্যবোধের সাথে আধুনিক কারিগরি শিক্ষা",
        features: [
          "শিল্প সার্টিফিকেশন",
          "ব্যবহারিক প্রশিক্ষণ",
          "উদ্ভাবন প্রকল্প",
          "উদ্যোক্তা দক্ষতা"
        ]
      }
    ]
  }
};

// Function to get curriculum data based on language
const getStaticCurriculumData = (language = 'en') => {
  return curriculumData[language] || curriculumData.en;
};

// Curriculum data hook
export function useCurriculumData(language = 'en') {
  return useQuery({
    queryKey: ['curriculum', language],
    queryFn: async () => {
      await delay(100); // Reduced delay for faster loading
      return getStaticCurriculumData(language);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: getStaticCurriculumData(language), // Provide initial data immediately
  });
}

export function usePrefetchAdmissionData() {
  // This would prefetch data in a parent component
  // For now, just return a function that does nothing
  return () => {
    // Prefetch logic would go here
  };
}