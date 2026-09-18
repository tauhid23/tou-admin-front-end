import { useDeferredValue, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDownUp, Boxes, ChevronLeft, ChevronRight, Clock3, Download,
  Edit3, Loader2, PackageCheck, PackageX, Plus, Search, Truck, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getInventoryExport, useAdjustInventory, useInventory, useInventoryMovements,
  type InventoryItem, type InventoryMovement,
} from "@/lib/api/queries";
import { useToast } from "@/lib/providers/ToastProvider";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StockStatus = "in" | "low" | "out";
type SortKey = "available" | "stock" | "incoming" | "reorderPoint" | "title" | "updatedAt";
type ActionType = "receive" | "return" | "damage" | "adjustment" | "correction" | "settings";

const statusClass: Record<StockStatus, string> = {
  in: "border-emerald-200 bg-emerald-50 text-emerald-700",
  low: "border-amber-200 bg-amber-50 text-amber-700",
  out: "border-rose-200 bg-rose-50 text-rose-700",
};
const statusLabel: Record<StockStatus, string> = { in: "In stock", low: "Low stock", out: "Out of stock" };

function stockStatus(item: InventoryItem): StockStatus {
  if (item.available <= 0) return "out";
  return item.available <= item.reorderPoint ? "low" : "in";
}

function readable(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The inventory change could not be saved.";
}

