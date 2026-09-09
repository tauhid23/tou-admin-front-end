"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Settings,
  ChevronLeft, ChevronRight, ChevronDown, Store, LogOut,
  HelpCircle, Tag, Megaphone, FileText, BarChart2,
  Share2, Mail, CreditCard, Webhook, Search,
  Palette, Truck, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {useNavigate, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminCoupons, useAdminCustomers, useAdminOrders, useAdminPromotions, useLogout, useShippingSettings } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/lib/providers/ToastProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavChild {
  title: string;
  path: string;
  badge?: string;
  isNew?: boolean;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  isNew?: boolean;
  children?: NavChild[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Navigation config ────────────────────────────────────────────────────────

const baseNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        title: "Products",
        path: "/products",
        icon: Package,
        children: [
          { title: "All Products", path: "/products" },
          { title: "Add Product", path: "/products/new" },
          { title: "Categories", path: "/products/categories" },
          { title: "Subcategories", path: "/products/subcategories" },
          { title: "Inventory", path: "/products/inventory" },
          { title: "Reviews", path: "/products/reviews", badge: "8" },
        ],
      },
      {
        title: "Orders",
        path: "/orders",
        icon: ShoppingCart,
        children: [
          { title: "All Orders", path: "/orders" },
          { title: "Awaiting Review", path: "/orders/pending" },
          { title: "Processing", path: "/orders/processing" },
          { title: "Shipped", path: "/orders/shipped" },
          { title: "Delivered", path: "/orders/delivered" },
          { title: "Cancelled", path: "/orders/cancelled" },
          { title: "Returns & Refunds", path: "/orders/returns" },
        ],
      },
      {
        title: "Customers",
        path: "/customers",
        icon: Users,
        children: [
          { title: "All Customers", path: "/customers" },
          { title: "Repeat Customers", path: "/customers/repeat" },
          { title: "High Value", path: "/customers/high-value" },
          { title: "New This Month", path: "/customers/new" },
          { title: "Inactive", path: "/customers/inactive" },
          { title: "Blocked", path: "/customers/blocked" },
        ],
      },
      {
        title: "Shipping",
        path: "/shipping",
        icon: Truck,
        children: [
          { title: "Overview", path: "/shipping" },
          { title: "Shipping Zones", path: "/shipping/zones" },
          { title: "Carrier Directory", path: "/shipping/carriers" },
          { title: "Delivery Rules", path: "/shipping/rules" },
        ],
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        title: "Pricing & Promotions",
        path: "/marketing",
        icon: Tag,
        children: [
          { title: "All Coupons", path: "/marketing/coupons" },
          { title: "Create Coupon", path: "/marketing/coupons/new" },
          { title: "Discount Rules", path: "/marketing/discounts" },
          { title: "Flash Sales", path: "/marketing/flash-sales" },
        ],
      },
      {
        title: "Promotions",
        path: "/marketing/promotions",
        icon: Megaphone,
        children: [
          { title: "Campaigns", path: "/marketing/promotions" },
          { title: "Loyalty Program", path: "/marketing/loyalty" },
          { title: "Referral Program", path: "/marketing/referral", isNew: true },
          { title: "Abandoned Cart", path: "/marketing/abandoned-cart" },
        ],
      },
      {
        title: "Email Marketing",
        path: "/marketing/email",
        icon: Mail,
        children: [
          { title: "Newsletters", path: "/marketing/email/newsletters" },
          { title: "Automations", path: "/marketing/email/automations" },
          { title: "Subscribers", path: "/marketing/email/subscribers" },
          { title: "Templates", path: "/marketing/email/templates" },
        ],
      },
    ],
  },
  {
    label: "Storefront",
    items: [
      {
        title: "Appearance",
        path: "/appearance",
        icon: Palette,
        children: [
          { title: "Themes", path: "/storefront/themes" },
          { title: "Banners & Sliders", path: "/appearance/banners-sliders" },
          { title: "Colour & Typography", path: "/storefront/branding" },
          { title: "Logo & Favicon", path: "/appearance/logo-favicon" },
        ],
      },
      {
        title: "Pages & Content",
        path: "/storefront/about-us",
        icon: FileText,
        children: [
          // { title: "All Pages", path: "/storefront/pages" },
          { title: "Blog Posts", path: "/storefront/blog" },
          { title: "About Us", path: "/storefront/about-us"},
          { title: "Contact Page", path: "/storefront/contact", badge: "Inbox" },
          // { title: "Announcements", path: "/storefront/announcements" },
          { title: "Taglines", path: "/storefront/tagline" },
          // { title: "Header Menu", path: "/storefront/header" },
          { title: "Footer Links", path: "/storefront/footer" },
        ],
      },
      // {
      //   title: "Navigation",
      //   path: "/storefront/navigation",
      //   icon: Navigation,
      //   children: [
      //     { title: "Header Menu", path: "/storefront/navigation/header" },
      //     { title: "Footer Links", path: "/storefront/navigation/footer" },
      //     { title: "Mega Menu", path: "/storefront/navigation/mega" },
      //   ],
      // },
      // {
      //   title: "Media Library",
      //   path: "/storefront/media",
      //   icon: Image,
      // },
    ],
  },
  {
    label: "Analytics & SEO",
    items: [
      {
        title: "Reports",
        path: "/analytics/reports",
        icon: BarChart2,
        children: [
          { title: "Sales Report", path: "/analytics/sales" },
          { title: "Traffic", path: "/analytics/traffic" },
          { title: "Conversion Funnel", path: "/analytics/conversion" },
          { title: "Product Performance", path: "/analytics/products" },
          { title: "Customer Insights", path: "/analytics/customers" },
        ],
      },
      {
        title: "SEO",
        path: "/seo",
        icon: Search,
        children: [
          { title: "Meta Tags", path: "/seo/meta" },
          { title: "Sitemap", path: "/seo/sitemap" },
          { title: "Redirects", path: "/seo/redirects" },
          { title: "Structured Data", path: "/seo/schema" },
        ],
      },
      {
        title: "Reviews",
        path: "/reviews",
        icon: Star,
        badge: "8",
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        title: "Pixels & Tracking",
        path: "/integrations/tracking",
        icon: Share2,
        children: [
          { title: "Meta Pixel", path: "/integrations/meta-pixel" },
          { title: "Google Analytics", path: "/integrations/google-analytics" },
          { title: "Google Tag Manager", path: "/integrations/gtm" },
          { title: "TikTok Pixel", path: "/integrations/tiktok-pixel", isNew: true },
          { title: "Snapchat Pixel", path: "/integrations/snapchat-pixel" },
        ],
      },
      {
        title: "Payments",
        path: "/integrations/payments",
        icon: CreditCard,
        children: [
          { title: "Payment Gateways", path: "/integrations/payments" },
          { title: "Currencies", path: "/integrations/currencies" },
          { title: "Invoices", path: "/integrations/invoices" },
        ],
      },
      {
        title: "Apps & Webhooks",
        path: "/integrations/apps",
        icon: Webhook,
        isNew: true,
        children: [
          { title: "App Store", path: "/integrations/apps", isNew: true },
          { title: "Webhooks", path: "/integrations/webhooks" },
          { title: "API Keys", path: "/integrations/api-keys" },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
        children: [
          { title: "General", path: "/settings/general" },
          { title: "Store Details", path: "/settings/store" },
          { title: "Tax Settings", path: "/settings/tax" },
          { title: "Notifications", path: "/settings/notifications" },
          { title: "Team & Roles", path: "/settings/team" },
          { title: "Billing & Plan", path: "/settings/billing" },
        ],
      },
      { title: "Help & Support", path: "/help", icon: HelpCircle },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tooltip({ label, children, show }: {
  label: string;
  children: React.ReactNode;
  show: boolean;
}) {
  if (!show) return <>{children}</>;

  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
        <div className="opacity-0 group-hover/tip:opacity-100 transition-all duration-200 text-xs font-medium px-3 py-1.5 rounded-2xl whitespace-nowrap bg-neutral-900 text-white border border-neutral-700 shadow-xl">
          {label}
        </div>
      </div>
    </div>
  );
}

function CountBadge({ value, active }: { value: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold min-w-[18px] h-[18px] px-1.5 rounded-full flex items-center justify-center tabular-nums shadow-sm",
        active 
          ? "bg-white text-neutral-900" 
          : "bg-neutral-900 text-white"
      )}
    >
      {value}
    </span>
  );
}

