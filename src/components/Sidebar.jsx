import { useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Truck, ShoppingBag,
  Globe, Shield, Users, Settings, Zap, Megaphone, BookOpen,
  Image, DollarSign, BarChart2, RefreshCw, ChevronRight, ChevronDown,
  List, Clock, Box, CheckCircle, XCircle, RotateCcw, PauseCircle,
  Send, CheckSquare, AlertCircle, Tag, Layers, GitBranch, Palette,
  Sliders, Barcode, Star, Grid, UserPlus, CreditCard, Wallet,
  PlusCircle, LayoutList, User, KeyRound, Lock,
  Ban, SlidersHorizontal, Share2, Phone, Truck as TruckIcon, CircleDot, FilePlus,
  Bike, Banknote, MessageSquare, ShieldAlert,
  Cpu, Ticket, LayoutGrid, Activity, FileText, Folder, TrendingUp,
} from 'lucide-react';

// ── Orders submenu ──────────────────────────────────────────
const orderSubMenuItems = [
  { key: 'all', label: 'All Order', icon: List, color: 'text-cyan-400' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'text-blue-400' },
  { key: 'packaging', label: 'Packaging', icon: Box, color: 'text-purple-400' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-teal-400' },
  { key: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-400' },
  { key: 'returned', label: 'Returned', icon: RotateCcw, color: 'text-amber-400' },
  { key: 'on_hold', label: 'On Hold', icon: PauseCircle, color: 'text-gray-400' },
  { key: 'in_courier', label: 'In Courier', icon: Send, color: 'text-indigo-400' },
  { key: 'delivered', label: 'Delivered', icon: CheckSquare, color: 'text-green-400' },
  { key: 'incomplete', label: 'Incomplete', icon: AlertCircle, color: 'text-orange-400' },
];

// ── Supplier submenu ─────────────────────────────────────────
const supplierSubMenuItems = [
  { key: 'supplier_list', label: 'Supplier List', icon: List, color: 'text-cyan-400' },
  { key: 'supplier_add', label: 'Supplier Add', icon: UserPlus, color: 'text-green-400' },
  { key: 'payment_add', label: 'Payment Add', icon: CreditCard, color: 'text-purple-400' },
  { key: 'payment_list', label: 'Payment List', icon: Wallet, color: 'text-amber-400' },
];

// ── Landing Page submenu ──────────────────────────────────────
const landingPageSubMenuItems = [
  { key: 'landing_create', label: 'Create', icon: PlusCircle,  color: 'text-green-400' },
  { key: 'landing_manage', label: 'Manage', icon: LayoutList,  color: 'text-cyan-400'  },
];

// ── Admin & Permission submenu ────────────────────────────────
const adminSubMenuItems = [
  { key: 'admin_user',        label: 'User',        icon: User,     color: 'text-blue-400'   },
  { key: 'admin_roles',       label: 'Roles',       icon: KeyRound, color: 'text-purple-400' },
  { key: 'admin_permissions', label: 'Permissions', icon: Lock,     color: 'text-amber-400'  },
];

// ── Customers submenu ─────────────────────────────────────────
const customersSubMenuItems = [
  { key: 'customer_list', label: 'Customer List', icon: Users,  color: 'text-cyan-400'  },
  { key: 'ip_block',      label: 'IP Block',      icon: Ban,    color: 'text-red-400'   },
];

// ── Website Setting submenu ───────────────────────────────────
const websiteSettingSubMenuItems = [
  { key: 'general_setting',  label: 'General Setting',  icon: SlidersHorizontal, color: 'text-blue-400'   },
  { key: 'social_media',     label: 'Social Media',     icon: Share2,            color: 'text-pink-400'   },
  { key: 'contact',          label: 'Contact',          icon: Phone,             color: 'text-green-400'  },
  { key: 'shipping_charge',  label: 'Shipping Charge',  icon: TruckIcon,         color: 'text-amber-400'  },
  { key: 'order_status',     label: 'Order Status',     icon: CircleDot,         color: 'text-purple-400' },
  { key: 'create_page',      label: 'Create Page',      icon: FilePlus,          color: 'text-teal-400'   },
];

// ── API Integration submenu ───────────────────────────────────
const apiSubMenuItems = [
  { key: 'courier_api',      label: 'Courier API',       icon: Bike,         color: 'text-cyan-400'   },
  { key: 'payment_gateway',  label: 'Payment Gateway',   icon: Banknote,     color: 'text-green-400'  },
  { key: 'sms_gateway',      label: 'SMS Gateway',       icon: MessageSquare, color: 'text-purple-400' },
  { key: 'fraud_checker_api',label: 'Fraud Checker API', icon: ShieldAlert,  color: 'text-red-400'    },
];

// ── Marketing Tools submenu ───────────────────────────────────
const marketingSubMenuItems = [
  { key: 'tag_manager',       label: 'Tag Manager',       icon: Tag,        color: 'text-blue-400'   },
  { key: 'facebook_pixels',   label: 'Facebook Pixels',   icon: Cpu,        color: 'text-indigo-400' },
  { key: 'coupon_code',       label: 'Coupon Code',       icon: Ticket,     color: 'text-green-400'  },
  { key: 'sms_marketing',     label: 'SMS Marketing',     icon: MessageSquare, color: 'text-purple-400' },
  { key: 'facebook_catalogue',label: 'Facebook Catalogue',icon: LayoutGrid, color: 'text-cyan-400'   },
  { key: 'visitor_reports',   label: 'Visitor Reports',   icon: Activity,   color: 'text-amber-400'  },
];

// ── Blogs submenu ─────────────────────────────────────────────
const blogsSubMenuItems = [
  { key: 'blog', label: 'Blog', icon: FileText, color: 'text-teal-400' },
];

// ── Banner & Ads submenu ──────────────────────────────────────
const bannerSubMenuItems = [
  { key: 'banner_category', label: 'Banner Category', icon: Folder,      color: 'text-purple-400' },
  { key: 'banner_ads',      label: 'Banner & Ads',    icon: Image,       color: 'text-pink-400'   },
];

// ── Expense submenu ───────────────────────────────────────────
const expenseSubMenuItems = [
  { key: 'expense_categories', label: 'Expense Categories', icon: Tag,       color: 'text-purple-400' },
  { key: 'expense',            label: 'Expense',            icon: DollarSign, color: 'text-green-400'  },
];

// ── Reports submenu ───────────────────────────────────────────
const reportsSubMenuItems = [
  { key: 'stock_report',       label: 'Stock Report',       icon: BarChart2,  color: 'text-blue-400'   },
  { key: 'stock_alert_report', label: 'Stock Alert Report', icon: AlertCircle,color: 'text-red-400'    },
  { key: 'purchase_report',    label: 'Purchase Report',    icon: ShoppingBag,color: 'text-amber-400'  },
  { key: 'order_reports',      label: 'Order Reports',      icon: List,       color: 'text-cyan-400'   },
  { key: 'sales_reports',      label: 'Sales Reports',      icon: Activity,   color: 'text-green-400'  },
  { key: 'expense_reports',    label: 'Expense Reports',    icon: FileText,   color: 'text-purple-400' },
  { key: 'loss_profit',        label: 'Loss/Profit',        icon: TrendingUp, color: 'text-teal-400'   },
];

// ── Purchase submenu ─────────────────────────────────────────
const purchaseSubMenuItems = [
  { key: 'purchase_list', label: 'Purchase List', icon: List,     color: 'text-cyan-400'  },
  { key: 'purchase_add',  label: 'Add Purchase',  icon: ShoppingBag, color: 'text-green-400' },
];

// ── Products submenu ─────────────────────────────────────────
const productSubMenuItems = [
  { key: 'product_manage', label: 'Product Manage', icon: Grid, color: 'text-blue-400' },
  { key: 'categories', label: 'Categories', icon: Tag, color: 'text-purple-400' },
  { key: 'subcategories', label: 'Subcategories', icon: Layers, color: 'text-cyan-400' },
  { key: 'childcategories', label: 'Childcategories', icon: GitBranch, color: 'text-teal-400' },
  { key: 'brands', label: 'Brands', icon: CheckCircle, color: 'text-amber-400' },
  { key: 'colors', label: 'Colors', icon: Palette, color: 'text-pink-400' },
  { key: 'attribute', label: 'Attribute', icon: Sliders, color: 'text-green-400' },
  { key: 'barcode', label: 'Barcode', icon: Barcode, color: 'text-orange-400' },
  { key: 'reviews', label: 'Reviews', icon: Star, color: 'text-yellow-400' },
];

export default function Sidebar({ activePage, onNavigate, activeOrderStatus, onOrderStatusChange, orderCounts = {}, activeProductPage, onProductPageChange, activeSupplierPage, onSupplierPageChange, activePurchasePage, onPurchasePageChange, activeLandingPage, onLandingPageChange, activeAdminPage, onAdminPageChange, activeCustomersPage, onCustomersPageChange, activeWebsitePage, onWebsitePageChange, activeApiPage, onApiPageChange, activeMarketingPage, onMarketingPageChange, activeBlogsPage, onBlogsPageChange, activeBannerPage, onBannerPageChange, activeExpensePage, onExpensePageChange, activeReportsPage, onReportsPageChange }) {
  const [ordersOpen, setOrdersOpen] = useState(activePage === 'orders');
  const [productsOpen, setProductsOpen] = useState(activePage === 'products');
  const [supplierOpen, setSupplierOpen] = useState(activePage === 'supplier');
  const [purchaseOpen, setPurchaseOpen] = useState(activePage === 'purchase');
  const [landingOpen, setLandingOpen] = useState(activePage === 'landing');
  const [adminOpen, setAdminOpen] = useState(activePage === 'admin');
  const [customersOpen, setCustomersOpen] = useState(activePage === 'customers');
  const [websiteOpen, setWebsiteOpen] = useState(activePage === 'website');
  const [apiOpen, setApiOpen] = useState(activePage === 'api');
  const [marketingOpen, setMarketingOpen] = useState(activePage === 'marketing');
  const [blogsOpen, setBlogsOpen] = useState(activePage === 'blogs');
  const [bannerOpen, setBannerOpen] = useState(activePage === 'banner');
  const [expenseOpen, setExpenseOpen] = useState(activePage === 'expense');
  const [reportsOpen, setReportsOpen] = useState(activePage === 'reports');

  function handleOrdersClick() {
    const next = !ordersOpen;
    setOrdersOpen(next);
    if (next) { onNavigate('orders'); onOrderStatusChange('all'); }
  }

  function handleOrderSub(key) { onNavigate('orders'); onOrderStatusChange(key); }

  function handleProductsClick() {
    const next = !productsOpen;
    setProductsOpen(next);
    if (next) { onNavigate('products'); onProductPageChange('product_manage'); }
  }

  function handleProductSub(key) { onNavigate('products'); onProductPageChange(key); }

  function handleSupplierClick() {
    const next = !supplierOpen;
    setSupplierOpen(next);
    if (next) { onNavigate('supplier'); onSupplierPageChange('supplier_list'); }
  }

  function handleSupplierSub(key) { onNavigate('supplier'); onSupplierPageChange(key); }

  function handlePurchaseClick() {
    const next = !purchaseOpen;
    setPurchaseOpen(next);
    if (next) { onNavigate('purchase'); onPurchasePageChange('purchase_list'); }
  }

  function handlePurchaseSub(key) { onNavigate('purchase'); onPurchasePageChange(key); }

  function handleLandingClick() {
    const next = !landingOpen;
    setLandingOpen(next);
    if (next) { onNavigate('landing'); onLandingPageChange('landing_create'); }
  }
  function handleLandingSub(key) { onNavigate('landing'); onLandingPageChange(key); }

  function handleAdminClick() {
    const next = !adminOpen;
    setAdminOpen(next);
    if (next) { onNavigate('admin'); onAdminPageChange('admin_user'); }
  }
  function handleAdminSub(key) { onNavigate('admin'); onAdminPageChange(key); }

  function handleCustomersClick() {
    const next = !customersOpen;
    setCustomersOpen(next);
    if (next) { onNavigate('customers'); onCustomersPageChange('customer_list'); }
  }
  function handleCustomersSub(key) { onNavigate('customers'); onCustomersPageChange(key); }

  function handleWebsiteClick() {
    const next = !websiteOpen;
    setWebsiteOpen(next);
    if (next) { onNavigate('website'); onWebsitePageChange('general_setting'); }
  }
  function handleWebsiteSub(key) { onNavigate('website'); onWebsitePageChange(key); }

  function handleApiClick() {
    const next = !apiOpen;
    setApiOpen(next);
    if (next) { onNavigate('api'); onApiPageChange('courier_api'); }
  }
  function handleApiSub(key) { onNavigate('api'); onApiPageChange(key); }

  function handleMarketingClick() {
    const next = !marketingOpen;
    setMarketingOpen(next);
    if (next) { onNavigate('marketing'); onMarketingPageChange('tag_manager'); }
  }
  function handleMarketingSub(key) { onNavigate('marketing'); onMarketingPageChange(key); }

  function handleBlogsClick() {
    const next = !blogsOpen;
    setBlogsOpen(next);
    if (next) { onNavigate('blogs'); onBlogsPageChange('blog'); }
  }
  function handleBlogsSub(key) { onNavigate('blogs'); onBlogsPageChange(key); }

  function handleBannerClick() {
    const next = !bannerOpen;
    setBannerOpen(next);
    if (next) { onNavigate('banner'); onBannerPageChange('banner_category'); }
  }
  function handleBannerSub(key) { onNavigate('banner'); onBannerPageChange(key); }

  function handleExpenseClick() {
    const next = !expenseOpen;
    setExpenseOpen(next);
    if (next) { onNavigate('expense'); onExpensePageChange('expense_categories'); }
  }
  function handleExpenseSub(key) { onNavigate('expense'); onExpensePageChange(key); }

  function handleReportsClick() {
    const next = !reportsOpen;
    setReportsOpen(next);
    if (next) { onNavigate('reports'); onReportsPageChange('stock_report'); }
  }
  function handleReportsSub(key) { onNavigate('reports'); onReportsPageChange(key); }

  return (
    <aside
      className="w-56 min-h-screen flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #1a2468 0%, #1e2d7d 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-blue-800 flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
          <span style={{ fontFamily: 'serif' }}>وجيه</span>
        </div>
        <div>
          <div className="text-white font-bold text-base leading-tight">Wazih</div>
          <div className="text-blue-300 text-xs">ওয়াজিহ</div>
        </div>
      </div>

      <nav className="py-2 flex-1">
        {/* Dashboard */}
        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activePage === 'dashboard'} onClick={() => onNavigate('dashboard')} />

        {/* ── Orders ── */}
        <ExpandableItem
          icon={ShoppingCart}
          label="Orders"
          isOpen={ordersOpen}
          isActive={activePage === 'orders'}
          badge={orderCounts.all ?? 0}
          onClick={handleOrdersClick}
        >
          {orderSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              badge={orderCounts[item.key] ?? 0}
              isActive={activePage === 'orders' && activeOrderStatus === item.key}
              onClick={() => handleOrderSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Products ── */}
        <ExpandableItem
          icon={Package}
          label="Products"
          isOpen={productsOpen}
          isActive={activePage === 'products'}
          onClick={handleProductsClick}
        >
          {productSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'products' && activeProductPage === item.key}
              onClick={() => handleProductSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Supplier ── */}
        <ExpandableItem
          icon={Truck}
          label="Supplier"
          isOpen={supplierOpen}
          isActive={activePage === 'supplier'}
          onClick={handleSupplierClick}
        >
          {supplierSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'supplier' && activeSupplierPage === item.key}
              onClick={() => handleSupplierSub(item.key)}
            />
          ))}
        </ExpandableItem>
        {/* ── Purchase ── */}
        <ExpandableItem
          icon={ShoppingBag}
          label="Purchase"
          isOpen={purchaseOpen}
          isActive={activePage === 'purchase'}
          onClick={handlePurchaseClick}
        >
          {purchaseSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'purchase' && activePurchasePage === item.key}
              onClick={() => handlePurchaseSub(item.key)}
            />
          ))}
        </ExpandableItem>
        {/* ── Landing Page ── */}
        <ExpandableItem
          icon={Globe}
          label="Landing Page"
          isOpen={landingOpen}
          isActive={activePage === 'landing'}
          onClick={handleLandingClick}
        >
          {landingPageSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'landing' && activeLandingPage === item.key}
              onClick={() => handleLandingSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Admin & Permission ── */}
        <ExpandableItem
          icon={Shield}
          label="Admin & Permission"
          isOpen={adminOpen}
          isActive={activePage === 'admin'}
          onClick={handleAdminClick}
        >
          {adminSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'admin' && activeAdminPage === item.key}
              onClick={() => handleAdminSub(item.key)}
            />
          ))}
        </ExpandableItem>
        {/* ── Customers ── */}
        <ExpandableItem
          icon={Users}
          label="Customers"
          isOpen={customersOpen}
          isActive={activePage === 'customers'}
          onClick={handleCustomersClick}
        >
          {customersSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'customers' && activeCustomersPage === item.key}
              onClick={() => handleCustomersSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Website Setting ── */}
        <ExpandableItem
          icon={Settings}
          label="Website Setting"
          isOpen={websiteOpen}
          isActive={activePage === 'website'}
          onClick={handleWebsiteClick}
        >
          {websiteSettingSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'website' && activeWebsitePage === item.key}
              onClick={() => handleWebsiteSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── API Integration ── */}
        <ExpandableItem
          icon={Zap}
          label="API Integration"
          isOpen={apiOpen}
          isActive={activePage === 'api'}
          onClick={handleApiClick}
        >
          {apiSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'api' && activeApiPage === item.key}
              onClick={() => handleApiSub(item.key)}
            />
          ))}
        </ExpandableItem>
        {/* ── Marketing Tools ── */}
        <ExpandableItem
          icon={Megaphone}
          label="Marketing Tools"
          isOpen={marketingOpen}
          isActive={activePage === 'marketing'}
          onClick={handleMarketingClick}
        >
          {marketingSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'marketing' && activeMarketingPage === item.key}
              onClick={() => handleMarketingSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Blogs ── */}
        <ExpandableItem
          icon={BookOpen}
          label="Blogs"
          isOpen={blogsOpen}
          isActive={activePage === 'blogs'}
          onClick={handleBlogsClick}
        >
          {blogsSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'blogs' && activeBlogsPage === item.key}
              onClick={() => handleBlogsSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Banner & Ads ── */}
        <ExpandableItem
          icon={Image}
          label="Banner & Ads"
          isOpen={bannerOpen}
          isActive={activePage === 'banner'}
          onClick={handleBannerClick}
        >
          {bannerSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'banner' && activeBannerPage === item.key}
              onClick={() => handleBannerSub(item.key)}
            />
          ))}
        </ExpandableItem>
        {/* ── Expense ── */}
        <ExpandableItem
          icon={DollarSign}
          label="Expense"
          isOpen={expenseOpen}
          isActive={activePage === 'expense'}
          onClick={handleExpenseClick}
        >
          {expenseSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'expense' && activeExpensePage === item.key}
              onClick={() => handleExpenseSub(item.key)}
            />
          ))}
        </ExpandableItem>

        {/* ── Reports ── */}
        <ExpandableItem
          icon={BarChart2}
          label="Reports"
          isOpen={reportsOpen}
          isActive={activePage === 'reports'}
          onClick={handleReportsClick}
        >
          {reportsSubMenuItems.map((item) => (
            <SubItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              color={item.color}
              isActive={activePage === 'reports' && activeReportsPage === item.key}
              onClick={() => handleReportsSub(item.key)}
            />
          ))}
        </ExpandableItem>
        <SidebarItem icon={RefreshCw} label="Cache Clear" onClick={() => {}} />
      </nav>
    </aside>
  );
}

/* ── Reusable pieces ── */

function ExpandableItem({ icon: Icon, label, isOpen, isActive, badge, onClick, children }) {
  return (
    <div>
      <div
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-2.5 cursor-pointer group transition-all duration-150 ${
          isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className={isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          {badge !== undefined && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
          )}
          {isOpen ? <ChevronDown size={13} className="opacity-60" /> : <ChevronRight size={13} className="opacity-60" />}
        </div>
      </div>
      {isOpen && (
        <div className="bg-blue-950/40 border-l-2 border-blue-600 ml-4">
          {children}
        </div>
      )}
    </div>
  );
}

function SubItem({ icon: Icon, label, color, badge, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-100 ${
        isActive ? 'bg-blue-600 text-white' : 'text-blue-300 hover:bg-blue-800/50 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={13} className={isActive ? 'text-white' : color} />
        <span className="text-xs">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-blue-800 text-blue-200'}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, hasChild, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer group transition-all duration-150 ${
        active ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className={active ? 'text-white' : 'text-blue-300 group-hover:text-white'} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasChild && <ChevronRight size={14} className="opacity-60" />}
    </div>
  );
}
