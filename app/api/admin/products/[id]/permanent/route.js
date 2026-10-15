import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
export async function DELETE(_request, { params }) {
    try {
        await requireAdmin();
        const { id: rawId } = await params;
        const id = Number(rawId);
        if (Number.isNaN(id))
            return fail(400, "Invalid product id");
        const existing = await prisma.product.findUnique({
            where: { id },
        });
        if (!existing)
            return fail(404, "Product not found");
        await prisma.$transaction(async (tx) => {
            await tx.orderItem.updateMany({
                where: { productId: id },
                data: { productId: null },
            });
            await tx.cartItem.deleteMany({ where: { productId: id } });
            await tx.wishlistItem.deleteMany({ where: { productId: id } });
            await tx.review.deleteMany({ where: { productId: id } });
            await tx.productRelation.deleteMany({
                where: { OR: [{ productId: id }, { relatedId: id }] },
            });
            const variants = await tx.productVariant.findMany({
                where: { productId: id },
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
            await tx.productMaterial.deleteMany({ where: { productId: id } });
            await tx.productImage.deleteMany({ where: { productId: id } });
            await tx.product.delete({ where: { id } });
        });
        return ok(null, "Product permanently deleted");
    }
    catch (error) {
        return handleApiError(error);
    }
}
