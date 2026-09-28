import { prisma } from "@/lib/prisma";
import { calculateJewelleryPrice } from "./pricing";
import { getDerivedMaterialRate } from "./rate-calculator";

export async function getCurrentMaterialRate(
  materialId: string,
  purityId: string,
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
  materials: {
    materialId: string;
    purityId: string;
    quantity: number;
    wastagePercent: number;
  }[],
  labourCharge: number,
  makingCharge: number,
  otherCharge: number,
  markupType: "PERCENTAGE" | "FIXED" | "",
  markupValue: number,
  targetDate: Date = new Date(),
) {
  const pricingMaterials = [];
  const materialBreakdown = [];

  for (const item of materials) {
    if (!item.materialId || !item.purityId) {
      throw new Error("Each material entry must specify materialId and purityId");
    }

    const rateResult = await getCurrentMaterialRate(item.materialId, item.purityId, targetDate);

    if (!rateResult) {
      const mat = await prisma.material.findUnique({ where: { id: item.materialId }, select: { name: true } });
      const pur = await prisma.materialPurity.findUnique({ where: { id: item.purityId }, select: { name: true } });
      throw new Error(
        `No active material rate found for ${mat?.name ?? item.materialId} (${pur?.name ?? item.purityId})`,
      );
    }

    const rateNum = rateResult.rate.toNumber();

    pricingMaterials.push({
      quantity: item.quantity,
      rate: rateNum,
      wastagePercent: item.wastagePercent,
    });

    const adjustedQty = item.quantity * (1 + item.wastagePercent / 100);
    const cost = adjustedQty * rateNum;

    materialBreakdown.push({
      materialId: item.materialId,
      purityId: item.purityId,
      quantity: item.quantity,
      wastagePercent: item.wastagePercent,
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
