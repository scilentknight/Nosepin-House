import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { notify } from "@/lib/notify";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid order id");

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order || order.userId !== user.id) return fail(404, "Order not found");
    if (order.status !== "PROCESSING") {
      return fail(400, "This order can no longer be cancelled");
    }

    const body = await request.json().catch(() => ({}));
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
    const note = reason ? `Cancelled by customer: ${reason}` : "Cancelled by customer";

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: {
          status: "CANCELLED",
          refunded: order.paymentStatus === "PAID",
        },
      });

      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.orderStatusHistory.create({
        data: { orderId: id, status: "CANCELLED", note },
      });
    });

    await notify(user.id, `Your order ${order.orderNumber} has been cancelled.`);

    return ok(null, "Order cancelled");
  } catch (error) {
    return handleApiError(error);
  }
}
