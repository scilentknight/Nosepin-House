"use client";
import { useEffect, useState } from "react";
function money(value) {
    return `NPR ${value.toLocaleString("en-NP", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
export function PricingTab({ values, set }) {
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (values.materials.length === 0) {
            setPricing(null);
            return;
        }
        let cancelled = false;
        async function calculate() {
            try {
                setLoading(true);
                const response = await fetch("/api/admin/products/pricing", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        materials: values.materials
                            .filter((m) => m.materialId && m.materialId.trim() !== "")
                            .map((material) => ({
                            id: material.id,
                            materialId: material.materialId,
                            purityId: material.purityId,
                            grossWeight: material.grossWeight ? Number(material.grossWeight) : null,
                            stoneMaterialId: material.stoneMaterialId && material.stoneMaterialId.trim() !== "" ? material.stoneMaterialId.trim() : null,
                            stoneWeight: material.stoneWeight ? Number(material.stoneWeight) : null,
                            stoneGrossPrice: material.stoneGrossPrice ? Number(material.stoneGrossPrice) : null,
                            stoneDiscountPercent: material.stoneDiscountPercent ? Number(material.stoneDiscountPercent) : null,
                            manualGrossPrice: material.manualGrossPrice ? Number(material.manualGrossPrice) : null,
                            manualDiscountPercent: material.manualDiscountPercent ? Number(material.manualDiscountPercent) : null,
                            netWeight: material.netWeight ? Number(material.netWeight) : null,
                            quantity: Number(material.quantity || material.netWeight || 1),
                            unit: material.unit,
                            wastagePercent: Number(material.wastagePercent || 0),
                        })),
                        labourCharge: Number(values.labourCharge || 0),
                        makingCharge: Number(values.makingCharge || 0),
                        otherCharge: Number(values.otherCharge || 0),
                        markupType: values.markupType,
                        markupValue: Number(values.markupValue || 0),
                    }),
                });
                if (!response.ok) {
                    return;
                }
                const json = await response.json();
                if (!cancelled) {
                    setPricing(json.data ?? null);
                    if (json.data?.sellingPrice) {
                        set("price", String(json.data.sellingPrice));
                    }
                }
            }
            catch (error) {
                console.error("Pricing calculation failed:", error);
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        calculate();
        return () => {
            cancelled = true;
        };
    }, [
        values.materials,
        values.labourCharge,
        values.makingCharge,
        values.otherCharge,
        values.markupType,
        values.markupValue,
    ]);
    return (<div className="space-y-6">
      {/* Charges */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-soft">
        <label className="mb-2 block text-sm font-bold text-amber-950">
          Charges
        </label>
        <p className="mb-4 text-xs text-amber-800/80">
          Add labour, making, and other charges that apply to this product.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">Labour Charge</label>
            <input type="number" min="0" step="0.01" value={values.labourCharge} onChange={(e) => set("labourCharge", e.target.value)} className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="0.00"/>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">Making Charge</label>
            <input type="number" min="0" step="0.01" value={values.makingCharge} onChange={(e) => set("makingCharge", e.target.value)} className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="0.00"/>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">Other Charge</label>
            <input type="number" min="0" step="0.01" value={values.otherCharge} onChange={(e) => set("otherCharge", e.target.value)} className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="0.00"/>
          </div>
        </div>
      </div>

      {/* Markup */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <label className="mb-2 block text-sm font-bold text-gray-900">
          Markup
        </label>
        <p className="mb-4 text-xs text-gray-500">
          Apply a markup to increase the final selling price.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Markup Type</label>
            <select value={values.markupType} onChange={(e) => set("markupType", e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-800 focus:ring-2 focus:ring-slate-100">
              <option value="">No Markup</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Markup Value</label>
            <input type="number" min="0" step="0.01" value={values.markupValue} onChange={(e) => set("markupValue", e.target.value)} disabled={!values.markupType} placeholder="0.00" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-slate-800 focus:ring-2 focus:ring-slate-100 disabled:bg-gray-100 disabled:text-gray-400"/>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <label className="mb-2 block text-sm font-bold text-gray-900">
          Price Summary
        </label>
        <p className="mb-4 text-xs text-gray-500">
          Final price is recalculated using the latest material rates, material discounts, and charges.
        </p>

        {loading && (<div className="mb-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-gray-500">
            Recalculating price…
          </div>)}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Material Cost</span>
            <span className="font-medium text-gray-900">{money(pricing?.materialCost ?? 0)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Labour Charge</span>
            <span className="text-gray-900">{money(pricing?.labourCharge ?? Number(values.labourCharge || 0))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Making Charge</span>
            <span className="text-gray-900">{money(pricing?.makingCharge ?? Number(values.makingCharge || 0))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Other Charge</span>
            <span className="text-gray-900">{money(pricing?.otherCharge ?? Number(values.otherCharge || 0))}</span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between font-medium">
              <span className="text-gray-700">Subtotal (Base Cost)</span>
              <span className="text-gray-900">{money(pricing?.subtotal ?? 0)}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Markup</span>
            <span className="text-gray-900">{money(pricing?.markupAmount ?? 0)}</span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Current Selling Price</span>
              <span className="text-xl font-bold text-slate-900">{money(pricing?.sellingPrice ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
