'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  LogOut,
  User,
  Bell,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Receipt,
  Home,
  BarChart3,
  CreditCard,
  Library,
  Wallet,
  CalendarOff,
  ClipboardList,
  Clock,
  MessageSquare,
  UserCircle,
  Baby,
  Wrench,
  FileSearch,
  FileText,
  Activity,
  FileCheck,
  BookMarked,
  ScrollText,
  Briefcase,
  School,
  CalendarCheck,
  Banknote,
  Building2,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  SidebarSeparator,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/lib/auth/actions';

interface NavItem {
  title: string;
  titleBn: string;
  href: string;
  icon?: string;
  items?: NavItem[];
}

interface AppSidebarProps {
  navItems: NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const SIDEBAR_ICONS: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  students: GraduationCap,
  staff: Users,
  teacher: BookOpen,
  classes: School,
  attendance: CalendarCheck,
  fees: Banknote,
  expenses: Receipt,
  boarding: Building2,
  notices: Bell,
  reports: BarChart3,
  settings: Settings,
  nfc: CreditCard,
  library: Library,
  salary: Wallet,
  leave: CalendarOff,
  exam: ClipboardList,
  timetable: Clock,
  messages: MessageSquare,
  profile: UserCircle,
  child: Baby,
  tools: Wrench,
  audit: FileSearch,
  policies: FileText,
  health: Activity,
  receipt: FileCheck,
  accounts: BookMarked,
  terms: ScrollText,
  designations: Briefcase,
};

export function AppSidebar({
  navItems = [],
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar,
}: AppSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      // Silent error handling
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="font-bangla ">
        <Link href="/" className="flex items-center gap-2 py-0.5">
          {/* Expanded */}
          <div className="flex items-center justify-center h-9 w-auto max-w-[140px] overflow-hidden group-data-[collapsible=icon]:hidden">
            <Image
              src="/manzil-logo/manzil-institute-logo-dark.webp"
              alt="Manzil Institute"
              width={140}
              height={40}
              className="h-full w-auto object-contain"
              priority
              suppressHydrationWarning
            />
          </div>
          {/* Collapsed — icon only */}
          <div className="hidden group-data-[collapsible=icon]:flex h-9 w-9 items-center justify-center shrink-0">
            <Image
              src="/manzil-institute-logo.jpg"
              alt="Manzil Institute"
              width={36}
              height={36}
              className="h-9 w-9 rounded ring-1 ring-emerald-600/30 ring-offset-1 ring-offset-background object-cover"
              suppressHydrationWarning
            />
          </div>
        </Link>
      </SidebarHeader>

      {/* <SidebarSeparator className="overflow-hidden " /> */}

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(item => {
              const IconComponent = item.icon
                ? SIDEBAR_ICONS[item.icon]
                : undefined;
              const isSubActive = item.items?.some(
                sub => pathname === sub.href
              );
              const isActive = pathname === item.href || isSubActive;

              if (item.items && item.items.length > 0) {
                return (
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
                          tooltip={item.titleBn}
                        >
                          {IconComponent && <IconComponent />}
                          <span className="bengali-text">{item.titleBn}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map(subItem => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>
                                  <span className="bengali-text">
                                    {subItem.titleBn}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.titleBn}
                  >
                    <Link href={item.href}>
                      {IconComponent && <IconComponent />}
                      <span className="bengali-text">{item.titleBn}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={userAvatar}
                      alt={userName}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="rounded-lg bg-sidebar-primary/10 text-sidebar-primary text-xs">
                      {userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left ml-2 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {userName}
                    </span>
                    <span className="text-xs text-sidebar-foreground/60 truncate">
                      {userEmail}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userAvatar}
                          alt={userName}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="rounded-lg bg-sidebar-primary/10 text-sidebar-primary text-xs">
                          {userName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate">
                          {userName}
                        </span>
                        <span className="text-xs text-sidebar-foreground/60 truncate">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span className="bengali-text">প্রোফাইল</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="bengali-text">সেটিংস</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span className="bengali-text">নোটিফিকেশন</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="bengali-text">লগআউট</span>
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
