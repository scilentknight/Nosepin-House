import { requireUser } from "@/lib/session";
import { fail, handleApiError, ok } from "@/lib/api";
import { notify } from "@/lib/notify";
import { sendMailBestEffort, orderConfirmationEmail } from "@/lib/mail";
import { renderInvoicePdf } from "@/lib/invoice";
import {
  applyCoupon,
  computeSubtotal,
  computeShippingAndTax,
  createOrderFromCart,
  loadValidatedCart,
  resolveShippingAddress,
} from "@/lib/checkoutCore";
import { getPaymentSettings } from "@/lib/settings";

/** Cash on Delivery checkout — payment happens on delivery, so the order is committed immediately. */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();

    if (body.paymentMethod !== "COD") {
      return fail(400, "Use /api/checkout/esewa/initiate for online payment");
    }

    const shipping = await resolveShippingAddress(user, body);
    const cart = await loadValidatedCart(user.id);
    const subtotal = computeSubtotal(cart);

    const paymentSettings = await getPaymentSettings();
    if (!paymentSettings.codEnabled) return fail(400, "Cash on Delivery is currently unavailable");
    if (paymentSettings.codMinOrderAmount && subtotal < Number(paymentSettings.codMinOrderAmount)) {
      return fail(400, `Minimum order amount for Cash on Delivery is Rs ${Number(paymentSettings.codMinOrderAmount)}`);
    }
    if (paymentSettings.codMaxOrderAmount && subtotal > Number(paymentSettings.codMaxOrderAmount)) {
      return fail(400, `Maximum order amount for Cash on Delivery is Rs ${Number(paymentSettings.codMaxOrderAmount)}`);
    }

    const { discount, couponId } = await applyCoupon(subtotal, body.couponCode);
    const { shippingFee, tax, taxLabel } = await computeShippingAndTax(shipping.country, subtotal, discount, shipping.municipalityId);

    const order = await createOrderFromCart({
      userId: user.id,
      shipping,
      cart,
      subtotal,
      discount,
      shippingFee,
      tax,
      taxLabel,
      couponId,
      paymentMethod: "COD",
      paymentSubMethod: null,
      paymentStatus: "PENDING",
      historyNote: "Order placed",
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
        paymentMethod: "COD",
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
        paymentMethod: "COD",
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
