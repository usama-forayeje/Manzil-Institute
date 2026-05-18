import React from 'react';
import { notFound } from 'next/navigation';
import { getStudent } from '@/lib/actions/student';
import StudentProfileView from '@/features/students/components/StudentProfileView';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

// ── Role-Based Access Check (Implicit in dashboard layout) ──

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getStudent(id);
  const student = res.student as any;
  if (!res.success || !student) return { title: 'শিক্ষার্থী প্রোফাইল' };
  return {
    title: `${student.nameBn || 'প্রোফাইল'} | শিক্ষার্থী প্রোফাইল`,
    description: `Manzil Student Directory - ${student.nameEn || ''}`,
  };
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getStudent(id);

  if (!res.success || !res.student) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen py-4 sm:py-8 space-y-6">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/students">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex flex-col -space-y-1">
            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest opacity-50">শিক্ষার্থী ডিরেক্টরি</h2>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 kalpurush-font tracking-tight">বিস্তারিত প্রোফাইল</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {/* Quick actions could go here */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <StudentProfileView student={res.student} />
      </div>
    </div>
  );
}
