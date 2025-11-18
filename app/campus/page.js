'use client'

import { useState, useEffect } from 'react'
import { MapPin, Home, Utensils, Shield, Wifi, Car, BookOpen, Users, Clock, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useLanguageStore } from '../../lib/store'
import { cn } from '../../lib/utils'
import { AnimatedGroup } from '../../components/ui/animated-group'
import ErrorBoundary from '../../components/ErrorBoundary'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import FooterSection from '../../components/footer'
import HeroHeader from '@/components/header'

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

export default function CampusPage() {
  const [activeTab, setActiveTab] = useState('facilities')
  const { language } = useLanguageStore()

  // Mock campus data - in a real app, this would come from an API
  const campusData = {
    overview: {
      title: language === 'bn' ? 'ক্যাম্পাস ওভারভিউ' : 'Campus Overview',
      description: language === 'bn'
        ? 'মানযিল ইন্টারন্যাশনাল ইনস্টিটিউটের আধুনিক ক্যাম্পাস - ইসলামিক পরিবেশে মানসম্পন্ন শিক্ষা'
        : 'Manzil International Institute modern campus - Quality education in Islamic environment'
    },
    facilities: [
      {
        id: 'residential',
        title: language === 'bn' ? 'আবাসিক সুবিধা' : 'Residential Facilities',
        description: language === 'bn' ? 'ছাত্র-ছাত্রীদের জন্য নিরাপদ ও আরামদায়ক আবাসন' : 'Safe and comfortable accommodation for students',
        icon: Home,
        color: 'blue',
        features: [
          language === 'bn' ? 'পৃথক ছেলে ও মেয়েদের হোস্টেল' : 'Separate hostels for boys and girls',
          language === 'bn' ? '২৪/৭ নিরাপত্তা' : '24/7 security',
          language === 'bn' ? 'হালাল খাবার সরবরাহ' : 'Halal food service',
          language === 'bn' ? 'আধুনিক সুযোগ-সুবিধা' : 'Modern amenities'
        ]
      },
      {
        id: 'classrooms',
        title: language === 'bn' ? 'শ্রেণীকক্ষ' : 'Classrooms',
        description: language === 'bn' ? 'আধুনিক শিক্ষা পরিবেশে সজ্জিত শ্রেণীকক্ষ' : 'Well-equipped classrooms in modern learning environment',
        icon: BookOpen,
        color: 'green',
        features: [
          language === 'bn' ? 'ডিজিটাল স্মার্ট বোর্ড' : 'Digital smart boards',
          language === 'bn' ? 'এয়ার কন্ডিশনড' : 'Air conditioned',
          language === 'bn' ? 'ইন্টারনেট সংযোগ' : 'Internet connectivity',
          language === 'bn' ? 'আধুনিক আসবাবপত্র' : 'Modern furniture'
        ]
      },
      {
        id: 'dining',
        title: language === 'bn' ? 'খাবার সুবিধা' : 'Dining Facilities',
        description: language === 'bn' ? 'পুষ্টিকর ও হালাল খাবারের ব্যবস্থা' : 'Nutritious and halal food arrangements',
        icon: Utensils,
        color: 'orange',
        features: [
          language === 'bn' ? 'হালাল খাবার' : 'Halal food',
          language === 'bn' ? 'পুষ্টিবিদের তত্ত্বাবধান' : 'Nutritionist supervision',
          language === 'bn' ? 'বিভিন্ন খাবারের মেনু' : 'Varied menu options',
          language === 'bn' ? 'পরিষ্কার পরিবেশ' : 'Clean environment'
        ]
      },
      {
        id: 'security',
        title: language === 'bn' ? 'নিরাপত্তা' : 'Security',
        description: language === 'bn' ? 'ক্যাম্পাসের সম্পূর্ণ নিরাপত্তা ব্যবস্থা' : 'Complete campus security system',
        icon: Shield,
        color: 'red',
        features: [
          language === 'bn' ? 'সিসিটিভি ক্যামেরা' : 'CCTV cameras',
          language === 'bn' ? 'নিরাপত্তা প্রহরী' : 'Security guards',
          language === 'bn' ? 'প্রবেশ নিয়ন্ত্রণ' : 'Access control',
          language === 'bn' ? 'জরুরি সেবা' : 'Emergency services'
        ]
      }
    ],
    location: {
      address: language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh',
      phone: ['+880 1234-567890', '+880 1234-567891'],
      email: 'info@manzilgroupbd.com',
      officeHours: language === 'bn' ? 'সকাল ৯টা - সন্ধ্যা ৬টা' : '9 AM - 6 PM'
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://institute.manzilgroupbd.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Campus",
        "item": "https://institute.manzilgroupbd.com/campus"
      }
    ]
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg100: 'bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10',
        bg500: 'bg-[#00AEEF]',
        text500: 'text-[#00AEEF]'
      },
      green: {
        bg100: 'bg-green-100 dark:bg-green-900/30',
        bg500: 'bg-green-500',
        text500: 'text-green-500'
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const tabs = [
    { id: 'facilities', label: language === 'bn' ? 'সুবিধাসমূহ' : 'Facilities' },
    { id: 'location', label: language === 'bn' ? 'অবস্থান' : 'Location' }
  ]

  return (
    <ErrorBoundary>
      <div>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <HeroHeader />

        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12" dir="ltr">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
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
            {language === 'bn' ? 'মানযিল ইনস্টিটিউট ক্যাম্পাস' : 'Manzil Institute Campus'}
          </h1>
          <h2 className="text-lg md:text-xl text-[#00AEEF] dark:text-[#00AEEF]/80 mb-6 kalpurush-font">
              {language === 'bn' ? 'বাংলাদেশে MIC কারিকুলাম - আধুনিক সুবিধা ও ইসলামিক পরিবেশ' : 'MIC Curriculum in Bangladesh - Modern Facilities & Islamic Environment'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font">
            {language === 'bn'
              ? 'মানযিল ইন্টারন্যাশনাল ইনস্টিটিউটের ক্যাম্পাসে রয়েছে আধুনিক সুযোগ-সুবিধা এবং ইসলামিক পরিবেশে মানসম্পন্ন শিক্ষার সকল ব্যবস্থা।'
              : 'Manzil International Institute campus features modern facilities and all arrangements for quality education in an Islamic environment.'
            }
          </p>
        </section>

        {/* Overview Stats */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className={cn(
              "text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4",
              language === 'bn' && "bengali-text"
            )}>
              {campusData.overview.title}
            </h2>
            <p className={cn(
              "text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto",
              language === 'bn' && "bengali-text"
            )}>
              {campusData.overview.description}
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
                  ? 'bg-[#00AEEF] text-white'
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
          {/* Facilities */}
          {activeTab === 'facilities' && (
            <div className="space-y-6 sm:space-y-8">
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'ক্যাম্পাস সুবিধাসমূহ' : 'Campus Facilities'}
              </h3>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {campusData.facilities.map((facility, index) => {
                  const colorClasses = getColorClasses(facility.color)
                  const IconComponent = facility.icon
                  return (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses.bg100} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClasses.text500}`} />
                        </div>
                        <div>
                          <h4 className={cn(
                            "font-semibold text-gray-900 dark:text-white text-sm sm:text-base",
                            language === 'bn' && "bengali-text"
                          )}>
                            {facility.title}
                          </h4>
                        </div>
                      </div>

                      <p className={cn(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4",
                        language === 'bn' && "bengali-text"
                      )}>
                        {facility.description}
                      </p>

                      <ul className="space-y-2">
                        {facility.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses.text500}`} />
                            <span className={cn(
                              "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                              language === 'bn' && "bengali-text"
                            )}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Location & Contact */}
          {activeTab === 'location' && (
            <div className="space-y-6 sm:space-y-8">
              <h3 className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
                language === 'bn' && "bengali-text"
              )}>
                {language === 'bn' ? 'অবস্থান ও যোগাযোগ' : 'Location & Contact'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* Location Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#00AEEF] dark:text-[#00AEEF]/80" />
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
                        {campusData.location.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                        language === 'bn' && "bengali-text"
                      )}>
                        {language === 'bn' ? 'ফোন নম্বর' : 'Phone Numbers'}
                      </h4>
                      <div className="space-y-1">
                        {campusData.location.phone.map((number, idx) => (
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
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
                        {campusData.location.email}
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
                        {campusData.location.officeHours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Card */}
                <div className="bg-gradient-to-br from-[#00AEEF] to-purple-600 rounded-2xl p-4 sm:p-6 text-white">
                  <h4 className={cn(
                    "text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4",
                    language === 'bn' && "bengali-text"
                  )}>
                    {language === 'bn' ? 'ক্যাম্পাস ভিজিট করুন' : 'Visit Our Campus'}
                  </h4>
                  <p className={cn(
                    "mb-4 sm:mb-6 opacity-90 text-xs sm:text-sm",
                    language === 'bn' && "bengali-text"
                  )}>
                    {language === 'bn'
                      ? 'আমাদের ক্যাম্পাস দেখতে এবং আরও তথ্য জানতে যোগাযোগ করুন'
                      : 'Contact us to visit our campus and learn more information'
                    }
                  </p>

                  <div className="space-y-3 sm:space-y-4">
                    <Button
                      onClick={() => window.location.href = '/admission'}
                      className="w-full bg-white text-[#00AEEF] hover:bg-gray-100 text-sm sm:text-base py-2 sm:py-3"
                    >
                      <span className={cn(language === 'bn' && "bengali-text")}>
                        {language === 'bn' ? 'ভর্তি তথ্য' : 'Admission Info'}
                      </span>
                    </Button>

                    <Button
                      onClick={() => window.location.href = '/contact'}
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-blue-600 text-sm sm:text-base py-2 sm:py-3"
                    >
                      <span className={cn(language === 'bn' && "bengali-text")}>
                        {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
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
  )
}