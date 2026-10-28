'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Camera, CameraOff, Volume2, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  title?: string;
  description?: string;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onScan,
  title = 'বারকোড ও কিউআর কোড স্ক্যানার',
  description = 'শিক্ষার্থী স্মার্ট আইডি কার্ডের বারকোড বা কিউআর কোড ক্যামেরার সামনে ধরুন',
}: BarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Play pleasant cashier barcode beep
  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      if (navigator.vibrate) navigator.vibrate(100);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  const handleDetected = useCallback((code: string) => {
    if (!code) return;
    const clean = code.trim();
    if (!clean) return;
    setScannedCode(clean);
    playBeep();
    toast.success(`কার্ড স্ক্যান হয়েছে: ${clean}`);
    setTimeout(() => {
      onScan(clean);
      onClose();
    }, 400);
  }, [playBeep, onScan, onClose]);

  // Start Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setScannedCode(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        setCameraError('আপনার ব্রাউজার ক্যামেরা সাপোর্ট করে না');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setHasCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setHasCamera(false);
      setCameraError(err.name === 'NotAllowedError' ? 'ক্যামেরা ব্যবহারের অনুমতি দেওয়া হয়নি' : 'ক্যামেরা চালু করা যায়নি');
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  }, [stream]);

  // Open/Close effect
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedCode(null);
      setManualCode('');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Native BarcodeDetector loop
  useEffect(() => {
    if (!isScanning || !videoRef.current || scannedCode) return;

    let active = true;
    let detector: any = null;

    if ('BarcodeDetector' in window) {
      try {
        detector = new (window as any).BarcodeDetector({
          formats: ['code_128', 'code_39', 'qr_code', 'ean_13', 'ean_8', 'itf', 'data_matrix'],
        });
      } catch {
        detector = null;
      }
    }

    const interval = setInterval(async () => {
      if (!active || !videoRef.current || videoRef.current.readyState < 2 || !detector || scannedCode) return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0 && active) {
          const raw = barcodes[0].rawValue;
          if (raw) {
            active = false;
            handleDetected(raw);
          }
        }
      } catch {
        // detection cycle error - skip
      }
    }, 200);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isScanning, scannedCode, handleDetected]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleDetected(manualCode.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl kalpurush-font">
        {/* Header gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00AEEF] via-cyan-400 to-[#0081B1]" />

        <div className="p-6 space-y-4">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF]">
                <ScanBarcode className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100 kalpurush-font">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scanner Viewport */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 shadow-inner flex items-center justify-center">
            {hasCamera && (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {/* Viewfinder Target Overlay */}
            {hasCamera && !scannedCode && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="relative w-4/5 h-3/5 border-2 border-[#00AEEF]/60 rounded-xl shadow-[0_0_20px_rgba(0,174,239,0.3)] overflow-hidden">
                  {/* Corner Marks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#00AEEF]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00AEEF]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00AEEF]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#00AEEF]" />

                  {/* Laser Scanning Beam Animation */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00AEEF] to-transparent shadow-[0_0_12px_#00AEEF] animate-bounce duration-1000" />
                </div>
                <p className="text-[11px] font-bold text-white/90 drop-shadow mt-3 kalpurush-font bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  কার্ডের বারকোড এই ফ্রেমের মাঝে রাখুন
                </p>
              </div>
            )}

            {/* Success Overlay */}
            {scannedCode && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-6 text-white animate-in zoom-in-95">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-pulse" />
                <p className="font-black text-lg kalpurush-font">স্ক্যান সফল হয়েছে!</p>
                <span className="font-mono text-sm bg-black/40 px-3 py-1 rounded-lg border border-emerald-400/40">
                  {scannedCode}
                </span>
              </div>
            )}

            {/* No Camera / Error View */}
            {hasCamera === false && (
              <div className="text-center p-6 space-y-3">
                <CameraOff className="h-10 w-10 text-zinc-500 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-zinc-200">{cameraError || 'ক্যামেরা চালু করা যায়নি'}</p>
                  <p className="text-xs text-zinc-500">
                    আপনি সরাসরি বারকোড স্ক্যানার গান দিয়ে স্ক্যান করতে পারেন অথবা আইডি লিখে সাবমিট করুন
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startCamera}
                  className="rounded-xl border-zinc-700 text-xs text-zinc-200"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> আবার চেষ্টা করুন
                </Button>
              </div>
            )}
          </div>

          {/* Barcode Gun / Manual Scanner Input */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="বারকোড গান দিয়ে স্ক্যান করুন বা আইডি লিখুন..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="pl-9 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm font-mono"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={!manualCode.trim()}
                className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl h-11 px-5 font-bold kalpurush-font cursor-pointer"
              >
                সাবমিট
              </Button>
            </div>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span className="text-[11px] font-bold">টেস্ট আইডি:</span>
            <div className="flex gap-1.5">
              {['MI-2026-0001', 'MI-2026-0010', 'MI-2026-0103'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleDetected(sample)}
                  className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] transition-all cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

