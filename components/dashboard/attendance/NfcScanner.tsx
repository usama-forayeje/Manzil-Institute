'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { processNfcScan } from '@/lib/actions/attendance';
import { toast } from 'sonner';
import { Nfc, Users } from 'lucide-react';

export default function NfcScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(true);
  const [lastScanResult, setLastScanResult] = useState<any | null>(null);

  // Fallback dev scan
  const [simulatedCardId, setSimulatedCardId] = useState('');

  useEffect(() => {
    if (!('NDEFReader' in window)) {
      setNfcSupported(false);
    }
  }, []);

  const handleNfcScan = async () => {
    if (!nfcSupported) {
      toast.error('আপনার ডিভাইস বা ব্রাউজার NFC সাপোর্ট করে না। (Chrome for Android ব্যবহার করুন)');
      return;
    }

    try {
      setIsScanning(true);
      // @ts-ignore
      const ndef = new window.NDEFReader();
      await ndef.scan();
      toast.info('NFC কার্ড স্ক্যান করার জন্য ডিভাইসটি কার্ডের কাছে আনুন');

      // @ts-ignore
      ndef.addEventListener('reading', async ({ message, serialNumber }) => {
        // Use serialNumber as card ID
        const cardId = serialNumber.replace(/:/g, "").toUpperCase();
        await processCard(cardId);
        
        // Stop scanning after 1 successful read
        setIsScanning(false);
      });

      // @ts-ignore
      ndef.addEventListener('error', (error) => {
        toast.error('NFC স্ক্যান এরর: ' + error.message);
        setIsScanning(false);
      });
      
    } catch (error: any) {
      toast.error('NFC চালু করতে সমস্যা হয়েছে: ' + error.message);
      setIsScanning(false);
    }
  };

  const processCard = async (cardId: string) => {
    setLastScanResult(null);
    const result = await processNfcScan(cardId);
    
    if (result.success) {
      setLastScanResult(result);
      if (result.action === 'entry') {
        toast.success(`প্রবেশ সম্পন্ন: ${result.user?.nameBn || result.user?.name}`);
      } else {
        toast.success(`প্রস্থান সম্পন্ন: ${result.user?.nameBn || result.user?.name}`);
      }
    } else {
      toast.error(result.error || 'কার্ডটি ডাটাবেসে পাওয়া যায়নি');
    }
  };

  const handleSimulatedScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedCardId) return;
    await processCard(simulatedCardId);
    setSimulatedCardId('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8 text-center border-zinc-200">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-cyan-50 dark:bg-zinc-800 flex items-center justify-center relative">
            <Nfc className={`h-12 w-12 ${isScanning ? 'text-cyan-500 animate-pulse' : 'text-zinc-400'}`} />
            {isScanning && (
              <span className="absolute flex h-24 w-24">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20"></span>
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold kalpurush-font mb-2">NFC স্মার্ট কার্ড স্ক্যানার</h2>
        <p className="text-sm text-zinc-500 kalpurush-font mb-8">
          উপস্থিতি নিশ্চিত করতে আপনার আইডি কার্ড ডিভাইসের পিছনে স্ক্যান করুন
        </p>

        <Button
          size="lg"
          onClick={handleNfcScan}
          disabled={!nfcSupported || isScanning}
          className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[200px] font-semibold kalpurush-font rounded-xl"
        >
          {isScanning ? 'স্ক্যান করা হচ্ছে...' : 'স্ক্যান শুরু করুন'}
        </Button>

        {!nfcSupported && (
          <p className="mt-4 text-xs text-amber-600 bg-amber-50 p-2 rounded kalpurush-font inline-block">
            ⚠️ এই ডিভাইসে NFC সাপোর্ট নেই। অনুগ্রহ করে অ্যান্ড্রয়েড ফোন ব্যবহার করুন অথবা নিচের ম্যানুয়াল সিমুলেশন ব্যবহার করুন।
          </p>
        )}
      </Card>

      {lastScanResult && (
        <Card className={`p-6 border-l-4 ${lastScanResult.action === 'entry' ? 'border-l-emerald-500 bg-emerald-50/50' : 'border-l-amber-500 bg-amber-50/50'}`}>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-16 w-16 rounded-full bg-white items-center justify-center shadow-sm">
              <Users className="h-8 w-8 text-zinc-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold kalpurush-font text-zinc-900">
                  {lastScanResult.user?.nameBn || lastScanResult.user?.name}
                </h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${lastScanResult.action === 'entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {lastScanResult.action === 'entry' ? 'IN (প্রবেশ)' : 'OUT (প্রস্থান)'}
                </span>
              </div>
              <p className="text-sm text-zinc-600 kalpurush-font">
                রোল/আইডি: {lastScanResult.user?.studentId || lastScanResult.user?.staffId} <br/>
                স্ক্যান করার সময়: {new Date(lastScanResult.record?.timestamp || Date.now()).toLocaleTimeString('en-US')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* For Development / Admin Fallback */}
      <Card className="p-6 border-dashed border-zinc-300 bg-zinc-50">
        <h3 className="text-sm font-bold kalpurush-font mb-2">ডেভেলপমেন্ট / ম্যানুয়াল স্ক্যান</h3>
        <form onSubmit={handleSimulatedScan} className="flex gap-2">
          <input
            type="text"
            placeholder="NFC Card ID দিন (উদাঃ 04:A1:B2:C3:D4)"
            className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
            value={simulatedCardId}
            onChange={(e) => setSimulatedCardId(e.target.value)}
          />
          <Button type="submit" variant="secondary" className="kalpurush-font">
            সিমুলেট করুন
          </Button>
        </form>
      </Card>
    </div>
  );
}
