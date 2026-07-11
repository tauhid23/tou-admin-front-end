import { Bell, Command, Search, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/shipping": "Shipping",
  "/marketing": "Marketing",
  "/appearance": "Appearance",
  "/storefront": "Storefront",
  "/analytics": "Analytics",
  "/seo": "SEO",
  "/integrations": "Integrations",
  "/settings": "Settings",
};

export default function Topbar() {
  const location = useLocation();
  const section =
    Object.entries(routeLabels)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1] ??
    "Workspace";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div className="hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Admin</p>
          <p className="truncate text-sm font-semibold text-slate-900">{section}</p>
        </div>

        <div className="relative w-[min(44vw,440px)] min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
          <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-400 lg:flex">
            <Command className="h-3 w-3" /> K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </motion.button>

        <button className="flex h-10 items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 pr-3 transition hover:bg-slate-50">
          <UserCircle2 className="h-7 w-7 text-slate-700" />
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold leading-4 text-slate-900">Tauhid</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
