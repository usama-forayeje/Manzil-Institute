import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query keys for consistent cache management
export const queryKeys = {
  admission: ['admission'],
  curriculum: ['curriculum'],
}

// Static curriculum data
export const getStaticCurriculumData = (language = 'en') => ({
  overview: {
    totalLevels: language === "bn" ? "৬ লেভেল" : 6,
    totalYears: language === "bn" ? "২২ বছর" : 22,
    ageRange: language === "bn" ? "৪-২৫ বছর" : "4-25 Years",
    streams: language === "bn" ? ["মাদরাসা", "জেনারেল", "কারিগরি"] : ["Madrasa", "General", "Technical"],
    levelsLabel: language === "bn" ? "লেভেল" : "Levels",
    yearsLabel: language === "bn" ? "বছর" : "Years",
    ageRangeLabel: language === "bn" ? "বয়সসীমা" : "Age Range",
    streamsLabel: language === "bn" ? "শিক্ষা ধারা" : "Education Streams"
  },
  levels: [
    {
      level: language === "bn" ? "লেভেল ১" : "Level 1",
      title: language === "bn" ? "মৌলিক শিক্ষার ভিত্তি" : "Foundation of Basic Education",
      age: language === "bn" ? "৪-৮ বছর" : "4-8 Years",
      duration: language === "bn" ? "৫ বছর" : "5 Years",
      color: "blue",
      description: language === "bn" ? "প্রাথমিক শিক্ষার ভিত্তি প্রস্তুত ও মূল্যবোধ গঠন" : "Preparation of basic education foundation and value building",
      subjects: {
        madrasa: language === "bn"
          ? ["কায়েদা ও নাযেরা", "বাংলা-ইংরেজি-আরবি বর্ণমালা", "প্রাথমিক দুআ ও সুরা"]
          : ["Qaida & Nazira", "Bengali-English-Arabic Alphabets", "Basic Duas & Surahs"],
        general: language === "bn"
          ? ["IPC কারিকুলাম", "বেসিক গণিত", "বাংলা ও ইংরেজি ভাষা"]
          : ["IPC Curriculum", "Basic Mathematics", "Bengali & English Language"],
        technical: language === "bn"
          ? ["কম্পিউটার পরিচিতি", "হাতের লেখা", "অঙ্কন"]
          : ["Computer Basics", "Handwriting", "Drawing"]
      },
      madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
      generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
      technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
    },
    {
      level: language === "bn" ? "লেভেল ২" : "Level 2",
      title: language === "bn" ? "হিফজ ও মৌলিক শিক্ষা" : "Hifz & Basic Education",
      age: language === "bn" ? "৯-১৩ বছর" : "9-13 Years",
      duration: language === "bn" ? "৫ বছর" : "5 Years",
      color: "orange",
      description: language === "bn" ? "হিফজুল কুরআন ও মৌলিক শিক্ষার সমন্বয়" : "Integration of Quran Memorization and Basic Education",
      subjects: {
        madrasa: language === "bn"
          ? ["হিফজুল কুরআন", "তাজভিদ শিক্ষা", "নুরানি কায়েদা"]
          : ["Quran Memorization", "Tajweed Education", "Noorani Qaida"],
        general: language === "bn"
          ? ["IMYC কারিকুলাম", "O-Level প্রস্তুতি", "বিজ্ঞান ও গণিত"]
          : ["IMYC Curriculum", "O-Level Preparation", "Science & Mathematics"],
        technical: language === "bn"
          ? ["গ্রাফিক্স ডিজাইন", "রান্না প্রশিক্ষণ", "সেলাই প্রশিক্ষণ"]
          : ["Graphics Design", "Cooking Training", "Sewing Training"]
      },
      madrasaLabel: language === "bn" ? "মাদরাসা শিক্ষা" : "Madrasa Education",
      generalLabel: language === "bn" ? "জেনারেল শিক্ষা" : "General Education",
      technicalLabel: language === "bn" ? "কারিগরি শিক্ষা" : "Technical Education"
    }
  ],
  specialPrograms: [
    {
      title: language === "bn" ? "হুফ্ফাজ এডুকেশন সিস্টেম" : "Huffaz Education System",
      description: language === "bn" ? "হাফেজ শিক্ষার্থীদের জন্য বিশেষায়িত কারিকুলাম" : "Specialized curriculum for Hafiz students",
      duration: language === "bn" ? "১৪ বছর" : "14 Years",
      features: language === "bn"
        ? ["হিফজ রিভিশন", "দরসে নিজামী", "আন্তর্জাতিক শিক্ষা", "কারিগরি প্রশিক্ষণ"]
        : ["Hifz Revision", "Dars-e-Nizami", "International Education", "Technical Training"],
      color: "orange"
    }
  ],
  sectionTitles: {
    curriculumLevels: language === "bn" ? "কারিকুলাম লেভেল সমূহ" : "Curriculum Levels",
    specialPrograms: language === "bn" ? "বিশেষ কার্যক্রম" : "Special Programs",
    ctaTitle: language === "bn" ? "আপনার সন্তানের ভবিষ্যত গড়তে আজই যোগাযোগ করুন" : "Contact today to build your child's future",
    ctaDescription: language === "bn" ? "আমাদের কারিকুলাম সম্পর্কে বিস্তারিত জানতে এবং ভর্তি প্রক্রিয়া শুরু করতে" : "To learn more about our curriculum and start the admission process",
    contactButton: language === "bn" ? "ভর্তির জন্য যোগাযোগ" : "Contact for Admission",
    downloadButton: language === "bn" ? "ব্রোশার ডাউনলোড" : "Download Brochure"
  }
})

