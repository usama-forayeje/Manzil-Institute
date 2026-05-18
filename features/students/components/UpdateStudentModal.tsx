'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateStudentSchema, UpdateStudentValues } from '../schemas/update';
import { updateStudent } from '../api/service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { studentKeys } from '../api/queries';
import { StudentListItem } from '../types';
import { Loader2, User, Users, MapPin, Settings, GraduationCap, PhoneInfo as PhoneIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UpdateStudentModalProps {
  student: StudentListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateStudentModal({ student, isOpen, onClose }: UpdateStudentModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UpdateStudentValues>({
    resolver: zodResolver(updateStudentSchema) as any,
    defaultValues: {
      nameEn: '', nameBn: '', dateOfBirth: '', gender: 'male', bloodGroup: 'unknown',
      nationality: 'বাংলাদেশী', religion: 'islam', identificationType: 'bc', identificationNo: '', isHafiz: false,
      fatherNameEn: '', fatherNameBn: '', fatherOccupation: '', fatherWorkplace: '',
      motherNameEn: '', motherNameBn: '', motherOccupation: '', motherWorkplace: '',
      guardianPhone: '', whatsappNo: '', email: '', phonePrimary: '', address: '',
      presentVillage: '', presentPostOffice: '', presentThana: '', presentDistrict: '',
      status: 'active', boardingType: 'day', hallName: '', admissionDate: '',
      previousSchoolName: '', previousClassName: '', previousResult: '',
    },
  });

  React.useEffect(() => {
    if (student) {
      form.reset({
        nameEn: student.nameEn || student.name || '',
        nameBn: student.nameBn || '',
        dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
        gender: (student.gender as any) || 'male',
        bloodGroup: student.bloodGroup || 'unknown',
        nationality: student.nationality || 'বাংলাদেশী',
        religion: student.religion || 'islam',
        identificationType: student.identificationType || 'bc',
        identificationNo: student.identificationNo || student.barthCertNo || '',
        isHafiz: !!student.isHafiz,
        fatherNameEn: student.fatherNameEn || '',
        fatherNameBn: student.fatherNameBn || student.fatherName || '',
        fatherOccupation: student.fatherOccupation || '',
        fatherWorkplace: student.fatherWorkplace || '',
        motherNameEn: student.motherNameEn || '',
        motherNameBn: student.motherNameBn || student.motherName || '',
        motherOccupation: student.motherOccupation || '',
        motherWorkplace: student.motherWorkplace || '',
        guardianPhone: student.guardianPhone || '',
        whatsappNo: student.whatsappNo || '',
        email: student.email || '',
        phonePrimary: student.phonePrimary || student.phone || '',
        address: student.address || '',
        presentVillage: student.presentVillage || student.village || '',
        presentPostOffice: student.presentPostOffice || student.postOffice || '',
        presentThana: student.presentThana || student.upazila || '',
        presentDistrict: student.presentDistrict || student.district || '',
        status: (student.status as any) || 'active',
        boardingType: student.boardingType || 'day',
        hallName: student.hallName || student.roomPreference || '',
        admissionDate: student.admissionDate?.split('T')[0] || '',
        previousSchoolName: student.previousSchoolName || student.previousSchool || '',
        previousClassName: student.previousClassName || student.previousClass || '',
        previousResult: student.previousResult || '',
      });
    }
  }, [student, form]);

  const onSubmit = async (values: UpdateStudentValues) => {
    if (!student) return;
    setIsSubmitting(true);
    try {
      const res = await updateStudent(student.$id, values);
      if (res.success) {
        toast.success('শিক্ষার্থীর সব তথ্য সফলভাবে আপডেট করা হয়েছে');
        queryClient.invalidateQueries({ queryKey: studentKeys.all });
        onClose();
      } else {
        toast.error(res.error || 'আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      toast.error('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden rounded-[40px] border-zinc-200 dark:border-zinc-800 kalpurush-font flex flex-col shadow-2xl">
        <DialogHeader className="p-8 pb-6 border-b border-zinc-100 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl">
          <div className="flex items-center gap-5">
             <div className="h-14 w-14 rounded-2xl bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20">
                <Settings className="h-7 w-7 text-[#00AEEF]" />
             </div>
             <div className="space-y-1">
                <DialogTitle className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">এডমিশন ডাটা আপডেট</DialogTitle>
                <p className="text-xs font-bold text-zinc-400 english-text uppercase tracking-widest flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Full Admission Data Management Interface
                </p>
             </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-8 py-8">
               <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="w-full justify-start rounded-[20px] bg-zinc-100/50 dark:bg-zinc-900/50 p-1.5 mb-10 h-14 border border-zinc-200/50 dark:border-zinc-800/50">
                    <TabsTrigger value="personal" className="rounded-2xl font-bold flex gap-2 h-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-lg"><User className="h-4 w-4" /> ব্যক্তিগত</TabsTrigger>
                    <TabsTrigger value="parents" className="rounded-2xl font-bold flex gap-2 h-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-lg"><Users className="h-4 w-4" /> অভিভাবক</TabsTrigger>
                    <TabsTrigger value="academic" className="rounded-2xl font-bold flex gap-2 h-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-lg"><GraduationCap className="h-4 w-4" /> একাডেমিক</TabsTrigger>
                    <TabsTrigger value="contact" className="rounded-2xl font-bold flex gap-2 h-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-lg"><MapPin className="h-4 w-4" /> ঠিকানা</TabsTrigger>
                  </TabsList>

                  {/* 1. PERSONAL INFO */}
                  <TabsContent value="personal" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      <FormField control={form.control} name="nameEn" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">Name (English)</FormLabel><FormControl><Input {...field} className="form-input english-text" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="nameBn" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">নাম (বাংলা)</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">জন্ম তারিখ</FormLabel><FormControl><Input type="date" {...field} className="form-input english-text" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">লিঙ্গ</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="form-input"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl"><SelectItem value="male">পুরুষ (Male)</SelectItem><SelectItem value="female">মহিলা (Female)</SelectItem></SelectContent></Select><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">রক্তের গ্রুপ</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="form-input"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl">{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'].map(bg => (<SelectItem key={bg} value={bg}>{bg}</SelectItem>))}</SelectContent></Select><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="identificationType" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">আইডেন্টিটি টাইপ</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="form-input"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl"><SelectItem value="bc">জন্ম নিবন্ধন</SelectItem><SelectItem value="nid">এনআইডি (NID)</SelectItem></SelectContent></Select><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="identificationNo" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">আইডেন্টিটি নম্বর</FormLabel><FormControl><Input {...field} className="form-input english-text" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="isHafiz" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-900 p-4 pt-4 mt-2">
                          <div className="space-y-0.5"><FormLabel className="text-sm font-bold">হাফেজ শিক্ষার্থী?</FormLabel><p className="text-[10px] text-zinc-400">যদি শিক্ষার্থী কুরআনে হাফেজ হয়ে থাকে</p></div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  {/* 2. FAMILY INFO */}
                  <TabsContent value="parents" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                       {/* Father */}
                      <FormField control={form.control} name="fatherNameBn" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">পিতার নাম (বাংলা)</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="fatherOccupation" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">পিতার পেশা</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      {/* Mother */}
                      <FormField control={form.control} name="motherNameBn" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">মাতার নাম (বাংলা)</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="motherOccupation" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">মাতার পেশা</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      {/* Contact Parents */}
                      <FormField control={form.control} name="guardianPhone" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">অভিভাবকের ফোন</FormLabel><FormControl><Input {...field} className="form-input english-text" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="whatsappNo" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">হোয়াটসঅ্যাপ নম্বর</FormLabel><FormControl><Input {...field} className="form-input english-text" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  {/* 3. ACADEMIC INFO */}
                  <TabsContent value="academic" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                       <FormField control={form.control} name="admissionDate" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">ভর্তির তারিখ</FormLabel><FormControl><Input type="date" {...field} className="form-input english-text" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="boardingType" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">আবাসন টাইপ</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="form-input"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl">
                             <SelectItem value="day">অনাবাসিক (Day)</SelectItem><SelectItem value="residential">আবাসিক (Residential)</SelectItem><SelectItem value="boarding">বোর্ডিং (Boarding)</SelectItem>
                          </SelectContent></Select><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">বর্তমান স্ট্যাটাস</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="form-input"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl">
                             <SelectItem value="active">সক্রিয় (Active)</SelectItem><SelectItem value="inactive">নিষ্ক্রিয় (Inactive)</SelectItem><SelectItem value="graduated">উত্তীর্ণ (Graduated)</SelectItem>
                          </SelectContent></Select><FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="previousSchoolName" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel className="field-label">পূর্ববর্তী মাদরাসা/স্কুলের নাম</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  {/* 4. ADDRESS INFO */}
                  <TabsContent value="contact" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                       <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel className="field-label">পুরো ঠিকানা</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="presentPostOffice" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">পোস্ট অফিস</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="presentThana" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">থানা/উপজেলা</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="presentDistrict" render={({ field }) => (
                        <FormItem><FormLabel className="field-label">জেলা</FormLabel><FormControl><Input {...field} className="form-input" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </TabsContent>
               </Tabs>
            </ScrollArea>

            <DialogFooter className="p-10 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl">
              <Button type="button" variant="ghost" onClick={onClose} className="h-14 px-8 rounded-2xl border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-100/50">বন্ধ করুন</Button>
              <Button type="submit" disabled={isSubmitting} className="h-14 px-12 rounded-2xl bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-black shadow-2xl shadow-[#00AEEF]/30 hover:shadow-[#00AEEF]/50 transition-all active:scale-95">
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> সংরক্ষিত হচ্ছে...</>
                ) : (
                  'আপডেট ডাটা সেভ করুন'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <style jsx global>{`
        .field-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #71717a;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.15em;
            margin-bottom: 0.75rem;
        }
        .form-input {
            height: 3.5rem;
            border-radius: 1.25rem;
            border-width: 2px;
            border-color: #f4f4f5;
            background-color: transparent;
            font-weight: 500;
            transition: all 0.2s;
        }
        .dark .form-input {
            border-color: #18181b;
        }
        .form-input:focus {
            border-color: #00AEEF;
            box-shadow: 0 0 0 4px rgba(0, 174, 239, 0.1);
        }
      `}</style>
    </Dialog>
  );
}
