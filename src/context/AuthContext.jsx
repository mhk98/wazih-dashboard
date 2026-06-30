import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { authService } from "../services/authService";
import {
  clearTokens,
  decodeToken,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  pingApi,
  setTokens,
  USER_STORAGE_KEYS,
} from "../utils/apiClient";

const AuthContext = createContext(null);

const USER_KEY = USER_STORAGE_KEYS.current;

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef(null);
  const keepAliveTimerRef = useRef(null);

  const logout = useCallback(async () => {
    clearTimers();
    try { await authService.logout(); } catch { /* ignore */ }
    clearTokens();
    saveUser(null);
    setUser(null);
  }, []);

  function clearTimers() {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
  }

  // Schedule a token refresh ~60 seconds before expiry
  const scheduleRefresh = useCallback((token) => {
    clearTimers();
    const decoded = decodeToken(token);
    if (!decoded?.exp) return;
    const msLeft = decoded.exp * 1000 - Date.now() - 60_000;
    if (msLeft <= 0) return;
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return;
        const res = await authService.refreshToken(refreshToken);
        const newAccess = res.data?.accessToken;
        const newRefresh = res.data?.refreshToken;
        if (newAccess) {
          setTokens(newAccess, newRefresh);
          scheduleRefresh(newAccess);
        }
      } catch {
        logout();
      }
    }, msLeft);
  }, [logout]);

  // On mount: validate stored tokens
  useEffect(() => {
    const init = async () => {
      const access = getAccessToken();
      const refresh = getRefreshToken();

      if (!access && !refresh) {
        setIsLoading(false);
        return;
      }

      if (access && !isTokenExpired(access)) {
        scheduleRefresh(access);
        setIsLoading(false);
        return;
      }

      // Access token expired — try refresh
      if (refresh) {
        try {
          const res = await authService.refreshToken(refresh);
          const newAccess = res.data?.accessToken;
          const newRefresh = res.data?.refreshToken;
          if (newAccess) {
            setTokens(newAccess, newRefresh);
            scheduleRefresh(newAccess);
            setIsLoading(false);
            return;
          }
        } catch { /* fall through */ }
      }

      // Both expired — clear everything
      clearTokens();
      saveUser(null);
      setUser(null);
      setIsLoading(false);
    };

    init();

    // Listen for forced logout events from apiClient (401 that can't be refreshed)
    const onForceLogout = () => { clearTokens(); saveUser(null); setUser(null); };
    window.addEventListener("auth:logout", onForceLogout);
    return () => {
      clearTimers();
      window.removeEventListener("auth:logout", onForceLogout);
    };
  }, [scheduleRefresh, logout]);

  useEffect(() => {
    if (!user) return undefined;

    const keepAlive = () => {
      if (!getAccessToken()) return;
      pingApi().catch(() => {
        // The next real request will surface the error; this only keeps warm.
      });
    };

    keepAlive();
    keepAliveTimerRef.current = setInterval(keepAlive, 240_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") keepAlive();
    };
    window.addEventListener("focus", keepAlive);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
      window.removeEventListener("focus", keepAlive);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user]);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const { accessToken, refreshToken, user: userData, menuPermissions } = res.data;
    setTokens(accessToken, refreshToken);
    const fullUser = { ...userData, menuPermissions };
    saveUser(fullUser);
    setUser(fullUser);
    scheduleRefresh(accessToken);
    return fullUser;
  }, [scheduleRefresh]);

  const value = {
    user,
    isAuthenticated: !!user && !!getAccessToken(),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
