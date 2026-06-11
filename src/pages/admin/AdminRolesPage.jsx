import { Pencil, X } from 'lucide-react';
import { useRolePermissions } from '../../hooks/useAdmin';
import { rolePermissionService } from '../../services/adminService';

export default function AdminRolesPage({ onEditRole }) {
  const { data: roles, loading, error, refetch } = useRolePermissions();

  async function handleDelete(roleRow) {
    if (!window.confirm(`"${roleRow.role}" permissions মুছে ফেলবেন?`)) return;
    try {
      await rolePermissionService.update(roleRow.role, []);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Roles Manage</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['SL', 'Role', 'Permissions Count', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="text-center py-10 text-gray-400">Loading...</td></tr>}
              {!loading && error && <tr><td colSpan={4} className="text-center py-10 text-red-400">{error}</td></tr>}
              {!loading && !error && roles.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No roles found</td></tr>
              )}
              {!loading && roles.map((role, i) => (
                <tr key={role.Id ?? role.role} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 capitalize">{role.role}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                      {(role.menuPermissions || []).length} permissions
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button type="button" title="Edit" onClick={() => onEditRole && onEditRole(role)}
                        className="w-7 h-7 rounded bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition">
                        <Pencil size={13} />
                      </button>
                      <button type="button" title="Clear Permissions" onClick={() => handleDelete(role)}
                        className="w-7 h-7 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition">
                        <X size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {roles.length} role{roles.length !== 1 ? 's' : ''} total
          </span>
        </div>
      </div>
    </div>
  );
}
