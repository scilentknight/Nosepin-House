"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  PROCESSING: "#2a78d6",
  SHIPPED: "#eb6834",
  DELIVERED: "#1baf7a",
  RETURNED: "#eda100",
  CANCELLED: "#e87ba4",
};

const STATUS_ORDER = ["PROCESSING", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"];

function label(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { status: string; count: number } }[] }) {
  if (!active || !payload?.length) return null;
  const { status, count } = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-soft-lg">
      <p className="font-medium text-gray-900">{label(status)}</p>
      <p className="mt-0.5 text-gray-600">
        {count} order{count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function OrdersByStatusChart({ data }: { data: { status: string; count: number }[] }) {
  const byStatus = new Map(data.map((d) => [d.status, d.count]));
  const rows = STATUS_ORDER.map((status) => ({ status, count: byStatus.get(status) ?? 0 }));
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  if (total === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-gray-400">No orders yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#e1e0d9" strokeDasharray="3 3" />
        <XAxis
          dataKey="status"
          tickFormatter={label}
          tick={{ fontSize: 11, fill: "#52514e" }}
          tickLine={false}
          axisLine={{ stroke: "#c3c2b7" }}
        />
        <YAxis tick={{ fontSize: 11, fill: "#898781" }} tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9f9f7" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {rows.map((row) => (
            <Cell key={row.status} fill={STATUS_COLORS[row.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
