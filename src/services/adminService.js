import { apiRequest, buildQuery } from "../utils/apiClient";

export const userService = {
  getAll: (params) => apiRequest(`/user${buildQuery(params)}`),
  getById: (id) => apiRequest(`/user/${id}`),
  register: (data) => apiRequest("/user/register", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/user/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    apiRequest(`/user/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  delete: (id) => apiRequest(`/user/${id}`, { method: "DELETE" }),
  impersonate: (id) => apiRequest(`/user/${id}/impersonate`, { method: "POST" }),
};

export const rolePermissionService = {
  getAll: () => apiRequest("/role-permissions"),
  getByRole: (role) => apiRequest(`/role-permissions/${role}`),
  update: (role, menuPermissions) =>
    apiRequest(`/role-permissions/${role}`, {
      method: "PUT",
      body: JSON.stringify({ menuPermissions }),
    }),
};
