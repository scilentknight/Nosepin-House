"use client";

import { useEffect, useState } from "react";

import type { ProductFormValues } from "../ProductForm";

import type { JewelleryPricing } from "@/lib/jewellery/types";

import { JewelleryPricingSummary } from "../JewelleryPricingSummary";

interface Props {
  values: ProductFormValues;

  set: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function PricingTab({ values, set }: Props) {
  const [pricing, setPricing] = useState<JewelleryPricing | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /*
     * Do not calculate if there are no
     * materials yet.
     */
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
                netWeight: material.netWeight ? Number(material.netWeight) : null,
                quantity: Number(material.quantity || material.netWeight || 0),
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
        }
      } catch (error) {
        console.error("Pricing calculation failed:", error);
      } finally {
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

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Recalculating current price...
        </div>
      )}

      <JewelleryPricingSummary
        pricing={pricing}
        labourCharge={values.labourCharge}
        makingCharge={values.makingCharge}
        otherCharge={values.otherCharge}
        markupType={values.markupType}
        markupValue={values.markupValue}
        set={set}
      />
    </div>
  );
}
