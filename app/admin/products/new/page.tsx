"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  ProductForm,
  EMPTY_PRODUCT,
} from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(payload: unknown) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, message: json.message };
    }

    return { ok: true };
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below. You can add variants after saving the
            product for the first time.
          </p>
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="mt-6">
        <ProductForm
          initial={EMPTY_PRODUCT}
          onSubmit={handleSubmit}
          submitLabel="Create product"
        />
      </div>
    </div>
  );
}
