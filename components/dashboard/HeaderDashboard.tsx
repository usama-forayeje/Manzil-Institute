'use client';

import { Search } from 'lucide-react';
import { SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import SearchInput from './search-input';
import { ThemeModeToggle } from '../themes/theme-mode-toggle';
import { ThemeSelector } from '../themes/theme-selector';
import { Separator } from '../ui/separator';

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
  role = 'student',
}: HeaderDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      // Silent error handling
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear" suppressHydrationWarning>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mr-2" />
      </div>

      <div className="flex items-center gap-2 px-4">
        <SearchInput suppressHydrationWarning />

        <ThemeModeToggle />
        {/* <NotificationCenter /> */}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 ring-offset-background"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={userAvatar}
                  alt={userName}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="rounded-full">
                  {userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            sideOffset={10}
            suppressHydrationWarning
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{userName}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/profile')}
              >
                <span className="bengali-text">প্রোফাইল</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="bengali-text">সেটিংস</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="bengali-text">নোটিফিকেশন</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <span className="bengali-text">লগআউট</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
