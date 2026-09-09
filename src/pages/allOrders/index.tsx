import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, Banknote, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleDollarSign, ClipboardCheck, Clock3, Download, ExternalLink, Loader2, Mail, MapPin, Package, Phone, RefreshCw, Search, ShoppingBag, Truck, X, XCircle } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/lib/providers/ToastProvider";
import { useAdminOrders, useShippingSettings, useUpdateAdminOrder, type AdminOrder, type OrderStatus, type PaymentStatus } from "@/lib/api/queries";

const orderStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];
const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = { pending: "processing", processing: "shipped", shipped: "delivered" };
const statusMeta: Record<OrderStatus, { label: string; style: string; icon: typeof Clock3 }> = {
  pending: { label: "Awaiting review", style: "bg-amber-50 text-amber-700 ring-amber-600/15", icon: Clock3 },
  processing: { label: "Processing", style: "bg-violet-50 text-violet-700 ring-violet-600/15", icon: ClipboardCheck },
  shipped: { label: "Shipped", style: "bg-blue-50 text-blue-700 ring-blue-600/15", icon: Truck },
  delivered: { label: "Delivered", style: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", style: "bg-rose-50 text-rose-700 ring-rose-600/15", icon: XCircle },
};
const paymentMeta: Record<PaymentStatus, { label: string; style: string }> = {
  pending: { label: "Payment due", style: "text-amber-700" }, paid: { label: "Paid", style: "text-emerald-700" },
  failed: { label: "Failed", style: "text-rose-700" }, refunded: { label: "Refunded", style: "text-slate-600" },
};

const money = (value: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
const shortDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
const dateTime = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.style}`}><Icon className="h-3.5 w-3.5" />{meta.label}</span>;
}

export default function AllOrdersPage({ initialStatus = "all" }: { initialStatus?: "all" | OrderStatus }) {
  const toast = useToast();
  const shippingSettings = useShippingSettings();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<"all" | OrderStatus>(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState<"all" | PaymentStatus>("all");
  const [shippingZone, setShippingZone] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const params = useMemo(() => {
    const query = new URLSearchParams({ page: String(page), limit: "20" });
    if (deferredSearch) query.set("search", deferredSearch);
    if (status !== "all") query.set("status", status);
    if (paymentStatus !== "all") query.set("paymentStatus", paymentStatus);
    if (shippingZone !== "all") query.set("shippingZone", shippingZone);
    return query.toString();
  }, [deferredSearch, page, paymentStatus, shippingZone, status]);
  const ordersQuery = useAdminOrders(params);
  const orders = ordersQuery.data?.items ?? [];
  const summary = ordersQuery.data?.summary;
  const pagination = ordersQuery.data?.pagination;
  const hasFilters = Boolean(search || status !== "all" || paymentStatus !== "all" || shippingZone !== "all");

  function resetFilters() { setSearch(""); setStatus("all"); setPaymentStatus("all"); setShippingZone("all"); setPage(1); }
  function exportCsv() {
    if (!orders.length) return;
    const rows = [["Order", "Placed", "Customer", "Phone", "Email", "Items", "Total", "Currency", "Status", "Payment", "Courier", "Tracking"], ...orders.map((order) => [order.orderNumber, order.createdAt, order.customer.name, order.customer.phone, order.customer.email ?? "", String(order.items.reduce((sum, item) => sum + item.quantity, 0)), String(order.total), order.currency, order.status, order.paymentStatus, order.fulfilment?.courierName ?? "", order.fulfilment?.trackingNumber ?? ""])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
    toast.success("Orders exported", `${orders.length} visible orders were saved as CSV.`);
  }

  return <div className="mx-auto max-w-[1600px] space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><ShoppingBag className="h-4 w-4" />Operations</div><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Order management</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Review new orders, coordinate fulfilment, and keep payment and delivery records accurate.</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => ordersQuery.refetch()} disabled={ordersQuery.isFetching} className="action-secondary"><RefreshCw className={`h-4 w-4 ${ordersQuery.isFetching ? "animate-spin" : ""}`} />Refresh</button><button type="button" onClick={exportCsv} disabled={!orders.length} className="action-primary"><Download className="h-4 w-4" />Export CSV</button></div>
    </header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Metric label="All orders" value={summary?.totalOrders ?? 0} icon={Package} />
      <Metric label="Revenue" value={money(summary?.revenue ?? 0)} icon={CircleDollarSign} tone="emerald" />
      <Metric label="Awaiting review" value={summary?.pending ?? 0} icon={Clock3} tone="amber" onClick={() => { setStatus("pending"); setPage(1); }} />
      <Metric label="In fulfilment" value={(summary?.processing ?? 0) + (summary?.shipped ?? 0)} icon={Truck} tone="blue" />
      <Metric label="Delivered" value={summary?.delivered ?? 0} icon={CheckCircle2} tone="emerald" onClick={() => { setStatus("delivered"); setPage(1); }} />
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4"><div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_repeat(3,180px)]">
        <label className="relative block"><span className="sr-only">Search orders</span><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search order, customer, phone or tracking" className="field pl-10" /></label>
        <FilterSelect label="Order status" value={status} onChange={(value) => { setStatus(value as typeof status); setPage(1); }} options={["all", ...orderStatuses]} />
        <FilterSelect label="Payment" value={paymentStatus} onChange={(value) => { setPaymentStatus(value as typeof paymentStatus); setPage(1); }} options={["all", ...paymentStatuses]} />
        <FilterSelect label="Delivery zone" value={shippingZone} onChange={(value) => { setShippingZone(value); setPage(1); }} options={["all", ...(shippingSettings.data?.zones.map((zone) => zone.code) ?? ["dhaka", "outside"])]} />
      </div>{hasFilters && <button type="button" onClick={resetFilters} className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-950">Clear all filters</button>}</div>

      {ordersQuery.isLoading ? <Empty icon={<Loader2 className="h-6 w-6 animate-spin" />} title="Loading orders…" /> : ordersQuery.isError ? <Empty icon={<AlertCircle className="h-9 w-9 text-rose-500" />} title="Orders could not be loaded" detail={ordersQuery.error instanceof Error ? ordersQuery.error.message : "Check the server connection and try again."} action={() => ordersQuery.refetch()} /> : !orders.length ? <Empty icon={<Package className="h-10 w-10 text-slate-300" />} title="No orders found" detail={hasFilters ? "Try changing or clearing your filters." : "New customer orders will appear here."} /> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left"><thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Placed</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">
        {orders.map((order) => <tr key={order._id} className="transition hover:bg-slate-50/70">
          <td className="px-5 py-4"><button type="button" onClick={() => setSelected(order)} className="font-mono text-sm font-bold text-slate-950 hover:underline">{order.orderNumber}</button><p className="mt-1 text-xs capitalize text-slate-400">{order.shippingZone.replaceAll("-", " ")}</p></td>
          <td className="px-5 py-4"><p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">{order.customer.name}</p><p className="mt-1 text-xs text-slate-500">{order.customer.phone}</p></td>
          <td className="px-5 py-4"><p className="text-sm font-semibold text-slate-700">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p><p className="mt-1 max-w-[200px] truncate text-xs text-slate-400">{order.items.map((item) => item.title).join(", ")}</p></td>
          <td className="px-5 py-4 text-sm font-bold text-slate-950">{money(order.total, order.currency)}</td><td className="px-5 py-4"><StatusBadge status={order.status} /></td>
          <td className="px-5 py-4"><span className={`text-sm font-semibold ${paymentMeta[order.paymentStatus].style}`}>{paymentMeta[order.paymentStatus].label}</span><p className="mt-1 text-xs uppercase text-slate-400">{order.paymentMethod}</p></td>
          <td className="px-5 py-4 text-sm text-slate-600">{shortDate(order.createdAt)}<p className="mt-1 text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></td>
          <td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelected(order)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">Review<ChevronRight className="h-3.5 w-3.5" /></button></td>
        </tr>)}
      </tbody></table></div>}
      {pagination && pagination.total > 0 && <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-500">Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</p><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} className="page-button"><ChevronLeft className="h-4 w-4" />Previous</button><span className="px-2 font-semibold text-slate-700">{pagination.page} / {pagination.pages}</span><button type="button" onClick={() => setPage((value) => Math.min(pagination.pages, value + 1))} disabled={page >= pagination.pages} className="page-button">Next<ChevronRight className="h-4 w-4" /></button></div></footer>}
    </section>
    {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} onUpdated={setSelected} />}
  </div>;
}

function Metric({ label, value, icon: Icon, tone = "slate", onClick }: { label: string; value: string | number; icon: typeof Package; tone?: "slate" | "amber" | "blue" | "emerald"; onClick?: () => void }) {
  const tones = { slate: "bg-slate-100 text-slate-600", amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", emerald: "bg-emerald-50 text-emerald-700" };
  const content = <><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold tracking-tight text-slate-950">{value}</p></div></>;
  const classes = "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm";
  return onClick ? <button type="button" onClick={onClick} className={`${classes} transition hover:-translate-y-0.5 hover:shadow-md`}>{content}</button> : <div className={classes}>{content}</div>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="field capitalize">{options.map((option) => <option key={option} value={option}>{option === "all" ? `All ${label.toLowerCase()}` : option === "pending" && label === "Payment" ? "Payment due" : option}</option>)}</select></label>;
}

function Empty({ icon, title, detail, action }: { icon: ReactNode; title: string; detail?: string; action?: () => void }) {
  return <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">{icon}<h2 className="mt-3 font-bold text-slate-950">{title}</h2>{detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}{action && <button type="button" onClick={action} className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Try again</button>}</div>;
}

function OrderDrawer({ order, onClose, onUpdated }: { order: AdminOrder; onClose: () => void; onUpdated: (order: AdminOrder) => void }) {
  const toast = useToast();
  const shippingSettings = useShippingSettings();
  const updateOrder = useUpdateAdminOrder();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [courierName, setCourierName] = useState(order.fulfilment?.courierName ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.fulfilment?.trackingNumber ?? "");
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState(order.fulfilment?.estimatedDeliveryAt?.slice(0, 10) ?? "");
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
  const [statusNote, setStatusNote] = useState("");
  const [cancellationReason, setCancellationReason] = useState(order.cancellationReason ?? "");
  const [confirming, setConfirming] = useState(false);
  const availableStatuses = [order.status, ...(nextStatus[order.status] ? [nextStatus[order.status]!] : []), ...(order.status !== "delivered" && order.status !== "cancelled" ? ["cancelled" as const] : [])].filter((value, index, values) => values.indexOf(value) === index);
  const changed = status !== order.status || paymentStatus !== order.paymentStatus || courierName !== (order.fulfilment?.courierName ?? "") || trackingNumber !== (order.fulfilment?.trackingNumber ?? "") || estimatedDeliveryAt !== (order.fulfilment?.estimatedDeliveryAt?.slice(0, 10) ?? "") || adminNote !== (order.adminNote ?? "") || cancellationReason !== (order.cancellationReason ?? "");

  function requestSave() {
    if (status === "shipped" && !courierName.trim()) return toast.error("Courier is required", "Add the delivery service before marking this order as shipped.");
    if (status === "cancelled" && !cancellationReason.trim()) return toast.error("Cancellation reason is required", "Record why this order was cancelled.");
    setConfirming(true);
  }
  async function save() {
    try {
      const updated = await updateOrder.mutateAsync({ id: order._id, payload: { status, paymentStatus, adminNote, cancellationReason, statusNote, fulfilment: { courierName, trackingNumber, estimatedDeliveryAt: estimatedDeliveryAt || undefined } } });
      onUpdated(updated); setStatusNote(""); setConfirming(false); toast.success("Order updated", `${order.orderNumber} is now ${statusMeta[updated.status].label.toLowerCase()}.`);
    } catch (error) { setConfirming(false); toast.error("Update failed", error instanceof Error ? error.message : "The order could not be updated."); }
  }

  return <><div className="fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-[2px]" onMouseDown={onClose} /><aside role="dialog" aria-modal="true" aria-label={`Order ${order.orderNumber}`} className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-3xl flex-col bg-slate-50 shadow-2xl">
    <header className="flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-mono text-lg font-bold text-slate-950">{order.orderNumber}</h2><StatusBadge status={order.status} /></div><p className="mt-1 text-xs text-slate-500">Placed {dateTime(order.createdAt)}</p></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100" aria-label="Close order"><X className="h-5 w-5" /></button></header>
    <div className="flex-1 overflow-y-auto p-4 sm:p-6"><div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)]"><div className="space-y-5">
      <Panel title="Order items" icon={Package}><div className="divide-y divide-slate-100">{order.items.map((item, index) => <div key={item._id ?? `${item.productId}-${index}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">{item.image ? <img src={item.image} alt="" className="h-16 w-14 rounded-lg bg-slate-100 object-cover" /> : <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-slate-100"><Package className="h-5 w-5 text-slate-300" /></div>}<div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{item.title}</p>{item.promotionName && <p className="mt-1 text-xs font-semibold text-emerald-700">{item.promotionName}</p>}<p className="mt-1 text-xs text-slate-500">{[item.sku && `SKU ${item.sku}`, item.selectedColor, item.selectedSize].filter(Boolean).join(" · ") || "Standard option"}</p><p className="mt-2 text-xs text-slate-500">{item.quantity} × {money(item.unitPrice, order.currency)}{item.originalUnitPrice && item.originalUnitPrice > item.unitPrice ? ` (was ${money(item.originalUnitPrice, order.currency)})` : ""}</p></div><p className="text-sm font-bold text-slate-900">{money(item.quantity * item.unitPrice, order.currency)}</p></div>)}</div><div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm"><Price label="Subtotal" value={order.subtotal} currency={order.currency} /><Price label="Shipping" value={order.shipping} currency={order.currency} />{order.couponCode && order.discount - (order.automaticDiscount ?? 0) > 0 && <Price label={`Coupon (${order.couponCode})`} value={-(order.discount - (order.automaticDiscount ?? 0))} currency={order.currency} />}{(order.automaticDiscount ?? 0) > 0 && <Price label={order.automaticPromotionName ?? "Automatic discount"} value={-(order.automaticDiscount ?? 0)} currency={order.currency} />}{order.discount > 0 && !order.couponCode && !(order.automaticDiscount ?? 0) && <Price label="Discount" value={-order.discount} currency={order.currency} />}<div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold"><span>Total</span><span>{money(order.total, order.currency)}</span></div></div></Panel>
      <Panel title="Customer & delivery" icon={MapPin}><p className="font-semibold text-slate-900">{order.customer.name}</p><div className="mt-3 space-y-2 text-sm text-slate-600"><a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 hover:text-slate-950"><Phone className="h-4 w-4" />{order.customer.phone}<ExternalLink className="h-3 w-3" /></a>{order.customer.email && <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 hover:text-slate-950"><Mail className="h-4 w-4" />{order.customer.email}<ExternalLink className="h-3 w-3" /></a>}<p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{[order.address.line1, order.address.line2, order.address.city, order.address.state, order.address.postalCode, order.address.country].filter(Boolean).join(", ")}</span></p></div></Panel>
      <Panel title="Activity" icon={Clock3}><ol className="space-y-4">{[...(order.statusHistory ?? [])].reverse().map((entry, index) => <li key={entry._id ?? index} className="flex gap-3"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-900 ring-4 ring-slate-100" /><div><p className="text-sm font-semibold text-slate-800">{statusMeta[entry.status].label} · {paymentMeta[entry.paymentStatus].label}</p><p className="mt-0.5 text-xs text-slate-400">{dateTime(entry.changedAt)}{entry.changedByEmail ? ` by ${entry.changedByEmail}` : ""}</p>{entry.note && <p className="mt-1 text-sm text-slate-600">{entry.note}</p>}</div></li>)}{!order.statusHistory?.length && <li className="text-sm text-slate-500">No activity has been recorded yet.</li>}</ol></Panel>
    </div><div className="space-y-5">
      <Panel title="Update workflow" icon={ClipboardCheck}><FieldLabel label="Order status"><select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} disabled={order.status === "delivered" || order.status === "cancelled"} className="field capitalize">{availableStatuses.map((value) => <option key={value} value={value}>{statusMeta[value].label}</option>)}</select></FieldLabel><FieldLabel label="Payment status"><select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)} className="field">{paymentStatuses.map((value) => <option key={value} value={value}>{paymentMeta[value].label}</option>)}</select></FieldLabel>{status === "cancelled" && <FieldLabel label="Cancellation reason" required><textarea value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} rows={3} className="field h-auto py-2.5" placeholder="Why was this order cancelled?" /></FieldLabel>}<FieldLabel label="Status update note"><input value={statusNote} onChange={(event) => setStatusNote(event.target.value)} className="field" placeholder="Optional activity note" /></FieldLabel></Panel>
      <Panel title="Fulfilment" icon={Truck}><FieldLabel label="Courier / delivery service"><input list="active-carriers" value={courierName} onChange={(event) => setCourierName(event.target.value)} className="field" placeholder="Select or enter a carrier" /><datalist id="active-carriers">{shippingSettings.data?.carriers.filter((carrier) => carrier.active).map((carrier) => <option key={carrier.code} value={carrier.name} />)}</datalist></FieldLabel><FieldLabel label="Tracking number"><input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} className="field" placeholder="Shipment reference" /></FieldLabel><FieldLabel label="Estimated delivery"><input type="date" value={estimatedDeliveryAt} onChange={(event) => setEstimatedDeliveryAt(event.target.value)} className="field" /></FieldLabel></Panel>
      <Panel title="Internal note" icon={ClipboardCheck}><textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={5} maxLength={2000} className="field h-auto py-2.5" placeholder="Visible only to administrators" /><p className="mt-2 text-right text-xs text-slate-400">{adminNote.length}/2000</p></Panel>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><p className="flex items-center gap-2 font-semibold text-slate-900"><Banknote className="h-4 w-4" />Cash on delivery</p><p className="mt-2 leading-5">Keep payment as due until cash is collected. Mark it paid when delivery is confirmed.</p></div>
    </div></div></div>
    <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6"><p className="hidden text-xs text-slate-400 sm:block">Last updated {dateTime(order.updatedAt)}</p><div className="ml-auto flex gap-2"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button><button type="button" onClick={requestSave} disabled={!changed || updateOrder.isPending} className="action-primary"><Check className="h-4 w-4" />Save changes</button></div></footer>
  </aside><ConfirmDialog open={confirming} title={status === "cancelled" ? "Cancel this order?" : status === "delivered" ? "Confirm delivery?" : "Save order changes?"} description={status === "cancelled" ? "Reserved inventory will be released. This cannot be reversed from the workflow." : status === "delivered" ? "Items will be deducted from stock and reserved quantities cleared." : `This will update ${order.orderNumber} and record its status change.`} confirmLabel={status === "cancelled" ? "Cancel order" : "Confirm update"} tone={status === "cancelled" ? "danger" : "default"} loading={updateOrder.isPending} onCancel={() => setConfirming(false)} onConfirm={save} /></>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Package; children: ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950"><Icon className="h-4 w-4 text-slate-500" />{title}</h3>{children}</section>; }
function FieldLabel({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) { return <label className="mb-4 block last:mb-0"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}{required && <span className="text-rose-600"> *</span>}</span>{children}</label>; }
function Price({ label, value, currency }: { label: string; value: number; currency: string }) { return <div className="flex justify-between text-slate-500"><span>{label}</span><span className="font-medium text-slate-700">{money(value, currency)}</span></div>; }
