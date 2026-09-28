// "use client";

// import { useEffect, useState } from "react";

// import type {
//   MaterialOption,
//   ProductMaterialValue,
// } from "@/lib/jewellery/types";

// interface Props {
//   values: ProductMaterialValue[];
//   setValues: (values: ProductMaterialValue[]) => void;
// }

// interface DerivedRateItem {
//   purityId: string;
//   purityName: string;
//   purityCode: string;
//   fineness: number | null;
//   isBasePurity: boolean;
//   rate: number;
//   unit: string;
// }

// interface MaterialRateSummary {
//   materialId: string;
//   derivedRates: DerivedRateItem[];
//   baseRateRecord: {
//     id: string;
//     rate: number;
//     purity: { name: string; code: string };
//   } | null;
// }

// export function MaterialComposition({ values, setValues }: Props) {
//   const [materials, setMaterials] = useState<MaterialOption[]>([]);
//   const [ratesMap, setRatesMap] = useState<Record<string, number>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadData() {
//       try {
//         const [matRes, ratesRes] = await Promise.all([
//           fetch("/api/admin/materials", { cache: "no-store" }),
//           fetch("/api/admin/material-rates", { cache: "no-store" }),
//         ]);

//         if (!matRes.ok) throw new Error("Failed to load materials");

//         const matJson = await matRes.json();
//         const rateJson = ratesRes.ok ? await ratesRes.json() : { data: [] };

//         if (!cancelled) {
//           setMaterials(matJson.data ?? []);

