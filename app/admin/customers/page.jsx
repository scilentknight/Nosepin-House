"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SquarePen, ToggleRight, ToggleLeft, CheckCircle, XCircle } from "lucide-react";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 20;

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState(null);

  const load = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (verified) params.set("verified", verified);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    fetch(`/api/admin/customers?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setRows(json.data?.customers ?? []);
        setTotal(json.data?.total ?? 0);
      })
      .finally(() => setIsLoading(false));
  }, [search, verified, page]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function confirmToggleVerified() {
    if (!verifyTarget) return;
    setIsBusy(true);
    const next = !verifyTarget.emailVerified;
    const res = await fetch(`/api/admin/customers/${verifyTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailVerified: next }),
    });
    setIsBusy(false);
    if (res.ok) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === verifyTarget.id
            ? { ...r, emailVerified: next ? new Date().toISOString() : null }
            : r,
        ),
      );
    }
    setVerifyTarget(null);
  }

  function roleLabel(role) {
    if (role === "ADMIN") return "Admin";
    return "User";
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and edit registered store customers.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name, email, or phone..."
          className="w-full sm:w-80"
        />
        <select
          value={verified}
          onChange={(e) => {
            setVerified(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">All customers</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No customers found.</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    {/* <th className="px-4 py-3">Orders</th> */}
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
    <tr key={row.id}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
        <img
  src={row.image || "/default-avatar.jpg"}
  alt={row.name || "User"}
  className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
  onError={(e) => {
    const img = e.currentTarget;

    if (!img.src.endsWith("/default-avatar.jpg")) {
      img.src = "/default-avatar.jpg";
    } else {
      img.onerror = null;
    }
  }}
/>

          <div className="font-medium text-gray-900">
            {row.name}
          </div>
        </div>
      </td>
                      <td className="px-4 py-3 text-gray-600">{row.phone || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-600">{row.email || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {roleLabel(row.role)}
                        </span>
                      </td>
                      {/* <td className="px-4 py-3 text-gray-600">{row._count?.orders ?? 0}</td> */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.emailVerified
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                        <div className="group relative inline-flex">
  {row.emailVerified ? (
    <CheckCircle className="h-5 w-5 text-green-600" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  )}

  <span
    className="absolute bottom-full left-1/2 z-10 mb-2
               -translate-x-1/2 whitespace-nowrap rounded
               bg-gray-900 px-2 py-1 text-xs text-white
               opacity-0 pointer-events-none
               group-hover:opacity-100 transition-opacity"
  >
    {row.emailVerified ? "Verified" : "Unverified"}
  </span>
</div>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setVerifyTarget(row)}
                            disabled={isBusy}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                          >
                           <div className="group relative inline-flex">
  {row.emailVerified ? (
    <ToggleRight className="h-6 w-6 text-green-600" />
  ) : (
    <ToggleLeft className="h-6 w-6 text-gray-400" />
  )}

  <span className="absolute bottom-full left-1/2 z-10 mb-2
                   -translate-x-1/2 whitespace-nowrap rounded
                   bg-gray-900 px-2 py-1 text-xs text-white
                   opacity-0 pointer-events-none
                   group-hover:opacity-100 transition-opacity">
    {row.emailVerified ? "Verified" : "Unverified"}
  </span>
</div>

                          </button>
                          <Link
                            href={`/admin/customers/${row.id}`}
                            title="Edit"
                            aria-label="Edit customer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                          >
                            <SquarePen className="h-5 w-5 text-slate-500 font-bold" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-gray-100 md:hidden">
              {rows.map((row) => (
                <li key={row.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{row.name}</p>
                      <p className="truncate text-xs text-gray-400">{row.email}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.emailVerified
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {row.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {roleLabel(row.role)} · {row.phone || "No phone"} · {row._count?.orders ?? 0} orders · {formatDate(row.createdAt)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVerifyTarget(row)}
                      disabled={isBusy}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 disabled:opacity-50"
                    >
                      {row.emailVerified ? "Unverify" : "Verify"}
                    </button>
                    <Link
                      href={`/admin/customers/${row.id}`}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={verifyTarget !== null}
        title={verifyTarget?.emailVerified ? "Unverify this customer?" : "Verify this customer?"}
        description={
          verifyTarget?.emailVerified
            ? `${verifyTarget.name} will be marked as unverified.`
            : `${verifyTarget?.name ?? "This customer"} will be marked as verified.`
        }
        confirmLabel={verifyTarget?.emailVerified ? "Unverify" : "Verify"}
        danger={Boolean(verifyTarget?.emailVerified)}
        isBusy={isBusy}
        onConfirm={confirmToggleVerified}
        onCancel={() => setVerifyTarget(null)}
      />
    </div>
  );
}
