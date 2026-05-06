// src/pages/dashboard/components/RecentOrders.tsx

import { ArrowRight, Globe, Smartphone, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/pages/dashboard/_components/types";

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig: Record<
  Order["status"],
  { label: string; classes: string }
> = {
  completed:  { label: "Completed",  classes: "bg-neutral-900 text-white" },
  processing: { label: "Processing", classes: "bg-neutral-200 text-neutral-700" },
  pending:    { label: "Pending",    classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  cancelled:  { label: "Cancelled", classes: "bg-red-50 text-red-600 border border-red-200" },
};

const channelIcon: Record<Order["channel"], React.ElementType> = {
  web:    Globe,
  mobile: Smartphone,
  pos:    Store,
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">Recent Orders</h2>
          <p className="text-[12px] text-neutral-400 mt-0.5">Last 6 transactions</p>
        </div>
        <button className="flex items-center gap-1 text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              {["Order", "Customer", "Product", "Channel", "Amount", "Status", "Time"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-[10.5px] uppercase tracking-widest font-semibold text-neutral-400"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const ChannelIcon = channelIcon[order.channel];

              return (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50/60 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="px-5 py-3.5">
                    <span className="text-[12.5px] font-mono font-medium text-neutral-500 group-hover:text-neutral-900 transition-colors">
                      {order.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {order.avatar}
                      </div>
                      <span className="text-[13px] font-medium text-neutral-900 whitespace-nowrap">
                        {order.customer}
                      </span>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="px-5 py-3.5">
                    <span className="text-[12.5px] text-neutral-600 whitespace-nowrap">
                      {order.product}
                    </span>
                  </td>

                  {/* Channel */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <ChannelIcon className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-[12px] text-neutral-500 capitalize">
                        {order.channel}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-semibold text-neutral-900">
                      ${order.amount.toFixed(2)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap",
                        status.classes
                      )}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-neutral-400 whitespace-nowrap">
                      {order.date}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}