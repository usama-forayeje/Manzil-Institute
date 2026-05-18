'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  isLoading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageHeaderAction?: React.ReactNode;
  className?: string;
}

function PageSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div className="space-y-2">
          <Skeleton className='h-8 w-48 rounded' />
          <Skeleton className='h-4 w-96 rounded max-w-full' />
        </div>
      </div>
      <Skeleton className='mt-6 h-40 w-full rounded-lg' />
      <Skeleton className='h-40 w-full rounded-lg' />
    </div>
  );
}

export function PageContainer({
  children,
  scrollable = false,
  isLoading = false,
  access = true,
  accessFallback,
  pageTitle,
  pageDescription,
  pageHeaderAction,
  className,
}: PageContainerProps) {
  if (!access) {
    return (
      <div className='flex flex-1 items-center justify-center p-4 md:px-6'>
        {accessFallback ?? (
          <div className='text-muted-foreground text-center text-lg'>
            You do not have access to this page.
          </div>
        )}
      </div>
    );
  }

  const content = isLoading ? <PageSkeleton /> : children;

  const hasHeader = pageTitle || pageHeaderAction;

  const inner = (
    <div className={cn('flex flex-1 flex-col p-4 md:px-6', className)}>
      {hasHeader && (
        <div className='bg-background sticky top-0 z-10 mb-4 flex items-start justify-between gap-4 pb-4'>
          <div>
            {pageTitle && (
              <h1 className='text-2xl font-bold tracking-tight'>{pageTitle}</h1>
            )}
            {pageDescription && (
              <p className='text-muted-foreground mt-1'>{pageDescription}</p>
            )}
          </div>
          {pageHeaderAction && <div className='shrink-0'>{pageHeaderAction}</div>}
        </div>
      )}
      {content}
    </div>
  );

  if (scrollable) {
    return <ScrollArea className='h-[calc(100dvh-52px)]'>{inner}</ScrollArea>;
  }

  return inner;
}
