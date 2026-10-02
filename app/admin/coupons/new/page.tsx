"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  CouponForm,
  EMPTY_COUPON,
  type CouponFormValues,
} from "@/components/admin/coupons/CouponForm";

export default function NewCouponPage() {
  const router = useRouter();

  async function handleSubmit(values: CouponFormValues) {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: values.code,
        type: values.type,
        value: values.value,
        minOrderAmount: values.minOrderAmount,
        expiresAt: values.expiresAt
          ? new Date(`${values.expiresAt}T00:00:00.000Z`).toISOString()
          : null,
        active: values.active,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, message: json.message };
    }

    return { ok: true };
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Coupon
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new discount coupon.
          </p>
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="mt-6">
        <CouponForm
          initial={EMPTY_COUPON}
          onSubmit={handleSubmit}
          submitLabel="Create coupon"
        />
      </div>
    </div>
  );
}
