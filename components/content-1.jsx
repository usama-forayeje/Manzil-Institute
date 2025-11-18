"use client";

import { useLanguageStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Target, Users, CheckCircle, Sparkles, Award, BookOpen } from 'lucide-react'
import { LogoCloud } from '@/components/logo-cloud'
import { LazyImage } from '@/components/ui/lazy-image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import Link from 'next/link'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Button } from '@/components/ui/button'

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

export default function ContentSection() {
    const { language } = useLanguageStore()

    const classTranslations = {
        "Computer Class": language === 'bn' ? "কম্পিউটার ক্লাস" : "Computer Class",
        "Classroom": language === 'bn' ? "আরবি ক্লাসের একাংশ" : "A Section of Arabic Class",
        "Category Class": language === 'bn' ? "প্রযুক্তি ক্লাস" : "Technical Class",
        "Arabic Class": language === 'bn' ? "আরবি ক্লাসরুম" : "Arabic Classroom",
        "Robotics Class": language === 'bn' ? "রোবোটিক্স ক্লাস" : "Robotics Class",
        "Language Class": language === 'bn' ? "ভাষা ক্লাসের একাংশ" : "Language Class Section",
        "Arts Class": language === 'bn' ? "শিল্প ক্লাস " : "Arts Class",
        "Arabic Class Section": language === 'bn' ? "আরবি ক্লাসের একাংশ" : "A Section of Arabic Class"
    }

    return (
        <section id="about" className="relative scroll-mt-[100px] py-6 xs:py-8 sm:py-12 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden" dir="ltr">

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
                className="relative w-full px-3 mx-auto max-w-7xl xs:px-4 sm:px-6 lg:px-8"
            >

                {/* Main Heading with Animation */}
                <div className="mb-6 text-center xs:mb-8 sm:mb-12 lg:mb-16">
                    <div className="inline-flex items-center justify-center px-2 xs:px-3 py-1 mb-2 xs:mb-3 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-full">
                        <Sparkles className="size-2.5 xs:size-3 sm:size-4 text-[#00AEEF] dark:text-[#00AEEF]/80 mr-1 xs:mr-2" />
                        <span className={cn("text-xs font-semibold text-[#00AEEF] dark:text-[#00AEEF]/80", language === 'bn' ? "bengali-text" : "")}>
                            {language === 'bn' ? 'আমাদের পরিচয়' : 'About Us'}
                        </span>
                    </div>
                    <h2 className={cn("text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 xs:mb-3 leading-tight", language === 'bn' ? "bengali-text" : "english-text")}>
                        {language === 'bn' ? 'মানযিল সম্পর্কে' : 'About Manzil'}
                    </h2>
                    <div className="flex items-center justify-center gap-1 xs:gap-2">
                        <div className="w-4 xs:w-6 sm:w-8 h-1 bg-gradient-to-r from-transparent to-[#00AEEF] rounded-full"></div>
                        <div className="w-6 xs:w-8 sm:w-12 h-1 bg-[#00AEEF] rounded-full"></div>
                        <div className="w-4 xs:w-6 sm:w-8 h-1 bg-gradient-to-l from-transparent to-[#00AEEF] rounded-full"></div>
                    </div>
                </div>

                {/* Image + Content Grid */}
                <div className="grid items-start grid-cols-1 gap-4 mb-6 lg:grid-cols-2 xs:gap-5 sm:gap-6 lg:gap-8 xs:mb-8 sm:mb-12 lg:mb-16">
                    {/* Content Side */}
                    <div className="flex flex-col justify-center order-2 space-y-4 xs:space-y-3 sm:space-y-4 lg:order-1">
                        <div className="space-y-1.5 xs:space-y-2 flex flex-col items-center justify-center">
                            <div className="inline-flex items-center mb-2  px-2 py-1 bg-gradient-to-r from-[#00AEEF]/20 to-purple-100 dark:from-[#00AEEF]/10 dark:to-purple-900/30 rounded-full">
                                <BookOpen className="size-2.5 xs:size-3 text-[#00AEEF] dark:text-[#00AEEF]/80 mr-1" />
                                <span className={cn("text-xs font-semibold text-[#00AEEF] dark:text-[#00AEEF]/80", language === 'bn' ? "bengali-text" : "")}>
                                    {language === 'bn' ? 'আমাদের যাত্রা' : 'Our Journey'}
                                </span>
                            </div>
                            <h3 className={cn("text-xl xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight", language === 'bn' ? "bengali-text" : "")}>
                                {language === 'bn' ? 'একটি মহৎ ভাবনা থেকে যাত্রা' : 'Journey from a Noble Thought'}
                            </h3>
                            <p className={cn("text-base sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed", language === 'bn' ? "bengali-text" : "")}>
                                {language === 'bn' ? (
                                    'মানযিল একটি নাম, একটি স্বপ্ন, একটি দিকনির্দেশনা। ইসলামী মূল্যবোধ, জ্ঞান, নৈতিকতা এবং উন্নয়নের সমন্বয়ে গড়ে তোলা এক আদর্শ সমাজ-ব্যবস্থার স্বপ্ন নিয়ে আমাদের যাত্রা শুরু।'
                                ) : (
                                    'Manzil is a name, a dream, a guiding direction. Our journey began with the dream of building an ideal social system through the integration of Islamic values, knowledge, ethics, and development.'
                                )}
                            </p>
                        </div>

                        {/* Key Points with Enhanced Design */}
                        <div className="grid grid-cols-1 gap-1.5 xs:gap-2">
                            {[
                                {
                                    bn: 'মাদরাসা, জেনারেল ও কারিগরি শিক্ষার সমন্বয়',
                                    en: 'Integration of Madrasa, General & Technical Education'
                                },
                                {
                                    bn: 'আন্তর্জাতিক মানের কারিকুলাম (MIC)',
                                    en: 'International Standard Curriculum (MIC)'
                                },
                                {
                                    bn: 'নৈতিকতা ও আধুনিক শিক্ষার সমন্বয়',
                                    en: 'Combination of Ethics & Modern Education'
                                },
                                {
                                    bn: 'ভবিষ্যতের নেতৃত্ব গড়ার প্রত্যয়',
                                    en: 'Commitment to Building Future Leadership'
                                }
                            ].map((point, index) => (
                                <div key={index} className="group relative bg-white dark:bg-gray-800 p-2 xs:p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600">
                                    <div className="flex items-start gap-2 xs:gap-2.5">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="relative">
                                                <div className="absolute inset-0 transition-opacity bg-green-400 rounded-full blur opacity-20 group-hover:opacity-40"></div>
                                                <CheckCircle className="relative size-3 xs:size-3.5 sm:size-4 text-green-500" />
                                            </div>
                                        </div>
                                        <span className={cn("text-base sm:text-base text-gray-700 dark:text-gray-200 leading-snug", language === 'bn' ? "bengali-text" : "english-text")}>
                                            {language === 'bn' ? point.bn : point.en}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons with Glow Effect */}
                        <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row xs:pt-2">


                            <Button asChild variant="outline" className={cn(
                                "group relative overflow-hidden border-2 border-[#00AEEF] bg-transparent text-[#00AEEF] transition-all duration-300 hover:border-[#00AEEF] hover:bg-[#00AEEF] hover:text-white hover:shadow-lg hover:shadow-[#00AEEF]/30 dark:border-[#00AEEF]/80 dark:text-[#00AEEF]/80 dark:hover:bg-[#00AEEF]/80 dark:hover:text-white",
                                "px-6 py-2 rounded-xl font-medium",
                                language === 'bn' ? "bengali-text" : "english-text"
                            )}>
                                <Link href='/curriculum' className="relative z-10">
                                    <span className="relative z-10 flex items-center gap-2">
                                        {language === 'bn' ? 'কারিকুলাম দেখুন' : 'View Curriculum'}
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className={cn(
                                "group relative overflow-hidden border-2 border-green-600 bg-transparent text-green-600 transition-all duration-300 hover:border-green-600 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-600/30 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white",
                                "px-6 py-2 rounded-xl font-medium",
                                language === 'bn' ? "bengali-text" : "english-text"
                            )}>
                                <Link href='/admission' className="relative z-10">
                                    <span className="relative z-10 flex items-center gap-2">
                                        {language === 'bn' ? 'ভর্তি তথ্য' : 'Admission Info'}
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className={cn(
                                "group relative overflow-hidden border-2 border-purple-600 bg-transparent text-purple-600 transition-all duration-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-600/30 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-white",
                                "px-6 py-2 rounded-xl font-medium hidden sm:inline-flex",
                                language === 'bn' ? "bengali-text" : "english-text"
                            )}>
                                <Link href='/campus' className="relative z-10">
                                    <span className="relative z-10 flex items-center gap-2">
                                        {language === 'bn' ? 'কেম্পাস দেখুন' : 'See Campus'}
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </span>
                                </Link>
                            </Button>


                        </div>
                    </div>

                    {/* Image Side with Enhanced Effects */}
                    <div className="relative order-1 lg:order-2">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 transform scale-95 rotate-0 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 xs:rounded-lg sm:rounded-xl lg:rounded-2xl xs:rotate-1 sm:rotate-3 lg:rotate-6 xs:scale-100 sm:scale-105 blur-xl"></div>

                        {/* Main Campus Image Swiper */}
                        <div className="relative overflow-hidden transition-shadow duration-500 border-2 border-white rounded-lg shadow-lg xs:rounded-lg sm:rounded-xl lg:rounded-xl hover:shadow-blue-500/20 dark:border-gray-700">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={0}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                loop
                                autoplay={{
                                    delay: 3500,
                                    disableOnInteraction: false
                                }}
                                effect="slide"
                                modules={[Autoplay]}
                                className="w-full [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet-active]:bg-[#00AEEF] [&_.swiper-pagination]:bottom-1 xs:[&_.swiper-pagination]:bottom-2 sm:[&_.swiper-pagination]:bottom-3"
                                grabCursor={true}>
                                {[
                                    { src: "/computer-class.webp", alt: "Computer Class", fallback: "/computer-class.jpg" },
                                    { src: "/childclass.webp", alt: "Classroom", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/carigory-class.webp", alt: "Category Class", fallback: "/manzil logo.jpg" },
                                    { src: "/arabic-class.webp", alt: "Arabic Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/roboticsclass.webp", alt: "Robotics Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/languageclass.webp", alt: "Language Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/artsclass.webp", alt: "Arts Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/class-1.webp", alt: "Arabic Class Section", fallback: "/manzil institutte logo.jpg" },
                                ].map((image, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="relative w-full aspect-video xs:aspect-[4/3] sm:aspect-video md:aspect-[16/10] lg:aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <LazyImage
                                                src={image.src || "/placeholder.svg"}
                                                alt={image.alt}
                                                title={image.alt}
                                                fallback={image.fallback}
                                                width={800}
                                                height={450}
                                                className="object-cover w-full h-full transition-transform duration-700 transform hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            <div className={cn("absolute w-1/2 p-8 py-2 text-sm font-semibold text-white border rounded-md top-1 text-start -right-14 bg-black/40 backdrop-blur-sm border-white/20 sm:text-base", language === 'bn' ? "bengali-text" : "")}>

                                                {classTranslations[image.alt]}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Floating Stats Card with Animation */}
                        <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 xs:p-2.5 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300 animate-float">
                            <div className="text-center">
                                <div className={cn("text-lg font-bold text-gray-900 xs:text-xl sm:text-2xl dark:text-white", language === 'bn' ? "bengali-text" : "")}>
                                    {language === 'bn' ? '৩ in ১' : '3 in 1'}
                                </div>
                                <div className={cn("text-xs xs:text-sm text-gray-600 dark:text-gray-400 mt-0.5 font-medium", language === 'bn' ? "bengali-text" : "")}>
                                    {language === 'bn' ? 'শিক্ষা পদ্ধতি' : 'Education System'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Grid with Enhanced Design */}
                <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2 xs:gap-4 sm:gap-5 lg:gap-6 xs:mb-8 sm:mb-12 lg:mb-16">
                    {/* Vision */}
                    <div className="relative p-3 overflow-hidden transition-all duration-500 border border-gray-200 rounded-lg shadow-md group bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 sm:rounded-lg lg:rounded-xl hover:shadow-lg xs:p-4 sm:p-5 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600">
                        <div className="absolute top-0 right-0 w-12 h-12 transition-transform duration-500 rounded-full xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-green-400/10 blur-xl group-hover:scale-150"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2 xs:mb-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-400 rounded-lg blur opacity-20"></div>
                                    <div className="relative bg-green-100 dark:bg-green-900/30 p-2 xs:p-2.5 rounded-lg">
                                        <Target className="size-3 xs:size-3.5 sm:size-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <h3 className={cn("ml-2 xs:ml-3 text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white", language === 'bn' ? "bengali-text" : "")}>
                                    {language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision'}
                                </h3>
                            </div>
                            <p className={cn("text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed", language === 'bn' ? "bengali-text" : "")}>
                                {language === 'bn' ? (
                                    'এমন নেতৃত্ব তৈরি করা, যারা মুসলিম উম্মাহ ও বিশ্ব মানবতার যে কোনো অমীমাংসিত চ্যালেঞ্জ মোকাবেলা করতে সক্ষম। একই সাথে তারা ইসলামী ঐতিহ্যের প্রতি বিশ্বস্ত থেকে ঐশ্বরিক, বুদ্ধিবৃত্তিক, নৈতিক ও বিশ্বাসভিত্তিক নেতৃত্ব প্রদান করবে।'
                                ) : (
                                    'To create leadership capable of addressing any unresolved challenges facing the Muslim Ummah and humanity at large, while remaining faithful to Islamic traditions and providing divine, intellectual, moral, and faith-based leadership.'
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="group relative bg-gradient-to-br from-white to-[#00AEEF]/10 dark:from-gray-800 dark:to-[#00AEEF]/5 rounded-lg sm:rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition-all duration-500 p-3 xs:p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:border-[#00AEEF]/60 dark:hover:border-[#00AEEF]/40 overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-[#00AEEF]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2 xs:mb-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#00AEEF]/60 rounded-lg blur opacity-20"></div>
                                    <div className="relative bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 p-2 xs:p-2.5 rounded-lg">
                                        <Users className="size-3 xs:size-3.5 sm:size-4 text-[#00AEEF] dark:text-[#00AEEF]/80" />
                                    </div>
                                </div>
                                <h3 className={cn("ml-2 xs:ml-3 text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white", language === 'bn' ? "bengali-text" : "")}>
                                    {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
                                </h3>
                            </div>
                            <p className={cn("text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed", language === 'bn' ? "bengali-text" : "")}>
                                {language === 'bn' ? (
                                    'ঐতিহ্যবাহী ও সমসাময়িক শিক্ষার সমন্বয়ে এমন এক অনন্য শিক্ষা কারিকুলাম ও পরিবেশ গড়ে তোলা, যেখানে শিক্ষার্থীরা দ্বীন ও দুনিয়া - উভয় জগতের উৎকৃষ্ট জ্ঞান ও অভিজ্ঞতা অর্জন করতে সক্ষম।'
                                ) : (
                                    'To build a unique educational curriculum and environment through the integration of traditional and contemporary education, where students can acquire the best knowledge and experience of both religious and worldly affairs.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Business Verticals */}
                <LogoCloud />

            </AnimatedGroup>

        </section>
    )
}

