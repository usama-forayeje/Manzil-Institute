'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  User as UserIcon,
  Phone,
  Calendar,
  Building,
  Loader2,
  ExternalLink,
  MessageSquareCheck,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInfiniteStudents, studentKeys } from '../api/queries';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StudentListItem } from '../types';
import { deleteStudent } from '../api/service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default function StudentTable() {
  const queryClient = useQueryClient();

  const { 
    data, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteStudents();

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const students = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.documents ?? []) ?? [];
  }, [data]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই শিক্ষার্থীকে নিষ্ক্রিয় করতে চান?')) return;
    try {
      const res = await deleteStudent(id);
      if (res.success) {
        toast.success('শিক্ষার্থী সফলভাবে নিষ্ক্রিয় করা হয়েছে');
        queryClient.invalidateQueries({ queryKey: studentKeys.all });
      } else {
        toast.error(res.error || 'ডিলেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      toast.error('সার্ভারে সমস্যা হয়েছে');
    }
  };

  const columns = useMemo<ColumnDef<StudentListItem>[]>(() => [
    {
      accessorKey: 'student',
      header: 'শিক্ষার্থী',
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-10 w-10 border-2 border-dashed border-[#00AEEF]/20 p-0.5 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
              <AvatarImage src={student.photo} alt={student.nameEn} className="rounded-full object-cover" />
              <AvatarFallback className="bg-[#00AEEF]/5 text-[#00AEEF]">
                <UserIcon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 kalpurush-font leading-tight truncate">
                {student.nameBn}
              </span>
              <div className="flex flex-col gap-0.5 mt-1">
                 {student.activeEnrollments?.map((en, i) => (
                    <span key={i} className="text-[10px] text-[#00AEEF] font-bold kalpurush-font flex items-center gap-1 bg-[#00AEEF]/5 px-1.5 py-0.5 rounded-md w-fit">
                       <GraduationCap className="h-2.5 w-2.5" />
                       {en.departmentName} &bull; {en.className} &bull; {en.session}
                    </span>
                 ))}
                 {!student.activeEnrollments?.length && (
                    <span className="text-[10px] text-zinc-400 kalpurush-font italic">এনরোলমেন্ট নেই</span>
                 )}
              </div>
              <span className="text-[9px] text-zinc-400 font-mono mt-1 opacity-50 uppercase tracking-tighter">
                {student.studentId}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'contact',
      header: 'যোগাযোগ ও ঠিকানা',
      cell: ({ row }) => {
        const student = row.original;
        const phone = student.whatsappNo || student.guardianPhone || student.phonePrimary || '---';
        const isWhatsapp = !!student.whatsappNo;
        
        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
               {isWhatsapp ? (
                  <MessageSquareCheck className="h-3 w-3 text-emerald-500" />
               ) : (
                  <Phone className="h-3 w-3 text-[#00AEEF]" />
               )}
              <span className="english-text font-bold text-zinc-900 dark:text-zinc-100">{phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
              <Building className="h-3 w-3 min-w-[12px] text-zinc-400" />
              <span className="kalpurush-font truncate max-w-[120px]">
                {[student.presentThana, student.presentDistrict].filter(Boolean).join(', ') || student.address || '---'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
        accessorKey: 'boarding',
        header: 'আবাসিক ধরণ',
        cell: ({ row }) => {
          const student = row.original;
          const boarding = student.boardingType || student.activeEnrollments?.[0]?.boardingType || '---';
          
          return (
            <div className="flex items-center gap-1.5">
               <div className={cn(
                 "h-1.5 w-1.5 rounded-full",
                 boarding?.includes('আবাসিক') || boarding?.toLowerCase()?.includes('residential') 
                   ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                   : "bg-zinc-300 dark:bg-zinc-700"
               )} />
               <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 kalpurush-font">
                 {boarding}
               </span>
            </div>
          );
        },
    },
    {
      accessorKey: 'status',
      header: 'স্ট্যাটাস',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold border-0 uppercase tracking-tighter",
              status === 'active' ? "bg-emerald-500/10 text-emerald-600" : 
              status === 'graduated' ? "bg-blue-500/10 text-blue-600" : "bg-rose-500/10 text-rose-600"
            )}
          >
            {status === 'active' ? 'সক্রিয়' : status === 'graduated' ? 'উত্তীর্ণ' : 'নিষ্ক্রিয়'}
          </Badge>
        );
      },
    },
    {
        accessorKey: 'admissionDate',
        header: 'ভর্তির তারিখ',
        cell: ({ row }) => {
          const date = row.original.admissionDate;
          return (
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 english-text">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                {date ? format(new Date(date), 'dd MMM yyyy') : 'N/A'}
            </div>
          );
        },
      },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#00AEEF]/5">
              <MoreHorizontal className="h-4 w-4 text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-2xl kalpurush-font bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-3 py-2 tracking-widest opacity-50">ম্যানেজমেন্ট</DropdownMenuLabel>
            <Link href={`/dashboard/admin/students/${row.original.$id}`}>
              <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] transition-all">
                <Eye className="h-4 w-4" /> প্রোফাইল দেখুন
              </DropdownMenuItem>
            </Link>
            
            <Link href={`/dashboard/admin/students/${row.original.$id}/edit`}>
              <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] transition-all w-full">
                <Edit className="h-4 w-4" /> পূর্ণাঙ্গ এডিট করুন
                <ExternalLink className="h-3 w-3 ml-auto opacity-30" />
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />

            <Link href={`/dashboard/admin/students/promote?studentId=${row.original.studentId}`}>
              <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer py-2.5 px-3 text-[#00AEEF] hover:bg-[#00AEEF]/5 transition-all font-bold">
                <TrendingUp className="h-4 w-4" /> প্রমোশন / আপডেট
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
            
            <DropdownMenuItem 
              onClick={() => handleDelete(row.original.$id)}
              className="gap-3 rounded-xl cursor-pointer py-2.5 px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all font-bold"
            >
              <Trash2 className="h-4 w-4" /> ডিলেট/নিষ্ক্রিয়
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [queryClient]);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <StudentTableSkeleton />;
  if (isError) return <div className="p-12 text-center text-rose-500 font-black kalpurush-font bg-rose-50/50 rounded-3xl border-2 border-dashed border-rose-100">ডেটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</div>;

  return (
    <div className="relative">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<StudentListItem>) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-zinc-200/50 dark:border-zinc-800/50">
                {headerGroup.headers.map((header: Header<StudentListItem, unknown>) => (
                  <TableHead key={header.id} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 h-14 kalpurush-font px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<StudentListItem>) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-[#00AEEF]/[0.03] border-zinc-100/50 dark:border-zinc-900/50 transition-all group"
                >
                  {row.getVisibleCells().map((cell: Cell<StudentListItem, unknown>) => (
                    <TableCell key={cell.id} className="py-5 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell {...{ colSpan: columns.length } as any} className="h-64 text-center bg-transparent">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                    <div className="h-16 w-16 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-base font-black text-zinc-500 kalpurush-font tracking-wide">কোন শিক্ষার্থী পাওয়া যায়নি</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasNextPage && (
        <div ref={ref} className="py-12 flex justify-center w-full">
           <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800">
                <Loader2 className="h-5 w-5 animate-spin text-[#00AEEF]" />
                <span className="text-xs font-bold text-zinc-500 kalpurush-font">লোড হচ্ছে...</span>
           </div>
        </div>
      )}
    </div>
  );
}

function StudentTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-6 py-5 border-b border-zinc-100/50 dark:border-zinc-900 last:border-0">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-3 w-[120px]" />
            </div>
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-5 w-[90px] rounded-full" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
