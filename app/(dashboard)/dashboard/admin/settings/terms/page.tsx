'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ScrollText,
  Plus,
  Edit,
  Save,
  X,
  Trash2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Settings2
} from 'lucide-react';
import {
  useDesignations,
  useAllTerms,
  useSaveTerms,
  useInvalidateTermsCache,
} from '@/lib/hooks/use-terms';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Designation {
  $id?: string;
  designation_id?: string;
  label_bn: string;
  label_en: string;
  category: string;
  has_terms: boolean;
}

export default function TermsManagementPage() {
  const { data: designationsData, isLoading: designationsLoading } = useDesignations();
  const designations = designationsData?.documents || [];
  const { data: termsRaw = { documents: [] }, isLoading: termsLoading } = useAllTerms();

  const termsData: Record<string, any> = {};
  try {
    for (const doc of termsRaw.documents || []) {
      if (doc?.designation_id && doc.$id) {
        let sections: any[] = [];
        if (typeof doc.sections === 'string' && doc.sections) {
          try {
            sections = JSON.parse(doc.sections);
          } catch {
            sections = [];
          }
        } else if (Array.isArray(doc.sections)) {
          sections = doc.sections;
        }
        termsData[doc.designation_id] = {
          $id: doc.$id,
          title: doc.title,
          isActive: doc.isActive,
          sections,
        };
      }
    }
  } catch (e) {
    console.error('Error processing terms:', e);
  }

  const saveTermsMutation = useSaveTerms();
  const invalidateCache = useInvalidateTermsCache();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    designationId: '',
    designationName: '',
    title: '',
    sections: [{ title: '', content: [''] }],
    isActive: true,
  });

  const loading = designationsLoading || termsLoading;

  const getDesId = (des: Designation): string => des.$id || des.designation_id || '';

  useEffect(() => {
    if (designations.length > 0 && !loading) {
      setExpandedSections({ [getDesId(designations[0])]: true });
    }
  }, [designations, loading]);

  const toggleSection = (designationId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [designationId]: !prev[designationId],
    }));
  };

  const openAddModal = (designation?: Designation) => {
    if (designation) {
      const desId = getDesId(designation);
      const desLabel = designation.label_bn || designation.label_en || desId;
      setEditingDesignation(desId);
      setFormData({
        designationId: desId,
        designationName: desLabel,
        title: termsData[desId]?.title || '',
        sections: termsData[desId]?.sections || [{ title: '', content: [''] }],
        isActive: true,
      });
    } else {
      setEditingDesignation('new');
      setFormData({
        designationId: '',
        designationName: '',
        title: '',
        sections: [{ title: '', content: [''] }],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: [''] }],
    }));
  };

  const updateSection = (index: number, field: 'title' | 'content', value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addContentLine = (sectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex ? { ...s, content: [...s.content, ''] } : s
      ),
    }));
  };

  const updateContentLine = (sectionIndex: number, lineIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, content: s.content.map((c, li) => (li === lineIndex ? value : c)) }
          : s
      ),
    }));
  };

  const removeContentLine = (sectionIndex: number, lineIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, content: s.content.filter((_, li) => li !== lineIndex) }
          : s
      ),
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.designationId && editingDesignation === 'new') {
      toast.error('পদ নির্বাচন করুন!');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('শিরোনাম আবশ্যক!');
      return;
    }

    try {
      await saveTermsMutation.mutateAsync({
        designationId: formData.designationId,
        title: formData.title,
        sections: formData.sections,
        isActive: formData.isActive,
      });

      toast.success(`সাফল্যের সাথে সেভ করা হয়েছে! ✅`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving terms:', error);
      toast.error('সেভ করতে সমস্যা হয়েছে!');
    }
  };

  const filteredDesignations = designations.filter(
    des =>
      des.label_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      des.label_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedDesignations = filteredDesignations.reduce(
    (acc, des) => {
      const cat = des.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(des);
      return acc;
    },
    {} as Record<string, Designation[]>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 solaimanlipi-font pb-20">

      {/* ══════════════ HEADER ══════════════ */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-10 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ScrollText className="h-8 w-8 text-white" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] font-black uppercase text-[#00AEEF] border-[#00AEEF]/30 bg-[#00AEEF]/5">Compliance Suite</Badge>
              </div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                নিয়ম ও শর্তাবলী
              </h1>
              <p className="mt-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest max-w-lg">
                প্রতিটি পদের জন্য আলাদা টিভিসি এবং প্রশাসনিক নীতিমালা পরিচালনা করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={invalidateCache}
              className="h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 font-bold border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              রিফ্রেশ
            </Button>
            <Button
              onClick={() => openAddModal()}
              className="h-10 rounded-lg bg-[#00AEEF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" /> নতুন যোগ করুন
            </Button>
          </div>
        </div>
      </div>

      {/* ══════════════ SEARCH ══════════════ */}
      <div className="relative group">
        <Input
          placeholder="নির্দিষ্ট পদ খুঁজুন... (যেমন: শিক্ষক, স্টাফ)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-12 h-14 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-lg font-medium shadow-sm group-hover:border-[#00AEEF]/50 transition-all focus:ring-2 focus:ring-[#00AEEF]/20"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-hover:text-[#00AEEF] transition-colors" />
      </div>

      {/* ══════════════ TERMS LIST ══════════════ */}
      <div className="space-y-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : Object.keys(groupedDesignations).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <ScrollText className="h-16 w-16 text-zinc-200 dark:text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-bold">কোনো শর্তাবলী পাওয়া যায়নি</p>
          </div>
        ) : (
          (Object.entries(groupedDesignations) as [string, Designation[]][]).map(([category, desList]) => {
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-1.5 w-6 rounded-full bg-[#00AEEF]/50" />
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    {category}
                  </h3>
                </div>

                {desList.map((des: Designation) => {
                  const desId = getDesId(des);
                  const terms = termsData[desId];
                  const isExpanded = expandedSections[desId];

                  return (
                    <Card key={desId} className={cn(
                      "overflow-hidden border transition-all duration-300 group",
                      isExpanded
                        ? "border-[#00AEEF]/30 shadow-xl shadow-[#00AEEF]/5 bg-white dark:bg-zinc-900"
                        : "border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}>
                      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-4">
                        <button
                          onClick={() => toggleSection(desId)}
                          className="flex items-center gap-4 flex-1 text-left"
                        >
                          <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                            terms ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                          )}>
                            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                                {des.label_bn}
                              </h4>
                              {terms ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-zinc-300" />
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{des.label_en}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-300" />
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-tight",
                                terms ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"
                              )}>
                                {terms ? 'কনফিগ করা আছে' : 'শর্তাবলী যুক্ত নেই'}
                              </span>
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); openAddModal(des); }}
                            className="h-10 rounded-lg text-xs font-black uppercase tracking-widest gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#00AEEF] hover:text-white transition-all shadow-sm"
                          >
                            <Edit className="h-4 w-4" /> {terms ? 'সম্পাদনা' : 'তৈরি করুন'}
                          </Button>
                        </div>
                      </div>

                      {isExpanded && terms && (
                        <div
                          className="bg-zinc-50/50 dark:bg-zinc-950/20"
                        >
                          <CardContent className="pt-0 px-8 pb-8 space-y-6">
                            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 mb-6" />

                            <div className="bg-[#00AEEF]/10 border border-[#00AEEF]/20 p-4 rounded-xl flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#00AEEF] uppercase tracking-[0.2em]">Active Policy Title</span>
                              <span className="text-[15px] font-black text-zinc-900 dark:text-zinc-50">{terms.title}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {terms.sections?.map((section: any, idx: number) => (
                                <div key={idx} className="space-y-3 bg-white dark:bg-zinc-900/50 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:border-[#00AEEF]/30">
                                  <h5 className="font-black text-zinc-900 dark:text-[#00AEEF] flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#00AEEF]" />
                                    {section.title}
                                  </h5>
                                  <ul className="space-y-2.5">
                                    {section.content?.map((item: string, itemIdx: number) => (
                                      <li key={itemIdx} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        <span className="text-[#00AEEF]/40">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      )}
                      {isExpanded && !terms && (
                        <div className="px-8 pb-8">
                          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/30">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">এই পদের জন্য কোনো শর্তাবলী নেই</p>
                            <Button onClick={() => openAddModal(des)} className="bg-[#00AEEF] text-white font-bold px-8">প্রস্তুত করুন</Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ══════════════ EDITOR MODAL ══════════════ */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={cn(
          "w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto solaimanlipi-font rounded-2xl border-none shadow-2xl p-0",
          "bg-white dark:bg-zinc-950"
        )}>
          <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center">
                  <Settings2 className="h-6 w-6 text-[#00AEEF]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                    {editingDesignation === 'new' ? 'নতুন নীতিমালা' : 'নীতিমালা সম্পাদনা'}
                  </DialogTitle>
                  <DialogDescription className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    {formData.designationName || 'পদ নির্বাচন করুন'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editingDesignation === 'new' && (
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-zinc-400 tracking-widest">টার্গেট পদ *</Label>
                  <Select
                    value={formData.designationId}
                    onValueChange={value => setFormData({ ...formData, designationId: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold">
                      <SelectValue placeholder="পদ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map(des => (
                        <SelectItem key={getDesId(des)} value={getDesId(des)} className="font-bold">
                          {des.label_bn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3 md:col-span-2">
                <Label className="text-xs font-black uppercase text-zinc-400 tracking-widest">নীতিমালার প্রধান শিরোনাম *</Label>
                <Input
                  placeholder="যেমন: আবাসিক ব্যবস্থাপনা সংক্রান্ত নীতিমালা"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-lg font-black tracking-tight"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">অনুচ্ছেদ সমূহ</h5>
                <Button type="button" size="sm" variant="outline" onClick={addSection} className="h-9 rounded-lg border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white transition-all gap-2 font-bold">
                  <Plus className="h-4 w-4" /> অনুচ্ছেদ যোগ করুন
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {formData.sections.map((section, sectionIdx) => (
                  <Card key={sectionIdx} className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="bg-zinc-100/50 dark:bg-zinc-800/50 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">section #{sectionIdx + 1}</span>
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeSection(sectionIdx)} className="text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <Input
                        placeholder="অনুচ্ছেদের শিরোনাম"
                        value={section.title}
                        onChange={e => updateSection(sectionIdx, 'title', e.target.value)}
                        className="h-10 border-none bg-zinc-50 dark:bg-zinc-950 font-black text-[#00AEEF] placeholder:text-zinc-300"
                      />

                      <div className="space-y-3">
                        {section.content.map((line, lineIdx) => (
                          <div key={lineIdx} className="flex items-center gap-3 group">
                            <div className="h-6 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800 group-focus-within:bg-[#00AEEF] transition-colors" />
                            <Input
                              placeholder="বিষয়ের বর্ণনা লিখুন"
                              value={line}
                              onChange={e => updateContentLine(sectionIdx, lineIdx, e.target.value)}
                              className="h-9 border-none bg-transparent shadow-none font-medium px-0 text-zinc-600 dark:text-zinc-400 focus-visible:ring-0 text-[13px]"
                            />
                            <Button type="button" size="sm" variant="ghost" onClick={() => removeContentLine(sectionIdx, lineIdx)} className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-3.5 w-3.5 text-zinc-400 hover:text-rose-500" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button type="button" size="sm" variant="link" onClick={() => addContentLine(sectionIdx)} className="p-0 text-[#00AEEF] font-bold text-xs gap-1 hover:no-underline hover:text-blue-600">
                        <Plus className="h-3 w-3" /> পয়েন্ট যোগ করুন
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#00AEEF]/5 border border-[#00AEEF]/10">
              <Switch checked={formData.isActive} onCheckedChange={checked => setFormData({ ...formData, isActive: checked })} />
              <div>
                <Label className="text-sm font-black text-zinc-900 dark:text-zinc-100 block">নীতিমালা সক্রিয় করুন</Label>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mt-0.5 tracking-tight">Active policies will be visible on enrollment forms</p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="h-12 px-8 rounded-xl font-bold border-zinc-200 dark:border-zinc-800 text-zinc-500">বাতিল</Button>
            <Button onClick={handleSave} className="h-12 px-8 rounded-xl bg-[#00AEEF] hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 gap-2">
              <Save className="h-4 w-4" /> নীতিমালা সেভ করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
