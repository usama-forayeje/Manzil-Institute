import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Download, Calendar, Clock, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { HeroHeader } from '../components/header'
import FooterSection from '../components/footer'
import { useLanguageStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { AnimatedGroup } from '../components/ui/animated-group'

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
}

export const Route = createFileRoute('/admission')({
  component: AdmissionPage,
})

function AdmissionPage() {
  const [activeTab, setActiveTab] = useState('process')
  const { language } = useLanguageStore()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg100: 'bg-blue-100 dark:bg-blue-900/30',
        bg500: 'bg-blue-500',
        text500: 'text-blue-500'
      },
      green: {
        bg100: 'bg-green-100 dark:bg-green-900/30',
        bg500: 'bg-green-500',
        text500: 'text-green-500'
      },
      purple: {
        bg100: 'bg-purple-100 dark:bg-purple-900/30',
        bg500: 'bg-purple-500',
        text500: 'text-purple-500'
      },
      orange: {
        bg100: 'bg-orange-100 dark:bg-orange-900/30',
        bg500: 'bg-orange-500',
        text500: 'text-orange-500'
      },
      red: {
        bg100: 'bg-red-100 dark:bg-red-900/30',
        bg500: 'bg-red-500',
        text500: 'text-red-500'
      }
    }
    return colorMap[color] || colorMap.blue
  }

  const admissionData = {
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
        { 
          name: language === 'bn' ? "ভর্তি ফরম" : "Admission Form", 
          amount: language === 'bn' ? "৫০০ টাকা" : "500 BDT" 
        },
        { 
          name: language === 'bn' ? "নতুন ভর্তি ফি" : "New Admission Fee", 
          amount: language === 'bn' ? "৩০,০০০ টাকা" : "30,000 BDT" 
        },
        { 
          name: language === 'bn' ? "সেশন ফি" : "Session Fee", 
          amount: language === 'bn' ? "২৫,০০০ টাকা" : "25,000 BDT" 
        },
        { 
          name: language === 'bn' ? "ইনস্টলেশন ফি" : "Installation Fee", 
          amount: language === 'bn' ? "১০,০০০ টাকা" : "10,000 BDT" 
        },
        { 
          name: language === 'bn' ? "একুমেন্ডেশন ফি" : "Accommodation Fee", 
          amount: language === 'bn' ? "১০,০০০ টাকা" : "10,000 BDT" 
        },
        { 
          name: language === 'bn' ? "কার্ড, লকার, ড্রেস" : "Card, Locker, Dress", 
          amount: language === 'bn' ? "৫,০০০ টাকা" : "5,000 BDT" 
        },
        { 
          name: language === 'bn' ? "বই ও স্টেশনারী" : "Books & Stationery", 
          amount: language === 'bn' ? "৫,০০০ টাকা" : "5,000 BDT" 
        }
      ],
      monthly: {
        tuition: [
          { 
            name: language === 'bn' ? "দরসে নিজামী" : "Dars-e-Nizami", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "ন্যাশনাল কারিকুলাম" : "National Curriculum", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "ক্যামব্রীজ ইন্টারন্যাশনাল" : "Cambridge International", 
            amount: language === 'bn' ? "৩,০০০ টাকা" : "3,000 BDT" 
          },
          { 
            name: language === 'bn' ? "নূরানি ও বেফাক কারিকুলাম" : "Noorani & Befaq Curriculum", 
            amount: language === 'bn' ? "৩,০০০ টাকা" : "3,000 BDT" 
          },
          { 
            name: language === 'bn' ? "কর্মমুখী কার্যক্রম" : "Vocational Activities", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "বাস্তবমুখী কার্যক্রম" : "Practical Activities", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "কারিগরি শিক্ষা" : "Technical Education", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "কম্পিউটার শিক্ষা" : "Computer Education", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "ল্যাঙ্গুয়েজ কোর্স" : "Language Course", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          },
          { 
            name: language === 'bn' ? "খেলাধুলা প্রশিক্ষণ" : "Sports Training", 
            amount: language === 'bn' ? "২,০০০ টাকা" : "2,000 BDT" 
          }
        ],
        residential: [
          { 
            name: language === 'bn' ? "ফ্লোর ভাড়া" : "Floor Rent", 
            amount: language === 'bn' ? "৩,৫০০ টাকা" : "3,500 BDT" 
          },
          { 
            name: language === 'bn' ? "বিদ্যুৎ ও পানির বিল" : "Electricity & Water Bill", 
            amount: language === 'bn' ? "১,৫০০ টাকা" : "1,500 BDT" 
          }
        ],
        food: [
          { 
            name: language === 'bn' ? "লেভেল-১ (নাস্তা ও খাবার)" : "Level-1 (Breakfast & Meal)", 
            amount: language === 'bn' ? "৯,০০০ টাকা" : "9,000 BDT" 
          },
          { 
            name: language === 'bn' ? "লেভেল-২ (নাস্তা ও খাবার)" : "Level-2 (Breakfast & Meal)", 
            amount: language === 'bn' ? "১২,০০০ টাকা" : "12,000 BDT" 
          },
          { 
            name: language === 'bn' ? "লেভেল-৩ (নাস্তা ও খাবার)" : "Level-3 (Breakfast & Meal)", 
            amount: language === 'bn' ? "১৫,০০০ টাকা" : "15,000 BDT" 
          },
          { 
            name: language === 'bn' ? "হুফ্ফাজ সিস্টেম (নাস্তা ও খাবার)" : "Huffaz System (Breakfast & Meal)", 
            amount: language === 'bn' ? "১৫,০০০ টাকা" : "15,000 BDT" 
          }
        ]
      }
    },
    importantDates: [
      { 
        event: language === 'bn' ? "ভর্তি আবেদন শুরু" : "Admission Application Starts", 
        date: language === 'bn' ? "১লা জানুয়ারি ২০২৪" : "January 1, 2024", 
        status: "open" 
      },
      { 
        event: language === 'bn' ? "ভর্তি পরীক্ষা" : "Admission Test", 
        date: language === 'bn' ? "১৫ই জানুয়ারি ২০২৪" : "January 15, 2024", 
        status: "upcoming" 
      },
      { 
        event: language === 'bn' ? "মনোনয়ন লিস্ট প্রকাশ" : "Nomination List Published", 
        date: language === 'bn' ? "২০শে জানুয়ারি ২০২৪" : "January 20, 2024", 
        status: "upcoming" 
      },
      { 
        event: language === 'bn' ? "কাগজপত্র জমার শেষ তারিখ" : "Last Date for Document Submission", 
        date: language === 'bn' ? "৩১শে জানুয়ারি ২০২৪" : "January 31, 2024", 
        status: "upcoming" 
      },
      { 
        event: language === 'bn' ? "ক্লাস শুরু" : "Classes Begin", 
        date: language === 'bn' ? "১লা ফেব্রুয়ারি ২০২৪" : "February 1, 2024", 
        status: "upcoming" 
      }
    ],
    contact: {
      phone: ["০১৪০৭-০৪৬০০১", "০১৪০৭-০৪৬০০২", "০১৪০৭-০৪৬০০৩"],
      email: "admission@manzilinstitute.edu.bd",
      address: language === 'bn' 
        ? "হারুনুর রশীদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা ১৩৬২"
        : "Harunur Rashid Tower (10 Storied Building), House #91, Road #2, North Rayarbagh Bus Stand, Jatrabari, Dhaka 1362",
      officeHours: language === 'bn' 
        ? "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০"
        : "Saturday - Thursday: 9:00 AM - 5:00 PM"
    }
  }

  const handleApplyNow = () => {
    navigate({ to: '/apply' })
  }

  const handleDownloadForm = () => {
    alert(language === 'bn' ? 'ভর্তি ফরম ডাউনলোড শুরু হচ্ছে...' : 'Downloading admission form...')
  }

  const tabs = [
    { id: 'process', label: language === 'bn' ? 'ভর্তি প্রক্রিয়া' : 'Admission Process' },
    { id: 'requirements', label: language === 'bn' ? 'যোগ্যতা ও ডকুমেন্ট' : 'Eligibility & Documents' },
    { id: 'fees', label: language === 'bn' ? 'ফি কাঠামো' : 'Fee Structure' },
    { id: 'dates', label: language === 'bn' ? 'গুরুত্বপূর্ণ তারিখ' : 'Important Dates' },
    { id: 'contact', label: language === 'bn' ? 'যোগাযোগ' : 'Contact' }
  ]

  return (
    <div>
      <HeroHeader />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12" dir="ltr">
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
        {/* Overview Stats */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className={cn(
              "text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4",
              language === 'bn' && "bengali-text"
            )}>
              {admissionData.overview.title}
            </h2>
            <p className={cn(
              "text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto",
              language === 'bn' && "bengali-text"
            )}>
              {admissionData.overview.description}
            </p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center sm:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-colors border border-gray-200 dark:border-gray-700 flex-shrink-0",
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                language === 'bn' && "bengali-text"
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
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'ভর্তি প্রক্রিয়া - ধাপ সমূহ' : 'Admission Process - Steps'}
              </h3>

              {admissionData.process.map((step, index) => {
                const colorClasses = getColorClasses(step.color)
                return (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    {/* Step Number */}
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colorClasses.bg100} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses.bg500} rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg`}>
                        {step.step}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                        <h4 className={cn(
                          "text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-0",
                          language === 'bn' && "bengali-text"
                        )}>
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className={cn("text-xs sm:text-sm", language === 'bn' && "bengali-text")}>
                            {step.duration}
                          </span>
                        </div>
                      </div>

                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4",
                        language === 'bn' && "bengali-text"
                      )}>
                        {step.description}
                      </p>

                      <div className="grid gap-1 sm:gap-2">
                        {step.requirements.map((requirement, reqIndex) => (
                          <div key={reqIndex} className="flex items-center gap-2">
                            <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses.text500}`} />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {requirement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Requirements & Documents */}
          {activeTab === 'requirements' && (
            <div className="space-y-6 sm:space-y-8">
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'লেভেল অনুযায়ী যোগ্যতা ও প্রয়োজনীয় ডকুমেন্ট' : 'Level-wise Eligibility & Required Documents'}
              </h3>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Level 1 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                    <h4 className={cn(
                      "font-semibold text-blue-700 dark:text-blue-300 text-sm sm:text-base",
                      language === 'bn' && "bengali-text"
                    )}>
                      {language === 'bn' ? 'লেভেল ১' : 'Level 1'}
                    </h4>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'বয়স:' : 'Age:'}
                      </h5>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.requirements.level1.age}
                      </p>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.level1.academic.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.level1.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-orange-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <h4 className={cn(
                      "font-semibold text-green-700 dark:text-green-300 text-sm sm:text-base",
                      language === 'bn' && "bengali-text"
                    )}>
                      {language === 'bn' ? 'লেভেল ২' : 'Level 2'}
                    </h4>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'বয়স:' : 'Age:'}
                      </h5>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.requirements.level2.age}
                      </p>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.level2.academic.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.level2.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-orange-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Level 3 */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
                    <h4 className={cn(
                      "font-semibold text-purple-700 dark:text-purple-300 text-sm sm:text-base",
                      language === 'bn' && "bengali-text"
                    )}>
                      {language === 'bn' ? 'লেভেল ৩' : 'Level 3'}
                    </h4>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'বয়স:' : 'Age:'}
                      </h5>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.requirements.level3.age}
                      </p>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.level3.academic.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.level3.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-orange-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Huffaz System */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                    <h4 className={cn(
                      "font-semibold text-orange-700 dark:text-orange-300 text-sm sm:text-base",
                      language === 'bn' && "bengali-text"
                    )}>
                      {language === 'bn' ? 'হুফ্ফাজ সিস্টেম' : 'Huffaz System'}
                    </h4>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'বয়স:' : 'Age:'}
                      </h5>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.requirements.huffaz.age}
                      </p>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.huffaz.academic.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
                      </h5>
                      <ul className="space-y-1">
                        {admissionData.requirements.huffaz.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-orange-500" />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fee Structure */}
          {activeTab === 'fees' && (
            <div className="space-y-6 sm:space-y-8">
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'ফি কাঠামো' : 'Fee Structure'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* One Time Fees */}
                <div className="space-y-4 sm:space-y-6">
                  <h4 className={cn(
                    "text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2",
                    language === 'bn' && "bengali-text"
                  )}>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                    {language === 'bn' ? 'এককালীন ফি' : 'One Time Fees'}
                  </h4>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {admissionData.feeStructure.oneTime.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center py-1 sm:py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                        <span className={cn(
                          "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                          language === 'bn' && "bengali-text"
                        )}>
                          {fee.name}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                          {fee.amount}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-300 dark:border-gray-500">
                      <span className={cn(
                        "font-bold text-gray-900 dark:text-white text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'মোট এককালীন ফি' : 'Total One Time Fee'}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                        {language === 'bn' ? '৮৫,৫০০ টাকা' : '85,500 BDT'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Fees */}
                <div className="space-y-4 sm:space-y-6">
                  <h4 className={cn(
                    "text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2",
                    language === 'bn' && "bengali-text"
                  )}>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    {language === 'bn' ? 'মাসিক ফি' : 'Monthly Fees'}
                  </h4>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Tuition Fees */}
                    <div>
                      <h5 className={cn(
                        "font-medium text-gray-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'টিউশন ফি:' : 'Tuition Fees:'}
                      </h5>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {admissionData.feeStructure.monthly.tuition.map((fee, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {fee.name}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {fee.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Residential & Food */}
                    <div className="grid gap-3 sm:gap-4">
                      <div>
                        <h5 className={cn(
                          "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                          language === 'bn' && "bengali-text"
                        )}>
                          {language === 'bn' ? 'আবাসিক ফি:' : 'Residential Fees:'}
                        </h5>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2">
                          {admissionData.feeStructure.monthly.residential.map((fee, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className={cn(
                                "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                                language === 'bn' && "bengali-text"
                              )}>
                                {fee.name}
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                {fee.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className={cn(
                          "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                          language === 'bn' && "bengali-text"
                        )}>
                          {language === 'bn' ? 'খাবার ফি:' : 'Food Fees:'}
                        </h5>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2">
                          {admissionData.feeStructure.monthly.food.map((fee, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className={cn(
                                "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                                language === 'bn' && "bengali-text"
                              )}>
                                {fee.name}
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                {fee.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                <p className={cn(
                  "text-xs sm:text-sm text-blue-700 dark:text-blue-300 text-center",
                  language === 'bn' && "bengali-text"
                )}>
                  {language === 'bn' 
                    ? '💡 সকল ফি আগাম পরিশোধের ক্ষেত্রে বিশেষ ছাড় প্রদান করা হয়। বিস্তারিত জানতে অফিসে যোগাযোগ করুন।'
                    : '💡 Special discounts are provided for advance payment of all fees. Contact the office for details.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Important Dates */}
          {activeTab === 'dates' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'গুরুত্বপূর্ণ তারিখ সমূহ' : 'Important Dates'}
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {admissionData.importantDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="flex-1">
                      <h4 className={cn(
                        "font-semibold text-gray-900 dark:text-white text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {date.event}
                      </h4>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {date.date}
                      </p>
                    </div>

                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${date.status === 'open'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                      {date.status === 'open' 
                        ? (language === 'bn' ? 'চলমান' : 'Ongoing')
                        : (language === 'bn' ? 'আসন্ন' : 'Upcoming')
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {activeTab === 'contact' && (
            <div className="space-y-6 sm:space-y-8">
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'ভর্তি সম্পর্কিত যোগাযোগ' : 'Admission Contact Information'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* Contact Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'ফোন নম্বর' : 'Phone Numbers'}
                      </h4>
                      <div className="space-y-1">
                        {admissionData.contact.phone.map((number, idx) => (
                          <p key={idx} className={cn(
                            "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                            language === 'bn' && "bengali-text"
                          )}>
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
                      <h4 className={cn(
                        "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'ইমেইল' : 'Email'}
                      </h4>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.contact.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'ঠিকানা' : 'Address'}
                      </h4>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'অফিস সময়' : 'Office Hours'}
                      </h4>
                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                        language === 'bn' && "bengali-text"
                      )}>
                        {admissionData.contact.officeHours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Card */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 text-white">
                  <h4 className={cn(
                    "text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4",
                    language === 'bn' && "bengali-text"
                  )}>
                    {language === 'bn' ? 'দ্রুত ভর্তি প্রক্রিয়া শুরু করুন' : 'Start Admission Process Quickly'}
                  </h4>
                  <p className={cn(
                    "mb-4 sm:mb-6 opacity-90 text-xs sm:text-sm",
                    language === 'bn' && "bengali-text"
                  )}>
                    {language === 'bn' 
                      ? 'এখনই অনলাইনে আবেদন করুন এবং আপনার সন্তানের ভবিষ্যত গড়ার যাত্রা শুরু করুন'
                      : 'Apply online now and start your child\'s future-building journey'
                    }
                  </p>

                  <div className="space-y-3 sm:space-y-4">
                    <Button
                      onClick={handleApplyNow}
                      className="w-full bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base py-2 sm:py-3"
                    >
                      <span className={cn(language === 'bn' && "bengali-text")}>
                        {language === 'bn' ? 'অনলাইনে আবেদন করুন' : 'Apply Online'}
                      </span>
                    </Button>

                    <Button
                      onClick={handleDownloadForm}
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-blue-600 text-sm sm:text-base py-2 sm:py-3"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span className={cn(language === 'bn' && "bengali-text")}>
                        {language === 'bn' ? 'ভর্তি ফরম ডাউনলোড' : 'Download Admission Form'}
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
  )
}