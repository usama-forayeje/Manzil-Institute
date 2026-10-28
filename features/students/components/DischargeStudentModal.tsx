'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  LogOut,
  Printer,
  User,
  Building2,
  Calendar,
  FileText,
} from 'lucide-react';
import { VoiceInputBn } from '@/components/ui/voice-input';
import { convertEnglishToBengali } from '@/lib/utils';
import { dischargeStudentAction } from '@/features/students/api/service';
import { fetchUnpaidInvoices } from '@/lib/actions/fees';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { studentKeys } from '@/features/students/api/queries';
import type { StudentListItem } from '@/features/students/types';
import { DatePicker } from '@/components/ui/DatePicker';

interface DischargeStudentModalProps {
  student: StudentListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDischarged?: (student: StudentListItem, dischargeData: any) => void;
}

const DISCHARGE_REASONS = [
  { value: 'graduated', label: 'হিফজ সম্পন্ন / ফারেগ / কোর্স সমাপ্ত' },
  { value: 'transferred', label: 'অন্যত্র স্থানান্তর / টিসি (Transfer Certificate)' },
  { value: 'personal', label: 'পারিবারিক / ব্যক্তিগত কারণ' },
  { value: 'financial', label: 'আর্থিক অসচ্ছলতা' },
  { value: 'health', label: 'স্বাস্থ্যগত / অসুস্থতাজনিত' },
  { value: 'expelled', label: 'শৃঙ্খলাভঙ্গজনিত বহিষ্কার' },
  { value: 'other', label: 'অন্যান্য কারণ' },
];

