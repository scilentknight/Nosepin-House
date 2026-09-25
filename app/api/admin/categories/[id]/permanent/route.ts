import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    if (!existing) return fail(404, "Category not found");
    if (!existing.deletedAt) return fail(400, "Category must be trashed before it can be permanently deleted");
    if (existing._count.products > 0) return fail(400, "Cannot permanently delete a category that still has products");
    if (existing._count.children > 0) return fail(400, "Cannot permanently delete a category that still has subcategories");

    await prisma.category.delete({ where: { id } });
    return ok(null, "Category permanently deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
