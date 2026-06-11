import { apiRequest, clearTokens, getAccessToken } from "../utils/apiClient";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

async function rawPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

export const authService = {
  login: (email, password) =>
    rawPost("/user/login", { Email: email, Password: password }),

  logout: () => {
    const token = getAccessToken();
    return fetch(`${BASE}/user/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }).finally(() => clearTokens());
  },

  refreshToken: (refreshToken) =>
    rawPost("/user/refresh-token", { refreshToken }),

  getProfile: (id) => apiRequest(`/user/${id}`),
};
