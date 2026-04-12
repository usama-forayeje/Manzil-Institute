// Force dynamic rendering because this layout uses cookies
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { HeaderDashboard } from '@/components/dashboard/HeaderDashboard';
import { roleNavItems } from '@/config/nav';

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

  // Get avatar from session
  const userAvatar = session.userAvatar || undefined;

  // Get cookie for sidebar state
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <ThemeProvider defaultTheme="dark" storageKey="manzil-theme">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          navItems={navItems}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />
        <SidebarInset>
          <HeaderDashboard
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            role={role}
          />
          <Separator className="bg-border" />
          <main className="p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
