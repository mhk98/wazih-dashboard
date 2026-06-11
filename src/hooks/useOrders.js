import { useState, useEffect, useCallback, useRef } from "react";
import { orderService } from "../services/orderService";

export function useOrders({ status, search, fromDate, toDate, page, limit = 20 }) {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrders({
        status: status && status !== "all" ? status : undefined,
        search: search || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: page || 1,
        limit,
        sortBy: "Id",
        sortOrder: "DESC",
      });
      setOrders(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, limit });
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, search, fromDate, toDate, page, limit]);

  useEffect(() => {
    fetchOrders();
    return () => abortRef.current?.abort();
  }, [fetchOrders]);

  return { orders, meta, loading, error, refetch: fetchOrders };
}

export function useOrderStatusCounts(isAuthenticated = true) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await orderService.getStatusCounts();
      setCounts(res.data || {});
    } catch {
      // silent fail — sidebar badge will just show 0
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return { counts, loading, refetch: fetchCounts };
}
