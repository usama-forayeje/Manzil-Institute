"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function HelpTooltip({ content, children, className }: HelpTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-full text-zinc-400 hover:text-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2",
              className
            )}
          >
            {children || <HelpCircle className="h-4 w-4" />}
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={5}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="z-[100] max-w-[280px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 text-sm text-zinc-700 dark:text-zinc-300 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 kalpurush-font leading-relaxed"
            >
              {content}
              <TooltipPrimitive.Arrow className="fill-white/80 dark:fill-zinc-900/80" />
            </motion.div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
