import { fail, handleApiError, ok } from "@/lib/api";
import { computeShippingAndTax } from "@/lib/checkoutCore";

/** Live shipping+tax estimate for the checkout page — purely informational; the real amounts are recomputed server-side when the order is placed. */
export async function POST(request: Request) {
  try {
    const { country, subtotal, discount, municipalityId } = await request.json();
    if (!country || typeof country !== "string") return fail(400, "Country is required");

    const normalizedSubtotal = Number(subtotal) || 0;
    const normalizedDiscount = Number(discount) || 0;
    const normalizedMunicipalityId = Number.isFinite(Number(municipalityId)) && municipalityId ? Number(municipalityId) : null;

    const result = await computeShippingAndTax(country, normalizedSubtotal, normalizedDiscount, normalizedMunicipalityId);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