function NewPill({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "text-[9px] font-bold px-2 py-px rounded-full uppercase tracking-widest shadow-sm",
        active 
          ? "bg-white text-neutral-900" 
          : "bg-amber-400 text-neutral-900"
      )}
    >
      New
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(["Products"]);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const ordersOverview = useAdminOrders("page=1&limit=10");
  const customersOverview = useAdminCustomers("page=1&limit=10");
  const shippingSettings = useShippingSettings();
  const couponsOverview = useAdminCoupons("page=1&limit=10");
  const automaticPromotions = useAdminPromotions("automatic");
  const flashPromotions = useAdminPromotions("flash_sale");
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navGroups = useMemo(() => {
    const summary = ordersOverview.data?.summary;
    const countBadge = (value?: number) =>
      value && value > 0 ? (value > 99 ? "99+" : String(value)) : undefined;
    const badges: Record<string, string | undefined> = {
      "/orders": countBadge(summary?.totalOrders),
      "/orders/pending": countBadge(summary?.pending),
      "/orders/processing": countBadge(summary?.processing),
      "/orders/shipped": countBadge(summary?.shipped),
      "/orders/delivered": countBadge(summary?.delivered),
      "/orders/cancelled": countBadge(summary?.cancelled),
    };
    const customerSummary = customersOverview.data?.summary;
    const customerBadges: Record<string, string | undefined> = {
      "/customers": countBadge(customerSummary?.totalCustomers),
      "/customers/repeat": countBadge(customerSummary?.repeatCustomers),
      "/customers/high-value": countBadge(customerSummary?.highValueCustomers),
      "/customers/new": countBadge(customerSummary?.newThisMonth),
      "/customers/inactive": countBadge(customerSummary?.inactiveCustomers),
      "/customers/blocked": countBadge(customerSummary?.blockedCustomers),
    };
    const shippingBadges: Record<string, string | undefined> = {
      "/shipping/zones": countBadge(shippingSettings.data?.zones.filter((zone) => zone.active).length),
      "/shipping/carriers": countBadge(shippingSettings.data?.carriers.filter((carrier) => carrier.active).length),
    };
    const couponSummary = couponsOverview.data?.summary;
    const automaticSummary = automaticPromotions.data?.summary;
    const flashSummary = flashPromotions.data?.summary;
    const promotionBadges: Record<string, string | undefined> = {
      "/marketing/coupons": countBadge(couponSummary?.totalCoupons),
      "/marketing/discounts": countBadge(automaticSummary?.active),
      "/marketing/flash-sales": countBadge(flashSummary?.active),
    };

    return baseNavGroups.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.path === "/orders"
          ? {
              ...item,
              badge: countBadge(summary?.pending),
              children: item.children?.map((child) => ({ ...child, badge: badges[child.path] })),
            }
          : item.path === "/customers"
            ? {
                ...item,
                badge: countBadge(customerSummary?.newThisMonth),
                children: item.children?.map((child) => ({ ...child, badge: customerBadges[child.path] })),
              }
            : item.path === "/shipping"
              ? {
                  ...item,
                  children: item.children?.map((child) => ({ ...child, badge: shippingBadges[child.path] })),
                }
              : item.path === "/marketing"
                ? {
                    ...item,
                    badge: countBadge((couponSummary?.active ?? 0) + (automaticSummary?.active ?? 0) + (flashSummary?.active ?? 0)),
                    children: item.children?.map((child) => ({ ...child, badge: promotionBadges[child.path] })),
                  }
          : item
      ),
    }));
  }, [automaticPromotions.data?.summary, couponsOverview.data?.summary, customersOverview.data?.summary, flashPromotions.data?.summary, ordersOverview.data?.summary, shippingSettings.data]);
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

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

  const toggleMenu = (title: string) =>
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );

  const isActive = (path: string) => location.pathname === path;
  const hasActiveChild = (children?: NavChild[]) =>
    children?.some((c) => isActive(c.path));

  return (
    <motion.aside
      animate={{ width: collapsed ? 78 : 282 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r border-neutral-100 bg-white shadow-xl"
    >
      {/* ── Logo ─────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center h-20 shrink-0 px-5 border-b border-neutral-100",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black shadow-md">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[17px] font-bold tracking-[-0.02em] text-neutral-900">TREIZE</p>
                <p className="text-[9px] uppercase tracking-[0.125em] text-neutral-400 -mt-0.5">COMMERCE</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mini"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black shadow-md"
            >
              <Store className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && "mt-6")}>
            {collapsed && gi > 0 && <div className="h-px mx-2 my-3 bg-neutral-100" />}

            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.075em] text-neutral-400">
                {group.label}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const itemActive = isActive(item.path) || hasActiveChild(item.children);
                const isOpen = openMenus.includes(item.title) || Boolean(hasActiveChild(item.children));

                return (
                  <div key={item.title}>
                    <Tooltip label={item.title} show={collapsed}>
                      <div
                        onClick={() => {
  if (item.children) {
    toggleMenu(item.title);
  } else {
    navigate(item.path);
  }
}}
                        className={cn(
                          "group relative flex items-center justify-between px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200",
                          itemActive
                            ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/50"
                            : "hover:bg-neutral-100 active:bg-neutral-200"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <item.icon
                            className={cn(
                              "w-4.5 h-4.5 shrink-0 transition-colors",
                              itemActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-700"
                            )}
                          />

                          {!collapsed && (
                            <span
                              className={cn(
                                "text-[13.2px] font-medium truncate",
                                itemActive ? "text-white" : "text-neutral-700"
                              )}
                            >
                              {item.title}
                            </span>
                          )}
                        </div>

                        {!collapsed && (
                          <div className="flex items-center gap-1.5">
                            {item.isNew && <NewPill active={itemActive} />}
                            {item.badge && <CountBadge value={item.badge} active={itemActive} />}
                            {item.children && (
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 transition-transform duration-300",
                                  isOpen && "rotate-180",
                                  itemActive ? "text-white/70" : "text-neutral-400"
                                )}
                              />
                            )}
                          </div>
                        )}

                        {/* Collapsed indicator */}
                        {collapsed && (item.badge || item.isNew) && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                        )}
                      </div>
                    </Tooltip>

                    {/* Submenu */}
                    <AnimatePresence>
                      {isOpen && !collapsed && item.children && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 mt-1 mb-2 pl-4 border-l border-neutral-200 space-y-0.5">
                            {item.children.map((child) => (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive: ca }) =>
                                  cn(
                                    "flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] transition-all duration-150",
                                    ca
                                      ? "bg-neutral-900 text-white font-medium"
                                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                                  )
                                }
                              >
                                {({ isActive: ca }) => (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className={cn("w-1 h-1 rounded-full", ca ? "bg-white" : "bg-neutral-400")} />
                                      {child.title}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {child.isNew && <NewPill active={ca} />}
                                      {child.badge && <CountBadge value={child.badge} active={ca} />}
                                    </div>
                                  </>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ───────────────────────────────── */}
      <div className="shrink-0 border-t border-neutral-100 bg-white/80 backdrop-blur-sm">
        {!collapsed && (
          <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-100 text-xs text-neutral-400">
            <span>3 unread notifications</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-3 p-3 transition-all hover:bg-neutral-50",
            collapsed && "justify-center"
          )}
        >
          <Tooltip label="Ahmad Rafi · Admin" show={collapsed}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center text-white text-sm font-bold shadow-md">
              {initials}
            </div>
          </Tooltip>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-neutral-900">{user?.name ?? "Admin"}</p>
                <p className="truncate text-xs capitalize text-neutral-500">
                  {(user?.role ?? "admin").replace(/_/g, " ")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="rounded-xl p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expand Button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-20 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.aside>
  );
}
