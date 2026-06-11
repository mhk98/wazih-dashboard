import { ArrowLeft, Printer } from 'lucide-react';

export default function InvoicePage({ order, onBack }) {
  if (!order) return null;

  const subTotal = order.bill;
  const shipping = 80;
  const discount = 0;
  const paid = order.advance || 0;
  const payable = subTotal + shipping - discount;
  const remaining = payable - paid;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 min-h-full">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          <ArrowLeft size={16} />
          Back To Order
        </button>
        <button
          onClick={handlePrint}
          className="w-9 h-9 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center transition"
          title="Print Invoice"
        >
          <Printer size={16} />
        </button>
      </div>

      {/* ── Invoice Card ── */}
      <div className="max-w-3xl mx-auto my-6 px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden invoice-card">

          {/* ── Header: Logo + Barcode ── */}
          <div className="flex items-start justify-between px-8 pt-8 pb-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-yellow-400"
                style={{ background: 'radial-gradient(circle at 40% 40%, #1a1a2e, #0d0d1a)' }}
              >
                <span className="text-yellow-400 text-2xl font-bold" style={{ fontFamily: 'serif' }}>وجيه</span>
                <span className="text-yellow-300 text-xs font-semibold tracking-wider mt-0.5">Wazih</span>
              </div>
            </div>

            {/* Barcode + Invoice ID */}
            <div className="text-right">
              {/* Barcode visual */}
              <div className="flex justify-end gap-px mb-2">
                {Array.from({ length: 60 }, (_, i) => {
                  const h = [12, 28, 20, 28, 16, 28, 24, 20, 28, 16][i % 10];
                  return (
                    <div
                      key={i}
                      className="bg-gray-900"
                      style={{ width: i % 3 === 0 ? 3 : 1.5, height: h }}
                    />
                  );
                })}
              </div>
              <div className="text-xs text-gray-700 mt-1">
                ইনভয়েস আইডি : <span className="font-bold">#{order.orderId.replace('WZ-', '0000')}</span>
              </div>
              <div className="text-xs text-gray-700 mt-0.5">
                অর্ডার টাইম : <span className="font-semibold">{order.date}</span>
              </div>
            </div>
          </div>

          {/* ── Seller + Delivery Address ── */}
          <div className="grid grid-cols-2 gap-6 px-8 py-4 border-t border-gray-100">
            {/* Seller */}
            <div>
              <div className="text-sm font-bold text-gray-800 mb-2">বিক্রেতা</div>
              <div className="text-sm text-gray-700 leading-relaxed space-y-0.5">
                <div className="font-semibold">Wazih</div>
                <div>wazihpremium@gmail.com</div>
                <div>01992700600</div>
                <div className="text-xs text-gray-500 leading-snug">
                  500/3 - C (খিলগাঁও মডেল কলেজের পিছনের রাস্তা), খিলগাঁও ঢাকা ১২১৯
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="text-right">
              <div className="text-sm font-bold text-gray-800 mb-2">পণ্য ডেলিভারির ঠিকানা</div>
              <div className="text-sm text-gray-700 leading-relaxed space-y-0.5">
                <div className="font-semibold">{order.customer.name}</div>
                <div>{order.customer.phone}</div>
                <div>{order.customer.area}, {order.customer.district}</div>
              </div>
            </div>
          </div>

          {/* ── Product Table ── */}
          <div className="px-8 py-2">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-gray-600 font-semibold">ছবি</th>
                  <th className="px-4 py-2.5 text-left text-gray-600 font-semibold">বিবরণ</th>
                  <th className="px-4 py-2.5 text-center text-gray-600 font-semibold">পরিমান</th>
                  <th className="px-4 py-2.5 text-right text-gray-600 font-semibold">মোট মূল্য</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded flex items-center justify-center text-lg">
                      🧴
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{order.product}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Size: 12ml</div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {order.qty} × {order.bill}৳
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {order.bill}৳
                  </td>
                </tr>

                {/* Summary rows */}
                <SummaryRow label="পণ্যের মোট মূল্য" value={`${subTotal}৳`} />
                <SummaryRow label="ডেলিভারি চার্জ (+)" value={`${shipping}৳`} />
                <SummaryRow label="ছাড় (-)" value={`${discount}৳`} />
                <SummaryRow label="পরিশোধ যোগ্য" value={`${payable}৳`} bold />
                <SummaryRow label="পরিশোধ" value={`${paid}৳`} />
                <SummaryRow label="বাকি" value={`${remaining}৳`} bold highlight />
              </tbody>
            </table>
          </div>

          {/* ── Transaction Table ── */}
          <div className="px-8 py-4">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Transaction Date', 'Payment Getway', 'Transaction ID', 'Account Number', 'Amount'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-gray-600 font-semibold text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2.5 text-xs text-gray-700">{order.date}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-700">Bkash</td>
                  <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                  <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                  <td className="px-4 py-2.5 text-xs text-gray-700">{paid}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div className="px-8 pb-8 pt-2 text-center border-t border-gray-100">
            <div className="text-blue-600 text-sm font-semibold cursor-pointer hover:underline">
              Terms &amp; Conditions
            </div>
            <div className="text-xs text-gray-500 mt-1.5">
              * This is a computer generated invoice, does not require any signature.
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .invoice-card { box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

function SummaryRow({ label, value, bold, highlight }) {
  return (
    <tr className={`border-b border-gray-100 ${highlight ? 'bg-teal-50' : ''}`}>
      <td colSpan={2} />
      <td className={`px-4 py-2 text-sm ${bold ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
        {label}
      </td>
      <td className={`px-4 py-2 text-right text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${highlight ? 'text-teal-700' : ''}`}>
        {value}
      </td>
    </tr>
  );
}
