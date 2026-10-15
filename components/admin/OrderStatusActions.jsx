"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
export function OrderStatusActions({ orderId, status, returnRequested, onUpdated, }) {
    const showToast = useToast();
    const [showShipForm, setShowShipForm] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [courierName, setCourierName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [customCancelReason, setCustomCancelReason] = useState("");
    async function patchStatus(body, successMessage) {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                const message = json.message ?? "Update failed";
                setError(message);
                showToast(message, "error");
                return false;
            }
            showToast(successMessage, "success");
            onUpdated();
            return true;
        }
        catch (error) {
            const message = "Something went wrong. Please try again.";
            setError(message);
            showToast(message, "error");
            return false;
        }
        finally {
            setIsSubmitting(false);
        }
    }
    async function patchReturn(action) {
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
    async function handleCancelOrder() {
        const finalReason = cancelReason === "Other" ? customCancelReason.trim() : cancelReason;
        if (!finalReason) {
            showToast(cancelReason === "Other"
                ? "Please enter a cancellation reason"
                : "Please select a cancellation reason", "error");
            return;
        }
        const success = await patchStatus({
            status: "CANCELLED",
            note: finalReason,
        }, "Order cancelled");
        if (!success)
            return;
        setCancelReason("");
        setCustomCancelReason("");
        setShowCancelModal(false);
    }
    // async function handleShipSubmit(e: React.FormEvent) {
    //   e.preventDefault();
    //   await patchStatus(
    //     { status: "SHIPPED", trackingNumber, courierName },
    //     "Order marked as shipped",
    //   );
    //   setShowShipForm(false);
    // }
    async function handleShipSubmit(e) {
        e.preventDefault();
        const success = await patchStatus({
            status: "SHIPPED",
            trackingNumber,
            courierName,
        }, "Order marked as shipped");
        if (success) {
            setShowShipForm(false);
        }
    }
    const CANCELLATION_REASONS = [
        "Customer requested cancellation",
        "Customer changed their mind",
        "Payment issue",
        "Product is out of stock",
        "Unable to fulfill the order",
        "Incorrect or incomplete shipping information",
        "Duplicate order",
        "Other",
    ];
    return (<div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {status === "PROCESSING" && (<div className="flex min-w-0 flex-col gap-3">
          {showShipForm ? (<form onSubmit={handleShipSubmit} className="flex w-full min-w-0 flex-col gap-3 overflow-hidden rounded-lg border border-gray-200 p-3">
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="min-w-0">
                  <Input label="Courier Name" value={courierName} onChange={(e) => setCourierName(e.target.value)} required className="w-full"/>
                </div>
                <div className="min-w-0">
                  <Input label="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} required className="w-full"/>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button type="submit" variant="admin" size="sm" isLoading={isSubmitting} className="w-full shrink-0 sm:w-auto">
                  Confirm Shipment
                </Button>
                <Button type="button" variant="adminOutline" size="sm" onClick={() => setShowShipForm(false)} className="w-full shrink-0 sm:w-auto">
                  Cancel
                </Button>
              </div>
            </form>) : (<Button variant="admin" size="sm" onClick={() => setShowShipForm(true)} className="w-full sm:w-auto">
              Mark as Shipped
            </Button>)}

          <Button variant="danger" size="sm" isLoading={isSubmitting} onClick={() => setShowCancelModal(true)} className="w-full sm:w-auto">
            Cancel Order
          </Button>
        </div>)}

      {status === "SHIPPED" && (<Button variant="admin" size="sm" isLoading={isSubmitting} className="w-full sm:w-auto" onClick={() => patchStatus({ status: "DELIVERED" }, "Order marked as delivered")}>
          Mark as Delivered
        </Button>)}

      {status === "DELIVERED" && returnRequested && (<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <Button variant="admin" size="sm" isLoading={isSubmitting} className="w-full sm:w-auto" onClick={() => patchReturn("approve")}>
            Approve Return
          </Button>
          <Button variant="danger" size="sm" isLoading={isSubmitting} className="w-full sm:w-auto" onClick={() => patchReturn("reject")}>
            Reject Return
          </Button>
        </div>)}

      {(status === "RETURNED" ||
            status === "CANCELLED" ||
            (status === "DELIVERED" && !returnRequested)) && (<p className="text-sm text-gray-500">
          No further actions available for this order.
        </p>)}

      <ConfirmModal open={showCancelModal} title="Cancel Order" message="Please select a reason for cancelling this order." confirmText="Cancel Order" cancelText="Keep Order" variant="danger" isLoading={isSubmitting} onCancel={() => {
            if (isSubmitting)
                return;
            setCancelReason("");
            setCustomCancelReason("");
            setShowCancelModal(false);
        }} onConfirm={handleCancelOrder}>
        <div className="space-y-3">
          <div className="space-y-2">
            {CANCELLATION_REASONS.map((reason) => (<label key={reason} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${cancelReason === reason
                ? "border-red-500 bg-red-50 dark:border-red-500/70 dark:bg-red-500/10"
                : "border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"}`}>
                <input type="radio" name="cancellation-reason" value={reason} checked={cancelReason === reason} onChange={(e) => setCancelReason(e.target.value)} disabled={isSubmitting} className="h-4 w-4 accent-red-600"/>

                <span className="text-sm text-gray-700 dark:text-slate-300">
                  {reason}
                </span>
              </label>))}
          </div>

          {cancelReason === "Other" && (<div className="pt-1">
              <label htmlFor="custom-cancel-reason" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Please specify the reason
              </label>

              <textarea id="custom-cancel-reason" value={customCancelReason} onChange={(e) => setCustomCancelReason(e.target.value)} placeholder="Enter cancellation reason..." rows={3} disabled={isSubmitting} autoFocus className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800"/>
            </div>)}
        </div>
      </ConfirmModal>
    </div>);
}
