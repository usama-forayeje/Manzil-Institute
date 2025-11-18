"use client";

import React from 'react'
import Link from "next/link"
import { useLanguageStore } from "../lib/store"
import { Button } from "./ui/button"
import { BookOpen } from "lucide-react"
import { cn } from "../lib/utils"
import { ArrowRight } from "lucide-react"
import { AnimatedGroup } from "./ui/animated-group"

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

export default function HeroSectionPremium() {
  const { language } = useLanguageStore()
  console.log('HeroSection rendering, language:', language)

  return (
    <main className="overflow-hidden">
      <section id="hero" className="relative hero-gradient">
        {/* Content */}
        <div className="relative z-10 py-24 lg:py-32">
          <div className="max-w-6xl px-6 mx-auto md:px-12">
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
              className="space-y-8 text-center"
            >

              {/* Badge */}
              <div className="flex flex-col items-center gap-2 px-6 py-2 mx-auto mb-8 border border-orange-200 rounded-full bg-orange-50 w-fit dark:bg-orange-900/20 dark:border-orange-800"> {/* Added mb-8 */}
                <span className={cn("text-sm font-medium text-orange-700 dark:text-orange-300 text-center", language === 'bn' ? "bengali-text" : "")}>
                  {language === 'bn' ? 'মাদরাসা | জেনারেল | কারিগরি শিক্ষার সমন্বয়' : 'Integration of Madrasa | General | Technical Education'}
                </span>
              </div>

              {/* Main Institute Name - EXTRA LARGE */}
              <div className="mb-6"> {/* Added mb-6 */}
                <h1 className={cn("text-5xl md:text-6xl lg:text-7xl font-black text-[#00AEEF] dark:text-[#00AEEF] leading-none text-center", language === 'bn' ? "bengali-text" : "")}>
                  {language === 'bn' ? 'মানযিল ইনস্টিটিউট' : 'Manzil Institute'}
                </h1>
              </div>

              {/* NEW: Subheading - Next Level */}
              <div className="mb-8"> {/* Added mb-8 */}
                <h2 className={cn("text-4xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight text-center", language === 'bn' ? "bengali-text" : "")}>
                  {language === 'bn' ? 'গড়ে তুলছি আদর্শের নতুন প্রজন্ম' : 'Building the Next Generation of Ideals'}
                </h2>
              </div>

              {/* Description - Updated styling */}
              <div className="max-w-4xl mx-auto mb-12"> {/* Added mb-12 and reduced text size */}
                <p className={cn("text-xl md:text-2xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed text-center", language === 'bn' ? "bengali-text" : "")}>
                  {language === 'bn' ? (
                    'দেশের প্রথম ব্যতিক্রমধর্মী শিক্ষা প্রতিষ্ঠান, যেখানে আপনার সন্তান কুরআন-হাদিসের জ্ঞান অর্জনের পাশাপাশি আন্তর্জাতিক মানের জেনারেল, কারিগরি ও প্রযুক্তিগত শিক্ষায় সমৃদ্ধ হবে।'
                  ) : (
                    "The nation's first exceptional educational institution, where your child will master Quranic and Hadith knowledge while excelling in international-standard General, Technical, and Technological education."
                  )}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <Button
                  size="lg"
                  className={cn("bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white px-10 py-5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center", language === 'bn' ? "bengali-text" : "")}
                  asChild
                >
                  <Link href="/apply">
                    <BookOpen className="mr-2 size-6" />
                    <span className={cn("text-nowrap", language === 'bn' && "bengali-text text-center")}>
                      {language === 'bn' ? 'আজই ভর্তি আবেদন করুন' : 'Apply for Admission Now'}
                    </span>
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className={cn("border-2 border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF]/10 dark:border-[#00AEEF]/80 dark:text-[#00AEEF]/80 dark:hover:bg-[#00AEEF]/20 px-10 py-5 text-lg font-semibold transition-all duration-300 text-center", language === 'bn' ? "bengali-text" : "")}
                  asChild
                >
                  <Link href="/campus">
                    <span className={cn("text-nowrap", language === 'bn' && "bengali-text text-center")}>
                      {language === 'bn' ? 'ক্যাম্পাস ভিজিট করুন' : 'Visit Our Campus'}
                    </span>
                    <ArrowRight className="ml-2 size-6" />
                  </Link>
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>
      </section>
    </main>
  )
}
