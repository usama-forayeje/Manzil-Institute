'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

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

export default function DesktopMenu({ admissionOpen, setAdmissionOpen, language }) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex justify-center flex-grow">
      <div className="flex items-center space-x-8">
        {menuItems.map(item => {
          const href =
            item.href.startsWith('#') && pathname !== '/'
              ? `/${item.href}`
              : item.href;
          if (item.key === 'admission') {
            return (
              <DropdownMenu
                key={item.key}
                open={admissionOpen}
                onOpenChange={setAdmissionOpen}
              >
                <DropdownMenuTrigger
                  asChild
                  onMouseEnter={() => setAdmissionOpen(true)}
                  onClick={() => setAdmissionOpen(true)}
                >
                  <button
                    className={cn(
                      'text-gray-700 dark:text-gray-300 hover:text-[#00AEEF] text-sm font-medium transition-colors duration-150 whitespace-nowrap',
                      language === 'bn' && 'bengali-text'
                    )}
                    aria-expanded={admissionOpen}
                    aria-haspopup="menu"
                  >
                    {item.label[language]}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onMouseLeave={() => setAdmissionOpen(false)}
                >
                  {courseItems.map(course => (
                    <DropdownMenuItem key={course.href} asChild>
                      <Link
                        href={course.href}
                        className={cn(
                          'hover:text-[#00AEEF] hover:bg-[#00AEEF]/10',
                          language === 'bn' && 'bengali-text'
                        )}
                        onClick={() => {}}
                      >
                        {course.label[language]}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          } else {
            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  'text-gray-700 dark:text-gray-300 hover:text-[#00AEEF] text-sm font-medium transition-colors duration-150 whitespace-nowrap',
                  language === 'bn' && 'bengali-text'
                )}
                onClick={e => {
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
    </div>
  );
}