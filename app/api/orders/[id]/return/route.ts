import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { returnRequestSchema } from "@/schemas/order";
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

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== user.id) return fail(404, "Order not found");
    if (order.status !== "DELIVERED" || order.returnRequested) {
      return fail(400, "This order is not eligible for a return request");
    }

    const body = await request.json();
    const parsed = returnRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail(400, parsed.error.issues[0]?.message ?? "Invalid return request");
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { returnRequested: true, returnReason: parsed.data.reason },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: id, status: "DELIVERED", note: `Return requested: ${parsed.data.reason}` },
      });
    });

    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    await Promise.all([
      notify(user.id, `Your return request for order ${order.orderNumber} has been submitted.`),
      ...admins.map((admin) =>
        notify(admin.id, `Return requested for order ${order.orderNumber}.`)
      ),
    ]);

    return ok(null, "Return requested");
  } catch (error) {
    return handleApiError(error);
  }
}
