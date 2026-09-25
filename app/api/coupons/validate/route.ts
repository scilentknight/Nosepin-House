import { prisma } from "@/lib/prisma";
import { ok, fail, handleApiError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return fail(400, "Coupon code is required");

    const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });

    if (!coupon || !coupon.active) return fail(404, "Invalid or expired coupon code");
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return fail(404, "This coupon has expired");
    }
    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return fail(400, `Minimum order of Rs. ${Number(coupon.minOrderAmount)} required for this coupon`);
    }

    const discount =
      coupon.type === "PERCENT"
        ? Math.round(subtotal * (Number(coupon.value) / 100) * 100) / 100
        : Number(coupon.value);

    return ok({
      code: coupon.code,
      discount: Math.min(discount, subtotal),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
