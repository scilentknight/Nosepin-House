import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";

export interface PurityData {
  id: string;
  name: string;
  code: string;
  fineness: number | string | Decimal | null;
}

/**
 * Extracts karat value from a string (e.g. "24K", "18K", "22.5k", "14 KARAT")
 */
export function extractKarat(codeOrName: string): number | null {
  if (!codeOrName) return null;
  const match = codeOrName.match(/(\d+(?:\.\d+)?)\s*k(?:arat)?\b/i);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    return isNaN(val) || val <= 0 ? null : val;
  }
  return null;
}

/**
 * Derives rate for a target purity based on a base rate and base purity.
 * Priority:
 * 1. Karat ratio if both purities represent Karat values (e.g. 24K -> 18K)
 * 2. Fineness ratio if both purities have non-null fineness
 * 3. Identity if same purity ID
 * 4. Fallback to base rate
 */
export function derivePurityRate(
  baseRateInput: Decimal | number | string,
  basePurity: PurityData,
  targetPurity: PurityData,
): Decimal {
  const baseRate = new Decimal(baseRateInput);

  if (basePurity.id === targetPurity.id) {
    return baseRate;
  }

  // 1. Check Karat ratio
  const baseKarat = extractKarat(basePurity.code) || extractKarat(basePurity.name);
  const targetKarat = extractKarat(targetPurity.code) || extractKarat(targetPurity.name);

  if (baseKarat && targetKarat && baseKarat > 0) {
    const karatRatio = new Decimal(targetKarat).div(new Decimal(baseKarat));
    return baseRate.mul(karatRatio).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
  }

  // 2. Check Fineness ratio
  if (basePurity.fineness !== null && basePurity.fineness !== undefined &&
      targetPurity.fineness !== null && targetPurity.fineness !== undefined) {
    const baseFine = new Decimal(basePurity.fineness);
    const targetFine = new Decimal(targetPurity.fineness);

    if (baseFine.greaterThan(0)) {
      const fineRatio = targetFine.div(baseFine);
      return baseRate.mul(fineRatio).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
    }
  }

  // 3. Fallback
  return baseRate;
}

/**
 * Parses and normalizes date-only input into UTC midnight Date to avoid timezone shifts.
 */
export function parseDateOnly(dateInput?: string | Date | null): Date {
  if (!dateInput) {
    const d = new Date();
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  if (typeof dateInput === "string") {
    const dateStr = dateInput.split("T")[0];
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    }
  }
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Gets the latest active base rate record for a material on or before targetDate.
 */
export async function getMaterialBaseRate(
  materialId: string,
  targetDate: Date | string = new Date(),
) {
  const normalizedTargetDate = parseDateOnly(targetDate);
  const endOfTargetDate = new Date(normalizedTargetDate);
  endOfTargetDate.setUTCHours(23, 59, 59, 999);

  // First check if there is an explicit record flagged as isBaseRate
  let baseRateRecord = await prisma.materialRate.findFirst({
    where: {
      materialId,
      isBaseRate: true,
      status: "ACTIVE",
      rateDate: {
        lte: endOfTargetDate,
      },
    },
    include: {
      purity: true,
      material: true,
    },
    orderBy: {
      rateDate: "desc",
    },
  });

  // Fallback to any active rate for this material if no isBaseRate=true record is found
  if (!baseRateRecord) {
    baseRateRecord = await prisma.materialRate.findFirst({
      where: {
        materialId,
        status: "ACTIVE",
        rateDate: {
          lte: endOfTargetDate,
        },
      },
      include: {
        purity: true,
        material: true,
      },
      orderBy: {
        rateDate: "desc",
      },
    });
  }

  return baseRateRecord;
}

/**
 * Gets the derived material rate for a specific purity of a material on targetDate.
 */
export async function getDerivedMaterialRate(
  materialId: string,
  purityId: string,
  targetDate: Date = new Date(),
) {
  const targetPurity = await prisma.materialPurity.findUnique({
    where: { id: purityId },
  });

  if (!targetPurity || targetPurity.materialId !== materialId) {
    throw new Error(`Invalid purity record ${purityId} for material ${materialId}`);
  }

  const baseRateRecord = await getMaterialBaseRate(materialId, targetDate);

  if (!baseRateRecord) {
    return null;
  }

  const derivedRate = derivePurityRate(
    baseRateRecord.rate,
    baseRateRecord.purity,
    targetPurity,
  );

  return {
    rate: derivedRate,
    baseRateRecord,
    basePurity: baseRateRecord.purity,
    targetPurity,
    unit: baseRateRecord.unit,
  };
}

/**
 * Returns derived rates for all active purities of a material for display or calculation.
 */
export async function getAllDerivedPurityRatesForMaterial(
  materialId: string,
  targetDate: Date = new Date(),
) {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: {
      purities: {
        where: { isActive: true },
      },
    },
  });

  if (!material) {
    throw new Error(`Material with ID ${materialId} not found`);
  }

  const baseRateRecord = await getMaterialBaseRate(materialId, targetDate);

  if (!baseRateRecord) {
    return {
      material,
      baseRateRecord: null,
      derivedRates: [],
    };
  }

  const derivedRates = material.purities.map((purity) => {
    const rate = derivePurityRate(baseRateRecord.rate, baseRateRecord.purity, purity);
    return {
      purityId: purity.id,
      purityName: purity.name,
      purityCode: purity.code,
      fineness: purity.fineness ? Number(purity.fineness) : null,
      isBasePurity: purity.id === baseRateRecord.purityId,
      rate: rate.toNumber(),
      unit: baseRateRecord.unit,
    };
  });

  return {
    material,
    baseRateRecord,
    derivedRates,
  };
}
