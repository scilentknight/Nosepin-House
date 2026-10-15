"use client";
import { useState } from "react";
function formatRs(amount) {
    return `Rs. ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
export function ProductDetailTabs({ shortDescription, fullDescription, weight, warranty, colorway, stock, stockStatus, grossPrice, discountPercent, sellingPrice, materials, labourCharge, makingCharge, otherCharge, }) {
    const [activeTab, setActiveTab] = useState("details");
    const tabs = [
        {
            id: "details",
            label: "Product Details",
        },
        {
            id: "description",
            label: "Description",
        },
        {
            id: "materials",
            label: "Materials",
        },
        {
            id: "price",
            label: "Price Details",
        },
    ];
    const hasDiscount = grossPrice != null &&
        sellingPrice != null &&
        grossPrice > sellingPrice;
    const discountAmount = hasDiscount ? grossPrice - sellingPrice : 0;
    return (<div className="mt-8 w-full">
      {/* =====================================================
            TABS
        ===================================================== */}

      <div className="border-b border-gray-200">
        <div className="flex w-full overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${active
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-800"}`}>
                {tab.label}

                {active && (<span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600"/>)}
              </button>);
        })}
        </div>
      </div>

      {/* =====================================================
            TAB CONTENT
        ===================================================== */}

      <div className="pt-6">
        {/* ===================================================
            PRODUCT DETAILS
        =================================================== */}

        {activeTab === "details" && (<div className="space-y-6">
            {/* SHORT DESCRIPTION */}

            {shortDescription && (<div>
                <h3 className="text-sm font-semibold text-gray-900">
                  About this product
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {shortDescription}
                </p>
              </div>)}

            {/* SPECIFICATIONS */}

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Product Information
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {weight !== null && (<div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Weight
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">{weight}</p>
                  </div>)}

                {warranty && (<div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Warranty
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {warranty}
                    </p>
                  </div>)}

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Stock
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {stockStatus === "OUT_OF_STOCK"
                ? "Out of stock"
                : `${stock} available`}
                  </p>
                </div>
              </div>
            </div>
          </div>)}

        {/* ===================================================
            FULL DESCRIPTION
        =================================================== */}

        {activeTab === "description" && (<div>
            {fullDescription ? (<div className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary-600" dangerouslySetInnerHTML={{
                    __html: fullDescription,
                }}/>) : (<p className="text-sm text-gray-500">No description available.</p>)}
          </div>)}

        {/* ===================================================
            MATERIALS
        =================================================== */}

        {/* ===================================================
            MATERIALS
        =================================================== */}

        {activeTab === "materials" && (<div>
            {materials.length === 0 ? (<p className="text-sm text-gray-500">
                No material information available.
              </p>) : (<div className="overflow-hidden rounded-2xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Material
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Purity / Grade
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Weight & Qty
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Gross Price
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Discount
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">
                          Net Price
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {materials.map((item) => {
                    const isPrecious = item.material.type === "PRECIOUS_METAL";
                    const netWeight = item.netWeight ?? item.grossWeight ?? item.quantity;
                    const wastage = item.wastagePercent ?? 0;
                    const chargeableQty = netWeight * (1 + wastage / 100);
                    const metalCost = isPrecious && item.rate ? Math.round(chargeableQty * item.rate * 100) / 100 : null;
                    const hasStonePrice = item.stoneGrossPrice != null && item.stoneGrossPrice > 0;
                    const stoneSellingPrice = hasStonePrice
                        ? Math.round(item.stoneGrossPrice * (1 - (item.stoneDiscountPercent ?? 40) / 100) * 100) / 100
                        : null;
                    const hasManualPrice = item.manualGrossPrice != null && item.manualGrossPrice > 0;
                    const manualSellingPrice = hasManualPrice
                        ? Math.round(item.manualGrossPrice * (1 - (item.manualDiscountPercent ?? 40) / 100) * 100) / 100
                        : null;
                    return (<tr key={item.id} className="hover:bg-gray-50/50">
                            {/* Material Name & Type */}
                            <td className="px-4 py-4">
                              <p className="font-semibold text-gray-900">
                                {item.material.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {item.material.code}
                              </p>
                              {item.material.type && (<span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${isPrecious
                                ? "bg-amber-50 text-amber-800"
                                : "bg-blue-50 text-blue-800"}`}>
                                  {item.material.type.replace("_", " ")}
                                </span>)}
                            </td>

                            {/* Purity / Grade */}
                            <td className="px-4 py-4">
                              {item.purity ? (<>
                                  <p className="font-medium text-gray-800">
                                    {item.purity.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {item.purity.code}
                                  </p>
                                </>) : (<span className="text-gray-400">—</span>)}
                            </td>

                            {/* Weight & Qty */}
                            <td className="px-4 py-4 text-gray-700">
                              <div className="space-y-0.5 text-xs">
                                <div>
                                  <span className="font-semibold text-gray-900">Qty:</span> {item.quantity} {item.unit}
                                </div>
                                {item.grossWeight != null && (<div className="text-gray-500">
                                    Gross: {item.grossWeight} {item.unit}
                                  </div>)}
                                {item.netWeight != null && (<div className="text-gray-600 font-medium">
                                    Net: {item.netWeight} {item.unit}
                                  </div>)}
                                {item.stoneMaterial && item.stoneWeight != null && (<div className="text-slate-600">
                                    Stone: {item.stoneMaterial.name} ({item.stoneWeight} {item.stoneMaterial.unit || "CARAT"})
                                  </div>)}
                                {item.wastagePercent != null && item.wastagePercent > 0 && (<div className="text-amber-700">
                                    Wastage: {item.wastagePercent}%
                                  </div>)}
                              </div>
                            </td>

                            {/* Rate */}
                            <td className="px-4 py-4 text-xs">
                              {item.rate ? (<div>
                                  <span className="font-semibold text-gray-900">
                                    {formatRs(item.rate)}
                                  </span>
                                  <span className="text-gray-500">
                                    {" "}/ {item.rateUnit || item.unit}
                                  </span>
                                </div>) : (<span className="text-gray-400">—</span>)}
                            </td>

                            {/* Gross Price */}
                            <td className="px-4 py-4 text-xs">
                              {hasStonePrice ? (<div>
                                  <span className="text-gray-400 line-through">
                                    {formatRs(item.stoneGrossPrice)}
                                  </span>
                                  <span className="block text-[10px] text-gray-500">
                                    Stone MRP
                                  </span>
                                </div>) : hasManualPrice ? (<div>
                                  <span className="text-gray-400 line-through">
                                    {formatRs(item.manualGrossPrice)}
                                  </span>
                                  <span className="block text-[10px] text-gray-500">
                                    Material MRP
                                  </span>
                                </div>) : metalCost ? (<span className="font-medium text-gray-700">
                                  {formatRs(metalCost)}
                                </span>) : (<span className="text-gray-400">—</span>)}
                            </td>

                            {/* Discount */}
                            <td className="px-4 py-4 text-xs">
                              {hasStonePrice && item.stoneDiscountPercent != null ? (<span className="inline-block rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-600">
                                  −{item.stoneDiscountPercent}%
                                </span>) : hasManualPrice && item.manualDiscountPercent != null ? (<span className="inline-block rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-600">
                                  −{item.manualDiscountPercent}%
                                </span>) : (<span className="text-gray-400">—</span>)}
                            </td>

                            {/* Net Price */}
                            <td className="px-4 py-4 text-right text-xs font-bold text-gray-900">
                              {hasStonePrice && stoneSellingPrice != null ? (<div>
                                  <span>{formatRs(stoneSellingPrice)}</span>
                                  {metalCost ? (<span className="block text-[10px] text-gray-500 font-normal">
                                      + Metal: {formatRs(metalCost)}
                                    </span>) : null}
                                </div>) : hasManualPrice && manualSellingPrice != null ? (<span>{formatRs(manualSellingPrice)}</span>) : metalCost ? (<span>{formatRs(metalCost)}</span>) : (<span className="text-gray-400 font-normal">—</span>)}
                            </td>
                          </tr>);
                })}
                    </tbody>
                  </table>
                </div>
              </div>)}
          </div>)}

        {/* ===================================================
            PRICE DETAILS
        =================================================== */}

        {activeTab === "price" && (<div className="space-y-6">
            {/* Overall Price Summary */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Overall Price Summary
                </h4>
              </div>

              <div className="divide-y divide-gray-100">
                {grossPrice != null && grossPrice > 0 && (<div className="flex items-center justify-between px-5 py-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Gross Price (MRP)</span>
                      <p className="text-xs text-gray-400">Total maximum retail price</p>
                    </div>
                    <span className="text-base font-semibold text-gray-400 line-through">
                      {formatRs(grossPrice)}
                    </span>
                  </div>)}

                {hasDiscount && (<div className="flex items-center justify-between px-5 py-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Discount Savings</span>
                      <p className="text-xs text-emerald-600">
                        {discountPercent != null ? `${discountPercent}% off retail price` : "Discount applied"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                        {discountPercent != null ? `−${discountPercent}%` : ""} ({formatRs(discountAmount)})
                      </span>
                    </div>
                  </div>)}

                <div className="flex items-center justify-between bg-emerald-50/40 px-5 py-4 text-sm">
                  <div>
                    <span className="font-bold text-gray-900">Selling Price</span>
                    <p className="text-xs text-emerald-700">Final price payable</p>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {sellingPrice != null ? formatRs(sellingPrice) : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Materials & Stones Breakdown */}
            {materials.length > 0 && (<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Material & Stone Breakdown
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Detailed rates, weights, and component prices
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {materials.map((item) => {
                    const isPrecious = item.material.type === "PRECIOUS_METAL";
                    const netWeight = item.netWeight ?? item.grossWeight ?? item.quantity;
                    const wastage = item.wastagePercent ?? 0;
                    const chargeableQty = netWeight * (1 + wastage / 100);
                    const metalCost = isPrecious && item.rate ? Math.round(chargeableQty * item.rate * 100) / 100 : null;
                    const hasStonePrice = item.stoneGrossPrice != null && item.stoneGrossPrice > 0;
                    const stoneSelling = hasStonePrice
                        ? Math.round(item.stoneGrossPrice * (1 - (item.stoneDiscountPercent ?? 40) / 100) * 100) / 100
                        : null;
                    const hasManualPrice = item.manualGrossPrice != null && item.manualGrossPrice > 0;
                    const manualSelling = hasManualPrice
                        ? Math.round(item.manualGrossPrice * (1 - (item.manualDiscountPercent ?? 40) / 100) * 100) / 100
                        : null;
                    return (<div key={item.id} className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-900">
                              {item.material.name}
                            </span>
                            {item.purity && (<span className="ml-2 text-xs font-medium text-gray-500">
                                ({item.purity.name})
                              </span>)}
                            <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${isPrecious ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                              {item.material.type?.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        {/* Metal details if precious */}
                        {isPrecious && (<div className="rounded-xl bg-gray-50 p-3 text-xs space-y-1.5 text-gray-700">
                            <div className="flex justify-between">
                              <span>Net Weight:</span>
                              <span className="font-semibold text-gray-900">{netWeight} {item.unit}</span>
                            </div>
                            {wastage > 0 && (<div className="flex justify-between text-amber-800">
                                <span>Wastage ({wastage}%):</span>
                                <span className="font-medium">+{Math.round((chargeableQty - netWeight) * 1000) / 1000} {item.unit}</span>
                              </div>)}
                            {item.rate ? (<div className="flex justify-between">
                                <span>Market Rate:</span>
                                <span className="font-semibold text-gray-900">{formatRs(item.rate)} / {item.rateUnit || item.unit}</span>
                              </div>) : null}
                            {metalCost ? (<div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold text-gray-900">
                                <span>Metal Cost:</span>
                                <span>{formatRs(metalCost)}</span>
                              </div>) : null}
                          </div>)}

                        {/* Embedded Stone details */}
                        {hasStonePrice && item.stoneMaterial && (<div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-xs space-y-1.5">
                            <div className="flex justify-between font-semibold text-rose-950">
                              <span>Embedded Stone: {item.stoneMaterial.name}</span>
                              <span>{item.stoneWeight ? `${item.stoneWeight} ${item.stoneMaterial.unit || "Carat"}` : ""}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Stone Gross Price:</span>
                              <span className="line-through">{formatRs(item.stoneGrossPrice)}</span>
                            </div>
                            {item.stoneDiscountPercent != null && (<div className="flex items-center justify-between text-rose-600 font-semibold">
                                <span>Stone Discount:</span>
                                <span>−{item.stoneDiscountPercent}% ({formatRs(item.stoneGrossPrice - (stoneSelling ?? 0))})</span>
                              </div>)}
                            <div className="flex items-center justify-between border-t border-rose-200/60 pt-1.5 font-bold text-gray-900">
                              <span>Stone Net Price:</span>
                              <span>{formatRs(stoneSelling)}</span>
                            </div>
                          </div>)}

                        {/* Non-precious direct pricing */}
                        {hasManualPrice && (<div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-xs space-y-1.5">
                            <div className="flex justify-between font-semibold text-blue-950">
                              <span>Quantity:</span>
                              <span>{item.quantity} {item.unit}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Gross Price:</span>
                              <span className="line-through">{formatRs(item.manualGrossPrice)}</span>
                            </div>
                            {item.manualDiscountPercent != null && (<div className="flex items-center justify-between text-rose-600 font-semibold">
                                <span>Discount:</span>
                                <span>−{item.manualDiscountPercent}% ({formatRs(item.manualGrossPrice - (manualSelling ?? 0))})</span>
                              </div>)}
                            <div className="flex items-center justify-between border-t border-blue-200/60 pt-1.5 font-bold text-gray-900">
                              <span>Material Net Price:</span>
                              <span>{formatRs(manualSelling)}</span>
                            </div>
                          </div>)}
                      </div>);
                })}
                </div>
              </div>)}

            {/* Additional Charges */}
            {(labourCharge > 0 || makingCharge > 0 || otherCharge > 0) && (<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Additional Charges
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Already included in the final selling price
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {labourCharge > 0 && (<div className="flex items-center justify-between px-5 py-4 text-sm">
                      <span className="text-gray-600">Labour Charge</span>
                      <span className="font-semibold text-gray-900">
                        {formatRs(labourCharge)}
                      </span>
                    </div>)}

                  {makingCharge > 0 && (<div className="flex items-center justify-between px-5 py-4 text-sm">
                      <span className="text-gray-600">Making Charge</span>
                      <span className="font-semibold text-gray-900">
                        {formatRs(makingCharge)}
                      </span>
                    </div>)}

                  {otherCharge > 0 && (<div className="flex items-center justify-between px-5 py-4 text-sm">
                      <span className="text-gray-600">Other Charge</span>
                      <span className="font-semibold text-gray-900">
                        {formatRs(otherCharge)}
                      </span>
                    </div>)}
                </div>
              </div>)}
            {/* No pricing info */}
            {!hasDiscount &&
                sellingPrice == null &&
                materials.length === 0 &&
                labourCharge <= 0 &&
                makingCharge <= 0 &&
                otherCharge <= 0 && (<p className="text-sm text-gray-500">
                  No additional price details available.
                </p>)}
          </div>)}
      </div>
    </div>);
}
