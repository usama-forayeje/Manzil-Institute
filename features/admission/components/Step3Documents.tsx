'use client';

/**
 * f:\Web Develapment\Manzil-International-Institute\features\admission\components\Step3Documents.tsx
 * REDESIGNED — Premium Minimal UX, Aligned with Global Theme (#00AEEF)
 * Version: Full Feature Set (AI Bg Removal, Webcam, Crop, All Schema Fields)
 * Fully Responsive – Next‑Level Text & Layout Scaling
 */

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFormContext } from 'react-hook-form';

import {
  FileText,
  Upload,
  X,
  CheckCircle2,
  ShieldCheck,
  User,
  Camera,
  Wand2,
  Loader2,
  RefreshCw,
  Crop,
  Plus,
  FilePlus2,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  ArrowRight,
  ArrowRight as ArrowIcon
} from 'lucide-react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import type { AdmissionFormValues } from '../schemas/form';
import { cn } from '@/lib/utils';
import { fileToBase64, validateFile } from '@/lib/utils/file';
import { getCroppedImg } from '@/lib/utils/image-crop';

// ── Animations ─────────────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// ── Types ─────────────────────────────────────────────────────

type Orientation = 'landscape' | 'portrait';
type FacingMode = 'user' | 'environment';

// ── Shared UI Components ───────────────────────────────────────────────────

function SectionCard({
  number,
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
}: {
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 overflow-hidden shadow-xs',
        className
      )}
    >
      <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00AEEF]/10 text-[11px] font-bold text-[#00AEEF] dark:bg-[#00AEEF]/20">
                {number}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-normal leading-snug">
                {title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed pl-7">
              {subtitle}
            </p>
          </div>
          {Icon && (
            <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#00AEEF]">
              <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1 sm:h-1.5 rounded-full transition-all duration-300',
            i + 1 === current
              ? 'w-5 sm:w-6 bg-[#00AEEF]'
              : i + 1 < current
                ? 'w-1.5 bg-zinc-900 dark:bg-zinc-100'
                : 'w-1.5 bg-zinc-200 dark:bg-zinc-700'
          )}
        />
      ))}
    </div>
  );
}

// ── Modals (Crop, Webcam) ──────────────────────────────────────────────────

