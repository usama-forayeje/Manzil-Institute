'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Users,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Settings2,
  HelpCircle,
  ShieldCheck,
  GraduationCap,
  Monitor,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  createDesignation,
  getDesignations,
  updateDesignation,
} from '@/lib/actions/terms';
import { cn, convertEnglishToBengali } from '@/lib/utils';

// Types
interface Designation {
  $id: string;
  designation_id?: string;
  label_bn: string;
  label_en: string;
  category: string;
  has_terms: boolean;
  is_active: boolean;
  sort_order: number;
}

interface GroupedDesignations {
  [category: string]: {
    title: string;
    items: Designation[];
    icon: any;
    color: string;
  };
}

const categoryConfig: Record<string, { title: string; icon: any; color: string }> = {
  leadership: { title: 'নেতৃত্ব', icon: ShieldCheck, color: 'text-amber-500' },
  madrasha_teachers: { title: 'মাদ্রাসা শিক্ষক', icon: GraduationCap, color: 'text-emerald-500' },
  general_teachers: { title: 'জেনারেল শিক্ষক', icon: GraduationCap, color: 'text-blue-500' },
  it: { title: 'আইটি ও কারিগরি', icon: Monitor, color: 'text-purple-500' },
  admin: { title: 'প্রশাসনিক', icon: LayoutDashboard, color: 'text-[#00AEEF]' },
  support: { title: 'সহায়ক স্টাফ', icon: Users, color: 'text-rose-500' },
  staff: { title: 'সাধারণ স্টাফ', icon: Users, color: 'text-zinc-500' },
  other: { title: 'অন্যান্য', icon: HelpCircle, color: 'text-zinc-400' },
};

const categoryOptions = Object.entries(categoryConfig).map(([value, config]) => ({
  value,
  label: `${config.title} / ${value.charAt(0).toUpperCase() + value.slice(1)}`
}));

