"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function MediaTab({ values, set }: TabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Featured image</h2>
        <div className="mt-4">
          <ImageUpload value={values.featuredImage} onChange={(url) => set("featuredImage", url)} folder="products" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gallery</h2>
        <p className="mt-1 text-xs text-gray-400">Drag thumbnails to reorder. The first image is used as the primary listing image.</p>
        <div className="mt-4">
          <GalleryUpload value={values.images} onChange={(images) => set("images", images)} folder="products" />
        </div>
      </div>
    </div>
  );
}
