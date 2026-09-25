import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { brandBulkActionSchema } from "@/schemas/admin-brand";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = brandBulkActionSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const { ids, action } = parsed.data;

    switch (action) {
      case "delete":
        await prisma.brand.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
        break;
      case "enable":
        await prisma.brand.updateMany({ where: { id: { in: ids } }, data: { status: "ACTIVE" } });
        break;
      case "disable":
        await prisma.brand.updateMany({ where: { id: { in: ids } }, data: { status: "INACTIVE" } });
        break;
      case "restore":
        await prisma.brand.updateMany({ where: { id: { in: ids } }, data: { deletedAt: null } });
        break;
    }

    return ok(null, "Bulk action applied");
  } catch (error) {
    return handleApiError(error);
  }
}
