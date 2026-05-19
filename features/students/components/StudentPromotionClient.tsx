'use client';

import React, { useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

import { useInfiniteStudents, studentKeys } from '@/features/students/api/queries';
import { StudentListItem } from '@/features/students/types';
import { useInView } from 'react-intersection-observer';
import { useQueryClient, useQuery } from '@tanstack/react-query';

import {
  departmentsQueryOptions,
  sessionsQueryOptions,
  sectionsQueryOptions,
  classesByDeptOptions,
  boardingTypesQueryOptions,
} from '@/features/admission/api/queries';
import { getAdmissionFees } from '@/features/admission/api/service';
import { promoteStudent } from '@/lib/actions/studentPromotion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { User, Search, GraduationCap, CheckCircle2, RefreshCw, Repeat2, Activity, Wallet, Plus, Trash2, ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentTableStore } from '@/features/students/store/useStudentTableStore';

const enrollmentItemSchema = z.object({
  departmentId: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  departmentName: z.string().optional(),
  classId: z.string().min(1, 'শ্রেণী নির্বাচন করুন'),
  className: z.string().optional(),
  session: z.string().min(1, 'সেশন নির্বাচন করুন'),
  section: z.string().optional(),
  rollNo: z.string().optional(),
  monthlyFee: z.number().optional(),
});

const updateSchema = z.object({
  actionType: z.enum(['promoted', 'failed', 'continued']),
  boardingType: z.string().min(1, 'আবাসিক ধরণ নির্বাচন করুন'),
  enrollments: z.array(enrollmentItemSchema).min(1, 'অন্তত একটি এনরোলমেন্ট যোগ করুন'),
  sessionFee: z.number().default(0),
  discount: z.number().default(0),
  netPayable: z.number().default(0),
});

type UpdateValues = z.infer<typeof updateSchema>;

// ── Item Component for Multiple Enrollments ──

function EnrollmentTargetCard({
  index,
  remove,
  departments,
  sessions,
  sections,
  canRemove,
}: {
  index: number;
  remove: (i: number) => void;
  departments: any[];
  sessions: string[];
  sections: string[];
  canRemove: boolean;
}) {
  const { control, watch, setValue } = useFormContext<UpdateValues>();
  const deptId = watch(`enrollments.${index}.departmentId`) as string;
  const isComplete = Boolean(deptId && watch(`enrollments.${index}.classId`) && watch(`enrollments.${index}.session`));

  const { data: classRes, isLoading: isClassesLoading } = useQuery(classesByDeptOptions(deptId));
  const classes = useMemo(() => {
    if (!classRes?.success || !classRes.classes) return [];
    return classRes.classes.map((c: any) => ({ id: c.$id, name: c.name, nameBn: c.nameBn, monthlyFee: c.monthlyFee }));
  }, [classRes]);

  const handleDeptChange = (val: string) => {
    const dept = departments.find((d) => d.id === val);
    if (!dept) return;
    setValue(`enrollments.${index}.departmentId`, dept.id, { shouldValidate: true });
    setValue(`enrollments.${index}.departmentName`, dept.nameBn || dept.name || '', { shouldValidate: true });
    setValue(`enrollments.${index}.classId`, '', { shouldValidate: true });
    setValue(`enrollments.${index}.className`, '', { shouldValidate: true });
    setValue(`enrollments.${index}.monthlyFee`, 0, { shouldValidate: true });
  };

  const handleClassChange = (val: string) => {
    const cls = classes.find((c: any) => c.id === val);
    if (!cls) return;
    setValue(`enrollments.${index}.classId`, cls.id, { shouldValidate: true });
    setValue(`enrollments.${index}.className`, cls.nameBn || cls.name, { shouldValidate: true });
    if (cls.monthlyFee) {
      setValue(`enrollments.${index}.monthlyFee`, cls.monthlyFee, { shouldValidate: true });
    }
  };

  return (
    <div className={cn(
      "group rounded-2xl border transition-all duration-300 overflow-hidden mb-3",
      isComplete ? "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800" : "bg-white dark:bg-zinc-950 border-dashed border-zinc-200 dark:border-zinc-800"
    )}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-black transition-all",
            isComplete ? "bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          )}>
            {isComplete ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
          </div>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest kalpurush-font">নতুন ক্লাস/বিভাগ</span>
        </div>
        {canRemove && (
          <button type="button" onClick={() => remove(index)} className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Department */}
        <FormField control={control} name={`enrollments.${index}.departmentId`} render={({ field: f }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest kalpurush-font">বিভাগ *</FormLabel>
            <Select onValueChange={handleDeptChange} value={f.value || ''}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 kalpurush-font font-medium">
                  <SelectValue placeholder="নির্বাচন" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font">
                {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.nameBn ?? d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        {/* Class */}
        <FormField control={control} name={`enrollments.${index}.classId`} render={({ field: f }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest kalpurush-font">শ্রেণী *</FormLabel>
            <Select onValueChange={handleClassChange} value={f.value || ''} disabled={!deptId || isClassesLoading}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 kalpurush-font font-medium">
                  <SelectValue placeholder={isClassesLoading ? 'লোড হচ্ছে...' : 'নির্বাচন'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font">
                {classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nameBn ?? c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        {/* Session */}
        <FormField control={control} name={`enrollments.${index}.session`} render={({ field: f }) => (
          <FormItem>
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest kalpurush-font">সেশন *</FormLabel>
            <Select onValueChange={f.onChange} value={f.value || ''}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-mono">
                  <SelectValue placeholder="..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font font-mono">
                {sessions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        {/* Section */}
        <FormField control={control} name={`enrollments.${index}.section`} render={({ field: f }) => (
          <FormItem>
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest kalpurush-font">গ্রুপ/সেকশন</FormLabel>
            <Select onValueChange={f.onChange} value={f.value || ''}>
              <FormControl>
                <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 kalpurush-font">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font">
                {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormItem>
        )} />

        {/* Roll */}
        <FormField control={control} name={`enrollments.${index}.rollNo`} render={({ field: f }) => (
          <FormItem className="lg:col-span-3 lg:col-start-1">
            <FormControl>
              <div className="relative group/fee">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">রোল:</span>
                <Input placeholder="..." className="h-10 pl-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 font-mono" {...f} value={f.value ?? ''} />
              </div>
            </FormControl>
          </FormItem>
        )} />

        {/* Fee */}
        <FormField control={control} name={`enrollments.${index}.monthlyFee`} render={({ field: f }) => (
          <FormItem className="lg:col-span-3 lg:col-start-4">
            <FormControl>
              <div className="relative group/fee">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">মাসিক ফি (৳):</span>
                <Input type="number" placeholder="0" className="h-10 pl-[85px] rounded-xl font-bold text-[#00AEEF] bg-zinc-50 dark:bg-zinc-950 border-zinc-200" {...f} onChange={(e) => f.onChange(Number(e.target.value))} value={f.value ?? 0} />
              </div>
            </FormControl>
          </FormItem>
        )} />
      </div>
    </div>
  );
}

export default function StudentPromotionClient() {
  const queryClient = useQueryClient();
  const { search: globalSearch, setSearch: setGlobalSearch } = useStudentTableStore();

  const deptQuery = useQuery(departmentsQueryOptions);
  const sessionQuery = useQuery(sessionsQueryOptions);
  const sectionQuery = useQuery(sectionsQueryOptions);
  const boardingTypeQuery = useQuery(boardingTypesQueryOptions);

  const departments = useMemo(() => deptQuery.data?.success ? deptQuery.data.departments.map((d: any) => ({ id: d.$id, nameBn: d.nameBn, name: d.name })) : [], [deptQuery.data]);
  const sessions = useMemo(() => sessionQuery.data?.success ? (sessionQuery.data.sessions || []).map((s: any) => (s.sessionName || '').trim()).filter(Boolean) : [], [sessionQuery.data]);
  const sections = useMemo(() => sectionQuery.data?.success ? sectionQuery.data.sections.map((s: any) => s.sectionNameBn || s.sectionName) : [], [sectionQuery.data]);
  const boardingTypes = useMemo(() => boardingTypeQuery.data?.success ? boardingTypeQuery.data.boardingTypes || [] : [], [boardingTypeQuery.data]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteStudents();

  const { ref, inView } = useInView();
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const students = useMemo(
    () => data?.pages.flatMap((page) => page.data?.documents ?? []) ?? [],
    [data]
  );

  const [activeStudent, setActiveStudent] = useState<StudentListItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const targetStudentId = searchParams.get('studentId');

  // Auto-trigger modal if studentId is in URL
  React.useEffect(() => {
    if (targetStudentId && students.length > 0 && !activeStudent) {
      const student = students.find(s => s.studentId === targetStudentId);
      if (student) {
        openModal(student);
      }
    }
  }, [targetStudentId, students, activeStudent]);

  // Target Form
  const form = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema) as any,
    defaultValues: {
      actionType: 'promoted',
      boardingType: '',
      enrollments: [{ departmentId: '', classId: '', session: sessions[sessions.length - 1] || '', monthlyFee: 0 }],
      sessionFee: 0,
      discount: 0,
      netPayable: 0,
    },
  });

  const sessionFee = form.watch('sessionFee');
  const discount = form.watch('discount');

  // Auto-calculate netPayable
  React.useEffect(() => {
    const fee = Number(sessionFee || 0);
    const disc = Number(discount || 0);
    form.setValue('netPayable', Math.max(0, fee - disc));
  }, [sessionFee, discount, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'enrollments'
  });

  // Auto-fill logic when opening modal
  const openModal = (student: StudentListItem) => {
    setActiveStudent(student);
    const defaultSession = sessions[sessions.length - 1] || '2026';
    const activeBoarding = student?.activeEnrollments?.[0]?.boardingTypeId || '';

    form.reset({
      actionType: 'promoted',
      boardingType: activeBoarding,
      enrollments: [{
        departmentId: student.activeEnrollments?.[0]?.departmentId || '',
        classId: student.activeEnrollments?.[0]?.classId || '',
        session: defaultSession,
        section: student.activeEnrollments?.[0]?.section || '',
        monthlyFee: student.activeEnrollments?.[0]?.monthlyFee || 0,
      }],
      sessionFee: 0,
      discount: 0,
      netPayable: 0,
    });
  };

  const handleActionChange = (val: 'promoted' | 'failed' | 'continued') => {
    form.setValue('actionType', val);
    const currEnrollments = form.getValues('enrollments') || [];

    if (val === 'failed' || val === 'continued') {
      if (activeStudent) {
        // Auto fill current data
        const newEn = [...currEnrollments];
        if (newEn.length > 0) {
          newEn[0].departmentId = activeStudent.activeEnrollments?.[0]?.departmentId || '';
          newEn[0].classId = activeStudent.activeEnrollments?.[0]?.classId || '';
          newEn[0].section = activeStudent.activeEnrollments?.[0]?.section || '';
          newEn[0].monthlyFee = activeStudent.activeEnrollments?.[0]?.monthlyFee || 0;
        }
        form.setValue('enrollments', newEn);
      }
    } else {
      const newEn = [...currEnrollments];
      if (newEn.length > 0) newEn[0].classId = '';
      form.setValue('enrollments', newEn);
    }
  };

  const addEnrollment = () => {
    if (fields.length >= 3) { toast.warning('সর্বোচ্চ ৩টি বিভাগে যুক্ত করা যায়'); return; }
    append({ departmentId: '', classId: '', session: sessions[sessions.length - 1] || '', monthlyFee: 0 });
  };



  const watchPrimaryDept = form.watch('enrollments.0.departmentId');
  const watchPrimaryClass = form.watch('enrollments.0.classId');
  const watchBoardingType = form.watch('boardingType');

  // Auto fetch session/admission fee from db
  React.useEffect(() => {
    async function fetchFees() {
      if (watchPrimaryDept && watchBoardingType) {
        try {
          const res = await getAdmissionFees(watchPrimaryDept, watchBoardingType, watchPrimaryClass || undefined);
          if (res.success && res.fees) {
            const totalFee = res.fees
              .filter((f: any) => f.category !== 'monthly' && f.code !== 'monthly-fee')
              .reduce((acc: number, curr: any) => acc + (curr.defaultAmount || 0), 0);
            form.setValue('sessionFee', totalFee, { shouldValidate: true });
          }
        } catch (e) {
          console.error('Failed to fetch dynamic fees', e);
        }
      }
    }
    fetchFees();
  }, [watchPrimaryDept, watchBoardingType, watchPrimaryClass, form]);

  const columns = useMemo<ColumnDef<StudentListItem>[]>(() => [
    {
      accessorKey: 'student',
      header: 'শিক্ষার্থী ও আইডি',
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <AvatarImage src={student.photo} className="object-cover" />
              <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px]">
                <User className="h-4 w-4 text-zinc-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100 kalpurush-font text-base">{student.nameBn || student.nameEn}</p>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">{student.studentId}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'currentEnrollment',
      header: 'বর্তমান স্ট্যাটাস',
      cell: ({ row }) => {
        const student = row.original;
        const enrolls = student.activeEnrollments || [];

        if (enrolls.length === 0) {
          return (
            <div className="space-y-1 kalpurush-font">
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">জানা নেই <span className="text-zinc-400 font-normal">(বিভাগ)</span></p>
            </div>
          );
        }

        return (
          <div className="space-y-2 kalpurush-font">
            {enrolls.map((en, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <p className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">
                  {en.className || 'জানা নেই'} <span className="text-zinc-400 font-normal">({en.departmentName || 'বিভাগ'})</span>
                </p>
                <div>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00AEEF]/10 text-[#00AEEF]">
                    সেশন: {en.session || '2025'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'enrolledAt',
      header: 'এনরোলমেন্টের তারিখ',
      cell: ({ row }) => {
        const student = row.original;
        const enrDate = student.activeEnrollments?.[0]?.enrolledAt;
        return (
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 english-text">
            <Calendar className="h-3 w-3 text-zinc-400 shadow-sm" />
            {enrDate ? format(new Date(enrDate), 'dd MMM yyyy') : 'জানা নেই'}
          </div>
        );
      },
    },
    {
      accessorKey: 'contact',
      header: 'যোগাযোগ',
      cell: ({ row }) => (
        <span className="font-mono text-[13px] text-zinc-600 dark:text-zinc-400">
          {row.original.phonePrimary || row.original.guardianPhone || '---'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end pr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal(row.original)}
            className="kalpurush-font font-bold text-[#00AEEF] hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] border border-[#00AEEF]/20 dark:border-[#00AEEF]/30 cursor-pointer"
          >
            পরবর্তী সেশন / আপডেট
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = async (values: UpdateValues) => {
    if (!activeStudent) return;

    setIsSubmitting(true);
    try {
      const res = await promoteStudent({
        studentDocId: activeStudent.$id,
        studentId: activeStudent.studentId,
        actionType: values.actionType,
        boardingType: values.boardingType,
        enrollments: values.enrollments,
        sessionFee: values.sessionFee,
        discount: values.discount,
        netPayable: values.netPayable,
      });

      if (res.success) {
        const actionText = values.actionType === 'promoted' ? 'প্রমোশন' : values.actionType === 'continued' ? 'চলমান (Continued)' : 'রিপিট';
        toast.success(`${activeStudent.nameBn} এর ডাটা সফলভাবে ${actionText} করা হয়েছে!`, {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        });
        setActiveStudent(null);
        queryClient.invalidateQueries({ queryKey: studentKeys.all });
      } else {
        toast.error(res.error || 'তথ্য সেভ করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      toast.error('সার্ভার এরর: ' + (err.message || 'অজানা সমস্যা'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-2xl mx-auto min-h-screen">
      {/* ── Page Header & Search ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#00AEEF]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00AEEF]/10 transition-colors" />

        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-3 text-zinc-500 hover:text-[#00AEEF] transition-all group/back cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover/back:bg-[#00AEEF]/10 group-hover/back:scale-110 transition-all border border-zinc-200/50 dark:border-zinc-700/50">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="kalpurush-font font-bold text-sm tracking-tight">ফিরে যান</span>
          </button>

          <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800 hidden md:block opacity-50" />

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-200/50 dark:border-cyan-500/20 shadow-inner group-hover:rotate-3 transition-transform">
              <GraduationCap className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight kalpurush-font leading-tight">শিক্ষার্থী প্রমোশন ও এনরোলমেন্ট</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono opacity-80 font-bold">Promotion & Session Renewal System</p>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-80 z-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="নাম বা আইডি দিয়ে এনরোলমেন্ট খুঁজুন..."
            value={globalSearch || ''}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-10 h-11 kalpurush-font font-medium rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 focus-visible:ring-[#00AEEF] shadow-sm"
          />
        </div>
      </div>

      {/* ── Main Data Table ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none min-h-[400px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-zinc-200/50 dark:border-zinc-800/50 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-14 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 kalpurush-font">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-zinc-100/50 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="flex gap-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></div></TableCell>
                    <TableCell><div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="text-right pr-4"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-[#00AEEF]/[0.03] border-zinc-100/50 dark:border-zinc-900/50 transition-all group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-5 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={columns.length} className="h-40 text-center">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <p className="text-zinc-500 dark:text-zinc-400 kalpurush-font font-bold text-lg">কোনো এনরোলমেন্ট ডাটা পাওয়া যায়নি</p>
                    </div>
                  </td>
                </TableRow>
              )}
              {/* Infinite scroll trigger */}
              <TableRow>
                <td colSpan={columns.length} className="p-0 border-0 h-0">
                  <div ref={ref} className="h-2 w-full" />
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <RefreshCw className="h-5 w-5 text-[#00AEEF] animate-spin" />
                    </div>
                  )}
                </td>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Individual Action Modal ── */}
      <Dialog open={!!activeStudent} onOpenChange={(open) => !open && setActiveStudent(null)}>
        <DialogContent className="sm:max-w-2xl lg:max-w-4xl p-0 overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="h-2 w-full bg-gradient-to-r from-[#00AEEF] via-blue-500 to-indigo-500" />

          <div className="p-6 md:p-8 flex flex-col h-[90vh] sm:h-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6 flex flex-row items-center gap-4 text-left">
              <Avatar className="h-16 w-16 border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
                <AvatarImage src={activeStudent?.photo} />
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800"><User className="h-6 w-6 text-zinc-400" /></AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="kalpurush-font text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {activeStudent?.nameBn || 'স্টুডেন্ট'}
                </DialogTitle>
                <DialogDescription className="kalpurush-font font-medium mt-1 text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-xs text-zinc-600 dark:text-zinc-300">{activeStudent?.studentId}</span>
                  &bull; বর্তমান: <span className="font-bold text-[#00AEEF]">{activeStudent?.className || 'জানা নেই'}</span>
                </DialogDescription>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">

                {/* 1. Action Type */}
                <div className="space-y-3">
                  <FormLabel className="kalpurush-font font-extrabold text-base text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">পরবর্তী ধাপের স্ট্যাটাস</FormLabel>
                  <FormField
                    control={form.control}
                    name="actionType"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(val: 'promoted' | 'failed' | 'continued') => handleActionChange(val)}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="promoted" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-accent-foreground peer-data-[state=checked]:border-[#00AEEF] peer-data-[state=checked]:bg-[#00AEEF]/5 cursor-pointer transition-all">
                            <GraduationCap className="mb-3 h-6 w-6 text-emerald-500" />
                            <span className="kalpurush-font font-bold text-center">উত্তীর্ণ (Promote)</span>
                            <span className="text-[10px] kalpurush-font text-center text-zinc-500 mt-1">নতুন শ্রেণীতে যাবে</span>
                          </FormLabel>
                        </FormItem>

                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="continued" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-accent-foreground peer-data-[state=checked]:border-[#00AEEF] peer-data-[state=checked]:bg-[#00AEEF]/5 cursor-pointer transition-all">
                            <Activity className="mb-3 h-6 w-6 text-amber-500" />
                            <span className="kalpurush-font font-bold text-center">চলমান (Continued)</span>
                            <span className="text-[10px] kalpurush-font text-center text-zinc-500 mt-1">একই কোর্সে বহাল</span>
                          </FormLabel>
                        </FormItem>

                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="failed" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-accent-foreground peer-data-[state=checked]:border-[#00AEEF] peer-data-[state=checked]:bg-[#00AEEF]/5 cursor-pointer transition-all">
                            <Repeat2 className="mb-3 h-6 w-6 text-rose-500" />
                            <span className="kalpurush-font font-bold text-center">রিপিট (Failed)</span>
                            <span className="text-[10px] kalpurush-font text-center text-zinc-500 mt-1">একই ক্লাস পুনরাবৃত্তি</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    )}
                  />
                </div>

                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/80 my-4" />

                {/* 2. Boarding Type (Applies to all) */}
                <div className="space-y-3">
                  <FormLabel className="kalpurush-font font-bold text-sm text-zinc-900 dark:text-zinc-100">আবাসিক/অনাবাসিক ধরণ <span className="text-rose-500">*</span></FormLabel>
                  <FormField
                    control={form.control}
                    name="boardingType"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 kalpurush-font font-medium">
                              <SelectValue placeholder="ধরণ নির্বাচন করুন..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="kalpurush-font">
                            {boardingTypes.map((bt: any) => (
                              <SelectItem key={bt.$id} value={bt.$id}>{bt.nameBn || bt.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/80 my-4" />

                {/* 3. Dynamic Target Classes */}
                <div className="space-y-4 bg-zinc-50/50 dark:bg-zinc-900/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 kalpurush-font">এনরোলমেন্ট সমূহ</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 kalpurush-font">স্টুডেন্টকে নতুন কোন কোন ক্লাসে ভর্তি করাতে চান তা যোগ করুন।</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEnrollment}
                      disabled={fields.length >= 3}
                      className="h-9 px-4 rounded-xl border-[#00AEEF]/20 text-[#00AEEF] hover:bg-[#00AEEF]/5 gap-2 font-bold transition-all kalpurush-font cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> আরও একটি যোগ করুন
                    </Button>
                  </div>

                  <div className="space-y-3 mt-4">
                    <AnimatePresence mode="popLayout">
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <EnrollmentTargetCard
                            index={index}
                            remove={remove}
                            departments={departments}
                            sessions={sessions}
                            sections={sections}
                            canRemove={fields.length > 1}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 4. Session Fee Summary */}
                <div className="space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                    <Wallet className="h-24 w-24" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 kalpurush-font flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-[#00AEEF]" /> সেশন ফি ও পেমেন্ট
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 kalpurush-font">প্রমোশনের সাথে যে ফি ইনভয়েস তৈরি হবে তা নির্ধারণ বা পরিবর্তন করুন</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 mt-4">
                    <FormField control={form.control} name="sessionFee" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest kalpurush-font">সেশন/অ্যাডমিশন ফি (৳)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" className="h-11 font-bold text-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" {...field} onChange={e => field.onChange(Number(e.target.value))} value={field.value || ''} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="discount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest kalpurush-font">ছাড় / ডিসকাউন্ট (৳)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" className="h-11 font-bold text-lg text-emerald-600 bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20" {...field} onChange={e => field.onChange(Number(e.target.value))} value={field.value || ''} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="netPayable" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold text-[#00AEEF] uppercase tracking-widest kalpurush-font">পেমেন্ট করতে হবে (৳)</FormLabel>
                        <FormControl>
                          <Input type="number" readOnly placeholder="0" className="h-11 font-black text-xl text-[#00AEEF] bg-[#00AEEF]/5 border-[#00AEEF]/20" {...field} value={field.value || 0} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 kalpurush-font font-black text-lg shadow-xl shadow-[#00AEEF]/20 bg-[#00AEEF] hover:bg-[#0092c8] text-white rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin" /> প্রোসেস হচ্ছে...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6" /> নিশ্চিত করুন
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
