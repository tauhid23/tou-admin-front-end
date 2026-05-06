// src/pages/dashboard/components/RevenueChart.tsx

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { RevenuePoint } from "@/pages/dashboard/_components/types";

interface RevenueChartProps {
  data: RevenuePoint[];
}

type Metric = "revenue" | "orders";

const metrics: { key: Metric; label: string; prefix?: string }[] = [
  { key: "revenue", label: "Revenue", prefix: "$" },
  { key: "orders",  label: "Orders" },
];

const ranges = ["2W", "1M", "3M", "6M", "1Y"] as const;

function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;
  const prefix = metric === "revenue" ? "$" : "";
  return (
    <div className="bg-neutral-900 text-white rounded-xl px-3.5 py-2.5 shadow-xl text-[12px]">
      <p className="text-white/50 mb-0.5">{label}</p>
      <p className="font-bold text-[14px]">
        {prefix}
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [range, setRange] = useState<string>("1M");

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">Performance</h2>
          <p className="text-[12px] text-neutral-400 mt-0.5">Revenue & order trends over time</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric toggle */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={cn(
                  "text-[12px] font-medium px-3 py-1.5 rounded-md transition-all",
                  metric === m.key
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Range selector */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "text-[12px] font-medium px-2.5 py-1.5 rounded-md transition-all",
                  range === r
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#171717" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#171717" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#a3a3a3" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#a3a3a3" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              metric === "revenue" ? `$${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            content={<CustomTooltip metric={metric} />}
            cursor={{ stroke: "#e5e5e5", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke="#171717"
            strokeWidth={2}
            fill="url(#metricGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#171717", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}