import { useState } from 'react';
import { Search, Trash2, Plus, Minus } from 'lucide-react';
import { useSupplierAllList } from '../../hooks/useSuppliers';
import { purchaseService } from '../../services/purchaseService';
import { productService } from '../../services/productService';

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Mobile Banking', 'Cheque', 'Card'];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function PurchaseFormPage({ mode = 'create', purchase, onSave, onNavigate }) {
  const { data: suppliers } = useSupplierAllList();

  const [name, setName] = useState(purchase?.name ?? '');
  const [supplierId, setSupplierId] = useState(purchase?.supplierId ?? '');
  const [items, setItems] = useState(purchase?.items ?? []);
  const [amount, setAmount] = useState(purchase?.amount ?? '');
  const [quantity, setQuantity] = useState(purchase?.quantity ?? '');
  const [paymentMode, setPaymentMode] = useState(purchase?.paymentMode ?? '');
  const [date, setDate] = useState(purchase?.date ?? todayDate());
  const [remarks, setRemarks] = useState(purchase?.remarks ?? '');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(val) {
    setSearch(val);
    if (val.trim().length < 1) { setSuggestions([]); return; }
    try {
      const res = await productService.getAll({ searchTerm: val, limit: 8 });
      setSuggestions((res.data || []).filter((p) => !items.find((i) => i.id === p.Id)));
    } catch {
      setSuggestions([]);
    }
  }

  function addProduct(product) {
    setItems((prev) => [...prev, { id: product.Id, name: product.name, price: product.sale_price || 0, qty: 1 }]);
    setSearch('');
    setSuggestions([]);
  }

  function updateQty(id, delta) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const subTotal = items.reduce((s, it) => s + (it.price * it.qty), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        name,
        supplierId: supplierId ? Number(supplierId) : undefined,
        items,
        amount: amount ? Number(amount) : subTotal,
        quantity: quantity ? Number(quantity) : items.reduce((s, it) => s + it.qty, 0),
        paymentMode: paymentMode || undefined,
        date,
        remarks: remarks || undefined,
      };
      if (mode === 'edit' && purchase?.Id) {
        await purchaseService.update(purchase.Id, payload);
      } else {
        await purchaseService.create(payload);
      }
      onSave && onSave();
      onNavigate && onNavigate('purchase_list');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">
          {mode === 'edit' ? 'Edit Purchase' : 'Add Purchase'}
        </h1>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('purchase_list')}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
        >
          Manage
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          {/* ── Left panel ── */}
          <div className="col-span-2 space-y-3">

            {/* Purchase Title */}
            <div className="bg-white rounded-xl shadow p-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Purchase Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Monthly Stock Purchase"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Product search */}
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-700">Products</p>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search product by name..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-400"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg">
                    {suggestions.map((p) => (
                      <div
                        key={p.Id}
                        onClick={() => addProduct(p)}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                      >
                        {p.name} — {(p.sale_price || 0).toLocaleString()} ৳
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Name', 'Quantity', 'Price', 'Sub Total', 'Action'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-gray-500 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">Search and add products above</td></tr>
                  )}
                  {items.map((it) => (
                    <tr key={it.id} className="border-b border-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-700">{it.name}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => updateQty(it.id, -1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center font-semibold">{it.qty}</span>
                          <button type="button" onClick={() => updateQty(it.id, 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{it.price.toLocaleString()} ৳</td>
                      <td className="px-3 py-2 font-medium text-gray-700">{(it.price * it.qty).toLocaleString()} ৳</td>
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => removeItem(it.id)}
                          className="w-7 h-7 rounded bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Supplier + Payment Mode + Date + Remarks */}
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Supplier</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="">Select Supplier..</option>
                    {suppliers.map((s) => (
                      <option key={s.Id} value={s.Id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="">Select..</option>
                    {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Right summary panel ── */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow overflow-hidden sticky top-4">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-600">Summary</p>
              </div>
              {[
                { label: 'Items Sub Total', value: subTotal },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-700">{value.toLocaleString()} ৳</span>
                </div>
              ))}
              <div className="px-4 py-3 border-b border-gray-100">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Amount</label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={subTotal || '0'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="px-4 py-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Qty</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={items.reduce((s, it) => s + it.qty, 0) || '0'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="mt-4 w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}
        >
          {saving ? 'Saving...' : mode === 'edit' ? 'Update Purchase' : 'Submit Purchase'}
        </button>
      </form>
    </div>
  );
}
