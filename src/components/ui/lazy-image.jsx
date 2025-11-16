import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

const LazyImage = forwardRef(function LazyImage({
  src,
  alt,
  fallback,
  className,
  objectFit = 'cover',
  width,
  height,
  onLoad,
  onError,
  ...props
}, ref) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const imgElement = imgRef.current
    if (!imgElement) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    )

    observerRef.current.observe(imgElement)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const handleLoad = (e) => {
    setIsLoading(false)
    onLoad?.(e)
  }

  const handleError = (e) => {
    setIsLoading(false)
    setHasError(true)
    onError?.(e)
  }

  // If there's an error and no fallback, show nothing or a placeholder
  if (hasError && !fallback) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded", className)}
        style={{ aspectRatio: '16/9' }} // Default aspect ratio
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={isInView ? (hasError ? fallback : src) : undefined}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          `object-${objectFit}`,
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  )
})

LazyImage.displayName = 'LazyImage'

export { LazyImage }