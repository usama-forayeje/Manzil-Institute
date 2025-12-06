'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const courseItems = [
  {
    href: '/admission/mic',
    label: {
      en: 'MIC Admission Info',
      bn: 'MIC ভর্তি তথ্য',
    },
  },
  {
    href: '/admission/mnc',
    label: {
      en: 'MNC Admission Info',
      bn: 'MNC ভর্তি তথ্য',
    },
  },
];

const menuItems = [
  {
    key: 'home',
    href: '/',
    label: {
      en: 'Home',
      bn: 'হোম',
    },
  },
  {
    key: 'about',
    href: '#about',
    label: {
      en: 'About',
      bn: 'আমাদের সম্পর্কে',
    },
  },
  {
    key: 'curriculum',
    href: '#curriculum',
    label: {
      en: 'Curriculum',
      bn: 'কারিকুলাম',
    },
  },
  {
    key: 'admission',
    href: '/admission',
    label: {
      en: 'Admission',
      bn: 'ভর্তি',
    },
  },
  {
    key: 'campus',
    href: '/campus',
    label: {
      en: 'Campus',
      bn: 'ক্যাম্পাস',
    },
  },
];

export default function MobileMenu({ isMenuOpen, setIsMenuOpen, isScrolled, language }) {
  const [mobileAdmissionOpen, setMobileAdmissionOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'lg:hidden bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 pt-1 px-6 rounded-b-2xl transition-all duration-300 ease-in-out overflow-hidden',
        isMenuOpen
          ? 'max-h-96 opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      <div className="space-y-2">
        {menuItems.map(item => {
          if (item.key === 'admission') {
            return (
              <div key={item.key}>
                <button
                  onClick={() =>
                    setMobileAdmissionOpen(!mobileAdmissionOpen)
                  }
                  className={cn(
                    'flex items-center justify-start w-full py-3 px-4 text-gray-700 dark:text-gray-300 text-left hover:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] rounded-lg transition-colors duration-150 font-medium',
                    language === 'bn' ? 'bengali-text' : 'english-text'
                  )}
                >
                  {item.label[language]}
                  <ChevronDown
                    className={cn(
                      'ml-2 h-4 w-4 transition-transform',
                      mobileAdmissionOpen ? 'rotate-180' : ''
                    )}
                  />
                </button>
                {mobileAdmissionOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {courseItems.map(course => (
                      <Link
                        key={course.href}
                        href={course.href}
                        className={cn(
                          'block py-2 px-4 text-left text-gray-600 dark:text-gray-400 hover:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] rounded-lg transition-colors duration-150',
                          language === 'bn'
                            ? 'bengali-text'
                            : 'english-text'
                        )}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setMobileAdmissionOpen(false);
                        }}
                      >
                        {course.label[language]}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'block py-3 px-4 text-gray-700 dark:text-gray-300 text-left hover:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] rounded-lg transition-colors duration-150 font-medium',
                  language === 'bn' ? 'bengali-text' : 'english-text'
                )}
                onClick={e => {
                  setIsMenuOpen(false);
                  if (item.href.startsWith('#') && pathname !== '/') {
                    // Navigate to home page with hash
                    window.location.href = item.href;
                  }
                }}
              >
                {item.label[language]}
              </Link>
            );
          }
        })}
      </div>

      <div className="flex flex-col pt-6 mt-6 mb-6 space-y-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          asChild
          variant={isScrolled ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'w-full justify-start text-left text-sm font-semibold',
            isScrolled
              ? 'bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white'
              : ''
          )}
        >
          <Link
            href="/apply"
            className={
              language === 'bn' ? 'kalpurush-font' : 'english-text'
            }
          >
            {isScrolled
              ? language === 'en'
                ? 'Apply Now'
                : 'এপ্লাই করুন'
              : language === 'en'
              ? 'Login'
              : 'লগইন'}
          </Link>
        </Button>
      </div>
    </div>
  );
}