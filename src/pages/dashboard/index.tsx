// src/pages/dashboard/index.tsx

import { Bell, Search, RefreshCw } from "lucide-react";
import { useState } from "react";
import StatCard from "./_components/StatCard";
import RevenueChart from "./_components/RevenueChart";
import RecentOrders from "./_components/RecentOrders";
import TopProducts from "./_components/TopProducts";
import TrafficSources from "./_components/TrafficSources";
import {
  statCards,
  revenueData,
  recentOrders,
  topProducts,
  trafficSources,
} from "@/pages/dashboard/_components/dashboardData";

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ── Top bar ───────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="flex items-center justify-between px-6 h-[66px]">
          {/* Title */}
          <div>
            <h1 className="text-[17px] font-bold text-neutral-900 leading-none">
              Dashboard
            </h1>
            <p className="text-[12px] text-neutral-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 w-52">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-[13px] text-neutral-700 placeholder:text-neutral-400 outline-none w-full"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="w-9 h-9 rounded-xl border border-neutral-200 bg-white flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 transition-transform duration-700 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl border border-neutral-200 bg-white flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-neutral-900" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-white text-[11px] font-bold cursor-pointer">
              AR
            </div>
          </div>
        </div>
      </div>

      {/* ── Page content ─────────────────────────── */}
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={card.title} data={card} index={i} />
          ))}
        </div>

        {/* Revenue chart – full width */}
        <RevenueChart data={revenueData} />

        {/* Bottom row: Orders table (wide) + side column */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent orders – spans 2 cols */}
          <div className="xl:col-span-2">
            <RecentOrders orders={recentOrders} />
          </div>

          {/* Side column */}
          <div className="space-y-6">
            <TrafficSources sources={trafficSources} />
            <TopProducts products={topProducts} />
          </div>
        </div>

      </div>
    </div>
  );
}