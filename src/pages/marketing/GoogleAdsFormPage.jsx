import { useState } from 'react';
import { googleAdsService } from '../../services/marketingService';

export default function GoogleAdsFormPage({ mode = 'create', config, onSave, onNavigate }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    conversionId: config?.conversionId || '',
    conversionLabel: config?.conversionLabel || '',
    customerId: config?.customerId || '',
    status: config?.status || 'Active',
  });
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      conversionId: form.conversionId.trim(),
      conversionLabel: form.conversionLabel.trim(),
      customerId: form.customerId.trim(),
      status: form.status,
    };
    try {
      if (isEdit) await googleAdsService.update(config.Id, payload);
      else await googleAdsService.create(payload);
      onSave?.();
      onNavigate('google_ads');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Google Ads {isEdit ? 'Edit' : 'Create'}</h1>
        <button onClick={() => onNavigate('google_ads')} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Manage</button>
      </div>
      <form onSubmit={submit} className="mx-auto max-w-5xl rounded bg-white p-6 shadow-sm">
        {[
          ['conversionId', 'Conversion ID', true],
          ['conversionLabel', 'Conversion Label', true],
          ['customerId', 'Customer ID', false],
        ].map(([key, label, required]) => (
          <label key={key} className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold text-gray-600">{label} {required && '*'}</span>
            <input required={required} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              className="h-10 w-full rounded border border-gray-300 px-3 text-sm outline-none focus:border-indigo-400" />
          </label>
        ))}
        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-semibold text-gray-600">Status</span>
          <button type="button" onClick={() => setForm((p) => ({ ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' }))}
            className={`relative inline-flex h-8 w-[58px] items-center rounded-full ${form.status === 'Active' ? 'bg-sky-500' : 'bg-gray-300'}`}>
            <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${form.status === 'Active' ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </label>
        <button disabled={saving} className="rounded bg-teal-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Submit'}</button>
      </form>
    </div>
  );
}
