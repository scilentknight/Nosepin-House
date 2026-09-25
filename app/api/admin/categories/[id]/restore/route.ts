import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return fail(404, "Category not found");

    const category = await prisma.category.update({ where: { id }, data: { deletedAt: null } });
    return ok(category, "Category restored");
  } catch (error) {
    return handleApiError(error);
  }
}
