'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Home,
  UserCheck,
  UserMinus,
  LayoutGrid,
  MoreVertical,
  Edit2,
  Eye,
  RefreshCw,
  Phone,
  Backpack,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Hotel,
  ArrowRightLeft,
  StickyNote
} from 'lucide-react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useInfiniteStudents } from '@/features/students/api/queries';
import { boardingTypesQueryOptions } from '@/features/academic/api/queries';
import { boardingRoomsQueryOptions } from '@/features/admission/api/queries';
import { getMonthlyFee } from '@/features/admission/api/service';
import { updateRoomAssignment, updateBoardingType } from '@/lib/actions/boarding';
import { convertEnglishToBengali, cn } from '@/lib/utils';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- Column Helper ---
const columnHelper = createColumnHelper<any>();

export default function BoardingStudentsPage() {
  // Filters State
  const [search, setSearch] = useState('');
  const [boardingTypeFilter, setBoardingTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  // React Query for Boarding Types & Rooms
  const queryClient = useQueryClient();
  const { data: btData } = useQuery(boardingTypesQueryOptions);
  const { data: roomsData } = useQuery(boardingRoomsQueryOptions);

  const boardingTypes = useMemo(() => btData?.boardingTypes || [], [btData]);
  const rooms = useMemo(() => roomsData?.rooms || [], [roomsData]);

  // Modal States
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Assignment States
  const [targetRoom, setTargetRoom] = useState('');
  const [targetType, setTargetType] = useState('');
  const [projectedFee, setProjectedFee] = useState<number | null>(null);
  const [isSyncingFee, setIsSyncingFee] = useState(false);

  // Infinite Query for Students
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching
  } = useInfiniteStudents({
    search: search.length >= 3 ? search : undefined,
    status: statusFilter,
    boardingType: boardingTypeFilter !== 'all' ? boardingTypeFilter : undefined,
  });

  const students = useMemo(() =>
    data?.pages.flatMap(page => page.data?.documents || []) || [],
    [data]);

  const totalCount = data?.pages[0]?.data?.total || 0;

  // --- Mutations ---
  const roomMutation = useMutation({
    mutationFn: updateRoomAssignment,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("রুম সফলভাবে বরাদ্দ করা হয়েছে!");
        queryClient.invalidateQueries({ queryKey: ['students'] });
        setIsRoomModalOpen(false);
      } else {
        toast.error("রুম বরাদ্দ করতে সমস্যা হয়েছে: " + res.error);
      }
    }
  });

  const typeMutation = useMutation({
    mutationFn: updateBoardingType,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("বোর্ডিং ধরন সফলভাবে আপডেট করা হয়েছে!");
        queryClient.invalidateQueries({ queryKey: ['students'] });
        setIsTypeModalOpen(false);
      } else {
        toast.error("টাইপ আপডেট করতে সমস্যা হয়েছে: " + res.error);
      }
    }
  });

  // Handle Fee Sync Effect
  useEffect(() => {
    async function syncFee() {
      if (!selectedStudent || !targetType) return;
      setIsSyncingFee(true);
      try {
        const enrollment = selectedStudent.activeEnrollments?.[0];
        console.log("Syncing fee for student:", selectedStudent.nameEn, "Dept:", enrollment?.departmentId, "Type:", targetType);

        if (enrollment?.departmentId && enrollment?.classId) {
          const res = await getMonthlyFee(enrollment.departmentId, targetType, enrollment.classId);
          console.log("Fee result:", res);
          if (res.success) setProjectedFee(res.amount);
        } else {
          console.warn("Enrollment data incomplete for fee sync", enrollment);
        }
      } catch (err) {
        console.error("Fee sync failed", err);
      } finally {
        setIsSyncingFee(false);
      }
    }
    if (isTypeModalOpen) syncFee();
    else setProjectedFee(0);
  }, [targetType, selectedStudent, isTypeModalOpen]);

  // --- Column Definitions ---
  const columns = useMemo(() => [
    columnHelper.accessor('nameEn', {
      header: 'শিক্ষার্থী',
      cell: (info) => {
        const student = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
              {student.photo ? (
                <Image
                  src={student.photo}
                  alt={student.nameEn}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                  <Users className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 leading-none truncate max-w-[180px]">
                {student.nameBn || student.nameEn}
              </span>
              <span className="text-[10px] font-mono font-medium text-[#00AEEF] mt-1 bg-[#00AEEF]/5 px-1.5 py-0.5 rounded w-fit">
                {student.studentId}
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('boardingType', {
      header: 'ধরন',
      cell: (info) => {
        const type = info.getValue() || 'উল্লেখ নেই';
        const isResidential = type.includes('আবাসিক') || type.toLowerCase().includes('residential');
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-md font-medium text-[11px] px-2.5 py-0.5 border shadow-sm transition-all",
              isResidential ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-blue-50 text-blue-600 border-blue-200"
            )}
          >
            {type}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('hallName', {
      header: 'রুম ও হল',
      cell: (info) => {
        const hallName = info.getValue();
        const student = info.row.original;
        const roomNo = student.hallId; // hallId frequently stores room number in this project

        return (
          <div className="flex flex-col gap-1">
            {roomNo || hallName ? (
              <>
                <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                  <Building2 className="h-3 w-3" />
                  {roomNo ? `রুম: ${convertEnglishToBengali(roomNo)}` : 'রুম নেই'}
                </div>
                {hallName && (
                  <div className="text-[10px] font-medium text-zinc-500 truncate max-w-[150px]">
                    {hallName}
                  </div>
                )}
              </>
            ) : (
              <span className="text-zinc-400 text-[10px] italic">বরাদ্দ নেই</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('className', {
      header: 'শ্রেণী ও বিভাগ',
      cell: (info) => {
        const student = info.row.original;
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-black text-zinc-800 dark:text-zinc-200 text-sm leading-none">
              <div className="h-2 w-2 rounded-full bg-[#00AEEF]" />
              {student.className || '---'}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
              <Backpack className="h-3 w-3 text-zinc-300" />
              {student.departmentName || '---'}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('phonePrimary', {
      header: 'যোগাযোগ',
      cell: (info) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <Phone className="h-3 w-3 text-[#00AEEF]/60" />
            {info.getValue() ? convertEnglishToBengali(info.getValue()) : '---'}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
            <MapPin className="h-3 w-3" />
            {info.row.original.presentDistrict || 'লোকেশন নেই'}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'অবস্থা',
      cell: (info) => {
        const status = info.getValue();
        const isActive = status === 'active';
        return (
          <Badge
            variant={isActive ? "outline" : "destructive"}
            className={cn(
              "rounded-md font-bold text-[10px] uppercase tracking-wide gap-1",
              isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""
            )}
          >
            {isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
          </Badge>
        );
      },
    }),
    {
      id: "actions",
      header: () => <div className="text-right">অ্যাকশন</div>,
      cell: ({ row }: any) => {
        const student = row.original;
        return (
          <div className="text-right">
            <DropdownMenu scroll-lock="false">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-md shadow-xl border-zinc-200 dark:border-zinc-800 solaiman-lipi">
                <DropdownMenuLabel className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-3 py-2">বোর্ডিং অ্যাকশন</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-[#00AEEF]/10 focus:text-[#00AEEF] font-bold rounded-lg m-1">
                  <Eye className="h-3.5 w-3.5" /> প্রোফাইল দেখুন
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStudent(student);
                    // Ensure we use the raw ID for the Select component
                    setTargetRoom(student.hallId || student.activeEnrollments?.[0]?.hallId || '');
                    setIsRoomModalOpen(true);
                  }}
                  className="cursor-pointer gap-2 focus:bg-emerald-100 focus:text-emerald-600 font-bold rounded-lg m-1"
                >
                  <Building2 className="h-3.5 w-3.5" /> রুম পরিবর্তন
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStudent(student);
                    // Use boardingTypeId for the ID-based Select component
                    setTargetType(student.activeEnrollments?.[0]?.boardingTypeId || student.boardingTypeId || '');
                    setIsTypeModalOpen(true);
                  }}
                  className="cursor-pointer gap-2 focus:bg-blue-100 focus:text-blue-600 font-bold rounded-lg m-1"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" /> বোর্ডিং পরিবর্তন
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-1 space-y-6 animate-in fade-in duration-700 solaiman-lipi">
      {/* Header & Title */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#00AEEF]/10 rounded-md ring-1 ring-[#00AEEF]/20 shadow-inner">
            <Home className="h-8 w-8 text-[#00AEEF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">আবাসিক শিক্ষার্থী তালিকা</h1>
              <Badge className="bg-[#00AEEF] hover:bg-[#00AEEF] font-bold rounded-md px-3 py-0.5">
                লিভ-ইন
              </Badge>
            </div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              প্রতিষ্ঠানে বর্তমান আবাসিক ছাত্রদের ডাটাবেস ও অবস্থান
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-12 w-12 rounded-md transition-all active:scale-95 shadow-sm"
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-5 w-5 text-zinc-500", isRefetching && "animate-spin")} />
          </Button>
          <Button
            className="h-12 px-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-lg transition-all active:scale-95 gap-2"
          >
            <LucideIcon icon={LayoutGrid} className="h-5 w-5" /> রিপোর্ট ডাউনলোড
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="মোট আবাসিক"
          value={totalCount}
          icon={Users}
          color="text-[#00AEEF]"
          bgIcon="bg-[#00AEEF]/10"
        />
        <StatCard
          label="সক্রিয় শিক্ষার্থী"
          value={students.filter(s => s.status === 'active').length}
          icon={UserCheck}
          color="text-emerald-500"
          bgIcon="bg-emerald-500/10"
        />
        <StatCard
          label="হল/রুমে বরাদ্দ"
          value={students.filter(s => s.hallName).length}
          icon={Building2}
          color="text-indigo-500"
          bgIcon="bg-indigo-500/10"
        />
        <StatCard
          label="অব্যাহতি প্রাপ্ত"
          value={students.filter(s => s.status === 'inactive').length}
          icon={UserMinus}
          color="text-rose-500"
          bgIcon="bg-rose-500/10"
        />
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4 rounded-md border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-1/3 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
            <Input
              placeholder="শিক্ষার্থীর নাম, আইডি বা মোবাইল নম্বর দিয়ে খুঁজুন..."
              className="pl-11 h-12 border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-[#00AEEF]/10 rounded-md bg-white dark:bg-zinc-900 font-bold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-fit justify-end">
            <Filter className="h-4 w-4 text-zinc-400 mr-1 hidden sm:block" />

            {/* Boarding Type Filter */}
            <Select value={boardingTypeFilter} onValueChange={setBoardingTypeFilter}>
              <SelectTrigger className="h-12 w-[180px] rounded-md border-zinc-200 dark:border-zinc-800 font-bold bg-white dark:bg-zinc-900 shadow-sm overflow-hidden cursor-pointer">
                <SelectValue placeholder="বোর্ডিং ধরন" />
              </SelectTrigger>
              <SelectContent className="rounded-md solaiman-lipi">
                <SelectItem value="all" className="font-bold">সকল আবাসন</SelectItem>
                {boardingTypes.map((type: any) => (
                  <SelectItem key={type.$id} value={type.$id} className="font-bold">
                    {type.nameBn || type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 w-[140px] rounded-md border-zinc-200 dark:border-zinc-800 font-bold bg-white dark:bg-zinc-900 shadow-sm">
                <SelectValue placeholder="অবস্থা" />
              </SelectTrigger>
              <SelectContent className="rounded-md solaiman-lipi">
                <SelectItem value="all" className="font-bold">সকল স্ট্যাটাস</SelectItem>
                <SelectItem value="active" className="font-bold">সক্রিয়</SelectItem>
                <SelectItem value="inactive" className="font-bold">নিষ্ক্রিয়</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Table Content */}
      <Card className="rounded-md border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-xl shadow-zinc-200/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-zinc-100/50 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-5">
                        <Skeleton className="h-4 w-3/4 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-32 text-center text-muted-foreground bg-zinc-50/20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-md">
                        <Users className="h-12 w-12 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
                        <p className="text-sm">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-[#00AEEF]/5 dark:hover:bg-[#00AEEF]/5 transition-all group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-5 whitespace-nowrap align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Trigger */}
        {hasNextPage && (
          <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-center bg-zinc-50/30">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="h-12 px-10 rounded-md font-bold border-zinc-200 dark:border-zinc-800 shadow-sm gap-2 hover:bg-zinc-100 transition-all"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  নতুন ডাটা আসছে...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  আরও দেখুন
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Mobile Responsive Hints */}
      <div className="lg:hidden text-center py-4">
        <div className="text-xs text-zinc-400 flex items-center justify-center gap-2 uppercase tracking-widest font-bold">
          <div className="h-px w-8 bg-zinc-200" />
          বাম থেকে ডানে স্ক্রল করে সব ডাটা দেখুন
          <div className="h-px w-8 bg-zinc-200" />
        </div>
      </div>

      {/* --- Modals Section --- */}

      {/* 1. Room Assignment Modal */}
      <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
        <DialogContent className="max-w-md rounded-md p-0 overflow-hidden border-none shadow-2xl solaiman-lipi">
          <DialogHeader className="p-8 bg-emerald-500 text-white relative overflow-hidden">
            <Building2 className="absolute -right-8 -bottom-8 h-40 w-40 opacity-10 rotate-12" />
            <DialogTitle className="text-2xl font-black relative z-10">রুম বরাদ্দ করুন</DialogTitle>
            <DialogDescription className="text-emerald-50 relative z-10 font-bold">
              {selectedStudent?.nameBn || selectedStudent?.nameEn}-এর জন্য হল এবং রুম সিলেক্ট করুন।
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">রুম নির্বাচন করুন</Label>
                <Select value={targetRoom} onValueChange={setTargetRoom}>
                  <SelectTrigger className="h-14 rounded-md border-zinc-200 dark:border-zinc-800 font-bold focus:ring-emerald-500/20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 cursor-pointer">
                    <SelectValue placeholder="রুম সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md solaiman-lipi max-h-[300px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    {rooms.map((room: any) => (
                      <SelectItem key={room.$id} value={room.roomNo} className="font-bold cursor-pointer">
                        <div className="flex flex-col">
                          <span>রুম {convertEnglishToBengali(room.roomNo)} — {room.roomName}</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{room.floor} (সিট: {convertEnglishToBengali(room.capacity)}টি)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                onClick={() => {
                  const roomObj = rooms.find((r: any) => r.roomNo === targetRoom);
                  roomMutation.mutate({
                    enrollmentId: selectedStudent.activeEnrollments?.[0]?.$id || selectedStudent.activeEnrollments?.[0]?.id,
                    hallId: targetRoom,
                    hallName: roomObj?.roomName || '',
                  });
                }}
                disabled={roomMutation.isPending || !targetRoom}
                className="w-full h-14 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 gap-2"
              >
                {roomMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                এসাইনমেন্ট নিশ্চিত করুন
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Boarding Type Modal */}
      <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
        <DialogContent className="max-w-md rounded-md p-0 overflow-hidden border-none shadow-2xl solaiman-lipi">
          <DialogHeader className="p-8 bg-[#00AEEF] text-white relative overflow-hidden">
            <ArrowRightLeft className="absolute -right-8 -bottom-8 h-40 w-40 opacity-10 -rotate-12" />
            <DialogTitle className="text-2xl font-black relative z-10">বোর্ডিং ধরন পরিবর্তন</DialogTitle>
            <DialogDescription className="text-blue-50 relative z-10 font-bold text-xs leading-relaxed">
              {selectedStudent?.nameEn}-এর বর্তমান আবাসন ব্যবস্থা পরিবর্তন করলে মাস ভিত্তিক ফিতে প্রভাব পড়তে পারে।
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">নতুন বোর্ডিং ধরন</Label>
                <Select value={targetType} onValueChange={setTargetType}>
                  <SelectTrigger className="h-14 rounded-md border-zinc-200 dark:border-zinc-800 font-bold focus:ring-[#00AEEF]/20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 cursor-pointer">
                    <SelectValue placeholder="টাইপ সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md solaiman-lipi border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    {boardingTypes.map((bt: any) => (
                      <SelectItem key={bt.$id} value={bt.$id} className="font-bold focus:bg-[#00AEEF]/10 cursor-pointer">{bt.nameBn || bt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fee Impact Display */}
              {targetType && (
                <div
                  className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">প্রক্ষেপিত মাসিক বেতন</p>
                    <h4 className="text-2xl font-black text-[#00AEEF]">
                      {isSyncingFee ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        `৳${convertEnglishToBengali(projectedFee || 0)}`
                      )}
                    </h4>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <StickyNote className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                onClick={() => {
                  typeMutation.mutate({
                    enrollmentId: selectedStudent.activeEnrollments?.[0]?.$id || selectedStudent.activeEnrollments?.[0]?.id,
                    boardingTypeId: targetType,
                    monthlyFee: projectedFee || undefined
                  });
                }}
                disabled={typeMutation.isPending || isSyncingFee || !targetType}
                className="w-full h-14 rounded-md bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-black text-lg shadow-lg shadow-[#00AEEF]/20 transition-all active:scale-95 gap-2"
              >
                {typeMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRightLeft className="h-5 w-5" />}
                টাইপ আপডেট করুন
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Internal Support Components ---

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgIcon
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  bgIcon: string;
}) {
  return (
    <Card className="relative overflow-hidden p-6 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px] group">
      {/* Decorative colored strip on the left */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2", color.replace('text-', 'bg-'))} />

      <div className="flex items-center gap-5">
        <div className={cn("p-3.5 rounded-md flex items-center justify-center transition-transform group-hover:scale-110", bgIcon)}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em]">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
              {convertEnglishToBengali(value)}
            </h3>
            <span className="text-[11px] font-bold text-zinc-400">জন</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LucideIcon({ icon: Icon, ...props }: { icon: any } & React.ComponentProps<any>) {
  return <Icon {...props} />;
}
