'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  LayoutTemplate,
  Users,
  CheckCircle2,
  Loader2,
  CreditCard,
  FileArchive,
  Image as ImageIcon,
  Badge,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useInfiniteStudents } from '@/features/students/api/queries';
import { StudentListItem } from '@/features/students/types';
import { IDCardPreview } from './IDCardPreview';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

import { RefreshCw } from 'lucide-react';
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';

export default function IDCardDashboard() {
  const params = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '');
  const [selectedStudents, setSelectedStudents] = useState<StudentListItem[]>([]);
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteStudents({ search: searchTerm });
  
  const allStudents = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.documents ?? []) ?? [];
  }, [data]);

  const filteredStudents = useMemo(() => {
    return allStudents;
  }, [allStudents]);

  const toggleStudent = (student: StudentListItem) => {
    setSelectedStudents(prev => {
      const exists = prev.find(s => s.$id === student.$id);
      if (exists) return prev.filter(s => s.$id !== student.$id);
      return [...prev, student];
    });
  };

  const selectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const exportCards = async (format: 'pdf' | 'png') => {
    if (selectedStudents.length === 0) return;
    setIsExporting(true);
    const toastId = toast.loading(`প্রেস-রেডি ${format.toUpperCase()} তৈরি হচ্ছে...`);
    // ... (rest of export logic remains same)
    const SCALE = 4;
    const W = 204 * SCALE;
    const H = 325 * SCALE;
    const BENGALI_FONT = 'SolaimanLipi';
    
    let fontLoaded = false;
    document.fonts.forEach((f) => {
      if (f.family === BENGALI_FONT || f.family === `'${BENGALI_FONT}'` || f.family === `"${BENGALI_FONT}"`) {
        fontLoaded = true;
      }
    });

    if (!fontLoaded) {
      try {
        const regular = new FontFace(BENGALI_FONT, `url('/fonts/SolaimanLipi/SolaimanLipi_22-02-2012.ttf') format('truetype')`);
        const bold = new FontFace(BENGALI_FONT, `url('/fonts/SolaimanLipi/SolaimanLipi_Bold_10-03-12.ttf') format('truetype')`, { weight: '700' });
        const [rf, bf] = await Promise.all([regular.load(), bold.load()]);
        document.fonts.add(rf);
        document.fonts.add(bf);
        await document.fonts.ready;
      } catch (fontErr) {
        console.warn('SolaimanLipi font failed to load', fontErr);
      }
    }

    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      });

    const rr = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
    };

    const drawCard = async (student: StudentListItem): Promise<HTMLCanvasElement> => {
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      const s = SCALE;

      ctx.fillStyle = '#ffffff';
      rr(ctx, 0, 0, W, H, 12 * s); ctx.fill();
      ctx.strokeStyle = '#E4E4E7'; ctx.lineWidth = s;
      rr(ctx, 0.5, 0.5, W - 1, H - 1, 12 * s); ctx.stroke();

      const hH = 85 * s;
      ctx.fillStyle = '#00AEEF';
      ctx.beginPath();
      ctx.moveTo(12 * s, 0); ctx.lineTo(W - 12 * s, 0);
      ctx.arcTo(W, 0, W, 12 * s, 12 * s);
      ctx.lineTo(W, hH - 18 * s);
      ctx.bezierCurveTo(W, hH + 12 * s, 0, hH + 12 * s, 0, hH - 18 * s);
      ctx.lineTo(0, 12 * s);
      ctx.arcTo(0, 0, 12 * s, 0, 12 * s);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = `900 ${13 * s}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('MANZIL', W / 2, 34 * s);
      ctx.font = `700 ${5 * s}px sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fillText('INTERNATIONAL INSTITUTE', W / 2, 46 * s);

      const pW = 70 * s, pH = 84 * s;
      const pX = (W - pW) / 2, pY = 60 * s;
      ctx.fillStyle = '#fff';
      rr(ctx, pX - 3 * s, pY - 3 * s, pW + 6 * s, pH + 6 * s, 6 * s); ctx.fill();
      if (student.photo) {
        try {
          const img = await loadImage(student.photo);
          ctx.save();
          rr(ctx, pX, pY, pW, pH, 4 * s); ctx.clip();
          const aspect = img.width / img.height;
          const tAspect = pW / pH;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (aspect > tAspect) { sw = img.height * tAspect; sx = (img.width - sw) / 2; }
          else { sh = img.width / tAspect; sy = (img.height - sh) / 2; }
          ctx.drawImage(img, sx, sy, sw, sh, pX, pY, pW, pH);
          ctx.restore();
        } catch {
          ctx.fillStyle = '#F4F4F5'; rr(ctx, pX, pY, pW, pH, 4 * s); ctx.fill();
        }
      } else {
        ctx.fillStyle = '#F4F4F5'; rr(ctx, pX, pY, pW, pH, 4 * s); ctx.fill();
      }

      ctx.fillStyle = '#10B981';
      ctx.beginPath(); ctx.arc(pX + pW + 2 * s, pY - 2 * s, 5 * s, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 * s; ctx.stroke();

      const nY = pY + pH + 20 * s;
      ctx.fillStyle = '#18181B';
      ctx.font = `700 ${12 * s}px '${BENGALI_FONT}', sans-serif`;
      ctx.textAlign = 'center';
      const bn = (student.nameBn || student.nameEn || '').slice(0, 22);
      ctx.fillText(bn, W / 2, nY);
      ctx.fillStyle = '#A1A1AA';
      ctx.font = `600 ${6.5 * s}px sans-serif`;
      ctx.fillText((student.nameEn || '').toUpperCase().slice(0, 26), W / 2, nY + 12 * s);

      ctx.fillStyle = '#00AEEF'; ctx.globalAlpha = 0.5;
      ctx.fillRect(W / 2 - 14 * s, nY + 18 * s, 28 * s, 1.5 * s); ctx.globalAlpha = 1;

      const px = 12 * s, rY0 = nY + 28 * s, rH = 15 * s;
      ctx.fillStyle = '#A1A1AA'; ctx.font = `700 ${6 * s}px sans-serif`; ctx.textAlign = 'left';
      ctx.fillText('ID NO', px, rY0 + rH - 4 * s);
      const idVal = student.studentId || '---';
      const idW = ctx.measureText(idVal).width + 8 * s;
      ctx.fillStyle = 'rgba(0,174,239,0.12)';
      rr(ctx, W - px - idW, rY0 + 2 * s, idW, rH - 6 * s, 2 * s); ctx.fill();
      ctx.fillStyle = '#00AEEF'; ctx.font = `900 ${7.5 * s}px monospace`; ctx.textAlign = 'right';
      ctx.fillText(idVal, W - px, rY0 + rH - 4 * s);

      const rY1 = rY0 + rH + 4 * s;
      ctx.strokeStyle = '#F4F4F5'; ctx.lineWidth = 0.5 * s;
      ctx.beginPath(); ctx.moveTo(px, rY1 - 2 * s); ctx.lineTo(W - px, rY1 - 2 * s); ctx.stroke();
      ctx.fillStyle = '#A1A1AA'; ctx.font = `700 ${6 * s}px sans-serif`; ctx.textAlign = 'left';
      ctx.fillText('BLOOD GRP', px, rY1 + rH - 4 * s);
      ctx.fillStyle = '#F43F5E'; ctx.font = `900 ${7.5 * s}px sans-serif`; ctx.textAlign = 'right';
      const bg = student.bloodGroup && student.bloodGroup !== 'unknown' ? student.bloodGroup : 'N/A';
      ctx.fillText(bg, W - px, rY1 + rH - 4 * s);

      const rY2 = rY1 + rH + 6 * s;
      ctx.fillStyle = '#FAFAFA'; rr(ctx, px, rY2, W - px * 2, rH, 3 * s); ctx.fill();
      ctx.fillStyle = '#71717A'; ctx.font = `700 ${6 * s}px '${BENGALI_FONT}', sans-serif`; ctx.textAlign = 'left';
      ctx.fillText('বিভাগ', px + 4 * s, rY2 + rH - 4 * s);
      ctx.fillStyle = '#27272A'; ctx.font = `700 ${6.5 * s}px '${BENGALI_FONT}', sans-serif`; ctx.textAlign = 'right';
      ctx.fillText((student.departmentName || '---').slice(0, 18), W - px - 4 * s, rY2 + rH - 4 * s);

      const rY3 = rY2 + rH + 4 * s;
      ctx.fillStyle = '#FAFAFA'; rr(ctx, px, rY3, W - px * 2, rH, 3 * s); ctx.fill();
      ctx.fillStyle = '#71717A'; ctx.font = `700 ${6 * s}px '${BENGALI_FONT}', sans-serif`; ctx.textAlign = 'left';
      ctx.fillText('শ্রেণী', px + 4 * s, rY3 + rH - 4 * s);
      ctx.fillStyle = '#27272A'; ctx.font = `700 ${6.5 * s}px '${BENGALI_FONT}', sans-serif`; ctx.textAlign = 'right';
      ctx.fillText((student.className || '---').slice(0, 18), W - px - 4 * s, rY3 + rH - 4 * s);

      const fY = H - 50 * s;
      ctx.fillStyle = '#FAFAFA'; ctx.fillRect(0, fY, W, 50 * s);
      ctx.strokeStyle = '#F4F4F5'; ctx.lineWidth = 0.5 * s;
      ctx.beginPath(); ctx.moveTo(0, fY); ctx.lineTo(W, fY); ctx.stroke();

      const qS = 28 * s, qX = px, qY2 = fY + (50 * s - qS) / 2;
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#E4E4E7'; ctx.lineWidth = 0.5 * s;
      rr(ctx, qX, qY2, qS, qS, 2 * s); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#27272A';
      [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[4,0],[5,0],[4,1],[5,1],[0,4],[1,4],[0,5],[1,5],[3,2],[2,3],[3,4],[4,3]].forEach(([dx, dy]) => {
        ctx.fillRect(qX + 3 * s + dx * 3 * s, qY2 + 3 * s + dy * 3 * s, 2.5 * s, 2.5 * s);
      });

      ctx.fillStyle = '#00AEEF'; ctx.font = `italic 800 ${10 * s}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.save(); ctx.translate(W - 55 * s, fY + 22 * s); ctx.rotate(-0.1);
      ctx.fillText('Principal', 0, 0); ctx.restore();
      ctx.strokeStyle = '#27272A'; ctx.lineWidth = 0.5 * s;
      ctx.beginPath(); ctx.moveTo(W - 85 * s, fY + 30 * s); ctx.lineTo(W - 22 * s, fY + 30 * s); ctx.stroke();
      ctx.fillStyle = '#71717A'; ctx.font = `700 ${5 * s}px sans-serif`; ctx.textAlign = 'center';
      ctx.fillText('AUTHORITY', W - 53 * s, fY + 41 * s);

      return canvas;
    };

    try {
      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [54, 86] });
        for (let i = 0; i < selectedStudents.length; i++) {
          if (i > 0) pdf.addPage([54, 86], 'portrait');
          const canvas = await drawCard(selectedStudents[i]);
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 54, 86);
        }
        pdf.save('Manzil_ID_Cards.pdf');
        toast.success('✅ PDF তৈরি সম্পন্ন!', { id: toastId });
      } else {
        for (const student of selectedStudents) {
          const canvas = await drawCard(student);
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `${student.studentId}_ID.png`;
          a.click();
          await new Promise(r => setTimeout(r, 400));
        }
        toast.success('✅ PNG ডাউনলোড সম্পন্ন!', { id: toastId });
      }
    } catch (err: any) {
      toast.error('এক্সপোর্ট ব্যর্থ হয়েছে।', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <FeatureHeader 
        title="আইডি কার্ড জেনারেটর"
        description="শিক্ষার্থীদের জন্য উচ্চমানের প্রেস-রেডি আইডি কার্ড তৈরি এবং প্রিন্ট করুন"
        icon={CreditCard}
        extraActions={
          <div className="flex gap-2">
             <Button variant="outline" className="h-11 rounded-md border-zinc-200" disabled={selectedStudents.length === 0 || isExporting} onClick={() => exportCards('png')}>
                <ImageIcon className="h-4 w-4 mr-2 text-rose-500" /> PNG ডাউনলোড
             </Button>
             <Button className="h-11 rounded-md bg-[#00AEEF] hover:bg-[#0081B1] text-white" disabled={selectedStudents.length === 0 || isExporting} onClick={() => exportCards('pdf')}>
                <FileArchive className="h-4 w-4 mr-2" /> PDF প্রিন্ট রেডি
             </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Sidebar */}
        <div className="bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">শিক্ষার্থী নির্বাচন</h3>
              <Badge className="bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20 border-0 rounded-md">
                {selectedStudents.length} Selected
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="নাম বা আইডি দিয়ে খুঁজুন..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={selectAll} className="w-full mt-4 h-9 text-[10px] font-black uppercase tracking-widest text-[#00AEEF] hover:bg-[#00AEEF]/10 rounded-md">
               {selectedStudents.length === filteredStudents.length ? 'সব ফিল্টার মুছুন' : 'সবাইকে নির্বাচন করুন'}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoading ? <Skeleton className="h-full w-full rounded-md" /> : filteredStudents.map(student => {
              const isSelected = selectedStudents.some(s => s.$id === student.$id);
              return (
                <div key={student.$id} onClick={() => toggleStudent(student)} className={cn("flex items-center gap-4 p-3 rounded-md cursor-pointer transition-all border", isSelected ? "bg-[#00AEEF]/5 border-[#00AEEF]/20" : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700")}>
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800 rounded-md">
                      <AvatarImage src={student.photo} className="object-cover" />
                      <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black">{student.nameEn?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isSelected && <div className="absolute -top-1 -right-1 h-4 w-4 bg-[#00AEEF] rounded-full border-2 border-white dark:border-zinc-900" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm kalpurush-font truncate">{student.nameBn}</p>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter">{student.studentId}</p>
                  </div>
                </div>
              );
            })}
            {hasNextPage && (
              <Button variant="outline" className="w-full h-10 rounded-md border-dashed text-[10px] font-black uppercase tracking-widest" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />} আরও লোড করুন
              </Button>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-zinc-100/50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col shadow-inner">
           <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <LayoutTemplate className="h-4 w-4 text-indigo-500" />
                 <span className="text-xs font-black uppercase tracking-widest opacity-60 italic">Live Preview Canvas</span>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {selectedStudents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-zinc-400 gap-4">
                   <CreditCard className="h-16 w-16 stroke-[1]" />
                   <div className="text-center space-y-1">
                      <p className="text-lg font-black kalpurush-font">শিক্ষার্থী নির্বাচন করুন</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Select students to see preview</p>
                   </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-10">
                   {selectedStudents.map(student => (
                     <div key={student.$id} className="transition-all hover:scale-[1.05] hover:shadow-2xl rounded-md overflow-hidden">
                        <IDCardPreview student={student} />
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

