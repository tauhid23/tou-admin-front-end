// src/pages/dashboard/components/TrafficSources.tsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { TrafficSource } from "@/pages/dashboard/_components/types";

interface TrafficSourcesProps {
  sources: TrafficSource[];
}

// Map tailwind class → hex for recharts (recharts needs real colors, not tw classes)
const colorMap: Record<string, string> = {
  "bg-neutral-900": "#171717",
  "bg-neutral-600": "#525252",
  "bg-neutral-400": "#a3a3a3",
  "bg-neutral-200": "#e5e5e5",
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 text-white rounded-xl px-3 py-2 text-[12px] shadow-xl">
      <p className="text-white/60 mb-0.5">{payload[0].name}</p>
      <p className="font-bold">{payload[0].value}%</p>
    </div>
  );
}

export default function TrafficSources({ sources }: TrafficSourcesProps) {
  const chartData = sources.map((s) => ({
    name: s.label,
    value: s.value,
    color: colorMap[s.color] ?? "#171717",
  }));

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-neutral-900">Traffic Sources</h2>
        <p className="text-[12px] text-neutral-400 mt-0.5">Where visitors come from</p>
      </div>

      {/* Donut chart */}
      <div className="flex items-center gap-6">
        <div className="w-[110px] h-[110px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={52}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {sources.map((source) => (
            <div key={source.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${source.color}`}
                />
                <span className="text-[12px] text-neutral-600">{source.label}</span>
              </div>
              <span className="text-[12px] font-semibold text-neutral-900 tabular-nums">
                {source.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}