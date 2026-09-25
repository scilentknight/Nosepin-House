"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm, type ProductFormValues } from "@/components/admin/products/ProductForm";

function numToStr(n: number | null | undefined) {
  return n === null || n === undefined ? "" : String(n);
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<ProductFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setNotFound(true);
          return;
        }
        const p = json.data;
        setInitial({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku ?? "",
          categoryId: p.categoryId,
          brandId: p.brandId,
          shortDescription: p.shortDescription ?? "",
          fullDescription: p.fullDescription,
          costPrice: numToStr(p.costPrice),
          price: numToStr(p.price),
          compareAtPrice: numToStr(p.compareAtPrice),
          discountType: p.discountType ?? "",
          discountValue: numToStr(p.discountValue),
          taxClass: p.taxClass ?? "",
          stock: numToStr(p.stock),
          lowStockAlert: numToStr(p.lowStockAlert),
          stockStatus: p.stockStatus,
          minimumOrderQuantity: numToStr(p.minimumOrderQuantity),
          maximumOrderQuantity: numToStr(p.maximumOrderQuantity),
          weight: numToStr(p.weight),
          length: numToStr(p.length),
          width: numToStr(p.width),
          height: numToStr(p.height),
          featuredImage: p.featuredImage,
          images: (p.images ?? []).map((img: { id: string; url: string; alt: string }) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
          })),
          isFeatured: p.isFeatured,
          isBestSeller: p.isBestSeller,
          isNewArrival: p.isNewArrival,
          isOnSale: p.isOnSale,
          isTrending: p.isTrending,
          isSpecial: p.isSpecial,
          isWeekly: p.isWeekly,
          isFlash: p.isFlash,
          metaTitle: p.metaTitle ?? "",
          metaDescription: p.metaDescription ?? "",
          metaKeywords: p.metaKeywords ?? "",
          warranty: p.warranty ?? "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          colorway: p.colorway,
          status: p.status,
          relatedIds: p.relatedIds ?? [],
          crossSellIds: p.crossSellIds ?? [],
          upSellIds: p.upSellIds ?? [],
        });
      });
  }, [id]);

  async function handleSubmit(payload: unknown) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    return { ok: true };
  }

  if (notFound) return <p className="text-sm text-gray-500">Product not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
      <p className="mt-1 text-sm text-gray-500">Update this product&apos;s details.</p>
      <div className="mt-6">{initial && <ProductForm initial={initial} onSubmit={handleSubmit} submitLabel="Save changes" />}</div>
    </div>
  );
}
