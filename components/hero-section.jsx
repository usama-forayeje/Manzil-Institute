'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguageStore } from '../lib/store';
import { Button } from './ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatedGroup } from './ui/animated-group';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { LazyImage } from '@/components/ui/lazy-image';
import 'swiper/css';
import 'swiper/css/effect-fade';

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

export default function HeroSectionPremium() {
  const { language } = useLanguageStore();

  const heroImages = [
    { src: '/computer-class.webp', alt: 'Computer Lab' },
    { src: '/childclass.webp', alt: 'Classroom' },
    { src: '/roboticsclass.webp', alt: 'Robotics Lab' },
    { src: '/arabic-class.webp', alt: 'Arabic Class' },
  ];

  return (
    <main className="overflow-hidden bg-white dark:bg-gray-950">
      <section id="hero" className="relative min-h-[90vh] flex items-center">
        {/* Background Swiper */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="h-full w-full"
          >
            {heroImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <LazyImage
                    src={img.src}
                    alt={img.alt}
                    width={1920}
                    height={1080}
                    className="object-cover w-full h-full"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30 dark:from-gray-950/95 dark:via-gray-950/80 dark:to-gray-950/40" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full py-20 lg:py-32">
          <div className="max-w-7xl px-6 mx-auto md:px-12">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Left Content */}
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="space-y-8 text-center"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                  <span
                    className={cn(
                      'text-sm font-semibold text-blue-600 dark:text-blue-400',
                      language === 'bn' ? 'bengali-text' : ''
                    )}
                  >
                    {language === 'bn'
                      ? 'মানযিল গ্রুপ এর একটি প্রতিষ্ঠান'
                      : 'An Institution of Manzil Group'}
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1
                    className={cn(
                      'text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1]',
                      language === 'bn' ? 'bengali-text' : ''
                    )}
                  >
                    {language === 'bn' ? (
                      <>
                        মানযিল{' '}
                        <span className="text-[#00AEEF]">ইনস্টিটিউট</span>
                      </>
                    ) : (
                      <>
                        Manzil <span className="text-[#00AEEF]">Institute</span>
                      </>
                    )}
                  </h1>
                  <h2
                    className={cn(
                      'text-2xl md:text-3xl lg:text-4xl font-bold text-gray-600 dark:text-gray-300',
                      language === 'bn' ? 'bengali-text' : ''
                    )}
                  >
                    {language === 'bn'
                      ? 'গড়ে তুলছি আদর্শের নতুন প্রজন্ম'
                      : 'Building the Next Generation of Ideals'}
                  </h2>
                </div>

                {/* Description */}
                <p
                  className={cn(
                    'text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn'
                    ? 'মানযিল গ্রুপ এর একটি প্রতিষ্ঠান হচ্ছে মানযিল ইনস্টিটিউট। দেশের প্রথম ব্যতিক্রমধর্মী শিক্ষা প্রতিষ্ঠান, যেখানে আপনার সন্তান কুরআন-হাদিসের জ্ঞান অর্জনের পাশাপাশি আন্তর্জাতিক মানের জেনারেল, কারিগরি ও প্রযুক্তিগত শিক্ষায় সমৃদ্ধ হবে।'
                    : "Manzil Institute is an institution of Manzil Group. The nation's first exceptional educational institution, where your child will master Quranic and Hadith knowledge while excelling in international-standard General, Technical, and Technological education."}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center justify-center sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className={cn(
                      'bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
                      language === 'bn' ? 'bengali-text' : ''
                    )}
                    asChild
                  >
                    <Link href="/apply">
                      <BookOpen className="mr-2 size-5" />
                      {language === 'bn'
                        ? 'আজই ভর্তি আবেদন করুন'
                        : 'Apply for Admission Now'}
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      'border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-6 text-lg font-semibold transition-all duration-300',
                      language === 'bn' ? 'bengali-text' : ''
                    )}
                    asChild
                  >
                    <Link href="/campus">
                      {language === 'bn'
                        ? 'ক্যাম্পাস ভিজিট করুন'
                        : 'Visit Our Campus'}
                      <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>

                {/* Stats/Trust Indicators */}
                <div className="pt-8 items-center justify-center border-t text-center border-gray-200 dark:border-gray-800 flex gap-8">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {language === 'bn' ? '৫+' : '5+'}
                    </p>
                    <p
                      className={cn(
                        'text-sm text-gray-500 dark:text-gray-400',
                        language === 'bn' ? 'bengali-text' : ''
                      )}
                    >
                      {language === 'bn' ? 'ভাষা শিক্ষা' : 'Languages'}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {language === 'bn' ? '২' : '2'}
                    </p>
                    <p
                      className={cn(
                        'text-sm text-gray-500 dark:text-gray-400',
                        language === 'bn' ? 'bengali-text' : ''
                      )}
                    >
                      {language === 'bn' ? 'কারিকুলাম' : 'Curriculums'}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {language === 'bn' ? '১০০%' : '100%'}
                    </p>
                    <p
                      className={cn(
                        'text-sm text-gray-500 dark:text-gray-400',
                        language === 'bn' ? 'bengali-text' : ''
                      )}
                    >
                      {language === 'bn' ? 'নিরাপত্তা' : 'Safety'}
                    </p>
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

{
  /* Right Content - Image Slider/Visuals */
}
{
  /* <div className="hidden lg:block relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                 <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={true}
                    className="h-full w-full"
                  >
                    {heroImages.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <LazyImage
                          src={img.src}
                          alt={img.alt}
                          width={800}
                          height={1000}
                          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-xl font-medium">{img.alt}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
              </div> */
}
