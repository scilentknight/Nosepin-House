import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { fail, handleApiError, ok } from "@/lib/api";
import { notify } from "@/lib/notify";
import { sendMailBestEffort, orderConfirmationEmail } from "@/lib/mail";
import { renderInvoicePdf } from "@/lib/invoice";
import { checkEsewaStatus, resolveEsewaConfig } from "@/lib/esewa";
import {
  applyCoupon,
  computeSubtotal,
  computeShippingAndTax,
  createOrderFromCart,
  loadValidatedCart,
  resolveShippingAddress,
} from "@/lib/checkoutCore";
import { getPaymentSettings } from "@/lib/settings";

/**
 * The order is only ever created here, once eSewa's status-check API — the
 * authoritative source of truth per eSewa's own integration guidance — confirms
 * COMPLETE. Until then the cart/stock are untouched, so a failed/abandoned
 * payment leaves nothing behind and "try again" just works.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const transactionUuid: string | undefined = body.transactionUuid;
    if (!transactionUuid) return fail(400, "Missing transaction reference");

    // Idempotent: a retried/duplicated call for an already-completed transaction just returns it.
    const existing = await prisma.order.findUnique({ where: { orderNumber: transactionUuid } });
    if (existing) return ok({ orderNumber: existing.orderNumber }, "Order already recorded");

    const shipping = await resolveShippingAddress(user, body);
    const cart = await loadValidatedCart(user.id);
    const subtotal = computeSubtotal(cart);
    const { discount, couponId } = await applyCoupon(subtotal, body.couponCode);
    const { shippingFee, tax, taxLabel, total } = await computeShippingAndTax(shipping.country, subtotal, discount, shipping.municipalityId);

    const paymentSettings = await getPaymentSettings();
    const esewaConfig = resolveEsewaConfig(paymentSettings);
    const result = await checkEsewaStatus(transactionUuid, total, esewaConfig);

    if (result.status !== "COMPLETE") {
      return fail(402, `Payment ${result.status.toLowerCase()} — no order was created. Your cart is unchanged.`);
    }

    if (Math.abs(Number(result.total_amount) - total) > 0.01) {
      return fail(
        409,
        "The confirmed payment amount doesn't match your cart total. Please contact support before retrying."
      );
    }

    const order = await createOrderFromCart({
      orderNumber: transactionUuid,
      userId: user.id,
      shipping,
      cart,
      subtotal,
      discount,
      shippingFee,
      tax,
      taxLabel,
      couponId,
      paymentMethod: "ONLINE",
      paymentSubMethod: "ESEWA",
      paymentStatus: "PAID",
      paymentReference: result.ref_id,
      historyNote: `Order placed — paid via eSewa (ref: ${result.ref_id ?? "n/a"})`,
    });

    await notify(user.id, `Your order ${order.orderNumber} has been placed and is now Processing.`);

    const items = cart.items.map((item) => ({
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
    }));

    let invoiceAttachment;
    try {
      const pdf = await renderInvoicePdf({
        orderNumber: order.orderNumber,
        placedAt: order.placedAt.toISOString(),
        fullName: shipping.fullName,
        phone: shipping.phone,
        email: shipping.email,
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: shipping.country,
        paymentMethod: "ONLINE",
        paymentStatus: order.paymentStatus,
        subtotal,
        discount,
        shippingFee,
        tax,
        taxLabel,
        total: Number(order.total),
        items,
      });
      invoiceAttachment = { filename: `invoice-${order.orderNumber}.pdf`, content: pdf, contentType: "application/pdf" };
    } catch (error) {
      console.error("[checkout] failed to generate invoice attachment:", error);
    }

    await sendMailBestEffort({
      to: shipping.email,
      ...orderConfirmationEmail({
        orderNumber: order.orderNumber,
        fullName: shipping.fullName,
        paymentMethod: "ONLINE",
        items,
        subtotal,
        discount,
        shippingFee,
        tax,
        taxLabel,
        total: Number(order.total),
        shipping,
      }),
      attachments: invoiceAttachment ? [invoiceAttachment] : undefined,
    });

    return ok({ orderNumber: order.orderNumber }, "Order placed successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