//           // /api/admin/material-rates returns materialRateSummaries:
//           // each item has { materialId, derivedRates: [{ purityId, rate, ... }] }
//           // We must iterate derivedRates to build the correct map.
//           const map: Record<string, number> = {};
//           const summaryList: MaterialRateSummary[] = rateJson.data ?? [];
//           for (const summary of summaryList) {
//             for (const dr of summary.derivedRates ?? []) {
//               map[`${summary.materialId}:${dr.purityId}`] = dr.rate;
//             }
//           }
//           setRatesMap(map);
//         }
//       } catch (error) {
//         console.error("Failed loading materials or rates:", error);
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadData();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   function addMaterial() {
//     setValues([
//       ...values,
//       {
//         materialId: "",
//         purityId: "",
//         quantity: "",
//         unit: "GRAM",
//         wastagePercent: "0",
//       },
//     ]);
//   }

//   function removeMaterial(index: number) {
//     setValues(values.filter((_, i) => i !== index));
//   }

//   function updateMaterial(index: number, patch: Partial<ProductMaterialValue>) {
//     setValues(
//       values.map((item, i) =>
//         i === index
//           ? {
//               ...item,
//               ...patch,
//             }
//           : item,
//       ),
//     );
//   }

//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-6">
//         <p className="text-sm text-gray-500">Loading materials and daily rates...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
//       <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="font-semibold text-gray-900">Material Composition</h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Add every material used to manufacture this product.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={addMaterial}
//           className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white"
//         >
//           + Add Material
//         </button>
//       </div>

//       {values.length === 0 ? (
//         <div className="p-8 text-center">
//           <p className="text-sm text-gray-500">No materials added.</p>
//           <button
//             type="button"
//             onClick={addMaterial}
//             className="mt-3 text-sm font-medium text-slate-800 underline"
//           >
//             Add the first material
//           </button>
//         </div>
//       ) : (
//         <div className="divide-y overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-gray-50 border-b text-xs uppercase font-medium text-gray-500">
//               <tr>
//                 <th className="px-4 py-3">Material</th>
//                 <th className="px-4 py-3">Purity / Grade</th>
//                 <th className="px-4 py-3">Quantity</th>
//                 <th className="px-4 py-3">Unit</th>
//                 <th className="px-4 py-3">Wastage %</th>
//                 <th className="px-4 py-3 text-right">Daily Rate</th>
//                 <th className="px-4 py-3 text-right">Line Cost</th>
//                 <th className="px-4 py-3 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {values.map((item, index) => {
//                 const material = materials.find((m) => m.id === item.materialId);
//                 const currentRate = item.materialId && item.purityId
//                   ? ratesMap[`${item.materialId}:${item.purityId}`] ?? null
//                   : null;

//                 const qty = Number(item.quantity || 0);
//                 const wastage = Number(item.wastagePercent || 0);
//                 const adjustedQty = qty * (1 + wastage / 100);
//                 const lineCost = currentRate !== null ? adjustedQty * currentRate : null;

//                 return (
//                   <tr key={index} className="hover:bg-gray-50/50">
//                     <td className="p-3">
//                       <select
//                         value={item.materialId}
//                         onChange={(e) => {
//                           const selected = materials.find((m) => m.id === e.target.value);
//                           updateMaterial(index, {
//                             materialId: e.target.value,
//                             purityId: "",
//                             unit: selected?.unit ?? "GRAM",
//                           });
//                         }}
//                         className="w-full rounded-lg border px-3 py-2 text-sm"
//                       >
//                         <option value="">Select material</option>
//                         {materials.map((m) => (
//                           <option key={m.id} value={m.id}>
//                             {m.name}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     <td className="p-3">
//                       <select
//                         value={item.purityId}
//                         onChange={(e) =>
//                           updateMaterial(index, {
//                             purityId: e.target.value,
//                           })
//                         }
//                         disabled={!material}
//                         className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//                       >
//                         <option value="">Select purity</option>
//                         {material?.purities.map((p) => (
//                           <option key={p.id} value={p.id}>
//                             {p.name}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     <td className="p-3">
//                       <input
//                         type="number"
//                         min="0"
//                         step="0.000001"
//                         value={item.quantity}
//                         onChange={(e) =>
//                           updateMaterial(index, {
//                             quantity: e.target.value,
//                           })
//                         }
//                         placeholder="0.000"
//                         className="w-28 rounded-lg border px-3 py-2 text-sm"
//                       />
//                     </td>

//                     <td className="p-3 font-medium text-gray-600 text-xs">
//                       {item.unit}
//                     </td>

//                     <td className="p-3">
//                       <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={item.wastagePercent}
//                         onChange={(e) =>
//                           updateMaterial(index, {
//                             wastagePercent: e.target.value,
//                           })
//                         }
//                         className="w-24 rounded-lg border px-3 py-2 text-sm"
//                       />
//                     </td>

//                     <td className="p-3 text-right font-medium whitespace-nowrap text-sm">
//                       {currentRate !== null ? (
//                         `NPR ${currentRate.toLocaleString("en-NP")}`
//                       ) : (
//                         <span className="text-xs text-amber-600 font-normal">
//                           {item.materialId && item.purityId ? "No active rate" : "—"}
//                         </span>
//                       )}
//                     </td>

//                     <td className="p-3 text-right font-semibold whitespace-nowrap text-sm text-slate-900">
//                       {lineCost !== null ? (
//                         `NPR ${lineCost.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     <td className="p-3 text-center">
//                       <button
//                         type="button"
//                         onClick={() => removeMaterial(index)}
//                         className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import type {
  MaterialOption,
  ProductMaterialValue,
} from "@/lib/jewellery/types";

interface Props {
  values: ProductMaterialValue[];
  setValues: (values: ProductMaterialValue[]) => void;
}

interface DerivedRateItem {
  purityId: string;
  purityName: string;
  purityCode: string;
  fineness: number | null;
  isBasePurity: boolean;
  rate: number;
  unit: string;
}

interface MaterialRateSummary {
  materialId: string;
  derivedRates: DerivedRateItem[];
  baseRateRecord: {
    id: string;
    rate: number;
    purity: {
      name: string;
      code: string;
    };
  } | null;
}

