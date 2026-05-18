'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { fetchUnpaidInvoices, collectFeePayment } from '@/lib/actions/fees';
import { toast } from 'sonner';

export default function PaymentForm() {
  const [studentId, setStudentId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Payment State
  const [amountParam, setAmountParam] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isPaying, setIsPaying] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsSearching(true);
    setSelectedInvoice(null);
    
    const res = await fetchUnpaidInvoices({ studentId: studentId.trim() });
    if (res.success) {
      setInvoices(res.invoices || []);
      if (res.invoices?.length === 0) {
        toast.info('এই ছাত্রের কোনো বকেয়া ইনভয়েস পাওয়া যায়নি');
      }
    } else {
      toast.error('ইনভয়েস খুঁজতে সমস্যা হয়েছে');
    }
    
    setIsSearching(false);
  };

  const handleSelectInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    setAmountParam(inv.dueAmount);
  };

  const handlePayment = async () => {
    if (!selectedInvoice) return;
    if (amountParam <= 0 || amountParam > selectedInvoice.dueAmount) {
      toast.error('সঠিক পেমেন্ট পরিমাণ দিন');
      return;
    }

    setIsPaying(true);
    const res = await collectFeePayment({
      invoiceId: selectedInvoice.$id,
      studentId: selectedInvoice.studentId,
      studentDocId: selectedInvoice.studentDocId,
      amount: amountParam,
      paymentMethod,
      recordedBy: 'admin',
    });

    if (res.success) {
      toast.success(`পেমেন্ট সফল! মানি রসিদ: ${res.receiptNo}`);
      setSelectedInvoice(null);
      // Refresh list
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    } else {
      toast.error(res.error || 'পেমেন্ট গ্রহণ ব্যর্থ হয়েছে');
    }

    setIsPaying(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-zinc-200">
        <h2 className="text-lg font-bold kalpurush-font text-zinc-900 mb-4">ফি কালেকশন ও পেমেন্ট (Fee Collection)</h2>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="স্টুডেন্ট আইডি দিন (উদাঃ MDS-2025-1234)"
            className="flex-1 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 kalpurush-font"
          >
            {isSearching ? 'খুঁজছে...' : 'সার্চ করুন'}
          </button>
        </form>
      </Card>

      {invoices.length > 0 && !selectedInvoice && (
        <Card className="p-0 border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 kalpurush-font">
                <tr>
                  <th className="px-6 py-3 font-medium">রসিদ নং (Receipt)</th>
                  <th className="px-6 py-3 font-medium">মাসের নাম</th>
                  <th className="px-6 py-3 font-medium">মোট বিল</th>
                  <th className="px-6 py-3 font-medium">বকেয়া (Due)</th>
                  <th className="px-6 py-3 font-medium">স্ট্যাটাস</th>
                  <th className="px-6 py-3 font-medium">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoices.map((inv) => (
                  <tr key={inv.$id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{inv.receiptNo}</td>
                    <td className="px-6 py-4">{inv.month} ({inv.session})</td>
                    <td className="px-6 py-4">৳ {inv.netAmount}</td>
                    <td className="px-6 py-4 font-semibold text-red-600">৳ {inv.dueAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {inv.status === 'partial' ? 'আংশিক পেমেন্ট' : 'বকেয়া'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSelectInvoice(inv)}
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm kalpurush-font"
                      >
                        পেমেন্ট নিন →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedInvoice && (
        <Card className="p-6 border-zinc-200 bg-cyan-50/30">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold kalpurush-font text-zinc-900">
                পেমেন্ট গ্রহণ: {selectedInvoice.month} ({selectedInvoice.session})
              </h3>
              <p className="text-sm text-zinc-500 kalpurush-font">রসিদ নং: {selectedInvoice.receiptNo}</p>
            </div>
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="text-sm text-zinc-500 hover:text-zinc-900 underline kalpurush-font"
            >
              বাতিল করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold kalpurush-font block text-zinc-700">পেমেন্ট পরিমাণ (টাকা)</label>
              <input
                type="number"
                min="1"
                max={selectedInvoice.dueAmount}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={amountParam}
                onChange={(e) => setAmountParam(Number(e.target.value))}
              />
              <p className="text-xs text-red-600 kalpurush-font">সর্বোচ্চ বকেয়া: ৳ {selectedInvoice.dueAmount}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold kalpurush-font block text-zinc-700">পেমেন্ট মাধ্যম</label>
              <select
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">নগদ (Cash)</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="bank">ব্যাংক (Bank Transfer)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isPaying || amountParam <= 0 || amountParam > selectedInvoice.dueAmount}
            className="w-full rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 kalpurush-font transition-all"
          >
            {isPaying ? 'প্রসেসিং...' : `৳ ${amountParam} পেমেন্ট নিশ্চিত করুন`}
          </button>
        </Card>
      )}
    </div>
  );
}
