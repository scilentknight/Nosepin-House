import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { recalculateAffectedProducts } from "@/lib/jewellery/recalculate-products";
import {
  getAllDerivedPurityRatesForMaterial,
  parseDateOnly,
} from "@/lib/jewellery/rate-calculator";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const history = searchParams.get("history") === "true";
    const dateParam = searchParams.get("date");
    const materialId = searchParams.get("materialId");

    const targetDate = parseDateOnly(dateParam);

    if (!history) {
      // Return materials with their active base rates and derived purity rates
      const materials = await prisma.material.findMany({
        where: {
          isActive: true,
          ...(materialId ? { id: materialId } : {}),
        },
        include: {
          purities: {
            where: { isActive: true },
          },
        },
        orderBy: { name: "asc" },
      });

      const materialRateSummaries = await Promise.all(
        materials.map(async (mat) => {
          const derived = await getAllDerivedPurityRatesForMaterial(
            mat.id,
            targetDate,
          );
          return {
            materialId: mat.id,
            materialName: mat.name,
            materialCode: mat.code,
            unit: mat.unit,
            type: mat.type,
            purities: mat.purities,
            baseRateRecord: derived.baseRateRecord
              ? {
                  ...derived.baseRateRecord,
                  rate: Number(derived.baseRateRecord.rate),
                }
              : null,
            derivedRates: derived.derivedRates,
          };
        }),
      );

      return ok(materialRateSummaries);
    }

    // Rate history mode
    const where: any = {
      status: "ACTIVE",
    };
    if (materialId) where.materialId = materialId;

    const historyRates = await prisma.materialRate.findMany({
      where,
      include: {
        material: true,
        purity: true,
      },
      orderBy: [{ rateDate: "desc" }, { createdAt: "desc" }],
    });

    const formatted = historyRates.map((r) => ({
      ...r,
      rate: Number(r.rate),
    }));

    return ok(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const materialId = body.materialId;
    const purityId = body.purityId; // Base purity selected
    const rate = Number(body.rate);
    const notes = body.notes?.trim() || null;
    const status = body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    const rateDate = parseDateOnly(body.rateDate);

    if (!materialId) {
      return fail(400, "Material is required");
    }

    if (!purityId) {
      return fail(400, "Base purity or grade is required");
    }

    if (!Number.isFinite(rate) || rate <= 0) {
      return fail(400, "Valid positive base rate is required");
    }

    // Validate material exists
    const material = await prisma.material.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      return fail(404, "Material not found");
    }

    // Validate purity exists and belongs to material
    const purity = await prisma.materialPurity.findUnique({
      where: { id: purityId },
    });

    if (!purity || purity.materialId !== materialId) {
      return fail(400, "Invalid base purity for this material");
    }

    // Ensure any existing base rate flag for this material on this date is updated
    await prisma.materialRate.updateMany({
      where: {
        materialId,
        rateDate,
      },
      data: {
        isBaseRate: false,
      },
    });

    // Upsert the base rate record for (materialId, purityId, rateDate)
    const saved = await prisma.materialRate.upsert({
      where: {
        materialId_purityId_rateDate: {
          materialId,
          purityId,
          rateDate,
        },
      },
      update: {
        rate,
        unit: material.unit,
        isBaseRate: true,
        notes,
        status,
      },
      create: {
        materialId,
        purityId,
        rateDate,
        rate,
        unit: material.unit,
        isBaseRate: true,
        notes,
        status,
      },
      include: {
        material: true,
        purity: true,
      },
    });

    // Recalculate affected products using new base rate
    // const recalculationResult = await recalculateAffectedProducts(materialId);
    function isEffectiveDate(date: Date) {
      const today = new Date();

      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      const effectiveDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      return effectiveDate <= todayDate;
    }
    const today = new Date();

    let recalculationResult = {
      total: 0,
      updatedCount: 0,
      skippedCount: 0,
      skippedProductIds: [] as number[],
      errors: [] as {
        productId: number;
        productName: string;
        message: string;
      }[],
    };

    if (rateDate <= today) {
      recalculationResult = await recalculateAffectedProducts(
        materialId,
        undefined,
        rateDate,
      );
    }
    // Get all derived rates for display response
    const derivedSummary = await getAllDerivedPurityRatesForMaterial(
      materialId,
      rateDate,
    );

    return ok(
      {
        rate: {
          ...saved,
          rate: Number(saved.rate),
        },
        derivedRates: derivedSummary.derivedRates,
        recalculatedProducts: recalculationResult,
      },
      `Base rate saved for ${material.name} (${purity.name}). Derived rates updated and ${recalculationResult.updatedCount} affected products recalculated.`,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
