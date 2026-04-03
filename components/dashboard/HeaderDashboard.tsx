'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Check,
  CreditCard,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth/actions';
import { useTheme } from '@/components/themes/theme-provider';

interface HeaderDashboardProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  role?: string;
}

const roleLabels: Record<string, string> = {
  super_admin: 'সুপার অ্যাডমিন',
  manager: 'ম্যানেজার',
  teacher: 'শিক্ষক',
  student: 'শিক্ষার্থী',
  parent: 'অভিভাবক',
};

export function HeaderDashboard({ 
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar,
  role = 'student'
}: HeaderDashboardProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b px-4 transition-all duration-200',
      isDark 
        ? 'bg-zinc-950/95 border-zinc-800 text-white' 
        : 'bg-white/95 border-zinc-200 text-zinc-900',
      'backdrop-blur supports-[backdrop-filter]:bg-background/60'
    )}>
      <div className="flex items-center gap-3">
        {/* Mobile menu button would go here */}
        <div className="flex items-center gap-2">
          {/* Search Toggle - Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              'p-2 rounded-lg transition-colors md:hidden',
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
            )}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>

          {/* Search Input - Desktop */}
          <div className={cn(
            'relative hidden md:block transition-all duration-200',
            isSearchOpen ? 'w-64' : 'w-56'
          )}>
            <Search className={cn(
              'absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4',
              isDark ? 'text-zinc-400' : 'text-zinc-400'
            )} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'h-9 w-full rounded-lg border bg-transparent pl-9 pr-4 text-sm outline-none transition-all duration-200',
                isDark 
                  ? 'border-zinc-800 bg-zinc-900 placeholder:text-zinc-500 focus:border-[#60cdff]' 
                  : 'border-zinc-200 bg-zinc-50 placeholder:text-zinc-400 focus:border-[#00aef]',
                isSearchOpen ? 'w-full' : 'w-40 md:w-56'
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Live Status */}
        <div className={cn(
          'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium',
          isDark 
            ? 'bg-green-900/30 text-green-400' 
            : 'bg-green-100 text-green-600'
        )}>
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>লাইভ</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          className={cn(
            'p-2 rounded-full transition-colors',
            isDark 
              ? 'hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400' 
              : 'hover:bg-zinc-100 text-zinc-600 hover:text-yellow-500'
          )}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button className={cn(
          'relative p-2 rounded-full transition-colors',
          isDark 
            ? 'hover:bg-zinc-800 text-zinc-400' 
            : 'hover:bg-zinc-100 text-zinc-600'
        )}>
          <Bell className="h-5 w-5" />
          <span className={cn(
            'absolute right-1 top-1 h-2 w-2 rounded-full',
            isDark ? 'bg-red-500' : 'bg-red-500'
          )}></span>
        </button>

        {/* Role Badge */}
        <div className={cn(
          'hidden sm:flex items-center px-2 py-1 rounded-full text-xs font-medium',
          isDark 
            ? 'bg-[#60cdff]/10 text-[#60cdff]' 
            : 'bg-[#00aef]/10 text-[#00aef]'
        )}>
          {roleLabels[role] || role}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              'flex items-center gap-2 rounded-lg p-1.5 transition-colors',
              isDark 
                ? 'hover:bg-zinc-800' 
                : 'hover:bg-zinc-100'
            )}
          >
            {/* Avatar */}
            <div className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center',
              isDark ? 'bg-zinc-800' : 'bg-zinc-200'
            )}>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <span className={cn(
                  'text-sm font-medium',
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                )}>
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Name & Email - Desktop */}
            <div className="hidden lg:flex flex-col items-start">
              <span className={cn(
                'text-sm font-medium',
                isDark ? 'text-white' : 'text-zinc-900'
              )}>
                {userName}
              </span>
              <span className={cn(
                'text-xs',
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              )}>
                {userEmail}
              </span>
            </div>
            
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200',
              isUserMenuOpen && 'rotate-180',
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            )} />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className={cn(
              'absolute right-0 mt-2 w-64 rounded-xl border shadow-lg overflow-hidden',
              isDark 
                ? 'bg-zinc-900 border-zinc-800' 
                : 'bg-white border-zinc-200'
            )}>
              {/* User Info Header */}
              <div className={cn(
                'border-b px-4 py-3',
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                  )}>
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <span className={cn(
                        'text-sm font-medium',
                        isDark ? 'text-zinc-300' : 'text-zinc-700'
                      )}>
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-zinc-900'
                    )}>
                      {userName}
                    </span>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-zinc-400' : 'text-zinc-500'
                    )}>
                      {userEmail}
                    </span>
                    <span className={cn(
                      'text-xs font-medium mt-0.5',
                      isDark ? 'text-[#60cdff]' : 'text-[#00aef]'
                    )}>
                      {roleLabels[role] || role}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className={cn('py-1', isDark ? 'bg-zinc-900' : 'bg-white')}>
                <button className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  isDark 
                    ? 'text-zinc-300 hover:bg-zinc-800' 
                    : 'text-zinc-700 hover:bg-zinc-100'
                )}>
                  <User className="h-4 w-4" />
                  প্রোফাইল
                </button>
                
                <button className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  isDark 
                    ? 'text-zinc-300 hover:bg-zinc-800' 
                    : 'text-zinc-700 hover:bg-zinc-100'
                )}>
                  <Settings className="h-4 w-4" />
                  সেটিংস
                </button>
              </div>
              
              {/* Logout */}
              <div className={cn(
                'border-t py-1',
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              )}>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    isDark 
                      ? 'text-red-400 hover:bg-zinc-800' 
                      : 'text-red-600 hover:bg-zinc-100'
                  )}
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  লগআউট
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
