"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { GeneralTab } from "@/components/admin/products/tabs/GeneralTab";
import { PricingTab } from "@/components/admin/products/tabs/PricingTab";
import { InventoryTab } from "@/components/admin/products/tabs/InventoryTab";
// import { ShippingTab } from "@/components/admin/products/tabs/ShippingTab";
import { MediaTab } from "@/components/admin/products/tabs/MediaTab";
import { FlagsSeoTab } from "@/components/admin/products/tabs/FlagsSeoTab";
import { RelatedTab } from "@/components/admin/products/tabs/RelatedTab";
import { MaterialComposition } from "@/components/admin/products/MaterialComposition";
/* -------------------------------------------------------------------------- */
/* Empty Product                                                             */
/* -------------------------------------------------------------------------- */
export const EMPTY_PRODUCT = {
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
    grossPrice: "",
    pricingStrategy: "RATE_BASED",
    discountPercent: 40,
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
// Category Tree Helpers                                                     */
function buildCategoryTree(categories) {
    const categoryMap = new Map();
    categories.forEach((category) => {
        categoryMap.set(category.id, {
            ...category,
            children: [],
        });
    });
    const tree = [];
    categoryMap.forEach((category) => {
        if (category.parentCategoryId &&
            categoryMap.has(category.parentCategoryId)) {
            const parent = categoryMap.get(category.parentCategoryId);
            if (parent) {
                parent.children = parent.children ?? [];
                parent.children.push(category);
            }
        }
        else {
            tree.push(category);
        }
    });
    return tree;
}
// Check whether the API already returned a nested tree.
function hasNestedChildren(categories) {
    return categories.some((category) => Array.isArray(category.children) && category.children.length > 0);
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
];
function toPayload(values) {
    const num = (value) => (value.trim() === "" ? null : Number(value));
    const isManual = values.pricingStrategy === "MANUAL_DISCOUNT";
    const grossNum = num(values.grossPrice || values.compareAtPrice);
    const discountNum = values.discountPercent !== "" && values.discountPercent !== undefined
        ? Number(values.discountPercent)
        : 40;
    let finalSellingPrice = num(values.price);
    if (isManual && grossNum !== null && grossNum > 0) {
        finalSellingPrice =
            Math.round(grossNum * (1 - discountNum / 100) * 100) / 100;
    }
    return {
        ...values,
        pricingStrategy: values.pricingStrategy || "RATE_BASED",
        grossPrice: grossNum,
        discountPercent: isManual ? discountNum : null,
        // The gallery's first image is the listing image unless explicitly overridden.
        featuredImage: values.featuredImage || values.images[0]?.url || null,
        brandId: values.brandId || null,
        costPrice: isManual ? grossNum : num(values.costPrice),
        price: finalSellingPrice,
        compareAtPrice: isManual ? grossNum : num(values.compareAtPrice),
        discountType: isManual ? "PERCENTAGE" : values.discountType || null,
        discountValue: isManual ? discountNum : num(values.discountValue),
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
            purityId: material.purityId && material.purityId.trim() !== ""
                ? material.purityId.trim()
                : null,
            grossWeight: material.grossWeight && material.grossWeight.trim() !== ""
                ? Number(material.grossWeight)
                : null,
            stoneMaterialId: material.stoneMaterialId && material.stoneMaterialId.trim() !== ""
                ? material.stoneMaterialId.trim()
                : null,
            stoneWeight: material.stoneWeight && material.stoneWeight.trim() !== ""
                ? Number(material.stoneWeight)
                : null,
            stoneGrossPrice: material.stoneGrossPrice && material.stoneGrossPrice.trim() !== ""
                ? Number(material.stoneGrossPrice)
                : null,
            stoneDiscountPercent: material.stoneDiscountPercent &&
                material.stoneDiscountPercent.trim() !== ""
                ? Number(material.stoneDiscountPercent)
                : null,
            manualGrossPrice: material.manualGrossPrice && material.manualGrossPrice.trim() !== ""
                ? Number(material.manualGrossPrice)
                : null,
            manualDiscountPercent: material.manualDiscountPercent &&
                material.manualDiscountPercent.trim() !== ""
                ? Number(material.manualDiscountPercent)
                : null,
            netWeight: material.netWeight && material.netWeight.trim() !== ""
                ? Number(material.netWeight)
                : null,
            quantity: Number(material.quantity || material.netWeight || 1),
            unit: material.unit,
            wastagePercent: material.wastagePercent && material.wastagePercent.trim() !== ""
                ? Number(material.wastagePercent)
                : 0,
            sortOrder: index,
        })),
        images: values.images.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: index,
        })),
    };
}
// Product Form                                                              */
export function ProductForm({ initial, onSubmit, submitLabel, }) {
    const router = useRouter();
    const [values, setValues] = useState(initial);
    const [tab, setTab] = useState("General");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    // Categories                                                               */
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    // Set Form Value                                                           */
    function set(key, value) {
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
                const categoryList = json?.data?.categories ?? json?.categories ?? json?.data ?? [];
                if (cancelled) {
                    return;
                }
                const tree = hasNestedChildren(categoryList)
                    ? categoryList
                    : buildCategoryTree(categoryList);
                setCategories(tree);
            }
            catch (error) {
                console.error("Failed to load categories:", error);
                if (!cancelled) {
                    setCategories([]);
                }
            }
            finally {
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
    async function handleSubmit(e) {
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
        }
        catch (error) {
            console.error("Product submission failed:", error);
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    // Render
    return (<form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
        {TABS.map((t) => (<button key={t} type="button" onClick={() => setTab(t)} className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === t
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-100"}`}>
            {t}
          </button>))}
      </div>

      {/* General */}
      {tab === "General" && (<GeneralTab values={values} set={set} categories={categories} loadingCategories={loadingCategories}/>)}

      {tab === "Materials" && (<MaterialComposition values={values.materials} setValues={(materials) => set("materials", materials)}/>)}
      {/* Pricing */}
      {tab === "Pricing" && <PricingTab values={values} set={set}/>}

      {/* Inventory */}
      {tab === "Inventory" && <InventoryTab values={values} set={set}/>}

      {/* Shipping */}
      {/* {tab === "Shipping" && <ShippingTab values={values} set={set} />} */}

      {/* Media */}
      {tab === "Media" && <MediaTab values={values} set={set}/>}

      {/* Flags & SEO */}
      {tab === "Flags & SEO" && <FlagsSeoTab values={values} set={set}/>}

      {/* Variants */}
      {/* {tab === "Variants" && values.id && (
          <VariantsManager productId={values.id} />
        )} */}

      {/* Related */}
      {tab === "Related" && (<RelatedTab values={values} set={set} currentProductId={values.id}/>)}

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="admin" isLoading={isSubmitting}>
          {submitLabel}
        </Button>

        <Button type="button" variant="adminOutline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>);
}
