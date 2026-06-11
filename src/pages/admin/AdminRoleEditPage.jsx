import { useState } from 'react';
import { rolePermissionService } from '../../services/adminService';

const ALL_PERMISSIONS = [
  'banner-category-create', 'banner-category-delete', 'banner-category-edit', 'banner-category-list',
  'banner-create', 'banner-delete', 'banner-edit', 'banner-list',
  'brand-create', 'brand-delete', 'brand-edit', 'brand-list',
  'campaign-create', 'campaign-delete', 'campaign-edit', 'campaign-list',
  'category-create', 'category-delete', 'category-edit', 'category-list',
  'childcategory-create', 'childcategory-delete', 'childcategory-edit', 'childcategory-list',
  'color-create', 'color-delete', 'color-edit', 'color-list',
  'couponcode-create', 'couponcode-delete', 'couponcode-edit', 'couponcode-list',
  'customer-manage-create', 'customer-manage-delete', 'customer-manage-edit', 'customer-manage-list',
  'dashboard-off',
  'expense-create', 'expense-delete', 'expense-edit', 'expense-list',
  'expensecategory-create', 'expensecategory-delete', 'expensecategory-edit', 'expensecategory-list',
  'google-tag-create', 'google-tag-delete', 'google-tag-edit', 'google-tag-list',
  'order-create', 'order-delete', 'order-edit', 'order-invoice', 'order-list', 'order-process',
  'order-status-create', 'order-status-delete', 'order-status-edit', 'order-status-list',
  'page-create', 'page-delete', 'page-edit', 'page-list',
  'permission-create', 'permission-delete', 'permission-edit', 'permission-list',
  'pixel-create', 'pixel-delete', 'pixel-edit', 'pixel-list',
  'product-create', 'product-delete', 'product-edit', 'product-list',
  'purchase-create', 'purchase-delete', 'purchase-edit', 'purchase-list',
  'review-create', 'review-delete', 'review-edit', 'review-list',
  'role-create', 'role-delete', 'role-edit', 'role-list',
  'setting-create', 'setting-delete', 'setting-edit', 'setting-list',
  'shipping-create', 'shipping-delete', 'shipping-edit', 'shipping-list',
  'social-create', 'social-delete', 'social-edit', 'social-list',
  'subcategory-create', 'subcategory-delete', 'subcategory-edit', 'subcategory-list',
  'supplier-create', 'supplier-delete', 'supplier-edit', 'supplier-list',
  'user-create', 'user-delete', 'user-edit', 'user-list',
  'user_management',
];

export default function AdminRoleEditPage({ role, onSave, onNavigate }) {
  const [checked, setChecked] = useState(new Set(role?.menuPermissions ?? []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allChecked = checked.size === ALL_PERMISSIONS.length;
  const someChecked = checked.size > 0 && !allChecked;

  function toggleAll() {
    setChecked(allChecked ? new Set() : new Set(ALL_PERMISSIONS));
  }

  function toggle(perm) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm); else next.add(perm);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!role?.role) return;
    setSaving(true);
    setError('');
    try {
      await rolePermissionService.update(role.role, [...checked]);
      onSave && onSave();
      onNavigate && onNavigate('admin_roles');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  const cols = [[], [], []];
  ALL_PERMISSIONS.forEach((p, i) => cols[i % 3].push(p));

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">
          Role Permissions — <span className="text-indigo-600 capitalize">{role?.role}</span>
        </h1>
        <button type="button" onClick={() => onNavigate && onNavigate('admin_roles')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
          Manage
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allChecked}
            ref={(el) => { if (el) el.indeterminate = someChecked; }}
            onChange={toggleAll}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-sm font-semibold text-blue-600">Check All ({checked.size} / {ALL_PERMISSIONS.length})</span>
        </label>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-3 gap-x-6">
            {cols.map((col, ci) => (
              <div key={ci} className="space-y-0">
                {col.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-gray-50 px-1 rounded select-none">
                    <input
                      type="checkbox"
                      checked={checked.has(perm)}
                      onChange={() => toggle(perm)}
                      className="w-3.5 h-3.5 rounded accent-blue-600 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700">{perm}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition">
          {saving ? 'Saving...' : 'Save Permissions'}
        </button>
      </form>
    </div>
  );
}
