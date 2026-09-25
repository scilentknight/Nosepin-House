import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid variant id");

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) return fail(404, "Variant not found");

    const variant = await prisma.productVariant.update({ where: { id }, data: { deletedAt: null } });
    return ok(variant, "Variant restored");
  } catch (error) {
    return handleApiError(error);
  }
}
