import { useEffect, useState } from 'react';
import './index.css';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import { useOrderStatusCounts } from './hooks/useOrders';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import OrdersPage from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import InvoicePage from './pages/InvoicePage';
import EditOrderPage from './pages/EditOrderPage';
import ProductManagePage from './pages/products/ProductManagePage';
import CategoriesPage from './pages/products/CategoriesPage';
import SubcategoriesPage from './pages/products/SubcategoriesPage';
import ChildCategoriesPage from './pages/products/ChildCategoriesPage';
import BrandsPage from './pages/products/BrandsPage';
import ColorsPage from './pages/products/ColorsPage';
import AttributePage from './pages/products/AttributePage';
import AttributeFormPage from './pages/products/AttributeFormPage';
import BarcodePage from './pages/products/BarcodePage';
import ReviewsPage from './pages/products/ReviewsPage';
import ReviewFormPage from './pages/products/ReviewFormPage';
import ProductCreatePage from './pages/products/ProductCreatePage';
import ProductEditPage from './pages/products/ProductEditPage';
import CategoryCreatePage from './pages/products/CategoryCreatePage';
import CategoryEditPage from './pages/products/CategoryEditPage';
import SubcategoryCreatePage from './pages/products/SubcategoryCreatePage';
import SubcategoryEditPage from './pages/products/SubcategoryEditPage';
import ChildcategoryCreatePage from './pages/products/ChildcategoryCreatePage';
import ChildcategoryEditPage from './pages/products/ChildcategoryEditPage';
import BrandCreatePage from './pages/products/BrandCreatePage';
import BrandEditPage from './pages/products/BrandEditPage';
import ColorCreatePage from './pages/products/ColorCreatePage';
import ColorEditPage from './pages/products/ColorEditPage';
import PurchaseListPage from './pages/purchase/PurchaseListPage';
import PurchaseFormPage from './pages/purchase/PurchaseFormPage';
import SupplierListPage from './pages/supplier/SupplierListPage';
import SupplierFormPage from './pages/supplier/SupplierFormPage';
import PaymentAddPage from './pages/supplier/PaymentAddPage';
import PaymentListPage from './pages/supplier/PaymentListPage';
import { useSupplierAllList } from './hooks/useSuppliers';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminUserEditPage from './pages/admin/AdminUserEditPage';
import AdminRolesPage from './pages/admin/AdminRolesPage';
import AdminRoleEditPage from './pages/admin/AdminRoleEditPage';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerEditPage from './pages/customers/CustomerEditPage';
import CustomerViewPage from './pages/customers/CustomerViewPage';
import CustomerLoginAsPage from './pages/customers/CustomerLoginAsPage';
import CustomerIpBlockPage from './pages/customers/CustomerIpBlockPage';
import LandingPageCreatePage from './pages/landing/LandingPageCreatePage';
import LandingPageManagePage from './pages/landing/LandingPageManagePage';
import LandingPageViewPage from './pages/landing/LandingPageViewPage';
import { landingPageService } from './services/landingPageService';
import WebsiteGeneralSettingPage from './pages/website/WebsiteGeneralSettingPage';
import WebsiteSocialMediaPage from './pages/website/WebsiteSocialMediaPage';
import WebsiteContactPage from './pages/website/WebsiteContactPage';
import WebsiteShippingChargePage from './pages/website/WebsiteShippingChargePage';
import WebsiteShippingChargeEditPage from './pages/website/WebsiteShippingChargeEditPage';
import WebsiteOrderStatusPage from './pages/website/WebsiteOrderStatusPage';
import WebsiteOrderStatusEditPage from './pages/website/WebsiteOrderStatusEditPage';
import WebsitePageManagePage from './pages/website/WebsitePageManagePage';
import WebsitePageEditPage from './pages/website/WebsitePageEditPage';
import CourierApiPage from './pages/api/CourierApiPage';
import PaymentGatewayPage from './pages/api/PaymentGatewayPage';
import SmsGatewayPage from './pages/api/SmsGatewayPage';
import FraudCheckerApiPage from './pages/api/FraudCheckerApiPage';
import TagManagerPage from './pages/marketing/TagManagerPage';
import TagManagerFormPage from './pages/marketing/TagManagerFormPage';
import FacebookPixelsPage from './pages/marketing/FacebookPixelsPage';
import FacebookPixelsFormPage from './pages/marketing/FacebookPixelsFormPage';
import CouponCodePage from './pages/marketing/CouponCodePage';
import CouponCodeFormPage from './pages/marketing/CouponCodeFormPage';
import SmsMarketingPage from './pages/marketing/SmsMarketingPage';
import FacebookCataloguePage from './pages/marketing/FacebookCataloguePage';
import VisitorReportsPage from './pages/marketing/VisitorReportsPage';
import BlogPage from './pages/blogs/BlogPage';
import BlogFormPage from './pages/blogs/BlogFormPage';
import BannerCategoryPage from './pages/banner/BannerCategoryPage';
import BannerCategoryFormPage from './pages/banner/BannerCategoryFormPage';
import BannerAdsPage from './pages/banner/BannerAdsPage';
import BannerAdsFormPage from './pages/banner/BannerAdsFormPage';
import ExpenseCategoryPage from './pages/expense/ExpenseCategoryPage';
import ExpenseCategoryFormPage from './pages/expense/ExpenseCategoryFormPage';
import ExpensePage from './pages/expense/ExpensePage';
import ExpenseFormPage from './pages/expense/ExpenseFormPage';
import ReportsPage from './pages/reports/ReportsPage';
import { siteSettingService } from './services/websiteService';
import { applyDocumentFavicon, applyDocumentTitle, getFavicon, getSiteName, normalizeSettingData } from './utils/siteBranding';

