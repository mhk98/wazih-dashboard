import { useState } from 'react';
import { ShoppingCart, Phone, Lock, ArrowLeft } from 'lucide-react';

const SHIPPING_OPTIONS = [
  { id: 'inside', label: 'ঢাকার ভিতরে ৮০ টাকা', charge: 80 },
  { id: 'sub',    label: 'সার এরিয়া ১০০ টাকা',   charge: 100 },
  { id: 'outside',label: 'ঢাকার বাইরে ১৫০ টাকা',  charge: 150 },
];

export default function LandingPageViewPage({ campaign, onBack }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', shipping: '' });
  const price     = campaign?.price ?? 2200;
  const origPrice = campaign?.originalPrice ?? 2500;
  const product   = campaign?.product ?? 'Product';
  const title     = campaign?.campaignTitle ?? campaign?.title ?? 'ধামাকা অফার - শুধু মাত্র আজকের জন্য';
  const subTitle  = campaign?.subTitle ?? 'দেরিতে পণ্য পাবে, না নিলে আজকেই নাও!';
  const desc      = campaign?.shortDescription ?? `<b>Unique Sweet & Fruity Opening</b> – চমৎকারি মিষ্টি ও ফলের সুগন্ধ আপনাকেই অনুভূতি এবং সতেজতার অনুভূতি দেবে।<br/><b>Elegant Floral Heart Notes</b> – মাঝের ফুলেলাল সুগন্ধ সুক্ষ্ম পরিমার্জন ও মনমুগ্ধকর করে তোলে।<br/><b>Long-Lasting Performance</b> – দীর্ঘ সময় ধরে চলা ও গোলাপের সুবাস ধরে রাখার দক্ষতা।<br/><b>Perfect for Daily Wear</b> – অফিসে, কলেজে, ভ্রমণে বা রান্নাঘর ব্যবহারের জন্য উপযুক্ত। <b>Compliment-Getting Fragrance</b> – এর আকর্ষণীয় সুবাস প্রায়ই প্রশংসা কুড়িয়ে আনে।<br/><b>Balanced Sweetness</b> – অতিরিক্তি মিষ্টি নয়, আবার একেবারে তীক্ষ্মও নয়; সুষমভাবে তৈরিকৃত।<br/><b>Luxurious Feel at an Affordable Price</b> – সাশ্রয়ী মূল্যে বিলাসিতা ও প্রাকৃতি সুগন্ধের অভিজ্ঞতা নেওয়া।`;
  const whyTitle  = campaign?.whyChooseTitle ?? 'Why from us';
  const whyDesc   = campaign?.whyChooseUs ?? 'Choose ' + product + ' from us and enjoy an authentic, premium-quality fragrance that combines sweetness, elegance, and long-lasting performance. Every bottle is carefully sourced to ensure genuine quality, making it a perfect choice for daily wear or gifting. Experience a scent that leaves a memorable impression wherever you go.';
  const phone     = campaign?.phone ?? '01992700600';

  const shippingCharge = SHIPPING_OPTIONS.find((o) => o.id === form.shipping)?.charge ?? 0;
  const payable = price + shippingCharge;

  function set(f, v) { setForm((p) => ({ ...p, [f]: v })); }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#eef6e8' }}>
      {/* Back bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={14} />
          Back to Manage
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-400">Preview: {title}</span>
      </div>

      <div className="max-w-2xl mx-auto py-6 px-4 space-y-0">

        {/* ── Hero ── */}
        <section className="text-center pt-4 pb-6">
          <h1
            className="text-2xl font-bold mb-4 leading-snug"
            style={{ color: '#8b1a1a', fontFamily: 'serif' }}
          >
            {title}
          </h1>

          {/* Product image placeholder */}
          <div className="mx-auto mb-5 rounded-lg overflow-hidden"
            style={{ maxWidth: 460, border: '1px solid #c8e6c0' }}>
            <div
              className="w-full flex items-center justify-center text-gray-400 text-sm"
              style={{ height: 280, background: 'linear-gradient(135deg, #d4edda, #b8ddb0)' }}
            >
              <span className="text-4xl">🖼</span>
            </div>
          </div>

          <OrderBtn icon={<ShoppingCart size={16} />} label="অর্ডার করতে ক্লিক করুন" />
        </section>

        {/* ── Tagline ── */}
        <section className="text-center py-3">
          <p className="text-sm text-gray-600">{subTitle}</p>
        </section>

        {/* ── Price ── */}
        <section className="text-center py-5 space-y-1">
          <p className="text-base text-gray-600">
            রেগুলার মূল্য{' '}
            <span className="line-through font-medium">{origPrice.toLocaleString()} /= টাকা</span>
          </p>
          <p className="text-2xl font-bold" style={{ color: '#8b1a1a', fontFamily: 'serif' }}>
            আজকের অফার মূল্য মাত্র{' '}
            <span style={{ color: '#d32f2f' }}>{price.toLocaleString()}/- টাকা</span>
          </p>
          <div className="pt-3">
            <OrderBtn icon={<ShoppingCart size={16} />} label="অর্ডার করতে চাই" />
          </div>
        </section>

        {/* ── Why Special (Description) ── */}
        <section className="py-5 px-2">
          <h2 className="text-xl font-bold text-center mb-4" style={{ color: '#1b5e20', fontFamily: 'serif' }}>
            {campaign?.descriptionTitle ?? `Why ${product} is so special`}
          </h2>
          <div
            className="text-sm text-gray-700 leading-relaxed space-y-1"
            dangerouslySetInnerHTML={{ __html: desc }}
          />
          <div className="text-center mt-5">
            <OrderBtn icon={<Phone size={16} />} label="অর্ডার করতে চাই" />
          </div>
        </section>

        {/* ── Why from us ── */}
        <section className="py-5 px-2 text-center">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#d32f2f', fontFamily: 'serif' }}>
            {whyTitle}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-left">{whyDesc}</p>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow"
              style={{ background: '#2e7d32' }}
            >
              <Phone size={15} />
              {phone}
            </button>
          </div>
        </section>

        {/* ── Order Form ── */}
        <section className="py-4">
          <div
            className="rounded-xl p-5 bg-white"
            style={{ border: '2px solid #e57373' }}
          >
            <h3
              className="text-lg font-bold text-center mb-1"
              style={{ color: '#1b5e20', fontFamily: 'serif' }}
            >
              প্রোডাক্ট সিলেক্ট করুন
            </h3>
            <p className="text-xs text-center mb-4" style={{ color: '#e53935' }}>
              আপনার নাম, মোবাইল নাম্বার এবং ঠিকানা লিখে সাবমিট করুন
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Left – form */}
              <div className="space-y-3">
                <FormField icon="👤" placeholder="আপনার নাম" value={form.name} onChange={(v) => set('name', v)} />
                <FormField icon="📞" placeholder="মোবাইল নাম্বার দিন" value={form.phone} onChange={(v) => set('phone', v)} type="tel" />
                <FormField icon="🏠" placeholder="আপনার সম্পূর্ণ ঠিকানা" value={form.address} onChange={(v) => set('address', v)} />

                <div className="space-y-1.5 pt-1">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={form.shipping === opt.id}
                        onChange={() => set('shipping', opt.id)}
                        className="accent-green-700"
                      />
                      <span className="text-xs text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right – order summary */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">আপনার অর্ডার আইটেম</p>
                {/* Product row */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: '#d4edda' }}
                  >
                    🧴
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{product}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-800 flex-shrink-0">TK. {price.toLocaleString()}</p>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <SummaryRow label="Subtotal" value={`${price.toLocaleString()}TK`} />
                  <SummaryRow
                    label="Shipping Charge (+)"
                    value={form.shipping ? `${shippingCharge}TK` : 'Select Area'}
                    valueClass={form.shipping ? '' : 'text-orange-500'}
                  />
                  <SummaryRow
                    label="Payable Amount"
                    value={`${(form.shipping ? payable : price).toLocaleString()}TK`}
                    bold
                  />
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              className="w-full mt-5 py-3 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 shadow transition hover:opacity-90"
              style={{ background: '#e91e63' }}
            >
              <Lock size={14} />
              অর্ডারটি কনফার্ম করুন
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

function OrderBtn({ icon, label }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full text-white text-sm font-semibold shadow transition hover:opacity-90"
      style={{ background: '#2e7d32' }}
    >
      {icon}
      {label}
    </button>
  );
}

function FormField({ icon, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
      <span className="text-sm">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}

function SummaryRow({ label, value, bold, valueClass = '' }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-semibold text-gray-800' : ''}>{label}</span>
      <span className={`${bold ? 'font-bold text-gray-900' : ''} ${valueClass}`}>{value}</span>
    </div>
  );
}
