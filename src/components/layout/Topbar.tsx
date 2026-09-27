import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Command,
  Inbox,
  Loader2,
  LogOut,
  PackageCheck,
  RotateCcw,
  Search,
  UserCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminReturns, useContactMessages, useDashboardOverview, useLogout } from "@/lib/api/queries";
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

const NOTIFICATION_SEEN_KEY = "sosbd_admin_notifications_seen";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [seenSignature, setSeenSignature] = useState(() => localStorage.getItem(NOTIFICATION_SEEN_KEY) ?? "");
  const notificationsRef = useRef<HTMLDivElement>(null);
  const dashboard = useDashboardOverview({ days: 30 });
  const messages = useContactMessages("new");
  const returns = useAdminReturns("status=requested&page=1&limit=1");
  const section = Object.entries(routeLabels)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1] ?? "Workspace";

  const notifications = useMemo(() => [
    {
      label: "Orders awaiting fulfilment",
      detail: "Review and move confirmed orders into processing.",
      count: dashboard.data?.summary.pendingFulfilment ?? 0,
      path: "/orders/pending",
      icon: PackageCheck,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Low-stock products",
      detail: "Replenish products that reached their reorder point.",
      count: dashboard.data?.summary.lowStockProducts ?? 0,
      path: "/products/inventory",
      icon: AlertTriangle,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "New customer messages",
      detail: "Reply to unread storefront enquiries.",
      count: messages.data?.counts.new ?? 0,
      path: "/storefront/contact",
      icon: Inbox,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Return requests",
      detail: "Review newly submitted return requests.",
      count: returns.data?.summary.requested ?? 0,
      path: "/orders/returns",
      icon: RotateCcw,
      tone: "bg-rose-50 text-rose-700",
    },
  ], [dashboard.data?.summary.lowStockProducts, dashboard.data?.summary.pendingFulfilment, messages.data?.counts.new, returns.data?.summary.requested]);

  const activeNotifications = notifications.filter((notification) => notification.count > 0);
  const totalAlerts = activeNotifications.reduce((sum, notification) => sum + notification.count, 0);
  const signature = notifications.map((notification) => notification.count).join(":");
  const unreadCount = signature !== seenSignature ? totalAlerts : 0;

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) setNotificationsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const markReviewed = () => {
    localStorage.setItem(NOTIFICATION_SEEN_KEY, signature);
    setSeenSignature(signature);
  };

  const toggleNotifications = () => {
    setNotificationsOpen((current) => !current);
    if (!notificationsOpen) markReviewed();
  };

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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">SOSBD Admin</p>
          <p className="truncate text-sm font-semibold text-slate-900">{section}</p>
        </div>
        <div className="relative w-[min(44vw,440px)] min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search products, orders, customers..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white" />
          <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-400 lg:flex"><Command className="h-3 w-3" /> K</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div ref={notificationsRef} className="relative">
          <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={toggleNotifications} aria-label={unreadCount ? `${unreadCount} unread operational alerts` : "Operational alerts"} aria-expanded={notificationsOpen} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </motion.button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-[min(92vw,380px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div><p className="text-sm font-bold text-slate-950">Operational alerts</p><p className="mt-0.5 text-xs text-slate-500">Live items that need attention</p></div>
                <button type="button" onClick={markReviewed} className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"><CheckCheck className="h-3.5 w-3.5" /> Reviewed</button>
              </div>
              <div className="max-h-[420px] overflow-y-auto p-2">
                {activeNotifications.length ? activeNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <button key={notification.path} type="button" onClick={() => { markReviewed(); setNotificationsOpen(false); navigate(notification.path); }} className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${notification.tone}`}><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-900">{notification.label}</span><span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-white">{notification.count}</span></span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{notification.detail}</span>
                      </span>
                    </button>
                  );
                }) : (
                  <div className="px-6 py-10 text-center"><CheckCheck className="mx-auto h-7 w-7 text-emerald-600" /><p className="mt-3 text-sm font-semibold text-slate-800">Everything is up to date</p><p className="mt-1 text-xs text-slate-500">No operational alerts need attention.</p></div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex h-10 items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 pr-2 transition">
          <UserCircle2 className="h-7 w-7 text-slate-700" />
          <div className="hidden text-left md:block"><p className="text-sm font-semibold leading-4 text-slate-900">{user?.name ?? "Admin"}</p><p className="text-xs capitalize text-slate-500">{(user?.role ?? "admin").replace(/_/g, " ")}</p></div>
          <button type="button" onClick={handleLogout} disabled={logout.isPending} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Sign out">
            {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
