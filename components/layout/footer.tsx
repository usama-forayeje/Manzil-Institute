'use client';

import { MapPin, Phone, Mail, Globe, Code2Icon } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import { useLayoutEffect, useState } from 'react';
import { useTheme } from '@/components/themes/theme-provider';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AnimatedGroup } from '../ui/animated-group';
import { LazyImage } from '../ui/lazy-image';
import { Skeleton } from '../ui/skeleton';

// Theme-aware logo component for footer
function FooterLogo({ className, ...props }: { className?: string; [key: string]: any } = {}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR/hydration
    return (
      <Skeleton
        className={cn('w-[120px] h-8 rounded', className)}
      />
    );
  }

  return (
    <div className={cn('relative w-30 h-8', className)}>
      <LazyImage
        src={
          theme === 'dark'
            ? '/manzil-logo/manzil-institute-logo-dark.webp'
            : '/manzil-logo/manzil-institute-logo-light.webp'
        }
        alt="Manzil Institute Logo"
        width={120}
        height={32}
        className="object-contain"
        {...props}
      />
    </div>
  );
}

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

const contactInfo = [
  {
    icon: Mail,
    title: {
      en: 'Email',
      bn: 'ইমেইল',
    },
    details: {
      en: 'manzilinstitute24@gmail.com',
      bn: 'manzilinstitute24@gmail.com',
    },
  },
  {
    icon: Phone,
    title: {
      en: 'Phone',
      bn: 'ফোন',
    },
    details: {
      en: '01407-046003, 01407-046008',
      bn: '০১৪০৭-০৪৬০০৩, ০১৪০৭-০৪৬০০৮',
    },
  },
  {
    icon: MapPin,
    title: {
      en: 'Address',
      bn: 'ঠিকানা',
    },
    details: {
      en: 'Harunur Rashid Tower (10th Floor Building), House #91, Road #2, Uttar Rayarbag Bus Stand, Jatrabari, Dhaka 1362',
      bn: 'হারুনুর রশীদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা ১৩৬২',
    },
  },
];

const socialLinks = [
  {
    icon: Phone,
    href: 'https://wa.me/8801822478883',
    label: 'WhatsApp',
  },
  {
    icon: Mail,
    href: 'mailto:info@manzilinstitute.edu.bd',
    label: 'Email',
  },
  {
    icon: Globe,
    href: 'https://www.facebook.com/ManzilInstituteBD',
    label: 'Facebook',
    isFacebook: true,
  },
  {
    icon: Globe,
    href: 'https://www.youtube.com/c/ManzilTV',
    label: 'YouTube',
    isYoutube: true,
  },
];

