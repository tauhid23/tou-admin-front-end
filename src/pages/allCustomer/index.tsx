import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, Ban, CalendarPlus, CheckCircle2, ChevronLeft, ChevronRight, Download, ExternalLink, Loader2, Mail, MapPin, Phone, RefreshCw, Repeat2, Search, ShoppingBag, Tag, TrendingUp, UserCheck, Users, X } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/lib/providers/ToastProvider";
import { useAdminCustomer, useAdminCustomers, useUpdateAdminCustomer, type AdminCustomer, type CustomerSegment } from "@/lib/api/queries";

const segments: Array<{ value: CustomerSegment; label: string }> = [
  { value: "all", label: "All customers" }, { value: "repeat", label: "Repeat customers" },
  { value: "high-value", label: "High value" }, { value: "new", label: "New this month" },
  { value: "inactive", label: "Inactive 90+ days" }, { value: "blocked", label: "Blocked" },
];
const money = (value: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
const shortDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export default function AllCustomersPage({ initialSegment = "all" }: { initialSegment?: CustomerSegment }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [segment, setSegment] = useState<CustomerSegment>(initialSegment);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminCustomer | null>(null);
  const params = useMemo(() => {
    const query = new URLSearchParams({ page: String(page), limit: "20", segment });
    if (deferredSearch) query.set("search", deferredSearch);
    return query.toString();
  }, [deferredSearch, page, segment]);
  const customersQuery = useAdminCustomers(params);
  const customers = customersQuery.data?.items ?? [];
  const summary = customersQuery.data?.summary;
  const pagination = customersQuery.data?.pagination;

  function exportCsv() {
    if (!customers.length) return;
    const rows = [["Name", "Email", "Phone", "Orders", "Completed", "Cancelled", "Total spent", "Average order", "Currency", "First order", "Last order", "Status", "Tags"], ...customers.map((customer) => [customer.name, customer.email ?? "", customer.phone, customer.totalOrders, customer.completedOrders, customer.cancelledOrders, customer.totalSpent, customer.averageOrderValue, customer.currency, customer.firstOrderAt, customer.lastOrderAt, customer.status, customer.tags.join(" | ")])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
    toast.success("Customers exported", `${customers.length} visible customers were saved as CSV.`);
  }

  return <div className="mx-auto max-w-[1600px] space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><Users className="h-4 w-4" />Customer intelligence</div><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Customers</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Understand customer value, review purchase history, and keep service notes in one place.</p></div><div className="flex gap-2"><button type="button" onClick={() => customersQuery.refetch()} disabled={customersQuery.isFetching} className="action-secondary"><RefreshCw className={`h-4 w-4 ${customersQuery.isFetching ? "animate-spin" : ""}`} />Refresh</button><button type="button" onClick={exportCsv} disabled={!customers.length} className="action-primary"><Download className="h-4 w-4" />Export CSV</button></div></header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Metric label="Total customers" value={summary?.totalCustomers ?? 0} icon={Users} />
      <Metric label="Active (90 days)" value={summary?.activeCustomers ?? 0} icon={UserCheck} tone="emerald" />
      <Metric label="Repeat customers" value={summary?.repeatCustomers ?? 0} icon={Repeat2} tone="blue" onClick={() => { setSegment("repeat"); setPage(1); }} />
      <Metric label="New this month" value={summary?.newThisMonth ?? 0} icon={CalendarPlus} tone="amber" onClick={() => { setSegment("new"); setPage(1); }} />
      <Metric label="Customer revenue" value={money(summary?.customerRevenue ?? 0)} icon={TrendingUp} tone="emerald" />
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4"><div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px]"><label className="relative"><span className="sr-only">Search customers</span><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="field pl-10" placeholder="Search name, email or phone" /></label><label><span className="sr-only">Customer segment</span><select value={segment} onChange={(event) => { setSegment(event.target.value as CustomerSegment); setPage(1); }} className="field">{segments.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label></div></div>
      {customersQuery.isLoading ? <Empty icon={<Loader2 className="h-6 w-6 animate-spin" />} title="Loading customers…" /> : customersQuery.isError ? <Empty icon={<AlertCircle className="h-9 w-9 text-rose-500" />} title="Customers could not be loaded" detail={customersQuery.error instanceof Error ? customersQuery.error.message : "Check the server connection and try again."} action={() => customersQuery.refetch()} /> : !customers.length ? <Empty icon={<Users className="h-10 w-10 text-slate-300" />} title="No customers found" detail="Try another search or customer segment." /> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3 text-center">Orders</th><th className="px-5 py-3">Total spent</th><th className="px-5 py-3">Last order</th><th className="px-5 py-3">Profile</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{customers.map((customer) => <tr key={customer.key} className="transition hover:bg-slate-50/70">
        <td className="px-5 py-4"><button type="button" onClick={() => setSelected(customer)} className="flex items-center gap-3 text-left"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">{initials(customer.name)}</span><span><span className="block max-w-[190px] truncate text-sm font-semibold text-slate-900">{customer.name}</span><span className="mt-1 block text-xs text-slate-400">Customer since {shortDate(customer.firstOrderAt)}</span></span></button></td>
        <td className="px-5 py-4"><p className="text-sm text-slate-700">{customer.phone}</p><p className="mt-1 max-w-[200px] truncate text-xs text-slate-400">{customer.email || "No email provided"}</p></td>
        <td className="px-5 py-4 text-center"><p className="text-sm font-bold text-slate-900">{customer.totalOrders}</p><p className="mt-1 text-xs text-slate-400">{customer.completedOrders} delivered</p></td>
        <td className="px-5 py-4"><p className="text-sm font-bold text-slate-950">{money(customer.totalSpent, customer.currency)}</p><p className="mt-1 text-xs text-slate-400">Avg. {money(customer.averageOrderValue, customer.currency)}</p></td>
        <td className="px-5 py-4 text-sm text-slate-600">{shortDate(customer.lastOrderAt)}</td>
        <td className="px-5 py-4">{customer.status === "blocked" ? <span className="status-blocked"><Ban className="h-3.5 w-3.5" />Blocked</span> : <span className="status-active"><CheckCircle2 className="h-3.5 w-3.5" />Active</span>}<div className="mt-1.5 flex max-w-[180px] gap-1 overflow-hidden">{customer.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{tag}</span>)}</div></td>
        <td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelected(customer)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">View profile<ChevronRight className="h-3.5 w-3.5" /></button></td>
      </tr>)}</tbody></table></div>}
      {pagination && pagination.total > 0 && <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-500">Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</p><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1} className="page-button"><ChevronLeft className="h-4 w-4" />Previous</button><span className="px-2 font-semibold text-slate-700">{pagination.page} / {pagination.pages}</span><button type="button" onClick={() => setPage((value) => Math.min(pagination.pages, value + 1))} disabled={page >= pagination.pages} className="page-button">Next<ChevronRight className="h-4 w-4" /></button></div></footer>}
    </section>
    {selected && <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />}
  </div>;
}

function CustomerDrawer({ customer, onClose }: { customer: AdminCustomer; onClose: () => void }) {
  const toast = useToast();
  const detailsQuery = useAdminCustomer(customer.key);
  const updateCustomer = useUpdateAdminCustomer();
  const details = detailsQuery.data;
  const [status, setStatus] = useState(customer.status);
  const [tags, setTags] = useState(customer.tags.join(", "));
  const [internalNote, setInternalNote] = useState(customer.internalNote);
  const [confirming, setConfirming] = useState(false);
  const parsedTags = [...new Set(tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 10);
  const changed = status !== customer.status || internalNote !== customer.internalNote || parsedTags.join("|") !== customer.tags.join("|");
  async function save() {
    try { await updateCustomer.mutateAsync({ key: customer.key, payload: { status, tags: parsedTags, internalNote } }); setConfirming(false); toast.success("Customer updated", `${customer.name}'s profile has been saved.`); onClose(); }
    catch (error) { setConfirming(false); toast.error("Update failed", error instanceof Error ? error.message : "The customer could not be updated."); }
  }
  return <><div className="fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-[2px]" onMouseDown={onClose} /><aside role="dialog" aria-modal="true" aria-label={`Customer ${customer.name}`} className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-3xl flex-col bg-slate-50 shadow-2xl">
    <header className="flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">{initials(customer.name)}</span><div><div className="flex items-center gap-2"><h2 className="text-lg font-bold text-slate-950">{customer.name}</h2>{customer.status === "blocked" && <span className="status-blocked"><Ban className="h-3 w-3" />Blocked</span>}</div><p className="mt-1 text-xs text-slate-500">Customer since {shortDate(customer.firstOrderAt)}</p></div></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100" aria-label="Close customer"><X className="h-5 w-5" /></button></header>
    <div className="flex-1 overflow-y-auto p-4 sm:p-6"><div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)]"><div className="space-y-5">
      <Panel title="Customer overview" icon={TrendingUp}><div className="grid grid-cols-2 gap-3"><SmallMetric label="Lifetime value" value={money(customer.totalSpent, customer.currency)} /><SmallMetric label="Average order" value={money(customer.averageOrderValue, customer.currency)} /><SmallMetric label="Total orders" value={String(customer.totalOrders)} /><SmallMetric label="Delivered" value={String(customer.completedOrders)} /></div></Panel>
      <Panel title="Contact & delivery" icon={MapPin}><div className="space-y-3 text-sm text-slate-600"><a href={`tel:${customer.phone}`} className="flex items-center gap-2 hover:text-slate-950"><Phone className="h-4 w-4" />{customer.phone}<ExternalLink className="h-3 w-3" /></a>{customer.email && <a href={`mailto:${customer.email}`} className="flex items-center gap-2 hover:text-slate-950"><Mail className="h-4 w-4" />{customer.email}<ExternalLink className="h-3 w-3" /></a>}{customer.latestAddress && <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{Object.values(customer.latestAddress).filter(Boolean).join(", ")}</span></p>}</div></Panel>
      <Panel title="Order history" icon={ShoppingBag}>{detailsQuery.isLoading ? <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading history…</p> : detailsQuery.isError ? <p className="text-sm text-rose-600">Order history could not be loaded.</p> : <div className="divide-y divide-slate-100">{details?.orders.map((order) => <div key={order._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><p className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</p><p className="mt-1 text-xs capitalize text-slate-400">{shortDate(order.createdAt)} · {order.status}</p></div><p className="text-sm font-bold text-slate-900">{money(order.total, order.currency)}</p></div>)}</div>}</Panel>
    </div><div className="space-y-5">
      <Panel title="Customer controls" icon={UserCheck}><label className="mb-4 block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Ordering status</span><select value={status} onChange={(event) => setStatus(event.target.value as "active" | "blocked")} className="field"><option value="active">Active</option><option value="blocked">Blocked</option></select></label>{status === "blocked" && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">Blocked customers cannot place new orders using this email or phone identity.</p>}<label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><Tag className="h-3.5 w-3.5" />Tags</span><input value={tags} onChange={(event) => setTags(event.target.value)} className="field" placeholder="vip, wholesale, follow-up" /><span className="mt-1.5 block text-xs text-slate-400">Separate tags with commas. Maximum 10.</span></label></Panel>
      <Panel title="Internal service note" icon={UserCheck}><textarea value={internalNote} onChange={(event) => setInternalNote(event.target.value)} rows={7} maxLength={2000} className="field h-auto py-2.5" placeholder="Preferences, service context, or follow-up information" /><p className="mt-2 text-right text-xs text-slate-400">{internalNote.length}/2000</p></Panel>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-700">Customer totals are calculated from real order history. Cancelled orders are excluded from lifetime value.</div>
    </div></div></div>
    <footer className="flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:px-6"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button><button type="button" onClick={() => status === "blocked" && customer.status !== "blocked" ? setConfirming(true) : save()} disabled={!changed || updateCustomer.isPending} className="action-primary">{updateCustomer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Save profile</button></footer>
  </aside><ConfirmDialog open={confirming} title="Block this customer?" description="Future orders using this customer's current email or phone identity will be rejected. Existing orders are not affected." confirmLabel="Block customer" tone="danger" loading={updateCustomer.isPending} onCancel={() => setConfirming(false)} onConfirm={save} /></>;
}

function Metric({ label, value, icon: Icon, tone = "slate", onClick }: { label: string; value: string | number; icon: typeof Users; tone?: "slate" | "blue" | "amber" | "emerald"; onClick?: () => void }) { const tones = { slate: "bg-slate-100 text-slate-600", blue: "bg-blue-50 text-blue-700", amber: "bg-amber-50 text-amber-700", emerald: "bg-emerald-50 text-emerald-700" }; const content = <><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span><span><span className="block text-xs font-medium text-slate-500">{label}</span><span className="mt-1 block text-xl font-bold tracking-tight text-slate-950">{value}</span></span></>; const classes = "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"; return onClick ? <button type="button" onClick={onClick} className={`${classes} transition hover:-translate-y-0.5 hover:shadow-md`}>{content}</button> : <div className={classes}>{content}</div>; }
function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Users; children: ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950"><Icon className="h-4 w-4 text-slate-500" />{title}</h3>{children}</section>; }
function SmallMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-base font-bold text-slate-950">{value}</p></div>; }
function Empty({ icon, title, detail, action }: { icon: ReactNode; title: string; detail?: string; action?: () => void }) { return <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">{icon}<h2 className="mt-3 font-bold text-slate-950">{title}</h2>{detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}{action && <button type="button" onClick={action} className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Try again</button>}</div>; }
