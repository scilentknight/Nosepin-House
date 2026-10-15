"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDate, formatPrice } from "@/lib/format";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/customers/${params.id}`);
    const json = await res.json();
    if (!res.ok) {
      setCustomer(null);
      setIsLoading(false);
      return;
    }
    const data = json.data;
    setCustomer(data);
    setForm({
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
    });
    setIsLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/admin/customers/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone.trim() === "" ? null : form.phone,
      }),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setError(json.message ?? "Could not update customer");
      return;
    }
    setCustomer(json.data);
    setMessage("Customer details saved.");
  }

  async function toggleVerified() {
    if (!customer) return;
    setIsPatching(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/admin/customers/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailVerified: !customer.emailVerified }),
    });
    const json = await res.json();
    setIsPatching(false);
    setShowVerifyDialog(false);
    if (!res.ok) {
      setError(json.message ?? "Could not update verification");
      return;
    }
    setCustomer(json.data);
    setMessage(json.data.emailVerified ? "Customer marked as verified." : "Customer marked as unverified.");
  }

  if (isLoading) return <p className="text-sm text-gray-500">Loading customer…</p>;
  if (!customer) return <p className="text-sm text-gray-500">Customer not found.</p>;

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-sky-600 hover:underline">
        ← Back to Customers
      </Link>

      <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900">{customer.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{customer.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              customer.emailVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {customer.emailVerified ? "Verified" : "Unverified"}
          </span>
          <Button
            type="button"
            variant="adminOutline"
            size="sm"
            isLoading={isPatching}
            onClick={() => setShowVerifyDialog(true)}
            className="w-full sm:w-auto"
          >
            {customer.emailVerified ? "Mark unverified" : "Mark verified"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer details</h2>
          <form onSubmit={handleSave} className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <div className="sm:col-span-2">
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="admin" isLoading={isSaving} className="w-full sm:w-auto">
                Save changes
              </Button>
            </div>
          </form>
        </section>

        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</h2>
          <div className="mt-3 space-y-2 text-gray-600">
            <div className="flex justify-between gap-3">
              <span>Role</span>
              <span className="text-gray-900">{customer.role === "ADMIN" ? "Admin" : "User"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Joined</span>
              <span className="text-gray-900">{formatDate(customer.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Orders</span>
              <span className="text-gray-900">{customer._count?.orders ?? 0}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Reviews</span>
              <span className="text-gray-900">{customer._count?.reviews ?? 0}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Addresses</span>
              <span className="text-gray-900">{customer._count?.addresses ?? 0}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent orders</h2>
        {customer.orders?.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2">Order</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customer.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-sky-600 hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2 text-gray-600">{formatDate(order.placedAt)}</td>
                    <td className="py-2">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-2 text-right text-gray-900">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">No orders yet.</p>
        )}
      </section>

      <ConfirmDialog
        open={showVerifyDialog}
        title={customer.emailVerified ? "Unverify this customer?" : "Verify this customer?"}
        description={
          customer.emailVerified
            ? `${customer.name} will be marked as unverified.`
            : `${customer.name} will be marked as verified.`
        }
        confirmLabel={customer.emailVerified ? "Unverify" : "Verify"}
        danger={Boolean(customer.emailVerified)}
        isBusy={isPatching}
        onConfirm={toggleVerified}
        onCancel={() => setShowVerifyDialog(false)}
      />
    </div>
  );
}
