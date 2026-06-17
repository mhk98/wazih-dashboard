import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  Phone,
  ShoppingCart,
  Star,
  Truck,
  User,
} from "lucide-react";
import heroImage from "../../assets/hero.png";
import sslcommerzImage from "../../assets/sslcommerz.png";
import { landingPageService } from "../../services/landingPageService";
import { orderService } from "../../services/orderService";

const SHIPPING_OPTIONS = [
  { id: "inside", label: "Inside Dhaka", charge: 80 },
  { id: "outside", label: "Outside Dhaka", charge: 130 },
];

const WINNERS = [
  "রাকিবুল ইসলাম",
  "ফারহানা তানিয়া",
  "মোঃ রনি",
  "মাহিয়া ইমরান",
  "মাকসুদা তামান্না",
  "সোহাগ হোসেন",
  "মোঃ রুবেল",
  "সেলিম উদ্দিন",
  "আসিফ মাহমুদ",
  "রবিন হাসান",
  "প্রান্তির রহমান",
];

export default function LandingPageViewPage({ campaign, onBack }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    shipping: "inside",
    payment: "cod",
    coupon: "",
    agree: false,
  });
  const [landingPages, setLandingPages] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showTrackOrder, setShowTrackOrder] = useState(false);

  const productName = getProductName(campaign);
  const title =
    campaign?.campaignTitle || campaign?.title || "Attar & Perfume Combo Pack";
  const subTitle =
    campaign?.subTitle || "অল্প সময়ে ঘরে বসে প্রিমিয়াম সুগন্ধির কালেকশন পান";
  const price = toNumber(campaign?.price, 699);
  const originalPrice = toNumber(campaign?.originalPrice, 1500);
  const phone = campaign?.phone || "+8808647-222899";
  const shortDescription = stripHtml(campaign?.shortDescription || "");
  const descriptionTitle =
    campaign?.descriptionTitle || "এই ক্যাম্পেইনের বিশেষ অফার";
  const bannerImage = campaign?.bannerImageUrl || heroImage;
  const prizeImageSource = campaign?.prizeImageUrl || "";
  const reviewImages = parseImages(campaign?.reviewImages);
  const deliveryCharge =
    SHIPPING_OPTIONS.find((option) => option.id === form.shipping)?.charge || 0;
  const total = price + deliveryCharge;

  useEffect(() => {
    let active = true;
    landingPageService
      .getAll({ limit: 100 })
      .then((res) => {
        if (!active) return;
        setLandingPages(res.data || []);
      })
      .catch(() => {
        if (active) setLandingPages([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const relatedProducts = useMemo(
    () =>
      landingPages
        .filter((page) => String(page.Id) !== String(campaign?.Id))
        .filter((page) => page.status !== false)
        .slice(0, 6)
        .map((page) => ({
          id: page.Id,
          name: page.title || page.product || "Landing Page",
          price: toNumber(page.price, 0),
          oldPrice: toNumber(page.originalPrice, 0),
          image: getCampaignBannerImage(page),
        })),
    [campaign?.Id, landingPages],
  );

  function set(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handlePlaceOrder() {
    setOrderError("");
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setOrderError(
        "Please enter your name, phone number and delivery address.",
      );
      document
        .getElementById("order-now")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setPlacingOrder(true);
    try {
      const shippingLabel =
        SHIPPING_OPTIONS.find((option) => option.id === form.shipping)?.label ||
        "Inside Dhaka";
      const today = new Date().toISOString().slice(0, 10);
      const payload = {
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerArea: shippingLabel,
        customerDistrict: "",
        productName,
        productImage: "",
        quantity: 1,
        totalBill: total,
        advance: 0,
        courier: "",
        status: "pending",
        note: `Landing Page: ${title}\nAddress: ${form.address.trim()}\nPayment: Cash on Delivery\nProduct price: ${price}\nDelivery charge: ${deliveryCharge}`,
        orderDate: today,
      };
      const response = await orderService.createOrder(payload);
      setPlacedOrder(response.data || payload);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setOrderError(err.message || "Order create failed. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  const template = normalizeTemplate(
    campaign?.template || campaign?.campaignTemplate,
  );
  const viewData = {
    form,
    set,
    productName,
    title,
    subTitle,
    price,
    originalPrice,
    phone,
    shortDescription,
    descriptionTitle,
    bannerImage,
    prizeImageSource,
    reviewImages,
    deliveryCharge,
    total,
    relatedProducts,
    placingOrder,
    orderError,
    onPlaceOrder: handlePlaceOrder,
    onTrackOrder: () => setShowTrackOrder(true),
  };

  if (placedOrder) {
    return (
      <OrderSuccessPage
        order={placedOrder}
        form={form}
        productName={productName}
        productImage={bannerImage}
        price={price}
        deliveryCharge={deliveryCharge}
        total={total}
        phoneNumber={phone}
        onContinue={() => setPlacedOrder(null)}
        onTrack={() => {
          setPlacedOrder(null);
          setShowTrackOrder(true);
        }}
      />
    );
  }

  if (showTrackOrder) {
    return <TrackOrderPage phoneNumber={phone} onBack={() => setShowTrackOrder(false)} />;
  }

  if (template === "Template Design 2") {
    return (
      <PreviewShell title={title} onBack={onBack} tone="light">
        <TemplateDesign2 data={viewData} />
      </PreviewShell>
    );
  }

  if (template === "Template Design 3") {
    return (
      <PreviewShell title={title} onBack={onBack} tone="dark">
        <TemplateDesign3 data={viewData} />
      </PreviewShell>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#fbfaf6] text-slate-900">
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={14} />
          Back to Manage
        </button>
        <span className="text-slate-300">|</span>
        <span className="truncate text-xs text-slate-400">
          Preview: {title}
        </span>
      </div>

      <div
        className="min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 16%, rgba(211, 172, 76, 0.08) 0 48px, transparent 49px), radial-gradient(circle at 84% 20%, rgba(211, 172, 76, 0.07) 0 58px, transparent 59px), linear-gradient(90deg, rgba(248, 246, 238, 0.92), rgba(255,255,255,0.8), rgba(248,246,238,0.92))",
        }}
      >
        <TopStrip phone={phone} onTrack={() => setShowTrackOrder(true)} />

        <main className="mx-auto max-w-[1340px] px-4 pb-12">
          <header className="py-4 text-center">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white shadow-sm">
              W
            </div>
          </header>

          <Notice tone="yellow">
            আজকে কিনুন ৫ পিস আতর পারফিউম কম্বো প্যাকের সাথে নিশ্চিত ২ টি
            পুরস্কার
            <br />
            <span className="text-emerald-700">
              পণ্যটিতে থাকছে খুবই সাশ্রয়ী দামে সুগন্ধির কালেকশন
            </span>
          </Notice>
          <Notice tone="purple">
            কাস্টমারদের মধ্যে আগের ক্যাম্পেইনে বাইক বিজয়ী হয়েছেন
            <br />
            <span className="text-emerald-700">
              প্রতিটি অর্ডারের সাথে থাকছে আকর্ষণীয় অফার
            </span>
          </Notice>

          <div className="mt-3 text-center">
            <JumpButton targetId="order-now">অর্ডার করুন</JumpButton>
          </div>

          <section className="mx-auto mt-5 max-w-[1340px] overflow-hidden rounded border border-amber-100 bg-[#24170d] shadow-sm">
            <img
              src={bannerImage}
              alt={productName}
              className="h-[clamp(240px,42vw,560px)] w-full object-cover"
            />
          </section>

          <SectionBadge>এই ক্যাম্পেইনের পুরস্কার</SectionBadge>

          <section className="mx-auto max-w-[1340px] overflow-hidden rounded border border-slate-200 bg-sky-100 shadow-sm">
            {prizeImageSource ? (
              <img
                src={prizeImageSource}
                alt="Campaign prize"
                className="h-[clamp(240px,42vw,560px)] w-full object-cover"
              />
            ) : (
              <div className="grid min-h-[300px] items-center gap-4 bg-gradient-to-br from-sky-300 via-white to-slate-200 p-8 md:grid-cols-[0.85fr_1fr]">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 p-5 text-center text-white shadow-xl">
                  <p className="text-sm font-bold">SCRATCH CARD</p>
                  <p className="mt-1 text-4xl font-black">R15</p>
                  <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-red-600">
                    স্বপ্নপূরণ ক্যাম্পেইন
                  </p>
                  <p className="mt-4 text-xs">
                    প্রতি অর্ডারে থাকছে পুরস্কার জেতার সুযোগ
                  </p>
                </div>
                <div className="relative min-h-[210px]">
                  <div className="absolute bottom-8 left-6 h-20 w-64 -skew-x-12 rounded-full bg-blue-800 shadow-2xl" />
                  <div className="absolute bottom-20 left-20 h-24 w-36 rounded-t-full border-[18px] border-blue-700" />
                  <div className="absolute bottom-5 left-2 h-20 w-20 rounded-full border-[14px] border-slate-950 bg-slate-700" />
                  <div className="absolute bottom-5 right-24 h-20 w-20 rounded-full border-[14px] border-slate-950 bg-slate-700" />
                  <div className="absolute right-10 top-4 rounded-full bg-white px-5 py-3 text-center text-xl font-black text-sky-700 shadow-lg">
                    স্বপ্নপূরণ
                    <span className="block text-sm text-red-500">
                      ক্যাম্পেইন
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          <SectionBadge>আগের ক্যাম্পেইনের বাইক বিজয়ী</SectionBadge>

          <section className="mx-auto mt-4 max-w-[1340px] rounded border border-orange-100 bg-white/90 p-5 shadow-sm">
            <h2 className="text-center text-2xl font-black text-slate-800">
              আগের ক্যাম্পেইনের{" "}
              <span className="text-red-600">১১ জন বাইক বিজয়ী</span>
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {WINNERS.map((winner, index) => (
                <WinnerCard
                  key={winner}
                  name={winner}
                  index={index}
                  image={
                    reviewImages.length
                      ? reviewImages[index % reviewImages.length]
                      : ""
                  }
                />
              ))}
            </div>
          </section>

          <div className="mx-auto mt-5 max-w-xs rounded border border-emerald-200 bg-gradient-to-r from-rose-50 to-emerald-50 p-4 text-center shadow-sm">
            <p className="text-xs text-slate-600">
              পূর্বের মূল্য{" "}
              <span className="line-through">
                {formatMoney(originalPrice)} টাকা
              </span>
            </p>
            <p className="mt-1 text-lg font-black text-emerald-700">
              অফার মূল্য - {formatMoney(price)} টাকা
            </p>
          </div>

          <section id="order-now" className="mt-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">
                Complete Your Order
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Fill in your details to place your order
              </p>
            </div>

            <div className="mx-auto mt-5 grid max-w-[1340px] gap-4 md:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-4">
                <CheckoutPanel
                  title="Customer Information"
                  icon={<User size={15} />}
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      label="Full Name *"
                      value={form.name}
                      onChange={(value) => set("name", value)}
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Phone Number *"
                      value={form.phone}
                      onChange={(value) => set("phone", value)}
                      placeholder="+880-XXX-XXX-XXX"
                      type="tel"
                    />
                  </div>
                  <Input
                    label="Delivery Address *"
                    value={form.address}
                    onChange={(value) => set("address", value)}
                    placeholder="e.g. house, road, city"
                  />
                </CheckoutPanel>

                <CheckoutPanel
                  title="Delivery Options"
                  icon={<Truck size={15} />}
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    {SHIPPING_OPTIONS.map((option) => (
                      <RadioOption
                        key={option.id}
                        selected={form.shipping === option.id}
                        label={option.label}
                        price={option.charge}
                        onClick={() => set("shipping", option.id)}
                      />
                    ))}
                  </div>
                </CheckoutPanel>

                <CheckoutPanel
                  title="Payment Method"
                  icon={<CreditCard size={15} />}
                >
                  <RadioOption
                    selected={form.payment === "cod"}
                    label="Cash on Delivery"
                    price={0}
                    note="Pay cash when you get your product"
                    onClick={() => set("payment", "cod")}
                  />
                </CheckoutPanel>
              </div>

              <aside className="space-y-4">
                <div className="rounded border border-blue-200 bg-blue-50 p-4">
                  <h3 className="text-xs font-bold text-blue-700">
                    Campaign Product
                  </h3>
                  <div className="mt-3 flex items-center gap-3 rounded border border-emerald-300 bg-white p-3">
                    <img
                      src={bannerImage}
                      alt={productName}
                      className="h-12 w-16 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black text-slate-800">
                        {productName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Special campaign offer
                      </p>
                    </div>
                    <p className="text-sm font-black text-emerald-700">
                      {formatMoney(price)}
                    </p>
                  </div>
                </div>

                <div className="rounded border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-black text-slate-900">
                    Order Summary
                  </h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <SummaryRow
                      label="Product"
                      value={`BDT ${formatMoney(price)}`}
                    />
                    <SummaryRow
                      label="Delivery"
                      value={`BDT ${formatMoney(deliveryCharge)}`}
                    />
                    <div className="flex gap-2 pt-1">
                      <input
                        value={form.coupon}
                        onChange={(event) => set("coupon", event.target.value)}
                        placeholder="Enter coupon code"
                        className="min-w-0 flex-1 rounded border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        className="rounded bg-emerald-100 px-3 text-xs font-bold text-emerald-700"
                      >
                        Apply
                      </button>
                    </div>
                    <SummaryRow
                      label="Total"
                      value={`BDT ${formatMoney(total)}`}
                      strong
                    />
                    <SummaryRow label="Pay Now" value="BDT 0.00" />
                    <SummaryRow
                      label="Due on Delivery"
                      value={`BDT ${formatMoney(total)}`}
                      strong
                      highlight
                    />
                  </div>
                </div>

                <div className="rounded border border-amber-100 bg-amber-50 p-4">
                  <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(event) => set("agree", event.target.checked)}
                      className="mt-0.5 accent-blue-600"
                    />
                    I agree to the Terms and Privacy Policy
                  </label>
                  {orderError ? (
                    <p className="mt-3 rounded bg-red-50 px-3 py-2 text-xs font-bold text-red-500">
                      {orderError}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-indigo-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Lock size={14} />
                    {placingOrder ? "Placing..." : "Place Order"}
                  </button>
                </div>
              </aside>
            </div>
          </section>

          <section className="mt-10 text-center">
            <h2 className="text-lg font-black text-slate-900">
              You Might Also Like
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              More campaigns you may like
            </p>
            <div className="mx-auto mt-5 grid max-w-[1340px] gap-4 md:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} item={item} image={item.image} />
              ))}
            </div>
          </section>

          {shortDescription ? (
            <section className="mx-auto mt-8 max-w-[1340px] rounded border border-slate-200 bg-white/80 p-5 text-sm leading-7 text-slate-600">
              <h2 className="mb-2 text-lg font-black text-slate-900">
                {descriptionTitle}
              </h2>
              {shortDescription}
            </section>
          ) : null}
        </main>

        <Footer phone={phone} />
      </div>
    </div>
  );
}

function PreviewShell({ title, onBack, tone = "light", children }) {
  return (
    <div
      className={`flex-1 overflow-y-auto ${tone === "dark" ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}
    >
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 text-slate-900 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={14} />
          Back to Manage
        </button>
        <span className="text-slate-300">|</span>
        <span className="truncate text-xs text-slate-400">
          Preview: {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function OrderSuccessPage({
  order,
  form,
  productName,
  productImage,
  price,
  deliveryCharge,
  total,
  phoneNumber,
  onContinue,
  onTrack,
}) {
  const orderNumber = order.orderId || `#${order.Id || "Pending"}`;
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 text-slate-900">
      <TopStrip phone={phoneNumber} onTrack={onTrack} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Thank you for your order. We've received your request and will
            process it shortly.
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="inline-flex items-center gap-2 text-sm font-black text-blue-800">
              <ShoppingCart size={16} />
              Order Summary
            </h2>
          </div>
          <div className="p-5">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Order Information
                </h3>
                <InfoRow label="Order Number:" value={orderNumber} />
                <InfoRow
                  label="Order Date:"
                  value={orderDate.toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
                <InfoRow label="Payment Status:" value="Unpaid" danger />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Delivery Information
                </h3>
                <p className="mt-3 text-xs text-slate-600">
                  Contact:{" "}
                  <span className="font-bold text-slate-900">{form.name}</span>
                </p>
                <p className="text-xs text-slate-600">{form.phone}</p>
                <p className="mt-2 text-xs text-slate-600">
                  Address:{" "}
                  <span className="font-bold text-slate-900">
                    {form.address}
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Delivery Zone:{" "}
                  <span className="font-bold text-slate-900">
                    {order.customerArea || "Inside Dhaka"}
                  </span>
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <h3 className="text-sm font-black text-slate-900">Order Items</h3>
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-slate-50 p-4">
              <img
                src={productImage || heroImage}
                alt={productName}
                className="h-16 w-16 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">
                  {productName}
                </p>
                <p className="mt-2 text-xs text-slate-500">Quantity: 1</p>
              </div>
              <div className="text-right text-sm font-black text-slate-900">
                BDT {formatMoney(price)} × 1
                <p className="text-xs text-blue-600">
                  BDT {formatMoney(price)}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
              <InfoRow
                label="Delivery Charge:"
                value={`BDT ${formatMoney(deliveryCharge)}`}
              />
              <div className="flex items-center justify-between pt-2 text-lg font-black">
                <span>Total:</span>
                <span className="text-blue-600">BDT {formatMoney(total)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-slate-900">What's Next?</h2>
          <Step
            number="1"
            title="Order Confirmation"
            text="You will receive a confirmation call within 2-4 hours to verify your order details."
          />
          <Step
            number="2"
            title="Processing"
            text="Once confirmed, your order will be processed and prepared for delivery."
          />
          <Step
            number="3"
            title="Delivery"
            text="Your order will be delivered to your address within 2-5 business days."
          />
        </section>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onContinue}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-bold text-white"
          >
            Back to Landing Page
          </button>
          <button
            type="button"
            onClick={onTrack}
            className="ml-3 rounded bg-slate-800 px-5 py-2 text-sm font-bold text-white"
          >
            Track Order
          </button>
        </div>
      </main>
      <Footer phone={phoneNumber} />
    </div>
  );
}

function InfoRow({ label, value, danger }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-4 text-xs">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-right font-bold ${danger ? "text-orange-600" : "text-slate-900"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="mt-5 flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-600">
        {number}
      </span>
      <div>
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function TrackOrderPage({ phoneNumber, onBack }) {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function searchOrders() {
    setError("");
    setSearched(true);
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.trackOrders(phone.trim());
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message || "Order lookup failed.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f0e8] text-slate-900">
      <TopStrip phone={phoneNumber} onTrack={() => document.getElementById("track-order-search")?.scrollIntoView({ behavior: "smooth", block: "start" })} />
      <main
        className="min-h-screen px-4 py-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,240,232,.88), rgba(244,240,232,.92)), radial-gradient(circle at 20% 20%, rgba(255,255,255,.9), transparent 34%), radial-gradient(circle at 70% 25%, rgba(255,255,255,.7), transparent 30%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-800 text-white shadow">
              <Package size={38} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">
                Track Your Order
              </h1>
              <p className="mt-2 text-lg font-semibold text-slate-500">
                Monitor your order journey from placement to delivery with
                real-time updates
              </p>
            </div>
          </div>

          <section id="track-order-search" className="mt-6 rounded-xl border border-white/80 bg-white/85 p-8 text-center shadow-sm backdrop-blur">
            <h2 className="text-2xl font-black text-slate-900">
              Search Your Order
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Enter your phone number to find all your orders
            </p>
            <div className="mx-auto mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label className="relative min-w-0 flex-1">
                <Phone
                  size={22}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") searchOrders();
                  }}
                  placeholder="Enter your phone number (e.g. 01712345678)"
                  className="w-full rounded-lg border border-slate-200 bg-white px-12 py-4 text-sm font-semibold outline-none transition focus:border-blue-500"
                />
              </label>
              <button
                type="button"
                onClick={searchOrders}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-8 py-4 text-sm font-black text-white shadow transition hover:bg-slate-900 disabled:opacity-60"
              >
                <Truck size={18} />
                {loading ? "Searching..." : "Search Orders"}
              </button>
            </div>
            <p className="mt-5 text-sm font-semibold text-slate-500">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
              Secure and fast order lookup
            </p>
            {error ? (
              <p className="mt-4 text-sm font-bold text-red-500">{error}</p>
            ) : null}
          </section>

          {searched && !loading && !error ? (
            <section className="mt-6">
              {orders.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm font-bold text-slate-500 shadow-sm">
                  No orders found for this phone number.
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <TrackedOrderCard key={order.Id} order={order} />
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </div>
      </main>
      <Footer phone={phoneNumber} />
    </div>
  );
}

function TrackedOrderCard({ order }) {
  const status = String(order.status || "pending").replace(/_/g, " ");
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-slate-400">
            Order Number
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-900">
            {order.orderId}
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {order.productName}
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black capitalize text-blue-700">
          {status}
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <InfoTile label="Customer" value={order.customerName} />
        <InfoTile label="Phone" value={order.customerPhone} />
        <InfoTile label="Total" value={`BDT ${formatMoney(order.totalBill)}`} />
      </div>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value || "-"}</p>
    </div>
  );
}

function TemplateDesign2({ data }) {
  const {
    productName,
    title,
    subTitle,
    price,
    originalPrice,
    phone,
    shortDescription,
    descriptionTitle,
    bannerImage,
    prizeImageSource,
    reviewImages,
    relatedProducts,
    onTrackOrder,
  } = data;

  return (
    <div className="min-h-screen bg-[#f7fbf8]">
      <TopStrip phone={phone} onTrack={onTrackOrder} />
      <main className="mx-auto max-w-6xl px-4 pb-14">
        <section className="grid min-h-[520px] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded border border-emerald-100 bg-white shadow-sm">
            <img
              src={bannerImage}
              alt={productName}
              className="h-[460px] w-full object-cover"
            />
          </div>
          <div>
            <span className="inline-flex rounded bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
              Premium Campaign
            </span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              {subTitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PricePill price={price} originalPrice={originalPrice} />
              <JumpButton targetId="order-now">অর্ডার করুন</JumpButton>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {["Authentic Product", "Fast Delivery", "Cash on Delivery"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <PrizeShowcase
            prizeImageSource={prizeImageSource}
            productName={productName}
          />
          <DescriptionBlock title={descriptionTitle} text={shortDescription} />
        </section>

        <WinnerGrid reviewImages={reviewImages} title="Campaign Winners" />
        <OrderFormBlock data={data} />
        <RelatedProductsSection
          relatedProducts={relatedProducts}
          bannerImage={bannerImage}
        />
      </main>
      <Footer phone={phone} />
    </div>
  );
}

function TemplateDesign3({ data }) {
  const {
    productName,
    title,
    subTitle,
    price,
    originalPrice,
    phone,
    shortDescription,
    descriptionTitle,
    bannerImage,
    prizeImageSource,
    reviewImages,
    onTrackOrder,
  } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs font-bold text-slate-300">
          <span>Wazih Campaign</span>
          <button
            type="button"
            onClick={onTrackOrder}
            className="text-amber-300 hover:text-amber-200"
          >
            Track Order
          </button>
          <span>{phone}</span>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-14">
        <section className="grid gap-6 py-8 lg:grid-cols-[1fr_420px]">
          <div className="overflow-hidden rounded border border-white/10 bg-white text-slate-950">
            <div className="relative min-h-[430px]">
              <img
                src={bannerImage}
                alt={productName}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="relative z-10 max-w-2xl px-6 py-10 text-white md:px-10">
                <span className="rounded bg-red-500 px-3 py-1 text-xs font-black uppercase">
                  Limited Offer
                </span>
                <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">
                  {subTitle}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <PricePill price={price} originalPrice={originalPrice} dark />
                  <JumpButton targetId="order-now">এখনই অর্ডার</JumpButton>
                </div>
              </div>
            </div>
          </div>

          <div
            id="order-now"
            className="rounded border border-emerald-400/40 bg-white p-4 text-slate-950 shadow-2xl"
          >
            <h2 className="text-xl font-black">Quick Order</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Order summary and customer information
            </p>
            <div className="mt-4">
              <OrderFormBlock data={data} compact />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-black text-emerald-300">Product</h3>
            <p className="mt-2 text-2xl font-black">{productName}</p>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-black text-emerald-300">Offer Price</h3>
            <p className="mt-2 text-2xl font-black">
              {formatMoney(price)} টাকা
            </p>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-black text-emerald-300">
              Regular Price
            </h3>
            <p className="mt-2 text-2xl font-black line-through opacity-70">
              {formatMoney(originalPrice)} টাকা
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded border border-white/10 bg-white p-5 text-slate-900">
            <DescriptionBlock
              title={descriptionTitle}
              text={shortDescription}
            />
          </div>
          <PrizeShowcase
            prizeImageSource={prizeImageSource}
            productName={productName}
            dark
          />
        </section>

        <WinnerGrid reviewImages={reviewImages} title="Customer Proof" dark />
      </main>
      <Footer phone={phone} />
    </div>
  );
}

function PricePill({ price, originalPrice, dark }) {
  return (
    <div
      className={`rounded px-5 py-3 shadow-sm ${dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}
    >
      <p className="text-xs font-bold opacity-70">
        Regular{" "}
        <span className="line-through">{formatMoney(originalPrice)} টাকা</span>
      </p>
      <p className="text-2xl font-black">Offer {formatMoney(price)} টাকা</p>
    </div>
  );
}

function PrizeShowcase({ prizeImageSource, productName, dark }) {
  return (
    <section
      className={`overflow-hidden rounded border shadow-sm ${dark ? "border-white/10 bg-white/10" : "border-slate-200 bg-white"}`}
    >
      <div className="border-b border-slate-200 px-5 py-3">
        <h2
          className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}
        >
          Campaign Prize
        </h2>
      </div>
      {prizeImageSource ? (
        <img
          src={prizeImageSource}
          alt={`${productName} prize`}
          className="h-80 w-full object-cover"
        />
      ) : (
        <div className="grid min-h-[320px] place-items-center bg-gradient-to-br from-cyan-100 via-white to-amber-100 p-8 text-center text-slate-900">
          <div>
            <p className="text-sm font-black uppercase text-red-600">
              Reward Campaign
            </p>
            <p className="mt-2 text-4xl font-black">Special Gift</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              প্রতি অর্ডারে থাকছে আকর্ষণীয় পুরস্কারের সুযোগ
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function DescriptionBlock({ title, text }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {text ||
          "এই ক্যাম্পেইনে প্রিমিয়াম পণ্য, সহজ অর্ডার, দ্রুত ডেলিভারি এবং ক্যাশ অন ডেলিভারি সুবিধা আছে।"}
      </p>
    </section>
  );
}

function WinnerGrid({ reviewImages, title, dark }) {
  return (
    <section
      className={`mt-8 rounded border p-5 shadow-sm ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
    >
      <h2
        className={`text-center text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {WINNERS.slice(0, 8).map((winner, index) => (
          <WinnerCard
            key={winner}
            name={winner}
            index={index}
            image={
              reviewImages.length
                ? reviewImages[index % reviewImages.length]
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}

function OrderFormBlock({ data, compact }) {
  const {
    form,
    set,
    productName,
    price,
    bannerImage,
    deliveryCharge,
    total,
    placingOrder,
    orderError,
    onPlaceOrder,
  } = data;

  return (
    <section
      id={compact ? undefined : "order-now"}
      className={compact ? "" : "mt-8"}
    >
      {!compact ? (
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Complete Your Order
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Fill in your details to place your order
          </p>
        </div>
      ) : null}

      <div
        className={`mt-5 grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-[1.25fr_0.75fr]"}`}
      >
        <div className="space-y-4">
          <CheckoutPanel title="Customer Information" icon={<User size={15} />}>
            <div
              className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}
            >
              <Input
                label="Full Name *"
                value={form.name}
                onChange={(value) => set("name", value)}
                placeholder="Enter your full name"
              />
              <Input
                label="Phone Number *"
                value={form.phone}
                onChange={(value) => set("phone", value)}
                placeholder="+880-XXX-XXX-XXX"
                type="tel"
              />
            </div>
            <Input
              label="Delivery Address *"
              value={form.address}
              onChange={(value) => set("address", value)}
              placeholder="e.g. house, road, city"
            />
          </CheckoutPanel>

          <CheckoutPanel title="Delivery Options" icon={<Truck size={15} />}>
            <div
              className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}
            >
              {SHIPPING_OPTIONS.map((option) => (
                <RadioOption
                  key={option.id}
                  selected={form.shipping === option.id}
                  label={option.label}
                  price={option.charge}
                  onClick={() => set("shipping", option.id)}
                />
              ))}
            </div>
          </CheckoutPanel>

          <CheckoutPanel title="Payment Method" icon={<CreditCard size={15} />}>
            <RadioOption
              selected={form.payment === "cod"}
              label="Cash on Delivery"
              price={0}
              note="Pay cash when you get your product"
              onClick={() => set("payment", "cod")}
            />
          </CheckoutPanel>
        </div>

        <aside className="space-y-4">
          <div className="rounded border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-xs font-bold text-blue-700">
              Campaign Product
            </h3>
            <div className="mt-3 flex items-center gap-3 rounded border border-emerald-300 bg-white p-3">
              <img
                src={bannerImage}
                alt={productName}
                className="h-12 w-16 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-slate-800">
                  {productName}
                </p>
                <p className="text-xs text-slate-500">Special campaign offer</p>
              </div>
              <p className="text-sm font-black text-emerald-700">
                {formatMoney(price)}
              </p>
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-4 text-slate-900">
            <h3 className="text-sm font-black">Order Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <SummaryRow label="Product" value={`BDT ${formatMoney(price)}`} />
              <SummaryRow
                label="Delivery"
                value={`BDT ${formatMoney(deliveryCharge)}`}
              />
              <div className="flex gap-2 pt-1">
                <input
                  value={form.coupon}
                  onChange={(event) => set("coupon", event.target.value)}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 rounded border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  className="rounded bg-emerald-100 px-3 text-xs font-bold text-emerald-700"
                >
                  Apply
                </button>
              </div>
              <SummaryRow
                label="Total"
                value={`BDT ${formatMoney(total)}`}
                strong
              />
              <SummaryRow label="Pay Now" value="BDT 0.00" />
              <SummaryRow
                label="Due on Delivery"
                value={`BDT ${formatMoney(total)}`}
                strong
                highlight
              />
            </div>
          </div>

          <div className="rounded border border-amber-100 bg-amber-50 p-4">
            <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(event) => set("agree", event.target.checked)}
                className="mt-0.5 accent-blue-600"
              />
              I agree to the Terms and Privacy Policy
            </label>
            {orderError ? (
              <p className="mt-3 rounded bg-red-50 px-3 py-2 text-xs font-bold text-red-500">
                {orderError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={onPlaceOrder}
              disabled={placingOrder}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-indigo-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={14} />
              {placingOrder ? "Placing..." : "Place Order"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function RelatedProductsSection({ relatedProducts }) {
  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-10 text-center">
      <h2 className="text-lg font-black text-slate-900">You Might Also Like</h2>
      <p className="mt-1 text-xs text-slate-500">More campaigns you may like</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {relatedProducts.map((item) => (
          <ProductCard key={item.id} item={item} image={item.image} />
        ))}
      </div>
    </section>
  );
}

function TopStrip({ phone, onTrack }) {
  return (
    <div className="bg-[#1d1d1b] text-white">
      <div className="mx-auto flex max-w-[980px] items-center justify-between px-4 py-2 text-[11px]">
        <p>Need any help? Call {phone} or contact support</p>
        <div className="flex items-center gap-3 text-amber-300">
          <button
            type="button"
            onClick={onTrack}
            className="font-bold hover:text-amber-100"
          >
            Track your order
          </button>
          <div className="flex items-center gap-2">
            <SocialIcon type="facebook" label="Facebook" />
            <SocialIcon type="youtube" label="YouTube" />
            <SocialIcon type="instagram" label="Instagram" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({
  type,
  label,
  className = "h-5 w-5 text-amber-300 hover:bg-white/10 hover:text-amber-100",
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full transition ${className}`}
    >
      {type === "facebook" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-current"
        >
          <path d="M14.2 8.1h2.2V4.4c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.3 2-5.3 5.6v3.1H4.4V17h3.5v7h4.2v-7h3.3l.5-4.1h-3.8V10.2c0-1.2.3-2.1 2.1-2.1Z" />
        </svg>
      ) : null}
      {type === "youtube" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 fill-current"
        >
          <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      ) : null}
      {type === "instagram" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.3]"
        >
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.4" />
          <circle
            cx="16.9"
            cy="7.1"
            r="0.8"
            className="fill-current stroke-0"
          />
        </svg>
      ) : null}
      {type === "tiktok" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-current"
        >
          <path d="M17.4 6.1a5.7 5.7 0 0 0 3.4 1.1v3.5a9.2 9.2 0 0 1-3.5-.7v5.3a5.9 5.9 0 1 1-5.9-5.9c.4 0 .8 0 1.2.1v3.7a2.3 2.3 0 1 0 1.1 2V2.8h3.7v3.3Z" />
        </svg>
      ) : null}
    </button>
  );
}

function Notice({ children, tone }) {
  const classes =
    tone === "yellow"
      ? "border-yellow-100 bg-yellow-100/80 text-red-600"
      : "border-indigo-100 bg-indigo-100/80 text-red-600";

  return (
    <div
      className={`mx-auto mt-2 max-w-[720px] rounded border px-5 py-3 text-center text-[17px] font-black leading-8 ${classes}`}
    >
      {children}
    </div>
  );
}

function JumpButton({ children, targetId }) {
  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="inline-flex items-center gap-2 rounded bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
    >
      <ShoppingCart size={14} />
      {children}
    </button>
  );
}

function SectionBadge({ children }) {
  return (
    <div className="my-4 text-center">
      <span className="inline-flex rounded border border-blue-200 bg-white px-7 py-3 text-2xl font-black text-red-600 shadow-sm">
        {children}
      </span>
    </div>
  );
}

function WinnerCard({ name, index, image }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-rose-200 via-amber-100 to-sky-200">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute left-3 top-3 h-14 w-14 rounded-full bg-white/80" />
            <div className="absolute inset-x-3 bottom-3 h-9 rounded bg-black/70" />
          </>
        )}
        <div className="absolute bottom-2 right-3 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black text-white shadow">
          #{index + 1}
        </div>
      </div>
      <div className="px-2.5 py-2 text-center">
        <p className="truncate text-sm font-black text-red-600">{name}</p>
        <p className="text-[11px] font-bold text-slate-500">R15 বাইক বিজয়ী</p>
      </div>
    </div>
  );
}

function CheckoutPanel({ title, icon, children }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-black text-slate-800">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block text-left">
      <span className="mb-1 block text-xs font-bold text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
      />
    </label>
  );
}

function RadioOption({ selected, label, price, note, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded border p-3 text-left transition ${
        selected
          ? "border-blue-400 bg-blue-50 ring-1 ring-blue-200"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
          <span
            className={`h-2.5 w-2.5 rounded-full ${selected ? "bg-orange-500" : "bg-slate-300"}`}
          />
          {label}
        </span>
        {price ? (
          <span className="text-xs font-black text-blue-600">{price}</span>
        ) : null}
      </span>
      {note ? (
        <span className="mt-1 block pl-4 text-xs text-slate-500">{note}</span>
      ) : null}
    </button>
  );
}

function SummaryRow({ label, value, strong, highlight }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0">
      <span
        className={`${strong ? "font-black text-slate-900" : "text-slate-600"}`}
      >
        {label}
      </span>
      <span
        className={`${strong ? "font-black" : "font-semibold"} ${highlight ? "text-emerald-700" : "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

function ProductCard({ item, image }) {
  function openLandingPage() {
    if (!item.id) return;
    window.location.assign(`/?landingPageId=${item.id}`);
  }

  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white text-left shadow-sm">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 via-white to-emerald-100">
        {image ? (
          <img
            src={image}
            alt={item.name}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 px-5 text-center text-xs font-black text-slate-400">
            No banner image
          </div>
        )}
        <span className="absolute right-2 top-2 rounded bg-white px-2 py-1 text-[10px] font-black text-red-600 shadow">
          40% Off
        </span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-black text-slate-800">
          {item.name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={12} fill="currentColor" />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-black text-red-600">
            {formatMoney(item.price)}
          </span>
          <span className="text-xs text-slate-400 line-through">
            {formatMoney(item.oldPrice)}
          </span>
        </div>
        <button
          type="button"
          onClick={openLandingPage}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-orange-500 px-3 py-2 text-xs font-black text-white"
        >
          <ShoppingCart size={13} />
          Buy
        </button>
      </div>
    </div>
  );
}

function Footer({ phone }) {
  return (
    <footer className="bg-[#20211f] text-slate-300">
      <div className="mx-auto max-w-[1340px] px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.65fr_0.75fr_0.75fr_1fr]">
          <div>
            <div className="flex items-center gap-3 text-xl font-black text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-white text-sm text-amber-500 shadow-sm">
                W
              </span>
              ওয়াজিহ
            </div>
            <p className="mt-7 text-md font-medium text-slate-400">
              Customer Supports:
            </p>
            <p className="mt-3 text-md font-black tracking-wide text-white">
              {phone}
            </p>
            <p className="mt-7 max-w-xl text-base font-medium leading-7 text-slate-400">
              Corporate and promotional gift item supplier in Bangladesh
            </p>
            <p className="mt-3 text-base font-medium text-slate-400">
              500/3 Khilgaon Niribili Society, Dhaka Bangladesh
            </p>
          </div>

          <FooterLinks
            title="Quick Links"
            links={[
              "Customer Support",
              "All Products",
              "Categories",
              "Track My Order",
            ]}
          />

          <div>
            <h3 className="text-xl font-black text-white">Follow Us</h3>
            <ul className="mt-5 space-y-3 text-base font-semibold text-slate-500">
              {[
                ["facebook", "facebook"],
                ["youtube", "youtube"],
                ["tiktok", "tiktok"],
                ["instagram", "instagram"],
              ].map(([type, label]) => (
                <li
                  key={label}
                  className="flex text-md font-medium text-slate-400 items-center gap-3"
                >
                  <SocialIcon
                    type={type}
                    label={label}
                    className="h-5 w-5 text-md font-medium text-slate-400 hover:text-white"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-black text-white">Important Links</h3>
            <button
              type="button"
              className="mt-5 flex w-full max-w-xs items-center justify-between rounded-lg bg-[#343538] px-4 py-4 text-sm font-black text-slate-400 transition hover:bg-[#3d3e42] hover:text-white"
            >
              <span className="inline-flex items-center gap-3">
                <span className="h-2.5 w-2.5 text-md font-medium rounded-full bg-slate-400" />
                Refund Policy
              </span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-none stroke-current stroke-2"
              >
                <path d="M7 17 17 7" />
                <path d="M9 7h8v8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded bg-white shadow-sm">
          <img
            src={sslcommerzImage}
            alt="Available payment methods and SSLCommerz verification"
            className="w-full object-contain"
          />
        </div>

        {/* <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-center text-sm font-bold text-slate-500">
            ওয়াজিহ © 2026. Develop by{" "}
            <span className="text-sky-400">SOFT-HEXIS</span>
          </p>
        </div> */}
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-md font-medium text-slate-400">
        {links.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>
    </div>
  );
}

function getProductName(campaign) {
  if (!campaign) return "Attar & Perfume Combo Pack";
  if (typeof campaign.product === "string") return campaign.product;
  return (
    campaign.product?.name ||
    campaign.productName ||
    "Attar & Perfume Combo Pack"
  );
}

function normalizeTemplate(value) {
  const template = String(value || "Template Design 1").trim();
  if (template === "Template Design 2" || template === "Template Design 3")
    return template;
  return "Template Design 1";
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-BD");
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function getCampaignBannerImage(page) {
  return (
    page?.bannerImageUrl ||
    page?.bannerImage ||
    page?.banner ||
    page?.imageUrl ||
    page?.image ||
    ""
  );
}
