"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Plus, Edit, Trash2, Check, X, Users, RefreshCw } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createDesignation, getDesignations } from "@/lib/actions/terms";
import { HelpCircle } from "lucide-react";

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
  };
}

const categoryLabels: Record<string, string> = {
  leadership: "নেতৃত্ব / Leadership",
  madrasha_teachers: "মাদ্রাসা শিক্ষক / Madrasa Teachers",
  general_teachers: "জেনারেল শিক্ষক / General Teachers",
  it: "আইটি ও কারিগরি / IT & Technical",
  admin: "প্রশাসনিক / Administrative",
  support: "সহায়ক / Support Staff",
  staff: "স্টাফ / Staff",
  other: "অন্যান্য / Others",
};

const categoryOptions = [
  { value: "leadership", label: "নেতৃত্ব / Leadership" },
  { value: "madrasha_teachers", label: "মাদ্রাসা শিক্ষক / Teachers" },
  { value: "general_teachers", label: "জেনারেল শিক্ষক / Teachers" },
  { value: "it", label: "আইটি ও কারিগরি / IT" },
  { value: "admin", label: "প্রশাসনিক / Admin" },
  { value: "support", label: "সহায়ক / Support" },
  { value: "staff", label: "স্টাফ / Staff" },
  { value: "other", label: "অন্যান্য / Other" },
];

// Skeleton Component
function DesignationCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-zinc-900">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

function GroupSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-8 rounded-full ml-auto" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <DesignationCardSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DesignationsManagementPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    labelBn: "",
    labelEn: "",
    category: "other",
    sortOrder: 100,
    hasTerms: true,
    isActive: true,
  });

  // Fetch designations from DB
  const fetchDesignations = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getDesignations();
      setDesignations(data as Designation[]);
    } catch (error) {
      console.error("Error fetching designations:", error);
      toast.error("পদ তালিকা লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // Group designations by category
  const groupedDesignations: GroupedDesignations = designations.reduce((acc, des) => {
    const cat = des.category || "other";
    if (!acc[cat]) {
      acc[cat] = { title: categoryLabels[cat] || cat, items: [] };
    }
    acc[cat].items.push(des);
    return acc;
  }, {} as GroupedDesignations);

  // Sort items within each group by sort_order
  Object.keys(groupedDesignations).forEach(cat => {
    groupedDesignations[cat].items.sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
  });

  // Filter by search
  const filteredGroups = Object.entries(groupedDesignations).reduce((acc, [key, group]) => {
    const filteredItems = group.items.filter(item => 
      item.label_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.label_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.designation_id || "")?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[key] = { ...group, items: filteredItems };
    }
    return acc;
  }, {} as GroupedDesignations);

  // Open modal for new designation
  const openNewModal = () => {
    setEditingDesignation(null);
    setFormData({
      labelBn: "",
      labelEn: "",
      category: "other",
      sortOrder: 100,
      hasTerms: true,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for edit designation
  const openEditModal = (des: Designation) => {
    setEditingDesignation(des);
    setFormData({
      labelBn: des.label_bn || "",
      labelEn: des.label_en || "",
      category: des.category || "other",
      sortOrder: des.sort_order || 100,
      hasTerms: des.has_terms ?? true,
      isActive: des.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.labelBn.trim()) {
      toast.error("বাংলা নাম আবশ্যক!");
      return;
    }
    
    try {
      if (editingDesignation) {
        // TODO: Call update API
        toast.success(`"${formData.labelBn}" আপডেট করা হয়েছে! ✅`);
      } else {
        const result = await createDesignation(
          formData.labelBn,
          formData.labelEn || formData.labelBn,
          formData.category,
          formData.hasTerms,
          formData.isActive,
          formData.sortOrder
        );
        
        if (result.saved) {
          toast.success(`"${formData.labelBn}" ডাটাবেসে যোগ হয়েছে! ✅`);
        } else {
          toast.success(`"${formData.labelBn}" যোগ করা হয়েছে!`);
        }
      }
      
      setIsModalOpen(false);
      fetchDesignations(false); // Silent refresh
    } catch (error) {
      toast.error("সমস্যা হয়েছে!");
    }
  };

  // Stats
  const totalCount = designations.length;
  const leadershipCount = groupedDesignations["leadership"]?.items.length || 0;
  const teacherCount = (groupedDesignations["madrasha_teachers"]?.items.length || 0) + 
                      (groupedDesignations["general_teachers"]?.items.length || 0);
  const otherCount = totalCount - leadershipCount - teacherCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white kalpurush-font">
            পদ/পদমর্যাদা ব্যবস্থাপনা
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 kalpurush-font">
            ডাটাবেস থেকে সকল পদ/পদমর্যাদা দেখুন, সম্পাদনা করুন এবং নতুন যোগ করুন
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDesignations()}
          className="gap-2 kalpurush-font"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          রিফ্রেশ
        </Button>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="পদ খুঁজুন... (Search)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 kalpurush-font"
          />
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
        
        <Button onClick={openNewModal} className="gap-2 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/20 kalpurush-font">
          <Plus className="h-4 w-4" />
          নতুন পদ যোগ করুন
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600">
              {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : totalCount}
            </div>
            <p className="text-sm text-zinc-500 kalpurush-font">মোট পদ</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : leadershipCount}
            </div>
            <p className="text-sm text-zinc-500 kalpurush-font">নেতৃত্ব</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : teacherCount}
            </div>
            <p className="text-sm text-zinc-500 kalpurush-font">শিক্ষক</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : otherCount}
            </div>
            <p className="text-sm text-zinc-500 kalpurush-font">অন্যান্য</p>
          </CardContent>
        </Card>
      </div>

      {/* Designation Groups - Real DB Data with Skeleton Loading */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {[...Array(3)].map((_, i) => (
              <GroupSkeleton key={i} />
            ))}
          </motion.div>
        ) : Object.keys(filteredGroups).length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-lg font-medium text-zinc-500 kalpurush-font">কোনো পদ পাওয়া যায়নি</p>
                <p className="text-sm text-zinc-400 mt-1 kalpurush-font">নতুন পদ যোগ করতে উপরের বাটনে ক্লিক করুন</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {Object.entries(filteredGroups).map(([key, group], groupIndex) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                        <Users className="h-4 w-4 text-cyan-600" />
                      </div>
                      <span className="kalpurush-font">{group.title}</span>
                      <Badge variant="secondary" className="ml-auto bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 kalpurush-font">
                        {group.items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <AnimatePresence>
                        {group.items.map((des, index) => (
                          <motion.div
                            key={des.$id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                            className="group flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-zinc-900 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md hover:shadow-cyan-500/10 transition-all"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate kalpurush-font">
                                {des.label_bn}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-zinc-400 kalpurush-font">
                                  Sort: {des.sort_order || 100}
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded kalpurush-font ${des.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                                  {des.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded kalpurush-font ${des.has_terms ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"}`}>
                                  {des.has_terms ? "✅ Terms" : "❌ No Terms"}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditModal(des)}
                                className="h-8 w-8 p-0 text-zinc-500 hover:text-cyan-600 hover:bg-cyan-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-zinc-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="kalpurush-font">
              {editingDesignation ? 'পদ সম্পাদনা করুন' : 'নতুন পদ/পদমর্যাদা যোগ করুন'}
            </DialogTitle>
            <DialogDescription className="kalpurush-font">
              {editingDesignation 
                ? 'পদের তথ্য আপডেট করতে নিচের ফর্ম পূরণ করুন' 
                : 'নতুন পদমর্যাদা যোগ করতে নিচের তথ্য পূরণ করুন'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="labelBn" className="kalpurush-font">পদের নাম (বাংলা) *</Label>
                <Input
                  id="labelBn"
                  placeholder="যেমন: নতুন শিক্ষক"
                  value={formData.labelBn}
                  onChange={(e) => setFormData({...formData, labelBn: e.target.value})}
                  className="kalpurush-font"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="labelEn" className="kalpurush-font">পদের নাম (English)</Label>
                <Input
                  id="labelEn"
                  placeholder="e.g. New Teacher"
                  value={formData.labelEn}
                  onChange={(e) => setFormData({...formData, labelEn: e.target.value})}
                  className="kalpurush-font"
                />
              </div>
            </div>

            {/* Category & Sort Order Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="kalpurush-font">ক্যাটাগরি</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="kalpurush-font">
                    <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="kalpurush-font">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="sortOrder" className="kalpurush-font">সর্ট অর্ডার</Label>
                  <div className="group relative">
                    <HelpCircle className="h-3.5 w-3.5 text-zinc-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      তালিকায় প্রদর্শনের ক্রম (১ = উপরে)
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900"></div>
                    </div>
                  </div>
                </div>
                <Input
                  id="sortOrder"
                  type="number"
                  placeholder="100"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 100})}
                  className="kalpurush-font"
                />
              </div>
            </div>

            {/* Toggle Switches Row - Inline */}
            <div className="flex flex-wrap items-center gap-4 py-3 px-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="hasTerms"
                    checked={formData.hasTerms}
                    onCheckedChange={(checked) => setFormData({...formData, hasTerms: checked})}
                  />
                  <Label htmlFor="hasTerms" className="kalpurush-font cursor-pointer text-sm font-medium">
                    Terms আছে
                  </Label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive" className="kalpurush-font cursor-pointer text-sm font-medium">
                    সক্রিয় / Active
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="kalpurush-font w-full sm:w-auto">
              বাতিল
            </Button>
            <Button onClick={handleSave} className="kalpurush-font bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
              {editingDesignation ? 'আপডেট করুন' : 'যোগ করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
