'use client';

import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/lib/store';
import { ModeToggle } from './themes/theme-toggle';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/themes/theme-provider';
import Image from 'next/image';

// Dynamic imports for better code splitting
const DesktopMenu = React.lazy(() => import('./header/desktop-menu'));
const MobileMenu = React.lazy(() => import('./header/mobile-menu'));

const HeroHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { language, setLanguage } = useLanguageStore();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const [admissionOpen, setAdmissionOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bahire click korle menu close howar function
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside menu AND outside menu button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleLanguage = () => setLanguage(language === 'en' ? 'bn' : 'en');

  return (
    <header className="fixed z-50 w-full">
      <nav className="px-4">
        <div
          className={cn(
            'mx-auto transition-all duration-300 mt-2',
            isScrolled
              ? 'max-w-5xl bg-background/50 rounded-2xl border backdrop-blur-lg'
              : 'max-w-6xl'
          )}
        >
          {/* Navbar Container */}
          <div className="flex items-center justify-between px-6 py-3">
            {/* Logo - Left */}
            <div className="flex justify-start shrink-0">
              <Link href="/" className="flex items-center">
                {mounted ? (
                  <Image
                    src={
                      theme === 'dark'
                        ? '/manzil-logo/manzil-institute-logo-dark.webp'
                        : '/manzil-logo/manzil-institute-logo-light.webp'
                    }
                    alt="Manzil Institute Logo"
                    width="170"
                    height="40"
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="w-42.5 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                )}
              </Link>
            </div>

            {/* Desktop Navigation - Center (Only on 1024px+) */}
            <Suspense fallback={<div className="hidden lg:flex justify-center grow w-64 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />}>
              <DesktopMenu
                admissionOpen={admissionOpen}
                setAdmissionOpen={setAdmissionOpen}
                language={language}
              />
            </Suspense>

            {/* Desktop Action Buttons - Right (Only on 1024px+) */}
            <div className="hidden lg:flex justify-end items-center space-x-3 shrink-0">
              <ModeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="px-3 py-2 h-9"
              >
                <span
                  className={cn(
                    'text-xs font-semibold whitespace-nowrap',
                    language === 'bn' && 'bengali-text'
                  )}
                >
                  {language === 'en' ? 'বাংলা' : 'English'}
                </span>
              </Button>
              <Button
                asChild
                variant={isScrolled ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'text-xs font-semibold whitespace-nowrap h-9',
                  isScrolled
                    ? 'bg-[#00AEEF] text-white hover:bg-[#00AEEF]/90'
                    : ''
                )}
              >
                <Link
                  href="/login"
                  className={language === 'bn' ? 'kalpurush-font' : ''}
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

            {/* Mobile Buttons (Only on screens below 1024px) */}
            <div className=" lg:hidden jastify-between items-center space-x-2  shrink-0">
              <div className="flex items-center space-x-1">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="px-2 py-1 h-8"
                >
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      language === 'bn' && 'bengali-text'
                    )}
                  >
                    {language === 'en' ? 'বাংলা' : 'EN'}
                  </span>
                </Button>
                <Button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  className="p-2 bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {isMenuOpen ? (
                    <X className="size-6" />
                  ) : (
                    <Menu className="size-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu with Animation */}
          <Suspense fallback={<div className="lg:hidden h-32 bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 px-6 rounded-b-2xl animate-pulse" />}>
            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isScrolled={isScrolled}
              language={language}
            />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};
export default HeroHeader;