import { apiRequest, buildQuery } from "../utils/apiClient";

export const orderService = {
  getOrders: (params = {}) => apiRequest(`/orders${buildQuery(params)}`),
  getStatusCounts: () => apiRequest("/orders/status-counts"),
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  trackOrders: (phone) => apiRequest(`/orders/track${buildQuery({ phone })}`),
  createOrder: (data) =>
    apiRequest("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateOrder: (id, data) =>
    apiRequest(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteOrder: (id) =>
    apiRequest(`/orders/${id}`, { method: "DELETE" }),
};
