"use client";

import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface AttributeValue {
  id: string;
  value: string;
  colorHex: string | null;
  sortOrder: number;
}

interface Attribute {
  id: string;
  name: string;
  type: "TEXT" | "COLOR";
  sortOrder: number;
  values: AttributeValue[];
}

interface ValueDraft {
  value: string;
  colorHex: string;
}

const EMPTY_DRAFT: ValueDraft = { value: "", colorHex: "#3366ff" };

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] = useState<"TEXT" | "COLOR">("TEXT");
  const [valueDrafts, setValueDrafts] = useState<Record<string, ValueDraft>>({});
  const [error, setError] = useState<string | null>(null);
  const [deleteAttrTarget, setDeleteAttrTarget] = useState<string | null>(null);
  const [deleteValueTarget, setDeleteValueTarget] = useState<{ attributeId: string; valueId: string } | null>(null);

  function load() {
    setIsLoading(true);
    fetch("/api/admin/attributes")
      .then((res) => res.json())
      .then((json) => setAttributes(json.data ?? []))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  async function addAttribute() {
    if (!newAttributeName.trim()) return;
    setError(null);
    const res = await fetch("/api/admin/attributes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newAttributeName.trim(), type: newAttributeType }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message);
      return;
    }
    setNewAttributeName("");
    setNewAttributeType("TEXT");
    load();
  }

  function draftFor(attributeId: string): ValueDraft {
    return valueDrafts[attributeId] ?? EMPTY_DRAFT;
  }

  function updateDraft(attributeId: string, patch: Partial<ValueDraft>) {
    setValueDrafts((prev) => ({ ...prev, [attributeId]: { ...draftFor(attributeId), ...patch } }));
  }

  async function addValue(attribute: Attribute) {
    const draft = draftFor(attribute.id);
    const value = draft.value.trim();
    if (!value) return;
    setError(null);
    const res = await fetch(`/api/admin/attributes/${attribute.id}/values`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value,
        colorHex: attribute.type === "COLOR" ? draft.colorHex : undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message);
      return;
    }
    setValueDrafts((prev) => ({ ...prev, [attribute.id]: EMPTY_DRAFT }));
    load();
  }

  async function deleteAttribute() {
    if (!deleteAttrTarget) return;
    setError(null);
    const res = await fetch(`/api/admin/attributes/${deleteAttrTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteAttrTarget(null);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    load();
  }

  async function deleteValue() {
    if (!deleteValueTarget) return;
    setError(null);
    const res = await fetch(`/api/admin/attribute-values/${deleteValueTarget.valueId}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteValueTarget(null);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Attributes</h1>
      <p className="mt-1 text-sm text-gray-500">
        Define reusable attributes (Color, Size, Material...) and their values. These power the product variant generator.
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex max-w-lg flex-wrap gap-2">
        <Input
          placeholder="New attribute name, e.g. Color"
          value={newAttributeName}
          onChange={(e) => setNewAttributeName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAttribute()}
          className="flex-1"
        />
        <select
          value={newAttributeType}
          onChange={(e) => setNewAttributeType(e.target.value as "TEXT" | "COLOR")}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="TEXT">Text</option>
          <option value="COLOR">Color swatch</option>
        </select>
        <Button variant="admin" onClick={addAttribute}>Add attribute</Button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {attributes.map((attr) => (
            <div key={attr.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">{attr.name}</h2>
                  {attr.type === "COLOR" && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Color
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteAttrTarget(attr.id)}
                  title="Delete attribute"
                  aria-label="Delete attribute"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {attr.values.map((v) => (
                  <span
                    key={v.id}
                    className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {attr.type === "COLOR" && v.colorHex && (
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    {v.value}
                    <button
                      type="button"
                      onClick={() => setDeleteValueTarget({ attributeId: attr.id, valueId: v.id })}
                      aria-label={`Remove ${v.value}`}
                      className="flex h-4 w-4 items-center justify-center text-slate-500 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {attr.values.length === 0 && <span className="text-xs text-gray-400">No values yet</span>}
              </div>

              <div className="mt-3 flex gap-2">
                {attr.type === "COLOR" && (
                  <input
                    type="color"
                    value={draftFor(attr.id).colorHex}
                    onChange={(e) => updateDraft(attr.id, { colorHex: e.target.value })}
                    className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                    title="Pick color"
                  />
                )}
                <input
                  value={draftFor(attr.id).value}
                  onChange={(e) => updateDraft(attr.id, { value: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addValue(attr)}
                  placeholder={attr.type === "COLOR" ? "Color name, e.g. Red" : "Add value..."}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
                <Button size="sm" variant="adminOutline" onClick={() => addValue(attr)}>
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteAttrTarget !== null}
        title="Delete attribute?"
        description="This also deletes all its values. Attributes in use by existing variants cannot be deleted."
        confirmLabel="Delete"
        danger
        onConfirm={deleteAttribute}
        onCancel={() => setDeleteAttrTarget(null)}
      />
      <ConfirmDialog
        open={deleteValueTarget !== null}
        title="Delete value?"
        description="Values used by existing variants cannot be deleted."
        confirmLabel="Delete"
        danger
        onConfirm={deleteValue}
        onCancel={() => setDeleteValueTarget(null)}
      />
    </div>
  );
}
