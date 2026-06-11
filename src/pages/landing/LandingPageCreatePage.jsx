import { useState } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, List, ListOrdered, Link, Image, Film,
  Maximize2, Code, HelpCircle, Plus,
} from 'lucide-react';

const PRODUCTS = [
  { id: 1, name: 'Product A' },
  { id: 2, name: 'Product B' },
  { id: 3, name: 'Product C' },
];

const TEMPLATES = [
  'Template Design 1',
  'Template Design 2',
  'Template Design 3',
];

function RichTextEditor({ value, onChange, placeholder = 'Enter Your Text Here' }) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolbarBtn icon={<span className="text-xs font-bold">⚙</span>} />
        <Sep />
        <ToolbarBtn icon={<Bold size={12} />} />
        <ToolbarBtn icon={<Underline size={12} />} />
        <ToolbarBtn icon={<Italic size={12} />} />
        <ToolbarBtn icon={<span className="text-xs font-bold">A̶</span>} />
        <Sep />
        <select className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600 focus:outline-none">
          <option>sans-serif</option>
          <option>serif</option>
          <option>monospace</option>
        </select>
        <Sep />
        <ToolbarBtn icon={<span className="text-xs font-bold px-0.5" style={{ color: '#f59e0b' }}>A</span>} />
        <Sep />
        <ToolbarBtn icon={<List size={12} />} />
        <ToolbarBtn icon={<ListOrdered size={12} />} />
        <ToolbarBtn icon={<AlignLeft size={12} />} />
        <Sep />
        <ToolbarBtn icon={<span className="text-xs">⊞</span>} />
        <Sep />
        <ToolbarBtn icon={<Link size={12} />} />
        <ToolbarBtn icon={<Image size={12} />} />
        <ToolbarBtn icon={<Film size={12} />} />
        <Sep />
        <ToolbarBtn icon={<Maximize2 size={12} />} />
        <ToolbarBtn icon={<Code size={12} />} />
        <ToolbarBtn icon={<HelpCircle size={12} />} />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none"
      />
    </div>
  );
}

function ToolbarBtn({ icon }) {
  return (
    <button
      type="button"
      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors"
    >
      {icon}
    </button>
  );
}

function Sep() {
  return <span className="w-px h-4 bg-gray-300 mx-0.5" />;
}

export default function LandingPageCreatePage({ onNavigate }) {
  const [form, setForm] = useState({
    productId: '',
    bannerImage: null,
    campaignTitle: '',
    subTitle: '',
    shortDescription: '',
    video: '',
    reviewTitle: '',
    reviewImages: [null],
    descriptionTitle: '',
    description: '',
    whyChooseTitle: '',
    whyChooseUs: '',
    countdownTime: '',
    campaignTemplate: TEMPLATES[0],
    status: true,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addReviewImageSlot() {
    setForm((prev) => ({ ...prev, reviewImages: [...prev.reviewImages, null] }));
  }

  function setReviewImage(index, file) {
    setForm((prev) => {
      const updated = [...prev.reviewImages];
      updated[index] = file;
      return { ...prev, reviewImages: updated };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onNavigate && onNavigate('landing_manage');
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">Landing Page Create</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition"
          >
            ▶ টিউটোরিয়াল দেখুন
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('landing_manage')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Products + Banner Image */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Products <span className="text-red-500">*</span>
              </label>
              <select
                value={form.productId}
                onChange={(e) => set('productId', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:border-blue-400"
              >
                <option value="">Choose ...</option>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Banner Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => set('bannerImage', e.target.files[0] ?? null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
              />
            </div>
          </div>

          {/* Campaign Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.campaignTitle}
              onChange={(e) => set('campaignTitle', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Sub Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sub Title (optional)
            </label>
            <input
              type="text"
              value={form.subTitle}
              onChange={(e) => set('subTitle', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={form.shortDescription}
              onChange={(v) => set('shortDescription', v)}
            />
          </div>

          {/* Row: Video + Review Title */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Video (Optional)
              </label>
              <input
                type="text"
                value={form.video}
                onChange={(e) => set('video', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Review Title
              </label>
              <input
                type="text"
                value={form.reviewTitle}
                onChange={(e) => set('reviewTitle', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Review Image(s) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Review Image (Optional)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {form.reviewImages.map((_, idx) => (
                <input
                  key={idx}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReviewImage(idx, e.target.files[0] ?? null)}
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
                />
              ))}
              <button
                type="button"
                onClick={addReviewImageSlot}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Description Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.descriptionTitle}
              onChange={(e) => set('descriptionTitle', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={form.description}
              onChange={(v) => set('description', v)}
            />
          </div>

          {/* Why Choose Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Why Choose Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.whyChooseTitle}
              onChange={(e) => set('whyChooseTitle', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Why Choose Us */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Why Choose Us <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={form.whyChooseUs}
              onChange={(v) => set('whyChooseUs', v)}
            />
          </div>

          {/* Row: Countdown Time + Campaign Template */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Countdown Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.countdownTime}
                onChange={(e) => set('countdownTime', e.target.value)}
                required
                placeholder="e.g. 2025-12-31 23:59:59"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Campaign Template
              </label>
              <select
                value={form.campaignTemplate}
                onChange={(e) => set('campaignTemplate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
              >
                {TEMPLATES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
            <button
              type="button"
              onClick={() => set('status', !form.status)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                form.status ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  form.status ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-6 py-2 rounded-lg transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
