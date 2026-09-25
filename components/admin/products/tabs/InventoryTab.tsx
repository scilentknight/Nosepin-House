"use client";

import { Input } from "@/components/ui/Input";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function InventoryTab({ values, set }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
      <Input label="Stock quantity" type="number" value={values.stock} onChange={(e) => set("stock", e.target.value)} />
      <Input label="Low stock alert threshold" type="number" value={values.lowStockAlert} onChange={(e) => set("lowStockAlert", e.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Stock status</label>
        <select
          value={values.stockStatus}
          onChange={(e) => set("stockStatus", e.target.value as ProductFormValues["stockStatus"])}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="IN_STOCK">In stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
          <option value="ON_BACKORDER">On backorder</option>
        </select>
      </div>

      <Input
        label="Minimum order quantity"
        type="number"
        value={values.minimumOrderQuantity}
        onChange={(e) => set("minimumOrderQuantity", e.target.value)}
      />
      <Input
        label="Maximum order quantity"
        type="number"
        value={values.maximumOrderQuantity}
        onChange={(e) => set("maximumOrderQuantity", e.target.value)}
      />
    </div>
  );
}
