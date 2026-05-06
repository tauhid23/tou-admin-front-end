// src/pages/dashboard/components/TopProducts.tsx

import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopProduct } from "@/pages/dashboard/_components/types";

interface TopProductsProps {
  products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">Top Products</h2>
          <p className="text-[12px] text-neutral-400 mt-0.5">By revenue this month</p>
        </div>
        <button className="flex items-center gap-1 text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="p-5 space-y-5">
        {products.map((product, i) => {
          const pct = Math.round((product.revenue / product.maxRevenue) * 100);
          const isUp = product.growth >= 0;

          return (
            <div key={product.id} className="group">
              <div className="flex items-start justify-between mb-1.5">
                {/* Rank + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-bold text-neutral-300 w-4 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 truncate group-hover:text-black">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">{product.category}</p>
                  </div>
                </div>

                {/* Revenue + growth */}
                <div className="text-right shrink-0 ml-3">
                  <p className="text-[13px] font-semibold text-neutral-900">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <span
                    className={cn(
                      "flex items-center justify-end gap-0.5 text-[11px] font-semibold",
                      isUp ? "text-green-600" : "text-red-500"
                    )}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(product.growth)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="ml-7 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Units sold */}
              <p className="ml-7 mt-1 text-[10.5px] text-neutral-400">
                {product.units} units · {pct}% of top
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}