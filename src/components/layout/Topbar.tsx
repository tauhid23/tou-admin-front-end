
import { Bell, Search, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-neutral-200 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative p-3 rounded-2xl hover:bg-neutral-100"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        <button className="flex items-center gap-3 bg-neutral-100 rounded-2xl px-4 py-2 hover:bg-neutral-200 transition">
          <UserCircle2 className="w-8 h-8" />
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-neutral-500">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}