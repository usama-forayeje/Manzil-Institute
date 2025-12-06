'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useDeferredValue, useMemo } from 'react';

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props
}) {
  const deferredBlurLayers = useDeferredValue(blurLayers);
  const deferredDirection = useDeferredValue(direction);
  const deferredBlurIntensity = useDeferredValue(blurIntensity);

  const layers = Math.max(deferredBlurLayers, 2);
  const segmentSize = 1 / (deferredBlurLayers + 1);

  const gradientLayers = useMemo(() => {
    return Array.from({ length: layers }).map((_, index) => {
      const angle = GRADIENT_ANGLES[deferredDirection];
      const gradientStops = [
        index * segmentSize,
        (index + 1) * segmentSize,
        (index + 2) * segmentSize,
        (index + 3) * segmentSize,
      ].map(
        (pos, posIndex) =>
          `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`
      );

      const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
        ', '
      )})`;

      return (
        <motion.div
          key={index}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            maskImage: gradient,
            WebkitMaskImage: gradient,
            backdropFilter: `blur(${index * deferredBlurIntensity}px)`,
            WebkitBackdropFilter: `blur(${index * deferredBlurIntensity}px)`,
          }}
          {...props}
        />
      );
    });
  }, [layers, segmentSize, deferredDirection, deferredBlurIntensity, props]);

  return <div className={cn('relative', className)}>{gradientLayers}</div>;
}
