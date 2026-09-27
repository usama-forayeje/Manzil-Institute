'use client';

/**
 * BlankAdmissionApplicationForm.tsx — Printable A4 Blank Admission Form
 *
 * Official blank paper admission application form for Manzil International Institute.
 * Designed for guardians to fill out by hand on standard A4 paper.
 * Calibrated so all content—including full declaration and signatures—fits completely on 1 single A4 page.
 */

import React from 'react';

const BLANK_PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 5mm 8mm 5mm 8mm;
  }
  @font-face {
    font-family: 'SolaimanLipi';
    src: url('/fonts/SolaimanLipi/SolaimanLipi_22-02-2012.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Kalpurush';
    src: url('/fonts/kalpurush.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
    font-family: 'SolaimanLipi', 'Kalpurush', 'Hind Siliguri', sans-serif;
    letter-spacing: normal !important;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    color: #18181b;
  }
  .blank-page {
    width: 100%;
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    color: #09090b;
    font-size: 10.5px;
    line-height: 1.3;
    page-break-after: avoid;
    page-break-inside: avoid;
  }
  .write-line {
    border-bottom: 1px dotted #52525b;
    display: inline-block;
    min-height: 17px;
    vertical-align: middle;
  }
  .write-box {
    border: 1px solid #52525b;
    display: inline-block;
    width: 15px;
    height: 16px;
    margin: 0 1px;
    vertical-align: middle;
  }
  .check-box-sq {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1.5px solid #18181b;
    margin-right: 4px;
    vertical-align: -1.5px;
  }
  .section-badge {
    background-color: #0f172a !important;
    color: #ffffff !important;
    font-weight: 700;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 3px;
    display: inline-block;
  }
  @media print {
    .no-print { display: none !important; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
    }
    .blank-page {
      padding: 0 !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
    }
  }
`;

export const BlankAdmissionApplicationForm = React.forwardRef<HTMLDivElement, {}>(
  (props, ref) => {
    return (
      <div ref={ref} className="blank-page p-3 bg-white text-zinc-900">
        <style dangerouslySetInnerHTML={{ __html: BLANK_PRINT_STYLES }} />

        {/* ── Top Header ────────────────────────────────────────── */}
        <div className="text-center mb-1">
          <p className="text-[11px] font-semibold tracking-wider text-zinc-600">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-1.5 mb-1.5">
          {/* Left: Office Tracking */}
          <div className="w-[125px] border border-zinc-400 p-1.5 rounded text-[9.5px] space-y-0.5">
            <p className="font-bold border-b border-zinc-300 pb-0.5 text-center text-zinc-800">
              অফিস ব্যবহারের জন্য
            </p>
            <p>ফরম নং: <span className="write-line w-14"></span></p>
            <p>ভর্তি রোল: <span className="write-line w-12"></span></p>
            <p>আইডি: <span className="write-line w-14"></span></p>
            <p>তারিখ: <span className="write-line w-14"></span></p>
          </div>

          {/* Center: Institute Details */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-xl font-black tracking-tight text-zinc-950 font-serif leading-none">
              মানযিল ইন্টারন্যাশনাল ইনস্টিটিউট
            </h1>
            <p className="text-[11px] font-bold tracking-widest text-zinc-800 uppercase mt-0.5">
              Manzil International Institute
            </p>
            <p className="text-[9.5px] text-zinc-600 mt-0.5 font-medium">
              হিফজুল কুরআন, কওমি কারিকুলাম ও আন্তর্জাতিক মানের সমন্বিত শিক্ষা কমপ্লেক্স
            </p>
            <div className="mt-1 inline-block">
              <span className="bg-zinc-900 text-white font-bold text-[12px] px-5 py-0.5 rounded-full border border-zinc-950 tracking-wide">
                ভর্তি আবেদন ফরম (Admission Form)
              </span>
            </div>
          </div>

          {/* Right: Photo Box */}
          <div className="w-[95px] h-[105px] border-2 border-dashed border-zinc-400 rounded flex flex-col items-center justify-center text-center p-1 text-[9px] text-zinc-500 bg-zinc-50">
            <span className="font-semibold">পাসপোর্ট সাইজের</span>
            <span className="font-semibold">রঙিন ছবি</span>
            <span className="text-[7.5px] text-zinc-400 mt-0.5">(আঠা দিয়ে লাগান)</span>
          </div>
        </div>

        {/* ── Section 1: Student Information ─────────────────────── */}
        <div className="mb-1.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="section-badge">১. শিক্ষার্থীর ব্যক্তিগত তথ্য (Student Information)</span>
          </div>
          <table className="w-full border-collapse border border-zinc-300 text-[10.5px]">
            <tbody>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-36">
                  নাম (বাংলায় পূর্ণ নাম) :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full min-h-[19px]"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  Name (English Block) :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2 font-mono">
                  <span className="write-line w-full min-h-[19px]"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  الاسم باللغة العربية (আরবি) :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2 text-right font-serif">
                  <span className="write-line w-full min-h-[19px]"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  জন্ম তারিখ :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  দিন: <span className="write-box"></span><span className="write-box"></span>
                  {' '}মাস: <span className="write-box"></span><span className="write-box"></span>
                  {' '}বছর: <span className="write-box"></span><span className="write-box"></span><span className="write-box"></span><span className="write-box"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-28">
                  লিঙ্গ :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="check-box-sq"></span> ছাত্র &nbsp;&nbsp;&nbsp;
                  <span className="check-box-sq"></span> ছাত্রী
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  জন্ম নিবন্ধন / এনআইডি :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  রক্তের গ্রুপ ও ধর্ম :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  গ্রুপ: <span className="write-line w-12"></span> &nbsp;
                  ধর্ম: <span className="check-box-sq"></span> ইসলাম &nbsp;
                  <span className="check-box-sq"></span> অন্যান্য
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Section 2: Parents Information ─────────────────────── */}
        <div className="mb-1.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="section-badge">২. পিতা ও মাতার বিবরণ (Parents Information)</span>
          </div>
          <table className="w-full border-collapse border border-zinc-300 text-[10.5px]">
            <tbody>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-36">
                  পিতার নাম (বাংলা) :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full min-h-[18px]"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-28">
                  পেশা :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  Father's Name (En) :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full min-h-[18px]"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  কর্মস্থল :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  اسم الأব (পিতার নাম আরবি) :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2 text-right font-serif">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  মাতার নাম (বাংলা) :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full min-h-[18px]"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  পেশা :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  Mother's Name (En) :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full min-h-[18px]"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  কর্মস্থল :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  اسم الأم (মাতার নাম আরবি) :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2 text-right font-serif">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Section 3: Contact & Address ───────────────────────── */}
        <div className="mb-1.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="section-badge">৩. যোগাযোগ ও ঠিকানা (Contact & Address)</span>
          </div>
          <table className="w-full border-collapse border border-zinc-300 text-[10.5px]">
            <tbody>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-36">
                  অভিভাবকের মোবাইল নং :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-28">
                  হোয়াটসঅ্যাপ নং :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="write-line w-full"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 align-top">
                  বর্তমান ঠিকানা :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2">
                  <div className="grid grid-cols-3 gap-2 mb-1">
                    <div>বিভাগ: <span className="write-line w-24"></span></div>
                    <div>জেলা: <span className="write-line w-24"></span></div>
                    <div>থানা/উপজেলা: <span className="write-line w-20"></span></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-600">গ্রাম / মহল্লা / বাড়ি নং, ডাকঘর ও পোস্ট কোড:</span>
                    <div className="border-b border-dotted border-zinc-500 h-5 mt-0.5"></div>
                    <div className="border-b border-dotted border-zinc-500 h-5 mt-0.5"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 align-top">
                  স্থায়ী ঠিকানা :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2">
                  <div className="mb-1">
                    <span className="check-box-sq"></span> বর্তমান ঠিকানার একই রূপ (টিক দিন) অথবা নিম্নে লিখুন:
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-1">
                    <div>বিভাগ: <span className="write-line w-24"></span></div>
                    <div>জেলা: <span className="write-line w-24"></span></div>
                    <div>থানা/উপজেলা: <span className="write-line w-20"></span></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-600">গ্রাম / মহল্লা / বাড়ি নং, ডাকঘর ও পোস্ট কোড:</span>
                    <div className="border-b border-dotted border-zinc-500 h-5 mt-0.5"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Section 4: Academic & Admission Info ───────────────── */}
        <div className="mb-1.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="section-badge">৪. ভর্তি সংক্রান্ত তথ্য (Admission Information)</span>
          </div>
          <table className="w-full border-collapse border border-zinc-300 text-[10.5px]">
            <tbody>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-36">
                  আবেদনকৃত বিভাগ :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2">
                  <span className="check-box-sq"></span> জেনারেল / স্কুল শাখা &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="check-box-sq"></span> হিফজুল কুরআন শাখা &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="check-box-sq"></span> কওমি (দরসে নিজামী) &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="check-box-sq"></span> অন্যান্য: <span className="write-line w-24"></span>
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  শ্রেণী ও সেশন :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  ভর্তিচ্ছু শ্রেণী: <span className="write-line w-24"></span> &nbsp;&nbsp;
                  সেশন: <span className="write-line w-20"></span>
                </td>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80 w-28">
                  বোর্ডিং ধরন :
                </td>
                <td className="border border-zinc-300 py-1 px-2">
                  <span className="check-box-sq"></span> অনাবাসিক &nbsp;&nbsp;
                  <span className="check-box-sq"></span> ডে-কেয়ার &nbsp;&nbsp;
                  <span className="check-box-sq"></span> আবাসিক
                </td>
              </tr>
              <tr>
                <td className="border border-zinc-300 py-1 px-2 font-semibold bg-zinc-50/80">
                  পূর্ববর্তী প্রতিষ্ঠান :
                </td>
                <td colSpan={3} className="border border-zinc-300 py-1 px-2">
                  প্রতিষ্ঠানের নাম: <span className="write-line w-64"></span> &nbsp;&nbsp;
                  অধ্যয়নকৃত শ্রেণী: <span className="write-line w-20"></span> &nbsp;&nbsp;
                  ফলাফল: <span className="write-line w-16"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Section 5: Declaration & Signatures ────────────────── */}
        <div className="border border-zinc-300 p-2 mb-2 bg-zinc-50/50 rounded text-[10px]">
          <p className="font-bold text-zinc-900 mb-0.5">অভিভাবকের অঙ্গীকারনামা:</p>
          <p className="text-zinc-800 leading-relaxed font-normal">
            আমি এই মর্মে অঙ্গীকার করছি যে, আমার জানা মতে উপরে বর্ণিত সকল তথ্য সম্পূর্ণ সত্য ও সঠিক। প্রতিষ্ঠানে অধ্যয়নকালে আমার সন্তান প্রতিষ্ঠানের সকল নিয়ম-শৃঙ্খলা ও ধর্মীয় অনুশাসন যথাযথভাবে মেনে চলবে। অন্যথায় কর্তৃপক্ষ যেকোনো সিদ্ধান্ত গ্রহণ করতে পারবে।
          </p>
        </div>

        <div className="flex justify-between items-end pt-5 pb-0.5 px-4 text-center text-[10px]">
          <div>
            <div className="border-t border-zinc-900 w-36 pt-1 font-bold text-zinc-900">
              শিক্ষার্থীর স্বাক্ষর ও তারিখ
            </div>
          </div>
          <div>
            <div className="border-t border-zinc-900 w-44 pt-1 font-bold text-zinc-900">
              অভিভাবকের পূর্ণ স্বাক্ষর ও তারিখ
            </div>
          </div>
          <div>
            <div className="border-t border-zinc-900 w-44 pt-1 font-bold text-zinc-900">
              অধ্যক্ষ / পরিচালকের অনুমোদন ও স্বাক্ষর
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[8.5px] text-zinc-400 border-t border-zinc-200 pt-1 mt-1.5">
          মানযিল ইন্টারন্যাশনাল ইনস্টিটিউট — অফিসিয়াল ভর্তি আবেদন ফরম • প্রিন্ট ও বিতরণের জন্য অনুমোদিত
        </div>
      </div>
    );
  }
);

BlankAdmissionApplicationForm.displayName = 'BlankAdmissionApplicationForm';