export function DischargeStudentModal({
  student,
  isOpen,
  onClose,
  onDischarged,
}: DischargeStudentModalProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string>('graduated');
  const [dischargeDate, setDischargeDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [tcNo, setTcNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [waiveDues, setWaiveDues] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Unpaid fee state
  const [isLoadingDues, setIsLoadingDues] = useState<boolean>(false);
  const [unpaidInvoices, setUnpaidInvoices] = useState<any[]>([]);

  const isAlreadyDeparted = student?.status !== 'active';

  useEffect(() => {
    if (isOpen && student) {
      const year = new Date().getFullYear();
      const rawId = String(student.studentId || '').replace(/\D/g, '') || String(Math.floor(1000 + Math.random() * 9000));
      const defaultTc = `TC-${year}-${rawId.slice(-4)}`;

      if (student.status !== 'active' && student.dischargeInfo) {
        setReason(student.dischargeInfo.reason || (student.status === 'graduated' ? 'graduated' : student.status === 'transferred' ? 'transferred' : student.status === 'expelled' ? 'expelled' : 'other'));
        setDischargeDate(student.dischargeInfo.date || new Date().toISOString().split('T')[0]);
        setTcNo(student.dischargeInfo.tcNo || defaultTc);
        setRemarks(student.dischargeInfo.remarks || '');
        setWaiveDues(student.dischargeInfo.clearance === 'waived');
      } else {
        setReason(student.status === 'graduated' ? 'graduated' : student.status === 'transferred' ? 'transferred' : student.status === 'expelled' ? 'expelled' : 'graduated');
        setTcNo(defaultTc);
        setDischargeDate(new Date().toISOString().split('T')[0]);
        setRemarks('');
        setWaiveDues(false);
      }

      // Check unpaid invoices
      setIsLoadingDues(true);
      fetchUnpaidInvoices({ studentDocId: student.$id, studentId: student.studentId })
        .then((res) => {
          if (res.success && res.invoices) {
            setUnpaidInvoices(res.invoices);
          } else {
            setUnpaidInvoices([]);
          }
        })
        .catch(() => setUnpaidInvoices([]))
        .finally(() => setIsLoadingDues(false));
    }
  }, [isOpen, student]);

  if (!student) return null;

  const totalDue = unpaidInvoices.reduce(
    (acc, inv) => acc + Math.max(0, (inv.amount || 0) - (inv.paidAmount || 0)),
    0
  );

  const selectedReasonObj = DISCHARGE_REASONS.find((r) => r.value === reason);
  const isResidential =
    student.boardingType?.includes('আবাসিক') ||
    student.boardingType?.toLowerCase().includes('residential') ||
    Boolean(student.hallName || student.hallId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dischargeDate) {
      toast.error('অনুগ্রহ করে বিদায়ের তারিখ নির্বাচন করুন');
      return;
    }

    if (!isAlreadyDeparted && totalDue > 0 && !waiveDues) {
      toast.error('বকেয়া ফি পরিশোধ নিশ্চিত করুন অথবা মওকুফ চেকবক্সে টিক দিন');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await dischargeStudentAction({
        studentDocId: student.$id,
        studentId: student.studentId || '',
        reason: reason as any,
        reasonBn: selectedReasonObj?.label || 'সাধারণ বিদায়',
        date: dischargeDate,
        tcNo,
        remarks,
        waiveDues: isAlreadyDeparted ? true : waiveDues,
      });

      if (!res.success) {
        throw new Error(res.error || 'বিদায় নিশ্চিত করতে সমস্যা হয়েছে');
      }

      toast.success(
        isAlreadyDeparted
          ? `${student.nameBn || student.nameEn}-এর বিদায়ের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে`
          : `${student.nameBn || student.nameEn} কে সফলভাবে বিদায় ও ছাড়পত্র প্রদান করা হয়েছে`
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['students', 'stats'] });

      onClose();

      if (onDischarged) {
        onDischarged(student, res.data?.dischargeInfo || {
          reason,
          reasonBn: selectedReasonObj?.label || 'সাধারণ বিদায়',
          date: dischargeDate,
          tcNo,
          remarks,
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto kalpurush-font p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20 text-rose-600 shrink-0">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                {isAlreadyDeparted
                  ? 'বিদায়ের তথ্য ও ছাড়পত্র (TC) এন্ট্রি / সংশোধন'
                  : 'শিক্ষার্থী বিদায় ও ছাড়পত্র (TC) প্রদান'}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 font-medium">
                {isAlreadyDeparted
                  ? 'শিক্ষার্থীর বিদায়ের কারণ, ছাড়পত্র নম্বর ও চারিত্রিক বিবরণ আপডেট করুন'
                  : 'প্রতিষ্ঠান থেকে শিক্ষার্থীর বিদায় নিশ্চিত করুন ও ছাড়পত্র রেকর্ড সংরক্ষণ করুন'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Student Profile Card */}
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60 flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
            {student.photo || student.photoUrl ? (
              <img
                src={student.photo || student.photoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-zinc-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-black text-[15px] text-zinc-900 dark:text-zinc-50 truncate">
                {student.nameBn || student.nameEn}
              </h4>
              <Badge variant="outline" className="font-mono text-[10px] font-bold">
                {student.studentId}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 truncate mt-0.5">
              পিতা: {student.fatherNameBn || student.fatherNameEn || 'তথ্য নেই'} •{' '}
              {student.phonePrimary || student.guardianPhone || 'নম্বর নেই'}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded">
                {student.departmentName || 'বিভাগ'} — {student.className || 'শ্রেণী'}
              </span>
              {isResidential && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                  আবাসিক {student.hallName ? `(${student.hallName})` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Due Fee Verification Banner */}
        {isLoadingDues ? (
          <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#00AEEF]" />
            বকেয়া তথ্য যাচাই করা হচ্ছে...
          </div>
        ) : totalDue > 0 ? (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-rose-800 dark:text-rose-400">
                  সতর্কতা: শিক্ষার্থীর মোট ৳{convertEnglishToBengali(totalDue)} বকেয়া ফি রয়েছে!
                </p>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">
                  ছাড়পত্র কার্যকর করার পূর্বে হিসাব শাখা থেকে বকেয়া পরিশোধ নিশ্চিত করুন অথবা বিশেষ অনুমোদনক্রমে মওকুফ করুন।
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-rose-200 dark:border-rose-900/30 flex items-center space-x-2">
              <Checkbox
                id="waiveDues"
                checked={waiveDues}
                onCheckedChange={(c) => setWaiveDues(Boolean(c))}
              />
              <label
                htmlFor="waiveDues"
                className="text-xs font-bold text-rose-900 dark:text-rose-300 cursor-pointer select-none"
              >
                কর্তৃপক্ষের বিশেষ অনুমতি সাপেক্ষে বকেয়া মওকুফপূর্বক ছাড়পত্র প্রদান করতে সম্মত
              </label>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            আর্থিক ক্লিয়ারেন্স সম্পন্ন: কোনো বকেয়া ফি নেই
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Reason Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              বিদায়ের কারণ <span className="text-rose-500">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-10 text-xs font-bold">
                <SelectValue placeholder="বিদায়ের কারণ নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {DISCHARGE_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs font-bold">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Discharge Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                বিদায়ের তারিখ <span className="text-rose-500">*</span>
              </Label>
              <DatePicker
                date={dischargeDate ? new Date(dischargeDate + 'T00:00:00') : undefined}
                setDate={(date) => {
                  if (date) {
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const d = String(date.getDate()).padStart(2, '0');
                    setDischargeDate(`${y}-${m}-${d}`);
                  } else {
                    setDischargeDate('');
                  }
                }}
                placeholder="বিদায়ের তারিখ নির্বাচন করুন"
                startYear={2018}
                endYear={new Date().getFullYear() + 2}
                className="h-10 text-xs rounded-md shadow-none"
              />
            </div>

            {/* TC Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                ছাড়পত্র / টিসি নম্বর
              </Label>
              <input
                type="text"
                value={tcNo}
                onChange={(e) => setTcNo(e.target.value)}
                placeholder="যেমন: TC-2026-0012"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20"
              />
            </div>
          </div>

          {/* Remarks with Voice Typing */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>চারিত্রিক প্রত্যয়ন ও মন্তব্য (ঐচ্ছিক)</span>
              <span className="text-[10px] text-zinc-400 font-normal">ভয়েস টাইপিং সমর্থিত</span>
            </Label>
            <VoiceInputBn
              value={remarks}
              onChange={(e: any) => {
                const val = typeof e === 'string' ? e : e?.target?.value ?? (e ? String(e) : '');
                setRemarks(val === '[object Object]' ? '' : val);
              }}
              placeholder="শিক্ষার্থীর আচরণ, হিফজ অগ্রগতি বা বিদায়ের কারণ মুখে বলুন বা লিখুন..."
              className="h-10 text-xs font-bold"
            />
          </div>

          {/* Hall & Boarding release notification */}
          {isResidential && (
            <div className="flex items-start gap-2 p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
              <Building2 className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>সিট ও মিল অটো-ক্লিয়ারেন্স:</strong> শিক্ষার্থীকে বিদায় দিলে তার বর্তমান আবাসিক সিট খালি হিসেবে গণ্য হবে এবং বোর্ডিং মিল বন্ধ হয়ে যাবে।
              </span>
            </div>
          )}

          <DialogFooter className="pt-3 border-t flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-bold h-10 px-4"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (totalDue > 0 && !waiveDues)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-10 px-5 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  বিদায় ও ছাড়পত্র নিশ্চিত করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}