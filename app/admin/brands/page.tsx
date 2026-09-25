"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isFeatured: boolean;
  status: "ACTIVE" | "INACTIVE";
  _count: { products: number };
}

const PAGE_SIZE = 20;

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<BrandRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBusy, setIsBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    fetch(`/api/admin/brands?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setRows(json.data?.brands ?? []);
        setTotal(json.data?.total ?? 0);
      })
      .finally(() => setIsLoading(false));
  }, [search, status, page]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkAction(action: string) {
    setIsBusy(true);
    await fetch("/api/admin/brands/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), action }),
    });
    setIsBusy(false);
    setSelectedIds(new Set());
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsBusy(true);
    await fetch(`/api/admin/brands/${deleteTarget}`, { method: "DELETE" });
    setIsBusy(false);
    setDeleteTarget(null);
    load();
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Brands</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the brands carried in your catalog.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/brands/trash">
            <Button variant="adminOutline" size="sm">Trash</Button>
          </Link>
          <Link href="/admin/brands/new">
            <Button variant="admin" size="sm">New Brand</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search brands..." className="w-full sm:w-64" />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="mt-4">
        <BulkActionBar
          selectedCount={selectedIds.size}
          isBusy={isBusy}
          onClear={() => setSelectedIds(new Set())}
          onAction={handleBulkAction}
          actions={[
            { key: "enable", label: "Enable" },
            { key: "disable", label: "Disable" },
            { key: "delete", label: "Delete", variant: "danger" },
          ]}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No brands found.</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-10 px-4 py-3"></th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Products</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} className="h-4 w-4 rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/brands/${b.id}`} className="flex items-center gap-3 font-medium text-gray-900 hover:text-slate-600">
                          {b.logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={b.logo} alt="" className="h-8 w-8 rounded-full object-cover" />
                          )}
                          {b.name}
                          {b.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Featured</span>}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{b._count.products}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/brands/${b.id}`}
                            title="Edit"
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(b.id)}
                            title="Move to trash"
                            aria-label="Move to trash"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-gray-100 md:hidden">
              {rows.map((b) => (
                <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} className="h-4 w-4 shrink-0 rounded border-gray-300" />
                  <Link href={`/admin/brands/${b.id}`} className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-medium text-gray-900">{b.name}</span>
                    {b.isFeatured && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Featured</span>
                    )}
                  </Link>
                  <StatusBadge status={b.status} />
                  <Link href={`/admin/brands/${b.id}`} title="Edit" aria-label="Edit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button type="button" onClick={() => setDeleteTarget(b.id)} title="Move to trash" aria-label="Move to trash" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-2">
              <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Move brand to trash?"
        description="You can restore it later from the trash."
        confirmLabel="Move to trash"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
