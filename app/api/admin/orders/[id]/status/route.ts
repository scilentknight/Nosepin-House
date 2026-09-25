import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { updateStatusSchema } from "@/schemas/admin-order";
import { notify } from "@/lib/notify";
import { sendMailBestEffort, orderStatusUpdateEmail } from "@/lib/mail";
import type { OrderStatus } from "@prisma/client";

const ALLOWED: Record<OrderStatus, OrderStatus[]> = {
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  RETURNED: [],
  CANCELLED: [],
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid order id");

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return fail(404, "Order not found");

    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");
    }

    const target = parsed.data.status;
    if (!ALLOWED[order.status].includes(target)) {
      return fail(400, `Cannot move an order from ${order.status} to ${target}`);
    }

    if (target === "SHIPPED" && (!parsed.data.trackingNumber || !parsed.data.courierName)) {
      return fail(400, "Tracking number and courier name are required to mark as shipped");
    }

    let message = "";

    await prisma.$transaction(async (tx) => {
      const data: Record<string, unknown> = { status: target };

      if (target === "SHIPPED") {
        data.trackingNumber = parsed.data.trackingNumber;
        data.courierName = parsed.data.courierName;
        message = `Your order ${order.orderNumber} has shipped via ${parsed.data.courierName}.`;
      }

      if (target === "CANCELLED") {
        if (order.paymentStatus === "PAID") data.refunded = true;
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
        message = `Your order ${order.orderNumber} has been cancelled.`;
      }

      if (target === "DELIVERED") {
        if (order.paymentMethod === "COD" && order.paymentStatus === "PENDING") {
          data.paymentStatus = "PAID";
        }
        message = `Your order ${order.orderNumber} has been delivered.`;
      }

      await tx.order.update({ where: { id }, data });
      await tx.orderStatusHistory.create({
        data: { orderId: id, status: target, note: parsed.data.note ?? null },
      });
    });

    if (message) {
      await notify(order.userId, message);
      await sendMailBestEffort({
        to: order.email,
        ...orderStatusUpdateEmail({ orderNumber: order.orderNumber, fullName: order.fullName }, message),
      });
    }

    return ok(null, "Order updated");
  } catch (error) {
    return handleApiError(error);
  }
}
