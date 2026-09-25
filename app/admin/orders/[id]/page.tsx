"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { OrderStatusTimeline } from "@/components/orders/OrderStatusTimeline";
import { OrderStatusActions } from "@/components/admin/OrderStatusActions";
import { formatPrice, formatDate } from "@/lib/format";

interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELLED";
  placedAt: string;
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  taxLabel: string | null;
  total: number;
  paymentMethod: string;
  paymentSubMethod: string | null;
  paymentStatus: string;
  trackingNumber: string | null;
  courierName: string | null;
  returnRequested: boolean;
  returnReason: string | null;
  refunded: boolean;
  user: { name: string; email: string; phone: string | null };
  items: { id: string; name: string; price: number; quantity: number }[];
  history: { id: string; status: string; note: string | null; createdAt: string }[];
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/admin/orders/${params.id}`);
    const json = await res.json();
    setOrder(res.ok ? json.data : null);
    setIsLoading(false);
  }

  useEffect(() => {
    async function loadOnMount() {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const json = await res.json();
      setOrder(res.ok ? json.data : null);
      setIsLoading(false);
    }
    loadOnMount();
  }, [params.id]);

  if (isLoading) return <p className="text-gray-500">Loading order…</p>;
  if (!order) return <p className="text-gray-500">Order not found.</p>;

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-sky-600 hover:underline">
        ← Back to Orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/admin/orders/${order.id}/invoice?mode=preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Preview Invoice
          </a>
          <a
            href={`/api/admin/orders/${order.id}/invoice`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Download Invoice
          </a>
          <StatusBadge status={order.status} />
        </div>
      </div>
      <p className="text-sm text-gray-500">Placed {formatDate(order.placedAt)}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Items</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Product</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 text-gray-800">{item.name}</td>
                      <td className="py-2 text-gray-600">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-600">{formatPrice(item.price)}</td>
                      <td className="py-2 text-right text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-accent-700">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : "Free"}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{order.taxLabel ?? "Tax"}</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Manage Status</h2>
            <div className="mt-3">
              <OrderStatusActions
                orderId={order.id}
                status={order.status}
                returnRequested={order.returnRequested}
                onUpdated={load}
              />
            </div>
            {order.returnRequested && order.returnReason && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Return reason: {order.returnReason}
              </p>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order Timeline</h2>
            <div className="mt-3">
              <OrderStatusTimeline history={order.history} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</h2>
            <p className="mt-2 text-gray-800">{order.user.name}</p>
            <p className="text-gray-500">{order.user.email}</p>
            {order.user.phone && <p className="text-gray-500">{order.user.phone}</p>}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipping Address</h2>
            <p className="mt-2 text-gray-800">{order.fullName}</p>
            <p className="text-gray-600">
              {order.line1}
              {order.line2 ? `, ${order.line2}` : ""}
            </p>
            <p className="text-gray-600">
              {order.city}, {order.state}{order.postalCode ? ` ${order.postalCode}` : ""}, {order.country}
            </p>
            <p className="text-gray-500">
              {order.phone} · {order.email}
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</h2>
            <div className="mt-2 flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="text-gray-900">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "eSewa"}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
            {order.refunded && (
              <div className="mt-1 flex justify-between">
                <span className="text-gray-500">Refund</span>
                <span className="text-gray-900">Processed</span>
              </div>
            )}
            {(order.trackingNumber || order.courierName) && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="text-gray-500">Tracking</p>
                <p className="text-gray-900">
                  {order.courierName} — {order.trackingNumber}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
