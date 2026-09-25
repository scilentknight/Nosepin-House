import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { returnActionSchema } from "@/schemas/admin-order";
import { notify } from "@/lib/notify";
import { sendMailBestEffort, orderStatusUpdateEmail } from "@/lib/mail";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid order id");

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return fail(404, "Order not found");
    if (order.status !== "DELIVERED" || !order.returnRequested) {
      return fail(400, "This order has no pending return request");
    }

    const body = await request.json();
    const parsed = returnActionSchema.safeParse(body);
    if (!parsed.success) {
      return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");
    }

    const approved = parsed.data.action === "approve";
    const noteBase = approved ? "Return approved" : "Return rejected";
    const note = parsed.data.note ? `${noteBase}: ${parsed.data.note}` : noteBase;

    await prisma.$transaction(async (tx) => {
      if (approved) {
        await tx.order.update({
          where: { id },
          data: { status: "RETURNED", refunded: order.paymentStatus === "PAID" },
        });
        await tx.orderStatusHistory.create({ data: { orderId: id, status: "RETURNED", note } });
      } else {
        await tx.order.update({
          where: { id },
          data: { returnRequested: false },
        });
        await tx.orderStatusHistory.create({ data: { orderId: id, status: "DELIVERED", note } });
      }
    });

    const returnMessage = approved
      ? `Your return request for order ${order.orderNumber} was approved.`
      : `Your return request for order ${order.orderNumber} was rejected.`;

    await notify(order.userId, returnMessage);
    await sendMailBestEffort({
      to: order.email,
      ...orderStatusUpdateEmail({ orderNumber: order.orderNumber, fullName: order.fullName }, returnMessage),
    });

    return ok(null, "Return updated");
  } catch (error) {
    return handleApiError(error);
  }
}
