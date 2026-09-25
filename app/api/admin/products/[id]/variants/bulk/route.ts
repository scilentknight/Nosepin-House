import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { variantBulkUpdateSchema, variantBulkActionSchema } from "@/schemas/admin-variant";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawProductId } = await params;
    const productId = Number(rawProductId);
    if (Number.isNaN(productId)) return fail(400, "Invalid product id");
    const body = await request.json();

    if (body.action) {
      const parsed = variantBulkActionSchema.safeParse(body);
      if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");
      const { ids, action } = parsed.data;

      if (action === "delete") {
        await prisma.productVariant.updateMany({
          where: { id: { in: ids }, productId },
          data: { deletedAt: new Date() },
        });
      } else {
        await prisma.productVariant.updateMany({
          where: { id: { in: ids }, productId },
          data: { deletedAt: null },
        });
      }
      return ok(null, "Bulk action applied");
    }

    const parsed = variantBulkUpdateSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");
    const { ids, price, stockQuantity, status } = parsed.data;

    await prisma.productVariant.updateMany({
      where: { id: { in: ids }, productId },
      data: {
        ...(price !== undefined ? { price } : {}),
        ...(stockQuantity !== undefined ? { stockQuantity } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return ok(null, "Variants updated");
  } catch (error) {
    return handleApiError(error);
  }
}
