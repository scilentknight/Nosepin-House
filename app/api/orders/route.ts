import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";
import type { OrderStatus } from "@prisma/client";

const VALID_STATUSES: OrderStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"];

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        ...(status && VALID_STATUSES.includes(status as OrderStatus) ? { status: status as OrderStatus } : {}),
      },
      include: {
        items: {
          include: {
            reviews: { where: { userId: user.id } },
            product: { select: { slug: true, deletedAt: true } },
          },
        },
        history: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { placedAt: "desc" },
    });

    const data = orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        reviewed: item.reviews.length > 0,
        productSlug: item.product && !item.product.deletedAt ? item.product.slug : null,
        product: undefined,
      })),
    }));

    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
