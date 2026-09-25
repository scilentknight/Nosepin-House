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

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isFeatured: boolean;
  status: "ACTIVE" | "INACTIVE";
  _count: { products: number; children: number };
  parent: { id: string; name: string } | null;
}

const PAGE_SIZE = 20;

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<CategoryRow[]>([]);
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
    fetch(`/api/admin/categories?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setRows(json.data?.categories ?? []);
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
    await fetch("/api/admin/categories/bulk", {
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
    await fetch(`/api/admin/categories/${deleteTarget}`, { method: "DELETE" });
    setIsBusy(false);
    setDeleteTarget(null);
    load();
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Organize your catalog into categories and subcategories.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/categories/trash">
            <Button variant="adminOutline" size="sm">Trash</Button>
          </Link>
          <Link href="/admin/categories/new">
            <Button variant="admin" size="sm">New Category</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search categories..." className="w-full sm:w-64" />
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

      <div className="mt-4">
        {isLoading ? (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-soft">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-soft">No categories found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-10 px-4 py-3"></th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Parent</th>
                    <th className="px-4 py-3">Products</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="h-4 w-4 rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/categories/${c.id}`} className="font-medium text-gray-900 hover:text-slate-600">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.parent?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{c._count.products}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/categories/${c.id}`}
                            title="Edit"
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(c.id)}
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
              {rows.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="h-4 w-4 shrink-0 rounded border-gray-300" />
                  <Link href={`/admin/categories/${c.id}`} className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{c.name}</Link>
                  <StatusBadge status={c.status} />
                  <Link href={`/admin/categories/${c.id}`} title="Edit" aria-label="Edit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button type="button" onClick={() => setDeleteTarget(c.id)} title="Move to trash" aria-label="Move to trash" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-2">
              <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Move category to trash?"
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
