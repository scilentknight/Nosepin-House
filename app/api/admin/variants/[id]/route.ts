import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { variantSchema } from "@/schemas/admin-variant";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid variant id");

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) return fail(404, "Variant not found");

    const body = await request.json();
    const parsed = variantSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;

    const variant = await prisma.$transaction(async (tx) => {
      await tx.productVariantValue.deleteMany({ where: { variantId: id } });
      return tx.productVariant.update({
        where: { id },
        data: {
          sku: data.sku || null,
          price: data.price ?? null,
          compareAtPrice: data.compareAtPrice ?? null,
          costPrice: data.costPrice ?? null,
          stockQuantity: data.stockQuantity,
          lowStockAlert: data.lowStockAlert ?? null,
          weight: data.weight ?? null,
          image: data.image || null,
          status: data.status,
          attributeValues: { create: data.attributeValueIds.map((attributeValueId) => ({ attributeValueId })) },
        },
      });
    });

    return ok(variant, "Variant updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid variant id");

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) return fail(404, "Variant not found");

    await prisma.productVariant.update({ where: { id }, data: { deletedAt: new Date() } });
    return ok(null, "Variant moved to trash");
  } catch (error) {
    return handleApiError(error);
  }
}
