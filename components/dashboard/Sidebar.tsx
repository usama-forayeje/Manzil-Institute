'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  UserCog, 
  Calendar, 
  DollarSign, 
  Receipt, 
  FileText, 
  Building2, 
  Bell, 
  CreditCard,
  Settings,
  BookOpen,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  title: string;
  titleBn: string;
  href: string;
  icon: React.ElementType;
  items?: NavItem[];
}

interface SidebarProps {
  role: string;
}

const roleNavItems: Record<string, NavItem[]> = {
  super_admin: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/admin', icon: LayoutDashboard },
    { 
      title: 'Students', 
      titleBn: 'শিক্ষার্থী', 
      href: '/dashboard/admin/students', 
      icon: GraduationCap,
      items: [
        { title: 'All Students', titleBn: 'সকল শিক্ষার্থী', href: '/dashboard/admin/students', icon: GraduationCap },
        { title: 'Admission', titleBn: 'ভর্তি', href: '/dashboard/admin/students/admission', icon: GraduationCap },
        { title: 'Promote', titleBn: 'প্রমোশন', href: '/dashboard/admin/students/promote', icon: GraduationCap },
      ]
    },
    { 
      title: 'Staff', 
      titleBn: 'কর্মচারী', 
      href: '/dashboard/admin/staff', 
      icon: UserCog,
      items: [
        { title: 'All Staff', titleBn: 'সকল কর্মচারী', href: '/dashboard/admin/staff', icon: UserCog },
        { title: 'Add Staff', titleBn: 'স্টাফ যোগ করুন', href: '/dashboard/admin/staff/add', icon: UserCog },
        { title: 'Salary', titleBn: 'বেতন', href: '/dashboard/admin/staff/salary', icon: DollarSign },
        { title: 'Leave', titleBn: 'ছুটি', href: '/dashboard/admin/leave', icon: Calendar },
      ]
    },
    { title: 'Classes', titleBn: 'ক্লাস', href: '/dashboard/admin/classes', icon: BookOpen },
    { 
      title: 'Attendance', 
      titleBn: 'উপস্থিতি', 
      href: '/dashboard/admin/attendance', 
      icon: Calendar,
      items: [
        { title: 'Staff Attendance', titleBn: 'স্টাফ উপস্থিতি', href: '/dashboard/admin/attendance/staff', icon: Calendar },
        { title: 'Student Attendance', titleBn: 'শিক্ষার্থী উপস্থিতি', href: '/dashboard/admin/attendance/students', icon: Calendar },
        { title: 'NFC Mode', titleBn: 'এনএফসি মোড', href: '/dashboard/admin/nfc/gate', icon: CreditCard },
      ]
    },
    { 
      title: 'Fees', 
      titleBn: 'ফি', 
      href: '/dashboard/admin/fees', 
      icon: DollarSign,
      items: [
        { title: 'Collect Fee', titleBn: 'ফি সংগ্রহ', href: '/dashboard/admin/fees/collect', icon: DollarSign },
        { title: 'Fee Structure', titleBn: 'ফি কাঠামো', href: '/dashboard/admin/fees/structure', icon: DollarSign },
        { title: 'Due Fees', titleBn: 'বকেয়া ফি', href: '/dashboard/admin/fees/due', icon: Receipt },
        { title: 'History', titleBn: 'ইতিহাস', href: '/dashboard/admin/fees/history', icon: FileText },
      ]
    },
    { 
      title: 'Expenses', 
      titleBn: 'খরচ', 
      href: '/dashboard/admin/expenses', 
      icon: Receipt,
      items: [
        { title: 'All Expenses', titleBn: 'সকল খরচ', href: '/dashboard/admin/expenses', icon: Receipt },
        { title: 'Categories', titleBn: 'খাত', href: '/dashboard/admin/expenses/categories', icon: FileText },
        { title: 'Add Expense', titleBn: 'খরচ যোগ করুন', href: '/dashboard/admin/expenses/add', icon: Receipt },
      ]
    },
    { title: 'Boarding', titleBn: 'আবাসন', href: '/dashboard/admin/boarding', icon: Building2 },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/admin/notices', icon: Bell },
    { title: 'NFC Cards', titleBn: 'এনএফসি কার্ড', href: '/dashboard/admin/nfc', icon: CreditCard },
    { title: 'Reports', titleBn: 'রিপোর্ট', href: '/dashboard/admin/reports', icon: FileText },
    { title: 'Settings', titleBn: 'সেটিংস', href: '/dashboard/admin/settings', icon: Settings },
  ],
  manager: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/manager', icon: LayoutDashboard },
    { title: 'Students', titleBn: 'শিক্ষার্থী', href: '/dashboard/manager/students', icon: GraduationCap },
    { title: 'Staff', titleBn: 'কর্মচারী', href: '/dashboard/manager/staff', icon: UserCog },
    { title: 'Attendance', titleBn: 'উপস্থিতি', href: '/dashboard/manager/attendance', icon: Calendar },
    { title: 'Fee Collection', titleBn: 'ফি সংগ্রহ', href: '/dashboard/manager/fees', icon: DollarSign },
    { title: 'Expenses', titleBn: 'খরচ', href: '/dashboard/manager/expenses', icon: Receipt },
    { title: 'Reports', titleBn: 'রিপোর্ট', href: '/dashboard/manager/reports', icon: FileText },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/manager/notices', icon: Bell },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const navItems = roleNavItems[role] || [];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const toggleGroup = (href: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 transition-transform">
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-zinc-900 dark:text-white">
                মাদ্রাসা
              </span>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">
                ম্যানেজমেন্ট
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Label */}
        <div className="px-4 py-3">
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            মেনু লিস্ট
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasItems = item.items && item.items.length > 0;
            const isItemActive = isActive(item.href);
            const isGroupOpen = openGroups[item.href] || isItemActive;

            return (
              <div key={item.href}>
                {hasItems ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleGroup(item.href)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isItemActive
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-5 w-5", isItemActive ? "text-indigo-600" : "text-zinc-400")} />
                        <span>{item.titleBn}</span>
                      </div>
                      {isGroupOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isGroupOpen && item.items && (
                      <div className="ml-4 mt-1 border-l-2 border-zinc-100 dark:border-zinc-800 pl-2">
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                                isSubActive
                                  ? 'text-indigo-600 font-semibold'
                                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                              )}
                            >
                              <span>{subItem.titleBn}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isItemActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-500'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isItemActive ? "text-indigo-600" : "text-zinc-400")} />
                    <span>{item.titleBn}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}