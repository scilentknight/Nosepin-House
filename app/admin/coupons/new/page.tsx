"use client";

import { CouponForm, EMPTY_COUPON, type CouponFormValues } from "@/components/admin/coupons/CouponForm";

export default function NewCouponPage() {
  async function handleSubmit(values: CouponFormValues) {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: values.code,
        type: values.type,
        value: values.value,
        minOrderAmount: values.minOrderAmount,
        expiresAt: values.expiresAt ? new Date(`${values.expiresAt}T00:00:00.000Z`).toISOString() : null,
        active: values.active,
      }),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    return { ok: true };
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Coupon</h1>
      <p className="mt-1 text-sm text-gray-500">Create a new discount coupon.</p>
      <div className="mt-6">
        <CouponForm initial={EMPTY_COUPON} onSubmit={handleSubmit} submitLabel="Create coupon" />
      </div>
    </div>
  );
}
