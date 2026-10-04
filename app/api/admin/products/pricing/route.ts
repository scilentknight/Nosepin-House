import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { calculateProductPrice } from "@/lib/jewellery/calculate-product-price";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const {
      materials = [],
      labourCharge = 0,
      makingCharge = 0,
      otherCharge = 0,
      markupType = "",
      markupValue = 0,
    } = body;

    if (!Array.isArray(materials) || materials.length === 0) {
      return ok({
        materialCost: 0,
        labourCharge: Number(labourCharge || 0),
        makingCharge: Number(makingCharge || 0),
        otherCharge: Number(otherCharge || 0),
        subtotal: Number(labourCharge || 0) + Number(makingCharge || 0) + Number(otherCharge || 0),
        markupType,
        markupValue: Number(markupValue || 0),
        markupAmount: 0,
        sellingPrice: Number(labourCharge || 0) + Number(makingCharge || 0) + Number(otherCharge || 0),
        materialBreakdown: [],
      });
    }

    // Filter and validate materials array items
    const validMaterials = materials.filter(
      (item: any) => typeof item.materialId === "string" && item.materialId.trim() !== "",
    );

    if (validMaterials.length === 0) {
      return ok({
        materialCost: 0,
        labourCharge: Number(labourCharge || 0),
        makingCharge: Number(makingCharge || 0),
        otherCharge: Number(otherCharge || 0),
        subtotal: Number(labourCharge || 0) + Number(makingCharge || 0) + Number(otherCharge || 0),
        markupType,
        markupValue: Number(markupValue || 0),
        markupAmount: 0,
        sellingPrice: Number(labourCharge || 0) + Number(makingCharge || 0) + Number(otherCharge || 0),
        materialBreakdown: [],
      });
    }

    const parsedMaterials = validMaterials.map((item: any) => ({
      id: item.id,
      materialId: String(item.materialId).trim(),
      purityId: item.purityId && String(item.purityId).trim() !== "" ? String(item.purityId).trim() : null,
      grossWeight: item.grossWeight !== null && item.grossWeight !== undefined && item.grossWeight !== "" ? Number(item.grossWeight) : null,
      stoneWeight: item.stoneWeight !== null && item.stoneWeight !== undefined && item.stoneWeight !== "" ? Number(item.stoneWeight) : null,
      netWeight: item.netWeight !== null && item.netWeight !== undefined && item.netWeight !== "" ? Number(item.netWeight) : null,
      quantity: Number(item.quantity || 0),
      unit: item.unit,
      wastagePercent: item.wastagePercent !== null && item.wastagePercent !== undefined && item.wastagePercent !== "" ? Number(item.wastagePercent) : 0,
    }));

    const result = await calculateProductPrice(
      parsedMaterials,
      Number(labourCharge || 0),
      Number(makingCharge || 0),
      Number(otherCharge || 0),
      markupType as "PERCENTAGE" | "FIXED" | "",
      Number(markupValue || 0),
    );

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
