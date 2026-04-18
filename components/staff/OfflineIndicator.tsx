'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Offline detector hook
 * Returns online status and shows toast when connection changes
 */
export function useOfflineDetector() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('ইন্টারনেট কানেকশন পুনরুদ্ধার হয়েছে');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('ইন্টারনেট কানেকশন বিচ্ছিন্ন হয়েছে');
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Offline indicator component
 * Shown at top of form when user is offline
 */
export function OfflineIndicator() {
  const isOnline = useOfflineDetector();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff className="h-5 w-5" />
      <span className="font-bold">অফলাইন</span>
      <span className="text-sm">• দয়া করে ইন্টারনেট কানেকশন চেক করুন</span>
      <Wifi className="h-4 w-4 ml-2" />
    </div>
  );
}
