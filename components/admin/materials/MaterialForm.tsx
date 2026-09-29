"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PurityRow {
  id?: string;
  name: string;
  code: string;
  fineness: string;
  isActive?: boolean;
}

interface MaterialFormProps {
  initialData?: {
    id: string;
    name: string;
    code: string;
    type: string;
    unit: string;
    description?: string | null;
    isActive: boolean;
    purities: {
      id: string;
      name: string;
      code: string;
      fineness: number | null;
      isActive: boolean;
    }[];
  };
}

const MATERIAL_TYPES = [
  { value: "PRECIOUS_METAL", label: "Precious Metal" },
  { value: "DIAMOND", label: "Diamond" },
  { value: "GEMSTONE", label: "Gemstone" },
  { value: "OTHER", label: "Other" },
];

const UNITS = [
  { value: "GRAM", label: "Gram" },
  { value: "CARAT", label: "Carat" },
  { value: "KILOGRAM", label: "Kilogram" },
  { value: "PIECE", label: "Piece" },
  { value: "MILLIGRAM", label: "Milligram" },
  { value: "MILLILITER", label: "Milliliter" },
];

export function MaterialForm({ initialData }: MaterialFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [name, setName] = useState(initialData?.name || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [type, setType] = useState(initialData?.type || "PRECIOUS_METAL");
  const [unit, setUnit] = useState(initialData?.unit || "GRAM");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [purities, setPurities] = useState<PurityRow[]>(
    initialData?.purities?.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      fineness: p.fineness !== null ? String(p.fineness) : "",
      isActive: p.isActive,
    })) || [{ name: "", code: "", fineness: "", isActive: true }],
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function addPurity() {
    setPurities([
      ...purities,
      { name: "", code: "", fineness: "", isActive: true },
    ]);
  }

  function removePurity(index: number) {
    if (purities.length === 1 && !isEdit) {
      return;
    }
    setPurities(purities.filter((_, i) => i !== index));
  }

  function updatePurity(index: number, field: keyof PurityRow, value: any) {
    setPurities(
      purities.map((purity, i) =>
        i === index ? { ...purity, [field]: value } : purity,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/materials/${initialData!.id}`
        : "/api/admin/materials";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          type,
          unit,
          description,
          isActive,
          purities: purities.map((purity) => ({
            id: purity.id,
            name: purity.name,
            code: purity.code,
            fineness: purity.fineness === "" ? null : Number(purity.fineness),
            isActive: purity.isActive ?? true,
          })),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to save material");
      }

      setMessage({
        type: "success",
        text: json.message || "Material saved successfully!",
      });
      setTimeout(() => {
        router.push("/admin/materials");
        router.refresh();
      }, 800);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (
      !confirm(
        `Are you sure you want to delete or deactivate ${initialData.name}?`,
      )
    )
      return;

    setDeleting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/materials/${initialData.id}`, {
        method: "DELETE",
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to delete material");
      }

      setMessage({ type: "success", text: json.message });
      setTimeout(() => {
        router.push("/admin/materials");
        router.refresh();
      }, 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete material",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-xl p-4 text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Material Details Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Material Information" : "Material Details"}
          </h2>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-slate-800 focus:ring-slate-400"
              />
              Active Material
            </label>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Material Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gold"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Material Code *
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. GOLD"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Material Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              {MATERIAL_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Base Unit *
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              {UNITS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief summary of material"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Purities / Grades Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Purities & Grades
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Configure available purities or grades (e.g. 24K, 22K, 18K for
              Gold; 925, 999 for Silver).
            </p>
          </div>

          <Button
            type="button"
            variant="adminOutline"
            size="sm"
            onClick={addPurity}
          >
            <Plus className="h-4 w-4" />
            Add Purity
          </Button>
        </div>

        <div className="space-y-3">
          {purities.map((purity, index) => (
            <div
              key={index}
              className="grid gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 items-center md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Purity Name *
                </label>
                <input
                  value={purity.name}
                  onChange={(e) => updatePurity(index, "name", e.target.value)}
                  placeholder="e.g. 24K"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Code *
                </label>
                <input
                  value={purity.code}
                  onChange={(e) => updatePurity(index, "code", e.target.value)}
                  placeholder="e.g. 24K"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-mono text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fineness (Ratio / per-mille)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={purity.fineness}
                  onChange={(e) =>
                    updatePurity(index, "fineness", e.target.value)
                  }
                  placeholder="e.g. 0.999"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-mono text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="md:col-span-3 flex items-center justify-between gap-2 mt-2 md:mt-0">
                {isEdit && (
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={purity.isActive ?? true}
                      onChange={(e) =>
                        updatePurity(index, "isActive", e.target.checked)
                      }
                      className="h-3.5 w-3.5 rounded border-gray-300 text-slate-800"
                    />
                    Active
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => removePurity(index)}
                  title="Remove purity"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        {isEdit ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={deleting}
            onClick={handleDelete}
          >
            Delete Material
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="adminOutline"
            size="sm"
            onClick={() => router.push("/admin/materials")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="admin" size="sm" isLoading={saving}>
            {isEdit ? "Update Material" : "Create Material"}
          </Button>
        </div>
      </div>
    </form>
  );
}
