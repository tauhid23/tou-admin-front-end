import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { NavItemType } from "@/types/nav";

const navItems: NavItemType[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    path: "/products",
    icon: Package,
    children: [
      {
        title: "All Products",
        path: "/products",
        icon: Package,
      },
      {
        title: "Add Product",
        path: "/products/new",
        icon: Package,
      },
    ],
  },
  {
    title: "Orders",
    path: "/orders",
    icon: ShoppingCart,
    badge: "12",
  },
  {
    title: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 90 : 280 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white border-r border-neutral-200 shadow-sm sticky top-0"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8" />
            <h1 className="text-xl font-bold">TREIZE</h1>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-neutral-100"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isOpen = openMenus.includes(item.title);

          return (
            <div key={item.title}>
              <div
                onClick={() => item.children && toggleMenu(item.title)}
                className="cursor-pointer"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl transition-all",
                      isActive
                        ? "bg-black text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </div>

                  {!collapsed && item.children && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </NavLink>
              </div>

              <AnimatePresence>
                {isOpen && !collapsed && item.children && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden ml-6 mt-2 space-y-2"
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.title}
                        to={child.path}
                        className="block px-4 py-2 rounded-xl text-sm hover:bg-neutral-100"
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </motion.aside>
  );
}