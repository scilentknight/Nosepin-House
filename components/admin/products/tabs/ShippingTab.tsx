"use client";

import { Input } from "@/components/ui/Input";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function ShippingTab({ values, set }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
      <Input label="Weight (kg)" type="number" step="0.001" value={values.weight} onChange={(e) => set("weight", e.target.value)} />
      <Input label="Length (cm)" type="number" step="0.01" value={values.length} onChange={(e) => set("length", e.target.value)} />
      <Input label="Width (cm)" type="number" step="0.01" value={values.width} onChange={(e) => set("width", e.target.value)} />
      <Input label="Height (cm)" type="number" step="0.01" value={values.height} onChange={(e) => set("height", e.target.value)} />
    </div>
  );
}
