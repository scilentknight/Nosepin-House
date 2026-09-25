"use client";

import { Input } from "@/components/ui/Input";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function PricingTab({ values, set }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
      <Input label="Cost price" type="number" step="0.01" value={values.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
      <Input label="Selling price" type="number" step="0.01" value={values.price} onChange={(e) => set("price", e.target.value)} required />
      <Input label="Compare-at price" type="number" step="0.01" value={values.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Discount type</label>
        <select
          value={values.discountType}
          onChange={(e) => set("discountType", e.target.value as ProductFormValues["discountType"])}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">None</option>
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED">Fixed amount</option>
        </select>
      </div>
      <Input label="Discount value" type="number" step="0.01" value={values.discountValue} onChange={(e) => set("discountValue", e.target.value)} />
      <Input label="Tax class" value={values.taxClass} onChange={(e) => set("taxClass", e.target.value)} placeholder="e.g. Standard, Exempt" />
    </div>
  );
}
