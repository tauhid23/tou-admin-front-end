import { Bell, Command, Loader2, LogOut, Search, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/lib/providers/ToastProvider";

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
  const navigate = useNavigate();
  const logout = useLogout();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const section =
    Object.entries(routeLabels)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1] ??
    "Workspace";

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("Signed out");
    } catch {
      clearSession();
    } finally {
      navigate("/login", { replace: true });
    }
  };

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

        <div className="flex h-10 items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 pr-2 transition">
          <UserCircle2 className="h-7 w-7 text-slate-700" />
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold leading-4 text-slate-900">{user?.name ?? "Admin"}</p>
            <p className="text-xs capitalize text-slate-500">{(user?.role ?? "admin").replace(/_/g, " ")}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Sign out"
          >
            {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
