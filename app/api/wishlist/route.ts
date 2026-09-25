import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, handleApiError, fail } from "@/lib/api";
import { variantLabel } from "@/lib/checkoutCore";

async function getOrCreateWishlist(userId: number) {
  return prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

function toLines(
  items: {
    variantId: number | null;
    product: {
      id: number;
      name: string;
      slug: string;
      price: unknown;
      stock: number;
      colorway: string;
      images: { url: string | null }[];
    };
    variant: {
      id: number;
      price: unknown;
      stockQuantity: number;
      image: string | null;
      attributeValues: { attributeValue: { value: string; attribute: { sortOrder: number } } }[];
    } | null;
  }[]
) {
  return items.map((item) => ({
    productId: item.product.id,
    variantId: item.variantId,
    variantLabel: variantLabel(item.variant),
    name: item.product.name,
    slug: item.product.slug,
    price: Number(item.variant?.price ?? item.product.price),
    image: item.variant?.image ?? item.product.images[0]?.url ?? null,
    colorway: item.product.colorway,
    stock: item.variant ? item.variant.stockQuantity : item.product.stock,
  }));
}

const wishlistItemInclude = {
  product: { include: { images: { take: 1 as const } } },
  variant: { include: { attributeValues: { include: { attributeValue: { include: { attribute: true } } } } } },
};

async function getWishlistLines(userId: number) {
  const wishlist = await getOrCreateWishlist(userId);
  const items = await prisma.wishlistItem.findMany({
    where: { wishlistId: wishlist.id },
    include: wishlistItemInclude,
    orderBy: { createdAt: "desc" },
  });
  return toLines(items);
}

export async function GET() {
  try {
    const user = await requireUser();
    return ok(await getWishlistLines(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const productId = Number(body.productId);
    const variantId = body.variantId !== undefined && body.variantId !== null ? Number(body.variantId) : null;
    if (!body.productId || Number.isNaN(productId)) return fail(400, "productId is required");
    if (variantId !== null && Number.isNaN(variantId)) return fail(400, "Invalid variantId");

    const product = await prisma.product.findFirst({
      where: { id: productId, status: "PUBLISHED", deletedAt: null },
      select: { id: true },
    });
    if (!product) return fail(404, "This product is no longer available");

    if (variantId !== null) {
      const variant = await prisma.productVariant.findFirst({
        where: { id: variantId, productId, status: "ACTIVE", deletedAt: null },
        select: { id: true },
      });
      if (!variant) return fail(404, "This variant is no longer available");
    }

    const wishlist = await getOrCreateWishlist(user.id);
    const existing = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId, variantId },
    });
    if (!existing) {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId, variantId },
      });
    }

    return ok(await getWishlistLines(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const rawProductId = searchParams.get("productId");
    const productId = rawProductId ? Number(rawProductId) : null;
    const rawVariantId = searchParams.get("variantId");
    const variantId = rawVariantId ? Number(rawVariantId) : null;

    const wishlist = await getOrCreateWishlist(user.id);

    if (productId !== null && !Number.isNaN(productId)) {
      await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId, variantId } });
    } else {
      await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
    }

    return ok(await getWishlistLines(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}
