import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Users, Home, Wifi, Car, Shield, Utensils, BookOpen, GraduationCap, Award, Star, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
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

export const Route = createFileRoute('/campus')({
  component: CampusPage,
  head: () => ({
    meta: [
      {
        title: 'Manzil International Institute Campus Bangladesh - Facilities & Infrastructure',
      },
      {
        name: 'description',
        content: 'Explore Manzil International Institute campus facilities including modern classrooms, residential hostels, sports facilities, and advanced infrastructure for MIC Curriculum education.',
      },
      {
        name: 'keywords',
        content: 'Manzil Institute campus, campus facilities Bangladesh, Islamic school infrastructure, MIC Curriculum campus, residential hostel, sports facilities Bangladesh',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'Manzil International Institute Campus - Modern Facilities & Infrastructure',
      },
      {
        property: 'og:description',
        content: 'State-of-the-art campus with modern classrooms, residential facilities, sports grounds, and advanced infrastructure for comprehensive Islamic education.',
      },
      {
        property: 'og:url',
        content: 'https://institute.manzilgroupbd.com/campus',
      },
      {
        property: 'og:image',
        content: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Manzil Institute Campus - Modern Facilities & Infrastructure',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter Cards
      {
        name: 'twitter:title',
        content: 'Manzil Institute Campus - Modern Facilities',
      },
      {
        name: 'twitter:description',
        content: 'Explore our state-of-the-art campus facilities designed for comprehensive Islamic education and modern learning.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://institute.manzilgroupbd.com/campus',
      },
      // hreflang tags for English and Bangla versions
      {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://institute.manzilgroupbd.com/campus',
      },
      {
        rel: 'alternate',
        hreflang: 'bn',
        href: 'https://institute.manzilgroupbd.com/campus',
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: 'https://institute.manzilgroupbd.com/campus',
      },
    ],
  }),
})

function CampusPage() {
  const { language } = useLanguageStore()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  const campusData = {
    overview: {
      title: language === 'bn' ? "ক্যাম্পাস ও সুবিধাদি" : "Campus & Facilities",
      description: language === 'bn'
        ? "মানযিল ইনস্টিটিউটের আধুনিক ক্যাম্পাসে শিক্ষার্থীদের জন্য সর্বাধুনিক সুবিধাদি"
        : "Modern campus facilities at Manzil Institute for comprehensive student development",
      stats: [
        { label: language === 'bn' ? "মোট এলাকা" : "Total Area", value: language === 'bn' ? "৫ একর" : "5 Acres" },
        { label: language === 'bn' ? "শ্রেণীকক্ষ" : "Classrooms", value: language === 'bn' ? "৫০+" : "50+" },
        { label: language === 'bn' ? "আবাসিক ধারণক্ষমতা" : "Residential Capacity", value: language === 'bn' ? "৫০০+" : "500+" },
        { label: language === 'bn' ? "খেলার মাঠ" : "Sports Fields", value: language === 'bn' ? "৩টি" : "3 Fields" }
      ]
    },
    facilities: [
      {
        category: language === 'bn' ? "একাডেমিক সুবিধা" : "Academic Facilities",
        icon: GraduationCap,
        items: [
          {
            name: language === 'bn' ? "আধুনিক শ্রেণীকক্ষ" : "Modern Classrooms",
            description: language === 'bn' ? "প্রজেক্টর, স্মার্টবোর্ড এবং ইন্টারেক্টিভ লার্নিং টুলস সহ" : "Equipped with projectors, smart boards, and interactive learning tools",
            features: language === 'bn'
              ? ["এয়ার কন্ডিশনড", "ডিজিটাল প্রজেক্টর", "ইন্টারনেট কানেকশন", "অডিও সিস্টেম"]
              : ["Air Conditioned", "Digital Projectors", "Internet Connection", "Audio System"]
          },
          {
            name: language === 'bn' ? "লাইব্রেরি" : "Library",
            description: language === 'bn' ? "বিশাল সংগ্রহের ইসলামিক এবং আধুনিক বই" : "Extensive collection of Islamic and modern books",
            features: language === 'bn'
              ? ["৫০,০০০+ বই", "ডিজিটাল ক্যাটালগ", "রিডিং জোন", "রিসার্চ ফ্যাসিলিটি"]
              : ["50,000+ Books", "Digital Catalog", "Reading Zone", "Research Facility"]
          },
          {
            name: language === 'bn' ? "কম্পিউটার ল্যাব" : "Computer Lab",
            description: language === 'bn' ? "আধুনিক কম্পিউটার এবং সফটওয়্যার প্রশিক্ষণ" : "Modern computers and software training facilities",
            features: language === 'bn'
              ? ["১০০+ কম্পিউটার", "হাই-স্পিড ইন্টারনেট", "প্রোগ্রামিং টুলস", "ডিজাইন সফটওয়্যার"]
              : ["100+ Computers", "High-Speed Internet", "Programming Tools", "Design Software"]
          }
        ]
      },
      {
        category: language === 'bn' ? "আবাসিক সুবিধা" : "Residential Facilities",
        icon: Home,
        items: [
          {
            name: language === 'bn' ? "ছাত্র হোস্টেল" : "Boys Hostel",
            description: language === 'bn' ? "নিরাপদ এবং আরামদায়ক আবাসন ব্যবস্থা" : "Safe and comfortable residential accommodation",
            features: language === 'bn'
              ? ["২৫০টি রুম", "২-৪ জন প্রতি রুম", "২৪/৭ সিকিউরিটি", "ক্লিনিং সার্ভিস"]
              : ["250 Rooms", "2-4 per Room", "24/7 Security", "Cleaning Service"]
          },
          {
            name: language === 'bn' ? "ছাত্রী হোস্টেল" : "Girls Hostel",
            description: language === 'bn' ? "নারী শিক্ষিকা তত্ত্বাবধানে নিরাপদ পরিবেশ" : "Safe environment under female teacher supervision",
            features: language === 'bn'
              ? ["১৫০টি রুম", "২-৩ জন প্রতি রুম", "ফিমেল স্টাফ", "প্রাইভেট বাথরুম"]
              : ["150 Rooms", "2-3 per Room", "Female Staff", "Private Bathrooms"]
          },
          {
            name: language === 'bn' ? "ডাইনিং হল" : "Dining Hall",
            description: language === 'bn' ? "হালাল এবং পুষ্টিকর খাবার পরিবেশন" : "Halal and nutritious food service",
            features: language === 'bn'
              ? ["হালাল খাবার", "পুষ্টিবিদ তত্ত্বাবধান", "৫০০+ ধারণক্ষমতা", "ক্লিন এনভায়রনমেন্ট"]
              : ["Halal Food", "Nutritionist Supervision", "500+ Capacity", "Clean Environment"]
          }
        ]
      },
      {
        category: language === 'bn' ? "খেলাধুলা ও বিনোদন" : "Sports & Recreation",
        icon: Star,
        items: [
          {
            name: language === 'bn' ? "খেলার মাঠ" : "Sports Fields",
            description: language === 'bn' ? "ফুটবল, ক্রিকেট এবং অন্যান্য খেলার জন্য" : "For football, cricket, and other sports activities",
            features: language === 'bn'
              ? ["ফুটবল গ্রাউন্ড", "ক্রিকেট পিচ", "বাস্কেটবল কোর্ট", "ভলিবল কোর্ট"]
              : ["Football Ground", "Cricket Pitch", "Basketball Court", "Volleyball Court"]
          },
          {
            name: language === 'bn' ? "জিমনেসিয়াম" : "Gymnasium",
            description: language === 'bn' ? "শারীরিক ফিটনেস এবং স্বাস্থ্য বজায় রাখার জন্য" : "For physical fitness and health maintenance",
            features: language === 'bn'
              ? ["মডার্ন ইকুইপমেন্ট", "ট্রেইনার তত্ত্বাবধান", "কার্ডিও জোন", "ওয়েট ট্রেনিং"]
              : ["Modern Equipment", "Trainer Supervision", "Cardio Zone", "Weight Training"]
          },
          {
            name: language === 'bn' ? "সুইমিং পুল" : "Swimming Pool",
            description: language === 'bn' ? "নিরাপদ সুইমিং প্রশিক্ষণ এবং বিনোদন" : "Safe swimming training and recreation",
            features: language === 'bn'
              ? ["ওলিম্পিক সাইজ", "ট্রেইন্ড লাইফগার্ড", "চেঞ্জিং রুম", "হিটেড ওয়াটার"]
              : ["Olympic Size", "Trained Lifeguard", "Changing Rooms", "Heated Water"]
          }
        ]
      }
    ],
    location: {
      address: language === 'bn'
        ? "হারুনুর রশীদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা ১৩৬২"
        : "Harunur Rashid Tower (10 Storied Building), House #91, Road #2, North Rayarbagh Bus Stand, Jatrabari, Dhaka 1362",
      phone: ["০১৪০৭-০৪৬০০১", "০১৪০৭-০৪৬০০২"],
      email: "info@manzilinstitute.edu.bd",
      transport: language === 'bn'
        ? ["বাস স্টেশন থেকে ৫ মিনিট", "রেলস্টেশন থেকে ১০ মিনিট", "এয়ারপোর্ট থেকে ৩০ মিনিট"]
        : ["5 minutes from bus station", "10 minutes from railway station", "30 minutes from airport"]
    }
  }

  return (
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
                  delayChildren: 0.75,
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
              {language === 'bn' ? 'আধুনিক সুবিধা এবং অবকাঠামো' : 'Modern Facilities & Infrastructure'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font">
            {language === 'bn'
              ? 'মানযিল ইনস্টিটিউটের ক্যাম্পাসে শিক্ষার্থীদের জন্য সর্বাধুনিক সুবিধা, নিরাপদ পরিবেশ এবং ইসলামিক মূল্যবোধ সম্পন্ন শিক্ষা প্রদান করা হয়।'
              : 'Manzil Institute campus provides state-of-the-art facilities, safe environment, and education infused with Islamic values for students.'
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {campusData.overview.stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-[#00AEEF] dark:text-[#00AEEF]/80 mb-2">
                  {stat.value}
                </div>
                <div className={cn(
                  "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                  language === 'bn' && "bengali-text"
                )}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Facilities */}
        {campusData.facilities.map((facilityCategory, categoryIndex) => (
          <section key={categoryIndex} className="space-y-6">
            <h2 className={cn(
              "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3",
              language === 'bn' && "bengali-text"
            )}>
              <facilityCategory.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#00AEEF]" />
              {facilityCategory.category}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilityCategory.items.map((facility, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <h3 className={cn(
                    "text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3",
                    language === 'bn' && "bengali-text"
                  )}>
                    {facility.name}
                  </h3>
                  <p className={cn(
                    "text-sm text-gray-600 dark:text-gray-400 mb-4",
                    language === 'bn' && "bengali-text"
                  )}>
                    {facility.description}
                  </p>

                  <ul className="space-y-2">
                    {facility.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className={cn(
                          "text-sm text-gray-700 dark:text-gray-300",
                          language === 'bn' && "bengali-text"
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Location & Contact */}
        <section className="bg-gradient-to-r from-[#00AEEF] to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
          <h2 className={cn(
            "text-2xl sm:text-3xl font-bold mb-6 sm:mb-8",
            language === 'bn' && "bengali-text"
          )}>
            {language === 'bn' ? 'অবস্থান এবং যোগাযোগ' : 'Location & Contact'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'ঠিকানা' : 'Address'}</h3>
                  <p className="text-sm opacity-90">{campusData.location.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'ফোন' : 'Phone'}</h3>
                  <div className="space-y-1">
                    {campusData.location.phone.map((number, idx) => (
                      <p key={idx} className="text-sm opacity-90">{number}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'ইমেইল' : 'Email'}</h3>
                  <p className="text-sm opacity-90">{campusData.location.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'পরিবহন' : 'Transportation'}</h3>
                  <ul className="space-y-1">
                    {campusData.location.transport.map((transport, idx) => (
                      <li key={idx} className="text-sm opacity-90">• {transport}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'যোগাযোগের সময়' : 'Contact Hours'}</h3>
                  <p className="text-sm opacity-90">
                    {language === 'bn' ? 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০' : 'Saturday - Thursday: 9:00 AM - 5:00 PM'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </AnimatedGroup>
      </main>
      <FooterSection />
    </div>
  )
}