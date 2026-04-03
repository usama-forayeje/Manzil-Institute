'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  defaultOpen?: boolean;
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface CollapsibleTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

interface CollapsibleContentProps {
  className?: string;
  children: React.ReactNode;
}

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function Collapsible({
  defaultOpen = false,
  className,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div className={cn('Collapsible-root', className)}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  asChild,
  className,
  children,
  onClick,
}: CollapsibleTriggerProps) {
  const { open, setOpen } = React.useContext(CollapsibleContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        setOpen(!open);
        if (onClick) onClick(e);
      },
      'data-state': open ? 'open' : 'closed',
      className: cn(children.props.className, className),
    });
  }

  return (
    <button
      onClick={(e) => {
        setOpen(!open);
        if (onClick) onClick(e);
      }}
      data-state={open ? 'open' : 'closed'}
      className={cn('CollapsibleTrigger', className)}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  className,
  children,
}: CollapsibleContentProps) {
  const { open } = React.useContext(CollapsibleContext);

  return (
    <div
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'CollapsibleContent transition-all duration-200',
        open ? 'CollapsibleContent-open' : 'CollapsibleContent-closed',
        className
      )}
      style={{
        overflow: 'hidden',
        maxHeight: open ? '1000px' : '0px',
        opacity: open ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
