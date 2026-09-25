"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SlugField } from "@/components/admin/SlugField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export interface CategoryFormValues {
  id?: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  description: string;
  image: string | null;
  bannerImage: string | null;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  sortOrder: number;
  isFeatured: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export const EMPTY_CATEGORY: CategoryFormValues = {
  name: "",
  slug: "",
  parentCategoryId: null,
  description: "",
  image: null,
  bannerImage: null,
  icon: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  sortOrder: 0,
  isFeatured: false,
  status: "ACTIVE",
};

interface ParentOption {
  id: string;
  name: string;
  parentCategoryId: string | null;
}

interface CategoryFormProps {
  initial: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<{ ok: boolean; message?: string }>;
  submitLabel: string;
}

function descendantIds(all: ParentOption[], rootId: string): Set<string> {
  const result = new Set<string>();
  let frontier = [rootId];
  while (frontier.length > 0) {
    const children = all.filter((c) => frontier.includes(c.parentCategoryId ?? ""));
    frontier = children.map((c) => c.id);
    frontier.forEach((id) => result.add(id));
  }
  return result;
}

export function CategoryForm({ initial, onSubmit, submitLabel }: CategoryFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryFormValues>(initial);
  const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories?tree=true")
      .then((res) => res.json())
      .then((json) => setParentOptions(json.data?.categories ?? []));
  }, []);

  const excluded = values.id ? descendantIds(parentOptions, values.id) : new Set<string>();
  if (values.id) excluded.add(values.id);

  function set<K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) {
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
    router.push("/admin/categories");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">General</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
            <SlugField value={values.slug} onChange={(slug) => set("slug", slug)} sourceValue={values.name} prefix="/shop?category=" />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Parent category</label>
              <select
                value={values.parentCategoryId ?? ""}
                onChange={(e) => set("parentCategoryId", e.target.value || null)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">None (top-level)</option>
                {parentOptions
                  .filter((c) => !excluded.has(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <RichTextEditor label="Description" value={values.description} onChange={(html) => set("description", html)} />

            <Input label="Icon (CSS class or emoji)" value={values.icon} onChange={(e) => set("icon", e.target.value)} />
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
            <ImageUpload label="Image" value={values.image} onChange={(url) => set("image", url)} folder="categories" />
            <ImageUpload label="Banner image" value={values.bannerImage} onChange={(url) => set("bannerImage", url)} folder="categories" />
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
              Featured category
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
          <Button type="button" variant="adminOutline" onClick={() => router.push("/admin/categories")}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
