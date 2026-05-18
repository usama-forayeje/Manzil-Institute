'use client';

/**
 * AdmissionApplicationForm.tsx — Production-Grade A4 Print Template
 *
 * ✓ A4 size (210mm × 297mm) with proper @page CSS at the top
 * ✓ SolaimanLipi / Kalpurush fonts
 * ✓ Rearranged layout: Student + Guardian + Address + Documents on Page 1
 * ✓ Enrollment + Fees + Signatures on Page 2
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { useStep5Data } from '@/store/admissionFormStore';
import type { AdmissionFormValues } from '../schemas/form';

const PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 0;
  }
  @font-face {
    font-family: 'SolaimanLipi';
    src: local('SolaimanLipi'), local('Kalpurush');
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
    font-family: 'SolaimanLipi', 'Kalpurush', sans-serif;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    font-family: 'SolaimanLipi', 'Kalpurush', sans-serif;
  }

  .print-page {
    width: 210mm;
    height: 296mm;
    max-height: 296mm;
    box-sizing: border-box;
    background: white;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }
  .print-page:last-child { page-break-after: auto; }
  .no-break { page-break-inside: avoid; break-inside: avoid; }
  @media print {
    .no-print { display: none !important; }
  }
`;

export const AdmissionApplicationForm = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { watch } = useFormContext<AdmissionFormValues>();
    const step5Data = useStep5Data();

    // Use watch() not getValues() — watch() is reactive and re-renders when
    // form data changes (e.g. after resetForm() is called in Step6Success
    // following a DB fetch). getValues() is a one-time snapshot and would
    // cause empty print pages.
    const values = watch();

    if (!values || !values.personal) return null;

    const personal   = values.personal;
    const contact    = values.contact;
    const enrollment = values.enrollment;
    const docs       = values.documents;
    const payment    = values.payment;

    type AnyAddr = { division?: string; district?: string; thana?: string; union?: string; postOffice?: string; village?: string; postCode?: string; };
    const formatAddress = (addr: AnyAddr | undefined) => {
      if (!addr) return '---';
      return [addr.village, addr.postOffice, addr.union, addr.thana, addr.district, addr.division].filter(Boolean).join(', ') || '---';
    };

    const presentAddr  = formatAddress(contact?.presentAddress);
    const permanentAddr = contact?.permanentSameAsCurrent ? presentAddr : formatAddress(contact?.permanentAddress);

    // Smart check for any document field (checks multiple possible keys)
    const hasDoc = (key: string) => {
      if (!docs) return false;
      const val = (docs as any)[key] || (docs as any)[`${key}Url`] || (values as any).personal?.[key] || (values as any).personal?.[`${key}Url`];
      return !!val;
    };

    const hasStudentPhoto = hasDoc('studentPhoto') || hasDoc('photo');
    const hasStudentFront = hasDoc('studentDocFront') || hasDoc('birthCertificate');
    const hasStudentBack  = hasDoc('studentDocBack');
    const hasFatherFront  = hasDoc('fatherNidFront');
    const hasFatherBack   = hasDoc('fatherNidBack');
    const hasMotherFront  = hasDoc('motherNidFront');
    const hasMotherBack   = hasDoc('motherNidBack');
    const hasTC           = hasDoc('transferCertificate');

    const today       = format(new Date(), 'dd MMMM, yyyy', { locale: bn });
    const genDate    = format(new Date(), 'dd/MM/yyyy HH:mm');
    const genderLabel = personal.gender === 'male' ? 'পুরুষ' : personal.gender === 'female' ? 'মহিলা' : '---';

    // boardingType may be an Appwrite $id (GUID), a key like 'residential'/'day',
    // or a label like 'আবাসিক'. Normalize to a human-readable Bangla label.
    const getBoardingLabel = () => {
      const bt = (enrollment.boardingType || '').toLowerCase();
      if (!bt) return '---';
      if (bt.includes('residential') || bt.includes('আবাসিক') || bt.includes('boarding') || bt.includes('hostel')) return 'আবাসিক';
      if (bt.includes('day') || bt.includes('অনাবাসিক')) return 'অনাবাসিক';
      // If it looks like a GUID (Appwrite $id), show the hallName from store as fallback
      if (bt.length > 20 && bt.includes('-')) return enrollment.hallName || step5Data.hallName || 'আবাসিক';
      return enrollment.boardingType || '---';
    };
    const boardingLabel = getBoardingLabel();
    const hallDisplay = enrollment.hallName || step5Data.hallName || '---';

    const admissionTestResultLabel = enrollment.admissionTestResult === 'passed'  ? 'উত্তীর্ণ ✓' :
                                     enrollment.admissionTestResult === 'failed'  ? 'অকৃতকার্য ✗' : 'অপেক্ষমান';

    const safeFormat = (dateStr: string | undefined | null, fmt: string, appendTime: boolean = false) => {
      if (!dateStr) return '---';
      try {
        // If it's already an ISO string (contains T or Z), don't append anything
        const needsNormalization = appendTime && !dateStr.includes('T') && !dateStr.includes('Z');
        const d = new Date(needsNormalization ? dateStr + 'T00:00:00' : dateStr);
        if (isNaN(d.getTime())) return '---';
        return format(d, fmt);
      } catch {
        return '---';
      }
    };

    return (
      <div ref={ref}>
        <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

        {/* ══════════════════ PAGE 1 ══════════════════ */}
        <div className="print-page" style={{ padding: '8mm 12mm 10mm 12mm' }}>
          <div style={{ position: 'absolute', inset: 4, border: '1.5px solid #e4e4e7', borderRadius: 16, pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Header — Professional Centered Layout */}
            <div style={{ position: 'relative', borderBottom: '2px solid #00AEEF', paddingBottom: 14, marginBottom: 12, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'center', width: '100%', justifyContent: 'center' }}>
                <img src="/manzil-logo/manzil-institute-logo-light.webp" alt="logo" style={{ height: 95, objectFit: 'contain' }} />
              </div>

              {/* Passport Photo Box — Floating Top Right */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 105, border: '2px solid #e4e4e7', borderRadius: 8, overflow: 'hidden', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {hasStudentPhoto ? (
                  <img src={docs?.studentPhoto || personal?.photoUrl || (values as any).personal?.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Student" />
                ) : (
                  <div style={{ fontSize: 8, color: '#d4d4d8', textAlign: 'center', padding: 6, lineHeight: 1.4 }}>পাসপোর্ট<br />সাইজ<br />ছবি</div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ display: 'inline-block', background: '#00AEEF', color: 'white', padding: '6px 40px', borderRadius: 30, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ছাত্র ভর্তি আবেদন ফরম
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f4f4f5', borderRadius: 10, padding: '10px 20px', marginBottom: 14 }}>
              <IDBox label="ভর্তি নম্বর" value={step5Data.admissionNo} isBlue />
              <IDBox label="ছাত্র আইডি" value={step5Data.studentId} />
              <IDBox label="রিসিট নম্বর" value={step5Data.receiptNo} isBlue />
              <IDBox label="তারিখ" value={today} align="right" />
            </div>

            {/* ── Section 1: Student Info ──────────────────── */}
            <SectionBlock color="#00AEEF" title="১. ছাত্রের ব্যক্তিগত তথ্য (Student Information)">
              <TwoCol>
                <Field label="ছাত্রের নাম (বাংলায়)" value={personal.nameBn} />
                <Field label="ছাত্রের নাম (আরবি)" value={personal.nameAr} mono />
              </TwoCol>
              <Field label="Name (English)" value={personal.nameEn?.toUpperCase()} mono wide />
              <FourCol>
                <Field label="জন্ম তারিখ" value={safeFormat(personal.dateOfBirth, 'dd/MM/yyyy', true)} mono />
                <Field label="লিঙ্গ" value={genderLabel} />
                <Field label="রক্তের গ্রুপ" value={personal.bloodGroup && personal.bloodGroup !== 'unknown' ? personal.bloodGroup.toUpperCase() : '---'} highlight mono />
                <Field label="জাতীয়তা" value={personal.nationality || 'বাংলাদেশী'} />
              </FourCol>
              <TwoCol>
                <Field label="ধর্ম" value={personal.religion || '---'} />
                <Field label="পরিচয় নম্বর (জন্ম সনদ / এনআইডি)" value={personal.identificationNo} mono />
              </TwoCol>
              {personal.isHafiz && (
                <div style={{ marginTop: 6 }}><span style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '3px 12px', borderRadius: 20, fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }}>✦ হাফিজে কুরআন</span></div>
              )}
            </SectionBlock>

            {/* ── Section 2: Guardian Info ─────────────────── */}
            <SectionBlock color="#6366f1" title="২. অভিভাবকের তথ্য (Guardian Details)">
              <TwoCol>
                <Field label="পিতার নাম (বাংলা)" value={personal.fatherNameBn} />
                <Field label="Father's Name (English)" value={personal.fatherNameEn} mono />
              </TwoCol>
              <TwoCol>
                <Field label="পিতার পেশা" value={personal.fatherOccupation} />
                <Field label="পিতার কর্মস্থল" value={personal.fatherWorkplace} />
              </TwoCol>
              <TwoCol>
                <Field label="মাতার নাম (বাংলা)" value={personal.motherNameBn} />
                <Field label="Mother's Name (English)" value={personal.motherNameEn} mono />
              </TwoCol>
              <TwoCol>
                <Field label="মাতার পেশা" value={personal.motherOccupation || 'গৃহিনী'} />
                <Field label="মাতার কর্মস্থল" value={personal.motherWorkplace} />
              </TwoCol>
              <ThreeCol>
                <Field label="অভিভাবকের মোবাইল" value={contact?.guardianPhone} mono />
                <Field label="প্রাথমিক মোবাইল" value={contact?.phonePrimary} mono />
                <Field label="ইমেইল" value={contact?.email} mono />
              </ThreeCol>
            </SectionBlock>

            {/* ── Section 3: Address ──────────────────────── */}
            <SectionBlock color="#f97316" title="৩. ঠিকানা (Address)">
              <TwoCol>
                <div style={{ background: '#fafafa', border: '1px dashed #e4e4e7', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 8, fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>বর্তমান ঠিকানা</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#27272a', lineHeight: 1.6 }}>{presentAddr}</div>
                </div>
                <div style={{ background: '#fafafa', border: '1px dashed #e4e4e7', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ fontSize: 8, fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em' }}>স্থায়ী ঠিকানা</div>
                    {contact?.permanentSameAsCurrent && (
                      <span style={{ fontSize: 7, background: '#e4e4e7', color: '#71717a', padding: '1px 6px', borderRadius: 10, fontWeight: 900, textTransform: 'uppercase' }}>বর্তমানের মতো</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#27272a', lineHeight: 1.6 }}>{permanentAddr}</div>
                </div>
              </TwoCol>
            </SectionBlock>

            {/* ── Section 4: Documents Checklist ──────────── */}
            <SectionBlock color="#0ea5e9" title="৪. সংযুক্ত কাগজপত্র (Documents Checklist)">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px', padding: '4px 0' }}>
                <CheckItem label="ছাত্রের ছবি" checked={hasStudentPhoto} />
                <CheckItem label="জন্ম সনদ / NID (সম্মুখ)" checked={hasStudentFront} />
                <CheckItem label="জন্ম সনদ / NID (পিছন)" checked={hasStudentBack} />
                <CheckItem label="পিতার NID (সম্মুখ)" checked={hasFatherFront} />
                <CheckItem label="পিতার NID (পিছন)" checked={hasFatherBack} />
                <CheckItem label="মাতার NID (সম্মুখ)" checked={hasMotherFront} />
                <CheckItem label="মাতার NID (পিছন)" checked={hasMotherBack} />
                <CheckItem label="ট্রান্সফার সার্টিফিকেট (TC)" checked={hasTC} />
                <CheckItem label="অতিরিক্ত নথিপত্র" checked={!!(docs?.additionalDocuments && docs.additionalDocuments.length > 0)} />
              </div>
            </SectionBlock>

          </div>
        </div>

        {/* ══════════════════ PAGE 2 ══════════════════ */}
        <div className="print-page" style={{ padding: '8mm 12mm 10mm 12mm' }}>
          <div style={{ position: 'absolute', inset: 4, border: '1.5px solid #e4e4e7', borderRadius: 16, pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Mini page-2 header */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #00AEEF', paddingBottom: 10, marginBottom: 14 }}>
              <img src="/manzil-logo/manzil-institute-logo-light.webp" alt="logo" style={{ height: 48, objectFit: 'contain' }} />
              
              <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 8, color: '#a1a1aa', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 900, background: '#f4f4f5', padding: '3px 8px', borderRadius: 4, display: 'inline-block', alignSelf: 'flex-end' }}>ছাত্র ভর্তি আবেদন — পৃষ্ঠা ২</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', marginTop: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 8, color: '#a1a1aa', fontWeight: 700 }}>ভর্তি নম্বর:</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#00AEEF', fontFamily: 'monospace' }}>{step5Data.admissionNo || '---'}</div>
                  </div>
                  <div style={{ width: 1, height: 10, background: '#e4e4e7' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 8, color: '#a1a1aa', fontWeight: 700 }}>ছাত্র আইডি:</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#27272a', fontFamily: 'monospace' }}>{step5Data.studentId || '---'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 5: Enrollment Details ───────────── */}
            <SectionBlock color="#10b981" title="৫. ভর্তি ও শিক্ষার বিবরণ (Enrollment Details)">
              <ThreeCol>
                <Field label="ভর্তির তারিখ" value={safeFormat(enrollment.admissionDate, 'dd/MM/yyyy')} highlight />
                <Field label="ছাত্র আইডি" value={step5Data.studentId} highlight mono />
                <Field label="আবাসন / আবাসন" value={hallDisplay} />
              </ThreeCol>

              <div style={{ marginTop: 10, borderRadius: 10, border: '1px solid #e4e4e7', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: '#f4f4f5' }}>
                      {['বিভাগ', 'শ্রেণী', 'সেকশন', 'সেশন', 'রোল'].map(h => (
                        <th key={h} style={{ padding: '7px 10px', fontSize: 9, fontWeight: 900, color: '#71717a', textAlign: 'left', borderBottom: '1px solid #e4e4e7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enrollment.enrollments?.filter(e => e.departmentId || e.departmentCode || e.departmentName).map((enr, i, arr) => (
                      <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f4f4f5' : 'none' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#27272a' }}>{enr.departmentName || enr.departmentCode || '---'}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#27272a' }}>{enr.className || '---'}</td>
                        <td style={{ padding: '8px 10px', color: '#52525b' }}>{enr.section || '---'}</td>
                        <td style={{ padding: '8px 10px', color: '#52525b', fontFamily: 'monospace' }}>{enr.session || '---'}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#00AEEF', fontFamily: 'monospace' }}>{enr.rollNo || '---'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(enrollment.admissionTestMarks || enrollment.admissionTestResult) && (
                <ThreeCol style={{ marginTop: 10 }}>
                  <Field label="ভর্তি পরীক্ষার নম্বর" value={enrollment.admissionTestMarks} highlight mono />
                  <Field label="পরীক্ষার ফলাফল" value={admissionTestResultLabel} />
                  <Field label="পরীক্ষক" value={enrollment.examinerName} />
                </ThreeCol>
              )}

              {enrollment.previousSchoolName && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed #e4e4e7' }}>
                  <TwoCol>
                    <Field label="পূর্ববর্তী প্রতিষ্ঠান" value={enrollment.previousSchoolName} />
                    <Field label="প্রতিষ্ঠানের ঠিকানা" value={enrollment.previousSchoolAddress} />
                  </TwoCol>
                  <ThreeCol style={{ marginTop: 6 }}>
                    <Field label="উত্তীর্ণ শ্রেণী" value={enrollment.previousClassName} />
                    <Field label="ফলাফল / GPA" value={enrollment.previousResult} highlight mono />
                    <Field label="---" value="" />
                  </ThreeCol>
                </div>
              )}
            </SectionBlock>



            <div style={{ margin: '12px 0 24px', padding: '12px 20px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e4e4e7' }}>
              <p style={{ fontSize: 10, color: '#71717a', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.8, margin: 0 }}>
                &ldquo;আমি অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও সঠিক এবং মাদরাসার সকল নিয়ম-শৃঙ্খলা মেনে চলতে আমি বাধ্য থাকব।
                তথ্যে কোনো অসঙ্গতি পাওয়া গেলে আমার ভর্তি বাতিলের অধিকার কর্তৃপক্ষ সংরক্ষণ করে।&rdquo;
              </p>
            </div>

            <div style={{ marginTop: 20, border: '2px solid #00AEEF', borderRadius: 12, padding: 12, background: '#f0f9ff' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#00AEEF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, background: '#00AEEF', borderRadius: '50%' }} />
                শুধুমাত্র অফিস ব্যবহারের জন্য (For Office Use Only)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div style={{ borderBottom: '1px dashed #bae6fd', minHeight: 40 }}>
                  <p style={{ fontSize: 7, color: '#0369a1', fontWeight: 700 }}>ভর্তি অনুমোদনের তারিখ:</p>
                </div>
                <div style={{ borderBottom: '1px dashed #bae6fd', minHeight: 40 }}>
                  <p style={{ fontSize: 7, color: '#0369a1', fontWeight: 700 }}>রিসিট / ভাউচার নম্বর:</p>
                </div>
                <div style={{ borderBottom: '1px dashed #bae6fd', minHeight: 40 }}>
                  <p style={{ fontSize: 7, color: '#0369a1', fontWeight: 700 }}>অফিসিয়াল সিল:</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 45, textAlign: 'center', alignItems: 'flex-end' }}>
              <SignBox label="ছাত্রের স্বাক্ষর" />
              <SignBox label="অভিভাবকের স্বাক্ষর" />
              <SignBox label="শিক্ষক / পরীক্ষক" />
              <SignBox label="অধ্যক্ষ / মোহতামিম" isOfficial />
            </div>

            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#d4d4d8', borderTop: '1px solid #f4f4f5', paddingTop: 6, fontWeight: 500 }}>
              <div style={{ display: 'flex', gap: 15 }}>
                <span>Manzil International Institute</span>
                <span>admission-portal-v2.0</span>
              </div>
              <span>Generated: {genDate}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AdmissionApplicationForm.displayName = 'AdmissionApplicationForm';

function SectionBlock({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div className="no-break" style={{ marginBottom: 10, border: '1px solid #e4e4e7', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ background: color, color: 'white', padding: '5px 12px', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{title}</div>
      <div style={{ padding: '8px 12px', background: 'white' }}>{children}</div>
    </div>
  );
}

function TwoCol({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 6, ...style }}>{children}</div>;
}

function ThreeCol({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px 12px', marginBottom: 6, ...style }}>{children}</div>;
}

function FourCol({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px 12px', marginBottom: 6 }}>{children}</div>;
}

function Field({ label, value, wide, highlight, mono }: { label: string; value?: string | null; wide?: boolean; highlight?: boolean; mono?: boolean; }) {
  return (
    <div style={{ gridColumn: wide ? 'span 2' : undefined }}>
      <div style={{ fontSize: 7, fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, borderBottom: '1px solid #e4e4e7', paddingBottom: 3, minHeight: 18, color: highlight ? '#00AEEF' : '#27272a', fontFamily: mono ? 'monospace' : 'inherit' }}>{value || '---'}</div>
    </div>
  );
}

function IDBox({ label, value, isBlue, align }: { label: string; value?: string; isBlue?: boolean; align?: string }) {
  return (
    <div style={{ textAlign: align === 'right' ? 'right' : 'left' }}>
      <div style={{ fontSize: 7, fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 900, color: isBlue ? '#00AEEF' : '#18181b', fontFamily: 'monospace' }}>{value || '———'}</div>
    </div>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div
        style={{
          width: 14,
          height: 14,
          border: `2px solid ${checked ? '#0ea5e9' : '#d4d4d8'}`,
          borderRadius: 3,
          background: checked ? '#0ea5e9' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && (
          <div style={{ width: 5, height: 5, background: 'white', borderRadius: 2 }} />
        )}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#52525b' }}>
        {label}
      </span>
    </div>
  );
}

function SignBox({ label, isOfficial }: { label: string; isOfficial?: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          height: 50,
          borderBottom: `2px solid ${isOfficial ? '#00AEEF' : '#27272a'}`,
          marginBottom: 6,
          transform: isOfficial ? 'scaleX(1.05)' : undefined,
        }}
      />
      <div
        style={{
          fontSize: 9,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: isOfficial ? '#00AEEF' : '#52525b',
        }}
      >
        {label}
      </div>
    </div>
  );
}
