import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import StaffForm from '@/components/staff/StaffForm';
import { StaffFormErrorBoundary } from '@/components/staff/StaffFormErrorBoundary';

export const metadata: Metadata = {
  title: 'স্টাফ নিবন্ধন ফর্ম — Manzil Institute',
  description: 'মানযিল ইনস্টিটিউটে যোগদানের জন্য তথ্য পূরণ করুন',
  robots: { index: false, follow: false },
};

export default function StaffApplyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        {/* Dual Logos with X Icon */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
          <Link
            href="/"
            className="inline-block transition-transform hover:-translate-y-0.5 duration-300"
          >
            <Image
              src="/manzil-logo/manzil-gorup-logo-dark.webp"
              alt="Manzil Group"
              width={120}
              height={30}
              className="h-6 sm:h-7 w-auto object-contain opacity-90 drop-shadow-md"
              priority
            />
          </Link>
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/10 backdrop-blur-md shadow-sm ring-1 ring-cyan-500/40 border border-cyan-500/10">
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <Link
            href="/"
            className="inline-block transition-transform hover:-translate-y-0.5 duration-300"
          >
            <Image
              src="/manzil-logo/manzil-institute-logo-dark.webp"
              alt="Manzil Institute Logo"
              width={140}
              height={35}
              className="h-7 sm:h-8 w-auto object-contain drop-shadow-md"
              priority
            />
          </Link>
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-1 kalpurush-font text-cyan-600 dark:text-cyan-400">
          স্টাফ নিবন্ধন ফর্ম
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 kalpurush-font">
          সকল তথ্য সঠিকভাবে পূরণ করুন। <span className="text-red-500">*</span>{' '}
          চিহ্নিত ঘর পূরণ করা আবশ্যক।
        </p>
      </div>

      <StaffFormErrorBoundary>
        <StaffForm />
      </StaffFormErrorBoundary>

      <p className="text-center text-[10px] sm:text-xs text-cyan-600/60 dark:text-cyan-400/60 mt-8 kalpurush-font">
        কোনো সমস্যা হলে যোগাযোগ করুন — মানযিল ইনস্টিটিউট, ঢাকা
      </p>
    </div>
  );
}
