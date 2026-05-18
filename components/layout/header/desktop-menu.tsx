'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getDashboardUrl } from '@/lib/dashboard';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface MenuItem {
  key: string;
  href: string;
  label: {
    en: string;
    bn: string;
  };
}

interface CourseItem {
  href: string;
  label: {
    en: string;
    bn: string;
  };
}

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface DesktopMenuProps {
  admissionOpen: boolean;
  setAdmissionOpen: (open: boolean) => void;
  language: string;
  user: User | null;
  isLoadingAuth: boolean;
}

const menuItems: MenuItem[] = [
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
    key: 'campus',
    href: '/campus',
    label: {
      en: 'Campus',
      bn: 'ক্যাম্পাস',
    },
  },
];

const courseItems: CourseItem[] = [
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

export default function DesktopMenu({ admissionOpen, setAdmissionOpen, language, user, isLoadingAuth }: DesktopMenuProps) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex justify-center grow">
      <div className="flex items-center space-x-8">
        {menuItems.map((item: MenuItem) => {
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
                    {item.label[language as keyof typeof item.label]}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onMouseLeave={() => setAdmissionOpen(false)}
                >
                  {courseItems.map((course: CourseItem) => (
                    <DropdownMenuItem key={course.href} asChild>
                      <Link
                        href={course.href}
                        className={cn(
                          'hover:text-[#00AEEF] hover:bg-[#00AEEF]/10',
                          language === 'bn' && 'bengali-text'
                        )}
                        onClick={() => {}}
                      >
                        {course.label[language as keyof typeof course.label]}
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
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (item.href.startsWith('#') && pathname !== '/') {
                    // Navigate to home page with hash
                    window.location.href = item.href;
                  }
                }}
              >
                {item.label[language as keyof typeof item.label]}
              </Link>
            );
          }
        })}

        {/* Dashboard navigation for authenticated users */}
        {!isLoadingAuth && user && user.role && user.role !== 'student' && (
          <Link
            href={getDashboardUrl(user.role)}
            className={cn(
              'text-gray-700 dark:text-gray-300 hover:text-[#00AEEF]/80 text-sm font-semibold transition-colors duration-150 whitespace-nowrap flex items-center',
              language === 'bn' && 'bengali-text'
            )}
          >
            {language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
          </Link>
        )}
      </div>
    </div>
  );
}