import { useState } from 'react';
import { categoryService } from '../../services/productService';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );
}

const inputCls = 'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-400 bg-white';

export default function CategoryEditPage({ category, onNavigate }) {
  const [name, setName] = useState(category?.name || '');
  const [status, setStatus] = useState(category?.status === 'Active' || category?.status === 'active');
  const [imageName, setImageName] = useState('No file chosen');
  const [bannerName, setBannerName] = useState('No file chosen');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setError('');
    setSaving(true);
    try {
      await categoryService.update(category.Id, { name: name.trim(), status: status ? 'Active' : 'Inactive' });
      onNavigate && onNavigate('categories');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">Category Edit</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition"
          >
            ▶ টিউটোরিয়াল দেখুন
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('categories')}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
          >
            Manage
          </button>
        </div>
      </div>

      <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            className={`${inputCls} ${error ? 'border-red-400' : ''}`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <label className="flex items-center border border-gray-300 rounded overflow-hidden cursor-pointer w-full">
            <span className="bg-white border-r border-gray-300 px-3 py-2 text-xs text-gray-600 whitespace-nowrap hover:bg-gray-50 transition">
              Choose file
            </span>
            <span className="px-3 text-xs text-gray-400 flex-1">{imageName}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageName(e.target.files[0]?.name || 'No file chosen')} />
          </label>
          {category?.image && (
            <img src={category.image} alt={category.name} className="w-12 h-12 rounded-full object-cover mt-2 border border-gray-200" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
          <label className="flex items-center border border-gray-300 rounded overflow-hidden cursor-pointer w-full">
            <span className="bg-white border-r border-gray-300 px-3 py-2 text-xs text-gray-600 whitespace-nowrap hover:bg-gray-50 transition">
              Choose file
            </span>
            <span className="px-3 text-xs text-gray-400 flex-1">{bannerName}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setBannerName(e.target.files[0]?.name || 'No file chosen')}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (Optional)</label>
          <input type="text" defaultValue={category?.metaTitle || ''} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (Optional)</label>
          <textarea rows={5} defaultValue={category?.metaDescription || ''} className={`${inputCls} resize-y`} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <Toggle checked={status} onChange={setStatus} />
        </div>

        <div>
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
