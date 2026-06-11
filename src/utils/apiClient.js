const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const STORAGE_KEYS = {
  access: "wazih_access",
  refresh: "wazih_refresh",
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.access);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refresh);
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.access, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.refresh, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.access);
  localStorage.removeItem(STORAGE_KEYS.refresh);
  localStorage.removeItem("wazih_user");
}

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

// Refresh the access token using the stored refresh token
async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE}/user/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired. Please login again.");
  }

  const json = await res.json();
  const newAccess = json.data?.accessToken;
  const newRefresh = json.data?.refreshToken;
  setTokens(newAccess, newRefresh);
  return newAccess;
}

// Singleton refresh promise to prevent parallel refresh calls
let refreshPromise = null;

async function getValidToken() {
  const token = getAccessToken();
  if (!token) return null;
  if (!isTokenExpired(token)) return token;

  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const token = await getValidToken();
  // Don't set Content-Type for FormData — browser sets it with boundary automatically
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token might have just expired between the check and the request
    try {
      const freshToken = await doRefresh();
      const retryRes = await fetch(`${BASE}${path}`, {
        credentials: "include",
        ...options,
        headers: { ...headers, Authorization: `Bearer ${freshToken}` },
      });
      if (!retryRes.ok) {
        const err = await retryRes.json();
        throw new Error(err.message || "Request failed");
      }
      return retryRes.json();
    } catch {
      clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
      throw new Error("Session expired. Please login again.");
    }
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

export function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}
