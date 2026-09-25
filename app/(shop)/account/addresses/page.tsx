"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { type AddressInput } from "@/schemas/checkout";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AddressForm } from "@/components/account/AddressForm";

interface SavedAddress extends AddressInput {
  id: number;
  isDefault: boolean;
  province: { name: string };
  district: { name: string };
  municipality: { name: string };
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formMode, setFormMode] = useState<"closed" | "create" | number>("closed");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  function load() {
    setIsLoading(true);
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((json) => setAddresses(json.data ?? []))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  function openCreate() {
    setFormError(null);
    setFormMode("create");
  }

  function openEdit(addr: SavedAddress) {
    setFormError(null);
    setFormMode(addr.id);
  }

  const editingAddress = typeof formMode === "number" ? addresses.find((a) => a.id === formMode) : undefined;

  async function onSubmit(values: AddressInput) {
    setIsSaving(true);
    setFormError(null);
    const isEdit = typeof formMode === "number";
    const url = isEdit ? `/api/addresses/${formMode}` : "/api/addresses";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setFormError(json.message ?? "Something went wrong");
      return;
    }
    setFormMode("closed");
    load();
  }

  async function handleSetDefault(id: number) {
    setIsBusy(true);
    await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    setIsBusy(false);
    load();
  }

  async function handleDelete() {
    if (deleteTarget === null) return;
    setIsBusy(true);
    await fetch(`/api/addresses/${deleteTarget}`, { method: "DELETE" });
    setIsBusy(false);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Addresses</h1>
        {formMode === "closed" && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Address
          </Button>
        )}
      </div>

      {formMode !== "closed" && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {typeof formMode === "number" ? "Edit Address" : "New Address"}
          </h2>
          <AddressForm
            key={String(formMode)}
            defaultValues={editingAddress}
            onSubmit={onSubmit}
            onCancel={() => setFormMode("closed")}
            isSaving={isSaving}
            formError={formError}
          />
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : addresses.length === 0 ? (
          formMode === "closed" && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              You haven&apos;t saved any addresses yet.
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <p className="min-w-0 truncate font-semibold text-gray-900">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="shrink-0 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
                        Default
                      </span>
                    )}
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-600">
                      {addr.addressType.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(addr)}
                      title="Edit"
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(addr.id)}
                      title="Delete"
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {addr.line1}
                  {addr.landmark ? ` (near ${addr.landmark})` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.municipality.name} — Ward {addr.wardNo}, {addr.district.name}, {addr.province.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">{addr.phone}</p>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={isBusy}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline disabled:opacity-60"
                  >
                    <Star className="h-3.5 w-3.5" /> Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this address?"
        description="This can't be undone."
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