function getDirectLandingPageId() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const queryId = params.get('landingPageId');
  if (queryId) return queryId;
  const match = window.location.pathname.match(/^\/landing-page\/([^/]+)$/);
  return match?.[1] || '';
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const directLandingPageId = getDirectLandingPageId();

  // All hooks must be called unconditionally (Rules of Hooks).
  // They silently return empty data when there is no auth token.
  const { counts: orderCounts, refetch: refetchOrderCounts } = useOrderStatusCounts(isAuthenticated);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeOrderStatus, setActiveOrderStatus] = useState('all');
  const [activeProductPage, setActiveProductPage] = useState('product_manage');
  const [activeSupplierPage, setActiveSupplierPage] = useState('supplier_list');
  const [activePurchasePage, setActivePurchasePage] = useState('purchase_list');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [activeLandingPage, setActiveLandingPage] = useState('landing_create');
  const [activeAdminPage, setActiveAdminPage] = useState('admin_user');
  const [activeCustomersPage, setActiveCustomersPage] = useState('customer_list');
  const [activeWebsitePage, setActiveWebsitePage] = useState('general_setting');
  const [activeApiPage, setActiveApiPage] = useState('courier_api');
  const [activeMarketingPage, setActiveMarketingPage] = useState('tag_manager');
  const [activeBlogsPage, setActiveBlogsPage] = useState('blog');
  const [activeBannerPage, setActiveBannerPage] = useState('banner_category');
  const [activeExpensePage, setActiveExpensePage] = useState('expense_categories');
  const [activeReportsPage, setActiveReportsPage] = useState('stock_report');
  const [siteSettings, setSiteSettings] = useState(null);
  const { data: suppliers } = useSupplierAllList();
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct]   = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedChildcategory, setSelectedChildcategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedShippingCharge, setSelectedShippingCharge] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [tagManagers, setTagManagers] = useState([]);
  const [selectedTagManager, setSelectedTagManager] = useState(null);
  const [facebookPixels, setFacebookPixels] = useState([
    { id: 1, pixelsId: '645044913541888', metaAccessToken: '', testEventId: '', status: false },
  ]);
  const [selectedFacebookPixel, setSelectedFacebookPixel] = useState(null);
  const [couponCodes, setCouponCodes] = useState([
    { id: 1, code: 'winter11.11', date: '2026-01-20', type: 'Percentage', amount: 11, buyAmount: 800, imageName: '', status: true },
    { id: 2, code: 'offer10', date: '2026-04-30', type: 'Percentage', amount: 12, buyAmount: 1000, imageName: '', status: true },
  ]);
  const [selectedCouponCode, setSelectedCouponCode] = useState(null);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: '৫০০ টাকার মধ্যে পুরুষ ব্যবহারর সেরা ৫টি সানস্ক্রিন...',
      imageName: '',
      imageText: '20,000 ROI',
      imageColor: 'linear-gradient(135deg, #f2d3a4, #a4572c)',
      description: '',
      status: false,
    },
    {
      id: 2,
      title: 'এ আঘা খাবার ৪টি কারণ',
      imageName: '',
      imageText: 'WAZIH',
      imageColor: 'linear-gradient(135deg, #0f172a, #4b6b8a)',
      description: '',
      status: false,
    },
  ]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [bannerCategories, setBannerCategories] = useState([
    { id: 1, name: 'Nazmul Hasan', status: true },
    { id: 2, name: 'Welcome to Sellpixer', status: true },
    { id: 3, name: 'Popup Banner', status: true },
    { id: 4, name: 'Slider Right (375px X 175px)', status: true },
    { id: 5, name: 'Main Slider (775px x 400px)', status: true },
  ]);
  const [selectedBannerCategory, setSelectedBannerCategory] = useState(null);
  const [banners, setBanners] = useState([
    { id: 1, link: '', category: 'Main Slider (775px x 400px)', imageName: '', imageText: 'Arabic', imageColor: 'linear-gradient(135deg, #d6d3d1, #78716c)', status: true },
    { id: 2, link: '', category: 'Slider Right (375px X 175px)', imageName: '', imageText: 'City', imageColor: 'linear-gradient(135deg, #ecfccb, #84cc16)', status: true },
    { id: 3, link: '', category: 'Popup Banner', imageName: '', imageText: 'Offer', imageColor: 'linear-gradient(135deg, #fbbf24, #7f1d1d)', status: false },
    { id: 4, link: '', category: 'Main Slider (775px x 400px)', imageName: '', imageText: 'Room', imageColor: 'linear-gradient(135deg, #f8fafc, #94a3b8)', status: true },
    { id: 5, link: '', category: 'Slider Right (375px X 175px)', imageName: '', imageText: 'Gadgets', imageColor: 'linear-gradient(135deg, #bef264, #16a34a)', status: true },
    { id: 6, link: '', category: 'Main Slider (775px x 400px)', imageName: '', imageText: 'Tower', imageColor: 'linear-gradient(135deg, #bae6fd, #334155)', status: true },
  ]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: 'Polash', status: true },
    { id: 2, name: 'Refreshment Exp', status: true },
    { id: 3, name: 'Ammar Medicine', status: true },
    { id: 4, name: 'Product Expense', status: true },
    { id: 5, name: 'Dolar Expense', status: true },
    { id: 6, name: 'Employee Salary', status: true },
    { id: 7, name: 'Boost Cost', status: true },
    { id: 8, name: 'Utility Bill', status: true },
  ]);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Product Expense', category: 'Product Expense', date: '2026-06-01', amount: 2500, note: '', status: true },
    { id: 2, title: 'Refreshment', category: 'Refreshment Exp', date: '2026-06-03', amount: 650, note: '', status: true },
    { id: 3, title: 'Utility Bill', category: 'Utility Bill', date: '2026-06-08', amount: 1200, note: '', status: true },
  ]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [directCampaign, setDirectCampaign] = useState(null);
  const [directCampaignLoading, setDirectCampaignLoading] = useState(Boolean(directLandingPageId));
  const [directCampaignError, setDirectCampaignError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    const applySettings = (data) => {
      if (!active) return;
      const normalized = normalizeSettingData(data);
      setSiteSettings(normalized);
      applyDocumentFavicon(getFavicon(normalized));
      applyDocumentTitle(getSiteName(normalized));
    };

    siteSettingService.get('general')
      .then((res) => applySettings(res.data?.data || null))
      .catch(() => {});

    const handleUpdate = (event) => applySettings(event.detail);
    window.addEventListener('site-settings:update', handleUpdate);
    return () => {
      active = false;
      window.removeEventListener('site-settings:update', handleUpdate);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!directLandingPageId || !isAuthenticated) return undefined;
    let active = true;
    setDirectCampaignLoading(true);
    setDirectCampaignError('');
    landingPageService.getOne(directLandingPageId)
      .then((res) => {
        if (!active) return;
        setDirectCampaign(res.data || null);
      })
      .catch((err) => {
        if (!active) return;
        setDirectCampaignError(err.message || 'Landing page fetch failed.');
      })
      .finally(() => {
        if (active) setDirectCampaignLoading(false);
      });
    return () => {
      active = false;
    };
  }, [directLandingPageId, isAuthenticated]);

  // Auth guards — placed after all hook calls to satisfy Rules of Hooks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (directLandingPageId) {
    if (directCampaignLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm font-semibold text-gray-500">
          Loading landing page...
        </div>
      );
    }

    if (directCampaignError || !directCampaign) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="rounded-lg border border-red-100 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-bold text-red-500">{directCampaignError || 'Landing page not found.'}</p>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen overflow-hidden bg-gray-100">
        <LandingPageViewPage
          campaign={directCampaign}
          onBack={() => window.location.assign('/')}
        />
      </div>
    );
  }

  function goProducts(page) {
    setActivePage('products');
    setActiveProductPage(page);
  }

  function saveTagManager(data) {
    if (data.id) {
      setTagManagers((prev) => prev.map((tag) => tag.id === data.id ? { ...tag, ...data } : tag));
      setSelectedTagManager(null);
      return;
    }

    setTagManagers((prev) => [
      ...prev,
      {
        id: Date.now(),
        tagManagerId: data.tagManagerId,
        status: data.status,
      },
    ]);
  }

  function deleteTagManager(id) {
    setTagManagers((prev) => prev.filter((tag) => tag.id !== id));
  }

  function saveFacebookPixel(data) {
    if (data.id) {
      setFacebookPixels((prev) => prev.map((pixel) => pixel.id === data.id ? { ...pixel, ...data } : pixel));
      setSelectedFacebookPixel(null);
      return;
    }

    setFacebookPixels((prev) => [
      ...prev,
      {
        id: Date.now(),
        pixelsId: data.pixelsId,
        metaAccessToken: data.metaAccessToken,
        testEventId: data.testEventId,
        status: data.status,
      },
    ]);
  }

  function deleteFacebookPixel(id) {
    setFacebookPixels((prev) => prev.filter((pixel) => pixel.id !== id));
  }

  function saveCouponCode(data) {
    if (data.id) {
      setCouponCodes((prev) => prev.map((coupon) => coupon.id === data.id ? { ...coupon, ...data } : coupon));
      setSelectedCouponCode(null);
      return;
    }

    setCouponCodes((prev) => [
      ...prev,
      {
        id: Date.now(),
        code: data.code,
        date: data.date,
        type: data.type,
        amount: data.amount,
        buyAmount: data.buyAmount,
        imageName: data.imageName,
        status: data.status,
      },
    ]);
  }

  function deleteCouponCode(id) {
    setCouponCodes((prev) => prev.filter((coupon) => coupon.id !== id));
  }

  function saveBlog(data) {
    if (data.id) {
      setBlogs((prev) => prev.map((blog) => blog.id === data.id ? { ...blog, ...data } : blog));
      setSelectedBlog(null);
      return;
    }

    setBlogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: data.title,
        imageName: data.imageName,
        imageText: data.imageText,
        imageColor: data.imageColor,
        description: data.description,
        status: data.status,
      },
    ]);
  }

  function deleteBlog(id) {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  }

  function saveBannerCategory(data) {
    if (data.id) {
      setBannerCategories((prev) => prev.map((category) => category.id === data.id ? { ...category, ...data } : category));
      setSelectedBannerCategory(null);
      return;
    }

    setBannerCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: data.name,
        status: data.status,
      },
    ]);
  }

  function saveBanner(data) {
    if (data.id) {
      setBanners((prev) => prev.map((banner) => banner.id === data.id ? { ...banner, ...data } : banner));
      setSelectedBanner(null);
      return;
    }

    setBanners((prev) => [
      ...prev,
      {
        id: Date.now(),
        link: data.link,
        category: data.category,
        imageName: data.imageName,
        imageText: data.imageText,
        imageColor: data.imageColor,
        status: data.status,
      },
    ]);
  }

  function deleteBanner(id) {
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  }

  function saveExpenseCategory(data) {
    if (data.id) {
      setExpenseCategories((prev) => prev.map((category) => category.id === data.id ? { ...category, ...data } : category));
      setSelectedExpenseCategory(null);
      return;
    }

    setExpenseCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: data.name,
        status: data.status,
      },
    ]);
  }

  function saveExpense(data) {
    if (data.id) {
      setExpenses((prev) => prev.map((expense) => expense.id === data.id ? { ...expense, ...data } : expense));
      setSelectedExpense(null);
      return;
    }

    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: data.title,
        category: data.category,
        date: data.date,
        amount: data.amount,
        note: data.note,
        status: data.status,
      },
    ]);
  }

  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }

  // Full-screen pages (no sidebar/topnav)
  if (activePage === 'create_order') {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <CreateOrderPage
          onNavigate={(page) => {
            setActivePage(page);
            if (page === 'orders') setActiveOrderStatus('all');
          }}
        />
      </div>
    );
  }

  if (activePage === 'invoice' && selectedOrder) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopNav />
          <InvoicePage
            order={selectedOrder}
            onBack={() => { setActivePage('orders'); setSelectedOrder(null); }}
          />
        </div>
      </div>
    );
  }

  if (activePage === 'edit_order' && selectedOrder) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <EditOrderPage
          order={selectedOrder}
          onNavigate={(page) => {
            setActivePage(page);
            setSelectedOrder(null);
            if (page === 'orders') setActiveOrderStatus('all');
          }}
        />
      </div>
    );
  }

  function renderMain() {
    if (activePage === 'dashboard') return <Dashboard />;
    if (activePage === 'orders') return (
      <OrdersPage
        activeStatus={activeOrderStatus}
        onStatusChange={setActiveOrderStatus}
        onCreateOrder={() => setActivePage('create_order')}
        onViewOrder={(order) => { setSelectedOrder(order); setActivePage('invoice'); }}
        onEditOrder={(order) => { setSelectedOrder(order); setActivePage('edit_order'); }}
        statusCounts={orderCounts}
        onCountsRefresh={refetchOrderCounts}
      />
    );
    if (activePage === 'create_product') {
      return <ProductCreatePage onNavigate={() => goProducts('product_manage')} />;
    }
    if (activePage === 'edit_product' && selectedProduct) {
      return <ProductEditPage product={selectedProduct} onNavigate={() => { goProducts('product_manage'); setSelectedProduct(null); }} />;
    }
    if (activePage === 'create_category') {
      return <CategoryCreatePage onNavigate={(page) => goProducts(page || 'categories')} />;
    }
    if (activePage === 'edit_category' && selectedCategory) {
      return <CategoryEditPage category={selectedCategory} onNavigate={(page) => { goProducts(page || 'categories'); setSelectedCategory(null); }} />;
    }
    if (activePage === 'create_subcategory') {
      return <SubcategoryCreatePage onNavigate={(page) => goProducts(page || 'subcategories')} />;
    }
    if (activePage === 'edit_subcategory' && selectedSubcategory) {
      return <SubcategoryEditPage subcategory={selectedSubcategory} onNavigate={(page) => { goProducts(page || 'subcategories'); setSelectedSubcategory(null); }} />;
    }
    if (activePage === 'create_childcategory') {
      return <ChildcategoryCreatePage onNavigate={(page) => goProducts(page || 'childcategories')} />;
    }
    if (activePage === 'edit_childcategory' && selectedChildcategory) {
      return <ChildcategoryEditPage childcategory={selectedChildcategory} onNavigate={(page) => { goProducts(page || 'childcategories'); setSelectedChildcategory(null); }} />;
    }
    if (activePage === 'create_brand') {
      return <BrandCreatePage onNavigate={(page) => goProducts(page || 'brands')} />;
    }
    if (activePage === 'edit_brand' && selectedBrand) {
      return <BrandEditPage brand={selectedBrand} onNavigate={(page) => { goProducts(page || 'brands'); setSelectedBrand(null); }} />;
    }
    if (activePage === 'create_color') {
      return <ColorCreatePage onNavigate={(page) => goProducts(page || 'colors')} />;
    }
    if (activePage === 'edit_color' && selectedColor) {
      return <ColorEditPage color={selectedColor} onNavigate={(page) => { goProducts(page || 'colors'); setSelectedColor(null); }} />;
    }
    if (activePage === 'create_attribute') {
      return <AttributeFormPage onNavigate={(page) => goProducts(page || 'attribute')} />;
    }
    if (activePage === 'edit_attribute' && selectedAttribute) {
      return <AttributeFormPage mode="edit" attribute={selectedAttribute} onNavigate={(page) => { goProducts(page || 'attribute'); setSelectedAttribute(null); }} />;
    }
    if (activePage === 'create_review') {
      return <ReviewFormPage onNavigate={(page) => goProducts(page || 'reviews')} />;
    }
    if (activePage === 'edit_review' && selectedReview) {
      return <ReviewFormPage mode="edit" review={selectedReview} onNavigate={(page) => { goProducts(page || 'reviews'); setSelectedReview(null); }} />;
    }
    if (activePage === 'supplier') {
      const goSupplier = (page) => { setActivePage('supplier'); setActiveSupplierPage(page); };
      if (activeSupplierPage === 'supplier_list') {
        return (
          <SupplierListPage
            onNavigate={goSupplier}
            onEditSupplier={(s) => { setSelectedSupplier(s); goSupplier('supplier_edit'); }}
            onPaymentSupplier={() => goSupplier('payment_add')}
          />
        );
      }
      if (activeSupplierPage === 'supplier_add') {
        return (
          <SupplierFormPage
            mode="create"
            onNavigate={goSupplier}
          />
        );
      }
      if (activeSupplierPage === 'supplier_edit' && selectedSupplier) {
        return (
          <SupplierFormPage
            mode="edit"
            supplier={selectedSupplier}
            onSave={() => setSelectedSupplier(null)}
            onNavigate={goSupplier}
          />
        );
      }
      if (activeSupplierPage === 'payment_add') {
        return (
          <PaymentAddPage
            mode="create"
            onNavigate={goSupplier}
          />
        );
      }
      if (activeSupplierPage === 'payment_edit' && selectedPayment) {
        return (
          <PaymentAddPage
            mode="edit"
            payment={selectedPayment}
            onSave={() => setSelectedPayment(null)}
            onNavigate={goSupplier}
          />
        );
      }
      if (activeSupplierPage === 'payment_list') {
        return (
          <PaymentListPage
            onNavigate={goSupplier}
            onEditPayment={(p) => { setSelectedPayment(p); goSupplier('payment_edit'); }}
          />
        );
      }
      return <Dashboard />;
    }
    if (activePage === 'purchase') {
      const goPurchase = (page) => { setActivePage('purchase'); setActivePurchasePage(page); };
      if (activePurchasePage === 'purchase_list') {
        return (
          <PurchaseListPage
            onNavigate={goPurchase}
            onEditPurchase={(p) => { setSelectedPurchase(p); goPurchase('purchase_edit'); }}
          />
        );
      }
      if (activePurchasePage === 'purchase_add') {
        return (
          <PurchaseFormPage
            mode="create"
            onNavigate={goPurchase}
          />
        );
      }
      if (activePurchasePage === 'purchase_edit' && selectedPurchase) {
        return (
          <PurchaseFormPage
            mode="edit"
            purchase={selectedPurchase}
            onSave={() => setSelectedPurchase(null)}
            onNavigate={goPurchase}
          />
        );
      }
      return <Dashboard />;
    }
    if (activePage === 'admin') {
      const goAdmin = (page) => { setActivePage('admin'); setActiveAdminPage(page); };
      if (activeAdminPage === 'admin_user') {
        return (
          <AdminUserPage
            onNavigate={goAdmin}
            onEditUser={(u) => { setSelectedUser(u); setActiveAdminPage('admin_user_edit'); }}
          />
        );
      }
      if (activeAdminPage === 'admin_user_edit') {
        return (
          <AdminUserEditPage
            user={selectedUser}
            onSave={() => setSelectedUser(null)}
            onNavigate={(page) => { setSelectedUser(null); goAdmin(page); }}
          />
        );
      }
      if (activeAdminPage === 'admin_roles') {
        return (
          <AdminRolesPage
            onEditRole={(r) => { setSelectedRole(r); setActiveAdminPage('admin_role_edit'); }}
          />
        );
      }
      if (activeAdminPage === 'admin_role_edit' && selectedRole) {
        return (
          <AdminRoleEditPage
            role={selectedRole}
            onSave={() => { setSelectedRole(null); }}
            onNavigate={(page) => { setSelectedRole(null); goAdmin(page); }}
          />
        );
      }
      if (activeAdminPage === 'admin_permissions') {
        return (
          <AdminPermissionsPage
            onEditPermission={(role) => { setSelectedRole(role); setActiveAdminPage('admin_role_edit'); }}
          />
        );
      }
      return <AdminUserPage onNavigate={goAdmin} onEditUser={(u) => { setSelectedUser(u); setActiveAdminPage('admin_user_edit'); }} />;
    }
    if (activePage === 'landing') {
      const goLanding = (page) => { setActivePage('landing'); setActiveLandingPage(page); };
      if (activeLandingPage === 'landing_create') {
        return <LandingPageCreatePage onNavigate={goLanding} />;
      }
      if (activeLandingPage === 'landing_edit' && selectedCampaign) {
        return (
          <LandingPageCreatePage
            key={selectedCampaign.Id}
            mode="edit"
            campaign={selectedCampaign}
            onNavigate={(page) => { setSelectedCampaign(null); goLanding(page || 'landing_manage'); }}
          />
        );
      }
      if (activeLandingPage === 'landing_manage') {
        return (
          <LandingPageManagePage
            onNavigate={goLanding}
            onViewCampaign={(c) => window.open(`/?landingPageId=${c.Id}`, '_blank', 'noopener,noreferrer')}
            onEditCampaign={(c) => { setSelectedCampaign(c); setActiveLandingPage('landing_edit'); }}
          />
        );
      }
      if (activeLandingPage === 'landing_view' && selectedCampaign) {
        return (
          <LandingPageViewPage
            campaign={selectedCampaign}
            onBack={() => { setSelectedCampaign(null); setActiveLandingPage('landing_manage'); }}
          />
        );
      }
      return <LandingPageCreatePage onNavigate={goLanding} />;
    }
    if (activePage === 'products') {
      if (activeProductPage === 'product_manage') {
        return <ProductManagePage onNavigate={(page, data) => {
          if (page === 'edit_product' && data) { setSelectedProduct(data); }
          setActivePage(page);
        }} />;
      }
      if (activeProductPage === 'categories') {
        return <CategoriesPage onNavigate={setActivePage} onEditCategory={(cat) => { setSelectedCategory(cat); setActivePage('edit_category'); }} />;
      }
      if (activeProductPage === 'subcategories') {
        return <SubcategoriesPage onNavigate={setActivePage} onEditSubcategory={(sub) => { setSelectedSubcategory(sub); setActivePage('edit_subcategory'); }} />;
      }
      if (activeProductPage === 'childcategories') {
        return <ChildCategoriesPage onNavigate={setActivePage} onEditChildcategory={(child) => { setSelectedChildcategory(child); setActivePage('edit_childcategory'); }} />;
      }
      if (activeProductPage === 'brands') {
        return <BrandsPage onNavigate={setActivePage} onEditBrand={(b) => { setSelectedBrand(b); setActivePage('edit_brand'); }} />;
      }
      if (activeProductPage === 'colors') {
        return <ColorsPage onNavigate={setActivePage} onEditColor={(c) => { setSelectedColor(c); setActivePage('edit_color'); }} />;
      }
      if (activeProductPage === 'attribute') {
        return <AttributePage onNavigate={setActivePage} onEditAttribute={(attribute) => { setSelectedAttribute(attribute); setActivePage('edit_attribute'); }} />;
      }
      if (activeProductPage === 'barcode') {
        return <BarcodePage />;
      }
      if (activeProductPage === 'reviews') {
        return <ReviewsPage onNavigate={setActivePage} onEditReview={(review) => { setSelectedReview(review); setActivePage('edit_review'); }} />;
      }
      return <Dashboard />;
    }
    if (activePage === 'customers') {
      const goCustomers = (page) => { setActivePage('customers'); setActiveCustomersPage(page); };
      if (activeCustomersPage === 'customer_list') {
        return (
          <CustomerListPage
            onEditCustomer={(c) => { setSelectedCustomer(c); setActiveCustomersPage('customer_edit'); }}
            onViewCustomer={(c) => { setSelectedCustomer(c); setActiveCustomersPage('customer_view'); }}
          />
        );
      }
      if (activeCustomersPage === 'customer_edit' && selectedCustomer) {
        return (
          <CustomerEditPage
            customer={selectedCustomer}
            onSave={() => setSelectedCustomer(null)}
            onNavigate={(page) => { setSelectedCustomer(null); goCustomers(page); }}
          />
        );
      }
      if (activeCustomersPage === 'customer_view' && selectedCustomer) {
        return (
          <CustomerViewPage
            customer={selectedCustomer}
            onNavigate={(page) => { setSelectedCustomer(null); goCustomers(page); }}
            onLoginAs={(c) => { setSelectedCustomer(c); setActiveCustomersPage('customer_login_as'); }}
          />
        );
      }
      if (activeCustomersPage === 'customer_login_as' && selectedCustomer) {
        return (
          <CustomerLoginAsPage
            customer={selectedCustomer}
            onBack={() => { setSelectedCustomer(null); goCustomers('customer_list'); }}
          />
        );
      }
      if (activeCustomersPage === 'ip_block') {
        return <CustomerIpBlockPage />;
      }
      return <CustomerListPage />;
    }
    if (activePage === 'website') {
      if (activeWebsitePage === 'general_setting') return <WebsiteGeneralSettingPage />;
      if (activeWebsitePage === 'social_media')    return <WebsiteSocialMediaPage />;
      if (activeWebsitePage === 'contact')          return <WebsiteContactPage />;
      if (activeWebsitePage === 'shipping_charge') {
        return (
          <WebsiteShippingChargePage
            onEdit={(c) => { setSelectedShippingCharge(c); setActiveWebsitePage('shipping_charge_edit'); }}
            onCreate={() => { setSelectedShippingCharge(null); setActiveWebsitePage('shipping_charge_edit'); }}
          />
        );
      }
      if (activeWebsitePage === 'order_status') {
        return (
          <WebsiteOrderStatusPage
            onEdit={(s) => { setSelectedOrderStatus(s); setActiveWebsitePage('order_status_edit'); }}
            onCreate={() => { setSelectedOrderStatus(null); setActiveWebsitePage('order_status_edit'); }}
          />
        );
      }
      if (activeWebsitePage === 'order_status_edit') {
        return (
          <WebsiteOrderStatusEditPage
            status={selectedOrderStatus}
            onSave={() => setSelectedOrderStatus(null)}
            onNavigate={(page) => { setSelectedOrderStatus(null); setActiveWebsitePage(page); }}
          />
        );
      }
      if (activeWebsitePage === 'shipping_charge_edit') {
        return (
          <WebsiteShippingChargeEditPage
            charge={selectedShippingCharge}
            onSave={() => setSelectedShippingCharge(null)}
            onNavigate={(page) => { setSelectedShippingCharge(null); setActiveWebsitePage(page); }}
          />
        );
      }
      if (activeWebsitePage === 'create_page') {
        return (
          <WebsitePageManagePage
            onEdit={(p) => { setSelectedPage(p); setActiveWebsitePage('page_edit'); }}
            onCreate={() => { setSelectedPage(null); setActiveWebsitePage('page_edit'); }}
          />
        );
      }
      if (activeWebsitePage === 'page_edit') {
        return (
          <WebsitePageEditPage
            page={selectedPage}
            onSave={() => setSelectedPage(null)}
            onNavigate={(pg) => { setSelectedPage(null); setActiveWebsitePage(pg); }}
          />
        );
      }
      return <WebsiteGeneralSettingPage />;
    }
    if (activePage === 'api') {
      if (activeApiPage === 'courier_api') return <CourierApiPage />;
      if (activeApiPage === 'payment_gateway') return <PaymentGatewayPage />;
      if (activeApiPage === 'sms_gateway') return <SmsGatewayPage />;
      if (activeApiPage === 'fraud_checker_api') return <FraudCheckerApiPage />;
      return <CourierApiPage />;
    }
    if (activePage === 'marketing') {
      const goMarketing = (page) => { setActivePage('marketing'); setActiveMarketingPage(page); };

      if (activeMarketingPage === 'tag_manager') {
        return (
          <TagManagerPage
            tags={tagManagers}
            onCreate={() => { setSelectedTagManager(null); goMarketing('tag_manager_create'); }}
            onEdit={(tag) => { setSelectedTagManager(tag); goMarketing('tag_manager_edit'); }}
            onDelete={deleteTagManager}
          />
        );
      }

      if (activeMarketingPage === 'tag_manager_create') {
        return (
          <TagManagerFormPage
            onSave={saveTagManager}
            onNavigate={goMarketing}
          />
        );
      }

      if (activeMarketingPage === 'tag_manager_edit' && selectedTagManager) {
        return (
          <TagManagerFormPage
            mode="edit"
            tag={selectedTagManager}
            onSave={saveTagManager}
            onNavigate={(page) => { setSelectedTagManager(null); goMarketing(page); }}
          />
        );
      }

      if (activeMarketingPage === 'facebook_pixels') {
        return (
          <FacebookPixelsPage
            pixels={facebookPixels}
            onCreate={() => { setSelectedFacebookPixel(null); goMarketing('facebook_pixels_create'); }}
            onEdit={(pixel) => { setSelectedFacebookPixel(pixel); goMarketing('facebook_pixels_edit'); }}
            onDelete={deleteFacebookPixel}
          />
        );
      }

      if (activeMarketingPage === 'facebook_pixels_create') {
        return (
          <FacebookPixelsFormPage
            onSave={saveFacebookPixel}
            onNavigate={goMarketing}
          />
        );
      }

      if (activeMarketingPage === 'facebook_pixels_edit' && selectedFacebookPixel) {
        return (
          <FacebookPixelsFormPage
            mode="edit"
            pixel={selectedFacebookPixel}
            onSave={saveFacebookPixel}
            onNavigate={(page) => { setSelectedFacebookPixel(null); goMarketing(page); }}
          />
        );
      }

      if (activeMarketingPage === 'coupon_code') {
        return (
          <CouponCodePage
            coupons={couponCodes}
            onCreate={() => { setSelectedCouponCode(null); goMarketing('coupon_code_create'); }}
            onEdit={(coupon) => { setSelectedCouponCode(coupon); goMarketing('coupon_code_edit'); }}
            onDelete={deleteCouponCode}
          />
        );
      }

      if (activeMarketingPage === 'coupon_code_create') {
        return (
          <CouponCodeFormPage
            onSave={saveCouponCode}
            onNavigate={goMarketing}
          />
        );
      }

      if (activeMarketingPage === 'coupon_code_edit' && selectedCouponCode) {
        return (
          <CouponCodeFormPage
            mode="edit"
            coupon={selectedCouponCode}
            onSave={saveCouponCode}
            onNavigate={(page) => { setSelectedCouponCode(null); goMarketing(page); }}
          />
        );
      }

      if (activeMarketingPage === 'sms_marketing') {
        return <SmsMarketingPage />;
      }

      if (activeMarketingPage === 'facebook_catalogue') {
        return <FacebookCataloguePage />;
      }

      if (activeMarketingPage === 'visitor_reports') {
        return <VisitorReportsPage />;
      }

      return <TagManagerPage tags={tagManagers} onCreate={() => goMarketing('tag_manager_create')} onEdit={(tag) => { setSelectedTagManager(tag); goMarketing('tag_manager_edit'); }} onDelete={deleteTagManager} />;
    }
    if (activePage === 'blogs') {
      const goBlogs = (page) => { setActivePage('blogs'); setActiveBlogsPage(page); };

      if (activeBlogsPage === 'blog') {
        return (
          <BlogPage
            blogs={blogs}
            onCreate={() => { setSelectedBlog(null); goBlogs('blog_create'); }}
            onEdit={(blog) => { setSelectedBlog(blog); goBlogs('blog_edit'); }}
            onDelete={deleteBlog}
          />
        );
      }

      if (activeBlogsPage === 'blog_create') {
        return (
          <BlogFormPage
            onSave={saveBlog}
            onNavigate={goBlogs}
          />
        );
      }

      if (activeBlogsPage === 'blog_edit' && selectedBlog) {
        return (
          <BlogFormPage
            mode="edit"
            blog={selectedBlog}
            onSave={saveBlog}
            onNavigate={(page) => { setSelectedBlog(null); goBlogs(page); }}
          />
        );
      }

      return <BlogPage blogs={blogs} onCreate={() => goBlogs('blog_create')} onEdit={(blog) => { setSelectedBlog(blog); goBlogs('blog_edit'); }} onDelete={deleteBlog} />;
    }
    if (activePage === 'banner') {
      const goBanner = (page) => { setActivePage('banner'); setActiveBannerPage(page); };

      if (activeBannerPage === 'banner_category') {
        return (
          <BannerCategoryPage
            categories={bannerCategories}
            onCreate={() => { setSelectedBannerCategory(null); goBanner('banner_category_create'); }}
            onEdit={(category) => { setSelectedBannerCategory(category); goBanner('banner_category_edit'); }}
          />
        );
      }

      if (activeBannerPage === 'banner_category_create') {
        return (
          <BannerCategoryFormPage
            onSave={saveBannerCategory}
            onNavigate={goBanner}
          />
        );
      }

      if (activeBannerPage === 'banner_category_edit' && selectedBannerCategory) {
        return (
          <BannerCategoryFormPage
            mode="edit"
            category={selectedBannerCategory}
            onSave={saveBannerCategory}
            onNavigate={(page) => { setSelectedBannerCategory(null); goBanner(page); }}
          />
        );
      }

      if (activeBannerPage === 'banner_ads') {
        return (
          <BannerAdsPage
            banners={banners}
            onCreate={() => { setSelectedBanner(null); goBanner('banner_ads_create'); }}
            onEdit={(banner) => { setSelectedBanner(banner); goBanner('banner_ads_edit'); }}
            onDelete={deleteBanner}
          />
        );
      }

      if (activeBannerPage === 'banner_ads_create') {
        return (
          <BannerAdsFormPage
            categories={bannerCategories}
            onSave={saveBanner}
            onNavigate={goBanner}
          />
        );
      }

      if (activeBannerPage === 'banner_ads_edit' && selectedBanner) {
        return (
          <BannerAdsFormPage
            mode="edit"
            banner={selectedBanner}
            categories={bannerCategories}
            onSave={saveBanner}
            onNavigate={(page) => { setSelectedBanner(null); goBanner(page); }}
          />
        );
      }

      return <BannerCategoryPage categories={bannerCategories} onCreate={() => goBanner('banner_category_create')} onEdit={(category) => { setSelectedBannerCategory(category); goBanner('banner_category_edit'); }} />;
    }
    if (activePage === 'expense') {
      const goExpense = (page) => { setActivePage('expense'); setActiveExpensePage(page); };

      if (activeExpensePage === 'expense_categories') {
        return (
          <ExpenseCategoryPage
            categories={expenseCategories}
            onCreate={() => { setSelectedExpenseCategory(null); goExpense('expense_category_create'); }}
            onEdit={(category) => { setSelectedExpenseCategory(category); goExpense('expense_category_edit'); }}
          />
        );
      }

      if (activeExpensePage === 'expense_category_create') {
        return (
          <ExpenseCategoryFormPage
            onSave={saveExpenseCategory}
            onNavigate={goExpense}
          />
        );
      }

      if (activeExpensePage === 'expense_category_edit' && selectedExpenseCategory) {
        return (
          <ExpenseCategoryFormPage
            mode="edit"
            category={selectedExpenseCategory}
            onSave={saveExpenseCategory}
            onNavigate={(page) => { setSelectedExpenseCategory(null); goExpense(page); }}
          />
        );
      }

      if (activeExpensePage === 'expense') {
        return (
          <ExpensePage
            expenses={expenses}
            onCreate={() => { setSelectedExpense(null); goExpense('expense_create'); }}
            onEdit={(expense) => { setSelectedExpense(expense); goExpense('expense_edit'); }}
            onDelete={deleteExpense}
          />
        );
      }

      if (activeExpensePage === 'expense_create') {
        return (
          <ExpenseFormPage
            categories={expenseCategories}
            onSave={saveExpense}
            onNavigate={goExpense}
          />
        );
      }

      if (activeExpensePage === 'expense_edit' && selectedExpense) {
        return (
          <ExpenseFormPage
            mode="edit"
            expense={selectedExpense}
            categories={expenseCategories}
            onSave={saveExpense}
            onNavigate={(page) => { setSelectedExpense(null); goExpense(page); }}
          />
        );
      }

      return <ExpenseCategoryPage categories={expenseCategories} onCreate={() => goExpense('expense_category_create')} onEdit={(category) => { setSelectedExpenseCategory(category); goExpense('expense_category_edit'); }} />;
    }
    if (activePage === 'reports') {
      return <ReportsPage reportKey={activeReportsPage} />;
    }
    return <Dashboard />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        activeOrderStatus={activeOrderStatus}
        onOrderStatusChange={setActiveOrderStatus}
        orderCounts={orderCounts}
        activeProductPage={activeProductPage}
        onProductPageChange={setActiveProductPage}
        activeSupplierPage={activeSupplierPage}
        onSupplierPageChange={setActiveSupplierPage}
        activePurchasePage={activePurchasePage}
        onPurchasePageChange={setActivePurchasePage}
        activeLandingPage={activeLandingPage}
        onLandingPageChange={setActiveLandingPage}
        activeAdminPage={activeAdminPage}
        onAdminPageChange={setActiveAdminPage}
        activeCustomersPage={activeCustomersPage}
        onCustomersPageChange={setActiveCustomersPage}
        activeWebsitePage={activeWebsitePage}
        onWebsitePageChange={setActiveWebsitePage}
        activeApiPage={activeApiPage}
        onApiPageChange={setActiveApiPage}
        activeMarketingPage={activeMarketingPage}
        onMarketingPageChange={setActiveMarketingPage}
        activeBlogsPage={activeBlogsPage}
        onBlogsPageChange={setActiveBlogsPage}
        activeBannerPage={activeBannerPage}
        onBannerPageChange={setActiveBannerPage}
        activeExpensePage={activeExpensePage}
        onExpensePageChange={setActiveExpensePage}
        activeReportsPage={activeReportsPage}
        onReportsPageChange={setActiveReportsPage}
        siteSettings={siteSettings}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav siteSettings={siteSettings} />
        {renderMain()}
      </div>
    </div>
  );
}

export default App;
