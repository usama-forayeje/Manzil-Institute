'use client';

/**
 * AdmissionReceipt.tsx — Production-Grade A5 Print Template
 *
 * ✓ A5 size portrait (148mm × 210mm) ideal for receipts
 * ✓ SolaimanLipi / Kalpurush standard font
 * ✓ Detailed fee breakdown with itemized styling
 */

import React from 'react';
import { useStep5Data } from '@/store/admissionFormStore';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '../schemas/form';

const PRINT_STYLES = `
  @page {
    size: A5 portrait;
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
  }
  
  .print-receipt-page {
    width: 148mm;
    height: 209mm;
    max-height: 209mm;
    box-sizing: border-box;
    background: white;
    padding: 10mm 12mm;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
`;

const FEE_CATEGORY_LABELS: Record<string, string> = {
  admission: 'ভর্তি ফি',
  boarding:  'আবাসিক',
  monthly:   'বেতন',
  other:     'অন্যান্য',
};

const toBn = (num: number | string | undefined | null) => {
  if (num === null || num === undefined) return '০';
  return num.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

export const AdmissionReceipt = React.forwardRef<HTMLDivElement, { id?: string }>(
  (props, ref) => {
    const step5Data = useStep5Data();
    const { watch } = useFormContext<AdmissionFormValues>();
    const values = watch(); // watch() is reactive — re-renders when resetForm() fires

    if (!step5Data.studentId) return null;

    const getSafeDate = () => {
      if (!step5Data.admissionDate) return new Date();
      const d = new Date(step5Data.admissionDate);
      return isNaN(d.getTime()) ? new Date() : d;
    };

    const bnDate = format(getSafeDate(), 'dd MMMM, yyyy', { locale: bn });
    const admissionDate = toBn(bnDate);

    const total   = Number(step5Data.totalAmount || 0);
    const paid    = Number(step5Data.paidAmount  || 0);
    const due     = total - paid;

    const feeItems = values?.payment?.feeItems ?? [];
    // Production Grade: Show all items with an amount or specifically included
    const includedItems = feeItems.filter((item) => Number(item.amount) > 0 || item.isIncluded);
    const hasBreakdown  = includedItems.length > 0;

    const payMethodLabels: Record<string, string> = {
      cash: 'নগদ (Cash)', bank: 'ব্যাংক ট্রান্সফার (Bank Transfer)', bkash: 'বিকাশ (Bkash)', nagad: 'নগদ (Nagad)', rocket: 'রকেট (Rocket)',
    };
    const payMethod = payMethodLabels[values?.payment?.paymentMethod ?? 'cash'] ?? 'নগদ';

    return (
      <div ref={ref}>
        <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
        
        <div className="print-receipt-page">
          
          <div style={{ flex: 1 }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #000', paddingBottom: 12, marginBottom: 16 }}>
              <img src="/manzil-logo/manzil-institute-logo-light.webp" alt="Logo" style={{ height: 60, objectFit: 'contain', filter: 'grayscale(100%) brightness(0)' }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ background: '#000', color: 'white', padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 'bold', display: 'inline-block', marginBottom: 6 }}>
                  মানি রিসিট (Receipt)
                </div>
                <div style={{ fontSize: 11, color: '#000', fontWeight: 'bold', fontFamily: 'monospace' }}># {step5Data.receiptNo || '---'}</div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16, padding: '12px 16px', borderRadius: 4, border: '1px solid #000' }}>
               <div>
                 <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>ছাত্রের নাম</div>
                 <div style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>{step5Data.studentNameBn || '---'}</div>
               </div>
               <div>
                 <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>ছাত্র আইডি</div>
                 <div style={{ fontSize: 14, fontWeight: 'bold', color: '#000', fontFamily: 'monospace' }}>{step5Data.studentId || '---'}</div>
               </div>
               <div>
                 <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>তারিখ</div>
                 <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000' }}>{admissionDate}</div>
               </div>
               <div>
                 <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>পেমেন্ট মাধ্যম</div>
                 <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000' }}>{payMethod}</div>
               </div>
            </div>

            {/* Fee Table */}
            <div style={{ border: '1px solid #000', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: '#000', fontWeight: 'bold', borderBottom: '1px solid #000' }}>বিবরণ (খাত)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, color: '#000', fontWeight: 'bold', borderBottom: '1px solid #000' }}>পরিশোধ (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {hasBreakdown ? (
                    includedItems.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <tr style={{ borderBottom: item.discount > 0 ? 'none' : '1px dotted #000' }}>
                          <td style={{ padding: '8px 12px', color: '#000', fontWeight: 'bold' }}>
                            {item.feeTypeName} <span style={{ fontWeight: 'normal', fontSize: 10, color: '#555' }}>({FEE_CATEGORY_LABELS[item.feeCategory ?? 'other'] ?? 'ফি'})</span>
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                            ৳{toBn(item.amount.toLocaleString('en-US'))}
                          </td>
                        </tr>
                        {item.discount > 0 && (
                          <tr style={{ borderBottom: '1px dotted #000' }}>
                            <td style={{ padding: '0 12px 8px 24px', color: '#444', fontSize: 10 }}>
                              --- ছাড় (Discount)
                            </td>
                            <td style={{ padding: '0 12px 8px 12px', textAlign: 'right', color: '#444', fontSize: 10, fontWeight: 'bold' }}>
                              -৳{toBn(item.discount.toLocaleString('en-US'))}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td style={{ padding: '12px', color: '#000', fontWeight: 'bold' }}>ভর্তি ফিসমূহ</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                        ৳{toBn(total.toLocaleString('en-US'))}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot style={{ borderTop: '2px solid #000' }}>
                  {hasBreakdown && (
                    <tr>
                      <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 11, color: '#000', fontWeight: 'bold' }}>সর্বমোট:</td>
                      <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>৳{toBn(total.toLocaleString('en-US'))}</td>
                    </tr>
                  )}
                  <tr style={{ background: '#eee' }}>
                    <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 12, color: '#000', fontWeight: 'bold' }}>জমা:</td>
                    <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000', fontSize: 14 }}>৳{toBn(paid.toLocaleString('en-US'))}</td>
                  </tr>
                  {due > 0 && (
                    <tr>
                      <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 11, color: '#000', fontWeight: 'bold' }}>বকেয়া:</td>
                      <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000', fontSize: 12 }}>৳{toBn(due.toLocaleString('en-US'))}</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          <div>
            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ width: 120, borderTop: '1px solid #000', marginBottom: 4 }}></div>
                 <div style={{ fontSize: 10, color: '#000', fontWeight: 'bold' }}>প্রদানকারীর স্বাক্ষর</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ width: 120, borderTop: '1px solid #000', marginBottom: 4 }}></div>
                 <div style={{ fontSize: 10, color: '#000', fontWeight: 'bold' }}>গ্রহণকারীর স্বাক্ষর</div>
               </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 8, color: '#555', borderTop: '1px dotted #000', paddingTop: 8 }}>
              Manzil Office Management System — {toBn(format(new Date(), 'dd/MM/yyyy HH:mm'))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AdmissionReceipt.displayName = 'AdmissionReceipt';
