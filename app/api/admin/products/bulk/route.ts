import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { productBulkActionSchema } from "@/schemas/admin-product";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = productBulkActionSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const { ids, action } = parsed.data;

    switch (action) {
      case "delete":
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date() } });
        break;
      case "restore":
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { deletedAt: null } });
        break;
      case "publish":
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { status: "PUBLISHED", publishedAt: new Date() },
        });
        break;
      case "unpublish":
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: "DRAFT" } });
        break;
      case "archive":
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status: "ARCHIVED" } });
        break;
      case "feature":
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isFeatured: true } });
        break;
      case "unfeature":
        await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isFeatured: false } });
        break;
    }

    return ok(null, "Bulk action applied");
  } catch (error) {
    return handleApiError(error);
  }
}
