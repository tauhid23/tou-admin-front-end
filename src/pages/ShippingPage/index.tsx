import { ArrowRight, Banknote, Clock3, MapPin, PackageCheck, Settings2, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useShippingSettings } from "@/lib/api/queries";

const money = (value: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

export default function ShippingPage() {
  const { data, isLoading, isError, refetch } = useShippingSettings();
  const activeZones = data?.zones.filter((zone) => zone.active).length ?? 0;
  const activeCarriers = data?.carriers.filter((carrier) => carrier.active).length ?? 0;

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><Truck className="h-4 w-4" />Operations</div><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Shipping management</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Control delivery coverage, carrier partners, customer charges, and fulfilment rules.</p></header>

    {isLoading ? <div className="h-32 animate-pulse rounded-2xl bg-slate-200" /> : isError ? <div className="rounded-2xl border border-rose-200 bg-white p-6"><p className="font-bold text-slate-950">Shipping configuration could not be loaded</p><button type="button" onClick={() => refetch()} className="mt-3 action-primary">Try again</button></div> : <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active zones" value={String(activeZones)} icon={MapPin} />
        <Stat label="Active carriers" value={String(activeCarriers)} icon={Truck} />
        <Stat label="Minimum order" value={money(data?.rules.minimumOrder ?? 0, data?.currency)} icon={PackageCheck} />
        <Stat label="Free shipping" value={data?.rules.freeShippingEnabled ? `From ${money(data.rules.freeShippingThreshold, data.currency)}` : "Disabled"} icon={Banknote} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <NavigationCard to="/shipping/zones" icon={MapPin} eyebrow={`${activeZones} active`} title="Shipping zones" description="Set customer-facing delivery regions, charges, and delivery estimates." />
        <NavigationCard to="/shipping/carriers" icon={Truck} eyebrow={`${activeCarriers} active`} title="Carrier directory" description="Maintain courier contacts, service areas, and tracking links." />
        <NavigationCard to="/shipping/rules" icon={Zap} eyebrow="Checkout rules" title="Delivery rules" description="Configure free shipping, minimum orders, cut-off time, and COD." />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"><Settings2 className="h-4 w-4" />Live checkout configuration</div><h2 className="mt-4 text-xl font-bold">Your storefront uses these settings automatically</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Zone prices and delivery rules are validated again by the server when an order is placed, protecting totals from browser-side changes.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{data?.zones.filter((zone) => zone.active).map((zone) => <div key={zone.code} className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{zone.name}</p><p className="font-bold">{money(zone.rate, data.currency)}</p></div><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5" />{zone.minDeliveryDays}–{zone.maxDeliveryDays} business days</p></div>)}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold text-slate-950">Operational status</h2><div className="mt-5 space-y-4 text-sm"><Status label="Cash on delivery" active={Boolean(data?.rules.cashOnDeliveryEnabled)} /><Status label="Free-shipping rule" active={Boolean(data?.rules.freeShippingEnabled)} /><div className="flex items-center justify-between"><span className="text-slate-500">Order cut-off</span><span className="font-semibold text-slate-900">{data?.rules.cutoffTime}</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Processing time</span><span className="font-semibold text-slate-900">{data?.rules.processingDays} day(s)</span></div></div>{data?.updatedAt && <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">Last saved {new Date(data.updatedAt).toLocaleString()}</p>}</div>
      </section>
    </>}
  </div>;
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Truck }) { return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><Icon className="h-5 w-5" /></span><span><span className="block text-xs text-slate-500">{label}</span><span className="mt-1 block text-lg font-bold text-slate-950">{value}</span></span></div>; }
function NavigationCard({ to, icon: Icon, eyebrow, title, description }: { to: string; icon: typeof Truck; eyebrow: string; title: string; description: string }) { return <Link to={to} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white"><Icon className="h-5 w-5" /></span><ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" /></div><p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">{eyebrow}</p><h2 className="mt-2 text-lg font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></Link>; }
function Status({ label, active }: { label: string; active: boolean }) { return <div className="flex items-center justify-between"><span className="text-slate-500">{label}</span><span className={active ? "status-active" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"}>{active ? "Active" : "Disabled"}</span></div>; }
