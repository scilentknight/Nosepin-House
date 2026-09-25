"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { GalleryImage } from "@/components/admin/GalleryUpload";
import { GeneralTab } from "@/components/admin/products/tabs/GeneralTab";
import { PricingTab } from "@/components/admin/products/tabs/PricingTab";
import { InventoryTab } from "@/components/admin/products/tabs/InventoryTab";
import { ShippingTab } from "@/components/admin/products/tabs/ShippingTab";
import { MediaTab } from "@/components/admin/products/tabs/MediaTab";
import { FlagsSeoTab } from "@/components/admin/products/tabs/FlagsSeoTab";
import { RelatedTab } from "@/components/admin/products/tabs/RelatedTab";
import { VariantsManager } from "@/components/admin/products/VariantsManager";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  brandId: string | null;

  shortDescription: string;
  fullDescription: string;

  costPrice: string;
  price: string;
  compareAtPrice: string;
  discountType: "PERCENTAGE" | "FIXED" | "";
  discountValue: string;
  taxClass: string;

  stock: string;
  lowStockAlert: string;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  minimumOrderQuantity: string;
  maximumOrderQuantity: string;

  weight: string;
  length: string;
  width: string;
  height: string;

  featuredImage: string | null;
  images: GalleryImage[];

  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  isTrending: boolean;
  isSpecial: boolean;
  isWeekly: boolean;
  isFlash: boolean;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  warranty: string;
  tags: string[];
  colorway: string;

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  relatedIds: string[];
  crossSellIds: string[];
  upSellIds: string[];
}

export const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  brandId: null,
  shortDescription: "",
  fullDescription: "",
  costPrice: "",
  price: "",
  compareAtPrice: "",
  discountType: "",
  discountValue: "",
  taxClass: "",
  stock: "0",
  lowStockAlert: "5",
  stockStatus: "IN_STOCK",
  minimumOrderQuantity: "1",
  maximumOrderQuantity: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  featuredImage: null,
  images: [],
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
  isOnSale: false,
  isTrending: false,
  isSpecial: false,
  isWeekly: false,
  isFlash: false,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  warranty: "",
  tags: [],
  colorway: "green",
  status: "DRAFT",
  relatedIds: [],
  crossSellIds: [],
  upSellIds: [],
};

const TABS = [
  "General",
  "Pricing",
  "Inventory",
  "Shipping",
  "Media",
  "Flags & SEO",
  "Variants",
  "Related",
] as const;
type Tab = (typeof TABS)[number];

function toPayload(values: ProductFormValues) {
  const num = (s: string) => (s.trim() === "" ? null : Number(s));
  return {
    ...values,
    brandId: values.brandId || null,
    costPrice: num(values.costPrice),
    price: num(values.price) ?? 0,
    compareAtPrice: num(values.compareAtPrice),
    discountType: values.discountType || null,
    discountValue: num(values.discountValue),
    stock: num(values.stock) ?? 0,
    lowStockAlert: num(values.lowStockAlert),
    minimumOrderQuantity: num(values.minimumOrderQuantity) ?? 1,
    maximumOrderQuantity: num(values.maximumOrderQuantity),
    weight: num(values.weight),
    length: num(values.length),
    width: num(values.width),
    height: num(values.height),
    images: values.images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: i })),
  };
}

interface ProductFormProps {
  initial: ProductFormValues;
  onSubmit: (payload: ReturnType<typeof toPayload>) => Promise<{ ok: boolean; message?: string }>;
  submitLabel: string;
}

export function ProductForm({ initial, onSubmit, submitLabel }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial);
  const [tab, setTab] = useState<Tab>("General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await onSubmit(toPayload(values));
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.message ?? "Something went wrong");
      return;
    }
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-nowrap gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-soft">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            disabled={t === "Variants" && !values.id}
            title={t === "Variants" && !values.id ? "Save the product first to manage variants" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              tab === t ? "bg-slate-800 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && <GeneralTab values={values} set={set} />}
      {tab === "Pricing" && <PricingTab values={values} set={set} />}
      {tab === "Inventory" && <InventoryTab values={values} set={set} />}
      {tab === "Shipping" && <ShippingTab values={values} set={set} />}
      {tab === "Media" && <MediaTab values={values} set={set} />}
      {tab === "Flags & SEO" && <FlagsSeoTab values={values} set={set} />}
      {tab === "Variants" && values.id && <VariantsManager productId={values.id} />}
      {tab === "Related" && <RelatedTab values={values} set={set} currentProductId={values.id} />}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="admin" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="adminOutline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
