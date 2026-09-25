"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

interface CheckoutDraft {
  addressId?: string;
  address?: Record<string, string>;
  saveAddress?: boolean;
  couponCode?: string | null;
  discount?: number;
  subtotal?: number;
  shippingFee?: number;
  shippingLabel?: string | null;
  tax?: number;
  taxLabel?: string | null;
}

const DRAFT_KEY = "bikesh-checkout-draft";

interface PaymentMethodsInfo {
  codEnabled: boolean;
  esewaEnabled: boolean;
  esewaLogo: string | null;
}

function submitEsewaForm(formUrl: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formUrl;
  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export default function PaymentPage() {
  const router = useRouter();
  const { clear } = useCart();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [method, setMethod] = useState<"COD" | "ESEWA">("COD");
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [methods, setMethods] = useState<PaymentMethodsInfo | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) {
        router.replace("/checkout");
        return;
      }
      setDraft(JSON.parse(raw));
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    fetch("/api/payment-methods")
      .then((res) => res.json())
      .then((json) => setMethods(json.data ?? null));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (methods && !methods.codEnabled && methods.esewaEnabled) setMethod("ESEWA");
    }, 0);
    return () => clearTimeout(timer);
  }, [methods]);

  async function handlePlaceOrder() {
    if (!draft) return;
    setIsPaying(true);
    setError(null);

    const payload = {
      addressId: draft.addressId,
      address: draft.address,
      saveAddress: draft.saveAddress,
      couponCode: draft.couponCode,
    };

    if (method === "COD") {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, paymentMethod: "COD" }),
      });
      const json = await res.json();
      setIsPaying(false);

      if (!res.ok) {
        setError(json.message ?? "Something went wrong");
        return;
      }

      sessionStorage.removeItem(DRAFT_KEY);
      await clear();
      router.push(`/order/success/${json.data.orderNumber}`);
      return;
    }

    // eSewa: get a signed redirect form, then send the browser to eSewa's hosted payment page.
    // The draft stays in sessionStorage — /checkout/esewa/return needs it once the user comes back.
    const res = await fetch("/api/checkout/esewa/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
      setIsPaying(false);
      setError(json.message ?? "Something went wrong");
      return;
    }

    submitEsewaForm(json.data.formUrl, json.data.fields);
  }

  if (!draft) return null;

  const subtotal = draft.subtotal ?? 0;
  const discount = draft.discount ?? 0;
  const shippingFee = draft.shippingFee ?? 0;
  const tax = draft.tax ?? 0;
  const total = Math.max(0, subtotal - discount) + shippingFee + tax;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payment</h1>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-start justify-between gap-3">
            <span>Subtotal</span>
            <span className="shrink-0 whitespace-nowrap">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-start justify-between gap-3 text-accent-700">
              <span>Discount</span>
              <span className="shrink-0 whitespace-nowrap">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              Shipping
              {draft.shippingLabel && <span className="block truncate text-xs text-gray-400">{draft.shippingLabel}</span>}
            </span>
            <span className="shrink-0 whitespace-nowrap">{shippingFee > 0 ? formatPrice(shippingFee) : "Free"}</span>
          </div>
          {tax > 0 && (
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0 truncate">{draft.taxLabel ?? "Tax"}</span>
              <span className="shrink-0 whitespace-nowrap">{formatPrice(tax)}</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-3 border-t border-gray-100 pt-3 text-lg font-bold text-gray-900">
          <span>Total to pay</span>
          <span className="shrink-0 whitespace-nowrap">{formatPrice(total)}</span>
        </div>

        <div className="mt-6 space-y-3">
          {(methods?.codEnabled ?? true) && (
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                method === "COD" ? "border-primary-400 bg-primary-50 ring-1 ring-primary-200" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input type="radio" checked={method === "COD"} onChange={() => setMethod("COD")} className="accent-primary-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-gray-500">Pay in cash when your order arrives</p>
              </div>
              {method === "COD" && (
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </label>
          )}

          {(methods?.esewaEnabled ?? true) && (
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                method === "ESEWA" ? "border-primary-400 bg-primary-50 ring-1 ring-primary-200" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input type="radio" checked={method === "ESEWA"} onChange={() => setMethod("ESEWA")} className="accent-primary-600" />
              <div className="flex flex-1 items-center gap-3">
                {methods?.esewaLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={methods.esewaLogo}
                    alt="eSewa"
                    className="h-10 w-auto max-w-[96px] shrink-0 rounded-md object-contain"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#60BB46] text-sm font-bold text-white">
                    e
                  </span>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    Pay with <span className="text-accent-700">eSewa</span>
                  </p>
                  <p className="text-gray-500">Nepal&apos;s trusted digital wallet</p>
                </div>
              </div>
              {method === "ESEWA" && (
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </label>
          )}

          {method === "ESEWA" && (
            <p className="ml-8 rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
              You&apos;ll be redirected to eSewa to complete your payment securely, then brought back here automatically.
            </p>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <Button className="mt-6 w-full" size="lg" isLoading={isPaying} onClick={handlePlaceOrder}>
          {method === "COD" ? "Place Order" : `Pay with eSewa — ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}
