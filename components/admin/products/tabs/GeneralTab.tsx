"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/Input";
import { SlugField } from "@/components/admin/SlugField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

import type {
  ProductFormValues,
  CategoryOption,
} from "@/components/admin/products/ProductForm";

import { CategoryTreeSelect } from "@/components/admin/products/CategoryTreeSelect";

interface TabProps {
  values: ProductFormValues;

  set: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;

  categories: CategoryOption[];

  loadingCategories: boolean;
}

interface Option {
  id: string;
  name: string;
}

export function GeneralTab({
  values,
  set,
  categories,
  loadingCategories,
}: TabProps) {
  const [brands, setBrands] = useState<Option[]>([]);

  /*
   * Load brands only.
   *
   * Categories are now loaded by ProductForm.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadBrands() {
      try {
        const response = await fetch("/api/admin/brands?pageSize=100", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load brands: ${response.status}`);
        }

        const json = await response.json();

        const brandList: Option[] =
          json?.data?.brands ?? json?.brands ?? json?.data ?? [];

        if (!cancelled) {
          setBrands(brandList);
        }
      } catch (error) {
        console.error("Failed to load brands:", error);

        if (!cancelled) {
          setBrands([]);
        }
      }
    }

    loadBrands();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* ================================================================ */}
      {/* LEFT - PRODUCT INFORMATION                                      */}
      {/* ================================================================ */}

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft lg:col-span-2">
        {/* Product name */}
        <Input
          label="Product name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />

        {/* Slug */}
        <SlugField
          value={values.slug}
          onChange={(slug) => set("slug", slug)}
          sourceValue={values.name}
          prefix="/product/"
        />

        {/* SKU */}
        <Input
          label="SKU (leave blank to auto-generate)"
          value={values.sku}
          onChange={(e) => set("sku", e.target.value)}
        />

        {/* Short description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Short description
          </label>

          <textarea
            value={values.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            rows={3}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Full description */}
        <RichTextEditor
          label="Full description"
          value={values.fullDescription}
          onChange={(html) => set("fullDescription", html)}
          placeholder="Full product description..."
        />
      </div>

      {/* ================================================================ */}
      {/* RIGHT - CATEGORY + BRAND                                         */}
      {/* ================================================================ */}

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Category</label>

          <CategoryTreeSelect
            categories={categories}
            value={values.categoryId}
            onChange={(categoryId) => set("categoryId", categoryId)}
            loading={loadingCategories}
            required
          />
        </div>

        {/* Brand */}
        {/* <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Brand</label>

          <select
            value={values.brandId ?? ""}
            onChange={(e) => set("brandId", e.target.value || null)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">No brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
}
