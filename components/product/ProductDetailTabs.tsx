"use client";

import { useState } from "react";

interface MaterialItem {
  id: string;
  material: {
    name: string;
    code: string;
  };
  purity: {
    name: string;
    code: string;
  } | null;
  grossWeight?: number | null;
  stoneWeight?: number | null;
  netWeight?: number | null;
  quantity: number;
  unit: string;
  wastagePercent: number | null;
}

interface ProductDetailTabsProps {
  shortDescription: string | null;

  fullDescription: string | null;

  weight: number | null;
  warranty: string | null;
  colorway: string;
  stock: number;
  stockStatus: string;

  materials: MaterialItem[];

  labourCharge: number;
  makingCharge: number;
  otherCharge: number;
}

type Tab = "details" | "description" | "materials" | "price";

export function ProductDetailTabs({
  shortDescription,
  fullDescription,
  weight,
  warranty,
  colorway,
  stock,
  stockStatus,
  materials,
  labourCharge,
  makingCharge,
  otherCharge,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  const tabs = [
    {
      id: "details" as const,
      label: "Product Details",
    },
    {
      id: "description" as const,
      label: "Description",
    },
    {
      id: "materials" as const,
      label: "Materials",
    },
    {
      id: "price" as const,
      label: "Price Details",
    },
  ];

  return (
    <div className="mt-8 w-full">
      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="border-b border-gray-200">
        <div className="flex w-full overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}

                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600" />
                )}
              </button>
            );
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

        {activeTab === "details" && (
          <div className="space-y-6">
            {/* SHORT DESCRIPTION */}

            {shortDescription && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  About this product
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {shortDescription}
                </p>
              </div>
            )}

            {/* SPECIFICATIONS */}

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Product Information
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {weight !== null && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Weight
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">{weight}</p>
                  </div>
                )}

                {warranty && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Warranty
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {warranty}
                    </p>
                  </div>
                )}

                {/* {colorway && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Color
                    </p>

                    <p className="mt-1 font-semibold capitalize text-gray-800">
                      {colorway}
                    </p>
                  </div>
                )} */}

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
          </div>
        )}

        {/* ===================================================
            FULL DESCRIPTION
        =================================================== */}

        {activeTab === "description" && (
          <div>
            {fullDescription ? (
              <div
                className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{
                  __html: fullDescription,
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">No description available.</p>
            )}
          </div>
        )}

        {/* ===================================================
            MATERIALS
        =================================================== */}

        {activeTab === "materials" && (
          <div>
            {materials.length === 0 ? (
              <p className="text-sm text-gray-500">
                No material information available.
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Material
                        </th>

                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Purity
                        </th>

                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Quantity
                        </th>

                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                          Wastage
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {materials.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-800">
                              {item.material.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {item.material.code}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            {item.purity ? (
                              <>
                                <p className="font-medium text-gray-800">
                                  {item.purity.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.purity.code}
                                </p>
                              </>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            {item.quantity} {item.unit}
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            {item.wastagePercent !== null
                              ? `${item.wastagePercent}%`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            PRICE DETAILS
        =================================================== */}

        {activeTab === "price" && (
          <div>
            {labourCharge <= 0 && makingCharge <= 0 && otherCharge <= 0 ? (
              <p className="text-sm text-gray-500">
                No additional price details available.
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {labourCharge > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 text-sm">
                    <span className="text-gray-500">Labour Charge</span>

                    <span className="font-semibold text-gray-800">
                      Rs.{" "}
                      {labourCharge.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {makingCharge > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 text-sm">
                    <span className="text-gray-500">Making Charge</span>

                    <span className="font-semibold text-gray-800">
                      Rs.{" "}
                      {makingCharge.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                {otherCharge > 0 && (
                  <div className="flex items-center justify-between px-5 py-4 text-sm">
                    <span className="text-gray-500">Other Charge</span>

                    <span className="font-semibold text-gray-800">
                      Rs.{" "}
                      {otherCharge.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
