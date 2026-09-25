"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface InvoiceSettingsValues {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  taxId: string;
  footerNote: string;
  logo: string | null;
  invoicePrefix: string;
}

const EMPTY: InvoiceSettingsValues = {
  companyName: "DXN",
  addressLine1: "",
  addressLine2: "",
  phone: "",
  email: "",
  taxId: "",
  footerNote: "",
  logo: null,
  invoicePrefix: "INV-",
};

export default function InvoiceSettingsPage() {
  const [values, setValues] = useState<InvoiceSettingsValues>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/invoice")
      .then((res) => res.json())
      .then((json) => {
        const s = json.data;
        setValues({
          companyName: s.companyName,
          addressLine1: s.addressLine1 ?? "",
          addressLine2: s.addressLine2 ?? "",
          phone: s.phone ?? "",
          email: s.email ?? "",
          taxId: s.taxId ?? "",
          footerNote: s.footerNote ?? "",
          logo: s.logo,
          invoicePrefix: s.invoicePrefix,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  function set<K extends keyof InvoiceSettingsValues>(key: K, value: InvoiceSettingsValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/settings/invoice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        addressLine1: values.addressLine1 || null,
        addressLine2: values.addressLine2 || null,
        phone: values.phone || null,
        email: values.email || null,
        taxId: values.taxId || null,
        footerNote: values.footerNote || null,
      }),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    setMessage("Invoice settings saved");
  }

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Invoice Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        This information appears on every invoice PDF generated for customer orders.
      </p>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <ImageUpload label="Company logo" value={values.logo} onChange={(url) => set("logo", url)} folder="invoices" size="lg" fit="contain" />

        <Input label="Company name (optional)" value={values.companyName} onChange={(e) => set("companyName", e.target.value)} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Address line 1" value={values.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} />
          <Input label="Address line 2" value={values.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
          <Input label="Phone" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          <Input label="Email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
          <Input label="Tax / PAN number" value={values.taxId} onChange={(e) => set("taxId", e.target.value)} />
          <Input label="Invoice number prefix" value={values.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Footer note</label>
          <textarea
            value={values.footerNote}
            onChange={(e) => set("footerNote", e.target.value)}
            rows={3}
            placeholder="e.g. Thank you for shopping with us!"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <Button type="submit" variant="admin" isLoading={isSaving} className="self-start">
          Save settings
        </Button>
      </form>
    </div>
  );
}
