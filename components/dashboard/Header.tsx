'use client';

import { useState } from 'react';
import { signOut } from '@/lib/auth/actions';
import { LogOut, User, Settings, Bell, Sun, Moon, ChevronDown, Search } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userName: string;
  userEmail: string;
  role: string;
  avatarUrl?: string;
}

const roleLabels: Record<string, string> = {
  super_admin: 'সুপার অ্যাডমিন',
  manager: 'ম্যানেজার',
  teacher: 'শিক্ষক',
  student: 'শিক্ষার্থী',
  parent: 'অভিভাবক',
};

export function Header({ userName, userEmail, role, avatarUrl }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // In a real app, this would also update the document class
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/95 backdrop-blur px-4 dark:border-zinc-800 dark:bg-zinc-950/95">
      {/* Left - Sidebar Trigger & Search */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Right - Status, Theme Toggle, Notifications, User */}
      <div className="flex items-center gap-2">
        {/* Live Status */}
        <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>লাইভ</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
          )}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-zinc-900" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-white/10">
          <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Role Badge */}
        <RoleBadge role={role} />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            {/* Avatar */}
            <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Name & Email - Desktop */}
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {userEmail}
              </p>
            </div>
            
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {userEmail}
                </p>
                <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {roleLabels[role]}
                </p>
              </div>
              
              <div className="py-1">
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <User className="h-4 w-4" />
                  প্রোফাইল
                </button>
                
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Settings className="h-4 w-4" />
                  সেটিংস
                </button>
              </div>
              
              <div className="border-t border-zinc-200 py-1 dark:border-zinc-800">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800"
                >
                  <LogOut className="h-4 w-4" />
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