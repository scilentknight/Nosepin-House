"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SlugField } from "@/components/admin/SlugField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export interface BrandFormValues {
  id?: string;
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string;
  websiteUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  sortOrder: number;
  isFeatured: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export const EMPTY_BRAND: BrandFormValues = {
  name: "",
  slug: "",
  logo: null,
  banner: null,
  description: "",
  websiteUrl: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  sortOrder: 0,
  isFeatured: false,
  status: "ACTIVE",
};

interface BrandFormProps {
  initial: BrandFormValues;
  onSubmit: (values: BrandFormValues) => Promise<{ ok: boolean; message?: string }>;
  submitLabel: string;
}

export function BrandForm({ initial, onSubmit, submitLabel }: BrandFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<BrandFormValues>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BrandFormValues>(key: K, value: BrandFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.message ?? "Something went wrong");
      return;
    }
    router.push("/admin/brands");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">General</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
            <SlugField value={values.slug} onChange={(slug) => set("slug", slug)} sourceValue={values.name} prefix="/brands/" />
            <Input label="Website URL" value={values.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://" />
            <RichTextEditor label="Description" value={values.description} onChange={(html) => set("description", html)} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">SEO</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Meta title" value={values.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Meta description</label>
              <textarea
                value={values.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={3}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <Input label="Meta keywords" value={values.metaKeywords} onChange={(e) => set("metaKeywords", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Media</h2>
          <div className="mt-4 flex flex-col gap-4">
            <ImageUpload label="Logo" value={values.logo} onChange={(url) => set("logo", url)} folder="brands" />
            <ImageUpload label="Banner" value={values.banner} onChange={(url) => set("banner", url)} folder="brands" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Settings</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Input
              label="Sort order"
              type="number"
              value={values.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value))}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              Featured brand
            </label>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={values.status}
                onChange={(e) => set("status", e.target.value as "ACTIVE" | "INACTIVE")}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="admin" isLoading={isSubmitting} className="flex-1">
            {submitLabel}
          </Button>
          <Button type="button" variant="adminOutline" onClick={() => router.push("/admin/brands")}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
