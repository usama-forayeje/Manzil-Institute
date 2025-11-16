import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { TwitterIcon, Facebook, Linkedin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useLanguageStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Users, Award, Sparkles } from 'lucide-react';
import { AnimatedGroup } from './ui/animated-group';

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

const Team1 = ({
  members = [
    {
      id: "member-1",
      name: "মাওলানা জামাল মাসরুর",
      role: "প্রতিষ্ঠাতা প্রিন্সিপাল",
      bio: "মানযিল ইনস্টিটিউটের প্রতিষ্ঠাতা ও চেয়ারম্যান, মানযিল গ্রুপ",
      avatar:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
      twittorLink: "https://twitter.com/",
      facebookLink: "https://facebook.com/",
      linkedinLink: "https://linkedin.com/",
      whatsappNumber: "https://wa.me/",
    },
    {
      id: "member-2",
      name: "মাওলানা ইমরান হোসাইন",
      role: "প্রতিষ্ঠাতা পরিচালক",
      bio: "মানযিল ইন্টারন্যাশনাল কারিকুলাম (M.I.C) এর প্রতিষ্ঠাতা পরিচালক",
      avatar:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    },
    {
      id: "member-3",
      name: "শায়েখ ড. আহমদ আলী",
      role: "শিক্ষা উপদেষ্টা",
      bio: "ইসলামিক স্টাডিজ ও কারিকুলাম ডেভেলপমেন্ট বিশেষজ্ঞ",
      avatar:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    },
    {
      id: "member-4",
      name: "উসামা ফরায়েজী",
      role: "সফটওয়্যার এন্ড AI ইঞ্জিনিয়ার",
      bio: "জেনারেল এডুকেশন ও কারিকুলাম কো-অর্ডিনেটর",
      avatar: "Usama Forayaje.webp",
    },
    {
      id: "member-5",
      name: "ইঞ্জিনিয়ার সাদমান সাকিব",
      role: "টেকনিক্যাল ডিরেক্টর",
      bio: "কারিগরি শিক্ষা ও প্রযুক্তি বিভাগ প্রধান",
      avatar:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    },
    {
      id: "member-6",
      name: "ড. আয়েশা সিদ্দিকা",
      role: "মহিলা শাখা উপদেষ্টা",
      bio: "মহিলা শিক্ষা ও কারিকুলাম ডেভেলপমেন্ট",
      avatar:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    },
  ],
}) => {
  return (
    <section className="py-16">
      <div className="container mt-12 relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className="team-swiper"
          grabCursor={true}
        >
          {members.map((member) => (
            <SwiperSlide key={member.id}>
              <div className="flex flex-col items-center group">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="relative mb-4 object-cover size-20 border-2 border-white dark:border-gray-700 md:mb-5 lg:size-24 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-center font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </p>
                <p className="text-muted-foreground text-center text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-center text-xs text-muted-foreground mb-3 px-2 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    className="bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer"
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link href="#" target="_blank">
                      <TwitterIcon className="stroke-current size-4" />
                    </Link>
                  </Button>
                  <Button
                    className="bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer"
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link href="#" target="_blank">
                      <Facebook className="stroke-current size-4" />
                    </Link>
                  </Button>
                  <Button
                    className="bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer"
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link href="#" target="_blank">
                      <Linkedin className="stroke-current size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const Team = () => {
  const { language } = useLanguageStore();

  const teamMembers = [
    {
      name: { bn: "মাওলানা জামাল মাসরুর", en: "Mawlana Jamal Masrur" },
      title: {
        bn: "প্রতিষ্ঠাতা প্রিন্সিপাল",
        en: "Founder Principal"
      },
      bio: {
        bn: "মানযিল ইনস্টিটিউটের প্রতিষ্ঠাতা ও চেয়ারম্যান, মানযিল গ্রুপ। ইসলামী শিক্ষা ও আধুনিক শিক্ষার সমন্বয়ে একটি আদর্শ শিক্ষা ব্যবস্থা গড়ে তোলার লক্ষ্যে কাজ করছেন।",
        en: "Founder and Chairman of Manzil Institute, Manzil Group. Working towards building an ideal education system through the integration of Islamic education and modern education."
      },
      imageUrl: "/jamalmasrur.webp",
    },
  ];
  return (
    <section className="relative py-16 sm:py-12 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
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
        className="flex flex-col justify-center px-6 lg:px-8 max-w-(--breakpoint-xl) mx-auto"
      >

        {/* Main Heading with Animation */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-4 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-full">
            <Users className="size-4 text-[#00AEEF] dark:text-[#00AEEF]/80 mr-2" />
            <span className={cn("text-sm font-semibold text-[#00AEEF] dark:text-[#00AEEF]/80", language === 'bn' && "bengali-text")}>
              {language === 'bn' ? 'আমাদের নেতৃত্ব' : 'Our Leadership'}
            </span>
          </div>
          <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight", language === 'bn' && "bengali-text")}>
            {language === 'bn' ? 'পরিচালনা পরিষদ' : 'Board of Directors'}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-1 bg-gradient-to-r from-transparent to-[#00AEEF] rounded-full"></div>
            <Award className="size-5 text-[#00AEEF] dark:text-[#00AEEF]/80" />
            <div className="w-6 h-1 bg-gradient-to-l from-transparent to-[#00AEEF] rounded-full"></div>
          </div>
          <p className={cn("text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed", language === 'bn' && "bengali-text")}>
           {language === 'bn'
              ? 'দক্ষ ও অভিজ্ঞ নেতৃত্বের মাধ্যমে আমরা গড়ে তুলছি একটি আদর্শ শিক্ষা ব্যবস্থা যা ভবিষ্যতের নেতাদের তৈরি করবে।'
              : 'Through skilled and experienced leadership, we are building an ideal education system that will create future leaders.'
            }
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 lg:gap-12 mb-12">
          {teamMembers.map((member, index) => (
            <div
              key={typeof member.name === 'object' ? member.name.bn : member.name}
              className="group relative max-w-sm mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-[#00AEEF]/10 transition-all duration-500 p-6 border border-gray-100 dark:border-gray-700 hover:border-[#00AEEF]/60 dark:hover:border-[#00AEEF]/40 overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00AEEF]/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/10 to-[#00AEEF]/10 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>

              {/* Profile Image with enhanced styling */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF]/60 to-purple-400 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <img
                  src={member.imageUrl}
                  alt={typeof member.name === 'object' ? member.name[language] || member.name.bn : member.name}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-xl object-cover bg-gradient-to-br from-[#00AEEF]/20 to-[#00AEEF]/30 dark:from-[#00AEEF]/10 dark:to-[#00AEEF]/20 mx-auto shadow-xl group-hover:scale-105 transition-transform duration-300 border-4 border-white dark:border-gray-700"
                />
                {/* Premium badge for main members */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#00AEEF] to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  {language === 'bn'
                    ? (index === 0 ? "চেয়ারম্যান" : "পরিচালক")
                    : (index === 0 ? "Chairman" : "Director")
                  }
                </div>
              </div>

              {/* Name and Title */}
              <h3 className={cn("text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#00AEEF] dark:group-hover:text-[#00AEEF]/80 transition-colors duration-300", language === 'bn' && "bengali-text")}>
                {typeof member.name === 'object' ? member.name[language] || member.name.bn : member.name}
              </h3>
              <p className="text-[#00AEEF] dark:text-[#00AEEF]/80 font-semibold text-sm mb-4 uppercase tracking-wide">
                {typeof member.title === 'object' ? member.title[language] || member.title.bn : member.title}
              </p>

              {/* Bio with better styling */}
              <p className={cn("text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 px-2", language === 'bn' && "bengali-text")}>
                {typeof member.bio === 'object' ? member.bio[language] || member.bio.bn : member.bio}
              </p>

              {/* Enhanced Social Media Buttons */}
              <div className="flex items-center justify-center gap-3">
                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/8801822478883?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%86%E0%A6%AA%E0%A6%A8%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B0%20%E0%A6%87%E0%A6%A8%E0%A7%8D%E0%A6%B8%E0%A6%9F%E0%A6%BF%E0%A6%9F%E0%A6%BF%E0%A6%89%E0%A6%9F%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-600 hover:text-green-700 dark:text-green-400 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer rounded-md p-2 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="WhatsApp"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>

                {/* Facebook Button */}
                <a
                  href="https://www.facebook.com/jamalmasrur/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00AEEF]/20 hover:bg-[#00AEEF]/30 dark:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/20 text-[#00AEEF] hover:text-[#00AEEF]/90 dark:text-[#00AEEF]/80 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer rounded-md p-2 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Facebook"
                >
                  <Facebook className="stroke-current size-5" />
                </a>

                {/* Twitter Button */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-800/50 text-sky-600 hover:text-sky-700 dark:text-sky-400 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer rounded-md p-2 flex items-center justify-center disabled:opacity-60"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Twitter"
                >
                  <TwitterIcon className="stroke-current size-5" />
                </a>

                {/* LinkedIn Button */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00AEEF]/20 hover:bg-[#00AEEF]/30 dark:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/20 text-[#00AEEF]/90 hover:text-[#00AEEF] dark:text-[#00AEEF]/70 shadow-none transition-all duration-200 hover:scale-105 cursor-pointer rounded-md p-2 flex items-center justify-center disabled:opacity-60"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="stroke-current size-5" />
                </a>

                {/* TikTok Button */}
                <a
                  href="https://www.tiktok.com/@jamalmasrur?_r=1&_t=ZS-91QImLdLEJD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/60 dark:bg-black/20 hover:bg-black/50 text-white shadow-none transition-all duration-200 hover:scale-105 cursor-pointer rounded-md p-2 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons for desktop */}
        <div className="hidden sm:flex sm:flex-row-reverse sm:justify-center gap-3 mt-8 mb-12">
          <Button size="lg" className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white" asChild>
            <Link to="/campus">{language === 'bn' ? 'ক্যাম্পাস দেখুন' : 'See Campus'}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/admission">{language === 'bn' ? 'ভর্তি প্রক্রিয়া' : 'Admission Process'}</Link>
          </Button>
        </div>

        {/* <Team1 /> */}

        {/* CTA buttons at bottom for mobile */}
        <div className="flex flex-col sm:hidden justify-center gap-3 mt-12 px-6">
          <Button size="lg" className="w-full bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white" asChild>
            <Link to="/campus">{language === 'bn' ? 'ক্যাম্পাস দেখুন' : 'See Campus'}</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link to="/admission">{language === 'bn' ? 'ভর্তি প্রক্রিয়া' : 'Admission Process'}</Link>
          </Button>
        </div>
      </AnimatedGroup>

    </section>
  );
};

export default Team;
export { Team1 };


