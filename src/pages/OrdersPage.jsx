import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Loader2,
  Ban,
} from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { orderService } from "../services/orderService";
import { orderStatusService } from "../services/websiteService";
import { ipBlockService } from "../services/websiteService";
import {
  buildStatusMaps,
  normalizeOrderStatuses,
  toOrderStatusKey,
} from "../utils/orderStatuses";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

const PAGE_SIZE = 20;

const COURIER_COLORS = {
  Pathao: "bg-pink-100 text-pink-700",
  Steadfast: "bg-blue-100 text-blue-700",
  Redx: "bg-red-100 text-red-700",
  Paperfly: "bg-purple-100 text-purple-700",
  eCourier: "bg-green-100 text-green-700",
};

export default function OrdersPage({
  activeStatus,
  onStatusChange,
  onCreateOrder,
  onViewOrder,
  onEditOrder,
  statusCounts = {},
  onCountsRefresh,
}) {
  const [orderStatuses, setOrderStatuses] = useState(() =>
    normalizeOrderStatuses(),
  );
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const { orders, meta, loading, error, refetch } = useOrders({
    status: activeStatus,
    search: appliedSearch,
    fromDate: appliedFrom,
    toDate: appliedTo,
    page,
    limit: PAGE_SIZE,
  });

  function handleSearch() {
    setAppliedSearch(search);
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setPage(1);
  }

  function handleStatusClick(key) {
    onStatusChange(key);
    setPage(1);
    setSearch("");
    setAppliedSearch("");
    setAppliedFrom("");
    setAppliedTo("");
    setFromDate("");
    setToDate("");
  }

  async function handleDelete(id) {
    if (!window.confirm("এই অর্ডার মুছে ফেলবেন?")) return;
    try {
      await orderService.deleteOrder(id);
      refetch();
      onCountsRefresh?.();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  async function handleBlockIp(order) {
    const ip = String(order.ipAddress || "").trim();
    if (!ip) return;
    if (!window.confirm(`${ip} IP address block করবেন?`)) return;
    try {
      await ipBlockService.create({
        ip,
        reason: `Blocked from order ${order.orderId || order.Id}`,
      });
      alert(`${ip} blocked successfully.`);
    } catch (err) {
      alert(err.message || "IP block failed");
    }
  }

  const totalPages = Math.max(1, Math.ceil((meta?.total || 0) / PAGE_SIZE));
  const currentStatus = activeStatus || "all";
  const statusMaps = useMemo(
    () => buildStatusMaps(orderStatuses),
    [orderStatuses],
  );
  const tabStatuses = useMemo(
    () => ["all", ...statusMaps.statuses.map((s) => s.key)],
    [statusMaps.statuses],
  );

  useEffect(() => {
    let mounted = true;
    orderStatusService
      .getAll({ limit: 100 })
      .then((res) => {
        if (mounted) setOrderStatuses(normalizeOrderStatuses(res.data || []));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Status tab filter */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1.5 flex-wrap">
        {tabStatuses.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusClick(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition whitespace-nowrap ${
              currentStatus === s
                ? "text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={
              currentStatus === s
                ? {
                    backgroundColor:
                      s === "all"
                        ? "#06b6d4"
                        : orderStatuses.find((item) => item.key === s)?.color,
                  }
                : undefined
            }
          >
            {statusMaps.labels[s] || s}
            <span className="ml-1 opacity-80">({statusCounts[s] ?? 0})</span>
          </button>
        ))}
        <button
          onClick={onCreateOrder}
          className="ml-auto flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full transition"
        >
          <Plus size={13} />
          Create Order
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow p-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <select
            value={currentStatus}
            onChange={(e) => handleStatusClick(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {tabStatuses.map((s) => (
              <option key={s} value={s}>
                {statusMaps.labels[s] || s}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <input
              type="text"
              placeholder="ফোন নম্বর / নাম / অর্ডার ID / IP দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <Search size={13} />
              Search
            </button>
          </div>

          <button
            onClick={() => {
              refetch();
              onCountsRefresh?.();
            }}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>

          <div className="text-xs text-gray-500 ml-auto">
            Total:{" "}
            <span className="font-semibold text-gray-800">
              {meta?.total ?? 0}
            </span>{" "}
            orders
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div
            className="px-4 py-3 border-b border-gray-100 flex items-center justify-between"
            style={{ background: "linear-gradient(90deg, #1d4ed8, #3b82f6)" }}
          >
            <span className="text-white font-semibold text-sm">
              {statusMaps.labels[currentStatus] || "All Order"} (
              {meta?.total ?? 0})
            </span>
            {loading && (
              <Loader2 size={16} className="text-white animate-spin" />
            )}
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-600 text-xs">
              Error: {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    #
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Customer
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    IP
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Product
                  </th>
                  <th className="text-right px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Total Bill
                  </th>
                  <th className="text-center px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Courier
                  </th>
                  <th className="text-center px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-center px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Fraud Guard
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Order Info
                  </th>
                  <th className="text-center px-3 py-2.5 text-gray-500 font-semibold whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-12 text-gray-400"
                    >
                      <Loader2 size={20} className="inline animate-spin mr-2" />
                      লোড হচ্ছে...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-12 text-gray-400"
                    >
                      কোনো অর্ডার পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <OrderRow
                      key={order.Id}
                      order={order}
                      index={(page - 1) * PAGE_SIZE + idx + 1}
                      onView={() => onViewOrder && onViewOrder(order)}
                      onEdit={() => onEditOrder && onEditOrder(order)}
                      onDelete={() => handleDelete(order.Id)}
                      onBlockIp={() => handleBlockIp(order)}
                      statusLabels={statusMaps.labels}
                      statusClasses={statusMaps.classes}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, meta?.total || 0)}–
              {Math.min(page * PAGE_SIZE, meta?.total || 0)} of{" "}
              {meta?.total || 0}
            </div>
            <div className="flex items-center gap-1">
              <PageBtn
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                icon={<ChevronLeft size={14} />}
              />
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5 && page > 3) {
                  p = page - 2 + i;
                  if (p > totalPages) p = totalPages - (4 - i);
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs font-medium transition ${p === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <PageBtn
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                icon={<ChevronRight size={14} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  index,
  onView,
  onEdit,
  onDelete,
  onBlockIp,
  statusLabels,
  statusClasses,
}) {
  const statusKey = toOrderStatusKey(order.status);
  const statusColor = statusClasses[statusKey] || "bg-gray-400 text-white";
  const statusLabel = statusLabels[statusKey] || order.status;
  const courierColor =
    COURIER_COLORS[order.courier] || "bg-gray-100 text-gray-700";
  const dateStr = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString("en-GB")
    : order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-GB")
      : "—";
  const timeStr = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <tr className="border-b border-gray-50 hover:bg-blue-50/30 transition">
      <td className="px-3 py-2.5 text-gray-400 font-medium">{index}.</td>

      <td className="px-3 py-2.5">
        <div className="font-semibold text-gray-800 text-xs">
          {order.customerName}
        </div>
        <div className="text-gray-500 text-xs mt-0.5">
          {order.customerPhone}
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {order.customerArea && (
            <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px]">
              {order.customerArea}
            </span>
          )}
          {order.customerDistrict && (
            <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-[10px]">
              {order.customerDistrict}
            </span>
          )}
        </div>
      </td>

      <td className="px-3 py-2.5">
        {order.ipAddress ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(order.ipAddress)}
              className="max-w-[150px] rounded bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200"
              title={`Click to copy IP: ${order.ipAddress}`}
            >
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                {order.ipAddress}
              </span>
            </button>
            <button
              type="button"
              onClick={onBlockIp}
              className="flex h-7 w-7 items-center justify-center rounded bg-red-100 text-red-600 transition hover:bg-red-200"
              title={`Block IP: ${order.ipAddress}`}
            >
              <Ban size={13} />
            </button>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>

      <td className="px-3 py-2.5">
        <div className="flex items-start gap-2">
          <div className="w-9 h-9 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-300 text-[9px] flex-shrink-0 overflow-hidden">
            {order.productImage ? (
              <img
                src={`${BASE_URL}/images/${order.productImage}`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.textContent = "IMG";
                }}
              />
            ) : (
              "IMG"
            )}
          </div>
          <div>
            <div className="text-gray-700 leading-tight max-w-[140px] line-clamp-2">
              {order.productName}
            </div>
            <div className="text-gray-400 mt-0.5">Qty: {order.quantity}</div>
          </div>
        </div>
      </td>

      <td className="px-3 py-2.5 text-right">
        <div className="font-bold text-gray-800">
          ৳ {Number(order.totalBill).toLocaleString()}
        </div>
        {Number(order.advance) > 0 && (
          <div className="text-gray-400 text-[10px] mt-0.5">
            Advance: ৳{Number(order.advance).toLocaleString()}
          </div>
        )}
      </td>

      <td className="px-3 py-2.5 text-center">
        {order.courier ? (
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-semibold ${courierColor}`}
          >
            {order.courier}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>

      <td className="px-3 py-2.5 text-center">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusColor}`}
        >
          {statusLabel}
        </span>
        {order.status === "in_courier" && (
          <div className="text-[10px] text-indigo-500 mt-0.5">In Transit</div>
        )}
      </td>

      <td className="px-3 py-2.5 text-center">
        <FraudGuard score={order.fraudScore || 1} />
      </td>

      <td className="px-3 py-2.5">
        <div className="font-semibold text-gray-700">{order.orderId}</div>
        <div className="text-gray-400 text-[10px] mt-0.5">{dateStr}</div>
        <div className="text-gray-400 text-[10px]">{timeStr}</div>
      </td>

      <td className="px-3 py-2.5 text-center">
        <div className="flex items-center justify-center gap-1">
          <ActionBtn
            icon={<Eye size={12} />}
            color="bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
            title="View"
            onClick={onView}
          />
          <ActionBtn
            icon={<Edit2 size={12} />}
            color="bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Edit"
            onClick={onEdit}
          />
          <ActionBtn
            icon={<Trash2 size={12} />}
            color="bg-red-100 text-red-500 hover:bg-red-200"
            title="Delete"
            onClick={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}

function FraudGuard({ score }) {
  const colors = [
    "bg-green-500",
    "bg-green-400",
    "bg-yellow-400",
    "bg-orange-400",
    "bg-red-500",
  ];
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < score ? colors[score - 1] : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function ActionBtn({ icon, color, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-6 h-6 rounded flex items-center justify-center transition ${color}`}
    >
      {icon}
    </button>
  );
}

function PageBtn({ onClick, disabled, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 rounded flex items-center justify-center transition ${disabled ? "bg-gray-50 text-gray-300 cursor-not-allowed" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
    >
      {icon}
    </button>
  );
}