export default function DesignationsManagementPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

  const [formData, setFormData] = useState({
    labelBn: '',
    labelEn: '',
    category: 'other',
    sortOrder: 100,
    hasTerms: true,
    isActive: true,
  });

  const fetchDesignations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getDesignations();
      setDesignations((data?.documents || []) as Designation[]);
    } catch (error) {
      toast.error('পদ তালিকা লোড করা যায়নি!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDesignations(); }, [fetchDesignations]);

  const groupedDesignations: GroupedDesignations = designations.reduce(
    (acc, des) => {
      const cat = des.category || 'other';
      if (!acc[cat]) {
        acc[cat] = {
          title: categoryConfig[cat]?.title || cat,
          items: [],
          icon: categoryConfig[cat]?.icon || HelpCircle,
          color: categoryConfig[cat]?.color || 'text-zinc-400'
        };
      }
      acc[cat].items.push(des);
      return acc;
    },
    {} as GroupedDesignations
  );

  // Sorting
  Object.keys(groupedDesignations).forEach(cat => {
    groupedDesignations[cat].items.sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
  });

  const filteredGroups = Object.entries(groupedDesignations).reduce(
    (acc, [key, group]) => {
      const filteredItems = group.items.filter(item =>
        item.label_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.label_en?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) acc[key] = { ...group, items: filteredItems };
      return acc;
    },
    {} as GroupedDesignations
  );

  const openModal = (des?: Designation) => {
    if (des) {
      setEditingDesignation(des);
      setFormData({
        labelBn: des.label_bn,
        labelEn: des.label_en || '',
        category: des.category || 'other',
        sortOrder: des.sort_order || 100,
        hasTerms: des.has_terms ?? true,
        isActive: des.is_active ?? true,
      });
    } else {
      setEditingDesignation(null);
      setFormData({
        labelBn: '',
        labelEn: '',
        category: 'other',
        sortOrder: 100,
        hasTerms: true,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.labelBn.trim()) return toast.error('পদের নাম টাইপ করুন!');
    try {
      if (editingDesignation) {
        await updateDesignation(editingDesignation.$id, formData);
        toast.success('আপডেট সাকসেসফুল! ✅');
      } else {
        await createDesignation(formData);
        toast.success('পদটি ডাটাবেসে যুক্ত হয়েছে! ✅');
      }
      setIsModalOpen(false);
      fetchDesignations(true);
    } catch (e) {
      toast.error('সমস্যা হয়েছে!');
    }
  };

  // Stats for the dashboard
  const stats = [
    { label: 'মোট পদ', val: convertEnglishToBengali(designations.length), color: '#00AEEF', icon: Users },
    { label: 'নেতৃত্ব', val: convertEnglishToBengali(designations.filter(d => d.category === 'leadership').length), color: '#f59e0b', icon: ShieldCheck },
    { label: 'শিক্ষক', val: convertEnglishToBengali(designations.filter(d => d.category.includes('teacher')).length), color: '#10b981', icon: GraduationCap },
    { label: 'সক্রিয়', val: convertEnglishToBengali(designations.filter(d => d.is_active).length), color: '#6366f1', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 solaimanlipi-font pb-20">

      {/* ══════════════ HEADER ══════════════ */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-10 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] font-black uppercase text-[#00AEEF] border-[#00AEEF]/30 bg-[#00AEEF]/5">HR & Roles</Badge>
              </div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                পদ ও পদমর্যাদা
              </h1>
              <p className="mt-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest max-w-lg">
                প্রতিষ্ঠানের সকল পদ এবং প্রশাসনিক রোল এখানে পরিচালনা করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDesignations()}
              className="h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 font-bold border-zinc-200 dark:border-zinc-700 gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              রিফ্রেশ
            </Button>
            <Button
              onClick={() => openModal()}
              className="h-10 rounded-lg bg-[#00AEEF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" /> নতুন পদ যোগ করুন
            </Button>
          </div>
        </div>
      </div>

      {/* ══════════════ STATS ══════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: s.color }} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                    {loading ? '...' : s.val}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-zinc-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ══════════════ SEARCH ══════════════ */}
      <div className="relative group">
        <Input
          placeholder="নির্দিষ্ট পদ খুঁজুন... (যেমন: শিক্ষক, প্রিন্সিপাল)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-12 h-14 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-lg font-medium shadow-sm group-hover:border-[#00AEEF]/50 transition-all focus:ring-2 focus:ring-[#00AEEF]/20"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-hover:text-[#00AEEF] transition-colors" />
      </div>

      {/* ══════════════ GROUPED LIST ══════════════ */}
      <div className="space-y-8">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
        ) : (
          Object.entries(filteredGroups).map(([key, group], groupIdx) => (
            <div
              key={key}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 px-1">
                <div className={cn("h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center", group.color)}>
                  <group.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none uppercase">{group.title}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{convertEnglishToBengali(group.items.length)} designations found</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((des, desIdx) => (
                  <Card key={des.$id} className="group relative overflow-hidden bg-white/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 hover:border-[#00AEEF]/30 hover:shadow-xl hover:shadow-[#00AEEF]/5 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate tracking-tight">{des.label_bn}</h4>
                            {!des.is_active && <Badge variant="secondary" className="text-[8px] bg-rose-500/10 text-rose-500 font-bold border-none uppercase h-4 px-1">Inactive</Badge>}
                          </div>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">{des.label_en}</p>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50">সিরিয়াল: {convertEnglishToBengali(des.sort_order)}</Badge>
                            <Badge variant="outline" className={cn(
                              "text-[9px] font-bold",
                              des.has_terms ? "text-[#00AEEF] border-[#00AEEF]/20 bg-[#00AEEF]/5" : "text-zinc-400 border-zinc-200"
                            )}>
                              {des.has_terms ? "✅ TOS Enabled" : "No Terms"}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openModal(des)}
                          className="h-10 w-10 p-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-[#00AEEF] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ══════════════ EDITOR MODAL ══════════════ */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={cn(
          "w-[95vw] max-w-[550px] solaimanlipi-font rounded-2xl border-none shadow-2xl p-0",
          "bg-white dark:bg-zinc-950"
        )}>
          <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center">
                  <Settings2 className="h-6 w-6 text-[#00AEEF]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                    {editingDesignation ? 'পদ সম্পাদনা' : 'নতুন পদ তৈরি'}
                  </DialogTitle>
                  <DialogDescription className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Manage designation details and roles
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-zinc-400 tracking-widest">পদের নাম (বাংলা) *</Label>
                <Input
                  value={formData.labelBn}
                  onChange={e => setFormData({ ...formData, labelBn: e.target.value })}
                  className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-zinc-400 tracking-widest">পদের নাম (English)</Label>
                <Input
                  value={formData.labelEn}
                  onChange={e => setFormData({ ...formData, labelEn: e.target.value })}
                  className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-zinc-400 tracking-widest">ক্যাটাগরি</Label>
                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-zinc-400 tracking-widest leading-none flex items-center gap-2">
                  সর্ট অর্ডার <HelpCircle className="h-3 w-3" />
                </Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 100 })}
                  className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <Label className="text-[13px] font-black">শর্তাবলী থাকবে?</Label>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Enable Terms of Service</span>
                </div>
                <Switch checked={formData.hasTerms} onCheckedChange={c => setFormData({ ...formData, hasTerms: c })} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <Label className="text-[13px] font-black">সক্রিয় স্ট্যাটাস</Label>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Is Role Active?</span>
                </div>
                <Switch checked={formData.isActive} onCheckedChange={c => setFormData({ ...formData, isActive: c })} />
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="h-12 px-8 rounded-xl font-black text-zinc-500 uppercase text-xs tracking-widest">বাতিল</Button>
            <Button onClick={handleSave} className="h-12 px-8 rounded-xl bg-[#00AEEF] hover:bg-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20">
              {editingDesignation ? 'আপডেট করুন' : 'তৈরি করুন'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
