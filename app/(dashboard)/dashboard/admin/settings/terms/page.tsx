"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText, Plus, Edit, Save, X, Trash2, ChevronDown, ChevronRight, RefreshCw, Search } from "lucide-react";
import { getTermsByDesignation, getDesignations, saveTerms } from "@/lib/actions/terms";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Designation {
  $id?: string;
  designation_id?: string;
  label_bn: string;
  label_en: string;
  category: string;
  has_terms: boolean;
}

export default function TermsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [termsData, setTermsData] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    designationId: "",
    title: "",
    sections: [{ title: "", content: [""] }],
    isActive: true,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  // Helper to get designation ID
  const getDesId = (des: Designation): string => des.$id || des.designation_id || "";

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load designations
      const desData = await getDesignations();
      setDesignations(desData as Designation[]);
      
      // Load terms for each designation
      const terms: Record<string, any> = {};
      for (const des of desData as Designation[]) {
        const desId = getDesId(des);
        if (desId) {
          const termsResult = await getTermsByDesignation(desId);
          if (termsResult) {
            terms[desId] = termsResult;
          }
        }
      }
      setTermsData(terms);
      
      // Expand first designation by default
      if (desData.length > 0) {
        setExpandedSections({ [getDesId(desData[0])]: true });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (designationId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [designationId]: !prev[designationId]
    }));
  };

  const openAddModal = (designation?: Designation) => {
    if (designation) {
      const desId = getDesId(designation);
      setEditingDesignation(desId);
      setFormData({
        designationId: desId,
        title: termsData[desId]?.title || "",
        sections: termsData[desId]?.sections || [{ title: "", content: [""] }],
        isActive: true,
      });
    } else {
      setEditingDesignation("new");
      setFormData({
        designationId: "",
        title: "",
        sections: [{ title: "", content: [""] }],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: [""] }]
    }));
  };

  const updateSection = (index: number, field: 'title' | 'content', value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const addContentLine = (sectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => 
        i === sectionIndex 
          ? { ...s, content: [...s.content, ""] }
          : s
      )
    }));
  };

  const updateContentLine = (sectionIndex: number, lineIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => 
        i === sectionIndex 
          ? { ...s, content: s.content.map((c, li) => li === lineIndex ? value : c) }
          : s
      )
    }));
  };

  const removeContentLine = (sectionIndex: number, lineIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => 
        i === sectionIndex 
          ? { ...s, content: s.content.filter((_, li) => li !== lineIndex) }
          : s
      )
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!formData.designationId && editingDesignation === "new") {
      toast.error("পদ নির্বাচন করুন!");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Title আবশ্যক!");
      return;
    }
    
    try {
      const result = await saveTerms(
        formData.designationId,
        formData.title,
        formData.sections,
        formData.isActive
      );
      
      if (result.saved) {
        toast.success(`Terms ডাটাবেসে সেভ হয়েছে! ✅`);
      } else {
        toast.success(`Terms সেভ করা হয়েছে! (DB সংযুক্ত নেই)`);
      }
      
      setIsModalOpen(false);
      loadAllData();
    } catch (error) {
      console.error("Error saving terms:", error);
      toast.error("সমস্যা হয়েছে!");
    }
  };

  // Filter designations by search
  const filteredDesignations = designations.filter(des => 
    des.label_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    des.label_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedDesignations = filteredDesignations.reduce((acc, des) => {
    const cat = des.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(des);
    return acc;
  }, {} as Record<string, Designation[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white kalpurush-font">
            নিয়ম ও শর্তাবলী ব্যবস্থাপনা
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 kalpurush-font">
            প্রতিটি পদ/পদমর্যাদার জন্য আলাদা Terms & Conditions পরিচালনা করুন
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAllData()}
            className="gap-2 kalpurush-font"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            রিফ্রেশ
          </Button>
          <Button
            size="sm"
            onClick={() => openAddModal()}
            className="gap-2 kalpurush-font bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            নতুন Terms যোগ করুন
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="পদ খুঁজুন... (Search)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 kalpurush-font"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : Object.keys(groupedDesignations).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <ScrollText className="h-12 w-12 mx-auto text-zinc-300" />
              <p className="mt-4 text-zinc-500 kalpurush-font">কোনো পদ পাওয়া যায়নি</p>
              <p className="text-sm text-zinc-400 kalpurush-font">Designations page e পদ যোগ করুন</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedDesignations).map(([category, desList]) => {
            return (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider kalpurush-font">
                  {category}
                </h3>
                {desList.map((des) => {
                  const desId = getDesId(des);
                  const terms = termsData[desId];
                  const isExpanded = expandedSections[desId];
                  
                  return (
                    <Card key={desId} className="overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                      <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleSection(desId)}
                            className="flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 -m-2 rounded-lg transition-colors kalpurush-font flex-1"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-cyan-600" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-cyan-600" />
                            )}
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                              <ScrollText className="h-4 w-4 text-cyan-600" />
                            </div>
                            <span className="font-medium text-lg">{des.label_bn}</span>
                            {terms ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 kalpurush-font">
                                ✅ কনফিগ করা আছে
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 kalpurush-font">
                                ❌ নেই
                              </Badge>
                            )}
                          </button>
                          <Button
                            size="sm"
                            onClick={() => openAddModal(des)}
                            className="gap-2 kalpurush-font bg-cyan-600 hover:bg-cyan-700 ml-2"
                          >
                            <Edit className="h-4 w-4" />
                            {terms ? "সম্পাদনা করুন" : "যোগ করুন"}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <AnimatePresence>
                        {isExpanded && terms && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <CardContent className="pt-4 space-y-4">
                              <div className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-lg">
                                <Badge className="bg-cyan-600 kalpurush-font">{terms.title}</Badge>
                              </div>
                              
                              {terms.sections?.map((section: any, idx: number) => (
                                <div key={idx} className="space-y-2 border-l-2 border-cyan-200 dark:border-cyan-800 pl-4">
                                  <h4 className="font-bold text-cyan-700 dark:text-cyan-400 kalpurush-font">
                                    {section.title}
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {section.content?.map((item: string, itemIdx: number) => (
                                      <li key={itemIdx} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <span className="text-cyan-500">•</span>
                                        <span className="kalpurush-font">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="kalpurush-font">
              {editingDesignation === "new" ? "নতুন Terms যোগ করুন" : `${formData.designationId} - Terms সম্পাদনা করুন`}
            </DialogTitle>
            <DialogDescription className="kalpurush-font">
              Terms & Conditions যোগ বা আপডেট করুন
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Designation Selection (only for new) */}
            {editingDesignation === "new" && (
              <div className="grid gap-2">
                <Label className="kalpurush-font">পদ নির্বাচন করুন *</Label>
                <Select 
                  value={formData.designationId} 
                  onValueChange={(value) => setFormData({...formData, designationId: value})}
                >
                  <SelectTrigger className="kalpurush-font">
                    <SelectValue placeholder="পদ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((des) => (
                      <SelectItem key={getDesId(des)} value={getDesId(des)} className="kalpurush-font">
                        {des.label_bn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Title */}
            <div className="grid gap-2">
              <Label className="kalpurush-font">Title *</Label>
              <Input
                placeholder="যেমন: অধ্যক্ষ / প্রিন্সিপাল এর দায়িত্ব"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="kalpurush-font"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="kalpurush-font">সেকশন (Sections)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addSection}
                  className="gap-2 kalpurush-font"
                >
                  <Plus className="h-4 w-4" />
                  সেকশন যোগ করুন
                </Button>
              </div>

              {formData.sections.map((section, sectionIdx) => (
                <Card key={sectionIdx} className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`সেকশন ${sectionIdx + 1} এর শিরোনাম`}
                        value={section.title}
                        onChange={(e) => updateSection(sectionIdx, 'title', e.target.value)}
                        className="flex-1 kalpurush-font"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSection(sectionIdx)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Label className="text-xs text-zinc-500 kalpurush-font">বিষয়বস্তু (Content)</Label>
                    {section.content.map((line, lineIdx) => (
                      <div key={lineIdx} className="flex items-center gap-2">
                        <Input
                          placeholder={`বিষয় ${lineIdx + 1}`}
                          value={line}
                          onChange={(e) => updateContentLine(sectionIdx, lineIdx, e.target.value)}
                          className="flex-1 kalpurush-font text-sm"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeContentLine(sectionIdx, lineIdx)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addContentLine(sectionIdx)}
                      className="w-full gap-2 kalpurush-font"
                    >
                      <Plus className="h-4 w-4" />
                      বিষয় যোগ করুন
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 py-3 px-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive" className="kalpurush-font cursor-pointer">
                সক্রিয় / Active
              </Label>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="kalpurush-font w-full sm:w-auto">
              বাতিল
            </Button>
            <Button onClick={handleSave} className="kalpurush-font bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              সেভ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
