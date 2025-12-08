export default function PageStructuredData({
  seoDataEn,
  seoDataBn,
  coursesDataEn,
  coursesDataBn,
  organizationDataEn,
  organizationDataBn,
}) {
  return null; // This component doesn't render anything, just provides structured data
}

// Export the data for use in metadata
export const getPageStructuredData = () => ({
  seoDataEn: {
    title:
      'Manzil Institute - Quality Islamic Education | MIC Curriculum Bangladesh | Future Leaders',
    description:
      'Manzil Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.',
    keywords: [
      'Manzil Institute',
      'MIC Curriculum Bangladesh',
      'Madrasa Education',
      'General Education',
      'Technical Education',
      'Islamic Education Bangladesh',
      'Manzil International Institute admission',
      'Quran education',
      'Hadith studies',
      'Islamic values',
      'Character development',
      'Future leader training',
      'Bangladesh Islamic school',
      'Integrated education Bangladesh',
      'Religious education Bangladesh',
      'Modern Islamic curriculum',
    ],
    url: 'https://institute.manzilgroupbd.com',
    image: 'https://institute.manzilgroupbd.com/manzil-institute.png',
  },

  seoDataBn: {
    title:
      'মানজিল ইনস্টিটিউট - মানসম্পন্ন ইসলামিক শিক্ষা | এমআইসি কারিকুলাম বাংলাদেশ | ভবিষ্যত নেতৃত্ব',
    description:
      'মানজিল ইনস্টিটিউট বাংলাদেশে একীভূত এমআইসি কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং কারিগরি শিক্ষা প্রদান করে। কুরআন, হাদিস, আধুনিক একাডেমিক এবং কারিগরি দক্ষতার সাথে ভবিষ্যত নেতৃত্ব গঠনের জন্য ব্যাপক ইসলামিক শিক্ষা।',
    keywords: [
      'মানজিল ইনস্টিটিউট',
      'এমআইসি কারিকুলাম বাংলাদেশ',
      'মাদ্রাসা শিক্ষা',
      'সাধারণ শিক্ষা',
      'কারিগরি শিক্ষা',
      'ইসলামিক শিক্ষা বাংলাদেশ',
      'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট ভর্তি',
      'কুরআন শিক্ষা',
      'হাদিস অধ্যয়ন',
      'ইসলামিক মূল্যবোধ',
      'চরিত্র উন্নয়ন',
      'ভবিষ্যত নেতা প্রশিক্ষণ',
      'বাংলাদেশ ইসলামিক স্কুল',
      'একীভূত শিক্ষা বাংলাদেশ',
      'ধর্মীয় শিক্ষা বাংলাদেশ',
      'আধুনিক ইসলামিক কারিকুলাম',
    ],
    url: 'https://institute.manzilgroupbd.com',
    image: 'https://institute.manzilgroupbd.com/manzil-institute.png',
  },

  coursesDataEn: [
    {
      name: 'MIC Curriculum',
      description:
        'Comprehensive Islamic education curriculum combining traditional Islamic knowledge with modern educational standards',
      educationalLevel: 'Primary to Secondary',
      teaches: [
        'Quran Studies',
        'Hadith Studies',
        'Islamic Jurisprudence',
        'Arabic Language',
        'Modern Subjects',
      ],
      educationalUse: 'Islamic Education',
      timeRequired: 'P12Y',
    },
    {
      name: 'Madrasa Education',
      description:
        'Traditional Islamic religious education focusing on Quran, Hadith, and Islamic sciences',
      educationalLevel: 'Primary to Higher Secondary',
      teaches: [
        'Quran Memorization',
        'Tafsir',
        'Hadith',
        'Fiqh',
        'Islamic History',
      ],
      educationalUse: 'Religious Education',
      timeRequired: 'P12Y',
    },
    {
      name: 'General Education',
      description:
        'Standard academic curriculum following national education standards with Islamic values integration',
      educationalLevel: 'Primary to Secondary',
      teaches: [
        'Mathematics',
        'Science',
        'English',
        'Bangla',
        'Social Studies',
      ],
      educationalUse: 'Academic Education',
      timeRequired: 'P12Y',
    },
    {
      name: 'Technical Education',
      description:
        'Vocational and technical skills training combined with Islamic character development',
      educationalLevel: 'Secondary',
      teaches: [
        'Computer Science',
        'Robotics',
        'Technical Drawing',
        'Vocational Skills',
      ],
      educationalUse: 'Technical Education',
      timeRequired: 'P4Y',
    },
  ],

  coursesDataBn: [
    {
      name: 'এমআইসি কারিকুলাম',
      description:
        'প্রথাগত ইসলামিক জ্ঞান এবং আধুনিক শিক্ষা মানদণ্ডের সাথে ব্যাপক ইসলামিক শিক্ষা কারিকুলাম',
      educationalLevel: 'প্রাথমিক থেকে মাধ্যমিক',
      teaches: [
        'কুরআন অধ্যয়ন',
        'হাদিস অধ্যয়ন',
        'ইসলামিক আইনশাস্ত্র',
        'আরবি ভাষা',
        'আধুনিক বিষয়সমূহ',
      ],
      educationalUse: 'ইসলামিক শিক্ষা',
      timeRequired: 'P12Y',
    },
    {
      name: 'মাদ্রাসা শিক্ষা',
      description:
        'কুরআন, হাদিস এবং ইসলামিক বিজ্ঞানে ফোকাস করে প্রথাগত ইসলামিক ধর্মীয় শিক্ষা',
      educationalLevel: 'প্রাথমিক থেকে উচ্চ মাধ্যমিক',
      teaches: ['কুরআন মুখস্থকরণ', 'তাফসির', 'হাদিস', 'ফিকহ', 'ইসলামিক ইতিহাস'],
      educationalUse: 'ধর্মীয় শিক্ষা',
      timeRequired: 'P12Y',
    },
    {
      name: 'সাধারণ শিক্ষা',
      description:
        'ইসলামিক মূল্যবোধের সাথে জাতীয় শিক্ষা মানদণ্ড অনুসরণ করে স্ট্যান্ডার্ড একাডেমিক কারিকুলাম',
      educationalLevel: 'প্রাথমিক থেকে মাধ্যমিক',
      teaches: ['গণিত', 'বিজ্ঞান', 'ইংরেজি', 'বাংলা', 'সামাজিক বিজ্ঞান'],
      educationalUse: 'একাডেমিক শিক্ষা',
      timeRequired: 'P12Y',
    },
    {
      name: 'কারিগরি শিক্ষা',
      description:
        'ইসলামিক চরিত্র উন্নয়নের সাথে বৃত্তিমূলক এবং কারিগরি দক্ষতা প্রশিক্ষণ',
      educationalLevel: 'মাধ্যমিক',
      teaches: [
        'কম্পিউটার বিজ্ঞান',
        'রোবোটিক্স',
        'কারিগরি অঙ্কন',
        'বৃত্তিমূলক দক্ষতা',
      ],
      educationalUse: 'কারিগরি শিক্ষা',
      timeRequired: 'P4Y',
    },
  ],

  organizationDataEn: {
    name: 'Manzil International Institute',
    alternateName: 'MIC Institute',
    description:
      'Manzil International Institute offers integrated MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Comprehensive Islamic education for building future leaders with Quran, Hadith, modern academics & technical skills.',
    url: 'https://institute.manzilgroupbd.com',
    logo: 'https://institute.manzilgroupbd.com/manzil-institute.png',
    sameAs: [
      'https://www.facebook.com/manzilinstitute',
      'https://www.instagram.com/manzilinstitute',
      'https://www.linkedin.com/company/manzil-institute',
    ],
    address: {
      streetAddress:
        'Harunur Rashid Tower (10 Storied Building), House #91, Road #2',
      addressLocality: 'North Rayarbagh Bus Stand, Jatrabari',
      addressRegion: 'Dhaka',
      postalCode: '1362',
      addressCountry: 'BD',
    },
    contactPoint: [
      {
        telephone: '+8801407046001',
        contactType: 'admissions',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
      {
        telephone: '+8801407046002',
        contactType: 'general',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
      {
        telephone: '+8801407046003',
        contactType: 'technical support',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
    ],
    email: 'info@manzilinstitute.edu.bd',
    foundingDate: '2020',
    educationalCredentialAwarded: [
      'MIC Certificate',
      'Madrasa Certificate',
      'General Education Certificate',
      'Technical Education Certificate',
    ],
    hasEducationalUse: [
      'Islamic Education',
      'Character Development',
      'Modern Academic Education',
      'Technical Skills Training',
    ],
    knowsAbout: [
      'Quran Education',
      'Hadith Studies',
      'Islamic Jurisprudence',
      'Arabic Language',
      'Modern Subjects',
      'Computer Science',
      'Robotics',
      'Sports Training',
    ],
    areaServed: 'Bangladesh',
    priceRange: '$$',
  },

  organizationDataBn: {
    name: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট',
    alternateName: 'এমআইসি ইনস্টিটিউট',
    description:
      'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট বাংলাদেশে একীভূত এমআইসি কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং কারিগরি শিক্ষা প্রদান করে। কুরআন, হাদিস, আধুনিক একাডেমিক এবং কারিগরি দক্ষতার সাথে ভবিষ্যত নেতৃত্ব গঠনের জন্য ব্যাপক ইসলামিক শিক্ষা।',
    url: 'https://institute.manzilgroupbd.com',
    logo: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png',
    sameAs: [
      'https://www.facebook.com/manzilinstitute',
      'https://www.instagram.com/manzilinstitute',
      'https://www.linkedin.com/company/manzil-institute',
    ],
    address: {
      streetAddress: 'হারুনুর রশিদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২',
      addressLocality: 'উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী',
      addressRegion: 'ঢাকা',
      postalCode: '১৩৬২',
      addressCountry: 'BD',
    },
    contactPoint: [
      {
        telephone: '+8801407046001',
        contactType: 'admissions',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
      {
        telephone: '+8801407046002',
        contactType: 'general',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
      {
        telephone: '+8801407046003',
        contactType: 'technical support',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
    ],
    email: 'info@manzilinstitute.edu.bd',
    foundingDate: '2020',
    educationalCredentialAwarded: [
      'এমআইসি সার্টিফিকেট',
      'মাদ্রাসা সার্টিফিকেট',
      'সাধারণ শিক্ষা সার্টিফিকেট',
      'কারিগরি শিক্ষা সার্টিফিকেট',
    ],
    hasEducationalUse: [
      'ইসলামিক শিক্ষা',
      'চরিত্র উন্নয়ন',
      'আধুনিক একাডেমিক শিক্ষা',
      'কারিগরি দক্ষতা প্রশিক্ষণ',
    ],
    knowsAbout: [
      'কুরআন শিক্ষা',
      'হাদিস অধ্যয়ন',
      'ইসলামিক আইনশাস্ত্র',
      'আরবি ভাষা',
      'আধুনিক বিষয়সমূহ',
      'কম্পিউটার বিজ্ঞান',
      'রোবোটিক্স',
      'খেলাধুলা প্রশিক্ষণ',
    ],
    areaServed: 'বাংলাদেশ',
    priceRange: '$$',
  },
});
