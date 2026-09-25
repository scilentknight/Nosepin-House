import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { items } = (await request.json()) as {
      items: { productId: number | string; variantId?: number | string | null; quantity: number }[];
    };

    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const requestedIds = (items ?? [])
      .map((i) => Number(i.productId))
      .filter((id) => !Number.isNaN(id));
    const validProducts = await prisma.product.findMany({
      where: { id: { in: requestedIds }, status: "PUBLISHED", deletedAt: null },
      select: { id: true },
    });
    const validIds = new Set(validProducts.map((p) => p.id));

    const requestedVariantIds = (items ?? [])
      .map((i) => (i.variantId !== undefined && i.variantId !== null ? Number(i.variantId) : null))
      .filter((id): id is number => id !== null && !Number.isNaN(id));
    const validVariants =
      requestedVariantIds.length > 0
        ? await prisma.productVariant.findMany({
            where: { id: { in: requestedVariantIds }, status: "ACTIVE", deletedAt: null },
            select: { id: true, productId: true },
          })
        : [];
    const validVariantByProduct = new Map(validVariants.map((v) => [v.id, v.productId]));

    for (const item of items ?? []) {
      const productId = Number(item.productId);
      if (Number.isNaN(productId) || !validIds.has(productId)) continue;

      let variantId: number | null =
        item.variantId !== undefined && item.variantId !== null ? Number(item.variantId) : null;
      if (variantId !== null && (Number.isNaN(variantId) || validVariantByProduct.get(variantId) !== productId)) {
        variantId = null;
      }

      const existing = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId, variantId },
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, variantId, quantity: item.quantity },
        });
      }
    }

    return ok(null, "Cart merged");
  } catch (error) {
    return handleApiError(error);
  }
}
