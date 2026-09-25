"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Variant {
  id: string;
  sku: string | null;
  price: number | null;
  compareAtPrice: number | null;
  costPrice: number | null;
  stockQuantity: number;
  weight: number | null;
  image: string | null;
  status: "ACTIVE" | "INACTIVE";
  label: string;
}

function VariantRow({
  variant,
  selected,
  onToggleSelect,
  onSaved,
  onDelete,
}: {
  variant: Variant;
  selected: boolean;
  onToggleSelect: () => void;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const [local, setLocal] = useState(variant);
  const [isSaving, setIsSaving] = useState(false);

  async function save(patch: Partial<Variant>) {
    const next = { ...local, ...patch };
    setLocal(next);
    setIsSaving(true);
    await fetch(`/api/admin/variants/${variant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: next.sku,
        price: next.price,
        compareAtPrice: next.compareAtPrice,
        costPrice: next.costPrice,
        stockQuantity: next.stockQuantity,
        weight: next.weight,
        image: next.image,
        status: next.status,
        attributeValueIds: [],
      }),
    });
    setIsSaving(false);
    onSaved();
  }

  const cellClass = "w-24 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-100";

  return (
    <tr className={isSaving ? "opacity-60" : ""}>
      <td className="px-3 py-2">
        <input type="checkbox" checked={selected} onChange={onToggleSelect} className="h-4 w-4 rounded border-gray-300" />
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <ImageUpload value={local.image} onChange={(url) => save({ image: url })} folder="variants" size="sm" />
          </div>
          <span className="text-sm font-medium text-gray-800">{local.label || "Default"}</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <input
          value={local.sku ?? ""}
          onChange={(e) => setLocal({ ...local, sku: e.target.value })}
          onBlur={() => save({ sku: local.sku })}
          className={`${cellClass} w-32`}
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={local.price ?? ""}
          onChange={(e) => setLocal({ ...local, price: e.target.value === "" ? null : Number(e.target.value) })}
          onBlur={() => save({ price: local.price })}
          className={cellClass}
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={local.compareAtPrice ?? ""}
          onChange={(e) => setLocal({ ...local, compareAtPrice: e.target.value === "" ? null : Number(e.target.value) })}
          onBlur={() => save({ compareAtPrice: local.compareAtPrice })}
          className={cellClass}
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={local.costPrice ?? ""}
          onChange={(e) => setLocal({ ...local, costPrice: e.target.value === "" ? null : Number(e.target.value) })}
          onBlur={() => save({ costPrice: local.costPrice })}
          className={cellClass}
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={local.stockQuantity}
          onChange={(e) => setLocal({ ...local, stockQuantity: Number(e.target.value) })}
          onBlur={() => save({ stockQuantity: local.stockQuantity })}
          className={cellClass}
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          step="0.001"
          value={local.weight ?? ""}
          onChange={(e) => setLocal({ ...local, weight: e.target.value === "" ? null : Number(e.target.value) })}
          onBlur={() => save({ weight: local.weight })}
          className={cellClass}
        />
      </td>
      <td className="px-3 py-2">
        <select
          value={local.status}
          onChange={(e) => save({ status: e.target.value as Variant["status"] })}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-100"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </td>
      <td className="px-3 py-2 text-right">
        <button type="button" onClick={onDelete} className="text-xs font-medium text-red-600 hover:text-red-800">
          Delete
        </button>
      </td>
    </tr>
  );
}

export function VariantsManager({ productId }: { productId: string }) {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedValuesByAttr, setSelectedValuesByAttr] = useState<Record<string, Set<string>>>({});
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showTrashed, setShowTrashed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [bulkStatus, setBulkStatus] = useState<"" | "ACTIVE" | "INACTIVE">("");

  function loadVariants() {
    fetch(`/api/admin/products/${productId}/variants${showTrashed ? "?trashed=true" : ""}`)
      .then((res) => res.json())
      .then((json) => setVariants(json.data ?? []));
  }

  useEffect(() => {
    fetch("/api/admin/attributes")
      .then((res) => res.json())
      .then((json) => setAttributes(json.data ?? []));
  }, []);

  useEffect(loadVariants, [productId, showTrashed]);

  function toggleValue(attributeId: string, valueId: string) {
    setSelectedValuesByAttr((prev) => {
      const set = new Set(prev[attributeId] ?? []);
      if (set.has(valueId)) set.delete(valueId);
      else set.add(valueId);
      return { ...prev, [attributeId]: set };
    });
  }

  async function generate() {
    const groups = Object.values(selectedValuesByAttr)
      .map((set) => Array.from(set))
      .filter((g) => g.length > 0);
    if (groups.length === 0) {
      setMessage("Select at least one attribute value first");
      return;
    }
    setIsBusy(true);
    const res = await fetch(`/api/admin/products/${productId}/variants/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attributeValueGroups: groups }),
    });
    const json = await res.json();
    setIsBusy(false);
    setMessage(json.message);
    loadVariants();
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function applyBulkFields() {
    setIsBusy(true);
    await fetch(`/api/admin/products/${productId}/variants/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: Array.from(selectedIds),
        ...(bulkPrice.trim() !== "" ? { price: Number(bulkPrice) } : {}),
        ...(bulkStock.trim() !== "" ? { stockQuantity: Number(bulkStock) } : {}),
        ...(bulkStatus ? { status: bulkStatus } : {}),
      }),
    });
    setIsBusy(false);
    setBulkPrice("");
    setBulkStock("");
    setBulkStatus("");
    setSelectedIds(new Set());
    loadVariants();
  }

  async function handleBulkAction(action: string) {
    setIsBusy(true);
    await fetch(`/api/admin/products/${productId}/variants/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), action }),
    });
    setIsBusy(false);
    setSelectedIds(new Set());
    loadVariants();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsBusy(true);
    await fetch(`/api/admin/variants/${deleteTarget}`, { method: "DELETE" });
    setIsBusy(false);
    setDeleteTarget(null);
    loadVariants();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Generate variants</h2>
        <p className="mt-1 text-xs text-gray-400">
          Select the attribute values that apply to this product. Every combination will be generated automatically.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {attributes.map((attr) => (
            <div key={attr.id}>
              <p className="text-sm font-medium text-gray-700">{attr.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {attr.values.map((v) => {
                  const isSelected = selectedValuesByAttr[attr.id]?.has(v.id) ?? false;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleValue(attr.id, v.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        isSelected ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {v.value}
                    </button>
                  );
                })}
                {attr.values.length === 0 && <span className="text-xs text-gray-400">No values defined yet</span>}
              </div>
            </div>
          ))}
          {attributes.length === 0 && (
            <p className="text-sm text-gray-500">
              No attributes defined yet. Create attributes like Color or Size from the Attributes page first.
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button type="button" variant="admin" size="sm" isLoading={isBusy} onClick={generate}>
            Generate variants
          </Button>
          {message && <span className="text-xs text-gray-500">{message}</span>}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {showTrashed ? "Trashed variants" : "Variants"}
          </h2>
          <button type="button" onClick={() => setShowTrashed((v) => !v)} className="text-xs font-medium text-slate-600 hover:text-slate-800">
            {showTrashed ? "Show active variants" : "Show trashed variants"}
          </button>
        </div>

        {!showTrashed && (
          <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg bg-gray-50 p-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Bulk price</label>
              <input
                type="number"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-28 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Bulk stock</label>
              <input
                type="number"
                value={bulkStock}
                onChange={(e) => setBulkStock(e.target.value)}
                className="w-28 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Bulk status</label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as typeof bulkStatus)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="">No change</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <Button size="sm" variant="adminOutline" disabled={selectedIds.size === 0} isLoading={isBusy} onClick={applyBulkFields}>
              Apply to {selectedIds.size} selected
            </Button>
          </div>
        )}

        <div className="mt-3">
          <BulkActionBar
            selectedCount={selectedIds.size}
            isBusy={isBusy}
            onClear={() => setSelectedIds(new Set())}
            onAction={handleBulkAction}
            actions={
              showTrashed
                ? [{ key: "restore", label: "Restore" }]
                : [{ key: "delete", label: "Delete", variant: "danger" }]
            }
          />
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="w-10 px-3 py-2"></th>
                <th className="px-3 py-2">Variant</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Compare</th>
                <th className="px-3 py-2">Cost</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Weight</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {variants.map((v) =>
                showTrashed ? (
                  <tr key={v.id}>
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedIds.has(v.id)} onChange={() => toggleSelect(v.id)} className="h-4 w-4 rounded border-gray-300" />
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-gray-800">{v.label || "Default"}</td>
                    <td className="px-3 py-2 text-gray-500">{v.sku}</td>
                    <td className="px-3 py-2 text-gray-500">{v.price}</td>
                    <td className="px-3 py-2 text-gray-500">{v.compareAtPrice}</td>
                    <td className="px-3 py-2 text-gray-500">{v.costPrice}</td>
                    <td className="px-3 py-2 text-gray-500">{v.stockQuantity}</td>
                    <td className="px-3 py-2 text-gray-500">{v.weight}</td>
                    <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                    <td className="px-3 py-2"></td>
                  </tr>
                ) : (
                  <VariantRow
                    key={v.id}
                    variant={v}
                    selected={selectedIds.has(v.id)}
                    onToggleSelect={() => toggleSelect(v.id)}
                    onSaved={loadVariants}
                    onDelete={() => setDeleteTarget(v.id)}
                  />
                )
              )}
            </tbody>
          </table>
          {variants.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No variants yet.</p>}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Move variant to trash?"
        confirmLabel="Move to trash"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
