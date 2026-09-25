"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

export function OrderStatusActions({
  orderId,
  status,
  returnRequested,
  onUpdated,
}: {
  orderId: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELLED";
  returnRequested: boolean;
  onUpdated: () => void;
}) {
  const showToast = useToast();
  const [showShipForm, setShowShipForm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patchStatus(body: Record<string, unknown>, successMessage: string) {
    setIsSubmitting(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setIsSubmitting(false);
    if (!res.ok) {
      const message = json.message ?? "Update failed";
      setError(message);
      showToast(message, "error");
      return;
    }
    showToast(successMessage, "success");
    onUpdated();
  }

  async function patchReturn(action: "approve" | "reject") {
    setIsSubmitting(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/return`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    setIsSubmitting(false);
    if (!res.ok) {
      const message = json.message ?? "Update failed";
      setError(message);
      showToast(message, "error");
      return;
    }
    showToast(action === "approve" ? "Return approved" : "Return rejected", "success");
    onUpdated();
  }

  async function handleShipSubmit(e: React.FormEvent) {
    e.preventDefault();
    await patchStatus({ status: "SHIPPED", trackingNumber, courierName }, "Order marked as shipped");
    setShowShipForm(false);
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {status === "PROCESSING" && (
        <div className="flex flex-wrap gap-3">
          {showShipForm ? (
            <form onSubmit={handleShipSubmit} className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-end">
              <Input label="Courier Name" value={courierName} onChange={(e) => setCourierName(e.target.value)} required />
              <Input label="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} required />
              <div className="flex gap-2">
                <Button type="submit" variant="admin" size="sm" isLoading={isSubmitting}>
                  Confirm Shipment
                </Button>
                <Button type="button" variant="adminOutline" size="sm" onClick={() => setShowShipForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="admin" size="sm" onClick={() => setShowShipForm(true)}>
              Mark as Shipped
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => {
              const note = prompt("Reason for cancelling (optional):") ?? undefined;
              patchStatus({ status: "CANCELLED", note }, "Order cancelled");
            }}
          >
            Cancel Order
          </Button>
        </div>
      )}

      {status === "SHIPPED" && (
        <Button variant="admin" size="sm" isLoading={isSubmitting} onClick={() => patchStatus({ status: "DELIVERED" }, "Order marked as delivered")}>
          Mark as Delivered
        </Button>
      )}

      {status === "DELIVERED" && returnRequested && (
        <div className="flex flex-wrap gap-3">
          <Button variant="admin" size="sm" isLoading={isSubmitting} onClick={() => patchReturn("approve")}>
            Approve Return
          </Button>
          <Button variant="danger" size="sm" isLoading={isSubmitting} onClick={() => patchReturn("reject")}>
            Reject Return
          </Button>
        </div>
      )}

      {(status === "RETURNED" || status === "CANCELLED" || (status === "DELIVERED" && !returnRequested)) && (
        <p className="text-sm text-gray-500">No further actions available for this order.</p>
      )}
    </div>
  );
}
