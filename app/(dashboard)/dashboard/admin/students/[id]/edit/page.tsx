import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { 
  departmentsQueryOptions, 
  sessionsQueryOptions, 
  sectionsQueryOptions,
  boardingTypesQueryOptions
} from '@/features/admission/api/queries';
import { getAdmissionFullDetails } from '@/lib/actions/studentAdmission';
import AdmissionForm from '@/features/admission/components/AdmissionForm';

export const metadata: Metadata = {
  title: 'শিক্ষার্থী আপডেট করুন | Manzil International Institute',
  description: 'Update Student Information Profile',
};

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;
  const res = await getAdmissionFullDetails(id);

  if (!res.success || !res.data) {
    return notFound();
  }

  const { student, enrollments, invoice, payment } = res.data;

  // Map Appwrite document to AdmissionFormValues structure (Master mapping)
  const initialData = {
    personal: {
      nameEn: String(student.nameEn || student.name || ''),
      nameBn: String(student.nameBn || ''),
      nameAr: String(student.nameAr || ''),
      fatherNameBn: String(student.fatherNameBn || student.fatherName || ''),
      fatherNameEn: String(student.fatherNameEn || ''),
      motherNameBn: String(student.motherNameBn || student.motherName || ''),
      motherNameEn: String(student.motherNameEn || ''),
      fatherOccupation: String(student.fatherOccupation || ''),
      motherOccupation: String(student.motherOccupation || ''),
      fatherWorkplace: String(student.fatherWorkplace || ''),
      motherWorkplace: String(student.motherWorkplace || ''),
      dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
      gender: (student.gender === 'male' || student.gender === 'female') ? student.gender : 'male',
      bloodGroup: student.bloodGroup || 'unknown',
      nationality: String(student.nationality || 'বাংলাদেশী'),
      religion: ['islam', 'hinduism', 'christianity', 'buddhism', 'other'].includes(student.religion) ? student.religion : 'islam',
      identificationType: (student.identificationType === 'bc' || student.identificationType === 'nid') ? student.identificationType : 'bc',
      identificationNo: String(student.identificationNo || student.barthCertNo || ''),
      isHafiz: !!student.isHafiz,
      photoUrl: student.photo || '',
      applicantRelation: student.applicantRelation || '',
      applicantName: String(student.applicantName || ''),
      applicantPhone: String(student.applicantPhone || ''),
      status: student.status || 'active',
    },
    contact: {
      phonePrimary: String(student.phonePrimary || student.phone || ''),
      guardianPhone: String(student.guardianPhone || ''),
      whatsappNo: String(student.whatsappNo || ''),
      email: String(student.email || ''),
      permanentSameAsCurrent: (
        student.presentVillage === student.permanentVillage &&
        student.presentThana === student.permanentThana &&
        student.presentDistrict === student.permanentDistrict &&
        (student.presentVillage !== '' && student.presentVillage !== undefined)
      ),
      presentAddress: {
        division: String(student.presentDivision || student.division || ''),
        district: String(student.presentDistrict || student.district || ''),
        thana: String(student.presentThana || student.upazila || ''),
        union: String(student.presentUnion || student.union || ''),
        postOffice: String(student.presentPostOffice || student.postOffice || ''),
        village: String(student.presentVillage || student.village || ''),
        postCode: String(student.presentPostCode || student.postCode || ''),
      },
      permanentAddress: {
        division: String(student.permanentDivision || ''),
        district: String(student.permanentDistrict || ''),
        thana: String(student.permanentThana || ''),
        union: String(student.permanentUnion || ''),
        postOffice: String(student.permanentPostOffice || ''),
        village: String(student.permanentVillage || ''),
        postCode: String(student.permanentPostCode || ''),
      }
    },
    documents: {
      studentPhoto: student.photo || '',
      studentDocFront: student.studentDocFrontUrl || '',
      studentDocBack: student.studentDocBackUrl || '',
      fatherNidFront: student.fatherNidFrontUrl || '',
      fatherNidBack: student.fatherNidBackUrl || '',
      motherNidFront: student.motherNidFrontUrl || '',
      motherNidBack: student.motherNidBackUrl || '',
      transferCertificate: student.transferCertificateUrl || '',
      additionalDocuments: (student.additionalDocuments || []).map((d: any) => String(d)),
    },
    enrollment: {
      boardingType: enrollments?.[0]?.boardingType || '',
      admissionDate: student.admissionDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      hallName: enrollments?.[0]?.hallName || '',
      hallId: enrollments?.[0]?.hallId || '',
      previousSchoolName: String(student.previousSchoolName || student.previousSchool || ''),
      previousSchoolAddress: String(student.previousSchoolAddress || ''),
      previousClassName: String(student.previousClassName || student.previousClass || ''),
      previousResult: String(student.previousResult || ''),
      notes: String(student.notes || ''),
      admissionTestMarks: String(student.admissionTestMarks || ''),
      admissionTestResult: String(student.admissionTestResult || 'passed'),
      admissionTestRemarks: String(student.admissionTestRemarks || ''),
      examinerName: String(student.examinerName || ''),
      // Map enrollments with fetched details
      enrollments: enrollments.length > 0 ? enrollments.map((e: any) => ({
        departmentId: String(e.departmentId || ''),
        departmentCode: String(e.departmentCode || ''),
        departmentName: String(e.departmentName || ''),
        classId: String(e.classId || ''),
        className: String(e.className || ''),
        section: String(e.section || ''),
        session: String(e.session || ''),
        shift: String(e.shift || ''),
        monthlyFee: Number(e.monthlyFee || 0),
        rollNo: String(e.rollNo || ''),
        enrollmentDocId: String(e.$id),
      })) : [{
        departmentId: '', departmentCode: '', departmentName: '',
        classId: '', className: '', section: '',
        session: '', shift: '', monthlyFee: 0, rollNo: '',
      }],
    },
    payment: {
      feeItems: invoice?.feeItems ? JSON.parse(invoice.feeItems).map((item: any) => ({
        feeTypeCode: item.feeTypeCode || item.code,
        feeTypeName: item.feeTypeName || item.name,
        amount: Number(item.amount),
        originalAmount: Number(item.originalAmount || item.amount),
        isRequired: !!item.isRequired,
        isIncluded: true,
        isEdited: Number(item.amount) !== Number(item.originalAmount),
        discount: Number(item.discount || 0),
      })) : [],
      totalAmount: Number(invoice?.totalAmount || 0),
      netAmount: Number(invoice?.netAmount || 0),
      paidAmount: Number(payment?.amountPaid || invoice?.paidAmount || 0),
      paymentMethod: payment?.paymentMethod || 'cash',
      transactionRef: String(payment?.transactionRef || ''),
      notes: String(payment?.notes || ''),
    }
  };

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(departmentsQueryOptions),
    queryClient.prefetchQuery(sessionsQueryOptions),
    queryClient.prefetchQuery(sectionsQueryOptions),
    queryClient.prefetchQuery(boardingTypesQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdmissionForm 
        isEditMode={true} 
        studentId={id} 
        businessStudentId={student.studentId}
        admissionNo={student.admissionNo}
        initialData={initialData as any} 
      />
    </HydrationBoundary>
  );
}
