"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
export const EMPTY_COUPON = {
    code: "",
    type: "PERCENT",
    value: 0,
    minOrderAmount: null,
    expiresAt: "",
    active: true,
};
export function CouponForm({ initial, onSubmit, submitLabel }) {
    const router = useRouter();
    const [values, setValues] = useState(initial);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    function set(key, value) {
        setValues((v) => ({ ...v, [key]: value }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const result = await onSubmit(values);
        setIsSubmitting(false);
        if (!result.ok) {
            setError(result.message ?? "Something went wrong");
            return;
        }
        router.push("/admin/coupons");
    }
    return (<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">General</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Code" value={values.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" required/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select value={values.type} onChange={(e) => set("type", e.target.value)} className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                  <option value="PERCENT">Percent off</option>
                  <option value="FIXED">Fixed amount off</option>
                </select>
              </div>
              <Input label={values.type === "PERCENT" ? "Value (%)" : "Value (Rs)"} type="number" min={0} step="0.01" value={values.value} onChange={(e) => set("value", Number(e.target.value))} required/>
            </div>
            <Input label="Minimum order amount (optional)" type="number" min={0} step="0.01" value={values.minOrderAmount ?? ""} onChange={(e) => set("minOrderAmount", e.target.value === "" ? null : Number(e.target.value))} placeholder="No minimum"/>
            <Input label="Expires on (optional)" type="date" value={values.expiresAt} onChange={(e) => set("expiresAt", e.target.value)}/>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Settings</h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={values.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 rounded border-gray-300"/>
              Active
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="admin" isLoading={isSubmitting} className="flex-1">
            {submitLabel}
          </Button>
          <Button type="button" variant="adminOutline" onClick={() => router.push("/admin/coupons")}>
            Cancel
          </Button>
        </div>
      </div>
    </form>);
}