// Static admission data
export const getStaticAdmissionData = (language = 'en') => ({
  overview: {
    title: language === 'bn' ? "ভর্তি প্রক্রিয়া" : "Admission Process",
    description: language === 'bn'
      ? "মানযিল ইনস্টিটিউটে ভর্তি সম্পর্কিত সম্পূর্ণ তথ্য"
      : "Complete information about admission at Manzil Institute",
  },
  process: [
    {
      step: 1,
      title: language === 'bn' ? "অনলাইন আবেদন" : "Online Application",
      description: language === 'bn'
        ? "আমাদের ওয়েবসাইট থেকে ভর্তি ফরম পূরণ করুন"
        : "Fill out the admission form from our website",
      duration: language === 'bn' ? "২৪ ঘন্টা" : "24 Hours",
      requirements: language === 'bn'
        ? ["অনলাইন ফরম পূরণ", "প্রয়োজনীয় ডকুমেন্ট আপলোড"]
        : ["Fill online form", "Upload required documents"],
      color: "blue"
    },
    {
      step: 2,
      title: language === 'bn' ? "ভর্তি পরীক্ষা" : "Admission Test",
      description: language === 'bn'
        ? "লেভেল অনুযায়ী ভর্তি পরীক্ষায় অংশগ্রহণ"
        : "Participate in admission test according to level",
      duration: language === 'bn' ? "৩ ঘন্টা" : "3 Hours",
      requirements: language === 'bn'
        ? ["লিখিত পরীক্ষা", "মৌখিক পরীক্ষা", "সাক্ষাৎকার"]
        : ["Written test", "Oral test", "Interview"],
      color: "orange"
    },
    {
      step: 3,
      title: language === 'bn' ? "মনোনয়ন ও নির্বাচন" : "Nomination & Selection",
      description: language === 'bn'
        ? "পরীক্ষার ফলাফল অনুযায়ী নির্বাচন প্রক্রিয়া"
        : "Selection process based on test results",
      duration: language === 'bn' ? "৪৮ ঘন্টা" : "48 Hours",
      requirements: language === 'bn'
        ? ["রেজাল্ট প্রকাশ", "মনোনয়ন লিস্ট", "সিলেকশন লেটার"]
        : ["Result publication", "Nomination list", "Selection letter"],
      color: "purple"
    },
    {
      step: 4,
      title: language === 'bn' ? "কাগজপত্র জমা ও ফি প্রদান" : "Document Submission & Fee Payment",
      description: language === 'bn'
        ? "সমস্ত প্রয়োজনীয় ডকুমেন্ট ও ফি জমাদান"
        : "Submit all required documents and fees",
      duration: language === 'bn' ? "৭ দিন" : "7 Days",
      requirements: language === 'bn'
        ? ["মূল ডকুমেন্ট verification", "ফি প্রদান", "আবাসিক সিট কনফার্ম"]
        : ["Original document verification", "Fee payment", "Hostel seat confirmation"],
      color: "green"
    },
    {
      step: 5,
      title: language === 'bn' ? "ক্লাস শুরু" : "Class Begins",
      description: language === 'bn'
        ? "নিয়মিত ক্লাস ও অ্যাকাডেমিক কার্যক্রম শুরু"
        : "Regular classes and academic activities begin",
      duration: language === 'bn' ? "পরবর্তী সেশন" : "Next Session",
      requirements: language === 'bn'
        ? ["ক্লাস রুটিন", "বই ও ইউনিফর্ম", "হোস্টেল বরাদ্দ"]
        : ["Class routine", "Books & uniform", "Hostel allocation"],
      color: "red"
    }
  ],
  requirements: {
    level1: {
      age: language === 'bn' ? "৬ বছর নিচে" : "Below 6 years",
      academic: language === 'bn'
        ? ["বর্ণমালা চিনতে পারা", "১-২০ পর্যন্ত সংখ্যা", "মৌলিক যোগ-বিয়োগ"]
        : ["Recognize alphabet", "Numbers 1-20", "Basic addition-subtraction"],
      documents: language === 'bn'
        ? ["জন্ম নিবন্ধন সনদ", "পাসপোর্ট সাইজ ছবি", "পূর্ববর্তী রিপোর্ট কার্ড"]
        : ["Birth certificate", "Passport size photo", "Previous report card"]
    },
    level2: {
      age: language === 'bn' ? "৯ বছর নিচে" : "Below 9 years",
      academic: language === 'bn'
        ? ["সহজ পড়া ও লেখা", "১-১২ পর্যন্ত নামতা", "যোগ-বিয়োগ-পূরণ"]
        : ["Simple reading & writing", "Multiplication table 1-12", "Addition-subtraction-fill"],
      documents: language === 'bn'
        ? ["জন্ম নিবন্ধন সনদ", "পাসপোর্ট সাইজ ছবি", "পূর্ববর্তী রিপোর্ট কার্ড", "মেডিকেল সার্টিফিকেট"]
        : ["Birth certificate", "Passport size photo", "Previous report card", "Medical certificate"]
    },
    level3: {
      age: language === 'bn' ? "১২ বছর নিচে" : "Below 12 years",
      academic: language === 'bn'
        ? ["রিডিং ও রাইটিং দক্ষতা", "ভাগ ও সরল অংক", "৮ম/৫ম শ্রেণীর যোগ্যতা"]
        : ["Reading & writing skills", "Division & simple math", "8th/5th grade qualification"],
      documents: language === 'bn'
        ? ["জন্ম নিবন্ধন সনদ", "পাসপোর্ট সাইজ ছবি", "সকল একাডেমিক সনদ", "মেডিকেল সার্টিফিকেট", "বাসার নিবন্ধন"]
        : ["Birth certificate", "Passport size photo", "All academic certificates", "Medical certificate", "House registration"]
    },
    huffaz: {
      age: language === 'bn' ? "১২ বছর নিচে" : "Below 12 years",
      academic: language === 'bn'
        ? ["হাফেজ হতে হবে", "৩য় শ্রেণীর যোগ্যতা", "মৌলিক পড়া-লেখা"]
        : ["Must be Hafiz", "3rd grade qualification", "Basic reading-writing"],
      documents: language === 'bn'
        ? ["হিফজ সনদ", "জন্ম নিবন্ধন সনদ", "পাসপোর্ট সাইজ ছবি", "সকল একাডেমিক সনদ"]
        : ["Hifz certificate", "Birth certificate", "Passport size photo", "All academic certificates"]
    }
  },
  feeStructure: {
    oneTime: [
      { name: language === 'bn' ? "ভর্তি ফরম" : "Admission Form", amount: language === 'bn' ? "৫০০ টাকা" : "500 BDT" },
      { name: language === 'bn' ? "নতুন ভর্তি ফি" : "New Admission Fee", amount: language === 'bn' ? "৩০,০০০ টাকা" : "30,000 BDT" },
      { name: language === 'bn' ? "সেশন ফি" : "Session Fee", amount: language === 'bn' ? "২৫,০০০ টাকা" : "25,000 BDT" },
      { name: language === 'bn' ? "ইনস্টলেশন ফি" : "Installation Fee", amount: language === 'bn' ? "১০,০০০ টাকা" : "10,000 BDT" },
      { name: language === 'bn' ? "একুমেন্ডেশন ফি" : "Accommodation Fee", amount: language === 'bn' ? "১০,০০০ টাকা" : "10,000 BDT" },
      { name: language === 'bn' ? "কার্ড, লকার, ড্রেস" : "Card, Locker, Dress", amount: language === 'bn' ? "৫,০০০ টাকা" : "5,000 BDT" },
      { name: language === 'bn' ? "বই ও স্টেশনারী" : "Books & Stationery", amount: language === 'bn' ? "৫,০০০ টাকা" : "5,000 BDT" }
    ],
    monthly: {
      tuition: [
        { name: language === 'bn' ? "দরসে নিজামী" : "Dars-e-Nizami", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "ন্যাশনাল কারিকুলাম" : "National Curriculum", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "ক্যামব্রীজ ইন্টারন্যাশনাল" : "Cambridge International", amount: language === 'bn' ? "৩,০০০ টাকা" : "3,000 BDT" },
        { name: language === 'bn' ? "নূরানি ও বেফাক কারিকুলাম" : "Noorani & Befaq Curriculum", amount: language === 'bn' ? "৩,০০০ টাকা" : "3,000 BDT" },
        { name: language === 'bn' ? "কর্মমুখী কার্যক্রম" : "Vocational Activities", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "বাস্তবমুখী কার্যক্রম" : "Practical Activities", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "কারিগরি শিক্ষা" : "Technical Education", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "কম্পিউটার শিক্ষা" : "Computer Education", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "ল্যাঙ্গুয়েজ কোর্স" : "Language Course", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" },
        { name: language === 'bn' ? "খেলাধুলা প্রশিক্ষণ" : "Sports Training", amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" }
      ],
      residential: [
        { name: language === 'bn' ? "ফ্লোর ভাড়া" : "Floor Rent", amount: language === 'bn' ? "৩,৫০০ টাকা" : "3,500 BDT" },
        { name: language === 'bn' ? "বিদ্যুৎ ও পানির বিল" : "Electricity & Water Bill", amount: language === 'bn' ? "১,৫০০ টাকা" : "1,500 BDT" }
      ],
      food: [
        { name: language === 'bn' ? "লেভেল-১ (নাস্তা ও খাবার)" : "Level-1 (Breakfast & Meal)", amount: language === 'bn' ? "৯,০০০ টাকা" : "9,000 BDT" },
        { name: language === 'bn' ? "লেভেল-২ (নাস্তা ও খাবার)" : "Level-2 (Breakfast & Meal)", amount: language === 'bn' ? "১২,০০০ টাকা" : "12,000 BDT" },
        { name: language === 'bn' ? "লেভেল-৩ (নাস্তা ও খাবার)" : "Level-3 (Breakfast & Meal)", amount: language === 'bn' ? "১৫,০০০ টাকা" : "15,000 BDT" },
        { name: language === 'bn' ? "হুফ্ফাজ সিস্টেম (নাস্তা ও খাবার)" : "Huffaz System (Breakfast & Meal)", amount: language === 'bn' ? "১৫,০০০ টাকা" : "15,000 BDT" }
      ]
    }
  },
  importantDates: [
    { event: language === 'bn' ? "ভর্তি আবেদন শুরু" : "Admission Application Starts", date: language === 'bn' ? "১লা জানুয়ারি ২০২৪" : "January 1, 2024", status: "open" },
    { event: language === 'bn' ? "ভর্তি পরীক্ষা" : "Admission Test", date: language === 'bn' ? "১৫ই জানুয়ারি ২০২৪" : "January 15, 2024", status: "upcoming" },
    { event: language === 'bn' ? "মনোনয়ন লিস্ট প্রকাশ" : "Nomination List Published", date: language === 'bn' ? "২০শে জানুয়ারি ২০২৪" : "January 20, 2024", status: "upcoming" },
    { event: language === 'bn' ? "কাগজপত্র জমার শেষ তারিখ" : "Last Date for Document Submission", date: language === 'bn' ? "৩১শে জানুয়ারি ২০২৪" : "January 31, 2024", status: "upcoming" },
    { event: language === 'bn' ? "ক্লাস শুরু" : "Classes Begin", date: language === 'bn' ? "১লা ফেব্রুয়ারি ২০২৪" : "February 1, 2024", status: "upcoming" }
  ],
  contact: {
    phone: ["০১৪০৭-০৪৬০০১", "০১৪০৭-০৪৬০০২", "০১৪০৭-০৪৬০০৩"],
    email: "admission@manzilinstitute.edu.bd",
    address: language === 'bn'
      ? "হারুনুর রশীদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা ১৩৬২"
      : "Harunur Rashid Tower (10 Storied Building), House #91, Road #2, North Rayarbagh Bus Stand, Jatrabari, Dhaka 1362",
    officeHours: language === 'bn'
      ? "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০"
      : "Saturday - Thursday: 9:00 AM - 5:00 PM"
  }
})

// Custom hook for admission data with error handling and loading states
export function useAdmissionData(language = 'en') {
  return useQuery({
    queryKey: [...queryKeys.admission, language],
    queryFn: async () => {
      try {
        // Return static data instead of server call
        return getStaticAdmissionData(language)
      } catch (error) {
        console.error('Error fetching admission data:', error)
        throw new Error('Failed to load admission information. Please try again later.')
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 2
    },
    meta: {
      errorMessage: 'Unable to load admission data',
    },
  })
}

// Custom hook for curriculum data with error handling and loading states
export function useCurriculumData(language = 'en') {
  return useQuery({
    queryKey: [...queryKeys.curriculum, language],
    queryFn: async () => {
      try {
        // Return static data with language support
        return getStaticCurriculumData(language)
      } catch (error) {
        console.error('Error fetching curriculum data:', error)
        throw new Error('Failed to load curriculum information. Please try again later.')
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (curriculum data changes less frequently)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 2
    },
    meta: {
      errorMessage: 'Unable to load curriculum data',
    },
  })
}

// Hook for prefetching data (useful for route loaders)
export function usePrefetchAdmissionData(language = 'en') {
  const queryClient = useQueryClient()

  const prefetch = async () => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.admission, language],
      queryFn: () => getStaticAdmissionData(language),
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetch }
}

export function usePrefetchCurriculumData(language = 'en') {
  const queryClient = useQueryClient()

  const prefetch = async () => {
    await queryClient.prefetchQuery({
      queryKey: [...queryKeys.curriculum, language],
      queryFn: () => getStaticCurriculumData(language),
      staleTime: 10 * 60 * 1000,
    })
  }

  return { prefetch }
}

// Mutation hook for admission form submissions with optimistic updates
export function useSubmitAdmissionForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData) => {
      // Simulate API call - replace with actual server function
      await new Promise(resolve => setTimeout(resolve, 1000))

      // For now, just return success
      return {
        success: true,
        message: 'Application submitted successfully',
        applicationId: Math.random().toString(36).substr(2, 9)
      }
    },
    onMutate: async (newApplication) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.admission })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKeys.admission)

      // Optimistically update to show loading state
      queryClient.setQueryData(queryKeys.admission, (old) => ({
        ...old,
        isSubmitting: true,
        lastSubmission: newApplication
      }))

      // Return a context object with the snapshotted value
      return { previousData }
    },
    onError: (err, newApplication, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.admission, context.previousData)
      }
    },
    onSuccess: (data, variables, context) => {
      // Update the cache with success state
      queryClient.setQueryData(queryKeys.admission, (old) => ({
        ...old,
        isSubmitting: false,
        lastSubmission: null,
        submissionResult: data
      }))

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admission })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.admission })
    },
  })
}

// Cache invalidation utilities
export function useInvalidateAdmissionData() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admission })
  }

  const invalidateAll = () => {
    queryClient.invalidateQueries()
  }

  return { invalidate, invalidateAll }
}

export function useInvalidateCurriculumData() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.curriculum })
  }

  return { invalidate }
}