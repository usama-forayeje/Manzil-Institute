'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { markManualAttendance } from '@/lib/actions/attendance';
import { toast } from 'sonner';

export default function StudentAttendancePage() {
  const [studentId, setStudentId] = useState('');
  const [isMarking, setIsMarking] = useState(false);
  const [type, setType] = useState<'entry' | 'exit'>('entry');
  const [notes, setNotes] = useState('');

  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsMarking(true);
    const result = await markManualAttendance({
      entityId: studentId.trim(),
      entityType: 'student',
      action: type,
      manuallyMarkedBy: 'admin',
      notes,
    });

    if (result.success) {
      toast.success(
        `সফলভাবে মার্ক করা হয়েছে: ${type === 'entry' ? 'IN' : 'OUT'} (${result.userName})`
      );
      setStudentId('');
      setNotes('');
    } else {
      toast.error(result.error || 'মার্ক করতে সমস্যা হয়েছে');
    }

    setIsMarking(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold kalpurush-font text-zinc-900">শিক্ষার্থী উপস্থিতি (Student Attendance)</h1>
          <p className="text-sm text-zinc-500 kalpurush-font mt-1">ম্যানুয়াল হাজিরা এবং আজকের উপস্থিতির রেকর্ড দেখুন।</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard/admin/nfc/gate'}
          className="kalpurush-font border-cyan-200 text-cyan-700 bg-cyan-50 hover:bg-cyan-100"
        >
          NFC গেট মোড চালু করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-zinc-200">
          <h2 className="text-lg font-bold kalpurush-font text-zinc-900 mb-4">ম্যানুয়াল উপস্থিতি মার্ক করুন</h2>
          <form onSubmit={handleMark} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold kalpurush-font">স্টুডেন্ট আইডি</label>
              <Input
                placeholder="উদাঃ MDS-2025-1234"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold kalpurush-font">অ্যাকশন ধরন</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm kalpurush-font">
                  <input
                    type="radio"
                    name="type"
                    value="entry"
                    checked={type === 'entry'}
                    onChange={() => setType('entry')}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  প্রবেশ (Entry)
                </label>
                <label className="flex items-center gap-2 text-sm kalpurush-font">
                  <input
                    type="radio"
                    name="type"
                    value="exit"
                    checked={type === 'exit'}
                    onChange={() => setType('exit')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  প্রস্থান (Exit)
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold kalpurush-font">নোট (ঐচ্ছিক)</label>
              <Input
                placeholder="যেমন: দেরিতে এসেছে, বা ছুটি নিয়ে আগে যাচ্ছে"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="kalpurush-font"
              />
            </div>

            <Button
              type="submit"
              disabled={isMarking}
              className={`w-full text-white font-semibold kalpurush-font ${type === 'entry' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-amber-600 hover:bg-amber-700'}`}
            >
              {isMarking ? 'মার্ক করা হচ্ছে...' : 'উপস্থিতি মার্ক করুন'}
            </Button>
          </form>
        </Card>

        <Card className="p-6 border-zinc-200">
          <h2 className="text-lg font-bold kalpurush-font text-zinc-900 mb-4">আজকের সারাংশ (Today's Summary)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-emerald-600">--</span>
              <span className="text-sm font-medium kalpurush-font text-emerald-800 mt-1">উপস্থিত</span>
            </div>
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-rose-600">--</span>
              <span className="text-sm font-medium kalpurush-font text-rose-800 mt-1">অনুপস্থিত</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 kalpurush-font text-center mt-4">
            * সারাংশ লাইভ দেখতে ডাটাবেস কোয়েরি ইমপ্লিমেন্ট করা হবে।
          </p>
        </Card>
      </div>
    </div>
  );
}
