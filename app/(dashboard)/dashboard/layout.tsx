import { getSession } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { HeaderDashboard } from '@/components/dashboard/HeaderDashboard';

interface NavItem {
  title: string;
  titleBn: string;
  href: string;
  icon?: string;
  items?: NavItem[];
}

const roleNavItems: Record<string, NavItem[]> = {
  super_admin: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/admin', icon: 'dashboard' },
    { 
      title: 'Students', 
      titleBn: 'শিক্ষার্থী', 
      href: '/dashboard/admin/students', 
      icon: 'students',
      items: [
        { title: 'All Students', titleBn: 'সকল শিক্ষার্থী', href: '/dashboard/admin/students', icon: 'students' },
        { title: 'Admission', titleBn: 'ভর্তি', href: '/dashboard/admin/students/admission', icon: 'students' },
        { title: 'Promote', titleBn: 'প্রমোশন', href: '/dashboard/admin/students/promote', icon: 'students' },
      ]
    },
    { 
      title: 'Staff', 
      titleBn: 'কর্মচারী', 
      href: '/dashboard/admin/staff', 
      icon: 'staff',
      items: [
        { title: 'All Staff', titleBn: 'সকল কর্মচারী', href: '/dashboard/admin/staff', icon: 'staff' },
        { title: 'Add Staff', titleBn: 'স্টাফ যোগ করুন', href: '/dashboard/admin/staff/add', icon: 'staff' },
        { title: 'Salary', titleBn: 'বেতন', href: '/dashboard/admin/staff/salary', icon: 'fees' },
        { title: 'Leave', titleBn: 'ছুটি', href: '/dashboard/admin/leave', icon: 'attendance' },
      ]
    },
    { title: 'Classes', titleBn: 'ক্লাস', href: '/dashboard/admin/classes', icon: 'classes' },
    { 
      title: 'Attendance', 
      titleBn: 'উপস্থিতি', 
      href: '/dashboard/admin/attendance', 
      icon: 'attendance',
      items: [
        { title: 'Staff Attendance', titleBn: 'স্টাফ উপস্থিতি', href: '/dashboard/admin/attendance/staff', icon: 'attendance' },
        { title: 'Student Attendance', titleBn: 'শিক্ষার্থী উপস্থিতি', href: '/dashboard/admin/attendance/students', icon: 'attendance' },
      ]
    },
    { 
      title: 'Fees', 
      titleBn: 'ফি', 
      href: '/dashboard/admin/fees', 
      icon: 'fees',
      items: [
        { title: 'Collect Fee', titleBn: 'ফি সংগ্রহ', href: '/dashboard/admin/fees/collect', icon: 'fees' },
        { title: 'Fee Structure', titleBn: 'ফি কাঠামো', href: '/dashboard/admin/fees/structure', icon: 'fees' },
        { title: 'Due Fees', titleBn: 'বকেয়া ফি', href: '/dashboard/admin/fees/due', icon: 'fees' },
        { title: 'History', titleBn: 'ইতিহাস', href: '/dashboard/admin/fees/history', icon: 'reports' },
      ]
    },
    { 
      title: 'Expenses', 
      titleBn: 'খরচ', 
      href: '/dashboard/admin/expenses', 
      icon: 'expenses',
      items: [
        { title: 'All Expenses', titleBn: 'সকল খরচ', href: '/dashboard/admin/expenses', icon: 'expenses' },
        { title: 'Categories', titleBn: 'খাত', href: '/dashboard/admin/expenses/categories', icon: 'expenses' },
        { title: 'Add Expense', titleBn: 'খরচ যোগ করুন', href: '/dashboard/admin/expenses/add', icon: 'expenses' },
      ]
    },
    { title: 'Boarding', titleBn: 'আবাসন', href: '/dashboard/admin/boarding', icon: 'boarding' },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/admin/notices', icon: 'notices' },
    { title: 'Reports', titleBn: 'রিপোর্ট', href: '/dashboard/admin/reports', icon: 'reports' },
    { title: 'Settings', titleBn: 'সেটিংস', href: '/dashboard/admin/settings', icon: 'settings' },
  ],
  manager: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/manager', icon: 'dashboard' },
    { title: 'Students', titleBn: 'শিক্ষার্থী', href: '/dashboard/manager/students', icon: 'students' },
    { title: 'Staff', titleBn: 'কর্মচারী', href: '/dashboard/manager/staff', icon: 'staff' },
    { title: 'Attendance', titleBn: 'উপস্থিতি', href: '/dashboard/manager/attendance', icon: 'attendance' },
    { title: 'Fee Collection', titleBn: 'ফি সংগ্রহ', href: '/dashboard/manager/fees', icon: 'fees' },
    { title: 'Expenses', titleBn: 'খরচ', href: '/dashboard/manager/expenses', icon: 'expenses' },
    { title: 'Reports', titleBn: 'রিপোর্ট', href: '/dashboard/manager/reports', icon: 'reports' },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/manager/notices', icon: 'notices' },
  ],
  teacher: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/teacher', icon: 'dashboard' },
    { title: 'My Classes', titleBn: 'আমার ক্লাস', href: '/dashboard/teacher/classes', icon: 'classes' },
    { title: 'Attendance', titleBn: 'উপস্থিতি', href: '/dashboard/teacher/attendance', icon: 'attendance' },
    { title: 'Students', titleBn: 'শিক্ষার্থী', href: '/dashboard/teacher/students', icon: 'students' },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/teacher/notices', icon: 'notices' },
  ],
  student: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/student', icon: 'dashboard' },
    { title: 'Attendance', titleBn: 'উপস্থিতি', href: '/dashboard/student/attendance', icon: 'attendance' },
    { title: 'Fees', titleBn: 'ফি', href: '/dashboard/student/fees', icon: 'fees' },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/student/notices', icon: 'notices' },
    { title: 'Results', titleBn: 'রেজাল্ট', href: '/dashboard/student/results', icon: 'reports' },
  ],
  parent: [
    { title: 'Dashboard', titleBn: 'ড্যাশবোর্ড', href: '/dashboard/parent', icon: 'dashboard' },
    { title: 'My Child', titleBn: 'আমার সন্তান', href: '/dashboard/parent/child', icon: 'students' },
    { title: 'Attendance', titleBn: 'উপস্থিতি', href: '/dashboard/parent/attendance', icon: 'attendance' },
    { title: 'Fees', titleBn: 'ফি', href: '/dashboard/parent/fees', icon: 'fees' },
    { title: 'Notices', titleBn: 'নোটিশ', href: '/dashboard/parent/notices', icon: 'notices' },
  ],
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const { role, user } = session;

  const roleDashboardMap: Record<string, string> = {
    super_admin: '/dashboard/admin',
    manager: '/dashboard/manager',
    teacher: '/dashboard/teacher',
    student: '/dashboard/student',
    parent: '/dashboard/parent',
  };

  const allowedDashboard = roleDashboardMap[role];

  if (pathname.startsWith('/dashboard/') && pathname !== allowedDashboard) {
    if (role === 'student' && pathname.startsWith('/dashboard/admin')) {
      redirect('/dashboard/student');
    }
    if (role === 'student' && pathname.startsWith('/dashboard/manager')) {
      redirect('/dashboard/student');
    }
    if (role === 'student' && pathname.startsWith('/dashboard/teacher')) {
      redirect('/dashboard/student');
    }
    if (role === 'teacher' && pathname.startsWith('/dashboard/admin')) {
      redirect('/dashboard/teacher');
    }
    if (role === 'teacher' && pathname.startsWith('/dashboard/manager')) {
      redirect('/dashboard/teacher');
    }
    if (role === 'manager' && pathname.startsWith('/dashboard/admin')) {
      redirect('/dashboard/manager');
    }
    if (role === 'parent' && pathname.startsWith('/dashboard/')) {
      redirect('/dashboard/parent');
    }
  }

  const navItems = roleNavItems[role] || roleNavItems.student;
  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userAvatar = (session.userDoc as { avatar?: string })?.avatar;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar 
          navItems={navItems}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />
        <div className="flex-1 flex flex-col min-h-screen ml-64 transition-all duration-300">
          <HeaderDashboard 
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            role={role}
          />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
