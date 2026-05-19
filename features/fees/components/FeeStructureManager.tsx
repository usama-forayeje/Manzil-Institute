'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Check,
  X,
  CreditCard,
  Banknote,
  Loader2,
  Filter,
  Search,
  LayoutGrid,
  Info,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { feeTypesQueryOptions, feeKeys } from '../api/queries';
import { createFeeType, updateFeeType, deleteFeeType } from '../api/service';
import { 
  departmentsQueryOptions, 
  boardingTypesQueryOptions 
} from '@/features/admission/api/queries';

const CATEGORY_LABELS: Record<string, string> = {
  admission: 'ভর্তি ফি (Admission)',
  monthly: 'মাসিক বেতন (Monthly)',
  session: 'সেশন/বার্ষিক ফি (Session)',
  other: 'অন্যান্য (Other)'
};

const CATEGORY_COLORS: Record<string, string> = {
  admission: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20',
  monthly: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
  session: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
  other: 'bg-zinc-50 text-zinc-600 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-100 dark:border-zinc-500/20'
};

export default function FeeStructureManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    code: '',
    category: 'monthly',
    defaultAmount: 0,
    isActive: true,
    isRequired: true,
    showInAdmissionForm: true,
    departmentIds: [] as string[],
    boardingTypes: [] as string[]
  });

  // Queries
  const feeQuery = useQuery(feeTypesQueryOptions);
  const deptQuery = useQuery(departmentsQueryOptions);
  const boardingQuery = useQuery(boardingTypesQueryOptions);

  // Mutations
  const upsertMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = selectedId 
        ? await updateFeeType(selectedId, payload)
        : await createFeeType(payload);
      if (!res.success) throw new Error(res.error || 'সেভ করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success(selectedId ? 'সফলভাবে আপডেট করা হয়েছে' : 'নতুন ফি যুক্ত করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures() });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteFeeType(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures() });
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const feeTypes = feeQuery.data?.success ? (feeQuery.data.feeTypes as any[]) : [];
  const departments = deptQuery.data?.success ? (deptQuery.data.departments as any[]) : [];
  const boardingTypes = boardingQuery.data?.success ? (boardingQuery.data.boardingTypes as any[]) : [];

  const filteredFeeTypes = useMemo(() => {
    if (!searchTerm) return feeTypes;
    return feeTypes.filter(f => 
      (f.nameBn || f.feeNameBn || '').includes(searchTerm) || 
      (f.code || f.feeCode || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [feeTypes, searchTerm]);

  const handleOpenAdd = () => {
    setSelectedId(null);
    setFormData({
      name: '',
      nameBn: '',
      code: '',
      category: 'monthly',
      defaultAmount: 0,
      isActive: true,
      isRequired: true,
      showInAdmissionForm: true,
      departmentIds: [],
      boardingTypes: []
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedId(item.$id);
    setFormData({
      name: item.name || item.feeName || '',
      nameBn: item.nameBn || item.feeNameBn || '',
      code: item.code || item.feeCode || '',
      category: item.category || item.feeCategory || 'monthly',
      defaultAmount: item.defaultAmount || 0,
      isActive: item.isActive ?? true,
      isRequired: item.isRequired ?? true,
      showInAdmissionForm: item.showInAdmissionForm ?? true,
      departmentIds: item.departmentIds || item.applicableDepartments || [],
      boardingTypes: item.boardingTypes || item.applicableBoardingTypes || []
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nameBn || !formData.code) {
      toast.error('বাংলা নাম এবং কোড আবশ্যক');
      return;
    }

    const payload = {
      name: formData.name,
      nameBn: formData.nameBn,
      code: formData.code,
      category: formData.category,
      defaultAmount: Number(formData.defaultAmount),
      isActive: formData.isActive,
      isRequired: formData.isRequired,
      showInAdmissionForm: formData.showInAdmissionForm,
      departmentIds: formData.departmentIds,
      boardingTypes: formData.boardingTypes,
      billingCycle: formData.category === 'monthly' ? 'monthly' : 'one-time',
      applicableTo: 'student'
    };

    upsertMutation.mutate(payload);
  };

  const handleDelete = (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এটি মুছতে চান?')) return;
    deleteMutation.mutate(id);
  };

  const toggleSelection = (list: string[], val: string, field: 'departmentIds' | 'boardingTypes') => {
    const newList = list.includes(val) ? list.filter(x => x !== val) : [...list, val];
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  const toBn = (num: any) => {
    if (num === null || num === undefined) return '---';
    const formatted = Number(num).toLocaleString('en-IN');
    return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 solaiman-lipi">
      {/* Premium Header Container */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AEEF] to-[#0081B1] rounded-md blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 rounded-md border border-zinc-100 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-md bg-gradient-to-br from-[#00AEEF] to-[#0081B1] p-0.5 shadow-lg shadow-cyan-500/10">
              <div className="h-full w-full rounded-md bg-white dark:bg-zinc-900 flex items-center justify-center">
                <Banknote className="h-7 w-7 text-[#00AEEF]" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-2">ফি কাঠামো ব্যবস্থাপনা</h1>
              <p className="text-xs text-zinc-500 font-medium">প্রতিষ্ঠানের সকল ফি এবং চার্জের ডিজিটাল সেটআপ কনফিগার করুন</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="খুঁজুন..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 h-11 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium py-0"
              />
            </div>
            <Button 
              onClick={handleOpenAdd}
              className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-6 h-11 kalpurush-font font-black shadow-lg shadow-cyan-500/10 transition-all hover:scale-[1.02] active:scale-95 border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> নতুন ফি যোগ করুন
            </Button>
          </div>
        </div>
      </div>

      {/* Stats/Summary Row (Optional/Visual Only for Premium Feel) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'মোট ফি ধরণ', value: feeTypes.length, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'সক্রিয় ফি', value: feeTypes.filter(f => f.isActive).length, icon: Check, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
          { label: 'ভর্তি ফরম ফি', value: feeTypes.filter(f => f.showInAdmissionForm).length, icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-md border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 group hover:border-[#00AEEF]/30 transition-colors shadow-sm">
            <div className={cn("h-10 w-10 rounded-md flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{stat.label}</p>
              <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">{toBn(stat.value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md shadow-lg overflow-hidden min-h-[450px]">
        {feeQuery.isLoading ? (
           <div className="p-10 space-y-4">
             {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-md" />)}
           </div>
        ) : filteredFeeTypes.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-32 text-center space-y-6">
              <div className="h-28 w-28 rounded-md bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center animate-pulse">
                 <CreditCard className="h-12 w-12 text-zinc-200 dark:text-zinc-700" />
              </div>
              <div className="space-y-2">
                <p className="kalpurush-font text-xl font-black text-zinc-400">কোনো ফি কাঠামো খুঁজে পাওয়া যায়নি</p>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">নির্দিষ্ট ফিল্টার বা সার্চ অনুযায়ী কোনো ডাটা নেই। নতুন ফি যুক্ত করতে বা সার্চ কীওয়ার্ড পরিবর্তন করুন।</p>
              </div>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/30">
                <TableRow className="border-zinc-100 dark:border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="kalpurush-font font-black text-zinc-400 py-6 pl-8 uppercase text-[10px] tracking-widest leading-none">কোড ও নাম</TableHead>
                  <TableHead className="kalpurush-font font-black text-zinc-400 py-6 uppercase text-[10px] tracking-widest leading-none">ক্যাটেগরি</TableHead>
                  <TableHead className="kalpurush-font font-black text-zinc-400 py-6 uppercase text-[10px] tracking-widest leading-none">ডিফল্ট পরিমাণ</TableHead>
                  <TableHead className="kalpurush-font font-black text-zinc-400 py-6 uppercase text-[10px] tracking-widest leading-none text-center">স্ট্যাটাস</TableHead>
                  <TableHead className="py-6 w-40"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeeTypes.map((item) => (
                  <TableRow key={item.$id} className="border-zinc-50 dark:border-zinc-800/30 hover:bg-[#00AEEF]/[0.02] dark:hover:bg-[#00AEEF]/[0.05] transition-all group">
                    <TableCell className="py-5 pl-7">
                      <div className="flex flex-col">
                        <p className="font-bold text-zinc-800 dark:text-zinc-100 kalpurush-font text-base leading-tight mb-1">
                          {item.nameBn || item.feeNameBn}
                        </p>
                        <div className="flex items-center gap-2">
                           <p className="text-[9px] uppercase font-mono tracking-wider text-[#00AEEF] font-black bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded-sm">
                            {item.code || item.feeCode}
                          </p>
                          {item.isRequired && (
                            <span className="text-[9px] font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-2.5 w-2.5" /> বাধ্যতামূলক
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge variant="outline" className={cn("rounded-md px-3 py-1 text-[10px] font-black border uppercase tracking-wider", CATEGORY_COLORS[item.category || item.feeCategory] || CATEGORY_COLORS.other)}>
                        {CATEGORY_LABELS[item.category || item.feeCategory] || 'অজানা'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tighter">
                          ৳{toBn(item.defaultAmount || 0)}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight italic">Regular Price</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <div className="flex items-center justify-center">
                        <div className={cn(
                          "h-8 w-8 rounded-md flex items-center justify-center transition-all shadow-sm",
                          item.isActive 
                            ? "bg-cyan-50 text-[#00AEEF] dark:bg-[#00AEEF]/10" 
                            : "bg-zinc-50 text-zinc-300 dark:bg-zinc-800"
                        )}>
                           <Check className={cn("h-4 w-4", !item.isActive && "opacity-20")} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 pr-7 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          className="h-10 w-10 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-[#00AEEF] transition-all border border-transparent hover:border-cyan-100 dark:hover:border-cyan-500/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(item.$id)}
                          className="h-10 w-10 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending && deleteMutation.variables === item.$id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="h-4.5 w-4.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl kalpurush-font p-0 overflow-hidden rounded-md border-0 sm:max-h-[90vh] flex flex-col shadow-2xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
          <DialogHeader className="p-8 bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-md bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20">
                <Settings className="h-7 w-7 text-[#00AEEF]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedId ? 'ফি এডিট করুন' : 'নতুন ফি সেটআপ'}</DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] mt-1 uppercase tracking-wider">Fee Type Configuration Wizard</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">ফি কোড (একক কোড)</Label>
                <Input 
                  placeholder="যেমন: FORM-FEE" 
                  value={formData.code}
                  onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="h-12 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent focus:ring-[#00AEEF] transition-all font-mono font-black text-base dark:text-[#00AEEF]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">ক্যাটেগরি নির্বাচন</Label>
                <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="h-12 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent font-black px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="kalpurush-font rounded-md p-1 border-zinc-100 dark:border-zinc-800 shadow-xl">
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="rounded-sm py-2.5 px-3 font-black text-zinc-700 dark:text-zinc-300 focus:bg-cyan-50 dark:focus:bg-cyan-500/10">
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">নাম (বাংলা)</Label>
                 <Input 
                  placeholder="যেমন: মেইন সেশন ফি" 
                  value={formData.nameBn}
                  onChange={e => setFormData(p => ({ ...p, nameBn: e.target.value }))}
                  className="h-12 rounded-md font-black text-base"
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">Name (English)</Label>
                 <Input 
                  placeholder="Admission Fee" 
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="h-12 rounded-md font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight text-xs"
                 />
              </div>

              <div className="space-y-2 md:col-span-2">
                 <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-[#00AEEF] pl-1">ডিফল্ট ফি পরিমাণ (৳)</Label>
                 <div className="relative group/input">
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-emerald-500">৳</span>
                   <Input 
                    type="number"
                    value={formData.defaultAmount}
                    onChange={e => setFormData(p => ({ ...p, defaultAmount: Number(e.target.value) }))}
                    className="h-14 pl-10 rounded-md font-mono text-3xl font-black bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100/50 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-right pr-6 transition-all focus:ring-emerald-500/30"
                   />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                 <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-md border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100/50">
                   <div className="space-y-0.5">
                     <p className="text-xs font-black uppercase tracking-tight">Active Status</p>
                     <p className="text-[10px] text-zinc-400 font-bold uppercase italic">সক্রিয় স্ট্যাটাস</p>
                   </div>
                   <Switch checked={formData.isActive} onCheckedChange={c => setFormData(p => ({ ...p, isActive: c }))} className="data-[state=checked]:bg-[#00AEEF] scale-90" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-md border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100/50">
                   <div className="space-y-0.5">
                     <p className="text-xs font-black uppercase tracking-tight">Mandatory Fee</p>
                     <p className="text-[10px] text-zinc-400 font-bold uppercase italic">বাধ্যতামূলক ফি</p>
                   </div>
                   <Switch checked={formData.isRequired} onCheckedChange={c => setFormData(p => ({ ...p, isRequired: c }))} className="data-[state=checked]:bg-rose-500 scale-90" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-md border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100/50 col-span-2">
                   <div className="space-y-0.5">
                     <p className="text-xs font-black uppercase tracking-tight font-outfit">Show in Admission Form</p>
                     <p className="text-[10px] text-zinc-400 font-bold uppercase italic font-outfit">ভর্তি ফরমে ফি আইটেমটি প্রদর্শিত হবে</p>
                   </div>
                   <Switch checked={formData.showInAdmissionForm} onCheckedChange={c => setFormData(p => ({ ...p, showInAdmissionForm: c }))} className="data-[state=checked]:bg-indigo-500 scale-90" />
                 </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <div className="flex items-center gap-2">
                 <div className="h-4 w-1 bg-[#00AEEF] rounded-full" />
                 <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">প্রযোজ্য বিভাগ সমূহ (Department Targeting)</Label>
               </div>
               <div className="flex flex-wrap gap-2">
                 {departments.map(d => (
                   <button
                    key={d.$id}
                    type="button"
                    onClick={() => toggleSelection(formData.departmentIds, d.code || d.$id, 'departmentIds')}
                    className={cn(
                      "px-4 py-2 rounded-md border text-[11px] font-black transition-all transform active:scale-95 shadow-sm",
                      formData.departmentIds.includes(d.code || d.$id)
                        ? "bg-[#00AEEF] border-[#00AEEF] text-white shadow-[#00AEEF]/20"
                        : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 hover:border-[#0081B1]/50"
                    )}
                   >
                     {d.nameBn || d.name}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <div className="h-4 w-1 bg-indigo-500 rounded-full" />
                 <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">প্রযোজ্য আবাসিক ধরণ (Residential Eligibility)</Label>
               </div>
               <div className="flex flex-wrap gap-2">
                 {boardingTypes.map(b => (
                   <button
                    key={b.$id}
                    type="button"
                    onClick={() => toggleSelection(formData.boardingTypes, b.$id, 'boardingTypes')}
                    className={cn(
                      "px-4 py-2 rounded-md border text-[11px] font-black transition-all transform active:scale-95 shadow-sm",
                      formData.boardingTypes.includes(b.$id)
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-500/20"
                        : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 hover:border-indigo-400/50"
                    )}
                   >
                     {b.nameBn || b.name}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/50 gap-3">
             <Button 
               variant="ghost" 
               type="button"
               onClick={() => setIsDialogOpen(false)}
               className="rounded-md px-8 h-12 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900"
               disabled={upsertMutation.isPending}
             >
               বাতিল
             </Button>
             <Button
               type="button"
               onClick={handleSave}
               disabled={upsertMutation.isPending}
               className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-12 h-12 font-black uppercase text-[10px] tracking-[0.1em] shadow-xl shadow-cyan-500/10 active:scale-95 transition-all flex items-center gap-2"
             >
               {upsertMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
               {selectedId ? 'পরিবর্তন সেভ করুন' : 'ফি কনফিগার করুন'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
