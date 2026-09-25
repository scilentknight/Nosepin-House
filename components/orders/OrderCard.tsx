"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReviewForm } from "@/components/orders/ReviewForm";
import { OrderStatusTimeline } from "@/components/orders/OrderStatusTimeline";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice, formatDate } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

interface OrderItem {
  id: string;
  productId: string;
  productSlug: string | null;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  reviewed: boolean;
}

interface HistoryEntry {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELLED";
  placedAt: string;
  total: number;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  trackingNumber: string | null;
  courierName: string | null;
  returnRequested: boolean;
  returnReason: string | null;
  refunded: boolean;
  items: OrderItem[];
  history: HistoryEntry[];
}

const CANCEL_REASONS = [
  "I placed the order by mistake",
  "I ordered the wrong product",
  "I want to change the product / variant",
  "I want to change the quantity",
  "I entered the wrong delivery address",
  "I found a better price elsewhere",
  "I no longer need the product",
  "I changed my mind",
  "Delivery is taking too long",
  "Payment-related issue",
  "I want to place a new order",
  "Other",
];

export function OrderCard({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const showToast = useToast();
  const [showTimeline, setShowTimeline] = useState(false);
  const [reviewingItemId, setReviewingItemId] = useState<string | null>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherText, setCancelOtherText] = useState("");
  const [localStatus, setLocalStatus] = useState<Order["status"] | null>(null);
  const [localCancelNote, setLocalCancelNote] = useState<string | null>(null);
  const [localReturnRequested, setLocalReturnRequested] = useState(false);

  const status = localStatus ?? order.status;
  const returnRequested = localReturnRequested || order.returnRequested;
  const cancelNote =
    localCancelNote ?? [...order.history].reverse().find((h) => h.status === "CANCELLED")?.note;

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    const reason = cancelReason === "Other" ? cancelOtherText.trim() : cancelReason;
    setIsSubmitting(true);
    setError(null);
    const res = await fetch(`/api/orders/${order.id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    setIsSubmitting(false);
    if (!res.ok) {
      const message = json.message ?? "Could not cancel order";
      setError(message);
      showToast(message, "error");
      return;
    }
    setShowCancelForm(false);
    setLocalStatus("CANCELLED");
    setLocalCancelNote(reason ? `Cancelled by customer: ${reason}` : "Cancelled by customer");
    showToast("Order cancelled successfully", "success");
    onChanged();
  }

  async function handleRequestReturn(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const res = await fetch(`/api/orders/${order.id}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: returnReason }),
    });
    const json = await res.json();
    setIsSubmitting(false);
    if (!res.ok) {
      const message = json.message ?? "Could not submit return request";
      setError(message);
      showToast(message, "error");
      return;
    }
    setShowReturnForm(false);
    setLocalReturnRequested(true);
    showToast("Return request submitted", "success");
    onChanged();
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">Placed {formatDate(order.placedAt)}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <ul className="mt-4 divide-y divide-gray-50 text-sm">
        {order.items.map((item) =>
          item.productSlug ? (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              <Link href={`/product/${item.productSlug}`} className="shrink-0 w-12">
                <ProductImage src={item.image} alt={item.name} />
              </Link>
              <Link href={`/product/${item.productSlug}`} className="min-w-0 flex-1 truncate text-gray-800 hover:text-primary-600">
                {item.name} × {item.quantity}
              </Link>
              <span className="shrink-0 text-gray-600">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ) : (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              <span className="shrink-0 w-12">
                <ProductImage src={item.image} alt={item.name} />
              </span>
              <span className="min-w-0 flex-1 truncate text-gray-500">{item.name} × {item.quantity}</span>
              <span className="shrink-0 text-gray-600">{formatPrice(item.price * item.quantity)}</span>
            </li>
          )
        )}
      </ul>

      <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>

      <a
        href={`/api/orders/${order.id}/invoice`}
        className="mt-3 inline-block text-xs font-medium text-primary-600 hover:underline"
      >
        Download Invoice
      </a>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 space-y-3">
        {status === "PROCESSING" && (
          showCancelForm ? (
            <form onSubmit={handleCancel} className="space-y-3 rounded-lg border border-gray-200 p-3">
              <p className="text-sm font-medium text-gray-900">Why do you want to cancel this order?</p>
              <div className="space-y-1.5">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`cancel-reason-${order.id}`}
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      required
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-400"
                    />
                    {reason}
                  </label>
                ))}
              </div>
              {cancelReason === "Other" && (
                <textarea
                  value={cancelOtherText}
                  onChange={(e) => setCancelOtherText(e.target.value)}
                  placeholder="Please specify your reason"
                  rows={2}
                  required
                  minLength={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-400"
                />
              )}
              <div className="flex gap-2">
                <Button type="submit" variant="danger" size="sm" isLoading={isSubmitting}>
                  Confirm Cancellation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCancelForm(false);
                    setCancelReason("");
                    setCancelOtherText("");
                  }}
                >
                  Keep Order
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setShowCancelForm(true)}>
              Cancel Order
            </Button>
          )
        )}

        {status === "SHIPPED" && (
          <div className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">
            {order.courierName || order.trackingNumber
              ? `Shipped via ${order.courierName ?? "courier"}${order.trackingNumber ? ` — Tracking #${order.trackingNumber}` : ""}`
              : "Preparing for dispatch"}
          </div>
        )}

        {status === "DELIVERED" && (
          <div className="space-y-3">
            {order.items
              .filter((item) => !item.reviewed)
              .map((item) => (
                <div key={item.id}>
                  {reviewingItemId === item.id ? (
                    <ReviewForm
                      orderItemId={item.id}
                      onSubmitted={() => {
                        setReviewingItemId(null);
                        onChanged();
                      }}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReviewingItemId(item.id)}
                    >
                      Leave a Review for &quot;{item.name}&quot;
                    </Button>
                  )}
                </div>
              ))}

            {returnRequested ? (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Return requested — pending admin review.
              </p>
            ) : showReturnForm ? (
              <form onSubmit={handleRequestReturn} className="space-y-2 rounded-lg border border-gray-200 p-3">
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Why are you returning this order?"
                  rows={2}
                  required
                  minLength={5}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-400"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" isLoading={isSubmitting}>
                    Submit Request
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowReturnForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowReturnForm(true)}>
                Request Return
              </Button>
            )}
          </div>
        )}

        {status === "RETURNED" && (
          <div className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-800">
            {order.returnReason && <p>Reason: {order.returnReason}</p>}
            <p>{order.refunded ? "Refund processed." : "Refund pending."}</p>
          </div>
        )}

        {status === "CANCELLED" && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {cancelNote && <p>Reason: {cancelNote}</p>}
            {order.paymentStatus === "PAID" && <p>{order.refunded ? "Refund processed." : "Refund pending."}</p>}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowTimeline((v) => !v)}
        className="mt-4 text-xs font-medium text-primary-600 hover:underline"
      >
        {showTimeline ? "Hide" : "View"} order timeline
      </button>
      {showTimeline && (
        <div className="mt-3">
          <OrderStatusTimeline history={order.history} />
        </div>
      )}
    </div>
  );
}
