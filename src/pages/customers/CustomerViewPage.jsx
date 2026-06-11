import { useOrders } from '../../hooks/useOrders';

const STATUS_COLOR = {
  Delivered:  'text-green-600',
  Confirmed:  'text-blue-600',
  Packaging:  'text-purple-600',
  Pending:    'text-gray-500',
  Incomplete: 'text-orange-500',
  Returned:   'text-red-500',
  Cancelled:  'text-orange-700',
};

export default function CustomerViewPage({ customer, onNavigate, onLoginAs }) {
  const { orders, loading } = useOrders({
    search: customer?.customerPhone ?? '',
    page: 1,
    limit: 50,
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Customer Profile</h1>
        <div className="flex gap-2">
          <button type="button"
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition">
            ▶ টিউটোরিয়াল দেখুন
          </button>
          <button type="button" onClick={() => onNavigate && onNavigate('customer_list')}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Customer List
          </button>
          <button type="button" onClick={() => onLoginAs && onLoginAs(customer)}
            className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            ⇒ Login
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="w-72 flex-shrink-0 bg-white rounded-xl shadow p-5">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-3xl mb-2">
              👤
            </div>
            <p className="font-bold text-gray-800 text-sm">{customer?.customerName ?? '—'}</p>
            <span className={`mt-1 px-2.5 py-0.5 rounded text-[10px] font-semibold ${
              customer?.status === 'Delivered' ? 'bg-teal-100 text-teal-700' :
              customer?.status === 'Cancelled' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {customer?.status ?? '—'}
            </span>
          </div>

          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">About Me :</p>
          <div className="space-y-2">
            {[
              ['Full Name', customer?.customerName    ?? '—'],
              ['Mobile',    customer?.customerPhone   ?? '—'],
              ['Order ID',  customer?.orderId         ?? '—'],
              ['Area',      customer?.customerArea    ?? '—'],
              ['District',  customer?.customerDistrict ?? '—'],
              ['Note',      customer?.customerNote    ?? '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-400 w-20 flex-shrink-0">{label}</span>
                <span className="text-xs text-gray-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-3 text-sm font-bold text-white text-center" style={{ background: '#6366f1' }}>
            Orders
          </div>
          {loading && (
            <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
          )}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['SL', 'Invoice', 'Product', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-gray-500 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders found</td></tr>
                  )}
                  {orders.map((o, i) => (
                    <tr key={o.Id} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                      <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-700">{o.orderId}</td>
                      <td className="px-4 py-2.5 text-gray-700 max-w-xs truncate">{o.productName}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-800">৳{Number(o.totalBill ?? 0).toLocaleString()}</td>
                      <td className={`px-4 py-2.5 font-medium ${STATUS_COLOR[o.status] ?? 'text-gray-500'}`}>
                        {o.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