export default function FooterSection() {
  const { language } = useLanguageStore();
  const { theme } = useTheme();

  const businessDivisions = [
    {
      title: {
        en: 'Manzil Group',
        bn: 'মানজিল গ্রুপ',
      },
      href: 'https://manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Institute',
        bn: 'মানজিল ইনস্টিটিউট',
      },
      href: 'https://institute.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Housing',
        bn: 'মানজিল হাউজিং',
      },
      href: 'https://housing.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Properties',
        bn: 'মানজিল প্রপার্টিজ',
      },
      href: 'https://properties.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Shop',
        bn: 'মানজিল শপ',
      },
      href: 'https://shop.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil City',
        bn: 'মানজিল সিটি',
      },
      href: 'https://city.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Agro',
        bn: 'মানজিল এগ্রো',
      },
      href: 'https://agropark.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Foundation',
        bn: 'মানজিল ফাউন্ডেশন',
      },
      href: 'https://foundation.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Sports',
        bn: 'মানজিল স্পোর্টস',
      },
      href: 'https://sports.manzilgroupbd.com',
    },
    {
      title: {
        en: 'Manzil Trading',
        bn: 'মানজিল ট্রেডিং',
      },
      href: 'https://trading.manzilgroupbd.com',
    },
  ];

  const companyLinks = [
    {
      title: {
        en: 'About Us',
        bn: 'আমাদের সম্পর্কে',
      },
      href: '#about',
    },
    {
      title: {
        en: 'Curriculum',
        bn: 'কারিকুলাম',
      },
      href: '/curriculum',
    },
    {
      title: {
        en: 'Admission',
        bn: 'ভর্তি',
      },
      href: '/admission',
    },
    {
      title: {
        en: 'Contact',
        bn: 'যোগাযোগ',
      },
      href: '#contact',
    },
  ];

  return (
    <footer
      className="text-gray-900 border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
      dir="ltr"
    >
      <div className="px-6 py-16 mx-auto max-w-7xl md:py-24">
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
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3 lg:gap-12">
            {/* Left Column - Logo, Description, Contact, Social */}
            <div className="text-center md:text-left">
              <div className="mb-6">
                <Link
                  href="/"
                  aria-label="go home"
                  className="flex items-center justify-center mb-4 space-x-2 md:justify-start"
                >
                  <FooterLogo />
                </Link>
              </div>

              {/* Institute Description */}
              <div className="mb-6">
                <p
                  className={cn(
                    'text-sm leading-relaxed text-center text-gray-600 dark:text-gray-300 md:text-left',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn'
                    ? 'মানযিল ইনস্টিটিউট - মাদরাসা, জেনারেল এবং কারিগরি শিক্ষার সমন্বয়ে ৬-লেভেল শিক্ষা ব্যবস্থা। ভর্তি তথ্য ও যোগাযোগের জন্য যোগাযোগ করুন।'
                    : 'Manzil Institute - 6-level education system integrating Madrasa, General & Technical education. Contact us for admission information and inquiries.'}
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h3
                  className={cn(
                    'text-lg font-semibold mb-4 bg-gradient-to-r from-[#00AEEF] to-[#00AEEF]/80 bg-clip-text text-transparent',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn'
                    ? 'মানযিল ইনস্টিটিউট যোগাযোগ তথ্য'
                    : 'Manzil Institute Contact Information'}
                </h3>
                <div className="space-y-3">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-start gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00AEEF] to-[#00AEEF]/80 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-sm leading-relaxed text-left text-gray-600 dark:text-gray-400',
                            language === 'bn' ? 'bengali-text' : ''
                          )}
                        >
                          {language === 'bn'
                            ? info.details.bn
                            : info.details.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3
                  className={cn(
                    'text-lg font-semibold mb-4 bg-linear-to-r from-[#00AEEF] to-[#00AEEF]/80 bg-clip-text text-transparent',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn'
                    ? 'আমাদের সাথে যুক্ত থাকুন'
                    : 'Connect With Us'}
                </h3>
                <div className="flex justify-center gap-3 md:justify-start">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 bg-linear-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-600 hover:from-[#00AEEF] hover:to-[#00AEEF]/80 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      {social.isYoutube ? (
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      ) : social.isFacebook ? (
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      ) : (
                        <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Business Divisions */}
            <div className="text-center md:text-left">
              <h3
                className={cn(
                  'text-lg font-semibold mb-6 bg-linear-to-r from-[#00AEEF] to-[#00AEEF]/80 bg-clip-text text-transparent',
                  language === 'bn' ? 'bengali-text' : ''
                )}
              >
                {language === 'bn'
                  ? 'ব্যবসায়িক বিভাগসমূহ'
                  : 'Business Divisions'}
              </h3>
              <ul className="space-y-2">
                {businessDivisions.map((division, index) => (
                  <li key={index}>
                    <a
                      href={division.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'text-gray-600 dark:text-gray-300 hover:text-[#00AEEF] dark:hover:text-[#00AEEF]/80 transition-colors duration-200 text-sm block py-1',
                        language === 'bn' ? 'bengali-text' : ''
                      )}
                    >
                      {language === 'bn'
                        ? division.title.bn
                        : division.title.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Company Links */}
            <div className="text-center md:text-left">
              <h3
                className={cn(
                  'text-lg font-semibold mb-6 bg-gradient-to-r from-[#00AEEF] to-[#00AEEF]/80 bg-clip-text text-transparent',
                  language === 'bn' ? 'bengali-text' : ''
                )}
              >
                {language === 'bn' ? 'কোম্পানি' : 'Company'}
              </h3>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className={cn(
                          'text-gray-600 dark:text-gray-300 hover:text-[#00AEEF] dark:hover:text-[#00AEEF]/80 transition-colors duration-200 text-base block py-1',
                          language === 'bn' ? 'bengali-text' : ''
                        )}
                      >
                        {language === 'bn' ? link.title.bn : link.title.en}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          'text-gray-600 dark:text-gray-300 hover:text-[#00AEEF] dark:hover:text-[#00AEEF]/80 transition-colors duration-200 text-base block py-1',
                          language === 'bn' ? 'bengali-text' : ''
                        )}
                      >
                        {language === 'bn' ? link.title.bn : link.title.en}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p
                className={cn(
                  'text-sm text-gray-600 dark:text-gray-400',
                  language === 'bn' ? 'bengali-text' : ''
                )}
              >
                © {new Date().getFullYear()}{' '}
                {language === 'bn'
                  ? 'মানজিল ইনস্টিটিউট। সর্বস্বত্ব সংরক্ষিত।'
                  : 'Manzil Institute. All rights reserved.'}
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="#investment"
                  className={cn(
                    'text-gray-600 dark:text-gray-400 hover:text-[#00AEEF] dark:hover:text-[#00AEEF]/80 text-sm transition-colors duration-200',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn'
                    ? 'ইনভেস্টমেন্ট নীতি'
                    : 'Investment Policy'}
                </a>
                <a
                  href="#terms"
                  className={cn(
                    'text-gray-600 dark:text-gray-400 hover:text-[#00AEEF] dark:hover:text-[#00AEEF]/80 text-sm transition-colors duration-200',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn' ? 'শর্তাবলী' : 'Terms'}
                </a>
                <a
                  href="#privacy"
                  className={cn(
                    'text-gray-600 dark:text-gray-400 hover:text-[#00AEEF] dark:hover:text-[#00AEEF]/80 text-sm transition-colors duration-200',
                    language === 'bn' ? 'bengali-text' : ''
                  )}
                >
                  {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </a>
              </div>
              <p
                className={cn(
                  'text-sm text-gray-600 dark:text-gray-500',
                  language === 'bn' ? 'bengali-text' : ''
                )}
              >
                {language === 'bn' ? 'ডেভেলপ করেছেন' : 'Developed by'}{' '}
                <Code2Icon className="inline-block w-4 h-4 mb-0.5 mr-1 text-gray-600 dark:text-gray-300" />
                <a
                  href="https://www.linkedin.com/in/usama-forayaje"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00AEEF] dark:text-[#00AEEF]/80 hover:underline"
                >
                  {language === 'bn' ? 'উসামা ফরায়েজী' : 'Usama Forayaje'}
                </a>
              </p>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </footer>
  );
}