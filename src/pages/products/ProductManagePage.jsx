import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  Search,
  Eye,
  Edit2,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { productService } from "../../services/productService";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

function parseImages(images) {
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }
  return [];
}

function imageSrc(file) {
  if (!file) return "";
  return /^https?:\/\//i.test(file) ? file : `${BASE_URL}/images/${file}`;
}

const PAGE_SIZES = [10, 20, 30, 50];

export default function ProductManagePage({ onNavigate }) {
  const [perPage, setPerPage] = useState(30);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

  const {
    data: products,
    meta,
    loading,
    error,
    refetch,
  } = useProducts({
    searchTerm,
    page,
    limit: perPage,
  });

  const total = meta?.count ?? products.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function handleSearch() {
    setSearchTerm(searchInput);
    setPage(1);
  }

  function toggleAll() {
    if (selected.length === products.length) setSelected([]);
    else setSelected(products.map((p) => p.Id));
  }

  function toggleOne(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleDelete(id) {
    if (!window.confirm("এই product মুছে ফেলবেন?")) return;
    try {
      await productService.delete(id);
      setSelected((prev) => prev.filter((item) => item !== id));
      refetch();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleBulkDelete() {
    if (selected.length === 0) return;
    if (!window.confirm(`${selected.length} টি product মুছে ফেলবেন?`)) return;
    try {
      await Promise.all(selected.map((id) => productService.delete(id)));
      setSelected([]);
      refetch();
    } catch (e) {
      alert(e.message || "Selected products delete করতে সমস্যা হয়েছে");
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Product Manage</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate("create_product")}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
          >
            <Plus size={14} /> Create
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow p-3 flex flex-wrap items-center gap-2">
        <button
          disabled={selected.length === 0}
          onClick={handleBulkDelete}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-xs font-medium px-3 py-1.5 rounded transition"
        >
          <Trash2 size={13} />
          Delete {selected.length > 0 && `(${selected.length})`}
        </button>
        <button className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded transition">
          Action <ChevronDown size={13} />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded flex items-center gap-1 transition"
          >
            <Search size={12} /> Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading && (
          <div className="text-center py-12 text-gray-400 text-xs">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-400 text-xs">{error}</div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 py-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === products.length &&
                        products.length > 0
                      }
                      onChange={toggleAll}
                      className="rounded accent-blue-600"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-gray-500 font-semibold w-16">
                    Image
                  </th>
                  <th className="px-3 py-3 text-left text-gray-500 font-semibold">
                    Name
                  </th>
                  <th className="px-3 py-3 text-center text-gray-500 font-semibold">
                    SKU
                  </th>
                  <th className="px-3 py-3 text-center text-gray-500 font-semibold">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-gray-500 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <ProductRow
                    key={product.Id}
                    product={product}
                    checked={selected.includes(product.Id)}
                    onToggle={() => toggleOne(product.Id)}
                    onDelete={() => handleDelete(product.Id)}
                    onEdit={() =>
                      onNavigate && onNavigate("edit_product", product)
                    }
                  />
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      কোনো পণ্য পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing {total === 0 ? 0 : (page - 1) * perPage + 1}–
            {Math.min(page * perPage, total)} of {total}
          </div>
          <div className="flex items-center gap-1">
            <PaginationBtn
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </PaginationBtn>
            {buildPageRange(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="w-7 text-center text-gray-400 text-xs"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <PaginationBtn
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={14} />
            </PaginationBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, checked, onToggle, onDelete, onEdit }) {
  const active = product.status === "active" || product.status === "Active";
  return (
    <tr
      className={`border-b border-gray-50 transition ${checked ? "bg-blue-50" : "hover:bg-gray-50/60"}`}
    >
      <td className="px-3 py-2.5 text-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="rounded accent-blue-600"
        />
      </td>
      <td className="px-3 py-2.5">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 rounded-lg overflow-hidden flex items-center justify-center">
          {(() => {
            const imgs = parseImages(product.images);
            return imgs[0] ? (
              <img
                src={imageSrc(imgs[0])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.querySelector("span").style.display =
                    "flex";
                }}
              />
            ) : (
              <span className="text-orange-400 text-[9px] font-medium">
                IMG
              </span>
            );
          })()}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div className="font-semibold text-gray-800 max-w-[260px] leading-tight line-clamp-2">
          {product.name}
        </div>
        {product.sku && (
          <div className="mt-0.5 text-gray-400 text-[10px]">
            SKU: {product.sku}
          </div>
        )}
      </td>
      <td className="px-3 py-2.5 text-center text-gray-600">
        {product.sku || "—"}
      </td>
      <td className="px-3 py-2.5 text-center">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-3 py-2.5 text-center">
        <div className="flex items-center justify-center gap-1">
          <ActionBtn
            icon={<Eye size={12} />}
            color="bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
            title="View"
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

function ActionBtn({ icon, color, title, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-6 h-6 rounded flex items-center justify-center transition ${color}`}
    >
      {icon}
    </button>
  );
}

function PaginationBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 rounded flex items-center justify-center transition ${
        disabled
          ? "bg-gray-50 text-gray-300 cursor-not-allowed"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  )
    pages.push(p);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
