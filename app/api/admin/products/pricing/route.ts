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

    // Validate materials array items
    const parsedMaterials = materials.map((item: any) => ({
      materialId: String(item.materialId || ""),
      purityId: String(item.purityId || ""),
      quantity: Number(item.quantity || 0),
      wastagePercent: Number(item.wastagePercent || 0),
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
