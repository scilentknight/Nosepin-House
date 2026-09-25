"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import type { ProductFormValues } from "@/components/admin/products/ProductForm";

interface TabProps {
  values: ProductFormValues;
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

const FLAGS: { key: keyof ProductFormValues; label: string }[] = [
  { key: "isFeatured", label: "Featured" },
  { key: "isBestSeller", label: "Best seller" },
  { key: "isNewArrival", label: "New arrival" },
  { key: "isOnSale", label: "On sale" },
  { key: "isTrending", label: "Trending" },
  { key: "isSpecial", label: "Special product" },
  { key: "isWeekly", label: "Weekly product" },
  { key: "isFlash", label: "Flash product" },
];

const COLORWAYS = ["green", "red", "blue", "amber", "teal"];

export function FlagsSeoTab({ values, set }: TabProps) {
  const [tagDraft, setTagDraft] = useState("");

  function addTag() {
    const tag = tagDraft.trim();
    if (tag && !values.tags.includes(tag)) set("tags", [...values.tags, tag]);
    setTagDraft("");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Flags</h2>
        <div className="grid grid-cols-2 gap-2">
          {FLAGS.map((flag) => (
            <label key={flag.key} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(values[flag.key])}
                onChange={(e) => set(flag.key, e.target.checked as ProductFormValues[typeof flag.key])}
                className="h-4 w-4 rounded border-gray-300"
              />
              {flag.label}
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={values.status}
            onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Placeholder accent color</label>
          <div className="flex gap-2">
            {COLORWAYS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("colorway", c)}
                className={`h-8 w-8 rounded-full border-2 ${values.colorway === c ? "border-slate-800" : "border-transparent"}`}
                style={{ background: { green: "#16a34a", red: "#e11d48", blue: "#0ea5e9", amber: "#f59e0b", teal: "#0d9488" }[c] }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <Input label="Warranty" value={values.warranty} onChange={(e) => set("warranty", e.target.value)} placeholder="e.g. 1 year manufacturer warranty" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Tags</label>
          <div className="flex flex-wrap gap-2">
            {values.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {tag}
                <button type="button" onClick={() => set("tags", values.tags.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag and press Enter"
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">SEO</h2>
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
  );
}
