"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { SlugField } from "@/components/admin/SlugField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

interface Option {
  id: string;
  name: string;
}

export function GeneralTab({ values, set }: TabProps) {
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories?tree=true")
      .then((res) => res.json())
      .then((json) => setCategories(json.data?.categories ?? []));
    fetch("/api/admin/brands?pageSize=100")
      .then((res) => res.json())
      .then((json) => setBrands(json.data?.brands ?? []));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft lg:col-span-2">
        <Input label="Product name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
        <SlugField value={values.slug} onChange={(slug) => set("slug", slug)} sourceValue={values.name} prefix="/product/" />
        <Input label="SKU (leave blank to auto-generate)" value={values.sku} onChange={(e) => set("sku", e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Short description</label>
          <textarea
            value={values.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            rows={3}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <RichTextEditor
          label="Full description"
          value={values.fullDescription}
          onChange={(html) => set("fullDescription", html)}
          placeholder="Full product description..."
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            required
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <select
            value={values.brandId ?? ""}
            onChange={(e) => set("brandId", e.target.value || null)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">No brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
