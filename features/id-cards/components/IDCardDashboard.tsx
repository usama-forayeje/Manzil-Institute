'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  LayoutTemplate,
  Loader2,
  CreditCard,
  FileArchive,
  Image as ImageIcon,
  Badge,
  RefreshCw,
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
import JsBarcode from 'jsbarcode';
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';

export default function IDCardDashboard() {
  const params = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [idStatusFilter, setIdStatusFilter] = useState<'all' | 'active' | 'residential' | 'non_residential' | 'departed'>('active');
  const [selectedStudents, setSelectedStudents] = useState<StudentListItem[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteStudents({
    search: debouncedSearch || undefined,
    status: idStatusFilter,
  });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allStudents = useMemo(() => {
    const docs = data?.pages.flatMap((page) => page.data?.documents ?? []) ?? [];

    return docs.map((student: any) => {
      return {
        ...student,
      };
    });
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

  // 🔢 ইংরেজি সংখ্যাকে বাংলায় কনভার্ট করার হেল্পার ফাংশন
  const toBengaliDigits = (numStr: string): string => {
    return numStr.replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  const exportCards = async (format: 'pdf' | 'png') => {
    if (selectedStudents.length === 0) return;
    setIsExporting(true);
    const toastId = toast.loading(`প্রেস-রেডি ${format.toUpperCase()} তৈরি হচ্ছে...`);

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

    const loadLocalImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

    const generateBarcodeImage = (value: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        try {
          const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          JsBarcode(svgNode, value || '0000', {
            format: 'CODE128',
            width: 2,
            height: 35,
            displayValue: false,
            margin: 0,
            background: '#ffffff',
            lineColor: '#18181B',
          });
          const svgString = new XMLSerializer().serializeToString(svgNode);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
          };
          img.src = url;
        } catch (e) {
          reject(e);
        }
      });

    const drawCard = async (student: StudentListItem): Promise<HTMLCanvasElement> => {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext('2d')!;
      const s = SCALE;

      try {
        const bgImg = await loadLocalImage('/dashboard/manzil_student_ID_clean.svg');
        ctx.drawImage(bgImg, 0, 0, W, H);
      } catch (err) {
        console.warn("Failed to load SVG background", err);
        ctx.fillStyle = '#d61f1fff';
        rr(ctx, 0, 0, W, H, 12 * s); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = s;
        rr(ctx, 0.5, 0.5, W - 1, H - 1, 12 * s); ctx.stroke();
      }

      // ৩. স্টুডেন্ট ফটো ম্যাপিং
      const cx = (W * 0.50) + (0.35 * s);
      const cy = 98 * s;
      const radius = 33.5 * s;

      if (student.photo) {
        try {
          const img = await loadImage(student.photo);
          ctx.save();

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          const aspect = img.width / img.height;
          const pW = radius * 2;
          const pH = radius * 2;
          const pX = cx - radius;
          const pY = cy - radius;

          let sx = 0, sy = 0, sw = img.width, sh = img.height;

          if (aspect > 1) {
            sw = img.height;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width;
            // For portrait/passport photos, face is in the upper portion.
            // An 18% top offset keeps the head, cap, and hair intact instead of slicing in half.
            const maxOffset = img.height - sh;
            sy = Math.max(0, Math.min(maxOffset, maxOffset * 0.18));
          }
          ctx.drawImage(img, sx, sy, sw, sh, pX, pY, pW, pH);
          ctx.restore();
        } catch {
          ctx.fillStyle = '#F4F4F5';
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ৫. শিক্ষার্থীর নাম এবং সাব-হেডার (বাংলা ও ইংলিশ)
      ctx.fillStyle = '#EC1C24';
      ctx.font = `900 ${12 * s}px '${BENGALI_FONT}', sans-serif`;
      ctx.textAlign = 'center';
      const nameVal = student.nameBn || student.name || 'STUDENT NAME';
      ctx.fillText(nameVal, W / 2, 161 * s);

      if (student.nameEn) {
        ctx.fillStyle = '#71717A';
        ctx.font = `700 ${7 * s}px sans-serif`;
        ctx.fillText(student.nameEn.toUpperCase(), W / 2, 173 * s);
      }

      // ৬. প্রোফাইল ডাটা টেবিল গ্রিড লেআউট
      const startX = 24 * s;
      const colonX = 74 * s;
      const valueX = 82 * s;
      const endX = 180 * s;
      let currentY = 191 * s;
      const rowGap = 15 * s;

      // 🧠 জন্মতারিখ থেকে বয়স বের করে সেটিকে সরাসরি বাংলা সংখ্যায় কনভার্ট করা হচ্ছে
      const rawAge = student.dateOfBirth ? String(new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()) : '---';
      const ageVal = rawAge !== '---' ? toBengaliDigits(rawAge) : '---';

      const fields = [
        { label: 'পিতা', value: student?.fatherNameBn || '---', isMono: false, hasLine: true },
        { label: 'বয়স', value: ageVal, isMono: false, hasLine: true },
        { label: 'শ্রেণী', value: student.className || student.class || '---', isMono: false, hasLine: true },
        { label: 'আইডি', value: student.studentId || '---', isMono: true, hasLine: false }
      ];

      fields.forEach((field) => {
        ctx.textAlign = 'left';

        // 🏷️ লেবেলের ফন্ট SolaimanLipi করা হলো এবং সাইজ বাড়িয়ে 7.5 * s করা হলো
        ctx.fillStyle = '#71717A';
        ctx.font = `700 ${7.5 * s}px '${BENGALI_FONT}', sans-serif`;
        ctx.fillText(field.label, startX, currentY);

        // 🔤 কোলন চিহ্নের ফন্টও একই এলাইনমেন্ট ও ফন্টে রাখা হলো
        ctx.fillText(':', colonX, currentY);

        // 💎 ভ্যালুর সাইজ এক সাইজ বাড়িয়ে 8 * s করা হলো
        ctx.fillStyle = '#18181B';
        ctx.font = field.isMono
          ? `900 ${8 * s}px monospace` // আইডি মনোপেস ফন্টেও ১ সাইজ বড় করা হলো
          : `700 ${8 * s}px '${BENGALI_FONT}', sans-serif`;
        ctx.fillText(field.value, valueX, currentY);

        if (field.hasLine) {
          ctx.strokeStyle = '#F4F4F5';
          ctx.lineWidth = 1 * s;
          ctx.beginPath();
          ctx.moveTo(startX, currentY + (4 * s));
          ctx.lineTo(endX, currentY + (4 * s));
          ctx.stroke();
        }

        currentY += rowGap;
      });

      // ৭. বারকোড জেনারেটর এবং রেন্ডারিং সেকশন
      try {
        const barcodeImg = await generateBarcodeImage(student.studentId || '0000');
        const targetH = 13 * s;
        const targetW = (barcodeImg.width / barcodeImg.height) * targetH;
        const bx = (W - targetW) / 2;
        const by = 246 * s;

        ctx.drawImage(barcodeImg, bx, by, targetW, targetH);
      } catch (e) {
        console.warn('Failed to draw barcode', e);
      }

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
                placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md"
              />
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-3 custom-scrollbar">
              {[
                { key: 'all', label: 'সকল' },
                { key: 'active', label: 'সক্রিয়' },
                { key: 'residential', label: 'আবাসিক' },
                { key: 'non_residential', label: 'অনাবাসিক' },
                { key: 'departed', label: 'বিদায়ী' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => {
                    setIdStatusFilter(f.key as any);
                    setSelectedStudents([]);
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap kalpurush-font',
                    idStatusFilter === f.key
                      ? 'bg-[#00AEEF] text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={selectAll} className="w-full mt-3 h-8 text-[10px] font-black uppercase tracking-widest text-[#00AEEF] hover:bg-[#00AEEF]/10 rounded-md">
              {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ? 'সব নির্বাচন মুছুন' : 'সবাইকে নির্বাচন করুন'}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-md border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                    <Skeleton className="h-2.5 w-16 rounded-md" />
                  </div>
                </div>
              ))
            ) : filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs kalpurush-font">কোনো শিক্ষার্থী পাওয়া যায়নি</div>
            ) : (
              <>
                {filteredStudents.map(student => {
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
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-black text-sm kalpurush-font truncate">{student.nameBn || student.nameEn}</p>
                          {student.status !== 'active' ? (
                            <span className="text-[9px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-800">
                              বিদায়ী
                            </span>
                          ) : student.boardingType?.includes('আবাসিক') || student.hallName ? (
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                              আবাসিক
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter truncate">
                          {student.studentId} {student.className ? `• ${student.className}` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Skeletons while fetching next page */}
                {isFetchingNextPage && (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`next-id-${i}`} className="flex items-center gap-4 p-3 rounded-md border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                        <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <Skeleton className="h-3.5 w-28 rounded-md" />
                          <Skeleton className="h-2.5 w-16 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Sentinel for infinite scroll */}
                <div ref={sentinelRef} className="h-4 w-full pointer-events-none" />

                {hasNextPage && !isFetchingNextPage && (
                  <Button variant="outline" className="w-full h-8 rounded-md border-dashed text-[10px] font-black uppercase tracking-widest cursor-pointer" onClick={() => fetchNextPage()}>
                    আরও লোড করুন
                  </Button>
                )}
              </>
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