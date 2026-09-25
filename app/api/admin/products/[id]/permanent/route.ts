import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true, cartItems: true } } },
    });
    if (!existing) return fail(404, "Product not found");
    if (!existing.deletedAt) return fail(400, "Product must be trashed before it can be permanently deleted");
    if (existing._count.orderItems > 0) {
      return fail(400, "Cannot permanently delete a product referenced by existing orders");
    }

    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return ok(null, "Product permanently deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
