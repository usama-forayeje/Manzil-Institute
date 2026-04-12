'use client';

import { Menu, X, LogOut, User, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/lib/store';
import { useAuthStore } from '@/store/auth-store';
import { getDashboardUrl, getRoleDisplayName } from '@/lib/dashboard';
import { ModeToggle } from './themes/theme-toggle';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/themes/theme-provider';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc'; // Install: npm install react-icons

// Dynamic imports for better code splitting
const DesktopMenu = React.lazy(() => import('./header/desktop-menu'));
const MobileMenu = React.lazy(() => import('./header/mobile-menu'));

interface HeroHeaderClientProps {
  initialSession: {
    user: {
      $id: string;
      name: string;
      email: string;
    } | null;
    role: string;
    userAvatar?: string;
  } | null;
}

const HeroHeaderClient: React.FC<HeroHeaderClientProps> = ({
  initialSession,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const router = useRouter();

  // Zustand auth store
  const { user, isLoading, setUser, clearUser } = useAuthStore();

  // Hydrate auth store from server-fetched session on mount
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    if (initialSession?.user) {
      setUser({
        uid: initialSession.user.$id,
        name: initialSession.user.name || 'User',
        email: initialSession.user.email || '',
        avatar: initialSession.userAvatar,
        role: initialSession.role || 'student',
      });
    } else {
      setUser(null);
    }
  }, [initialSession, setUser]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
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
      document.body.style.overflow = 'hidden'; // Prevent scroll when menu open
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  
  const toggleLanguage = () => {
    const { language: currentLang, setLanguage } = useLanguageStore.getState();
    setLanguage(currentLang === 'en' ? 'bn' : 'en');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      clearUser();
      setIsMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGoogleLogin = () => {
    // Replace with your actual Google auth logic
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed z-50 w-full top-0 left-0">
      <nav className="px-4 py-2">
        <div
          className={cn(
            'mx-auto transition-all duration-300 ease-in-out',
            isScrolled
              ? 'max-w-5xl bg-background/80 dark:bg-background/60 rounded-2xl border shadow-lg backdrop-blur-xl'
              : 'max-w-6xl'
          )}
        >
          {/* Navbar Container */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            
            {/* Logo - Left (Always visible) */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-2" aria-label="Home">
                {mounted ? (
                  <Image
                    src={
                      theme === 'dark'
                        ? '/manzil-logo/manzil-institute-logo-dark.webp'
                        : '/manzil-logo/manzil-institute-logo-light.webp'
                    }
                    alt="Manzil Institute Logo"
                    width={170}
                    height={40}
                    className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-[170px] h-8 md:h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                )}
              </Link>
            </div>

            {/* Desktop Navigation - Center (md+) */}
            <Suspense
              fallback={
                <div className="hidden md:flex justify-center grow max-w-md h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              }
            >
              <DesktopMenu
                admissionOpen={admissionOpen}
                setAdmissionOpen={setAdmissionOpen}
                language={language}
                user={user}
                isLoadingAuth={isLoading}
              />
            </Suspense>

            {/* Desktop Actions - Right (md+) */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <ModeToggle />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="px-3 py-2 h-9 text-xs font-medium"
                aria-label="Toggle language"
              >
                <span className={cn(language === 'bn' && 'bengali-text')}>
                  {language === 'en' ? 'বাংলা' : 'English'}
                </span>
              </Button>

              {/* Auth State - Desktop */}
              {!isLoading ? (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#00AEEF]"
                        aria-label="User menu"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user.avatar || undefined}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-[#00AEEF] to-[#0088CC] text-white text-sm font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                      <DropdownMenuLabel className="font-normal py-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs font-medium text-[#00AEEF]">
                            {getRoleDisplayName(user.role)}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.role && user.role !== 'student' && (
                        <DropdownMenuItem asChild>
                          <Link href={getDashboardUrl(user.role)} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span className={language === 'bn' ? 'bengali-text' : ''}>
                              {language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span className={language === 'bn' ? 'bengali-text' : ''}>
                            {language === 'en' ? 'Profile' : 'প্রোফাইল'}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span className={language === 'bn' ? 'bengali-text' : ''}>
                            {language === 'en' ? 'Settings' : 'সেটিংস'}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className={language === 'bn' ? 'bengali-text' : ''}>
                          {language === 'en' ? 'Logout' : 'লগআউট'}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    asChild
                    variant={isScrolled ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "h-9 px-4 text-xs font-semibold transition-all",
                      isScrolled
                        ? "bg-[#00AEEF] text-white hover:bg-[#00AEEF]/90 shadow-md"
                        : "hover:bg-accent"
                    )}
                  >
                    <Link href="/login">
                      {isScrolled
                        ? language === 'en' ? 'Apply Now' : 'এপ্লাই করুন'
                        : language === 'en' ? 'Login' : 'লগইন'}
                    </Link>
                  </Button>
                )
              ) : (
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
              )}
            </div>

            {/* Mobile Actions - Right (< md) */}
            <div className="md:hidden flex items-center gap-2 shrink-0">
              {/* Mobile Auth State */}
              {!isLoading && user && (
                <Link href="/profile" className="md:hidden">
                  <Avatar className="h-8 w-8 ring-2 ring-[#00AEEF]/20">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback className="bg-[#00AEEF] text-white text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
              
              <Button
                ref={buttonRef}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-200",
                  isMenuOpen 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent"
                )}
              >
                <div className="relative w-5 h-5">
                  <Menu className={cn(
                    "absolute inset-0 transition-all duration-200",
                    isMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  )} />
                  <X className={cn(
                    "absolute inset-0 transition-all duration-200",
                    isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                  )} />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Panel - Animated Slide Down */}
          <div
            ref={menuRef}
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
              isMenuOpen 
                ? "max-h-[500px] opacity-100" 
                : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 pb-4 pt-2 space-y-3">
              {/* Mobile Navigation Links */}
              <Suspense fallback={
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                  ))}
                </div>
              }>
                <MobileMenu
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                  isScrolled={isScrolled}
                  language={language}
                  user={user}
                  isLoadingAuth={isLoading}
                />
              </Suspense>

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeroHeaderClient;