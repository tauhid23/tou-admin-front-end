// components/layout/NavItem.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItemType } from "../../types/nav";

interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
}

export default function NavItem({ item, collapsed }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = !!item.children?.length;

  return (
    <div>
      {/* Main Nav Item */}
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            cn(
              "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300",
              isActive
                ? "bg-black text-white shadow-md"
                : "text-neutral-700 hover:bg-neutral-100"
            )
          }
        >
          <div className="flex items-center gap-3 min-w-0">
            <item.icon className="w-5 h-5 shrink-0" />

            {!collapsed && (
              <span className="font-medium truncate">{item.title}</span>
            )}
          </div>

          {!collapsed && hasChildren && (
            <ChevronDown
              className={cn(
                "w-4 h-4 shrink-0 transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          )}
        </NavLink>
      </div>

      {/* Submenu */}
      <AnimatePresence>
        {hasChildren && isOpen && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="ml-6 mt-2 space-y-1 border-l border-neutral-200 pl-4">
              {item.children?.map((child) => (
                <NavLink
                  key={child.title}
                  to={child.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center py-2 px-3 rounded-xl text-sm transition-all",
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                    )
                  }
                >
                  {child.title}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}