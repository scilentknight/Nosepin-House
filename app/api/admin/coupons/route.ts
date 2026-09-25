import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { parsePagination } from "@/lib/admin-query";
import { couponSchema } from "@/schemas/admin-coupon";

function serializeCoupon(coupon: {
  value: Prisma.Decimal;
  minOrderAmount: Prisma.Decimal | null;
  [key: string]: unknown;
}) {
  return {
    ...coupon,
    value: Number(coupon.value),
    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
  };
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const active = searchParams.get("active");
    const { page, pageSize, skip } = parsePagination(searchParams);

    const where: Prisma.CouponWhereInput = {
      ...(active === "true" || active === "false" ? { active: active === "true" } : {}),
      ...(search ? { code: { contains: search } } : {}),
    };

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.coupon.count({ where }),
    ]);

    return ok({ coupons: coupons.map(serializeCoupon), total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;

    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) return fail(400, "This coupon code already exists");

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active: data.active,
      },
    });

    return ok(serializeCoupon(coupon), "Coupon created");
  } catch (error) {
    return handleApiError(error);
  }
}