export function MaterialComposition({ values, setValues }: Props) {
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [ratesMap, setRatesMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [matRes, ratesRes] = await Promise.all([
          fetch("/api/admin/materials", {
            cache: "no-store",
          }),
          fetch("/api/admin/material-rates", {
            cache: "no-store",
          }),
        ]);

        if (!matRes.ok) {
          throw new Error("Failed to load materials");
        }

        const matJson = await matRes.json();
        const rateJson = ratesRes.ok ? await ratesRes.json() : { data: [] };

        if (!cancelled) {
          setMaterials(matJson.data ?? []);

          const map: Record<string, number> = {};

          const summaryList: MaterialRateSummary[] = rateJson.data ?? [];

          for (const summary of summaryList) {
            for (const dr of summary.derivedRates ?? []) {
              map[`${summary.materialId}:${dr.purityId}`] = Number(dr.rate);
            }
          }

          setRatesMap(map);
        }
      } catch (error) {
        console.error("Failed loading materials or rates:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  function addMaterial() {
    setValues([
      ...values,
      {
        materialId: "",
        purityId: "",
        quantity: "",
        unit: "GRAM",
        wastagePercent: "0",
      },
    ]);
  }

  function removeMaterial(index: number) {
    setValues(values.filter((_, i) => i !== index));
  }

  function updateMaterial(index: number, patch: Partial<ProductMaterialValue>) {
    setValues(
      values.map((item, i) =>
        i === index
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-soft">
        <p className="text-sm text-gray-500">
          Loading materials and daily rates...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-soft">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Material Composition
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add every material used to manufacture this product.
          </p>
        </div>

        <button
          type="button"
          onClick={addMaterial}
          className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          + Add Material
        </button>
      </div>

      {/* Empty state */}
      {values.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No materials added.</p>

          <button
            type="button"
            onClick={addMaterial}
            className="mt-3 text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900"
          >
            Add the first material
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Table Header */}
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Material
                </th>

                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Purity / Grade
                </th>

                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Quantity
                </th>

                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Unit
                </th>

                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Wastage %
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Daily Rate
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Line Cost
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {values.map((item, index) => {
                const material = materials.find(
                  (m) => m.id === item.materialId,
                );

                const currentRate =
                  item.materialId && item.purityId
                    ? (ratesMap[`${item.materialId}:${item.purityId}`] ?? null)
                    : null;

                const qty = Number(item.quantity || 0);
                const wastage = Number(item.wastagePercent || 0);

                const adjustedQty = qty * (1 + wastage / 100);

                const lineCost =
                  currentRate !== null ? adjustedQty * currentRate : null;

                return (
                  <tr key={index} className="transition hover:bg-gray-50/60">
                    {/* Material */}
                    <td className="p-3">
                      <select
                        value={item.materialId}
                        onChange={(e) => {
                          const selected = materials.find(
                            (m) => m.id === e.target.value,
                          );

                          updateMaterial(index, {
                            materialId: e.target.value,
                            purityId: "",
                            unit: selected?.unit ?? "GRAM",
                          });
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      >
                        <option value="">Select material</option>

                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Purity */}
                    <td className="p-3">
                      <select
                        value={item.purityId}
                        onChange={(e) =>
                          updateMaterial(index, {
                            purityId: e.target.value,
                          })
                        }
                        disabled={!material}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">Select purity</option>

                        {material?.purities.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Quantity */}
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        step="0.000001"
                        value={item.quantity}
                        onChange={(e) =>
                          updateMaterial(index, {
                            quantity: e.target.value,
                          })
                        }
                        placeholder="0.000"
                        className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </td>

                    {/* Unit */}
                    <td className="p-3">
                      <span className="text-xs font-medium text-gray-600">
                        {item.unit}
                      </span>
                    </td>

                    {/* Wastage */}
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.wastagePercent}
                        onChange={(e) =>
                          updateMaterial(index, {
                            wastagePercent: e.target.value,
                          })
                        }
                        className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </td>

                    {/* Daily Rate */}
                    <td className="whitespace-nowrap p-3 text-right">
                      {currentRate !== null ? (
                        <span className="text-sm font-medium text-gray-900">
                          NPR {currentRate.toLocaleString("en-NP")}
                        </span>
                      ) : (
                        <span className="text-xs font-normal text-gray-500">
                          {item.materialId && item.purityId
                            ? "No active rate"
                            : "—"}
                        </span>
                      )}
                    </td>

                    {/* Line Cost */}
                    <td className="whitespace-nowrap p-3 text-right">
                      {lineCost !== null ? (
                        <span className="text-sm font-semibold text-gray-900">
                          NPR{" "}
                          {lineCost.toLocaleString("en-NP", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-100"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
