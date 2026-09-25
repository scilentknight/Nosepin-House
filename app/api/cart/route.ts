import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, handleApiError, fail } from "@/lib/api";
import { variantLabel } from "@/lib/checkoutCore";

async function getOrCreateCart(userId: number) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

function toLines(
  items: {
    variantId: number | null;
    quantity: number;
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
    quantity: item.quantity,
  }));
}

const cartItemInclude = {
  product: { include: { images: { take: 1 as const } } },
  variant: { include: { attributeValues: { include: { attributeValue: { include: { attribute: true } } } } } },
};

async function getCartLines(userId: number) {
  const cart = await getOrCreateCart(userId);
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: cartItemInclude,
  });
  return toLines(items);
}

export async function GET() {
  try {
    const user = await requireUser();
    return ok(await getCartLines(user.id));
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
    const quantity = body.quantity ?? 1;
    if (!body.productId || Number.isNaN(productId)) return fail(400, "productId is required");
    if (variantId !== null && Number.isNaN(variantId)) return fail(400, "Invalid variantId");

    const product = await prisma.product.findFirst({
      where: { id: productId, status: "PUBLISHED", deletedAt: null },
      select: { id: true, stock: true },
    });
    if (!product) return fail(404, "This product is no longer available");

    let availableStock = product.stock;
    if (variantId !== null) {
      const variant = await prisma.productVariant.findFirst({
        where: { id: variantId, productId, status: "ACTIVE", deletedAt: null },
        select: { stockQuantity: true },
      });
      if (!variant) return fail(404, "This variant is no longer available");
      availableStock = variant.stockQuantity;
    }
    const cart = await getOrCreateCart(user.id);
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId },
    });

    const totalQuantity = (existing?.quantity ?? 0) + quantity;
    if (totalQuantity > availableStock) return fail(400, `Only ${availableStock} left in stock`);

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: totalQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId, quantity },
      });
    }

    return ok(await getCartLines(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const productId = Number(body.productId);
    const variantId = body.variantId !== undefined && body.variantId !== null ? Number(body.variantId) : null;
    const quantity = body.quantity;
    if (!body.productId || Number.isNaN(productId) || typeof quantity !== "number") {
      return fail(400, "productId and quantity are required");
    }

    const cart = await getOrCreateCart(user.id);

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId, variantId } });
    } else {
      const product = await prisma.product.findFirst({
        where: { id: productId, status: "PUBLISHED", deletedAt: null },
        select: { stock: true },
      });
      if (!product) return fail(404, "This product is no longer available");

      let availableStock = product.stock;
      if (variantId !== null) {
        const variant = await prisma.productVariant.findFirst({
          where: { id: variantId, productId, status: "ACTIVE", deletedAt: null },
          select: { stockQuantity: true },
        });
        if (!variant) return fail(404, "This variant is no longer available");
        availableStock = variant.stockQuantity;
      }
      if (quantity > availableStock) return fail(400, `Only ${availableStock} left in stock`);

      await prisma.cartItem.updateMany({
        where: { cartId: cart.id, productId, variantId },
        data: { quantity },
      });
    }

    return ok(await getCartLines(user.id));
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

    const cart = await getOrCreateCart(user.id);

    if (productId !== null && !Number.isNaN(productId)) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId, variantId } });
    } else {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return ok(await getCartLines(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}
