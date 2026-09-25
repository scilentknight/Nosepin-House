"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderFilterBar, EMPTY_FILTERS, type OrderFilters } from "@/components/admin/OrderFilterBar";
import { formatPrice, formatDate } from "@/lib/format";

interface AdminOrderRow {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  itemCount: number;
  placedAt: string;
}

export default function AdminOrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus);
      if (filters.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      fetch(`/api/admin/orders?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          setOrders(json.data?.orders ?? []);
          setTotal(json.data?.total ?? 0);
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function paymentMethodLabel(method: string) {
    return method === "COD" ? "COD" : "eSewa";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>

      <div className="mt-5">
        <OrderFilterBar
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-soft">
          Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-soft">
          No orders found.
        </div>
      ) : (
        <>
          {/* Card list — small screens */}
          <div className="mt-5 space-y-3 md:hidden">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow-soft transition-shadow hover:shadow-soft-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-gray-800">{order.fullName}</p>
                <p className="text-xs text-gray-500">{order.email}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {formatDate(order.placedAt)} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                  </span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={order.paymentStatus} />
                  <span className="text-xs text-gray-500">{paymentMethodLabel(order.paymentMethod)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Table — medium screens and up */}
          <div className="mt-5 hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-soft md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-sky-600 hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{order.fullName}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(order.placedAt)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.itemCount}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.paymentStatus} />{" "}
                      <span className="text-xs text-gray-500">{paymentMethodLabel(order.paymentMethod)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-gray-600 sm:flex-row">
        <span>
          Page {page} of {totalPages} · {total} order{total === 1 ? "" : "s"}
        </span>
        <div className="flex gap-2">
          <Button variant="adminOutline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button variant="adminOutline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
