import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) return fail(404, "Brand not found");

    const brand = await prisma.brand.update({ where: { id }, data: { deletedAt: null } });
    return ok(brand, "Brand restored");
  } catch (error) {
    return handleApiError(error);
  }
}
