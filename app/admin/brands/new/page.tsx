"use client";

import { BrandForm, EMPTY_BRAND, type BrandFormValues } from "@/components/admin/brands/BrandForm";

export default function NewBrandPage() {
  async function handleSubmit(values: BrandFormValues) {
    const res = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    return { ok: true };
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Brand</h1>
      <p className="mt-1 text-sm text-gray-500">Create a new product brand.</p>
      <div className="mt-6">
        <BrandForm initial={EMPTY_BRAND} onSubmit={handleSubmit} submitLabel="Create brand" />
      </div>
    </div>
  );
}
