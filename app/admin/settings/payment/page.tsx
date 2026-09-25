"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface PaymentSettingsValues {
  codEnabled: boolean;
  codMinOrderAmount: string;
  codMaxOrderAmount: string;
  esewaEnabled: boolean;
  esewaLogo: string | null;
  esewaProductCode: string;
  esewaSecretKey: string;
  esewaPaymentUrl: string;
  esewaStatusUrl: string;
}

const EMPTY: PaymentSettingsValues = {
  codEnabled: true,
  codMinOrderAmount: "",
  codMaxOrderAmount: "",
  esewaEnabled: true,
  esewaLogo: null,
  esewaProductCode: "",
  esewaSecretKey: "",
  esewaPaymentUrl: "",
  esewaStatusUrl: "",
};

export default function PaymentSettingsPage() {
  const [values, setValues] = useState<PaymentSettingsValues>(EMPTY);
  const [hasSecretKey, setHasSecretKey] = useState(false);
  const [secretTouched, setSecretTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/payment")
      .then((res) => res.json())
      .then((json) => {
        const s = json.data;
        setValues({
          codEnabled: s.codEnabled,
          codMinOrderAmount: s.codMinOrderAmount?.toString() ?? "",
          codMaxOrderAmount: s.codMaxOrderAmount?.toString() ?? "",
          esewaEnabled: s.esewaEnabled,
          esewaLogo: s.esewaLogo ?? null,
          esewaProductCode: s.esewaProductCode ?? "",
          esewaSecretKey: "",
          esewaPaymentUrl: s.esewaPaymentUrl ?? "",
          esewaStatusUrl: s.esewaStatusUrl ?? "",
        });
        setHasSecretKey(s.hasEsewaSecretKey);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function set<K extends keyof PaymentSettingsValues>(key: K, value: PaymentSettingsValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/settings/payment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codEnabled: values.codEnabled,
        codMinOrderAmount: values.codMinOrderAmount.trim() === "" ? null : Number(values.codMinOrderAmount),
        codMaxOrderAmount: values.codMaxOrderAmount.trim() === "" ? null : Number(values.codMaxOrderAmount),
        esewaEnabled: values.esewaEnabled,
        esewaLogo: values.esewaLogo,
        esewaProductCode: values.esewaProductCode || null,
        esewaPaymentUrl: values.esewaPaymentUrl || null,
        esewaStatusUrl: values.esewaStatusUrl || null,
        esewaSecretKey: secretTouched ? values.esewaSecretKey : undefined,
      }),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    setHasSecretKey(json.data.hasEsewaSecretKey);
    setSecretTouched(false);
    setValues((v) => ({ ...v, esewaSecretKey: "" }));
    setMessage("Payment settings saved");
  }

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payment Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Control which payment methods customers can use at checkout. Leave eSewa credentials blank to use the sandbox defaults.
      </p>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cash on Delivery</h2>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={values.codEnabled} onChange={(e) => set("codEnabled", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
            Enable Cash on Delivery
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Minimum order amount"
              type="number"
              value={values.codMinOrderAmount}
              onChange={(e) => set("codMinOrderAmount", e.target.value)}
              placeholder="No minimum"
            />
            <Input
              label="Maximum order amount"
              type="number"
              value={values.codMaxOrderAmount}
              onChange={(e) => set("codMaxOrderAmount", e.target.value)}
              placeholder="No maximum"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            {values.esewaLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.esewaLogo} alt="eSewa" className="h-7 w-auto max-w-[72px] shrink-0 rounded object-contain" />
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#60BB46] text-xs font-bold text-white">
                e
              </span>
            )}
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">eSewa</h2>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={values.esewaEnabled} onChange={(e) => set("esewaEnabled", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
            Enable eSewa online payment
          </label>
          <ImageUpload
            label="Gateway logo (shown at checkout)"
            value={values.esewaLogo}
            onChange={(url) => set("esewaLogo", url)}
            folder="payment"
            size="lg"
            fit="contain"
          />
          <Input label="Product code" value={values.esewaProductCode} onChange={(e) => set("esewaProductCode", e.target.value)} placeholder="EPAYTEST" />
          <Input
            label={`Secret key${hasSecretKey && !secretTouched ? " (saved)" : ""}`}
            type="password"
            value={values.esewaSecretKey}
            onChange={(e) => {
              setSecretTouched(true);
              set("esewaSecretKey", e.target.value);
            }}
            placeholder={hasSecretKey ? "Leave blank to keep existing key" : ""}
          />
          <Input label="Payment URL" value={values.esewaPaymentUrl} onChange={(e) => set("esewaPaymentUrl", e.target.value)} placeholder="https://rc-epay.esewa.com.np/api/epay/main/v2/form" />
          <Input label="Status check URL" value={values.esewaStatusUrl} onChange={(e) => set("esewaStatusUrl", e.target.value)} placeholder="https://rc.esewa.com.np/api/epay/transaction/status/" />
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
