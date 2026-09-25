import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return fail(404, "Coupon not found");

    return ok(serializeCoupon(coupon));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) return fail(404, "Coupon not found");

    const body = await request.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;

    if (data.code !== existing.code) {
      const codeTaken = await prisma.coupon.findUnique({ where: { code: data.code } });
      if (codeTaken) return fail(400, "This coupon code already exists");
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active: data.active,
      },
    });

    return ok(serializeCoupon(coupon), "Coupon updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) return fail(404, "Coupon not found");

    const body = await request.json();
    if (typeof body?.active !== "boolean") return fail(400, "Invalid request");

    const coupon = await prisma.coupon.update({ where: { id }, data: { active: body.active } });
    return ok(serializeCoupon(coupon), "Coupon updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) return fail(404, "Coupon not found");

    const usageCount = await prisma.order.count({ where: { couponId: id } });
    if (usageCount > 0) {
      return fail(400, "Cannot delete a coupon that has been used by existing orders — deactivate it instead");
    }

    await prisma.coupon.delete({ where: { id } });
    return ok(null, "Coupon deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
