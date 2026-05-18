import type { Metadata } from 'next';
import IDCardDashboard from '@/features/id-cards/components/IDCardDashboard';

export const metadata: Metadata = {
  title: 'আইডি কার্ড জেনারেটর | Manzil International Institute',
  description: 'Generate and manage student ID cards',
};

export default function IDCardsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-4 pb-12">
      {/* Header Section */}
      <section className="mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 kalpurush-font">
            আইডি কার্ড জেনারেটর
          </h1>
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest english-text opacity-70">
            Student Identity Card Generation & Management
          </p>
        </div>
      </section>

      {/* Main Feature Component */}
      <IDCardDashboard />
    </div>
  );
}
