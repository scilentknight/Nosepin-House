"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Star, Trash2, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ReviewRow {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  product: { name: string; slug: string };
  user: { name: string; email: string };
}

const PAGE_SIZE = 20;

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5" fill={i < rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    fetch(`/api/admin/reviews?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setRows(json.data?.reviews ?? []);
        setTotal(json.data?.total ?? 0);
      })
      .finally(() => setIsLoading(false));
  }, [search, status, page]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function updateStatus(id: number, next: ReviewStatus) {
    setIsBusy(true);
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setIsBusy(false);
    load();
  }

  async function handleDelete() {
    if (deleteTarget === null) return;
    setIsBusy(true);
    await fetch(`/api/admin/reviews/${deleteTarget}`, { method: "DELETE" });
    setIsBusy(false);
    setDeleteTarget(null);
    load();
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">Moderate customer reviews before they go live on product pages.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by product or comment..."
          className="w-full sm:w-72"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No reviews found.</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Reviewer</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Comment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3">
                        <Link href={`/admin/products/${r.productId}`} className="font-medium text-gray-900 hover:text-slate-600">
                          {r.product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">{r.user.name}</div>
                        <div className="text-xs text-gray-400">{r.user.email}</div>
                      </td>
                      <td className="px-4 py-3"><StarRow rating={r.rating} /></td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-gray-600">{r.comment}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status !== "APPROVED" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(r.id, "APPROVED")}
                              disabled={isBusy}
                              title="Approve"
                              aria-label="Approve"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {r.status !== "REJECTED" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(r.id, "REJECTED")}
                              disabled={isBusy}
                              title="Reject"
                              aria-label="Reject"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(r.id)}
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
              {rows.map((r) => (
                <li key={r.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/admin/products/${r.productId}`} className="text-sm font-medium text-gray-900">
                      {r.product.name}
                    </Link>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{r.user.name} · {r.user.email}</div>
                  <div className="mt-2"><StarRow rating={r.rating} /></div>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{r.comment}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {r.status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(r.id, "APPROVED")}
                        disabled={isBusy}
                        title="Approve"
                        aria-label="Approve"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {r.status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(r.id, "REJECTED")}
                        disabled={isBusy}
                        title="Reject"
                        aria-label="Reject"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(r.id)}
                      title="Delete"
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
        title="Delete this review?"
        description="This will permanently remove the review. This cannot be undone."
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
