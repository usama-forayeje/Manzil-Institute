import { getSession } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { HeaderDashboard } from '@/components/dashboard/HeaderDashboard';
import { roleNavItems } from '@/config/nav';

// Dashboard layout - now simplified since RBAC is handled in middleware
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
  
  // Get avatar from session
  const userAvatar = session.userAvatar || undefined;
  
  // Get cookie for sidebar state
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <ThemeProvider defaultTheme="dark" storageKey="manzil-theme">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar 
          navItems={roleNavItems[role] || roleNavItems.student}
          userName={user?.name || 'User'}
          userEmail={user?.email || 'user@example.com'}
          userAvatar={userAvatar}
        />
        <SidebarInset>
          <HeaderDashboard 
            userName={user?.name || 'User'}
            userEmail={user?.email || 'user@example.com'}
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
