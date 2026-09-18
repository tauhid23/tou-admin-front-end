import { AlertTriangle, Bell, CalendarDays, Loader2, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import StatCard from "./_components/StatCard";
import RevenueChart from "./_components/RevenueChart";
import RecentOrders from "./_components/RecentOrders";
import TopProducts from "./_components/TopProducts";
import { useDashboardOverview } from "@/lib/api/queries";
import type { Order, StatCardData, TopProduct } from "@/pages/dashboard/_components/types";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const inputDate = (date: Date) => date.toISOString().slice(0, 10);
const dateLabel = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
const relativeTime = (value: string) => { const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000)); return minutes < 1 ? "Just now" : minutes < 60 ? `${minutes}m ago` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 1440)}d ago`; };

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  const [customStart, setCustomStart] = useState(inputDate(new Date(Date.now() - 29 * 86_400_000)));
  const [customEnd, setCustomEnd] = useState(inputDate(new Date()));
  const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);
  const [rangeError, setRangeError] = useState("");
  const dashboard = useDashboardOverview(customRange ?? { days });
  const data = dashboard.data;
  const summary = data?.summary;
  const cards: StatCardData[] = summary ? [
    { title: "Net sales", value: money(summary.netRevenue), change: summary.changes.netRevenue, changeLabel: "vs prior period", icon: "DollarSign" },
    { title: "Est. gross profit", value: money(summary.grossProfit), change: summary.changes.grossProfit, changeLabel: "vs prior period", icon: "TrendingUp" },
    { title: "Orders", value: summary.orders.toLocaleString(), change: summary.changes.orders, changeLabel: "vs prior period", icon: "ShoppingCart" },
    { title: "Average order", value: money(summary.averageOrderValue), change: summary.changes.averageOrderValue, changeLabel: "vs prior period", icon: "Users" },
  ] : [];
  const orders: Order[] = (data?.recentOrders ?? []).map((order) => ({ id: order.orderNumber, customer: order.customer, product: order.product, amount: order.total, status: order.status, date: relativeTime(order.createdAt), itemCount: order.itemCount }));
  const topProducts: TopProduct[] = data?.topProducts ?? [];
  const selectedPeriod = customRange ? `${dateLabel(customRange.start)} to ${dateLabel(customRange.end)}` : `Last ${days} days`;
  const applyCustomRange = () => { if (!customStart || !customEnd || customStart > customEnd) { setRangeError("Choose a valid start and end date."); return; } setRangeError(""); setCustomRange({ start: customStart, end: customEnd }); };
  const selectQuickRange = (nextDays: number) => { setCustomRange(null); setRangeError(""); setDays(nextDays); };

  return <div className="min-h-screen bg-neutral-50">
    <header className="sticky top-0 z-10 border-b border-neutral-100 bg-neutral-50/90 backdrop-blur-sm"><div className="flex h-[66px] items-center justify-between px-6"><div><h1 className="text-[17px] font-bold leading-none text-neutral-900">Business dashboard</h1><p className="mt-1 text-[12px] text-neutral-400">Live sales, profitability, and operations health</p></div><div className="flex items-center gap-2"><div className="hidden w-52 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 sm:flex"><Search className="h-3.5 w-3.5 text-neutral-400" /><input type="text" placeholder="Search..." className="w-full bg-transparent text-[13px] outline-none" /></div><button type="button" onClick={() => dashboard.refetch()} aria-label="Refresh dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900"><RefreshCw className={`h-3.5 w-3.5 ${dashboard.isFetching ? "animate-spin" : ""}`} /></button><button type="button" aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500"><Bell className="h-3.5 w-3.5" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-neutral-900" /></button></div></div></header>
    <main className="mx-auto max-w-[1600px] space-y-6 p-6">
      {!data && dashboard.isLoading ? <div className="flex min-h-96 items-center justify-center text-sm text-neutral-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading live business data...</div> : dashboard.isError && !data ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Dashboard data could not be loaded. <button type="button" onClick={() => dashboard.refetch()} className="font-bold underline">Try again</button></div> : <>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{cards.map((card, index) => <StatCard key={card.title} data={card} index={index} />)}</div>
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2 text-sm font-bold text-neutral-900"><CalendarDays className="h-4 w-4" />Reporting period {dashboard.isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />}</div><p className="mt-1 text-xs text-neutral-400">{selectedPeriod}. Comparisons use the immediately preceding period of the same length.</p></div><div className="flex flex-col gap-2 sm:flex-row sm:items-end"><DateInput label="From" value={customStart} onChange={setCustomStart} /><DateInput label="To" value={customEnd} onChange={setCustomEnd} /><button type="button" onClick={applyCustomRange} className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-700">Apply dates</button></div>{rangeError && <p className="text-xs font-medium text-rose-600">{rangeError}</p>}</section>
        <RevenueChart data={data?.timeline ?? []} range={customRange ? null : days} onRangeChange={selectQuickRange} />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><Finance label="Gross sales" value={money(summary?.grossRevenue ?? 0)} detail="Before refunds" /><Finance label="Refunds issued" value={money(summary?.refunds ?? 0)} detail="In selected period" tone="rose" /><Finance label="Courier payout" value={money(summary?.courierPayout ?? 0)} detail="Paid or payable to couriers" tone="rose" /><Finance label="Cost of goods" value={money(summary?.costOfGoods ?? 0)} detail="Current product costs" /><Finance label="Gross margin" value={`${summary?.grossMargin ?? 0}%`} detail="After courier payout" tone="emerald" /></section>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3"><div className="xl:col-span-2"><RecentOrders orders={orders} /></div><div className="space-y-6"><TopProducts products={topProducts} /><section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-[15px] font-semibold text-neutral-900">Operations alerts</h2><p className="mt-0.5 text-[12px] text-neutral-400">Items needing attention</p></div><span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">{summary?.pendingFulfilment ?? 0} to fulfil</span></div><div className="mt-4 space-y-3">{data?.lowStockProducts.length ? data.lowStockProducts.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-xl bg-amber-50/70 p-3"><AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-neutral-800">{product.title}</p><p className="mt-0.5 text-[11px] text-neutral-500">{product.stock} in stock - reorder at {product.reorderPoint}</p></div></div>) : <p className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">No low-stock products right now.</p>}</div></section></div></div>
        <p className="text-xs text-neutral-400">Estimated gross profit = net sales less current product cost and courier payout. Payroll, advertising, taxes, and other operating expenses are not included.</p>
      </>}
    </main>
  </div>;
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-xs font-semibold text-neutral-600">{label}<input type="date" max={inputDate(new Date())} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block h-10 rounded-lg border border-neutral-200 px-3 text-sm font-normal text-neutral-800 outline-none focus:border-neutral-500" /></label>; }
function Finance({ label, value, detail, tone = "neutral" }: { label: string; value: string; detail: string; tone?: "neutral" | "rose" | "emerald" }) { const colors = tone === "rose" ? "border-rose-100 bg-rose-50/40" : tone === "emerald" ? "border-emerald-100 bg-emerald-50/40" : "border-neutral-100 bg-white"; return <div className={`rounded-2xl border p-4 shadow-sm ${colors}`}><p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">{label}</p><p className="mt-2 text-xl font-bold tracking-tight text-neutral-900">{value}</p><p className="mt-1 text-xs text-neutral-500">{detail}</p></div>; }
