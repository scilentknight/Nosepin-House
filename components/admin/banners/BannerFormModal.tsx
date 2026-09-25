"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface BannerFormValues {
  title: string;
  subtitle: string;
  image: string | null;
  linkUrl: string;
  buttonText: string;
  active: boolean;
}

export const EMPTY_BANNER: BannerFormValues = {
  title: "",
  subtitle: "",
  image: null,
  linkUrl: "",
  buttonText: "",
  active: true,
};

interface BannerFormModalProps {
  title: string;
  initial: BannerFormValues;
  submitLabel: string;
  onSubmit: (values: BannerFormValues) => Promise<{ ok: boolean; message?: string }>;
  onClose: () => void;
}

/**
 * Mount with a stable `key` per target (e.g. "create" or the banner id) so that
 * switching between create/edit targets remounts the form with fresh initial
 * values, instead of re-syncing state on every parent re-render.
 */
export function BannerFormModal({ title, initial, submitLabel, onSubmit, onClose }: BannerFormModalProps) {
  const [values, setValues] = useState<BannerFormValues>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BannerFormValues>(key: K, value: BannerFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.image) {
      setError("Image is required");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.message ?? "Something went wrong");
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-soft-lg">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Input label="Title" value={values.title} onChange={(e) => set("title", e.target.value)} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Subtitle</label>
            <textarea
              value={values.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              rows={2}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <ImageUpload label="Image" value={values.image} onChange={(url) => set("image", url)} folder="banners" />

          <Input
            label="Link URL"
            value={values.linkUrl}
            onChange={(e) => set("linkUrl", e.target.value)}
            placeholder="/shop"
          />
          <Input
            label="Button text"
            value={values.buttonText}
            onChange={(e) => set("buttonText", e.target.value)}
            placeholder="Shop Now"
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Active
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="adminOutline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="admin" size="sm" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
