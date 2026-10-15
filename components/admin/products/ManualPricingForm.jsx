"use client";
import { useMemo } from "react";
import { ALLOWED_MANUAL_DISCOUNT_PERCENTAGES, DEFAULT_MANUAL_DISCOUNT_PERCENTAGE, calculateManualSellingPrice, formatCurrencyNpr, } from "@/lib/jewellery/manual-pricing";
export function ManualPricingForm({ values, set }) {
    const grossStr = values.grossPrice || values.compareAtPrice || "";
    const discountVal = values.discountPercent !== "" && values.discountPercent !== undefined
        ? Number(values.discountPercent)
        : DEFAULT_MANUAL_DISCOUNT_PERCENTAGE;
    const grossNum = parseFloat(grossStr);
    const isValidGross = !isNaN(grossNum) && grossNum > 0 && isFinite(grossNum);
    const calculation = useMemo(() => {
        if (!isValidGross) {
            return null;
        }
        try {
            return calculateManualSellingPrice(grossNum, discountVal);
        }
        catch {
            return null;
        }
    }, [grossNum, isValidGross, discountVal]);
    function handleGrossChange(val) {
        set("grossPrice", val);
        set("compareAtPrice", val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && parsed > 0 && isFinite(parsed)) {
            try {
                const calc = calculateManualSellingPrice(parsed, discountVal);
                set("price", String(calc.sellingPrice));
            }
            catch {
                // Keep current price
            }
        }
        else {
            set("price", "");
        }
    }
    function handleDiscountChange(val) {
        const num = Number(val);
        set("discountPercent", num);
        set("discountValue", String(num));
        set("discountType", "PERCENTAGE");
        if (isValidGross) {
            try {
                const calc = calculateManualSellingPrice(grossNum, num);
                set("price", String(calc.sellingPrice));
            }
            catch {
                // Keep current price
            }
        }
    }
    return (<div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-amber-800">
            Diamond & Stone Pricing Strategy:
          </span>
          <span>
            Enter a gross price directly and select a discount percentage. Daily
            rates are not required for this product.
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Field 1: Gross Price */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            Gross Price (NPR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-gray-500">
              Rs.
            </span>
            <input type="number" min="1" step="any" placeholder="e.g. 100000" value={grossStr} onChange={(e) => handleGrossChange(e.target.value)} className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${grossStr !== "" && !isValidGross
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-slate-800 focus:ring-slate-100"}`}/>
          </div>
          {grossStr !== "" && !isValidGross && (<p className="mt-1 text-xs text-red-600">
              Gross price must be a valid positive number greater than 0.
            </p>)}
          <p className="mt-1 text-xs text-gray-500">
            Original price before product discount.
          </p>
        </div>

        {/* Field 2: Discount Percentage */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            Discount Percentage <span className="text-red-500">*</span>
          </label>
          <select value={discountVal} onChange={(e) => handleDiscountChange(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-slate-800 focus:ring-2 focus:ring-slate-100">
            {ALLOWED_MANUAL_DISCOUNT_PERCENTAGES.map((pct) => (<option key={pct} value={pct}>
                {pct}% Discount {pct === 40 ? "(Default)" : ""}
              </option>))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select one of the client-approved discount tiers.
          </p>
        </div>
      </div>

      {/* Field 3: Selling Price & Calculation Summary */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 shadow-sm">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
          Price Calculation Breakdown
        </h4>
        <p className="mt-0.5 text-xs text-gray-500">
          Formula: Selling Price = Gross Price × (1 − Discount Percentage / 100)
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Original / Gross Price</span>
            <span className="font-semibold text-gray-900">
              {isValidGross && calculation
            ? formatCurrencyNpr(calculation.grossPrice)
            : "Rs. 0.00"}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Selected Discount</span>
            <span className="font-medium text-rose-600">{discountVal}%</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Discount Amount</span>
            <span className="font-medium text-rose-600">
              -{" "}
              {isValidGross && calculation
            ? formatCurrencyNpr(calculation.discountAmount)
            : "Rs. 0.00"}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-gray-900">
                  Calculated Selling Price
                </span>
                <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-800">
                  Read-Only
                </span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-700">
                {isValidGross && calculation
            ? formatCurrencyNpr(calculation.sellingPrice)
            : "Rs. 0.00"}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          The final selling price is protected against manual tampering and
          will be authoritatively verified on the server upon submission.
        </p>
      </div>
    </div>);
}
