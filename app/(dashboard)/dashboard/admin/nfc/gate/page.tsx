import type { Metadata } from 'next';
import NfcScanner from '@/components/dashboard/attendance/NfcScanner';

export const metadata: Metadata = {
  title: 'Gate Mode Attendance | Manzil International Institute',
  description: 'NFC based gate attendance scanner',
};

export default function GateModePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold kalpurush-font text-zinc-900">গেট মোড (Gate Mode)</h1>
        <p className="text-sm text-zinc-500 kalpurush-font">বিদ্যালয়ের মূল ফটকে এই পেজটি চালু রাখুন</p>
      </div>
      
      <div className="w-full max-w-2xl">
        <NfcScanner />
      </div>
    </div>
  );
}
