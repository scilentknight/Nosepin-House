"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BrandForm, type BrandFormValues } from "@/components/admin/brands/BrandForm";

export default function EditBrandPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<BrandFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/brands/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setNotFound(true);
          return;
        }
        const b = json.data;
        setInitial({
          id: b.id,
          name: b.name,
          slug: b.slug,
          logo: b.logo,
          banner: b.banner,
          description: b.description ?? "",
          websiteUrl: b.websiteUrl ?? "",
          metaTitle: b.metaTitle ?? "",
          metaDescription: b.metaDescription ?? "",
          metaKeywords: b.metaKeywords ?? "",
          sortOrder: b.sortOrder,
          isFeatured: b.isFeatured,
          status: b.status,
        });
      });
  }, [id]);

  async function handleSubmit(values: BrandFormValues) {
    const res = await fetch(`/api/admin/brands/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json.message };
    return { ok: true };
  }

  if (notFound) return <p className="text-sm text-gray-500">Brand not found.</p>;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Brand</h1>
      <p className="mt-1 text-sm text-gray-500">Update this brand&apos;s details.</p>
      <div className="mt-6">{initial && <BrandForm initial={initial} onSubmit={handleSubmit} submitLabel="Save changes" />}</div>
    </div>
  );
}
