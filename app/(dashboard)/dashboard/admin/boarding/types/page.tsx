'use client';

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Hash, 
  Type, 
  Check,
  Search,
  MoreHorizontal,
  Home,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { 
  upsertBoardingType,
  deleteBoardingType,
} from '@/lib/actions/academic';
import { boardingTypesQueryOptions, academicKeys } from '@/features/academic/api/queries';
import { convertEnglishToBengali } from '@/lib/utils';

// --- Column Helper & Definitions ---
const columnHelper = createColumnHelper<any>();

export default function BoardingTypesPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [globalFilter, setGlobalFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    order: 0,
    monthlyFee: 0,
    isActive: true,
  });

  // --- Queries ---
  const { data, isLoading } = useQuery(boardingTypesQueryOptions);
  const boardingTypes = useMemo(() => data?.boardingTypes || [], [data]);

  // --- Mutations ---
  const mutation = useMutation({
    mutationFn: (payload: any) => upsertBoardingType({ ...payload, docId: editingId }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(editingId ? 'সফলভাবে আপডেট হয়েছে!' : 'নতুন বোর্ডিং টাইপ যুক্ত হয়েছে!');
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: academicKeys.boardingTypes() });
      } else {
        toast.error(res.error || 'কিছু একটা ভুল হয়েছে');
      }
    },
    onError: () => toast.error('সার্ভারে যোগাযোগ করতে সমস্যা হচ্ছে'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBoardingType(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('সফলভাবে ডিলিট হয়েছে');
        queryClient.invalidateQueries({ queryKey: academicKeys.boardingTypes() });
      } else {
        toast.error('ডিলিট করতে সমস্যা হয়েছে');
      }
    },
  });

  // --- Handlers ---
  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingId(item.$id);
      setFormData({
        name: item.name,
        nameBn: item.nameBn,
        order: item.order,
        monthlyFee: item.monthlyFee || 0,
        isActive: item.isActive,
      });
    } else {
      setEditingId(undefined);
      setFormData({
        name: '',
        nameBn: '',
        order: boardingTypes.length,
        monthlyFee: 0,
        isActive: true,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nameBn) {
      toast.error('সবগুলো ঘর পূরণ করুন');
      return;
    }
    mutation.mutate(formData);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('order', {
      header: 'ক্রম',
      cell: (info) => (
        <span className="flex items-center justify-center h-6 w-6 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          {convertEnglishToBengali(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('nameBn', {
      header: 'নাম (বাংলা)',
      cell: (info) => <div className="font-medium text-zinc-900 dark:text-zinc-100">{info.getValue()}</div>,
    }),
    columnHelper.accessor('name', {
      header: 'নাম (English)',
      cell: (info) => <div className="text-zinc-500 dark:text-zinc-400">{info.getValue()}</div>,
    }),
    columnHelper.accessor('monthlyFee', {
      header: 'মাসিক ফি',
      cell: (info) => (
        <div className="font-bold text-[#00AEEF]">
          ৳ {convertEnglishToBengali(info.getValue()?.toLocaleString() || 0)}
        </div>
      ),
    }),
    columnHelper.accessor('isActive', {
      header: 'অবস্থা',
      cell: (info) => (
        <Badge 
          variant={info.getValue() ? "outline" : "destructive"} 
          className={info.getValue() ? "bg-emerald-50 text-emerald-600 border-emerald-200 rounded-md font-medium" : "rounded-md font-medium"}
        >
          {info.getValue() ? (
            <span className="flex items-center gap-1"><Check className="h-3 w-3" /> সক্রিয়</span>
          ) : (
            'নিষ্ক্রিয়'
          )}
        </Badge>
      ),
    }),
    {
      id: "actions",
      header: () => <div className="text-right">অ্যাকশন</div>,
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-md">
                <DropdownMenuLabel>ম্যানেজ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="cursor-pointer">
                  <Edit2 className="mr-2 h-3.5 w-3.5 text-blue-500" /> এডিট করুন
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    if (confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) {
                      deleteMutation.mutate(item.$id);
                    }
                  }} 
                  className="text-red-500 cursor-pointer focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> ডিলিট করুন
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [boardingTypes]);

  const table = useReactTable({
    data: boardingTypes,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-1 space-y-6 animate-in fade-in duration-500 kalpurush-font">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-zinc-950 p-6 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00AEEF]/10 rounded-md">
            <Home className="h-6 w-6 text-[#00AEEF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">বোর্ডিং ধরন ব্যবস্থাপনা</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">সবধরনের আবাসন কন্ট্রোল ও ডাটা ম্যানেজমেন্ট</p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white rounded-md px-6 h-11 transition-all active:scale-95 shadow-lg shadow-[#00AEEF]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> নতুন ধরন যুক্ত করুন
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm border-blue-100 dark:border-blue-900/20 text-center rounded-md transition-all hover:-translate-y-1 shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">মোট ধরণ</p>
          <h3 className="text-3xl font-bold text-[#00AEEF]">
            {convertEnglishToBengali(boardingTypes.length)}
          </h3>
        </Card>
        <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 backdrop-blur-sm border-emerald-100 dark:border-emerald-900/20 text-center rounded-md transition-all hover:-translate-y-1 shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">সক্রিয় ধরণ</p>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
            {convertEnglishToBengali(boardingTypes.filter((s: any) => s.isActive).length)}
          </h3>
        </Card>
        <Card className="p-4 bg-red-50/50 dark:bg-red-900/10 backdrop-blur-sm border-red-100 dark:border-red-900/20 text-center rounded-md transition-all hover:-translate-y-1 shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">নিষ্ক্রিয় ধরণ</p>
          <h3 className="text-3xl font-bold text-red-600 dark:text-red-500">
            {convertEnglishToBengali(boardingTypes.filter((s: any) => !s.isActive).length)}
          </h3>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-md shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
            <Input
              placeholder="ধরন খুঁজুন..."
              className="pl-10 h-10 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-[#00AEEF]/20 rounded-md bg-white dark:bg-zinc-900"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4"><Skeleton className="h-4 w-full rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-10 w-10 text-zinc-300" />
                      <p className="text-zinc-500 font-medium">কোনো বোর্ডিং ধরণ পাওয়া যায়নি</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] kalpurush-font rounded-md border-[#00AEEF]/10 shadow-2xl overflow-hidden p-0">
          <div className="bg-[#00AEEF] p-6 text-white relative">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-6 w-6" />}
              {editingId ? 'বোর্ডিং ধরণ এডিট করুন' : 'নতুন ধরণ যুক্ত করুন'}
            </DialogTitle>
            <DialogDescription className="text-blue-50 mt-1 opacity-90">
              প্রয়োজনীয় তথ্য দিয়ে ফরমটি পূরণ করুন
            </DialogDescription>
            <div className="absolute -right-6 -bottom-6 opacity-10 bg-white rounded-full p-12">
               <Home className="h-16 w-16" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white dark:bg-zinc-950">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2 group">
                  <label className="text-sm font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Type className="h-4 w-4 text-[#00AEEF]" /> নাম (বাংলা)
                  </label>
                  <Input 
                    value={formData.nameBn} 
                    onChange={(e) => setFormData({...formData, nameBn: e.target.value})} 
                    placeholder="যেমন: আবাসিক" 
                    className="focus:ring-[#00AEEF]/20 border-zinc-200 dark:border-zinc-800 rounded-md h-11"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Type className="h-4 w-4 text-[#00AEEF]" /> Name (English)
                  </label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Residential" 
                    className="focus:ring-[#00AEEF]/20 border-zinc-200 dark:border-zinc-800 rounded-md h-11"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Hash className="h-4 w-4 text-[#00AEEF]" /> মাসিক ফি (টাকা)
                  </label>
                  <Input 
                    type="number"
                    value={formData.monthlyFee} 
                    onChange={(e) => setFormData({...formData, monthlyFee: Number(e.target.value)})} 
                    placeholder="যেমন: ৫০০০" 
                    className="focus:ring-[#00AEEF]/20 border-zinc-200 dark:border-zinc-800 rounded-md h-11 font-bold text-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Hash className="h-4 w-4 text-[#00AEEF]" /> সিরিয়াল
                  </label>
                  <Input 
                    type="number" 
                    value={formData.order} 
                    onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                    className="h-11 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">অবস্থা</label>
                  <div className="flex items-center h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 gap-3 bg-zinc-50 dark:bg-zinc-900 font-medium">
                    <Switch 
                      checked={formData.isActive} 
                      onCheckedChange={(val) => setFormData({...formData, isActive: val})} 
                    />
                    <span className={formData.isActive ? "text-emerald-500" : "text-red-500"}>
                      {formData.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-md px-6">বাতিল</Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending} 
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white rounded-md px-8 shadow-lg shadow-[#00AEEF]/20"
              >
                {mutation.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