export default function InventoryPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | StockStatus>("all");
  const [warehouse, setWarehouse] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("available");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [adjusting, setAdjusting] = useState<InventoryItem | null>(null);
  const [viewing, setViewing] = useState<InventoryItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const params = new URLSearchParams({ page: String(page), limit: "25", sortBy: sortKey, sortOrder });
  if (deferredQuery.trim()) params.set("search", deferredQuery.trim());
  if (category !== "all") params.set("category", category);
  if (status !== "all") params.set("stockStatus", status);
  if (warehouse !== "all") params.set("warehouse", warehouse);
  const inventory = useInventory(params.toString());
  const data = inventory.data;
  const rows = data?.items ?? [];
  const summary = data?.summary ?? { products: 0, onHand: 0, reserved: 0, available: 0, incoming: 0, lowStock: 0, outOfStock: 0, stockValue: 0 };
  const stats: { label: string; value: number; detail: string; icon: LucideIcon; color: string }[] = [
    { label: "On hand", value: summary.onHand, detail: `${summary.available} available`, icon: PackageCheck, color: "text-slate-950" },
    { label: "Reserved", value: summary.reserved, detail: "Committed to orders", icon: Truck, color: "text-blue-600" },
    { label: "Incoming", value: summary.incoming, detail: "Expected replenishment", icon: Boxes, color: "text-emerald-600" },
    { label: "Low stock", value: summary.lowStock, detail: "At or below reorder", icon: AlertTriangle, color: "text-amber-600" },
    { label: "Out of stock", value: summary.outOfStock, detail: "Needs attention", icon: PackageX, color: "text-rose-600" },
  ];

  async function exportExcel() {
    setIsExporting(true);
    try {
      const exportParams = new URLSearchParams();
      if (deferredQuery.trim()) exportParams.set("search", deferredQuery.trim());
      if (category !== "all") exportParams.set("category", category);
      if (status !== "all") exportParams.set("stockStatus", status);
      if (warehouse !== "all") exportParams.set("warehouse", warehouse);
      const exportData = await getInventoryExport(exportParams.toString());
      if (!exportData.inventory.length) return toast.error("Nothing to export", "The current inventory filters have no products.");
      const { exportInventoryWorkbook } = await import("@/lib/inventory-export");
      await exportInventoryWorkbook(exportData);
      toast.success("Excel report exported", `${exportData.inventory.length} products and ${exportData.sales.length} delivered sale lines were included.`);
    } catch (error) {
      toast.error("Excel export failed", errorMessage(error));
    } finally {
      setIsExporting(false);
    }
  }

  return <section className="space-y-6">
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white"><Boxes className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Catalogue / Operations</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Inventory Management</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">A live stock control centre for receiving, corrections, damaged goods, replenishment planning, reservations, and a complete audit trail.</p></div></div>
        <div className="flex flex-wrap gap-3"><button disabled={isExporting} onClick={exportExcel} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">{isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Export Excel report</button><Link to="/products/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"><Plus className="h-4 w-4" />Add product</Link></div>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map(({ label, value, detail, icon: Icon, color }) => <button key={label} type="button" onClick={() => { if (label === "Low stock") setStatus("low"); else if (label === "Out of stock") setStatus("out"); setPage(1); }} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-slate-200 hover:bg-white"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><Icon className={cn("h-4 w-4", color)} /></div><p className={cn("mt-2 text-2xl font-bold", color)}>{value.toLocaleString()}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></button>)}</div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-3 border-b border-slate-100 p-4 lg:grid-cols-[minmax(240px,1fr)_repeat(4,minmax(150px,190px))]">
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" placeholder="Search product, SKU, slug..." /></div>
        <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"><option value="all">All categories</option>{data?.filters.categories.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select>
        <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"><option value="all">All stock status</option><option value="in">In stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select>
        <select value={warehouse} onChange={(event) => { setWarehouse(event.target.value); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"><option value="all">All warehouses</option>{data?.filters.warehouses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={`${sortKey}:${sortOrder}`} onChange={(event) => { const [key, order] = event.target.value.split(":"); setSortKey(key as SortKey); setSortOrder(order as "asc" | "desc"); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"><option value="available:asc">Lowest available</option><option value="stock:desc">Highest stock</option><option value="incoming:desc">Most incoming</option><option value="reorderPoint:desc">Highest reorder point</option><option value="title:asc">Product name</option><option value="updatedAt:desc">Recently updated</option></select>
      </div>
      {inventory.isError && <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">Inventory could not load: {errorMessage(inventory.error)}</div>}
      <div className="overflow-x-auto"><table className="w-full min-w-[1180px] text-sm"><thead><tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"><th className="px-5 py-4">Product</th><th className="px-5 py-4">SKU</th><th className="px-5 py-4">Category</th><th className="px-5 py-4 text-right">On hand</th><th className="px-5 py-4 text-right">Reserved</th><th className="px-5 py-4 text-right">Available</th><th className="px-5 py-4 text-right">Reorder</th><th className="px-5 py-4 text-right">Incoming</th><th className="px-5 py-4">Warehouse</th><th className="px-5 py-4 text-center">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{rows.map((item) => { const itemStatus = stockStatus(item); return <tr key={item._id} className="group hover:bg-slate-50/80"><td className="px-5 py-4"><div className="flex items-center gap-3">{item.featuredImage?.url ? <img src={item.featuredImage.url} alt={item.featuredImage.alt ?? ""} className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100"><Boxes className="h-5 w-5 text-slate-400" /></div>}<div><p className="max-w-56 truncate font-semibold text-slate-950">{item.title}</p><p className="mt-0.5 font-mono text-xs text-slate-400">/{item.slug}</p></div></div></td><td className="px-5 py-4 font-mono text-xs text-slate-500">{item.sku}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{readable(item.category)}</span></td><td className="px-5 py-4 text-right font-semibold text-slate-700">{item.stock}</td><td className="px-5 py-4 text-right text-blue-600">{item.reserved}</td><td className="px-5 py-4 text-right font-bold text-slate-950">{item.available}</td><td className="px-5 py-4 text-right text-slate-500">{item.reorderPoint}</td><td className="px-5 py-4 text-right font-semibold text-emerald-600">{item.incoming}</td><td className="px-5 py-4 text-slate-600">{item.warehouse}</td><td className="px-5 py-4 text-center"><span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", statusClass[itemStatus])}>{itemStatus !== "in" && <AlertTriangle className="h-3.5 w-3.5" />}{statusLabel[itemStatus]}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => setViewing(item)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" aria-label="View movement history"><Clock3 className="h-4 w-4" /></button><button onClick={() => setAdjusting(item)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" aria-label="Adjust stock"><ArrowDownUp className="h-4 w-4" /></button><Link to={`/products/${item._id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" aria-label="Edit product"><Edit3 className="h-4 w-4" /></Link></div></td></tr>; })}</tbody>
      </table></div>
      {inventory.isLoading && <div className="flex items-center justify-center gap-2 py-16 text-sm font-semibold text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Loading live inventory...</div>}
      {!inventory.isLoading && !rows.length && !inventory.isError && <div className="py-16 text-center"><Boxes className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">No inventory rows found</p><p className="mt-1 text-xs text-slate-400">Try clearing one or more filters.</p></div>}
      {data && data.pagination.total > 0 && <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-500">Showing {(data.pagination.page - 1) * data.pagination.limit + 1}–{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} products</p><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button><span className="px-2 font-semibold text-slate-600">{page} / {data.pagination.pages}</span><button disabled={page >= data.pagination.pages} onClick={() => setPage((value) => value + 1)} className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 font-semibold disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button></div></div>}
    </div>
    {adjusting && <AdjustmentDialog item={adjusting} onClose={() => setAdjusting(null)} />}
    {viewing && <HistoryDrawer item={viewing} onClose={() => setViewing(null)} />}
  </section>;
}

function AdjustmentDialog({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const toast = useToast(); const mutation = useAdjustInventory();
  const [type, setType] = useState<ActionType>("receive"); const [quantity, setQuantity] = useState("");
  const [incoming, setIncoming] = useState(String(item.incoming)); const [reorderPoint, setReorderPoint] = useState(String(item.reorderPoint));
  const [warehouse, setWarehouse] = useState(item.warehouse); const [reason, setReason] = useState(""); const [reference, setReference] = useState(""); const [receiveFromIncoming, setReceiveFromIncoming] = useState(true);
  const isSettings = type === "settings"; const amount = Number(quantity) || 0;
  const projected = isSettings ? item.stock : item.stock + (type === "damage" ? -Math.abs(amount) : type === "adjustment" || type === "correction" ? amount : Math.abs(amount));
  async function save() {
    if (!isSettings && (!Number.isFinite(Number(quantity)) || Number(quantity) === 0)) return toast.error("Enter a quantity", "Use a non-zero whole number for the stock movement.");
    try { const quantityChange = type === "damage" ? -Math.abs(Number(quantity)) : type === "receive" || type === "return" ? Math.abs(Number(quantity)) : Math.trunc(Number(quantity)); await mutation.mutateAsync({ id: item._id, payload: { type, ...(isSettings ? {} : { quantityChange }), incoming: Number(incoming), reorderPoint: Number(reorderPoint), warehouse, receiveFromIncoming: type === "receive" && receiveFromIncoming, reason, reference } }); toast.success("Inventory updated", `${item.sku} now has ${projected} units on hand.`); onClose(); } catch (error) { toast.error("Inventory was not updated", errorMessage(error)); }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-100 p-6"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stock control · {item.sku}</p><h2 className="mt-1 text-xl font-bold text-slate-950">Adjust {item.title}</h2><p className="mt-2 text-sm text-slate-500">On hand {item.stock} · Reserved {item.reserved} · Available {item.available}</p></div><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
    <div className="grid gap-4 p-6 sm:grid-cols-2"><label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">Action</span><select value={type} onChange={(event) => setType(event.target.value as ActionType)} className="field"><option value="receive">Receive stock</option><option value="return">Customer return</option><option value="damage">Damage / write-off</option><option value="adjustment">Manual adjustment (+/-)</option><option value="correction">Stocktake correction (+/-)</option><option value="settings">Planning settings only</option></select></label><label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">Quantity {type === "adjustment" || type === "correction" ? "(+ or -)" : ""}</span><input disabled={isSettings} type="number" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="field disabled:bg-slate-100" placeholder="0" /><span className={cn("block text-xs", projected < item.reserved ? "text-rose-600" : "text-slate-400")}>Projected on hand: {projected} (cannot be below reserved)</span></label><label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">Incoming units</span><input type="number" min="0" step="1" value={incoming} onChange={(event) => setIncoming(event.target.value)} className="field" /></label><label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">Reorder point</span><input type="number" min="0" step="1" value={reorderPoint} onChange={(event) => setReorderPoint(event.target.value)} className="field" /></label><label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">Warehouse / location</span><input value={warehouse} onChange={(event) => setWarehouse(event.target.value)} className="field" placeholder="Main warehouse" /></label><label className="space-y-1.5"><span className="text-sm font-semibold text-slate-700">Reference (optional)</span><input value={reference} onChange={(event) => setReference(event.target.value)} className="field" placeholder="PO-1042, GRN-55, count sheet..." /></label>{type === "receive" && <label className="sm:col-span-2 flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800"><input type="checkbox" checked={receiveFromIncoming} onChange={(event) => setReceiveFromIncoming(event.target.checked)} className="accent-emerald-700" />Reduce incoming units by the received quantity</label>}<label className="space-y-1.5 sm:col-span-2"><span className="text-sm font-semibold text-slate-700">Reason <span className="text-rose-500">*</span></span><textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} maxLength={300} className="field h-auto py-3" placeholder="Explain why this inventory record is changing..." /></label></div>
    <div className="flex justify-end gap-3 border-t border-slate-100 p-5"><button onClick={onClose} className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">Cancel</button><button disabled={mutation.isPending || !reason.trim() || projected < item.reserved} onClick={save} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Save inventory change</button></div></div></div>;
}

function HistoryDrawer({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const movements = useInventoryMovements(item._id); const entries = useMemo(() => movements.data ?? [], [movements.data]);
  return <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-100 p-6"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Audit trail · {item.sku}</p><h2 className="mt-1 text-xl font-bold text-slate-950">Inventory movement history</h2><p className="mt-2 text-sm text-slate-500">{item.title}</p></div><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="grid grid-cols-3 gap-2 border-b border-slate-100 p-4"><MiniStat label="On hand" value={item.stock} /><MiniStat label="Reserved" value={item.reserved} /><MiniStat label="Available" value={item.available} /></div><div className="flex-1 space-y-3 overflow-y-auto p-5">{movements.isLoading && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>}{movements.isError && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage(movements.error)}</p>}{!movements.isLoading && !entries.length && <div className="py-12 text-center"><Clock3 className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">No recorded movements yet</p><p className="mt-1 text-xs text-slate-400">New adjustments will appear here with their operator and reason.</p></div>}{entries.map((movement) => <MovementCard key={movement._id} movement={movement} />)}</div></aside></div>;
}

function MiniStat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs font-semibold uppercase text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{value}</p></div>; }
function MovementCard({ movement }: { movement: InventoryMovement }) { const positive = movement.quantityChange > 0; return <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">{movement.type}</span><p className="mt-3 text-sm font-semibold text-slate-900">{movement.reason}</p></div><p className={cn("text-lg font-bold", positive ? "text-emerald-600" : movement.quantityChange < 0 ? "text-rose-600" : "text-slate-500")}>{positive ? "+" : ""}{movement.quantityChange}</p></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400"><span>Stock {movement.stockBefore} → {movement.stockAfter}</span>{movement.reservedBefore !== movement.reservedAfter && <span>Reserved {movement.reservedBefore} → {movement.reservedAfter}</span>}{movement.incomingBefore !== movement.incomingAfter && <span>Incoming {movement.incomingBefore} → {movement.incomingAfter}</span>}<span>{movement.warehouse}</span>{movement.reference && <span>Ref: {movement.reference}</span>}</div><div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400"><span className="font-medium text-slate-500">{movement.changedByEmail}</span> · {new Date(movement.createdAt).toLocaleString()}</div></div>; }
