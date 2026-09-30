"use client";
import Loading from "@/components/ui/Loading";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Bell, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/format";

type Period = {
  revenue: number;
  orders?: number;
  prevRevenue?: number | null;
  prevOrders?: number | null;
};
type Order = {
  id: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
};
interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueByDay: { date: string; revenue: number; orders?: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; quantity: number }[];
  // Optional. Anything missing is derived from revenueByDay or the panel is hidden.
  periods?: { today: Period; week: Period; month: Period };
  revenueByCategory?: { name: string; revenue: number }[];
  recentOrders?: Order[];
  lowStock?: { name: string; stock: number }[];
}

const STATUSES = [
  { key: "PROCESSING", label: "Processing", color: "#2a78d6" },
  { key: "SHIPPED", label: "Shipped", color: "#eb6834" },
  { key: "DELIVERED", label: "Delivered", color: "#1baf7a" },
  { key: "RETURNED", label: "Returned", color: "#eda100" },
  { key: "CANCELLED", label: "Cancelled", color: "#e87ba4" },
];
const PALETTE = [
  "#256abf",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#8b6cc7",
  "#94a3b8",
];
const RANGES = [7, 30, 90] as const;
const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
const day = (v: string, long = false) =>
  new Date(v).toLocaleDateString(
    "en-US",
    long
      ? { weekday: "short", month: "short", day: "numeric" }
      : { month: "short", day: "numeric" },
  );
const ago = (v: string) => {
  const m = Math.max(
    0,
    Math.round((Date.now() - new Date(v).getTime()) / 60000),
  );
  return m < 1
    ? "just now"
    : m < 60
      ? `${m}m ago`
      : m < 1440
        ? `${Math.round(m / 60)}h ago`
        : day(v);
};

function Delta({ now, before }: { now: number; before?: number | null }) {
  if (before == null)
    return <span className="text-slate-400">no earlier data</span>;
  if (before === 0)
    return (
      <span className="text-slate-400">
        {now > 0 ? "new activity" : "no change"}
      </span>
    );
  const p = ((now - before) / before) * 100;
  return (
    <span className={p >= 0 ? "text-emerald-700" : "text-rose-700"}>
      {p >= 0 ? "▲" : "▼"} {Math.abs(p).toFixed(1)}%
    </span>
  );
}

