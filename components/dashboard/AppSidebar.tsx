'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Bell,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth/actions';
import { useTheme } from '@/components/themes/theme-provider';

interface NavItem {
  title: string;
  titleBn: string;
  href: string;
  icon?: React.ElementType;
  items?: NavItem[];
}

interface AppSidebarProps {
  navItems: NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const roleLabels: Record<string, string> = {
  super_admin: 'সুপার অ্যাডমিন',
  manager: 'ম্যানেজার',
  teacher: 'শিক্ষক',
  student: 'শিক্ষার্থী',
  parent: 'অভিভাবক',
};

const defaultNavItems: NavItem[] = [
  { 
    title: 'Dashboard', 
    titleBn: 'ড্যাশবোর্ড', 
    href: '/dashboard', 
    icon: undefined 
  },
];

export function AppSidebar({ 
  navItems = defaultNavItems,
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar 
}: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { theme } = useTheme();
  const isCollapsed = state === 'collapsed';
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getIcon = (iconName?: string) => {
    const icons: Record<string, React.ElementType> = {
      dashboard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
      ),
      students: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
      ),
      staff: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
      ),
      classes: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
      ),
      attendance: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
      ),
      fees: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
      ),
      expenses: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
      ),
      boarding: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M9 21v-8h6v8" /></svg>
      ),
      notices: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
      ),
      reports: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M8 18v-1" /><path d="M16 18v-3" /></svg>
      ),
      settings: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
      ),
    };
    return iconName ? icons[iconName] : undefined;
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'border-r transition-all duration-300',
        isDark 
          ? 'bg-zinc-950 border-zinc-800' 
          : 'bg-white border-zinc-200'
      )}
    >
      <SidebarHeader className={cn(
        'border-b',
        isDark 
          ? 'bg-zinc-950 border-zinc-800' 
          : 'bg-white border-zinc-200'
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <div className={cn(
            'flex items-center justify-center shrink-0 w-10 h-10 rounded-xl',
            isDark 
              ? 'bg-zinc-900 border border-zinc-800' 
              : 'bg-zinc-50 border border-zinc-100'
          )}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={isDark ? '#60cdff' : '#00aef'} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className={cn(
                'text-base font-bold leading-none',
                isDark ? 'text-white' : 'text-zinc-900'
              )}>
                মাদ্রাসা
              </span>
              <span className={cn(
                'text-[10px] font-medium mt-1 uppercase tracking-tighter',
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              )}>
                ম্যানেজমেন্ট
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn(
        'overflow-x-hidden',
        isDark 
          ? 'bg-zinc-950' 
          : 'bg-white'
      )}>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            'font-bold tracking-widest text-[10px] uppercase px-2',
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          )}>
            মেনু লিস্ট
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon ? getIcon(item.icon) : undefined;
              const isSubActive = item.items?.some((sub) => pathname === sub.href);
              const isActive = pathname === item.href || isSubActive;

              return item.items && item.items.length > 0 ? (
                <Collapsible
                  key={item.href}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={cn(
                          'transition-all py-2.5 rounded-lg w-full',
                          isActive 
                            ? cn(
                                isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900',
                                'font-semibold'
                              )
                            : cn(
                                isDark ? 'text-zinc-400' : 'text-zinc-600',
                                'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                              )
                        )}
                      >
                        {IconComponent && (
                          <IconComponent />
                        )}
                        <span className="font-medium">{item.titleBn}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className={cn(
                        'border-l-2 ml-4',
                        isDark ? 'border-zinc-800' : 'border-zinc-100'
                      )}>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.href}
                              className={cn(
                                'py-1.5 rounded-md transition-all',
                                pathname === subItem.href 
                                  ? cn('font-bold', isDark ? 'text-[#60cdff]' : 'text-[#00aef]')
                                  : cn(isDark ? 'text-zinc-500' : 'text-zinc-500')
                              )}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.titleBn}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      'transition-all py-2.5 rounded-lg',
                      pathname === item.href 
                        ? cn(
                            isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900',
                            'font-semibold'
                          )
                        : cn(
                            isDark ? 'text-zinc-400' : 'text-zinc-600',
                            'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                          )
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      {IconComponent && (
                        <IconComponent />
                      )}
                      <span className="font-medium">{item.titleBn}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn(
        'border-t',
        isDark 
          ? 'bg-zinc-950 border-zinc-800' 
          : 'bg-white border-zinc-200'
      )}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    'hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg',
                    isDark ? 'text-white' : 'text-zinc-900'
                  )}
                >
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className={cn(
                      'rounded-lg',
                      isDark ? 'bg-[#60cdff]/10 text-[#60cdff]' : 'bg-[#00aef]/10 text-[#00aef]'
                    )}>
                      {userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-sm leading-tight text-left">
                    <span className="font-semibold truncate">{userName}</span>
                    <span className={cn(
                      'text-xs truncate',
                      isDark ? 'text-zinc-400' : 'text-muted-foreground'
                    )}>
                      {userEmail}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-zinc-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="w-8 h-8 rounded-lg">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className={cn(
                          'rounded-lg',
                          isDark ? 'bg-[#60cdff]/10 text-[#60cdff]' : 'bg-[#00aef]/10 text-[#00aef]'
                        )}>
                          {userName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-sm leading-tight text-left">
                        <span className="font-semibold truncate">{userName}</span>
                        <span className="text-xs truncate text-muted-foreground">{userEmail}</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-2" /> Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
