"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import type { GalleryImage } from "@/components/admin/GalleryUpload";

import { GeneralTab } from "@/components/admin/products/tabs/GeneralTab";
import { PricingTab } from "@/components/admin/products/tabs/PricingTab";
import { InventoryTab } from "@/components/admin/products/tabs/InventoryTab";
// import { ShippingTab } from "@/components/admin/products/tabs/ShippingTab";
import { MediaTab } from "@/components/admin/products/tabs/MediaTab";
import { FlagsSeoTab } from "@/components/admin/products/tabs/FlagsSeoTab";
import { RelatedTab } from "@/components/admin/products/tabs/RelatedTab";
// import { VariantsManager } from "@/components/admin/products/VariantsManager";

import type { ProductMaterialValue, MarkupType } from "@/lib/jewellery/types";

import { MaterialComposition } from "@/components/admin/products/MaterialComposition";

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

  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";

  relatedIds: string[];
  crossSellIds: string[];
  upSellIds: string[];

  materials: ProductMaterialValue[];

  labourCharge: string;
  makingCharge: string;
  otherCharge: string;

  markupType: MarkupType;
  markupValue: string;
}

/* -------------------------------------------------------------------------- */
/* Empty Product                                                             */
/* -------------------------------------------------------------------------- */

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

  status: "PUBLISHED",

  relatedIds: [],
  crossSellIds: [],
  upSellIds: [],

  materials: [],

  labourCharge: "0",
  makingCharge: "0",
  otherCharge: "0",

  markupType: "",
  markupValue: "",
};

// Category Types                                                            */

export interface CategoryOption {
  id: string;
  name: string;
  parentCategoryId: string | null;
  children?: CategoryOption[];
}

// Category Tree Helpers                                                     */

function buildCategoryTree(categories: CategoryOption[]): CategoryOption[] {
  const categoryMap = new Map<string, CategoryOption>();

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  const tree: CategoryOption[] = [];

  categoryMap.forEach((category) => {
    if (
      category.parentCategoryId &&
      categoryMap.has(category.parentCategoryId)
    ) {
      const parent = categoryMap.get(category.parentCategoryId);

      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(category);
      }
    } else {
      tree.push(category);
    }
  });

  return tree;
}

// Check whether the API already returned a nested tree.
function hasNestedChildren(categories: CategoryOption[]): boolean {
  return categories.some(
    (category) =>
      Array.isArray(category.children) && category.children.length > 0,
  );
}

// Tabs                                                                      */

const TABS = [
  "General",
  "Materials",
  "Pricing",
  "Inventory",
  // "Shipping",
  "Media",
  "Flags & SEO",
  // "Variants",
  "Related",
] as const;

type Tab = (typeof TABS)[number];

function toPayload(values: ProductFormValues) {
  const num = (value: string) => (value.trim() === "" ? null : Number(value));

  return {
    ...values,

    brandId: values.brandId || null,

    costPrice: num(values.costPrice),

    price: num(values.price),

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

    //  Jewellery pricing

    labourCharge: num(values.labourCharge) ?? 0,

    makingCharge: num(values.makingCharge) ?? 0,

    otherCharge: num(values.otherCharge) ?? 0,

    markupType: values.markupType || null,

    markupValue: num(values.markupValue),

    materials: values.materials
      .filter((m) => m.materialId && m.materialId.trim() !== "")
      .map((material, index) => ({
        id: material.id,
        materialId: material.materialId.trim(),
        purityId: material.purityId && material.purityId.trim() !== "" ? material.purityId.trim() : null,
        grossWeight: material.grossWeight && material.grossWeight.trim() !== "" ? Number(material.grossWeight) : null,
        stoneWeight: material.stoneWeight && material.stoneWeight.trim() !== "" ? Number(material.stoneWeight) : null,
        netWeight: material.netWeight && material.netWeight.trim() !== "" ? Number(material.netWeight) : null,
        quantity: Number(material.quantity || material.netWeight || 0),
        unit: material.unit,
        wastagePercent: material.wastagePercent && material.wastagePercent.trim() !== "" ? Number(material.wastagePercent) : 0,
        sortOrder: index,
      })),

    images: values.images.map((img, index) => ({
      url: img.url,
      alt: img.alt,
      sortOrder: index,
    })),
  };
}

// Props                                                                     */

interface ProductFormProps {
  initial: ProductFormValues;

  onSubmit: (payload: ReturnType<typeof toPayload>) => Promise<{
    ok: boolean;
    message?: string;
  }>;

  submitLabel: string;
}

// Product Form                                                              */

export function ProductForm({
  initial,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<ProductFormValues>(initial);

  const [tab, setTab] = useState<Tab>("General");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Categories                                                               */

  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  // Set Form Value                                                           */

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  // Load Categories                                                          */

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const response = await fetch("/api/admin/categories?tree=true", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load categories: ${response.status}`);
        }

        const json = await response.json();

        const categoryList: CategoryOption[] =
          json?.data?.categories ?? json?.categories ?? json?.data ?? [];

        if (cancelled) {
          return;
        }

        const tree = hasNestedChildren(categoryList)
          ? categoryList
          : buildCategoryTree(categoryList);

        setCategories(tree);
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Submit

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await onSubmit(toPayload(values));

      if (!result.ok) {
        setError(result.message ?? "Something went wrong");

        return;
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Product submission failed:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Render

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex flex-nowrap gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-soft">
        {/* {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            disabled={t === "Variants" && !values.id}
            title={
              t === "Variants" && !values.id
                ? "Save the product first to manage variants"
                : undefined
            }
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              tab === t
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))} */}
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "General" && (
        <GeneralTab
          values={values}
          set={set}
          categories={categories}
          loadingCategories={loadingCategories}
        />
      )}

      {tab === "Materials" && (
        <MaterialComposition
          values={values.materials}
          setValues={(materials) => set("materials", materials)}
        />
      )}
      {/* Pricing */}
      {tab === "Pricing" && <PricingTab values={values} set={set} />}

      {/* Inventory */}
      {tab === "Inventory" && <InventoryTab values={values} set={set} />}

      {/* Shipping */}
      {/* {tab === "Shipping" && <ShippingTab values={values} set={set} />} */}

      {/* Media */}
      {tab === "Media" && <MediaTab values={values} set={set} />}

      {/* Flags & SEO */}
      {tab === "Flags & SEO" && <FlagsSeoTab values={values} set={set} />}

      {/* Variants */}
      {/* {tab === "Variants" && values.id && (
        <VariantsManager productId={values.id} />
      )} */}

      {/* Related */}
      {tab === "Related" && (
        <RelatedTab values={values} set={set} currentProductId={values.id} />
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="admin" isLoading={isSubmitting}>
          {submitLabel}
        </Button>

        <Button
          type="button"
          variant="adminOutline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
