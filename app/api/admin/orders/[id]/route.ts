import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid order id");

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        history: { orderBy: { createdAt: "asc" } },
        coupon: true,
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) return fail(404, "Order not found");

    const data = {
      ...order,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shippingFee: Number(order.shippingFee),
      tax: Number(order.tax),
      total: Number(order.total),
      coupon: order.coupon ? { ...order.coupon, value: Number(order.coupon.value) } : null,
      items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
    };

    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
