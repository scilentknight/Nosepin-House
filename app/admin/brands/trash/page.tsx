"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface TrashedBrand {
  id: string;
  name: string;
  slug: string;
}

export default function BrandTrashPage() {
  const [brands, setBrands] = useState<TrashedBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permanentTarget, setPermanentTarget] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    fetch("/api/admin/brands?trashed=true&pageSize=100")
      .then((res) => res.json())
      .then((json) => setBrands(json.data?.brands ?? []))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  async function restore(id: string) {
    setIsBusy(true);
    await fetch(`/api/admin/brands/${id}/restore`, { method: "POST" });
    setIsBusy(false);
    load();
  }

  async function permanentDelete() {
    if (!permanentTarget) return;
    setIsBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/brands/${permanentTarget}/permanent`, { method: "DELETE" });
    const json = await res.json();
    setIsBusy(false);
    setPermanentTarget(null);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Trashed Brands</h1>
        <Link href="/admin/brands" className="text-sm font-medium text-slate-600 hover:text-slate-800">
          Back to brands
        </Link>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : brands.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No trashed brands.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {brands.map((b) => (
              <li key={b.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{b.name}</p>
                  <p className="truncate text-xs text-gray-400">/{b.slug}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="adminOutline" disabled={isBusy} onClick={() => restore(b.id)}>
                    Restore
                  </Button>
                  <Button size="sm" variant="danger" disabled={isBusy} onClick={() => setPermanentTarget(b.id)}>
                    Delete permanently
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={permanentTarget !== null}
        title="Permanently delete brand?"
        description="This cannot be undone. Brands with existing products cannot be deleted."
        confirmLabel="Delete permanently"
        danger
        isBusy={isBusy}
        onConfirm={permanentDelete}
        onCancel={() => setPermanentTarget(null)}
      />
    </div>
  );
}
