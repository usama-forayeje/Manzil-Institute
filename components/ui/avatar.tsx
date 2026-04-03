'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

interface AvatarImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'aspect-square h-full w-full object-cover',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-lg bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
