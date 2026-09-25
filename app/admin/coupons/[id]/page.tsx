"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CouponForm, type CouponFormValues } from "@/components/admin/coupons/CouponForm";

export default function EditCouponPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<CouponFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/coupons/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setNotFound(true);
          return;
        }
        const c = json.data;
        setInitial({
          id: c.id,
          code: c.code,
          type: c.type,
          value: c.value,
          minOrderAmount: c.minOrderAmount,
          expiresAt: c.expiresAt ? String(c.expiresAt).slice(0, 10) : "",
          active: c.active,
        });
      });
  }, [id]);

  async function handleSubmit(values: CouponFormValues) {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PUT",
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

  if (notFound) return <p className="text-sm text-gray-500">Coupon not found.</p>;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Coupon</h1>
      <p className="mt-1 text-sm text-gray-500">Update this coupon&apos;s details.</p>
      <div className="mt-6">{initial && <CouponForm initial={initial} onSubmit={handleSubmit} submitLabel="Save changes" />}</div>
    </div>
  );
}
