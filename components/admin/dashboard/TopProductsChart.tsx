"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BAR_COLOR = "#eb6834";

interface TopProduct {
  name: string;
  quantity: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: TopProduct }[] }) {
  if (!active || !payload?.length) return null;
  const { name, quantity } = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-soft-lg">
      <p className="max-w-[220px] font-medium text-gray-900">{name}</p>
      <p className="mt-0.5 text-gray-600">
        {quantity} sold
      </p>
    </div>
  );
}

function truncate(name: string, max = 22) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-gray-400">No sales yet.</div>;
  }

  const sorted = [...data].sort((a, b) => a.quantity - b.quantity);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="#e1e0d9" strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#898781" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tickFormatter={truncate}
          tick={{ fontSize: 11, fill: "#52514e" }}
          tickLine={false}
          axisLine={{ stroke: "#c3c2b7" }}
          width={140}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9f9f7" }} />
        <Bar dataKey="quantity" fill={BAR_COLOR} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
