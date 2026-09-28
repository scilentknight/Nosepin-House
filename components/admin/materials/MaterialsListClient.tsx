"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Power } from "lucide-react";
import { SearchInput } from "@/components/admin/SearchInput";
import { StatusBadge } from "@/components/ui/Badge";

interface Purity {
  id: string;
  name: string;
  code: string;
  fineness: number | null;
  isActive: boolean;
}

interface MaterialItem {
  id: string;
  name: string;
  code: string;
  type: string;
  unit: string;
  description: string | null;
  isActive: boolean;
  purities: Purity[];
}

interface MaterialsListClientProps {
  initialMaterials: MaterialItem[];
}

export function MaterialsListClient({ initialMaterials }: MaterialsListClientProps) {
  const router = useRouter();
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(search.toLowerCase()) ||
      material.code.toLowerCase().includes(search.toLowerCase()) ||
      material.purities.some((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "ALL" || material.type === typeFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && material.isActive) ||
      (statusFilter === "INACTIVE" && !material.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  async function handleToggleStatus(material: MaterialItem) {
    try {
      const response = await fetch(`/api/admin/materials/${material.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !material.isActive,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Failed to update material status");
      }

      setMaterials((prev) =>
        prev.map((m) => (m.id === material.id ? { ...m, isActive: !m.isActive } : m)),
      );

      setMessage({
        type: "success",
        text: `Material "${material.name}" ${!material.isActive ? "activated" : "deactivated"}`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update status",
      });
    }
  }

  async function handleDelete(material: MaterialItem) {
    if (!confirm(`Are you sure you want to delete or deactivate "${material.name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/materials/${material.id}`, {
        method: "DELETE",
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to delete material");
      }

      setMessage({ type: "success", text: json.message });
      router.refresh();
      setMaterials((prev) => prev.filter((m) => m.id !== material.id));
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete material",
      });
    }
  }

  return (
    <div className="space-y-4">
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

      {/* Search and Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search material, code, or purity..."
          className="w-full sm:w-64"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="ALL">All Material Types</option>
          <option value="PRECIOUS_METAL">Precious Metal</option>
          <option value="DIAMOND">Diamond</option>
          <option value="GEMSTONE">Gemstone</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Purities / Grades</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-gray-500">
                    No materials found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/materials/${material.id}`}
                        className="font-medium text-gray-900 hover:text-slate-600"
                      >
                        {material.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {material.code}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                      {material.type.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      Per {material.unit.toLowerCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {material.purities.map((purity) => (
                          <span
                            key={purity.id}
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              purity.isActive
                                ? "bg-gray-100 text-gray-700 border border-gray-200"
                                : "bg-gray-50 text-gray-400 line-through border border-gray-200"
                            }`}
                          >
                            {purity.name} {purity.fineness !== null ? `(${purity.fineness})` : ""}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={material.isActive ? "ACTIVE" : "INACTIVE"} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/materials/${material.id}`}
                          title="Edit material"
                          aria-label="Edit material"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(material)}
                          title={material.isActive ? "Deactivate" : "Activate"}
                          aria-label={material.isActive ? "Deactivate" : "Activate"}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                        >
                          <Power className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(material)}
                          title="Delete material"
                          aria-label="Delete material"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
