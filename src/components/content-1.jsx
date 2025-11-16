import { useLanguageStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Target, Users, CheckCircle, Sparkles, Award, BookOpen } from 'lucide-react'
import { LogoCloud } from './logo-cloud'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { Button } from './ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatedGroup } from './ui/animated-group'

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
        "Category Class": language === 'bn' ? "কারিগরি ক্লাস" : "Technical Class",
        "Arabic Class": language === 'bn' ? "আরবি ক্লাসরুম" : "Arabic Classroom",
        "Robotics Class": language === 'bn' ? "রোবোটিক্স ক্লাস" : "Robotics Class",
        "Language Class": language === 'bn' ? "ভাষা ক্লাসের একাংশ" : "Language Class Section",
        "Arts Class": language === 'bn' ? "শিল্প ক্লাস " : "Arts Class",
        "Arabic Class": language === 'bn' ? "আরবি ক্লাসের একাংশ" : "A Section of Arabic Class"
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
                className="relative mx-auto w-full max-w-7xl px-3 xs:px-4 sm:px-6 lg:px-8"
            >

                {/* Main Heading with Animation */}
                <div className="text-center mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
                    <div className="inline-flex items-center justify-center px-2 xs:px-3 py-1 mb-2 xs:mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Sparkles className="size-2.5 xs:size-3 sm:size-4 text-blue-600 dark:text-blue-400 mr-1 xs:mr-2" />
                        <span className={cn("text-xs font-semibold text-blue-600 dark:text-blue-400", language === 'bn' && "bengali-text")}>
                            {language === 'bn' ? 'আমাদের পরিচয়' : 'About Us'}
                        </span>
                    </div>
                    <h2 className={cn("text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 xs:mb-3 leading-tight", language === 'bn' && "bengali-text")}>
                        {language === 'bn' ? 'মানযিল সম্পর্কে' : 'About Manzil'}
                    </h2>
                    <div className="flex items-center justify-center gap-1 xs:gap-2">
                        <div className="w-4 xs:w-6 sm:w-8 h-1 bg-gradient-to-r from-transparent to-blue-600 rounded-full"></div>
                        <div className="w-6 xs:w-8 sm:w-12 h-1 bg-blue-600 rounded-full"></div>
                        <div className="w-4 xs:w-6 sm:w-8 h-1 bg-gradient-to-l from-transparent to-blue-600 rounded-full"></div>
                    </div>
                </div>

                {/* Image + Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 items-start mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
                    {/* Content Side */}
                    <div className="space-y-4 xs:space-y-3 flex flex-col justify-center sm:space-y-4 order-2 lg:order-1">
                        <div className="space-y-1.5 xs:space-y-2 flex flex-col items-center justify-center">
                            <div className="inline-flex items-center mb-2  px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                                <BookOpen className="size-2.5 xs:size-3 text-blue-600 dark:text-blue-400 mr-1" />
                                <span className={cn("text-xs font-semibold text-blue-600 dark:text-blue-400", language === 'bn' && "bengali-text")}>
                                    {language === 'bn' ? 'আমাদের যাত্রা' : 'Our Journey'}
                                </span>
                            </div>
                            <h3 className={cn("text-xl xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight", language === 'bn' && "bengali-text")}>
                                {language === 'bn' ? 'একটি মহৎ ভাবনা থেকে যাত্রা' : 'Journey from a Noble Thought'}
                            </h3>
                            <p className={cn("text-base sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed", language === 'bn' && "bengali-text")}>
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
                                                <div className="absolute inset-0 bg-green-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <CheckCircle className="relative size-3 xs:size-3.5 sm:size-4 text-green-500" />
                                            </div>
                                        </div>
                                        <span className={cn("text-base sm:text-base text-gray-700 dark:text-gray-200 leading-snug", language === 'bn' && "bengali-text")}>
                                            {language === 'bn' ? point.bn : point.en}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button with Glow Effect */}
                        <div className="pt-1 flex items-center justify-center xs:pt-2">
                            <Link to='/campus' className={cn(
                                "group px-3 xs:px-4 py-2 text-center rounded-lg font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 bg-transparent hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base",
                                language === 'bn' && "bengali-text"
                            )}
                            >
                                {/* cspell:disable-next-line */}
                                {language === 'bn' ? 'আমাদের কেম্পাস দেখুন' : 'See Our Campus'}

                            </Link>
                        </div>
                    </div>

                    {/* Image Side with Enhanced Effects */}
                    <div className="relative order-1 lg:order-2">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg xs:rounded-lg sm:rounded-xl lg:rounded-2xl transform rotate-0 xs:rotate-1 sm:rotate-3 lg:rotate-6 scale-95 xs:scale-100 sm:scale-105 blur-xl"></div>

                        {/* Main Campus Image Swiper */}
                        <div className="relative rounded-lg xs:rounded-lg sm:rounded-xl lg:rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-shadow duration-500 border-2 border-white dark:border-gray-700">
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
                                className="w-full [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet-active]:bg-blue-600 [&_.swiper-pagination]:bottom-1 xs:[&_.swiper-pagination]:bottom-2 sm:[&_.swiper-pagination]:bottom-3"
                                grabCursor={true}>
                                {[
                                    { src: "/computer-class.jpg", alt: "Computer Class", fallback: "/computer-class.jpg" },
                                    { src: "/childclass.jpg", alt: "Classroom", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/carigory-class.jpg", alt: "Category Class", fallback: "/manzil logo.jpg" },
                                    { src: "/arabic-class.jpg", alt: "Arabic Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/roboticsclass.jpg", alt: "Robotics Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/languageclass.jpg", alt: "Language Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/artsclass.jpg", alt: "Arts Class", fallback: "/manzil institutte logo.jpg" },
                                    { src: "/class-1.jpg", alt: "Arabic Class", fallback: "/manzil institutte logo.jpg" },
                                ].map((image, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="relative w-full aspect-video xs:aspect-[4/3] sm:aspect-video md:aspect-[16/10] lg:aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <img
                                                src={image.src || "/placeholder.svg"}
                                                alt={image.alt}
                                                title={image.alt}
                                                loading="lazy"
                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    const target = e.target;
                                                    target.src = image.fallback;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            <div className="absolute top-1 text-start p-8 -right-14 w-1/2 bg-black/40 backdrop-blur-sm border border-white/20 text-white py-2 font-semibold text-sm sm:text-base rounded-md">

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
                                <div className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white ">
                                    {language === 'bn' ? '৩ in ১' : '3 in 1'}
                                </div>
                                <div className={cn("text-xs xs:text-sm text-gray-600 dark:text-gray-400 mt-0.5 font-medium", language === 'bn' && "bengali-text")}>
                                    {language === 'bn' ? 'শিক্ষা পদ্ধতি' : 'Education System'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Grid with Enhanced Design */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:gap-6 mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
                    {/* Vision */}
                    <div className="group relative bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-lg sm:rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition-all duration-500 p-3 xs:p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-green-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2 xs:mb-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-400 rounded-lg blur opacity-20"></div>
                                    <div className="relative bg-green-100 dark:bg-green-900/30 p-2 xs:p-2.5 rounded-lg">
                                        <Target className="size-3 xs:size-3.5 sm:size-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <h3 className={cn("ml-2 xs:ml-3 text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white", language === 'bn' && "bengali-text")}>
                                    {language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision'}
                                </h3>
                            </div>
                            <p className={cn("text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed", language === 'bn' && "bengali-text")}>
                                {language === 'bn' ? (
                                    'এমন নেতৃত্ব তৈরি করা, যারা মুসলিম উম্মাহ ও বিশ্ব মানবতার যে কোনো অমীমাংসিত চ্যালেঞ্জ মোকাবেলা করতে সক্ষম। একই সাথে তারা ইসলামী ঐতিহ্যের প্রতি বিশ্বস্ত থেকে ঐশ্বরিক, বুদ্ধিবৃত্তিক, নৈতিক ও বিশ্বাসভিত্তিক নেতৃত্ব প্রদান করবে।'
                                ) : (
                                    'To create leadership capable of addressing any unresolved challenges facing the Muslim Ummah and humanity at large, while remaining faithful to Islamic traditions and providing divine, intellectual, moral, and faith-based leadership.'
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="group relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-lg sm:rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition-all duration-500 p-3 xs:p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-blue-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center mb-2 xs:mb-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-400 rounded-lg blur opacity-20"></div>
                                    <div className="relative bg-blue-100 dark:bg-blue-900/30 p-2 xs:p-2.5 rounded-lg">
                                        <Users className="size-3 xs:size-3.5 sm:size-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <h3 className={cn("ml-2 xs:ml-3 text-base xs:text-lg sm:text-xl font-bold text-gray-900 dark:text-white", language === 'bn' && "bengali-text")}>
                                    {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
                                </h3>
                            </div>
                            <p className={cn("text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed", language === 'bn' && "bengali-text")}>
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

