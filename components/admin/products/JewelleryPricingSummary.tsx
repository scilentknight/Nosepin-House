"use client";

import type { MarkupType, JewelleryPricing } from "@/lib/jewellery/types";

interface Props {
  pricing: JewelleryPricing | null;
  labourCharge: string;
  makingCharge: string;
  otherCharge: string;
  markupType: MarkupType;
  markupValue: string;
  set: (key: any, value: any) => void;
}

function money(value: number) {
  return `NPR ${value.toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function JewelleryPricingSummary({
  pricing,
  labourCharge,
  makingCharge,
  otherCharge,
  markupType,
  markupValue,
  set,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Labour Charge</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={labourCharge}
            onChange={(e) => set("labourCharge", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Making Charge</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={makingCharge}
            onChange={(e) => set("makingCharge", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Other Charge</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={otherCharge}
            onChange={(e) => set("otherCharge", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Markup Type</label>
          <select
            value={markupType}
            onChange={(e) => set("markupType", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">No Markup</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Markup Value</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={markupValue}
            onChange={(e) => set("markupValue", e.target.value)}
            disabled={!markupType}
            className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-gray-50 p-5">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Material Cost</span>
            <span className="font-medium">{money(pricing?.materialCost ?? 0)}</span>
          </div>

          <div className="flex justify-between">
            <span>Labour Charge</span>
            <span>{money(pricing?.labourCharge ?? Number(labourCharge || 0))}</span>
          </div>

          <div className="flex justify-between">
            <span>Making Charge</span>
            <span>{money(pricing?.makingCharge ?? Number(makingCharge || 0))}</span>
          </div>

          <div className="flex justify-between">
            <span>Other Charge</span>
            <span>{money(pricing?.otherCharge ?? Number(otherCharge || 0))}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between font-medium">
              <span>Subtotal (Base Cost)</span>
              <span>{money(pricing?.subtotal ?? 0)}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <span>Markup</span>
            <span>{money(pricing?.markupAmount ?? 0)}</span>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Current Calculated Selling Price</span>
              <span className="text-xl font-bold text-slate-900">{money(pricing?.sellingPrice ?? 0)}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Final price is recalculated on the server using the latest material rates.
        </p>
      </div>
    </div>
  );
}
