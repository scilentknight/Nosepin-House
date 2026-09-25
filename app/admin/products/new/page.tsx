"use client";

import { ProductForm, EMPTY_PRODUCT } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  async function handleSubmit(payload: unknown) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    return { ok: true };
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Product</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the details below. You can add variants after saving the product for the first time.
      </p>
      <div className="mt-6">
        <ProductForm initial={EMPTY_PRODUCT} onSubmit={handleSubmit} submitLabel="Create product" />
      </div>
    </div>
  );
}
