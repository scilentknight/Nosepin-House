"use client";

import { useEffect, useState } from "react";
import { Coins, History, Save, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { extractKarat } from "@/lib/jewellery/rate-calculator";

interface Purity {
  id: string;
  name: string;
  code: string;
  fineness: number | null;
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

interface MaterialSummary {
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string;
  type: string;
  purities: Purity[];
  baseRateRecord: {
    id: string;
    purityId: string;
    rateDate: string;
    rate: number;
    notes?: string;
    purity: { name: string; code: string };
  } | null;
  derivedRates: DerivedRateItem[];
}

interface MaterialInputState {
  basePurityId: string;
  baseRate: string;
  rateDate: string;
  notes: string;
}

interface RateHistoryRecord {
  id: string;
  materialId: string;
  purityId: string;
  rateDate: string;
  rate: number;
  unit: string;
  isBaseRate: boolean;
  notes?: string;
  material: { name: string };
  purity: { name: string; code: string };
}

export function MaterialRateManager() {
  const [materialSummaries, setMaterialSummaries] = useState<MaterialSummary[]>(
    [],
  );
  const [inputStates, setInputStates] = useState<
    Record<string, MaterialInputState>
  >({});
  const [historyRecords, setHistoryRecords] = useState<RateHistoryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");

  const [loading, setLoading] = useState(true);
  const [savingMaterialId, setSavingMaterialId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [todayRes, historyRes] = await Promise.all([
        fetch("/api/admin/material-rates", { cache: "no-store" }),
        fetch("/api/admin/material-rates?history=true", { cache: "no-store" }),
      ]);

      const todayJson = await todayRes.json();
      const historyJson = await historyRes.json();

      const summaries: MaterialSummary[] = todayJson.data ?? [];
      const history: RateHistoryRecord[] = historyJson.data ?? [];

      setMaterialSummaries(summaries);
      setHistoryRecords(history);

      const initialInputs: Record<string, MaterialInputState> = {};
      for (const mat of summaries) {
        const basePurity =
          mat.purities.find(
            (p) => p.code.toUpperCase() === "24K" || p.name.includes("24K"),
          ) ||
          mat.purities.find((p) => p.code.includes("999")) ||
          mat.purities[0];

        initialInputs[mat.materialId] = {
          basePurityId: mat.baseRateRecord?.purityId || basePurity?.id || "",
          baseRate: mat.baseRateRecord?.rate
            ? String(mat.baseRateRecord.rate)
            : "",
          rateDate: todayStr,
          notes: mat.baseRateRecord?.notes || "",
        };
      }

      setInputStates(initialInputs);
    } catch (error) {
      console.error("Failed to load material rates", error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    materialId: string,
    field: keyof MaterialInputState,
    value: string,
  ) {
    setInputStates((prev) => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        [field]: value,
      },
    }));
  }

  function calculatePreviewDerivedRate(
    material: MaterialSummary,
    targetPurity: Purity,
  ): number | null {
    const input = inputStates[material.materialId];
    if (!input || !input.baseRate || isNaN(parseFloat(input.baseRate))) {
      return null;
    }

    const baseRate = parseFloat(input.baseRate);
    const basePurity = material.purities.find(
      (p) => p.id === input.basePurityId,
    );
    if (!basePurity) return baseRate;

    if (basePurity.id === targetPurity.id) return baseRate;

    const baseKarat =
      extractKarat(basePurity.code) || extractKarat(basePurity.name);
    const targetKarat =
      extractKarat(targetPurity.code) || extractKarat(targetPurity.name);
    if (baseKarat && targetKarat && baseKarat > 0) {
      return Math.round((baseRate / baseKarat) * targetKarat * 10000) / 10000;
    }

    if (
      basePurity.fineness &&
      targetPurity.fineness &&
      basePurity.fineness > 0
    ) {
      return (
        Math.round(
          baseRate * (targetPurity.fineness / basePurity.fineness) * 10000,
        ) / 10000
      );
    }

    return baseRate;
  }

  async function saveBaseRate(materialId: string) {
    const input = inputStates[materialId];
    if (!input) return;

    if (!input.basePurityId) {
      setMessage({ type: "error", text: "Please select a Base Purity" });
      return;
    }

    const rateNum = parseFloat(input.baseRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid positive base rate",
      });
      return;
    }

    setSavingMaterialId(materialId);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/material-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId,
          purityId: input.basePurityId,
          rate: rateNum,
          rateDate: input.rateDate,
          notes: input.notes,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to save material rate");
      }

      setMessage({
        type: "success",
        text: json.message || "Base rate saved successfully!",
      });

      await loadData();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save rate",
      });
    } finally {
      setSavingMaterialId(null);
    }
  }

  if (loading) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-soft">
        Loading material rate system...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={activeTab === "today" ? "admin" : "adminOutline"}
            size="sm"
            onClick={() => setActiveTab("today")}
          >
            <Coins className="h-4 w-4" />
            Today's Base Rates
          </Button>
          <Button
            type="button"
            variant={activeTab === "history" ? "admin" : "adminOutline"}
            size="sm"
            onClick={() => setActiveTab("history")}
          >
            <History className="h-4 w-4" />
            Rate History ({historyRecords.length})
          </Button>
        </div>
      </div>

      {/* Message notification */}
      {message && (
        <div
          className={`rounded-xl p-4 text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Today's Base Rates Tab */}
      {activeTab === "today" && (
        <div className="space-y-6">
          {materialSummaries.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-soft">
              No materials configured. Please add materials in Materials first.
            </p>
          ) : (
            materialSummaries.map((mat) => {
              const input = inputStates[mat.materialId] || {
                basePurityId: "",
                baseRate: "",
                rateDate: todayStr,
                notes: "",
              };

              const isSaving = savingMaterialId === mat.materialId;

              return (
                <div
                  key={mat.materialId}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-soft space-y-5"
                >
                  {/* Material Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          {mat.materialName}
                        </h2>
                        <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 uppercase">
                          {mat.type.replace("_", " ")}
                        </span>
                        <span className="text-xs text-gray-500">
                          Unit: Per {mat.unit.toLowerCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: {mat.materialCode} | Purities:{" "}
                        {mat.purities.length} configured
                      </p>
                    </div>

                    {mat.baseRateRecord && (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                          Active Base: {mat.baseRateRecord.purity.name} = NPR{" "}
                          {mat.baseRateRecord.rate.toLocaleString()} /{" "}
                          {mat.unit.toLowerCase()}
                        </span>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Date:{" "}
                          {new Date(
                            mat.baseRateRecord.rateDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Input controls */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Base Purity *
                      </label>
                      <select
                        value={input.basePurityId}
                        onChange={(e) =>
                          handleInputChange(
                            mat.materialId,
                            "basePurityId",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      >
                        {mat.purities.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Daily Base Rate (NPR) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={input.baseRate}
                        onChange={(e) =>
                          handleInputChange(
                            mat.materialId,
                            "baseRate",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. 24000"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Effective Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={todayStr}
                          max={maxDateStr}
                          value={input.rateDate}
                          onChange={(e) =>
                            handleInputChange(
                              mat.materialId,
                              "rateDate",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={input.notes}
                        onChange={(e) =>
                          handleInputChange(
                            mat.materialId,
                            "notes",
                            e.target.value,
                          )
                        }
                        placeholder="Market rate note"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <Button
                        type="button"
                        variant="admin"
                        size="sm"
                        isLoading={isSaving}
                        onClick={() => saveBaseRate(mat.materialId)}
                        className="w-full"
                      >
                        <Save className="h-4 w-4" />
                        Save Base Rate
                      </Button>
                    </div>
                  </div>

                  {/* Derived Purity Table */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                      Auto-Derived Purity Rates
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                          <tr>
                            <th className="px-4 py-3">Purity / Grade</th>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Fineness</th>
                            <th className="px-4 py-3">Rate Type</th>
                            <th className="px-4 py-3 text-right">
                              Calculated Rate (NPR / {mat.unit.toLowerCase()})
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {mat.purities.map((purity) => {
                            const isBase = input.basePurityId === purity.id;
                            const previewRate = calculatePreviewDerivedRate(
                              mat,
                              purity,
                            );

                            return (
                              <tr
                                key={purity.id}
                                className={
                                  isBase
                                    ? "bg-amber-50/40 font-medium"
                                    : "hover:bg-gray-50/50"
                                }
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                      {purity.name}
                                    </span>
                                    {isBase && (
                                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                                        BASE PURITY
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                  {purity.code}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                  {purity.fineness !== null
                                    ? purity.fineness
                                    : "—"}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {isBase ? (
                                    <span className="text-amber-700 font-medium">
                                      User Base Rate
                                    </span>
                                  ) : (
                                    <span className="text-emerald-700 font-medium">
                                      Derived Automatically
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                  {previewRate !== null ? (
                                    <span>
                                      NPR {previewRate.toLocaleString("en-NP")}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 font-normal italic">
                                      Enter base rate
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Rate History Tab */}
      {activeTab === "history" && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Purity / Grade</th>
                  <th className="px-4 py-3 text-right">Base Rate</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Record Type</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No rate history recorded yet.
                    </td>
                  </tr>
                ) : (
                  historyRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {new Date(r.rateDate).toLocaleDateString("en-NP")}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {r.material.name}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">
                            {r.purity.name}
                          </span>
                          {r.isBaseRate && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                              BASE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-gray-900">
                        NPR {r.rate.toLocaleString("en-NP")}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        Per {r.unit.toLowerCase()}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {r.isBaseRate ? "Daily Base Rate" : "Purity Specific"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {r.notes || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
