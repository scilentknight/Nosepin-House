import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!existing) return fail(404, "Brand not found");
    if (!existing.deletedAt) return fail(400, "Brand must be trashed before it can be permanently deleted");
    if (existing._count.products > 0) return fail(400, "Cannot permanently delete a brand that still has products");

    await prisma.brand.delete({ where: { id } });
    return ok(null, "Brand permanently deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
