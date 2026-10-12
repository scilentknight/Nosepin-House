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
        await prisma.$transaction(async (tx) => {
          await tx.orderItem.updateMany({
            where: { productId: { in: ids } },
            data: { productId: null },
          });
          await tx.cartItem.deleteMany({ where: { productId: { in: ids } } });
          await tx.wishlistItem.deleteMany({ where: { productId: { in: ids } } });
          await tx.review.deleteMany({ where: { productId: { in: ids } } });
          await tx.productRelation.deleteMany({
            where: { OR: [{ productId: { in: ids } }, { relatedId: { in: ids } }] },
          });
          const variants = await tx.productVariant.findMany({
            where: { productId: { in: ids } },
            select: { id: true },
          });
          const variantIds = variants.map((v) => v.id);
          if (variantIds.length > 0) {
            await tx.productVariantValue.deleteMany({
              where: { variantId: { in: variantIds } },
            });
            await tx.productVariant.deleteMany({
              where: { id: { in: variantIds } },
            });
          }
          await tx.productMaterial.deleteMany({ where: { productId: { in: ids } } });
          await tx.productImage.deleteMany({ where: { productId: { in: ids } } });
          await tx.product.deleteMany({ where: { id: { in: ids } } });
        });
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
