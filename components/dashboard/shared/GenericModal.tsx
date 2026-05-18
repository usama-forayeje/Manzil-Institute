'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenericModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  className?: string;
  showFooter?: boolean;
  onConfirm?: () => void;
  confirmLabel?: string;
  isPending?: boolean;
}

export function GenericModal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  maxWidth = 'max-w-md',
  className,
  showFooter = true,
  onConfirm,
  confirmLabel = 'Save Changes',
  isPending = false
}: GenericModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden rounded-md border-zinc-100 dark:border-zinc-800 shadow-2xl bg-white dark:bg-[#09090b] kalpurush-font flex flex-col",
          maxWidth,
          className
        )}
      >
        <DialogHeader className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00AEEF]/20 to-transparent" />
          
          <div className="flex items-center gap-5 relative z-10">
            {Icon && (
              <div className="h-12 w-12 rounded-md bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20 shrink-0">
                <Icon className="h-6 w-6 text-[#00AEEF]" />
              </div>
            )}
            <div className="min-w-0">
              <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none truncate">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[10px] text-zinc-500 font-bold mt-1.5 uppercase tracking-widest opacity-70 truncate italic">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6 relative max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {showFooter && (
          <DialogFooter className="p-8 bg-zinc-50/30 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/50 gap-3">
            {footer ? footer : (
              <>
                <Button 
                  variant="ghost" 
                  type="button"
                  onClick={() => onClose(false)}
                  className="rounded-md px-8 h-12 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border-0 shadow-none"
                  disabled={isPending}
                >
                  বাতিল
                </Button>
                {onConfirm && (
                  <Button
                    type="button"
                    onClick={onConfirm}
                    disabled={isPending}
                    className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-10 h-12 font-black uppercase text-[10px] tracking-[0.1em] shadow-xl shadow-cyan-500/10 active:scale-95 transition-all flex items-center gap-2 border-0"
                  >
                    {isPending && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Icon className="h-4 w-4" /></motion.div>}
                    {confirmLabel}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
