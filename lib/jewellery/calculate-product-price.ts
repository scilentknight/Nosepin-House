import { prisma } from "@/lib/prisma";
import { calculateJewelleryPrice } from "./pricing";
import { getDerivedMaterialRate } from "./rate-calculator";
import type { MaterialBreakdownItem } from "./types";

export interface CalculateProductMaterialInput {
  id?: string;
  materialId: string;
  purityId?: string | null;
  grossWeight?: number | null;
  stoneWeight?: number | null;
  netWeight?: number | null;
  quantity: number;
  unit?: string;
  wastagePercent?: number | null;
  sortOrder?: number;
}

export async function getCurrentMaterialRate(
  materialId: string,
  purityId?: string | null,
  targetDate: Date = new Date(),
) {
  const result = await getDerivedMaterialRate(materialId, purityId, targetDate);
  if (!result) return null;
  return {
    rate: result.rate,
    unit: result.unit,
    baseRateRecord: result.baseRateRecord,
    basePurity: result.basePurity,
    targetPurity: result.targetPurity,
  };
}

export async function calculateProductPrice(
  materials: CalculateProductMaterialInput[],
  labourCharge: number = 0,
  makingCharge: number = 0,
  otherCharge: number = 0,
  markupType: "PERCENTAGE" | "FIXED" | "" = "",
  markupValue: number = 0,
  targetDate: Date = new Date(),
) {
  const pricingMaterials = [];
  const materialBreakdown: MaterialBreakdownItem[] = [];

  for (const item of materials) {
    if (!item.materialId) {
      throw new Error("Each material entry must specify materialId");
    }

    const mat = await prisma.material.findUnique({
      where: { id: item.materialId },
      include: {
        purities: true,
      },
    });

    if (!mat) {
      throw new Error(`Material with ID "${item.materialId}" not found`);
    }

    const rateResult = await getCurrentMaterialRate(
      item.materialId,
      item.purityId,
      targetDate,
    );

    if (!rateResult) {
      const pur = item.purityId
        ? await prisma.materialPurity.findUnique({
            where: { id: item.purityId },
            select: { name: true },
          })
        : null;
      throw new Error(
        `No active material rate found for ${mat.name}${pur ? ` (${pur.name})` : ""}`,
      );
    }

    const rateNum =
      typeof rateResult.rate === "number"
        ? rateResult.rate
        : rateResult.rate.toNumber();

    // Determine effective quantity and weights based on material type
    let netWeight: number | null = null;
    let grossWeight: number | null = null;
    let stoneWeight: number | null = null;
    let effectiveBaseQuantity = item.quantity;
    let wastagePercent = Number(item.wastagePercent || 0);

    if (mat.type === "PRECIOUS_METAL") {
      grossWeight = item.grossWeight !== null && item.grossWeight !== undefined ? Number(item.grossWeight) : null;
      stoneWeight = item.stoneWeight !== null && item.stoneWeight !== undefined ? Number(item.stoneWeight) : 0;

      if (grossWeight !== null) {
        netWeight = Math.max(0, grossWeight - (stoneWeight || 0));
        effectiveBaseQuantity = netWeight;
      } else if (item.netWeight !== null && item.netWeight !== undefined) {
        netWeight = Number(item.netWeight);
        effectiveBaseQuantity = netWeight;
      } else {
        effectiveBaseQuantity = Number(item.quantity || 0);
        netWeight = effectiveBaseQuantity;
      }
    } else {
      // Non-precious metals (Diamond, Gemstone, Piece, Other)
      effectiveBaseQuantity = Number(item.quantity || 0);
      grossWeight = null;
      stoneWeight = null;
      netWeight = null;
      // Wastage is typically 0 for stones/pieces unless explicitly provided
      wastagePercent = Number(item.wastagePercent || 0);
    }

    const wastageWeight = (effectiveBaseQuantity * wastagePercent) / 100;
    const chargeableQuantity = effectiveBaseQuantity + wastageWeight;
    const cost = chargeableQuantity * rateNum;

    pricingMaterials.push({
      quantity: effectiveBaseQuantity,
      rate: rateNum,
      wastagePercent,
    });

    materialBreakdown.push({
      id: item.id,
      materialId: item.materialId,
      materialName: mat.name,
      materialType: mat.type,
      purityId: item.purityId || null,
      purityName: rateResult.targetPurity?.name || null,
      grossWeight,
      stoneWeight,
      netWeight,
      quantity: effectiveBaseQuantity,
      unit: mat.unit,
      wastagePercent: wastagePercent > 0 ? wastagePercent : null,
      wastageWeight: wastageWeight > 0 ? wastageWeight : null,
      chargeableQuantity,
      rate: rateNum,
      cost,
    });
  }

  const pricing = calculateJewelleryPrice({
    materials: pricingMaterials,
    labourCharge,
    makingCharge,
    otherCharge,
    markupType,
    markupValue,
  });

  return {
    ...pricing,
    materialBreakdown,
  };
}
