import { Users, Star, Clock, GraduationCap, BookText, Layers, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useLanguageStore } from '@/lib/store'
import { cn } from '@/lib/utils'
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

export default function MICCurriculum() {
    const { language } = useLanguageStore()

    const getColorClasses = (color) => {
        const colorMap = {
            blue: {
                hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600',
                bg50: 'bg-blue-50 dark:bg-blue-900/30',
                border200: 'border-blue-200 dark:border-blue-800',
                text600: 'text-blue-600 dark:text-blue-400',
                text700: 'text-blue-700 dark:text-blue-300',
                bg500: 'bg-blue-500',
                border500: 'border-blue-500',
                bg100: 'bg-blue-100 dark:bg-blue-900/30',
                text400: 'text-blue-400'
            },
            green: {
                hoverBorder: 'hover:border-green-300 dark:hover:border-green-600',
                bg50: 'bg-green-50 dark:bg-green-900/30',
                border200: 'border-green-200 dark:border-green-800',
                text600: 'text-green-600 dark:text-green-400',
                text700: 'text-green-700 dark:text-green-300',
                bg500: 'bg-green-500',
                border500: 'border-green-500',
                bg100: 'bg-green-100 dark:bg-green-900/30',
                text400: 'text-green-400'
            },
            purple: {
                hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
                bg50: 'bg-purple-50 dark:bg-purple-900/30',
                border200: 'border-purple-200 dark:border-purple-800',
                text600: 'text-purple-600 dark:text-purple-400',
                text700: 'text-purple-700 dark:text-purple-300',
                bg500: 'bg-purple-500',
                border500: 'border-purple-500',
                bg100: 'bg-purple-100 dark:bg-purple-900/30',
                text400: 'text-purple-400'
            },
            orange: {
                hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-600',
                bg50: 'bg-orange-50 dark:bg-orange-900/30',
                border200: 'border-orange-200 dark:border-orange-800',
                text600: 'text-orange-600 dark:text-orange-400',
                text700: 'text-orange-700 dark:text-orange-300',
                bg500: 'bg-orange-500',
                border500: 'border-orange-500',
                bg100: 'bg-orange-100 dark:bg-orange-900/30',
                text400: 'text-orange-400'
            }
        }
        return colorMap[color] || colorMap.blue
    }

    const levels = [
        {
            level: language === 'bn' ? "লেভেল ১" : "Level 1",
            age: language === 'bn' ? "৪-৮ বছর" : "4-8 Years",
            duration: language === 'bn' ? "৫ বছর" : "5 Years",
            description: language === 'bn' ? "মৌলিক শিক্ষার ভিত্তি প্রস্তুত" : "Foundation of Basic Education",
            features: language === 'bn' ?
                ["কায়েদা ও নাযেরা", "বেসিক ভাষা শিক্ষা", "খেলাধুলা ও শারীরিক বিকাশ"] :
                ["Qaida & Nazira", "Basic Language Skills", "Sports & Physical Development"],
            color: "blue"
        },
        {
            level: language === 'bn' ? "লেভেল ২" : "Level 2",
            age: language === 'bn' ? "৯-১৩ বছর" : "9-13 Years",
            duration: language === 'bn' ? "৫ বছর" : "5 Years",
            description: language === 'bn' ? "হিফজ ও মৌলিক শিক্ষার সমন্বয়" : "Hifz & Basic Education Integration",
            features: language === 'bn' ?
                ["হিফজুল কুরআন", "আন্তর্জাতিক কারিকুলাম", "কারিগরি হাতেখড়ি"] :
                ["Quran Memorization", "International Curriculum", "Technical Introduction"],
            color: "orange"
        },
        {
            level: language === 'bn' ? "লেভেল ৩" : "Level 3",
            age: language === 'bn' ? "১৪-১৫ বছর" : "14-15 Years",
            duration: language === 'bn' ? "২ বছর" : "2 Years",
            description: language === 'bn' ? "বিশেষায়িত শিক্ষার সূচনা" : "Beginning of Specialized Education",
            features: language === 'bn' ?
                ["দরসে নিজামী", "O-Level প্রস্তুতি", "এডভান্সড কারিগরি"] :
                ["Dars-e-Nizami", "O-Level Preparation", "Advanced Technical"],
            color: "purple"
        },
        {
            level: language === 'bn' ? "লেভেল ৪-৬" : "Level 4-6",
            age: language === 'bn' ? "১৬-২৫ বছর" : "16-25 Years",
            duration: language === 'bn' ? "১৫ বছর" : "15 Years",
            description: language === 'bn' ? "পেশাগত ও উচ্চতর শিক্ষা" : "Professional & Higher Education",
            features: language === 'bn' ?
                ["আলেম/মুফতি", "বিশ্ববিদ্যালয় শিক্ষা", "পেশাগত প্রশিক্ষণ"] :
                ["Alim/Mufti", "University Education", "Professional Training"],
            color: "green"
        }
    ]

    const streams = [
        {
            icon: BookText,
            title: language === 'bn' ? "মাদরাসা শিক্ষা" : "Madrasa Education",
            description: language === 'bn' ?
                "হিফজ, তাফসীর, হাদীস, ফিকহ সহ সম্পূর্ণ দরসে নিজামী" :
                "Complete Dars-e-Nizami including Hifz, Tafsir, Hadith, Fiqh",
            color: "blue",
            features: language === 'bn' ?
                ["হিফজুল কুরআন", "তাজভিদ", "ইসলামিক স্টাডিজ"] :
                ["Quran Memorization", "Tajweed", "Islamic Studies"]
        },
        {
            icon: GraduationCap,
            title: language === 'bn' ? "জেনারেল শিক্ষা" : "General Education",
            description: language === 'bn' ?
                "কেমব্রিজ ও NCTB কারিকুলামে আন্তর্জাতিক মানের শিক্ষা" :
                "International standard education with Cambridge & NCTB curriculum",
            color: "orange",
            features: language === 'bn' ?
                ["সাইন্স & আর্টস", "ইংলিশ মিডিয়াম", "বিসিএস প্রস্তুতি"] :
                ["Science & Arts", "English Medium", "BCS Preparation"]
        },
        {
            icon: Layers,
            title: language === 'bn' ? "কারিগরি শিক্ষা" : "Technical Education",
            description: language === 'bn' ?
                "আধুনিক প্রযুক্তি ও কারিগরি দক্ষতা উন্নয়ন" :
                "Modern technology and technical skills development",
            color: "purple",
            features: language === 'bn' ?
                ["কম্পিউটার সাইন্স", "রোবোটিক্স", "গ্রাফিক ডিজাইন"] :
                ["Computer Science", "Robotics", "Graphic Design"]
        }
    ]

    return (
        <section id="mic-curriculum" dir="ltr" className="relative py-6 md:py-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className="relative mx-auto max-w-7xl space-y-16 px-6">
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
                  className="text-center space-y-8"
                >

                {/* Header Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className={cn(
                            "text-sm font-medium text-blue-700 dark:text-blue-300",
                            language === 'bn' && "bengali-text"
                        )}>
                            {language === 'bn' ? "সমন্বিত শিক্ষা কারিকুলাম" : "Integrated Education Curriculum"}
                        </span>
                    </div>

                    <h2 className={cn(
                        "max-w-4xl mx-auto text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight",
                        language === 'bn' && "bengali-text"
                    )}>
                        {language === 'bn' ? "মানযিল ইন্টারন্যাশনাল" : "Manzil International"}
                        <span className="text-blue-600 dark:text-blue-400 mx-2">
                            {language === 'bn' ? "কারিকুলাম (MIC-1)" : "Curriculum (MIC-1)"}
                        </span>
                    </h2>

                    <p className={cn(
                        "max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed",
                        language === 'bn' && "bengali-text"
                    )}>
                        {language === 'bn' ? "৬টি লেভেলে বিভক্ত ২২ বছরের একটি পূর্ণাঙ্গ শিক্ষা ব্যবস্থা" : "A complete 22-year education system divided into 6 levels"}
                    </p>
                </div>

                {/* Curriculum Levels Grid */}
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                >
                    {levels.map((item, index) => {
                        const colorClasses = getColorClasses(item.color)
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl min-h-[280px]",
                                    colorClasses.hoverBorder
                                )}
                            >
                                {/* Level Badge */}
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4",
                                    colorClasses.bg50,
                                    colorClasses.border200
                                )}>
                                    <Star className={cn("w-3 h-3", colorClasses.text600)} />
                                    <span className={cn("text-sm font-medium", colorClasses.text700)}>
                                        {item.level}
                                    </span>
                                </div>

                                {/* Age & Duration */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className={cn(
                                            "text-base text-gray-600 dark:text-gray-400",
                                            language === 'bn' && "bengali-text"
                                        )}>
                                            {item.age}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className={cn(
                                            "text-base text-gray-600 dark:text-gray-400",
                                            language === 'bn' && "bengali-text"
                                        )}>
                                            {item.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <h3 className={cn(
                                    "text-lg font-semibold text-gray-900 dark:text-white mb-3",
                                    language === 'bn' && "bengali-text"
                                )}>
                                    {item.description}
                                </h3>

                                {/* Features */}
                                <ul className="space-y-2">
                                    {item.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", colorClasses.bg500)}></div>
                                            <span className={cn(
                                                "text-base text-gray-600 dark:text-gray-400",
                                                language === 'bn' && "bengali-text"
                                            )}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Hover Effect */}
                                <div className={cn(
                                    "absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                                    colorClasses.border500
                                )}></div>
                            </div>
                        )
                    })}
                </AnimatedGroup>

                {/* Three Streams Section */}
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.15,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="hidden sm:grid gap-8 lg:grid-cols-3 lg:gap-12"
                >
                    {streams.map((stream, index) => {
                        const streamColorClasses = getColorClasses(stream.color)
                        return (
                            <div
                                key={index}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl min-h-[320px]"
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300",
                                    streamColorClasses.bg100
                                )}>
                                    <stream.icon className={cn("w-8 h-8", streamColorClasses.text600)} />
                                </div>

                                {/* Content */}
                                <h3 className={cn(
                                    "text-2xl font-bold text-gray-900 dark:text-white mb-4",
                                    language === 'bn' && "bengali-text"
                                )}>
                                    {stream.title}
                                </h3>

                                <p className={cn(
                                    "text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-base",
                                    language === 'bn' && "bengali-text"
                                )}>
                                    {stream.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {stream.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", streamColorClasses.bg500)}></div>
                                            <span className={cn(
                                                "text-gray-700 dark:text-gray-300 text-base font-medium",
                                                language === 'bn' && "bengali-text"
                                            )}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Bottom Border Effect */}
                                <div className={cn(
                                    "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                                    streamColorClasses.bg500
                                )}></div>
                            </div>
                        )
                    })}
                </AnimatedGroup>

                {/* Bottom CTA */}
                <div className="text-center flex justify-center items-center pt-8">
                        <Link to="/curriculum">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 sm:px-5 py-3 sm:py-2 transition-colors duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                                <span className={cn("text-sm font-medium", language === 'bn' && "bengali-text")}>
                                    {language === 'bn' ? "সম্পূর্ণ কারিকুলাম দেখুন" : "View Curriculum"}
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                </div>
                </AnimatedGroup>
            </div>
        </section>
    )
}