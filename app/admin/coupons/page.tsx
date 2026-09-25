"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface CouponRow {
  id: number;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderAmount: number | null;
  expiresAt: string | null;
  active: boolean;
}

const PAGE_SIZE = 20;

function formatDiscount(row: CouponRow) {
  return row.type === "PERCENT" ? `${row.value}% off` : `Rs ${row.value} off`;
}

function formatMinOrder(value: number | null) {
  return value ? `Rs ${value}` : "—";
}

function formatExpiry(value: string | null) {
  if (!value) return "No expiry";
  return new Date(value).toLocaleDateString();
}

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<CouponRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (active) params.set("active", active);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    fetch(`/api/admin/coupons?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setRows(json.data?.coupons ?? []);
        setTotal(json.data?.total ?? 0);
      })
      .finally(() => setIsLoading(false));
  }, [search, active, page]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function toggleActive(row: CouponRow) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    const res = await fetch(`/api/admin/coupons/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !row.active }),
    });
    if (!res.ok) {
      // revert on failure
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, active: row.active } : r)));
    }
  }

  async function handleDelete() {
    if (deleteTarget === null) return;
    setIsBusy(true);
    setDeleteError(null);
    const res = await fetch(`/api/admin/coupons/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setIsBusy(false);
    if (!res.ok) {
      setDeleteError(json.message ?? "Failed to delete coupon");
      return;
    }
    setDeleteTarget(null);
    load();
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Coupons</h1>
          <p className="mt-1 text-sm text-gray-500">Manage discount coupons used at checkout.</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button variant="admin" size="sm">New Coupon</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search coupon codes..." className="w-full sm:w-64" />
        <select
          value={active}
          onChange={(e) => { setActive(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">All coupons</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No coupons found.</p>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Min Order</th>
                    <th className="px-4 py-3">Expires</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3">
                        <Link href={`/admin/coupons/${c.id}`} className="font-medium text-gray-900 hover:text-slate-600">
                          {c.code}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDiscount(c)}</td>
                      <td className="px-4 py-3 text-gray-500">{formatMinOrder(c.minOrderAmount)}</td>
                      <td className="px-4 py-3 text-gray-500">{formatExpiry(c.expiresAt)}</td>
                      <td className="px-4 py-3">
                        <label className="inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={c.active}
                            onChange={() => toggleActive(c)}
                            className="h-4 w-4 rounded border-gray-300 text-slate-700 focus:ring-slate-400"
                          />
                        </label>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/coupons/${c.id}`}
                            title="Edit"
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => { setDeleteTarget(c.id); setDeleteError(null); }}
                            title="Delete"
                            aria-label="Delete"
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
                  <input
                    type="checkbox"
                    checked={c.active}
                    onChange={() => toggleActive(c)}
                    className="h-4 w-4 rounded border-gray-300 text-slate-700 focus:ring-slate-400"
                  />
                  <div className="flex-1">
                    <Link href={`/admin/coupons/${c.id}`} className="text-sm font-medium text-gray-900">{c.code}</Link>
                    <p className="text-xs text-gray-500">{formatDiscount(c)} · {formatExpiry(c.expiresAt)}</p>
                  </div>
                  <Link href={`/admin/coupons/${c.id}`} title="Edit" aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button type="button" onClick={() => { setDeleteTarget(c.id); setDeleteError(null); }} title="Delete" aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50">
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
        title="Delete this coupon?"
        description={deleteError ?? "This cannot be undone. Coupons used by existing orders cannot be deleted."}
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
      />
    </div>
  );
}