function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white p-5 ${className}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {aside && <div className="text-xs text-slate-500">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        {note && <p className="text-xs text-slate-400">{note}</p>}
      </div>
      <p className="text-sm font-semibold tabular-nums text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Donut({
  items,
  center,
  money,
}: {
  items: { name: string; value: number; color: string }[];
  center: string;
  money?: boolean;
}) {
  const total = sum(items.map((i) => i.value));
  if (!total)
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Nothing to show yet.
      </p>
    );
  return (
    <div>
      <div className="relative mx-auto h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {items.map((i) => (
                <Cell key={i.name} fill={i.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => {
                const value = Number(v ?? 0);
                return money ? formatPrice(value) : value.toLocaleString();
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums text-slate-900">
            {money ? formatPrice(total) : total.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">{center}</span>
        </div>
      </div>
      <div className="mt-3">
        {items.map((i) => (
          <div key={i.name} className="flex items-center gap-2.5 py-1 text-sm">
            <i
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: i.color }}
            />
            <span className="flex-1 truncate text-slate-600">{i.name}</span>
            <span className="tabular-nums font-medium text-slate-900">
              {money ? formatPrice(i.value) : i.value.toLocaleString()}
            </span>
            <span className="w-11 text-right tabular-nums text-slate-400">
              {((i.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [updated, setUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState<Order[]>([]);
  const [unread, setUnread] = useState(0);
  const seen = useRef<Set<string> | null>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const j = await (
        await fetch(`/api/admin/dashboard?range=${range}`)
      ).json();
      const d: DashboardData | null = j.data ?? null;
      if (!d) throw new Error("empty");
      const orders = d.recentOrders ?? [];
      if (seen.current) {
        const fresh = orders.filter((o) => !seen.current!.has(o.id));
        if (fresh.length) {
          setToasts((t) => [...fresh.slice(0, 3), ...t].slice(0, 4));
          setUnread((u) => u + fresh.length);
          setTimeout(
            () => setToasts((t) => t.filter((x) => !fresh.includes(x))),
            9000,
          );
        }
      }
      seen.current = new Set([
        ...(seen.current ?? []),
        ...orders.map((o) => o.id),
      ]);
      setData(d);
      setState("ready");
      setUpdated(new Date());
    } catch {
      setState((s) => (s === "ready" ? s : "error"));
    } finally {
      setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    const poll = setInterval(load, 30000);
    return () => {
      clearTimeout(t);
      clearInterval(poll);
    };
  }, [load]);

  const m = useMemo(() => {
    if (!data) return null;
    const all = data.revenueByDay.slice(-range);
    const hasOrders = all.some((d) => d.orders != null);
    const derive = (n: number): Period => {
      const cur = data.revenueByDay.slice(-n);
      const prev =
        data.revenueByDay.length >= n * 2
          ? data.revenueByDay.slice(-n * 2, -n)
          : null;
      return {
        revenue: sum(cur.map((d) => d.revenue)),
        orders: hasOrders ? sum(cur.map((d) => d.orders ?? 0)) : undefined,
        prevRevenue: prev ? sum(prev.map((d) => d.revenue)) : null,
        prevOrders:
          prev && hasOrders ? sum(prev.map((d) => d.orders ?? 0)) : null,
      };
    };
    const periods = data.periods ?? {
      today: derive(1),
      week: derive(7),
      month: derive(30),
    };
    const chart = all.map((d, i) => {
      const w = all.slice(Math.max(0, i - 6), i + 1);
      return {
        date: d.date,
        Revenue: d.revenue,
        "7-day average": sum(w.map((x) => x.revenue)) / w.length,
      };
    });
    const best = all.reduce(
      (b, d) => (d.revenue > b.revenue ? d : b),
      all[0] ?? { date: "", revenue: 0 },
    );
    const st = new Map(data.ordersByStatus.map((s) => [s.status, s.count]));
    const orderTotal = sum(STATUSES.map((s) => st.get(s.key) ?? 0));
    const topMax = Math.max(1, ...data.topProducts.map((p) => p.quantity));
    const q = query.trim().toLowerCase();
    const orders = (data.recentOrders ?? []).filter(
      (o) =>
        (statusFilter === "ALL" || o.status === statusFilter) &&
        (!q ||
          o.customer.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)),
    );
    return {
      periods,
      chart,
      best,
      st,
      orderTotal,
      topMax,
      orders,
      rangeRevenue: sum(all.map((d) => d.revenue)),
      days: all.length,
    };
  }, [data, range, statusFilter, query]);

  // if (state === "loading")
  //   return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  if (state === "loading") {
    return <Loading />;
  }
  if (state === "error" || !data || !m)
    return (
      <div className="text-sm text-rose-700">
        Couldn&apos;t load the dashboard.{" "}
        <button onClick={load} className="underline">
          Try again
        </button>
      </div>
    );

  const aov = data.totalOrders ? data.totalRevenue / data.totalOrders : 0;
  const pending = m.st.get("PROCESSING") ?? 0;
  const cards = [
    { label: "Today", p: m.periods.today, vs: "vs yesterday" },
    { label: "This week", p: m.periods.week, vs: "vs last week" },
    { label: "This month", p: m.periods.month, vs: "vs last month" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Store overview
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live
            {updated &&
              `, updated ${updated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            aria-label="Refresh"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#256abf]"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setUnread(0)}
            aria-label={`${unread} new orders`}
            className="relative rounded-md p-2 text-slate-500 hover:bg-slate-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#256abf]"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-[#eb6834] px-1 text-center text-[10px] font-semibold leading-4 text-white">
                {unread}
              </span>
            )}
          </button>
          <div
            className="inline-flex rounded-md bg-slate-200/70 p-0.5"
            role="group"
            aria-label="Date range"
          >
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`rounded px-3 py-1 text-xs font-medium ${range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                {r} days
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-12">
        {cards.map(({ label, p, vs }) => (
          <Panel
            key={label}
            title={label}
            className="lg:col-span-3"
            aside={<Delta now={p.revenue} before={p.prevRevenue} />}
          >
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
              {formatPrice(p.revenue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {p.orders != null
                ? `${p.orders.toLocaleString()} orders`
                : "sales"}
              <span className="text-slate-400"> · {vs}</span>
            </p>
          </Panel>
        ))}
        <Panel title="Needs attention" className="lg:col-span-3">
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {pending}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            orders to process
            {data.lowStock
              ? `, ${data.lowStock.length} products low on stock`
              : ""}
          </p>
        </Panel>

        <Panel
          className="lg:col-span-8 sm:col-span-2"
          title={`Revenue, last ${range} days`}
          aside={`${formatPrice(m.rangeRevenue)} total`}
        >
          {m.rangeRevenue === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              No revenue in this period yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={270}>
              <ComposedChart
                data={m.chart}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#eef0f3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => day(v)}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.max(0, Math.ceil(m.chart.length / 8) - 1)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                  }
                />
                <Tooltip
                  labelFormatter={(v) => day(String(v), true)}
                  formatter={(v) => formatPrice(Number(v ?? 0))}
                />
                <Bar
                  dataKey="Revenue"
                  fill="#cde2fb"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={18}
                />
                <Line
                  dataKey="7-day average"
                  type="monotone"
                  stroke="#eb6834"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel
          className="lg:col-span-4 sm:col-span-2"
          title="At a glance"
          aside="all time"
        >
          <Row label="Revenue" value={formatPrice(data.totalRevenue)} />
          <Row
            label="Orders"
            value={data.totalOrders.toLocaleString()}
            note={`${formatPrice(aov)} average order`}
          />
          <Row
            label="Customers"
            value={data.totalCustomers.toLocaleString()}
            note={`${data.totalCustomers ? (data.totalOrders / data.totalCustomers).toFixed(1) : 0} orders each`}
          />
          <Row
            label="Published products"
            value={data.totalProducts.toLocaleString()}
          />
          <Row
            label="Best day in range"
            value={formatPrice(m.best.revenue)}
            note={m.best.date ? day(m.best.date, true) : undefined}
          />
          <Row
            label="Daily average"
            value={formatPrice(m.rangeRevenue / Math.max(1, m.days))}
          />
        </Panel>

        <Panel
          className="lg:col-span-4"
          title="Orders by status"
          aside={`${m.orderTotal.toLocaleString()} orders`}
        >
          <Donut
            center="orders"
            items={STATUSES.map((s) => ({
              name: s.label,
              value: m.st.get(s.key) ?? 0,
              color: s.color,
            }))}
          />
        </Panel>

        <Panel
          className="lg:col-span-4"
          title="Best sellers"
          aside="units sold"
        >
          {data.topProducts.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              No sales yet.
            </p>
          ) : (
            <ol>
              {data.topProducts.map((p, i) => (
                <li
                  key={p.name}
                  className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-3 border-b border-slate-100 py-2 last:border-0"
                >
                  <span className="text-xs tabular-nums text-slate-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-800">{p.name}</p>
                    <div className="mt-1.5 h-1 rounded-full bg-slate-100">
                      <div
                        className="h-1 rounded-full bg-[#eb6834]"
                        style={{ width: `${(p.quantity / m.topMax) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {p.quantity.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        {data.revenueByCategory?.length ? (
          <Panel className="lg:col-span-4" title="Revenue by category">
            <Donut
              money
              center="revenue"
              items={data.revenueByCategory.map((c, i) => ({
                name: c.name,
                value: c.revenue,
                color: PALETTE[i % PALETTE.length],
              }))}
            />
          </Panel>
        ) : data.lowStock?.length ? (
          <Panel
            className="lg:col-span-4"
            title="Running low"
            aside="units left"
          >
            {data.lowStock.map((p) => (
              <Row key={p.name} label={p.name} value={String(p.stock)} />
            ))}
          </Panel>
        ) : (
          <div className="hidden bg-white lg:col-span-4 lg:block" />
        )}

        {data.recentOrders && (
          <Panel
            className="lg:col-span-12 sm:col-span-2"
            title="Recent orders"
            aside={`${m.orders.length} shown`}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {[{ key: "ALL", label: "All" }, ...STATUSES].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  aria-pressed={statusFilter === s.key}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusFilter === s.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {s.label}
                </button>
              ))}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customer or order"
                className="ml-auto w-56 rounded-md border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-[#256abf]"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-400">
                  <tr>
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Total</th>
                    <th className="pb-2 text-right font-medium">Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {m.orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-400"
                      >
                        No orders match these filters.
                      </td>
                    </tr>
                  )}
                  {m.orders.map((o) => {
                    const s = STATUSES.find((x) => x.key === o.status);
                    return (
                      <tr key={o.id} className="border-t border-slate-100">
                        <td className="py-2 tabular-nums text-slate-500">
                          #{o.id.slice(-6)}
                        </td>
                        <td className="py-2 text-slate-800">{o.customer}</td>
                        <td className="py-2">
                          <span className="inline-flex items-center gap-1.5 text-slate-600">
                            <i
                              className="h-2 w-2 rounded-full"
                              style={{ background: s?.color }}
                            />
                            {s?.label ?? o.status}
                          </span>
                        </td>
                        <td className="py-2 text-right font-medium tabular-nums text-slate-900">
                          {formatPrice(o.total)}
                        </td>
                        <td className="py-2 text-right tabular-nums text-slate-400">
                          {ago(o.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>

      {/* New order notifications */}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((o) => (
          <div
            key={o.id}
            className="pointer-events-auto rounded-md border-l-4 border-[#eb6834] bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
          >
            <p className="font-medium">New order, {formatPrice(o.total)}</p>
            <p className="text-xs text-slate-300">
              {o.customer} · #{o.id.slice(-6)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
