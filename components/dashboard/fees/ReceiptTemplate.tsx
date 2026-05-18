'use client';

import type { ReceiptData } from '@/features/fees/types';
import { PAYMENT_METHOD_LABELS, MONTH_NAMES_BN } from '@/features/fees/types';

// ─── Bengali number helper ──────────────────────────────────
const toBn = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '০';
  const formatted = Number(num).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

// ─── A5 Print Styles (matches AdmissionReceipt pattern) ─────
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
    font-family: 'SolaimanLipi', 'Kalpurush', sans-serif !important;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    font-family: 'SolaimanLipi', 'Kalpurush', sans-serif !important;
  }
  .fee-receipt-page {
    width: 148mm;
    min-height: 209mm;
    box-sizing: border-box;
    background: white;
    padding: 10mm 12mm;
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'SolaimanLipi', 'Kalpurush', sans-serif !important;
  }
`;

interface ReceiptTemplateProps {
  receipt: ReceiptData;
}

export default function ReceiptTemplate({ receipt }: ReceiptTemplateProps) {
  const formattedDate = receipt.date
    ? new Date(receipt.date).toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '---';

  const formattedTime = receipt.date
    ? new Date(receipt.date).toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '';

  const payMethodLabel = PAYMENT_METHOD_LABELS[receipt.paymentMethod] || receipt.paymentMethod;

  return (
    <div>
      {/* Inject A5 styles into print window */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <div className="fee-receipt-page">
        <div style={{ flex: 1 }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #000', paddingBottom: 12, marginBottom: 16 }}>
            <img
              src="/manzil-logo/manzil-institute-logo-light.webp"
              alt="Logo"
              style={{ height: 60, objectFit: 'contain', filter: 'grayscale(100%) brightness(0)' }}
            />
            <div style={{ textAlign: 'right' }}>
              <div style={{ background: '#000', color: 'white', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 'bold', display: 'inline-block', marginBottom: 6 }}>
                মানি রসিদ (Receipt)
              </div>
              <div style={{ fontSize: 11, color: '#000', fontWeight: 'bold' }}>
                # {receipt.receiptNo}
              </div>
            </div>
          </div>

          {/* ── Institute Info (if logo not shown) ── */}
          {receipt.instituteAddress && (
            <div style={{ textAlign: 'center', marginBottom: 10, fontSize: 10, color: '#000' }}>
              {receipt.instituteAddress}{receipt.institutePhone ? ` | ${receipt.institutePhone}` : ''}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 15px', marginBottom: 14, padding: '12px 16px', border: '1px solid #000', borderRadius: 4 }}>
            <div>
              <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>শিক্ষার্থীর নাম</div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>{receipt.studentName}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>ছাত্র আইডি</div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>{receipt.studentId}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>তারিখ ও সময়</div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000' }}>{formattedDate} {formattedTime && `| ${formattedTime}`}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>পেমেন্ট আইডি</div>
              <div style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>{receipt.paymentId}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>শ্রেণী ও সেকশন</div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000' }}>{receipt.studentClass}{receipt.studentSection ? ` — ${receipt.studentSection}` : ''}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', borderBottom: '1px dotted #ccc', paddingBottom: 2, marginBottom: 4 }}>মাস ও সেশন</div>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000' }}>{MONTH_NAMES_BN[receipt.month] || receipt.month} ({receipt.session})</div>
            </div>
          </div>

          {/* ── Fee Table ── */}
          <div style={{ border: '1px solid #000', overflow: 'hidden', marginBottom: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ padding: '7px 12px', textAlign: 'left', fontSize: 10, color: '#000', fontWeight: 'bold', borderBottom: '1px solid #000' }}>বিবরণ (খাত)</th>
                  <th style={{ padding: '7px 12px', textAlign: 'right', fontSize: 10, color: '#000', fontWeight: 'bold', borderBottom: '1px solid #000' }}>পরিমাণ (৳)</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px dotted #ddd' }}>
                    <td style={{ padding: '7px 12px', fontWeight: 'bold', color: '#000' }}>{item.name}</td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>৳{toBn(item.amount)}</td>
                  </tr>
                ))}
                
                {/* Inline Discount Row for visibility */}
                {receipt.discount > 0 && (
                  <tr style={{ background: '#f5f5f5' }}>
                    <td style={{ padding: '7px 12px', fontWeight: 'bold', color: '#000' }}>ছাড় / রিবেট (Discount)</td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>-৳{toBn(receipt.discount)}</td>
                  </tr>
                )}
              </tbody>
              
              <tfoot style={{ borderTop: '2px solid #000' }}>
                <tr style={{ background: '#fcfcfc' }}>
                  <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 10, color: '#000', fontWeight: 'bold' }}>সর্বমোট (Sub-total):</td>
                  <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>৳{toBn(receipt.totalAmount)}</td>
                </tr>
                <tr style={{ background: '#f5f5f5' }}>
                  <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 10, color: '#000', fontWeight: 'bold' }}>পরিশোধ্য পরিমাণ (Payable):</td>
                  <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000' }}>৳{toBn(receipt.netAmount)}</td>
                </tr>
                <tr style={{ background: '#fcfcfc', borderTop: '1px solid #000' }}>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, color: '#000', fontWeight: 'bold' }}>জমা (Paid Amount):</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000', fontSize: 14 }}>৳{toBn(receipt.paidAmount)}</td>
                </tr>
                <tr style={{ borderTop: '1px solid #000' }}>
                  <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 11, color: '#000', fontWeight: 'bold' }}>
                    {receipt.dueAfterPayment > 0 ? 'অবশিষ্ট বকেয়া (Current Due):' : 'সার্বিক বকেয়া (Total Due):'}
                  </td>
                  <td style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 'bold', color: '#000', fontSize: 12 }}>
                    ৳{toBn(receipt.dueAfterPayment)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ── Payment Details ── */}
          <div style={{ border: '1px solid #000', borderRadius: 4, padding: '10px 14px', marginBottom: 10, fontSize: 10, background: '#fafafa' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <div>
                <span style={{ color: '#000', fontWeight: 'bold' }}>পেমেন্ট মাধ্যম:</span>
                <span style={{ color: '#000', fontWeight: 'bold', marginLeft: 6 }}>{payMethodLabel}</span>
              </div>
              <div>
                <span style={{ color: '#000', fontWeight: 'bold' }}>সংগ্রহকারী:</span>
                <span style={{ color: '#000', fontWeight: 'bold', marginLeft: 6 }}>{receipt.collectedBy}</span>
              </div>
              {receipt.transactionRef && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#000', fontWeight: 'bold' }}>ট্রানজেকশন রেফ:</span>
                  <span style={{ color: '#000', fontWeight: 'bold', marginLeft: 6 }}>{receipt.transactionRef}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        <div>
          {/* ── Signatures ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 110, borderTop: '1px solid #000', marginBottom: 4 }}></div>
              <div style={{ fontSize: 10, color: '#000', fontWeight: 'bold' }}>অভিভাবকের স্বাক্ষর</div>
              <div style={{ fontSize: 8, color: '#555' }}>Guardian Signature</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 110, borderTop: '1px solid #000', marginBottom: 4 }}></div>
              <div style={{ fontSize: 10, color: '#000', fontWeight: 'bold' }}>কর্তৃপক্ষের স্বাক্ষর ও সিল</div>
              <div style={{ fontSize: 8, color: '#555' }}>Authority Signature &amp; Seal</div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 8, color: '#000', borderTop: '1px solid #000', paddingTop: 6, lineHeight: 1.1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 0 }}>
              <span>কম্পিউটার-প্রিন্টেড রসিদ</span>
              <span style={{ color: '#000' }}>|</span>
              <span>গ্রাহক কপি</span>
              <span style={{ color: '#000' }}>|</span>
              <span>প্রিন্টের সময়: {new Date().toLocaleDateString('bn-BD')} {new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 'bold' }}>
              <span style={{ fontWeight: 'normal' }}>Developed by</span> Manzil IT <span style={{ color: '#000', margin: '0 2px' }}>|</span> usama.app
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