const CropModal = memo(({
  image,
  aspect: initialAspect = 1,
  onCropComplete,
  onCancel,
  isProfileImage = false
}: {
  image: string;
  aspect?: number;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  isProfileImage?: boolean;
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pixels, setPixels] = useState<any>(null);
  const [aspect, setAspect] = useState(initialAspect);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-lg sm:max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col h-[90vh] sm:h-[85vh] border border-white/20 dark:border-zinc-800"
      >
        <div className="px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF]">
              <Crop className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">ছবি ক্রপ করুন</h3>
              <p className="text-[8px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Image Adjustment & Refinement</p>
            </div>
          </div>
          <button onClick={onCancel} className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-all flex items-center justify-center">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="relative flex-1 bg-zinc-100 dark:bg-zinc-950/50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onZoomChange={setZoom}
            onCropComplete={(_, p) => setPixels(p)}
          />
        </div>

        <div className="p-4 sm:p-8 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 space-y-4 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-3 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Zoom Level</span>
                  <span className="text-[9px] sm:text-[10px] font-black text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded-md">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#00AEEF] h-1 sm:h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="outline" size="sm" onClick={() => setRotation(r => r - 90)} className="flex-1 h-8 sm:h-10 rounded-xl border-zinc-200 dark:border-zinc-700 hover:text-[#00AEEF] font-bold text-[10px] sm:text-xs"><RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-2 scale-x-[-1]" /> Rotate Left</Button>
                <Button variant="outline" size="sm" onClick={() => setRotation(r => r + 90)} className="flex-1 h-8 sm:h-10 rounded-xl border-zinc-200 dark:border-zinc-700 hover:text-[#00AEEF] font-bold text-[10px] sm:text-xs"><RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-2" /> Rotate Right</Button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">Orientation Mode</span>
              <div className="flex gap-2">
                {[
                  { label: 'Portrait', val: 3 / 4, icon: <div className="h-3 w-2.5 border-2 border-current rounded-sm mb-0.5" /> },
                  { label: 'Landscape', val: 4 / 3, icon: <div className="h-2.5 w-3.5 border-2 border-current rounded-sm mb-0.5" /> },
                  { label: 'Square', val: 1, icon: <div className="h-3 w-3 border-2 border-current rounded-sm mb-0.5" /> }
                ].map((mode) => (
                  <button key={mode.label} onClick={() => setAspect(mode.val)} className={cn("flex-1 flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all", aspect === mode.val ? "bg-[#00AEEF] border-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20" : "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-400 hover:border-zinc-200")}>
                    {mode.icon}
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-0.5">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 h-10 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-zinc-500 text-xs sm:text-sm hover:bg-rose-50 hover:text-rose-500">বাতিল</Button>
            <Button type="button" onClick={async () => onCropComplete(await getCroppedImg(image, pixels, rotation, isProfileImage))} className="flex-[2] h-10 sm:h-14 rounded-xl sm:rounded-2xl font-black bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group gap-1 sm:gap-2 text-xs sm:text-sm">নিশ্চিত করুন <ArrowIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" /></Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

const WebcamModal = memo(({ onCapture, onClose, mode = 'user' }: { onCapture: (base64: string) => void; onClose: () => void; mode?: FacingMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>(mode);
  const [isCapturing, setIsCapturing] = useState(false);
  const [aspectType, setAspectType] = useState<'portrait' | 'landscape'>('portrait');

  const aspectValue = aspectType === 'portrait' ? 3 / 4 : 4 / 3;

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    (async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        if (videoRef.current) videoRef.current.srcObject = currentStream;
      } catch (err) {
        toast.error('ক্যামেরা পারমিশন চেক করুন');
        onClose();
      }
    })();
    return () => currentStream?.getTracks().forEach(t => t.stop());
  }, [facingMode, onClose]);

  const takePhoto = () => {
    if (!videoRef.current || isCapturing) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    const targetWidth = aspectType === 'portrait' ? 1200 : 1600;
    const targetHeight = aspectType === 'portrait' ? 1600 : 1200;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;
    const targetRatio = targetWidth / targetHeight;
    const currentRatio = vWidth / vHeight;

    let sx, sy, sw, sh;
    if (currentRatio > targetRatio) {
      sw = vHeight * targetRatio; sh = vHeight;
      sx = (vWidth - sw) / 2; sy = 0;
    } else {
      sw = vWidth; sh = vWidth / targetRatio;
      sx = 0; sy = (vHeight - sh) / 2;
    }

    if (facingMode === 'user') {
      ctx.translate(targetWidth, 0); ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
    const data = canvas.toDataURL('image/webp', 0.92);

    setTimeout(() => {
      onCapture(data);
      setIsCapturing(false);
    }, 300);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-zinc-950/95 backdrop-blur-3xl flex items-center justify-center p-2 sm:p-4">
      <div className={cn("w-full bg-white dark:bg-zinc-900 rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl border border-white/10 flex flex-col transition-all duration-500", aspectType === 'portrait' ? "max-w-xs sm:max-w-sm" : "max-w-sm sm:max-w-xl")}>
        <div className="px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00AEEF]" />
              <span className="text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest leading-none">Smart Scan</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button onClick={() => setAspectType('portrait')} className={cn("px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all", aspectType === 'portrait' ? "bg-white dark:bg-zinc-700 text-[#00AEEF] shadow-sm" : "text-zinc-400 hover:text-zinc-600")}>Portrait</button>
              <button onClick={() => setAspectType('landscape')} className={cn("px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all", aspectType === 'landscape' ? "bg-white dark:bg-zinc-700 text-[#00AEEF] shadow-sm" : "text-zinc-400 hover:text-zinc-600")}>Landscape</button>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5 sm:mx-1" />
            <button onClick={() => setFacingMode(m => m === 'user' ? 'environment' : 'user')} title="Switch Camera" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-all flex items-center justify-center"><RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
            <button onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-all flex items-center justify-center"><X className="h-4 w-4 sm:h-5 sm:w-5" /></button>
          </div>
        </div>
        <div className={cn("relative bg-zinc-950 w-full overflow-hidden transition-all duration-500")} style={{ aspectRatio: aspectValue }}>
          <video ref={videoRef} autoPlay playsInline className={cn("absolute inset-0 w-full h-full object-cover shadow-inner", facingMode === 'user' && "-scale-x-100")} />
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-10 pointer-events-none">
            <div className="w-full h-full border-2 border-white/40 border-dashed rounded-2xl sm:rounded-3xl relative">
              <div className="absolute -top-0.5 sm:-top-1 -left-0.5 sm:-left-1 h-4 w-4 sm:h-6 sm:w-6 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-[#00AEEF] rounded-tl-lg sm:rounded-tl-xl" />
              <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 h-4 w-4 sm:h-6 sm:w-6 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-[#00AEEF] rounded-tr-lg sm:rounded-tr-xl" />
              <div className="absolute -bottom-0.5 sm:-bottom-1 -left-0.5 sm:-left-1 h-4 w-4 sm:h-6 sm:w-6 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-[#00AEEF] rounded-bl-lg sm:rounded-bl-xl" />
              <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 h-4 w-4 sm:h-6 sm:w-6 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-[#00AEEF] rounded-br-lg sm:rounded-br-xl" />
            </div>
          </div>
          {isCapturing && <div className="absolute inset-0 bg-white dark:bg-black z-10 flex items-center justify-center"><Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-[#00AEEF] animate-spin" /></div>}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center px-4"><p className="bg-black/60 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 text-center">Focus on {aspectType}</p></div>
        </div>
        <div className="p-5 sm:p-10 flex flex-col items-center gap-4 sm:gap-6 bg-zinc-50 dark:bg-zinc-900/50">
          <button disabled={isCapturing} onClick={takePhoto} className="h-14 w-14 sm:h-20 sm:w-20 rounded-full border-[5px] sm:border-[8px] border-white dark:border-zinc-800 bg-[#00AEEF] shadow-[0_0_30px_rgba(0,174,239,0.3)] hover:scale-105 active:scale-95 transition-all outline outline-2 outline-[#00AEEF]/20 disabled:opacity-50" />
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Tap to Scan</p>
        </div>
      </div>
    </div>,
    document.body
  );
});

// ── Upload Cards (Feature-Rich) ───────────────────────────────────────────

function PhotoUploadCard({ value, onChange }: { value?: string; onChange: (val: string | undefined) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [tempCrop, setTempCrop] = useState<string | null>(null);

  const handleRemoveBg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value || isRemovingBg) return;
    try {
      setIsRemovingBg(true);
      const toastId = toast.loading('ব্যাকগ্রাউন্ড রিমুভ হচ্ছে...');
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: value }),
      });
      if (!res.ok) throw new Error('BG removal failed');
      const data = await res.json();
      onChange(data.result);
      toast.success('ব্যাকগ্রাউন্ড রিমুভ সম্পন্ন!', { id: toastId });
    } catch (error) {
      toast.error('ব্যাকগ্রাউন্ড রিমুভ ব্যর্থ হয়েছে।');
    } finally {
      setIsRemovingBg(false);
    }
  };

  return (
    <>
      {showWebcam && <WebcamModal mode="user" onCapture={(b64) => { setTempCrop(b64); setShowWebcam(false); }} onClose={() => setShowWebcam(false)} />}
      {tempCrop && <CropModal image={tempCrop} aspect={35 / 45} onCropComplete={(cropped) => { onChange(cropped); setTempCrop(null); }} onCancel={() => setTempCrop(null)} isProfileImage />}

      <SectionCard number="৩.১" title="ছাত্রের ছবি" subtitle="অফিসিয়াল পাসপোর্ট সাইজ" icon={User}>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 lg:gap-16 py-2 sm:py-4 px-1 sm:px-4">
          <div className="relative group shrink-0">
            <div className={cn(
              "w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 rounded-2xl overflow-hidden border-4 border-zinc-200 dark:border-zinc-700 shadow-xl flex items-center justify-center transition-all bg-zinc-100 dark:bg-zinc-800",
              value && "ring-4 ring-[#00AEEF]/20 border-[#00AEEF]/30 shadow-[#00AEEF]/10"
            )}>
              {value ? (
                <>
                  <img src={value} alt="Student" className={cn("w-full h-full object-cover", isRemovingBg && "opacity-40 blur-sm")} />
                  {isRemovingBg && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-[#00AEEF] animate-spin" /></div>}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 sm:gap-3 text-zinc-300 dark:text-zinc-600">
                  <User className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 opacity-40" />
                  <span className="text-[8px] sm:text-[10px] font-black tracking-[0.3em] uppercase">PASSPORT</span>
                </div>
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => setTempCrop(value)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-[#00AEEF] text-white shadow-lg flex items-center justify-center hover:bg-[#0088CC] hover:scale-110 active:scale-95 transition-all z-10"
                title="Crop Image"
              >
                <Crop className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}

            <div className="absolute -bottom-3 sm:-bottom-5 -right-2 sm:-right-3 md:-right-6 flex flex-col gap-2 sm:gap-2.5">
              {!value ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl shadow-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:scale-105 active:scale-95"
                  >
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-300" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowWebcam(true)}
                    className="h-11 w-11 sm:h-14 sm:w-14 rounded-[18px] sm:rounded-[22px] bg-[#00AEEF] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all outline outline-3 sm:outline-4 outline-white dark:outline-zinc-900 border-2 border-white/20"
                  >
                    <Camera className="h-5 w-5 sm:h-7 sm:w-7" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleRemoveBg}
                    disabled={isRemovingBg}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:scale-105 active:scale-95"
                    title="Remove Background (AI)"
                  >
                    {isRemovingBg ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Wand2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => onChange(undefined)}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl shadow-lg hover:scale-105 active:scale-95"
                    title="Delete Photo"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left pt-4 sm:pt-6 lg:pt-2">
            <div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-tight mb-1 sm:mb-2">পাসপোর্ট সাইজ ছবি দিন</h4>
              <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed font-medium mx-auto lg:mx-0">
                আইডি কার্ড এবং অফিসিয়াল রেকর্ডের জন্য পরিষ্কার ও স্পষ্ট ছবি প্রদান করুন। সাদা বা হালকা রঙের ব্যাকগ্রাউন্ড ব্যবহার করা বাঞ্ছনীয়।
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center lg:justify-start">
              {[
                { text: 'JPG / PNG / WEBP', icon: ImageIcon },
                { text: 'Maximum 5MB', icon: ShieldCheck },
                { text: '35x45 MM Size', icon: Crop }
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80">
                  <spec.icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#00AEEF]" />
                  <span className="text-[9px] sm:text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{spec.text}</span>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-zinc-400 mt-1 sm:mt-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Live Validation Active</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setTempCrop(await fileToBase64(f)); e.target.value = ''; }} />
        </div>
      </SectionCard>
    </>
  );
}

function FileUploadCard({
  label,
  value,
  onChange,
  helpText,
  isOptional = false,
}: {
  label: string;
  value?: string;
  onChange: (val: string | undefined) => void;
  helpText: string;
  isOptional?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [tempCrop, setTempCrop] = useState<string | null>(null);

  return (
    <>
      {showWebcam && (
        <WebcamModal
          mode="environment"
          onCapture={(b64) => {
            setTempCrop(b64);
            setShowWebcam(false);
          }}
          onClose={() => setShowWebcam(false)}
        />
      )}
      {tempCrop && (
        <CropModal
          image={tempCrop}
          aspect={4 / 3}
          onCropComplete={(cropped) => {
            onChange(cropped);
            setTempCrop(null);
          }}
          onCancel={() => setTempCrop(null)}
        />
      )}

      <div className="space-y-1.5 sm:space-y-2">
        {/* Label & Status Header */}
        <div className="flex items-center justify-between gap-2 px-1">
          <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5 leading-snug">
            <span>{label}</span>
            {helpText && <HelpTooltip content={helpText} />}
          </label>
          {value ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="h-3 w-3" />
              সংযুক্ত
            </span>
          ) : isOptional ? (
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full shrink-0">
              ঐচ্ছিক
            </span>
          ) : null}
        </div>

        {/* Card Body */}
        <div
          className={cn(
            'relative rounded-xl sm:rounded-2xl border transition-all duration-300 group overflow-hidden',
            value
              ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-[#00AEEF]/50 hover:bg-[#00AEEF]/5 dark:hover:bg-[#00AEEF]/5 shadow-xs'
          )}
        >
          {value ? (
            // Uploaded State
            <div className="p-3 sm:p-3.5 flex items-center gap-3">
              {/* Thumbnail */}
              <div className="relative h-14 w-18 sm:h-16 sm:w-20 rounded-lg overflow-hidden border border-emerald-500/20 bg-zinc-900 shrink-0 group/thumb shadow-xs">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setTempCrop(value)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white"
                  title="ক্রপ বা সাইজ ঠিক করুন"
                >
                  <Crop className="h-4 w-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  আপলোড সম্পন্ন হয়েছে
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                  ছবি পরিবর্তন বা ক্রপ করতে পারেন
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setTempCrop(value)}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all shadow-xs"
                  title="ক্রপ করুন"
                >
                  <Crop className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00AEEF]" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all shadow-xs"
                  title="নতুন ফাইল দিন"
                >
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(undefined)}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-all"
                  title="মুছে ফেলুন"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ) : (
            // Empty / Upload Prompt State
            <div className="p-3 sm:p-3.5 flex items-center gap-3">
              {/* Left icon button / dropzone icon */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center shrink-0 cursor-pointer group-hover:border-[#00AEEF]/50 group-hover:scale-105 transition-all shadow-xs"
              >
                <FileText className="h-5 w-5 text-zinc-400 group-hover:text-[#00AEEF] transition-colors" />
              </div>

              {/* Middle text - clickable */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-[#00AEEF] transition-colors">
                  আপলোড বা স্ক্যান করুন
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    JPG/PNG/PDF
                  </span>
                  <span className="text-[10px] text-zinc-300 dark:text-zinc-600">•</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#00AEEF]">
                    সর্বোচ্চ ৫MB
                  </span>
                </div>
              </div>

              {/* Right action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 hover:text-[#00AEEF] hover:border-[#00AEEF]/50 border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5 text-[#00AEEF]" />
                  <span className="hidden sm:inline">ফাইল</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowWebcam(true)}
                  className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs font-semibold bg-[#00AEEF] hover:bg-[#0095CC] text-white shadow-xs flex items-center gap-1"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ক্যামেরা</span>
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setTempCrop(await fileToBase64(f));
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </>
  );
}

function MultiFileUploadCard({ value = [], onChange }: { value?: string[]; onChange: (files: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempCrop, setTempCrop] = useState<{ src: string; index: number | null }>({ src: '', index: null });

  const handleFiles = async (files: FileList) => {
    const newFiles = [...value];
    for (let i = 0; i < files.length; i++) {
      const v = validateFile(files[i], { maxSizeMB: 5, allowedTypes: ['image/jpeg', 'image/png'] });
      if (v.valid) newFiles.push(await fileToBase64(files[i]));
      else toast.error(v.error);
    }
    onChange(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <>
      {tempCrop.src && (
        <CropModal
          image={tempCrop.src}
          aspect={undefined}
          onCropComplete={(cropped) => {
            const newFiles = [...value];
            if (tempCrop.index !== null) newFiles[tempCrop.index] = cropped;
            else newFiles.push(cropped);
            onChange(newFiles);
            setTempCrop({ src: '', index: null });
          }}
          onCancel={() => setTempCrop({ src: '', index: null })}
        />
      )}

      <SectionCard
        number="৩.৫"
        title="অন্যান্য নথিপত্র"
        subtitle="মেডিকেল রিপোর্ট, প্রশংসাপত্র বা পূর্ববর্তী প্রতিষ্ঠানের অতিরিক্ত সনদ (ঐচ্ছিক)"
        icon={FilePlus2}
      >
        <div className="space-y-4">
          {value.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {value.map((file, idx) => (
                <div
                  key={idx}
                  className="relative aspect-4/3 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-xs group"
                >
                  <img src={file} alt={`Document ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setTempCrop({ src: file, index: idx })}
                      className="h-6 w-6 rounded-md bg-[#00AEEF] text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      title="ক্রপ করুন"
                    >
                      <Crop className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="h-6 w-6 rounded-md bg-rose-500 text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      title="মুছে ফেলুন"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-4/3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-[#00AEEF] transition-all group cursor-pointer"
              >
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
                <span className="text-[11px] sm:text-xs font-semibold">আরও যোগ করুন</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="py-6 sm:py-8 px-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700/80 hover:border-[#00AEEF]/60 hover:bg-[#00AEEF]/5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all group"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center group-hover:border-[#00AEEF]/40 group-hover:scale-110 transition-all shadow-xs">
                <FilePlus2 className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400 group-hover:text-[#00AEEF] transition-colors" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#00AEEF] transition-colors">
                  অতিরিক্ত ডকুমেন্ট যোগ করুন
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto">
                  মেডিকেল রিপোর্ট, প্রশংসাপত্র বা অন্যান্য প্রয়োজনীয় সার্টিফিকেট (ঐচ্ছিক)
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-700">
                    JPG / PNG
                  </span>
                  <span className="text-[10px] font-medium text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded-md border border-[#00AEEF]/20">
                    সর্বোচ্চ ৫ MB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </SectionCard>
    </>
  );
}

export default function Step3Documents({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { control, trigger, watch, setValue } = useFormContext<AdmissionFormValues>();

  const handleNext = async () => {
    const isValid = await trigger('documents');
    if (isValid) onNext();
    else toast.error('দয়া করে প্রয়োজনীয় নথি আপলোড করুন');
  };

  return (
    <div className="kalpurush-font max-w-3xl mx-auto px-3 sm:px-4 pb-20 sm:pb-24 pt-6 sm:pt-8">
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <StepDots current={3} total={4} />
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide ml-1">ধাপ ৩ / ৪</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            প্রয়োজনীয় ডকুমেণ্ট
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-lg leading-relaxed">
            ছাত্রের ছবি থেকে শুরু করে পিতামাতার পরিচয়পত্র পর্যন্ত সব ফাইল নির্ভুলভাবে স্ক্যান ও আপলোড করুন।
          </p>
        </div>

        {/* Security / Tip Card */}
        <div className="relative bg-[#00AEEF]/5 dark:bg-[#00AEEF]/10 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#00AEEF]/15 flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-[#00AEEF] text-white flex items-center justify-center shadow-md shrink-0">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#00AEEF]">নিরাপদ ও নির্ভুল আপলোড</h4>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              পরিষ্কার ও স্পষ্ট স্ক্যান কপি আপলোড করুন। ফাইল সাইজ প্রতিটির জন্য সর্বোচ্চ ৫ মেগাবাইট (MB)।
            </p>
          </div>
        </div>

        {/* Section 3.1: Student Passport Photo */}
        <PhotoUploadCard
          value={watch('documents.studentPhoto')}
          onChange={(val) => setValue('documents.studentPhoto', val)}
        />

        {/* Section 3.2: Student Identity Documents */}
        <SectionCard
          number="৩.২"
          title="ছাত্রের পরিচয়পত্র"
          subtitle="জন্ম নিবন্ধন অথবা আইডি কার্ডের উভয় পাশ"
          icon={ImageIcon}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <FileUploadCard
              label="জন্ম সনদ / এনআইডি (সামনে)"
              value={watch('documents.studentDocFront')}
              onChange={(val) => setValue('documents.studentDocFront', val)}
              helpText="পরিষ্কার ছবি দিন।"
            />
            <FileUploadCard
              label="জন্ম সনদ / এনআইডি (পেছনে)"
              value={watch('documents.studentDocBack')}
              onChange={(val) => setValue('documents.studentDocBack', val)}
              helpText="পরিষ্কার ছবি দিন।"
            />
          </div>
        </SectionCard>

        {/* Section 3.3: Parents NID Cards */}
        <SectionCard
          number="৩.৩"
          title="পিতামাতার এনআইডি"
          subtitle="পিতা ও মাতার জাতীয় পরিচয়পত্র স্ক্যান বা আপলোড করুন"
          icon={FileText}
        >
          <div className="space-y-5 sm:space-y-6">
            {/* Father's NID */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00AEEF]" />
                <h4 className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  পিতার জাতীয় পরিচয়পত্র
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <FileUploadCard
                  label="পিতার এনআইডি (সামনে)"
                  value={watch('documents.fatherNidFront')}
                  onChange={(val) => setValue('documents.fatherNidFront', val)}
                  helpText="পিতার এনআইডির সামনের অংশ।"
                />
                <FileUploadCard
                  label="পিতার এনআইডি (পেছনে)"
                  value={watch('documents.fatherNidBack')}
                  onChange={(val) => setValue('documents.fatherNidBack', val)}
                  helpText="পিতার এনআইডির পেছনের অংশ।"
                />
              </div>
            </div>

            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

            {/* Mother's NID */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00AEEF]" />
                <h4 className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  মাতার জাতীয় পরিচয়পত্র
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <FileUploadCard
                  label="মাতার এনআইডি (সামনে)"
                  value={watch('documents.motherNidFront')}
                  onChange={(val) => setValue('documents.motherNidFront', val)}
                  helpText="মাতার এনআইডির সামনের অংশ।"
                />
                <FileUploadCard
                  label="মাতার এনআইডি (পেছনে)"
                  value={watch('documents.motherNidBack')}
                  onChange={(val) => setValue('documents.motherNidBack', val)}
                  helpText="মাতার এনআইডির পেছনের অংশ।"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 3.4 & 3.5: Transfer Certificate & Additional Documents */}
        <div className="space-y-5 sm:space-y-6">
          <SectionCard
            number="৩.৪"
            title="ট্রান্সফার সার্টিফিকেট"
            subtitle="পূর্ববর্তী প্রতিষ্ঠানের ছাড়পত্র (TC)"
            icon={ArrowRight}
          >
            <FileUploadCard
              label="টিসি / ছাড়পত্র (ঐচ্ছিক)"
              value={watch('documents.transferCertificate')}
              onChange={(val) => setValue('documents.transferCertificate', val)}
              helpText="টিসি থাকলে দিন।"
              isOptional={true}
            />
          </SectionCard>

          <MultiFileUploadCard
            value={watch('documents.additionalDocuments')}
            onChange={(val) => setValue('documents.additionalDocuments', val)}
          />
        </div>

        {/* Prev / Next Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4 sm:pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onPrev}
            className="w-full sm:flex-1 h-11 sm:h-12 rounded-xl font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm sm:text-base group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            পূর্ববর্তী ধাপে যান
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="w-full sm:flex-[2] h-11 sm:h-12 rounded-xl bg-primary text-primary-foreground text-sm sm:text-base font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            পরবর্তী তথ্য নিশ্চিত করুন
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}