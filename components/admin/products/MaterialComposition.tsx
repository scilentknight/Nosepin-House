import { useEffect, useState } from "react";
import { convertWeightToNumber } from "@/lib/jewellery/unit-converter";

import type {
  MaterialOption,
  ProductMaterialValue,
} from "@/lib/jewellery/types";

interface Props {
  values: ProductMaterialValue[];
  setValues: (values: ProductMaterialValue[]) => void;
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
          fetch("/api/admin/materials", { cache: "no-store" }),
          fetch("/api/admin/material-rates", { cache: "no-store" }),
        ]);

        if (!matRes.ok) throw new Error("Failed to load materials");

        const matJson = await matRes.json();
        const rateJson = ratesRes.ok ? await ratesRes.json() : { data: [] };

        if (!cancelled) {
          setMaterials(matJson.data ?? []);

          const map: Record<string, number> = {};
          const summaryList: any[] = rateJson.data ?? [];

          for (const summary of summaryList) {
            for (const dr of summary.derivedRates ?? []) {
              map[`${summary.materialId}:${dr.purityId}`] = Number(dr.rate);
            }
            if (summary.baseRateRecord?.rate) {
              map[`${summary.materialId}:base`] = Number(
                summary.baseRateRecord.rate,
              );
              map[summary.materialId] = Number(summary.baseRateRecord.rate);
            }
          }

          setRatesMap(map);
        }
      } catch (error) {
        console.error("Failed loading materials or rates:", error);
      } finally {
        if (!cancelled) setLoading(false);
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
        grossWeight: "",
        stoneMaterialId: "",
        stoneWeight: "0",
        netWeight: "",
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
      values.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function handleMaterialChange(index: number, materialId: string) {
    const selected = materials.find((m) => m.id === materialId);
    if (!selected) {
      updateMaterial(index, {
        materialId: "",
        purityId: "",
        unit: "GRAM",
        grossWeight: "",
        stoneMaterialId: "",
        stoneWeight: "",
        netWeight: "",
        quantity: "",
        wastagePercent: "0",
      });
      return;
    }

    const isPrecious = selected.type === "PRECIOUS_METAL";
    const defaultPurityId =
      selected.purities.length > 0 ? selected.purities[0].id : "";

    updateMaterial(index, {
      materialId,
      purityId: defaultPurityId,
      unit: selected.unit,
      grossWeight: isPrecious ? "" : undefined,
      stoneMaterialId: isPrecious ? "" : undefined,
      stoneWeight: isPrecious ? "0" : undefined,
      netWeight: isPrecious ? "" : undefined,
      quantity: isPrecious ? "" : selected.type === "OTHER" ? "1" : "",
      wastagePercent: "0",
    });
  }

  function handleGrossWeightChange(index: number, grossStr: string) {
    const row = values[index];
    const gross = grossStr === "" ? 0 : parseFloat(grossStr) || 0;
    const stone =
      row.stoneWeight === "" ? 0 : parseFloat(row.stoneWeight || "0") || 0;
    const stoneMat = row.stoneMaterialId
      ? materials.find((m) => m.id === row.stoneMaterialId)
      : null;
    const stoneUnit = stoneMat?.unit || "CARAT";
    const metalUnit = row.unit || "GRAM";
    const convertedStone =
      stone > 0 ? convertWeightToNumber(stone, stoneUnit, metalUnit) : 0;
    const net =
      grossStr === "" ? "" : Math.max(0, gross - convertedStone).toFixed(4);
    updateMaterial(index, { grossWeight: grossStr, netWeight: net });
  }

  function handleStoneTypeChange(index: number, stoneMaterialId: string) {
    const row = values[index];
    const gross =
      row.grossWeight === "" ? 0 : parseFloat(row.grossWeight || "0") || 0;
    const stone =
      row.stoneWeight === "" ? 0 : parseFloat(row.stoneWeight || "0") || 0;
    const stoneMat = stoneMaterialId
      ? materials.find((m) => m.id === stoneMaterialId)
      : null;
    const stoneUnit = stoneMat?.unit || "CARAT";
    const metalUnit = row.unit || "GRAM";
    const convertedStone =
      stone > 0 ? convertWeightToNumber(stone, stoneUnit, metalUnit) : 0;
    const net =
      row.grossWeight === ""
        ? ""
        : Math.max(0, gross - convertedStone).toFixed(4);
    updateMaterial(index, { stoneMaterialId, netWeight: net });
  }

  function handleStoneWeightChange(index: number, stoneStr: string) {
    const row = values[index];
    const gross =
      row.grossWeight === "" ? 0 : parseFloat(row.grossWeight || "0") || 0;
    const stone = stoneStr === "" ? 0 : parseFloat(stoneStr) || 0;
    const stoneMat = row.stoneMaterialId
      ? materials.find((m) => m.id === row.stoneMaterialId)
      : null;
    const stoneUnit = stoneMat?.unit || "CARAT";
    const metalUnit = row.unit || "GRAM";
    const convertedStone =
      stone > 0 ? convertWeightToNumber(stone, stoneUnit, metalUnit) : 0;
    const net =
      row.grossWeight === ""
        ? ""
        : Math.max(0, gross - convertedStone).toFixed(4);
    updateMaterial(index, { stoneWeight: stoneStr, netWeight: net });
  }

  function getRowRate(materialId: string, purityId?: string): number | null {
    if (!materialId) return null;
    if (purityId && ratesMap[`${materialId}:${purityId}`] !== undefined)
      return ratesMap[`${materialId}:${purityId}`];
    if (ratesMap[`${materialId}:base`] !== undefined)
      return ratesMap[`${materialId}:base`];
    if (ratesMap[materialId] !== undefined) return ratesMap[materialId];
    return null;
  }

  function getRowCalculations(
    item: ProductMaterialValue,
    material?: MaterialOption,
  ) {
    if (!material) {
      return {
        primaryRate: null,
        stoneMaterial: null,
        stoneRate: null,
        convertedStone: 0,
        metalCost: null,
        stoneCost: null,
        totalCost: null,
      };
    }

    const primaryRate = getRowRate(item.materialId, item.purityId);
    const stoneMaterial = item.stoneMaterialId
      ? materials.find((m) => m.id === item.stoneMaterialId)
      : null;
    const stoneRate = item.stoneMaterialId
      ? getRowRate(item.stoneMaterialId)
      : null;

    let metalCost: number | null = null;
    let stoneCost: number | null = null;
    let convertedStone = 0;

    if (material.type === "PRECIOUS_METAL") {
      const gross = parseFloat(item.grossWeight || "0") || 0;
      const stone = parseFloat(item.stoneWeight || "0") || 0;
      const stoneUnit = stoneMaterial?.unit || "CARAT";
      const metalUnit = material.unit || "GRAM";

      convertedStone =
        stone > 0 ? convertWeightToNumber(stone, stoneUnit, metalUnit) : 0;
      const net = Math.max(0, gross - convertedStone);
      const wastage = parseFloat(item.wastagePercent || "0") || 0;

      if (primaryRate !== null) {
        metalCost = net * (1 + wastage / 100) * primaryRate;
      }
      if (item.stoneMaterialId && stone > 0 && stoneRate !== null) {
        stoneCost = stone * stoneRate;
      }
    } else {
      const qty = parseFloat(item.quantity || "0") || 0;
      const wastage = parseFloat(item.wastagePercent || "0") || 0;
      if (primaryRate !== null) {
        metalCost = qty * (1 + wastage / 100) * primaryRate;
      }
    }

    const totalCost =
      metalCost !== null || stoneCost !== null
        ? (metalCost ?? 0) + (stoneCost ?? 0)
        : null;

    return {
      primaryRate,
      stoneMaterial,
      stoneRate,
      convertedStone,
      metalCost,
      stoneCost,
      totalCost,
    };
  }

  const totalCost = values.reduce((sum, item) => {
    const material = materials.find((m) => m.id === item.materialId);
    const calcs = getRowCalculations(item, material);
    return sum + (calcs.totalCost ?? 0);
  }, 0);

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

  const readOnlyCls =
    "w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 cursor-not-allowed";

  const labelCls = "text-xs font-medium uppercase tracking-wide text-gray-500";

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-soft">
        <p className="text-sm text-gray-500">
          Loading materials and daily rates…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Material Composition
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Add every material used to manufacture this product.
          </p>
        </div>

        <button
          type="button"
          onClick={addMaterial}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Add Material
        </button>
      </div>

      {/* ── Empty state ───────────────────────────────────────────── */}
      {values.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-soft">
          <p className="text-sm font-medium text-gray-600">
            No materials added yet.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Click <strong>&ldquo;Add Material&rdquo;</strong> to specify the
            metals, gems, or other components in this product.
          </p>
          <button
            type="button"
            onClick={addMaterial}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Add the first material
          </button>
        </div>
      )}

      {/* ── Material cards ────────────────────────────────────────── */}
      {values.map((item, index) => {
        const material = materials.find((m) => m.id === item.materialId);
        const isPrecious = material?.type === "PRECIOUS_METAL";
        const calcs = getRowCalculations(item, material);

        const grossNum = parseFloat(item.grossWeight || "0") || 0;
        const stoneNum = parseFloat(item.stoneWeight || "0") || 0;
        // const isStoneError = isPrecious && stoneNum > grossNum && grossNum > 0;
        const isStoneError =
          isPrecious && grossNum > 0 && calcs.convertedStone > grossNum;
        // Filter stone options from database materials (excluding current material)
        const stoneOptions = materials.filter((m) => m.id !== item.materialId);

        return (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white shadow-soft"
          >
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {material ? material.name : `Material ${index + 1}`}
                </span>
                {material && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {material.type.replace("_", " ")}
                  </span>
                )}
                {calcs.stoneMaterial && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200/60">
                    + {calcs.stoneMaterial.name} ({item.stoneWeight || "0"}{" "}
                    {calcs.stoneMaterial.unit})
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove
              </button>
            </div>

            {/* Card body — fields */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Material select */}
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Material</label>
                <select
                  value={item.materialId}
                  onChange={(e) => handleMaterialChange(index, e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select material…</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purity / Grade */}
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Purity / Grade</label>
                <select
                  value={item.purityId || ""}
                  onChange={(e) =>
                    updateMaterial(index, { purityId: e.target.value })
                  }
                  disabled={!material || material.purities.length === 0}
                  className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`}
                >
                  <option value="">
                    {material?.purities.length ? "Select purity…" : "N/A"}
                  </option>
                  {material?.purities.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Unit</label>
                <div className={readOnlyCls}>
                  {item.unit || <span className="text-gray-400">—</span>}
                </div>
              </div>

              {/* ── Precious metal fields ────────────────────────── */}
              {isPrecious && (
                <>
                  {/* Gross Weight */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>
                      Gross Weight ({item.unit})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={item.grossWeight ?? ""}
                      onChange={(e) =>
                        handleGrossWeightChange(index, e.target.value)
                      }
                      placeholder="0.0000"
                      className={inputCls}
                    />
                  </div>

                  {/* Stone Type dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>
                      Stone Type
                      <span
                        title="Select an embedded stone/material type to price the stone at its own rate."
                        className="ml-1 cursor-help text-gray-400"
                      >
                        &#9432;
                      </span>
                    </label>
                    <select
                      value={item.stoneMaterialId || ""}
                      onChange={(e) =>
                        handleStoneTypeChange(index, e.target.value)
                      }
                      className={inputCls}
                    >
                      <option value="">None (No embedded stone)</option>
                      {stoneOptions.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stone Weight */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>
                      Stone Weight{" "}
                      {calcs.stoneMaterial
                        ? `(${calcs.stoneMaterial.unit})`
                        : ""}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={item.stoneWeight ?? "0"}
                      onChange={(e) =>
                        handleStoneWeightChange(index, e.target.value)
                      }
                      placeholder="0.0000"
                      className={`${inputCls} ${
                        isStoneError
                          ? "border-rose-400 text-rose-700 focus:ring-rose-100"
                          : ""
                      }`}
                    />
                    {isStoneError && (
                      <p className="text-xs text-rose-600">
                        Converted stone weight (
                        {calcs.convertedStone.toFixed(4)} {item.unit}) cannot
                        exceed gross weight ({grossNum} {item.unit})
                      </p>
                    )}
                    {!isStoneError && calcs.stoneMaterial && stoneNum > 0 && (
                      <p className="text-xs text-slate-500">
                        {calcs.stoneMaterial.unit !== item.unit ? (
                          <span>
                            {stoneNum} {calcs.stoneMaterial.unit} ={" "}
                            <strong>
                              {calcs.convertedStone.toFixed(4)} {item.unit}
                            </strong>{" "}
                            deducted from metal
                          </span>
                        ) : (
                          <span>
                            Priced at {calcs.stoneMaterial.name} rate (
                            {calcs.stoneMaterial.unit})
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Net Metal Weight (auto) */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>
                      Net Metal Weight (auto {item.unit})
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={item.netWeight ?? ""}
                      placeholder="0.0000"
                      className={readOnlyCls}
                    />
                  </div>

                  {/* Wastage % */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Wastage %</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.wastagePercent ?? "0"}
                      onChange={(e) =>
                        updateMaterial(index, {
                          wastagePercent: e.target.value,
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </>
              )}

              {/* ── Non-precious quantity field ──────────────────── */}
              {!isPrecious && material && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Quantity ({item.unit})</label>
                    <input
                      type="number"
                      min="0"
                      step="0.000001"
                      value={item.quantity}
                      onChange={(e) =>
                        updateMaterial(index, { quantity: e.target.value })
                      }
                      placeholder="0.000"
                      className={inputCls}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Wastage %</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.wastagePercent ?? "0"}
                      onChange={(e) =>
                        updateMaterial(index, {
                          wastagePercent: e.target.value,
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Card footer — rate + cost */}
            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">
                  {material?.name || "Material"} rate:{" "}
                  {calcs.primaryRate !== null ? (
                    <strong className="text-gray-900">
                      NPR {calcs.primaryRate.toLocaleString("en-NP")} /{" "}
                      {item.unit}
                    </strong>
                  ) : (
                    <span className="text-gray-400">
                      {item.materialId ? "No active rate" : "—"}
                    </span>
                  )}
                </span>

                {calcs.stoneMaterial && (
                  <span className="text-xs text-slate-600">
                    {calcs.stoneMaterial.name} rate:{" "}
                    {calcs.stoneRate !== null ? (
                      <strong className="text-gray-900">
                        NPR {calcs.stoneRate.toLocaleString("en-NP")} /{" "}
                        {calcs.stoneMaterial.unit}
                      </strong>
                    ) : (
                      <span className="text-gray-400">No active rate</span>
                    )}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start sm:items-end gap-0.5">
                {calcs.stoneMaterial &&
                  calcs.stoneCost !== null &&
                  calcs.stoneCost > 0 && (
                    <div className="text-xs text-slate-500">
                      <span>
                        Metal: NPR{" "}
                        {(calcs.metalCost ?? 0).toLocaleString("en-NP", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="mx-1.5">+</span>
                      <span>
                        Stone: NPR{" "}
                        {calcs.stoneCost.toLocaleString("en-NP", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                <span className="text-sm text-gray-600">
                  Line Total:{" "}
                  {calcs.totalCost !== null ? (
                    <strong className="text-gray-900">
                      NPR{" "}
                      {calcs.totalCost.toLocaleString("en-NP", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Total summary ─────────────────────────────────────────── */}
      {values.length > 0 && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-soft sm:flex-row sm:items-center">
          <span className="text-sm text-gray-500">
            {values.filter((v) => v.materialId).length} material(s) included
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Total Material Cost:
            </span>
            <span className="text-base font-bold text-gray-900">
              NPR{" "}
              {totalCost.toLocaleString("en-NP", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
