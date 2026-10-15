"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";

const RANGES = [7, 30, 90];

function dateKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pctChange(now, before) {
  if (before == null || before === 0) {
    if (!now) return { text: "same as last period", up: null };
    return { text: "no prior sales", up: null };
  }
  const value = ((now - before) / before) * 100;
  const rounded = Math.abs(value).toFixed(0);
  return {
    text: `${value >= 0 ? "+" : "−"}${rounded}% vs last period`,
    up: value >= 0,
  };
}

function weekdayLong(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function shortDay(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function placedAgo(value) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} hr ago`;
  const days = Math.round(mins / 1440);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

function payLabel(method) {
  return method === "COD" ? "COD" : "Online";
}

function Thumb({ src, name }) {
  if (!src) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0f2747]/8 text-[10px] font-semibold uppercase tracking-wide text-[#0f2747]">
        {name.slice(0, 2)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className="h-10 w-10 shrink-0 rounded-md object-cover"
    />
  );
}

function Card({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white p-5 shadow-soft ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [range, setRange] = useState(30);
  const [updated, setUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const json = await (await fetch(`/api/admin/dashboard?range=${range}`)).json();
      const payload = json.data ?? null;
      if (!payload) throw new Error("empty");
      setData(payload);
      setState("ready");
      setUpdated(new Date());
    } catch {
      setState((current) => (current === "ready" ? current : "error"));
    } finally {
      setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const chartMax = useMemo(() => {
    if (!data?.revenueByDay?.length) return 1;
    return Math.max(1, ...data.revenueByDay.map((d) => d.revenue));
  }, [data]);

  const categoryMax = useMemo(() => {
    if (!data?.categoryRevenue?.length) return 1;
    return Math.max(1, ...data.categoryRevenue.map((c) => c.revenue));
  }, [data]);

  const topMax = useMemo(() => {
    if (!data?.topProducts?.length) return 1;
    return Math.max(1, ...data.topProducts.map((p) => p.revenue));
  }, [data]);

  if (state === "loading") {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-gray-200 bg-white" />
          ))}
        </div>
        <div className="h-64 rounded-xl border border-gray-200 bg-white" />
      </div>
    );
  }

  if (state === "error" || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-soft">
        Could not load the desk.{" "}
        <button type="button" onClick={load} className="font-semibold underline">
          Try again
        </button>
      </div>
    );
  }

  const { kpis, work } = data;
  const rangeDelta = pctChange(kpis.rangeRevenue, kpis.prevRangeRevenue);
  const todayDelta = pctChange(kpis.todayRevenue, kpis.yesterdayRevenue);
  const paymentTotal = data.paymentMix.reduce((sum, row) => sum + row.revenue, 0);
  const desk = [
    {
      label: "To pack",
      value: work.processing,
      hint: "Processing orders",
      href: "/admin/orders",
    },
    {
      label: "COD to collect",
      value: work.codUnpaid,
      hint: "Cash on delivery, still unpaid",
      href: "/admin/orders",
    },
    {
      label: "In transit",
      value: work.shipped,
      hint: "Shipped, not delivered",
      href: "/admin/orders",
    },
    {
      label: "Reviews waiting",
      value: work.pendingReviews,
      hint: "Customer photos & notes",
      href: "/admin/reviews",
    },
    {
      label: "Returns",
      value: work.returnRequested,
      hint: "Open return requests",
      href: "/admin/orders",
    },
    {
      label: "Stock alerts",
      value: work.lowStock,
      hint: work.outOfStock ? `${work.outOfStock} sold out` : "At or below alert",
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{weekdayLong()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={refreshing}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          {updated && (
            <span className="text-xs text-gray-400">
              {updated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {RANGES.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRange(days)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                  range === days
                    ? "bg-[#0f2747] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
        {desk.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-soft transition-colors hover:border-[#eb6834]/40"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0f2747]">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-gray-400">{item.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card
          className="lg:col-span-8"
          title={`Sales, last ${range} days`}
          action={
            <span className={`text-xs ${rangeDelta.up === false ? "text-red-600" : "text-gray-500"}`}>
              {formatPrice(kpis.rangeRevenue)} · {rangeDelta.text}
            </span>
          }
        >
          <div className="mb-4 flex flex-wrap gap-8">
            <div>
              <p className="text-xs text-gray-500">Today</p>
              <p className="text-xl font-semibold tabular-nums text-gray-900">
                {formatPrice(kpis.todayRevenue)}
              </p>
              <p className="text-xs text-gray-400">
                {kpis.todayOrders} order{kpis.todayOrders === 1 ? "" : "s"} · {todayDelta.text}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Average order</p>
              <p className="text-xl font-semibold tabular-nums text-gray-900">
                {formatPrice(kpis.rangeAov)}
              </p>
              <p className="text-xs text-gray-400">
                {kpis.rangeOrders} paid orders in range
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">New customers</p>
              <p className="text-xl font-semibold tabular-nums text-gray-900">
                {kpis.newCustomers}
              </p>
              <p className="text-xs text-gray-400">{kpis.customers} on file</p>
            </div>
          </div>

          {kpis.rangeRevenue === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">
              No billed orders in this window.
            </p>
          ) : (
            <div className="flex h-36 items-end gap-[3px]">
              {data.revenueByDay.map((day) => {
                const height = Math.max(day.revenue ? 8 : 2, (day.revenue / chartMax) * 100);
                const isToday = day.date === dateKeyLocal();
                return (
                  <div
                    key={day.date}
                    title={`${shortDay(day.date)} · ${formatPrice(day.revenue)} · ${day.orders} orders`}
                    className={`flex-1 rounded-sm ${isToday ? "bg-[#eb6834]" : "bg-[#0f2747]/80"}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          )}
          <div className="mt-2 flex justify-between text-[11px] text-gray-400">
            <span>{data.revenueByDay[0] ? shortDay(data.revenueByDay[0].date) : ""}</span>
            <span>Today in orange</span>
            <span>
              {data.revenueByDay.at(-1)
                ? shortDay(data.revenueByDay.at(-1).date)
                : ""}
            </span>
          </div>
        </Card>

        <Card title="How they paid" className="lg:col-span-4">
          {data.paymentMix.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No payments in range.</p>
          ) : (
            <ul className="space-y-4">
              {data.paymentMix.map((row) => {
                const share = paymentTotal ? (row.revenue / paymentTotal) * 100 : 0;
                return (
                  <li key={row.method}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-gray-800">{payLabel(row.method)}</span>
                      <span className="tabular-nums text-gray-900">{formatPrice(row.revenue)}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full ${row.method === "COD" ? "bg-[#eb6834]" : "bg-[#0f2747]"}`}
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {row.orders} orders · {share.toFixed(0)}%
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <dl className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">All-time sales</dt>
              <dd className="tabular-nums font-medium text-gray-900">
                {formatPrice(kpis.lifetimeRevenue)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">All orders</dt>
              <dd className="tabular-nums font-medium text-gray-900">
                {kpis.lifetimeOrders.toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Lifetime AOV</dt>
              <dd className="tabular-nums font-medium text-gray-900">
                {formatPrice(kpis.lifetimeAov)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Catalogue</dt>
              <dd className="tabular-nums font-medium text-gray-900">
                {kpis.publishedProducts} live
                {kpis.draftProducts ? ` · ${kpis.draftProducts} draft` : ""}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card
          className="lg:col-span-5"
          title="Packing queue"
          action={
            <Link href="/admin/orders" className="text-xs font-medium text-[#eb6834] hover:underline">
              All orders
            </Link>
          }
        >
          {data.packingQueue.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No processing orders right now.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.packingQueue.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center gap-3 py-2.5 hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {order.customer} · {order.itemCount} pc
                        {order.itemCount === 1 ? "" : "s"} · {payLabel(order.paymentMethod)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm tabular-nums text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-[11px] text-gray-400">{placedAgo(order.placedAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          className="lg:col-span-7"
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-xs font-medium text-[#eb6834] hover:underline">
              View all
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="w-[28%] pb-2 pr-3 font-medium">Order</th>
                  <th className="w-[20%] pb-2 pr-3 font-medium">Customer</th>
                  <th className="w-[20%] pb-2 pr-3 font-medium">Pay</th>
                  <th className="w-[14%] pb-2 pr-3 font-medium">Status</th>
                  <th className="w-[18%] pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="py-3 pr-3 align-middle">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="block truncate font-medium text-[#0f2747] hover:underline"
                        title={order.orderNumber}
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-[11px] text-gray-400">{placedAgo(order.placedAt)}</p>
                    </td>
                    <td className="truncate py-3 pr-3 align-middle text-gray-800" title={order.customer}>
                      {order.customer}
                    </td>
                    <td className="py-3 pr-3 align-middle">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xs text-gray-600">{payLabel(order.paymentMethod)}</span>
                        <StatusBadge status={order.paymentStatus} />
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-middle whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 align-middle text-right font-medium tabular-nums whitespace-nowrap text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card
          className="lg:col-span-5"
          title="Pieces that sold"
          action={<span className="text-xs text-gray-400">by revenue, this range</span>}
        >
          {data.topProducts.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No line items yet.</p>
          ) : (
            <ol className="space-y-3">
              {data.topProducts.map((product, index) => (
                <li key={`${product.productId ?? product.name}-${index}`} className="flex items-center gap-3">
                  <Thumb src={product.image} name={product.name} />
                  <div className="min-w-0 flex-1">
                    {product.productId ? (
                      <Link
                        href={`/admin/products/${product.productId}`}
                        className="block truncate text-sm font-medium text-gray-900 hover:underline"
                      >
                        {product.name}
                      </Link>
                    ) : (
                      <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                    )}
                    <div className="mt-1.5 h-1 rounded-full bg-gray-100">
                      <div
                        className="h-1 rounded-full bg-[#eb6834]"
                        style={{ width: `${(product.revenue / topMax) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm tabular-nums font-medium text-gray-900">
                      {formatPrice(product.revenue)}
                    </p>
                    <p className="text-[11px] text-gray-400">{product.quantity} sold</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card className="lg:col-span-3" title="By category">
          {data.categoryRevenue.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No category mix yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.categoryRevenue.map((row) => (
                <li key={row.name}>
                  <div className="flex justify-between text-sm">
                    <span className="truncate pr-2 text-gray-700">{row.name}</span>
                    <span className="tabular-nums text-gray-900">{formatPrice(row.revenue)}</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-gray-100">
                    <div
                      className="h-1 rounded-full bg-[#0f2747]"
                      style={{ width: `${(row.revenue / categoryMax) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          className="lg:col-span-4"
          title="Saved on wishlists"
          action={<span className="text-xs text-gray-400">demand, not yet billed</span>}
        >
          {data.wishlistHeat.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No saved pieces.</p>
          ) : (
            <ul className="space-y-3">
              {data.wishlistHeat.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <Thumb src={item.image} name={item.name} />
                  <p className="min-w-0 flex-1 truncate text-sm text-gray-800">{item.name}</p>
                  <span className="text-sm tabular-nums font-medium text-gray-900">
                    {item.saves}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        title="Stock to watch"
        action={
          <Link href="/admin/products" className="text-xs font-medium text-[#eb6834] hover:underline">
            Catalogue
          </Link>
        }
      >
        {data.lowStock.length === 0 ? (
          <p className="text-sm text-gray-400">Every published piece is above its alert.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="pb-2 font-medium">Piece</th>
                  <th className="pb-2 font-medium">SKU</th>
                  <th className="pb-2 text-right font-medium">On hand</th>
                  <th className="pb-2 text-right font-medium">Alert at</th>
                </tr>
              </thead>
              <tbody>
                {data.lowStock.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100">
                    <td className="py-2.5">
                      <div className="flex items-center gap-3">
                        <Thumb src={product.image} name={product.name} />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-500">{product.sku ?? "—"}</td>
                    <td
                      className={`py-2.5 text-right tabular-nums font-semibold ${
                        product.out ? "text-red-600" : "text-[#eb6834]"
                      }`}
                    >
                      {product.out ? "Sold out" : product.stock}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-gray-500">{product.alert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
