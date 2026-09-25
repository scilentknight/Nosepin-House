"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice } from "@/lib/format";

const LINE_COLOR = "#256abf";
const FILL_COLOR = "#cde2fb";

interface RevenuePoint {
  date: string;
  revenue: number;
}

function shortDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-soft-lg">
      <p className="font-medium text-gray-900">{shortDate(label)}</p>
      <p className="mt-0.5 text-gray-600">{formatPrice(payload[0].value)}</p>
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No revenue in the last 30 days yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={FILL_COLOR} stopOpacity={0.7} />
            <stop offset="100%" stopColor={FILL_COLOR} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e1e0d9" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={shortDate}
          tick={{ fontSize: 11, fill: "#898781" }}
          tickLine={false}
          axisLine={{ stroke: "#c3c2b7" }}
          interval={Math.ceil(data.length / 6)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#898781" }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#c3c2b7", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={LINE_COLOR}
          strokeWidth={2}
          fill="url(#revenueFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
