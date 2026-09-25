"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

const DRAFT_KEY = "bikesh-checkout-draft";

function EsewaReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function complete() {
      const txn = searchParams.get("txn");
      const raw = sessionStorage.getItem(DRAFT_KEY);

      if (!txn || !raw) {
        setMessage(
          `We couldn't find your checkout details in this browser session. If eSewa charged you, please check My Orders or contact support with reference ${txn ?? "unknown"}.`
        );
        return;
      }

      const draft = JSON.parse(raw);

      const res = await fetch("/api/checkout/esewa/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionUuid: txn,
          addressId: draft.addressId,
          address: draft.address,
          saveAddress: draft.saveAddress,
          couponCode: draft.couponCode,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setMessage(json.message ?? "Payment was not completed.");
        return;
      }

      sessionStorage.removeItem(DRAFT_KEY);
      await clear();
      router.replace(`/order/success/${json.data.orderNumber}`);
    }

    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!message) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="mt-4 text-gray-500">Confirming your eSewa payment…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
      <h1 className="mt-6 text-xl font-bold text-gray-900">Payment not completed</h1>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/checkout/payment">
          <Button>Try Again</Button>
        </Link>
        <Link href="/cart">
          <Button variant="outline">Back to Cart</Button>
        </Link>
      </div>
    </div>
  );
}

export default function EsewaReturnPage() {
  return (
    <Suspense>
      <EsewaReturnContent />
    </Suspense>
  );
}
