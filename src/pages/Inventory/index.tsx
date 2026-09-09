import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  Boxes,
  Download,
  Edit3,
  Eye,
  PackageCheck,
  PackageX,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  adminProducts,
  getCategoryLabel,
  getStockStatus,
  storefrontCategories,
  type StockStatus,
} from "@/lib/storefront-data";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SortKey = "stock" | "available" | "incoming" | "title";

const statusClass: Record<StockStatus, string> = {
  "In Stock": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Low Stock": "border-amber-200 bg-amber-50 text-amber-700",
  "Out of Stock": "border-rose-200 bg-rose-50 text-rose-700",
};

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | StockStatus>("all");
  const [warehouse, setWarehouse] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("available");

  const warehouses = Array.from(new Set(adminProducts.map((product) => product.warehouse)));

  const rows = useMemo(() => {
    return adminProducts
      .map((product) => ({
        ...product,
        available: Math.max(product.stock - product.reserved, 0),
        stockStatus: getStockStatus(product),
      }))
      .filter((product) => {
        const term = query.toLowerCase().trim();
        const matchesQuery =
          !term ||
          product.title.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          product.slug.toLowerCase().includes(term);
        const matchesCategory = category === "all" || product.category === category;
        const matchesStatus = status === "all" || product.stockStatus === status;
        const matchesWarehouse = warehouse === "all" || product.warehouse === warehouse;
        return matchesQuery && matchesCategory && matchesStatus && matchesWarehouse;
      })
      .sort((a, b) => {
        if (sortKey === "title") return a.title.localeCompare(b.title);
        return Number(a[sortKey]) - Number(b[sortKey]);
      });
  }, [category, query, sortKey, status, warehouse]);

  const totalStock = adminProducts.reduce((sum, product) => sum + product.stock, 0);
  const reservedStock = adminProducts.reduce((sum, product) => sum + product.reserved, 0);
  const incomingStock = adminProducts.reduce((sum, product) => sum + product.incoming, 0);
  const lowStockCount = adminProducts.filter((product) => getStockStatus(product) === "Low Stock").length;
  const outOfStockCount = adminProducts.filter((product) => getStockStatus(product) === "Out of Stock").length;
  const stats: { label: string; value: number; icon: LucideIcon; color: string }[] = [
    { label: "On hand", value: totalStock, icon: PackageCheck, color: "text-slate-950" },
    { label: "Reserved", value: reservedStock, icon: Truck, color: "text-blue-600" },
    { label: "Incoming", value: incomingStock, icon: Boxes, color: "text-emerald-600" },
    { label: "Low stock", value: lowStockCount, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Out of stock", value: outOfStockCount, icon: PackageX, color: "text-rose-600" },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Catalogue / Operations
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Inventory Management
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Track on-hand stock, reserved units, available inventory, reorder points, incoming
                replenishment, and warehouse availability for storefront products.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export stock
            </button>
            <Link
              to="/products/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-5">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <p className={cn("mt-2 text-2xl font-bold", color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-100 p-4 lg:grid-cols-[minmax(260px,1fr)_repeat(4,190px)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="Search product, SKU, slug..."
            />
          </div>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none">
            <option value="all">All categories</option>
            {storefrontCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as "all" | StockStatus)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none">
            <option value="all">All stock status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <select value={warehouse} onChange={(event) => setWarehouse(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none">
            <option value="all">All warehouses</option>
            {warehouses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none">
            <option value="available">Sort by available</option>
            <option value="stock">Sort by on hand</option>
            <option value="incoming">Sort by incoming</option>
            <option value="title">Sort by name</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4 text-right">On hand</th>
                <th className="px-5 py-4 text-right">Reserved</th>
                <th className="px-5 py-4 text-right">Available</th>
                <th className="px-5 py-4 text-right">Reorder</th>
                <th className="px-5 py-4 text-right">Incoming</th>
                <th className="px-5 py-4">Warehouse</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((product) => (
                <tr key={product.id} className="group hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold text-slate-950">{product.title}</p>
                        <p className="mt-0.5 font-mono text-xs text-slate-400">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{product.sku}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-700">{product.stock}</td>
                  <td className="px-5 py-4 text-right text-slate-500">{product.reserved}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-950">{product.available}</td>
                  <td className="px-5 py-4 text-right text-slate-500">{product.reorderPoint}</td>
                  <td className="px-5 py-4 text-right font-semibold text-emerald-600">{product.incoming}</td>
                  <td className="px-5 py-4 text-slate-600">{product.warehouse}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", statusClass[product.stockStatus])}>
                      {product.stockStatus !== "In Stock" && <AlertTriangle className="h-3.5 w-3.5" />}
                      {product.stockStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                      <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" aria-label="View stock">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" aria-label="Adjust stock">
                        <ArrowDownUp className="h-4 w-4" />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" aria-label="Edit product">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="py-16 text-center">
            <Boxes className="mx-auto h-9 w-9 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">No inventory rows found</p>
          </div>
        )}
      </div>
    </section>
  );
}
