import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circular" | "rectangular";
}

function Skeleton({ className, variant = "default" }: SkeletonProps) {
  const variantClass = {
    default: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "bg-muted animate-pulse",
        variantClass[variant],
        className
      )}
    />
  );
}

// Card Skeleton Component
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="space-y-3">
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

// Text Skeleton Component
function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Avatar Skeleton Component
function AvatarSkeleton({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-muted animate-pulse",
        sizeClasses[size],
        className
      )}
    />
  );
}

// Button Skeleton Component
function ButtonSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("h-10 w-24 rounded-md bg-muted animate-pulse", className)} />
  );
}

// Image Skeleton Component
function ImageSkeleton({ aspectRatio = "square", className }: { aspectRatio?: "square" | "video" | "portrait"; className?: string }) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg bg-muted animate-pulse",
        aspectClasses[aspectRatio],
        className
      )}
    />
  );
}

// List Skeleton Component
function ListSkeleton({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="h-4 flex-1 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Grid Skeleton Component
function GridSkeleton({ items = 6, className }: { items?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="rounded-lg bg-muted animate-pulse aspect-video" />
      ))}
    </div>
  );
}

export {
  Skeleton,
  CardSkeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  ImageSkeleton,
  ListSkeleton,
  GridSkeleton,
};