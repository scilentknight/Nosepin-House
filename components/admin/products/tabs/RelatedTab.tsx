"use client";

import { useEffect, useState } from "react";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
  currentProductId?: string;
}

interface ProductOption {
  id: string;
  name: string;
}

function ProductPicker({
  label,
  options,
  selectedIds,
  onChange,
}: {
  label: string;
  options: ProductOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = options.filter((o) => selectedIds.includes(o.id));
  const matches = query
    ? options.filter((o) => !selectedIds.includes(o.id) && o.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {selected.map((o) => (
          <span key={o.id} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {o.name}
            <button type="button" onClick={() => onChange(selectedIds.filter((id) => id !== o.id))} aria-label={`Remove ${o.name}`}>
              ×
            </button>
          </span>
        ))}
        {selected.length === 0 && <span className="text-xs text-gray-400">None selected</span>}
      </div>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products to add..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
        {matches.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-soft-lg">
            {matches.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...selectedIds, o.id]);
                    setQuery("");
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {o.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function RelatedTab({ values, set, currentProductId }: TabProps) {
  const [options, setOptions] = useState<ProductOption[]>([]);

  useEffect(() => {
    fetch("/api/admin/products?pageSize=100")
      .then((res) => res.json())
      .then((json) => {
        const products = (json.data?.products ?? []) as ProductOption[];
        setOptions(products.filter((p) => p.id !== currentProductId));
      });
  }, [currentProductId]);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
      <ProductPicker label="Related products" options={options} selectedIds={values.relatedIds} onChange={(ids) => set("relatedIds", ids)} />
      <ProductPicker label="Cross-sell products" options={options} selectedIds={values.crossSellIds} onChange={(ids) => set("crossSellIds", ids)} />
      <ProductPicker label="Up-sell products" options={options} selectedIds={values.upSellIds} onChange={(ids) => set("upSellIds", ids)} />
    </div>
  );
}
