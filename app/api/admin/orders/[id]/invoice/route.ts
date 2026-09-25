import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { fail, handleApiError } from "@/lib/api";
import { renderInvoicePdf } from "@/lib/invoice";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid order id");

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return fail(404, "Order not found");

    const buffer = await renderInvoicePdf({
      orderNumber: order.orderNumber,
      placedAt: order.placedAt.toISOString(),
      fullName: order.fullName,
      phone: order.phone,
      email: order.email,
      line1: order.line1,
      line2: order.line2,
      city: order.city,
      state: order.state,
      postalCode: order.postalCode,
      country: order.country,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shippingFee: Number(order.shippingFee),
      tax: Number(order.tax),
      taxLabel: order.taxLabel,
      total: Number(order.total),
      items: order.items.map((item) => ({ name: item.name, price: Number(item.price), quantity: item.quantity })),
    });

    const isPreview = new URL(request.url).searchParams.get("mode") === "preview";

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${isPreview ? "inline" : "attachment"}; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
