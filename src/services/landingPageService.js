import { apiRequest, buildQuery } from '../utils/apiClient';

export const landingPageService = {
  getAll: (params = {}) => apiRequest(`/landing-pages${buildQuery(params)}`),
  getOne: (id) => apiRequest(`/landing-pages/${id}`),
  create: (data) => apiRequest('/landing-pages/create', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/landing-pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/landing-pages/${id}`, { method: 'DELETE' }),
};
