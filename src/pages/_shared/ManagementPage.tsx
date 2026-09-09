import type { ComponentType, ReactNode } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type Stat = {
  label: string;
  value: string;
  change?: string;
};

type Row = {
  title: string;
  description: string;
  status: "Active" | "Draft" | "Paused" | "Connected" | "Needs review";
  metric: string;
};

type ManagementPageProps = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  actionLabel?: string;
  stats?: Stat[];
  rows?: Row[];
  children?: ReactNode;
};

const defaultStats: Stat[] = [
  { label: "Active items", value: "18", change: "+4 this week" },
  { label: "Pending review", value: "3", change: "Needs attention" },
  { label: "Automation health", value: "96%", change: "Stable" },
];

const defaultRows: Row[] = [
  {
    title: "Primary configuration",
    description: "Core settings are ready for review and publishing.",
    status: "Active",
    metric: "Updated today",
  },
  {
    title: "Seasonal workspace",
    description: "Draft content prepared for the next campaign window.",
    status: "Draft",
    metric: "5 tasks",
  },
  {
    title: "Quality check",
    description: "Review visibility, sorting, and storefront behavior.",
    status: "Needs review",
    metric: "2 issues",
  },
];

const statusClass: Record<Row["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Paused: "bg-amber-50 text-amber-700 border-amber-200",
  Connected: "bg-blue-50 text-blue-700 border-blue-200",
  "Needs review": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ManagementPage({
  title,
  description,
  icon: Icon,
  actionLabel = "Create new",
  stats = defaultStats,
  rows = defaultRows,
  children,
}: ManagementPageProps) {
  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="relative p-6 md:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 via-[#b07154] to-emerald-500" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                  {title}
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            </div>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </button>
          </div>
        </div>

        <div className="grid border-t border-slate-100 bg-slate-50/70 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="border-slate-100 p-5 md:border-r last:border-r-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <strong className="text-2xl font-bold text-slate-950">{stat.value}</strong>
                {stat.change && (
                  <span className="text-xs font-medium text-slate-500">{stat.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder={`Search ${title.toLowerCase()}...`}
              />
            </div>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((row) => (
              <div key={row.title} className="grid gap-4 p-4 transition hover:bg-slate-50/80 md:grid-cols-[minmax(0,1fr)_150px_120px_40px] md:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{row.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{row.description}</p>
                </div>
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[row.status]}`}>
                  {row.status === "Active" || row.status === "Connected" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5" />
                  )}
                  {row.status}
                </span>
                <span className="text-sm font-medium text-slate-500 md:text-right">{row.metric}</span>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-950">Next actions</h2>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-5 space-y-4">
            {children ?? (
              <>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Review setup</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Confirm the draft items, then publish the active configuration.
                  </p>
                </div>
                <div className="rounded-xl bg-[#fff8f4] p-4">
                  <p className="text-sm font-semibold text-[#5a3d2c]">Storefront sync</p>
                  <p className="mt-1 text-sm leading-5 text-[#7b5a47]">
                    Changes here are prepared for storefront publishing.
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
