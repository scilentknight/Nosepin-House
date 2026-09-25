"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderCard, type Order } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/Button";

const TABS: { label: string; value: Order["status"] | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Returned", value: "RETURNED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Order["status"] | "ALL">("ALL");

  async function load() {
    const res = await fetch("/api/orders");
    const json = await res.json();
    setOrders(json.data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    async function loadOnMount() {
      const res = await fetch("/api/orders");
      const json = await res.json();
      setOrders(json.data ?? []);
      setIsLoading(false);
    }
    loadOnMount();
  }, []);

  const filtered = tab === "ALL" ? orders : orders.filter((o) => o.status === tab);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading your orders…</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>

      <div className="mt-5 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.value ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center text-gray-500">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 7h18M6 7V5a1 1 0 011-1h10a1 1 0 011 1v2m2 0-1.2 13.2a1.6 1.6 0 01-1.6 1.4H5.8a1.6 1.6 0 01-1.6-1.4L3 7z" />
          </svg>
          <p>No orders here yet.</p>
          <Link href="/shop" className="mt-1 inline-block">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
