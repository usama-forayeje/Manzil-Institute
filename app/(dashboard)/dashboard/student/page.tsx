'use client';

import { useRouter } from 'next/navigation';
import { LogOut, BookOpen, Calendar, FileText, Bell, Settings } from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <div>
      {/* Header with Logout Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            শিক্ষার্থী ড্যাশবোর্ড
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            মাদ্রাসা ম্যানেজমেন্ট সিস্টেমে আপনাকে স্বাগতম
          </p>
        </div>
        
        {/* Direct Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          লগআউট
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <span className="font-medium text-zinc-900 dark:text-white">কারিকুলাম</span>
        </button>

        <button className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
          <Calendar className="h-8 w-8 text-indigo-600" />
          <span className="font-medium text-zinc-900 dark:text-white">উপস্থিতি</span>
        </button>

        <button className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
          <FileText className="h-8 w-8 text-indigo-600" />
          <span className="font-medium text-zinc-900 dark:text-white">ফি</span>
        </button>

        <button className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-colors">
          <Bell className="h-8 w-8 text-indigo-600" />
          <span className="font-medium text-zinc-900 dark:text-white">নোটিশ</span>
        </button>
      </div>

      {/* Placeholder Dashboard Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          ড্যাশবোর্ড কম্পোনেন্ট শীঘ্রই যোগ করা হবে
        </p>
      </div>
    </div>
  );
}