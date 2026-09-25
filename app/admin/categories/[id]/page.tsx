"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CategoryForm, type CategoryFormValues } from "@/components/admin/categories/CategoryForm";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<CategoryFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setNotFound(true);
          return;
        }
        const c = json.data;
        setInitial({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parentCategoryId: c.parentCategoryId,
          description: c.description ?? "",
          image: c.image,
          bannerImage: c.bannerImage,
          icon: c.icon ?? "",
          metaTitle: c.metaTitle ?? "",
          metaDescription: c.metaDescription ?? "",
          metaKeywords: c.metaKeywords ?? "",
          sortOrder: c.sortOrder,
          isFeatured: c.isFeatured,
          status: c.status,
        });
      });
  }, [id]);

  async function handleSubmit(values: CategoryFormValues) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    return { ok: true };
  }

  if (notFound) {
    return <p className="text-sm text-gray-500">Category not found.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Category</h1>
      <p className="mt-1 text-sm text-gray-500">Update this category&apos;s details.</p>
      <div className="mt-6">
        {initial && <CategoryForm initial={initial} onSubmit={handleSubmit} submitLabel="Save changes" />}
      </div>
    </div>
  );
}
