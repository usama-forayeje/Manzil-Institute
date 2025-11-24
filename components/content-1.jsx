"use client";

import { useLanguageStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
    Target,
    Users,
    CheckCircle,
    Sparkles,
    BookOpen,
    GraduationCap,
    Building,
    HeartHandshake,
    ArrowRight,
} from "lucide-react";
import { LogoCloud } from "@/components/logo-cloud";
import { LazyImage } from "@/components/ui/lazy-image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: "blur(12px)",
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

export default function ContentSection() {
    const { language } = useLanguageStore();



    const contentData = {
        introduction: {
            bn: '“মানযিল" একটি মহৎ ভাবনা থেকে উদ্ভূত নাম। ইসলামী মূল্যবোধ ও আধুনিক উন্নয়নের সমন্বয়ে এটি একটি আদর্শ সমাজ গড়ার স্বপ্ন। এটি শুধু প্রতিষ্ঠান নয়, বরং আল্লাহভীতি ও মানবকল্যাণকে কেন্দ্রে রেখে দুনিয়া ও আখিরাতে সফল একটি আদর্শ জাতি গড়ার দিকনির্দেশনা। ইনশাআল্লাহ।',
            en: '"Manzil" is born from a noble thought—a dream to build an ideal society by blending Islamic values and development. More than an institution, it is a guidance centered on God-consciousness and human welfare, aiming to build a nation successful in both worlds. InshaAllah.'
        },
        journey: {
            bn: '“মানযিল গ্রুপের" যাত্রা শুরু হয় ইসলামিক ও সামাজিক কার্যক্রম দিয়ে। বর্তমানে শিক্ষা, ব্যবসা, আবাসন, চিকিৎসা ও সমাজসেবাসহ প্রতিটি খাতে আমাদের পরিসর বিস্তৃত হয়েছে। আমরা প্রতিটি ক্ষেত্রেই আমানত ও দায়িত্ববোধের সাথে কাজ করে যাচ্ছি।',
            en: 'Starting with Islamic and social activities, "Manzil Group" has expanded into education, business, healthcare, and housing. We operate in every sector with a deep sense of responsibility and trustworthiness.'
        },
        educationFocus: {
            bn: "মানযিল গ্রুপের কেন্দ্রবিন্দুতে রয়েছে শিক্ষা—যা জাতির আত্মা ও ভবিষ্যতের আলো। এই বিশ্বাস থেকেই মানযিল ইনস্টিটিউট (বালক শাখা) এবং প্রস্তাবিত বালিকা শাখার মাধ্যমে আমাদের শিক্ষা কার্যক্রমের সূচনা।",
            en: "Education lies at the heart of Manzil Group—it is the nation's soul and future light. Driven by this belief, we launched our educational journey with Manzil Institute (Male branch) and the proposed Female branch."
        },
        belief: {
            bn: "আমরা বিশ্বাস করি, জাতির পরিবর্তনে প্রয়োজন সুশিক্ষা। যে শিক্ষা মানুষকে শুধু চাকুরিজীবী নয়, বরং নৈতিক ও দায়িত্বশীল মানুষ হিসেবে গড়ে তোলে। মানযিল ইনস্টিটিউট আগামী প্রজন্মের জন্য সেই নৈতিকতার পাঠশালা।",
            en: "We believe transforming a nation requires education that builds ethical and responsible human beings, not just jobholders. Manzil Institute serves as this moral school for our future generation."
        },
        chairman: {
            bn: "বিজ্ঞ ওলামায়ে কেরাম ও তরুণ আলেমদের দীর্ঘ গবেষণার ফলে দেশে প্রথম এমন এক ব্যতিক্রমধর্মী মাদরাসা চালু হয়েছে, যেখানে ধর্মীয়, সাধারণ ও কারিগরি শিক্ষার আধুনিক ও বিজ্ঞানসম্মত সমন্বয় ঘটানো হয়েছে।",
            en: "Through extensive research by scholars, we launched the country's first exceptional madrasa that scientifically integrates Religious, General, and Technical education."
        },
        studentOutcome: {
            bn: "মানযিল ইনস্টিটিউটের ছাত্ররা কেবল হাফেজ বা আলেম নয়; তারা ডাক্তার, ইঞ্জিনিয়ার, গবেষক ও বিসিএস ক্যাডার হয়ে জাতীয় ও আন্তর্জাতিক অঙ্গনে নিজেদের অবস্থান গড়তে সক্ষম হবে, ইনশাআল্লাহ।",
            en: "Students of Manzil Institute will not only be Hafiz or Alim but also Doctors, Engineers, Researchers, and BCS cadres, establishing themselves on national and international platforms. InshaAllah."
        },
        alhamdulillah: {
            bn: '"আলহামদুলিল্লাহ", দীর্ঘ গবেষণায় আমরা এমন এক মাদরাসা চালু করেছি যেখানে কদিম নেসাব ও আন্তর্জাতিক মানের কারিকুলামের সমন্বয়ে দ্বীনি ও জাগতিক শিক্ষার অপূর্ব মিলন ঘটানো হয়েছে।',
            en: '"Alhamdulillah", through extensive research, we established a unique madrasa integrating traditional curriculum with international standards, seamlessly blending religious and modern education.'
        }
    };

    const visionMission = {
        vision: {
            bn: "এমন নেতৃত্ব তৈরি করা, যারা মুসলিম উম্মাহ ও বিশ্ব মানবতার যে কোনো অমীমাংসিত চ্যালেঞ্জ মোকাবেলা করতে সক্ষম। একই সাথে তারা ইসলামী ঐতিহ্যের প্রতি বিশ্বস্ত থেকে ঐশ্বরিক, বুদ্ধিবৃত্তিক, নৈতিক ও বিশ্বাসভিত্তিক নেতৃত্ব প্রদান করবে।",
            en: "To create leadership capable of addressing any unresolved challenges facing the Muslim Ummah and humanity at large, while remaining faithful to Islamic traditions and providing divine, intellectual, moral, and faith-based leadership.",
        },
        mission: {
            bn: "ঐতিহ্যবাহী ও সমসাময়িক শিক্ষার সমন্বয়ে এমন এক অনন্য শিক্ষা কারিকুলাম ও পরিবেশ গড়ে তোলা, যেখানে শিক্ষার্থীরা দ্বীন ও দুনিয়া - উভয় জগতের উৎকৃষ্ট জ্ঞান ও অভিজ্ঞতা অর্জন করতে সক্ষম।",
            en: "To build a unique educational curriculum and environment through the integration of traditional and contemporary education, where students can acquire the best knowledge and experience of both religious and worldly affairs.",
        },
    };

    const features = [
        {
            bn: "মাদরাসা, জেনারেল এবং কারিগরি শিক্ষার সমন্বয়",
            en: "Integration of Madrasa, General, and Technical Education"
        },
        {
            bn: "ফিউচার-রেডি ল্যাব: রোবোটিক্স, ড্রোন ইঞ্জিনিয়ারিং ও অত্যাধুনিক কম্পিউটার ল্যাব সুবিধা।",
            en: "Future-Ready Labs: Equipped with Robotics, Drone Engineering, and advanced Computer Labs."
        },
        {
            bn: "প্রিমিয়াম ক্যাম্পাস: সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত আবাসন ও আধুনিক ক্লাসরুম ব্যবস্থা।",
            en: "Premium Campus: Fully air-conditioned accommodation and modern classrooms."
        },
        {
            bn: "বহুভাষী দক্ষতা: আরবি ও ইংরেজির পাশাপাশি ৫টি ভাষায় পারদর্শী করার বিশেষ ল্যাঙ্গুয়েজ ক্লাব।",
            en: "Multi-Lingual Skills: Specialized clubs for mastering 5 languages including Arabic & English."
        },
        {
            bn: "স্মার্ট স্কিল ডেভেলপমেন্ট: গ্রাফিক্স, ভিডিও এডিটিং, ক্যালিগ্রাফি ও কৃষি শিক্ষার বাস্তব প্রশিক্ষণ।",
            en: "Smart Skill Development: Practical training in Graphics, Video Editing, Calligraphy, and Agriculture."
        },
        {
            bn: "সারভাইভাল ট্রেনিং: সাঁতার এবং আগুন বা দুর্যোগ থেকে আত্মরক্ষার বিশেষ প্রশিক্ষণ।",
            en: "Survival Training: Specialized training for swimming and disaster survival techniques."
        },
        {
            bn: "নৈতিক তারবিয়াত: সাপ্তাহিক ইসলাহি মজলিস ও সুন্নাহর আলোকে আমলি জিন্দেগি গঠন।",
            en: "Moral Tarbiyah: Weekly Islah sessions and character building based on Sunnah."
        }
    ];

    const classTranslations = {
        "Computer Class": language === "bn" ? "কম্পিউটার ক্লাস" : "Computer Class",
        Classroom:
            language === "bn" ? "আরবি ক্লাসের একাংশ" : "A Section of Arabic Class",
        "Category Class": language === "bn" ? "প্রযুক্তি ক্লাস" : "Technical Class",
        "Arabic Class": language === "bn" ? "আরবি ক্লাসরুম" : "Arabic Classroom",
        "Robotics Class": language === "bn" ? "রোবোটিক্স ক্লাস" : "Robotics Class",
        "Language Class":
            language === "bn" ? "ভাষা ক্লাসের একাংশ" : "Language Class Section",
        "Arts Class": language === "bn" ? "শিল্প ক্লাস" : "Arts Class",
        "Arabic Class Section":
            language === "bn" ? "আরবি ক্লাসের একাংশ" : "A Section of Arabic Class",
    };

    return (
        <section
            id="about"
            className="relative scroll-mt-[100px] py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
            dir="ltr"
        >
            <AnimatedGroup
                variants={{
                    container: {
                        visible: {
                            transition: { staggerChildren: 0.08, delayChildren: 0.2 },
                        },
                    },
                    ...transitionVariants,
                }}
                className="relative w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
            >
                {/* ===== HEADER ===== */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center px-3 py-1.5 mb-4 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-100 dark:border-blue-900/50">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className={cn("text-sm font-semibold text-blue-700 dark:text-blue-300", language === "bn" && "bengali-text")}>
                            {language === "bn" ? "সংক্ষিপ্ত পরিচিতি" : "Brief Introduction"}
                        </span>
                    </div>
                    <h2 className={cn("text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight", language === "bn" && "bengali-text")}>
                        {language === "bn" ? "মানযিল সম্পর্কে" : "About Manzil"}
                    </h2>
                    <p className={cn("text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed", language === "bn" && "bengali-text")}>
                        {language === "bn"
                            ? "আবাসন, খাদ্য ও কৃষি, ব্যবসা, শিক্ষা, সামাজিক সেবায় বিশ্বমানের উদ্যোগ"
                            : "World-class initiatives in housing, food & agriculture, business, education, and social services"}
                    </p>
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-8 h-1.5 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                        <div className="w-12 h-1.5 bg-blue-500 rounded-full"></div>
                        <div className="w-8 h-1.5 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
                    </div>
                </div>

                {/* ===== OVERVIEW CARDS ===== */}
                <div className="grid gap-6 lg:grid-cols-2 mb-16">
                    <div className="group bg-white dark:bg-slate-800 rounded-xl p-7 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-white mb-3", language === "bn" && "bengali-text")}>
                                    {language === "bn" ? "পরিচিতি" : "Introduction"}
                                </h3>
                                <p className={cn("text-gray-600 dark:text-gray-400 leading-relaxed text-sm", language === "bn" && "bengali-text")}>
                                    {language === "bn" ? contentData.introduction.bn : contentData.introduction.en}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-white dark:bg-slate-800 rounded-xl p-7 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:border-green-200 dark:hover:border-green-900/50 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-white mb-3", language === "bn" && "bengali-text")}>
                                    {language === "bn" ? "আমাদের যাত্রা" : "Our Journey"}
                                </h3>
                                <p className={cn("text-gray-600 dark:text-gray-400 leading-relaxed text-sm", language === "bn" && "bengali-text")}>
                                    {language === "bn" ? contentData.journey.bn : contentData.journey.en}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== MANZIL INSTITUTE SECTION ===== */}
                <div className="mb-20">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center justify-center px-3 py-1.5 mb-4 bg-green-50 dark:bg-green-950/30 rounded-full border border-green-100 dark:border-green-900/50">
                            <GraduationCap className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                            <span className={cn("text-sm font-semibold text-green-700 dark:text-green-300", language === "bn" && "bengali-text")}>
                                {language === "bn" ? "শিক্ষা প্রতিষ্ঠান" : "Educational Institution"}
                            </span>
                        </div>
                        <h3 className={cn("text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4", language === "bn" && "bengali-text")}>
                            {language === "bn" ? "মানযিল ইনস্টিটিউট" : "Manzil Institute"}
                        </h3>
                        <p className={cn("text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed", language === "bn" && "bengali-text")}>
                            {language === "bn" ? contentData.educationFocus.bn : contentData.educationFocus.en}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-2 items-center">
                        {/* Content */}
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                                <h4 className={cn("text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", language === "bn" && "bengali-text")}>
                                    <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                                    {language === "bn" ? "মূল বৈশিষ্ট্য" : "Key Features"}
                                </h4>
                                <div className="space-y-3">
                                    {features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 group/item">
                                            <div className="flex-shrink-0 mt-1">
                                                <CheckCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover/item:scale-110 transition-transform" />
                                            </div>
                                            <span className={cn("text-gray-700 dark:text-gray-300 text-sm leading-relaxed", language === "bn" && "bengali-text")}>
                                                {language === "bn" ? feature.bn : feature.en}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30">
                                    <Link href="/curriculum" className="flex items-center gap-2">
                                        {language === "bn" ? "কারিকুলাম" : "Curriculum"}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="rounded-lg h-10 text-sm font-medium border-blue-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/50">
                                    <Link href="/admission" className="flex items-center gap-2">
                                        {language === "bn" ? "ভর্তি তথ্য" : "Admission"}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        {/* Image Side with Enhanced Effects */}
                        <div className="relative order-1 lg:order-2 w-full max-w-2xl mx-auto lg:mx-0">
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
                                        delay: 4000,
                                        disableOnInteraction: false,
                                    }}
                                    effect="slide"
                                    modules={[Autoplay]}
                                    className="w-full [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet-active]:bg-[#00AEEF] [&_.swiper-pagination]:bottom-2 xs:[&_.swiper-pagination]:bottom-3 sm:[&_.swiper-pagination]:bottom-4"
                                    grabCursor={true}
                                >
                                    {[
                                        {
                                            src: "/computer-class.webp",
                                            alt: "Computer Class",
                                            fallback: "/computer-class.jpg",
                                        },
                                        {
                                            src: "/childclass.webp",
                                            alt: "Classroom",
                                            fallback: "/manzil institutte logo.jpg",
                                        },
                                        {
                                            src: "/carigory-class.webp",
                                            alt: "Category Class",
                                            fallback: "/manzil logo.jpg",
                                        },
                                        {
                                            src: "/arabic-class.webp",
                                            alt: "Arabic Class",
                                            fallback: "/manzil institutte logo.jpg",
                                        },
                                        {
                                            src: "/roboticsclass.webp",
                                            alt: "Robotics Class",
                                            fallback: "/manzil institutte logo.jpg",
                                        },
                                        {
                                            src: "/languageclass.webp",
                                            alt: "Language Class",
                                            fallback: "/manzil institutte logo.jpg",
                                        },
                                        {
                                            src: "/artsclass.webp",
                                            alt: "Arts Class",
                                            fallback: "/manzil institutte logo.jpg",
                                        },
                                        {
                                            src: "/class-1.webp",
                                            alt: "Arabic Class Section",
                                            fallback: "/manzil institutte logo.jpg",
                                        },
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
                                                <div
                                                    className={cn(
                                                        "absolute w-1/2 p-8 py-2 text-sm font-semibold text-white border rounded-md top-1 text-start -right-14 bg-black/40 backdrop-blur-sm border-white/20 sm:text-base",
                                                        language === "bn" ? "bengali-text" : ""
                                                    )}
                                                >
                                                    {classTranslations[image.alt]}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                            </div>
                            {/* Floating Stats Card */}
                            <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 xs:p-2.5 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300 animate-float">
                                <div className="text-center">
                                    <div
                                        className={cn(
                                            "text-lg font-bold text-gray-900 xs:text-xl sm:text-2xl dark:text-white",
                                            language === "bn" ? "bengali-text" : ""
                                        )}
                                    >
                                        {language === "bn" ? "৩ in ১" : "3 in 1"}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-xs xs:text-sm text-gray-600 dark:text-gray-400 mt-0.5 font-medium",
                                            language === "bn" ? "bengali-text" : ""
                                        )}
                                    >
                                        {language === "bn" ? "শিক্ষা পদ্ধতি" : "Education System"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== ALHAMDULILLAH ===== */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-8 mb-12 border border-blue-100 dark:border-blue-900/50">
                    <p className={cn("text-gray-700 dark:text-gray-300 leading-relaxed text-center", language === "bn" && "bengali-text")}>
                        {language === "bn" ? contentData.alhamdulillah.bn : contentData.alhamdulillah.en}
                    </p>
                </div>

                {/* ===== VISION & MISSION ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className={cn("text-xl font-semibold text-gray-900 dark:text-white", language === "bn" && "bengali-text")}>
                                {language === "bn" ? "আমাদের ভিশন" : "Our Vision"}
                            </h3>
                        </div>
                        <p className={cn("text-gray-600 dark:text-gray-400 leading-relaxed text-sm", language === "bn" && "bengali-text")}>
                            {language === "bn" ? visionMission.vision.bn : visionMission.vision.en}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className={cn("text-xl font-semibold text-gray-900 dark:text-white", language === "bn" && "bengali-text")}>
                                {language === "bn" ? "আমাদের মিশন" : "Our Mission"}
                            </h3>
                        </div>
                        <p className={cn("text-gray-600 dark:text-gray-400 leading-relaxed text-sm", language === "bn" && "bengali-text")}>
                            {language === "bn" ? visionMission.mission.bn : visionMission.mission.en}
                        </p>
                    </div>
                </div>

                {/* ===== LOGO CLOUD ===== */}
                <div className=" border-t border-gray-200 dark:border-slate-700">
                    <LogoCloud />
                </div>
            </AnimatedGroup>
        </section>
    );
}







