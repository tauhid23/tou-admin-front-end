// src/pages/dashboard/components/StatCard.tsx

import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
//   TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/pages/dashboard/_components/types";

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
};

interface StatCardProps {
  data: StatCardData;
  index: number;
}

export default function StatCard({ data, index }: StatCardProps) {
  const Icon = iconMap[data.icon] ?? DollarSign;
  const isPositive = data.change >= 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex flex-col gap-4",
        // first card gets the dark treatment
        index === 0 && "bg-neutral-900 border-neutral-900"
      )}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            index === 0 ? "bg-white/10" : "bg-neutral-100"
          )}
        >
          <Icon
            className={cn(
              "w-4.5 h-4.5",
              index === 0 ? "text-white" : "text-neutral-700"
            )}
          />
        </div>

        <span
          className={cn(
            "flex items-center gap-0.5 text-[12px] font-semibold px-2 py-1 rounded-lg",
            isPositive
              ? index === 0
                ? "bg-white/10 text-white"
                : "bg-green-50 text-green-700"
              : index === 0
              ? "bg-white/10 text-white"
              : "bg-red-50 text-red-600"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(data.change)}%
        </span>
      </div>

      {/* Value + label */}
      <div>
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-widest mb-1",
            index === 0 ? "text-white/50" : "text-neutral-400"
          )}
        >
          {data.title}
        </p>
        <p
          className={cn(
            "text-[28px] font-bold leading-none tracking-tight",
            index === 0 ? "text-white" : "text-neutral-900"
          )}
        >
          {data.prefix}
          {data.value}
          {data.suffix}
        </p>
      </div>

      {/* Change label */}
      <p
        className={cn(
          "text-[11px] mt-auto",
          index === 0 ? "text-white/40" : "text-neutral-400"
        )}
      >
        {isPositive ? "+" : ""}
        {data.change}% {data.changeLabel}
      </p>
    </div>
  );
}