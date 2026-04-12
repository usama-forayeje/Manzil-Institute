'use client';

import React from 'react';
import { ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { getDashboardUrl } from '@/lib/dashboard';
import { ModeToggle } from '@/components/themes/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FcGoogle } from 'react-icons/fc';


interface CourseItem {
  href: string;
  label: {
    en: string;
    bn: string;
  };
}

const courseItems: CourseItem[] = [
  // {
  //   href: '/admission/mic',
  //   label: {
  //     en: 'MIC Admission Info',
  //     bn: 'MIC ভর্তি তথ্য',
  //   },
  // },
  // {
  //   href: '/admission/mnc',
  //   label: {
  //     en: 'MNC Admission Info',
  //     bn: 'MNC ভর্তি তথ্য',
  //   },
  // },
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

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isScrolled: boolean;
  language: string;
  user: User | null;
  isLoadingAuth: boolean;
}

export default function MobileMenu({ isMenuOpen, setIsMenuOpen, isScrolled, language, user, isLoadingAuth }: MobileMenuProps) {
  const [mobileAdmissionOpen, setMobileAdmissionOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const { language: currentLang, setLanguage } = useLanguageStore.getState();
    setLanguage(currentLang === 'en' ? 'bn' : 'en');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className={cn(
        'md:hidden bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 pt-1 px-6 rounded-b-2xl transition-all duration-300 ease-in-out overflow-hidden',
        isMenuOpen
          ? 'max-h-[32rem] opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      <div className="space-y-2">
        {/* Theme & Language Toggle Row */}
        <div className="flex items-center justify-between py-3 px-1 mb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
            <ModeToggle />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Language</span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] transition-colors"
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
          </div>
        </div>
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
                  {item.label[language as keyof typeof item.label]}
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
                        {course.label[language as keyof typeof course.label]}
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
                {item.label[language as keyof typeof item.label]}
              </Link>
            );
          }
        })}

        {/* Dashboard link for non-student roles */}
        {!isLoadingAuth && user && user.role && user.role !== 'student' && (
          <Link
            href={getDashboardUrl(user.role)}
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              'flex items-center justify-start w-full py-3 px-4 text-[#00AEEF] hover:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/5 rounded-lg transition-colors duration-150 font-semibold',
              language === 'bn' ? 'bengali-text' : 'english-text'
            )}
          >
            <User className="mr-3 h-4 w-4" />
            {language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
          </Link>
        )}
      </div>

      {/* Mobile Auth Actions - Moved inside modal */}
      <div className="pt-3 pb-4 mt-2 border-t border-gray-200 dark:border-gray-700">
        {!isLoadingAuth ? (
          user ? (
            // ✅ Logged In: User Info + Logout Button
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl hover:bg-accent/70 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="bg-[#00AEEF] text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="h-9 px-3 text-xs font-medium whitespace-nowrap shadow-sm"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                {language === 'en' ? 'Logout' : 'লগআউট'}
              </Button>
            </div>
          ) : (
            // ❌ Not Logged In: Google Login Button
            <Button
              onClick={() => {
                router.push('/login');
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full h-11 gap-2.5 font-medium border-2 hover:bg-accent transition-all"
            >
              <FcGoogle className="h-5 w-5" />
              <span className={language === 'bn' ? 'bengali-text' : 'font-medium'}>
                {language === 'en' 
                  ? 'Continue with Google' 
                  : 'Google দিয়ে লগইন করুন'}
              </span>
            </Button>
          )
        ) : (
          <div className="h-11 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
        )}
      </div>

    </div>
  );
}
