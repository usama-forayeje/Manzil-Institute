'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarContextType {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    return {
      state: 'expanded' as const,
      open: true,
      setOpen: () => {},
      isMobile: false,
      openMobile: false,
      setOpenMobile: () => {},
      toggleSidebar: () => {},
    };
  }
  return context;
}

interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  const setOpenFn = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const newOpen = typeof value === 'function' ? value(open) : value;
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange, open]
  );

  const toggleSidebar = React.useCallback(() => {
    setOpenFn((prev) => !prev);
  }, [setOpenFn]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen: setOpenFn,
      isMobile: false,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpenFn, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={{
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '3rem',
          ...style,
        }}
        className={cn(
          'group/sidebar-wrapper flex min-h-svh w-full',
          className
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: 'icon' | 'offcanvas' | 'none';
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
}

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3rem';

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ 
    side = 'left', 
    variant = 'sidebar', 
    collapsible = 'offcanvas', 
    className, 
    children,
    ...props 
  }, ref) => {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-y-0 z-40 flex h-svh w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200',
          side === 'left' ? 'left-0' : 'right-0',
          variant === 'floating' && 'm-2 rounded-lg border shadow-lg',
          variant === 'inset' && 'inset-y-0 mt-16 rounded-none',
          className
        )}
        data-state={state}
        data-collapsible={collapsible}
        {...props}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {children}
        </div>
      </div>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      onClick={toggleSidebar}
      className={cn('p-2 rounded-md hover:bg-accent', className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      onClick={toggleSidebar}
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-w-resize items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:bg-sidebar-border sm:flex',
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto',
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70',
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
});
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li ref={ref} className={cn('list-none', className)} {...props} />
  );
});
SidebarMenuItem.displayName = 'SidebarMenuItem';

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ asChild, isActive, tooltip, className, children, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : 'button';
  
  return (
    <Comp>
      {asChild && children ? (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(
            'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
            className
          )}
          {...props}
        >
          {children}
        </div>
      ) : (
        <button
          ref={ref}
          className={cn(
            'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
            className
          )}
          data-active={isActive}
          {...props}
        >
          {children}
        </button>
      )}
    </Comp>
  );
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li ref={ref} className={cn('list-none', className)} {...props} />
  );
});
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

interface SidebarMenuSubButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: 'sm' | 'md';
}

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuSubButtonProps
>(({ asChild, isActive, size = 'md', className, children, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : 'a';
  
  return (
    <Comp>
      {asChild && children ? (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(
            'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
            className
          )}
          data-active={isActive}
          {...props}
        >
          {children}
        </div>
      ) : (
        <a
          ref={ref}
          className={cn(
            'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
            className
          )}
          data-active={isActive}
          {...props}
        >
          {children}
        </a>
      )}
    </Comp>
  );
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
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
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};
