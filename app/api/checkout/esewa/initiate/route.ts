import { requireUser } from "@/lib/session";
import { fail, handleApiError, ok } from "@/lib/api";
import { generateOrderNumber } from "@/lib/orderNumber";
import { buildEsewaFormFields, resolveEsewaConfig } from "@/lib/esewa";
import {
  applyCoupon,
  computeSubtotal,
  computeShippingAndTax,
  loadValidatedCart,
  resolveShippingAddress,
} from "@/lib/checkoutCore";
import { getPaymentSettings } from "@/lib/settings";

/**
 * Validates the cart/address/coupon and builds a signed eSewa redirect form.
 * Nothing is written to Order/stock/cart here — that only happens once eSewa
 * confirms the payment, in /api/checkout/esewa/complete.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const paymentSettings = await getPaymentSettings();
    if (!paymentSettings.esewaEnabled) return fail(400, "Online payment via eSewa is currently unavailable");

    // Validate the address shape without persisting — persisting happens once at /complete.
    const shipping = await resolveShippingAddress(user, body, { persist: false });

    const cart = await loadValidatedCart(user.id);
    const subtotal = computeSubtotal(cart);
    const { discount } = await applyCoupon(subtotal, body.couponCode);
    const { shippingFee, tax, total } = await computeShippingAndTax(shipping.country, subtotal, discount, shipping.municipalityId);

    if (total <= 0) return fail(400, "Order total must be greater than zero to pay online");

    const transactionUuid = generateOrderNumber();
    const baseUrl = (process.env.NEXTAUTH_URL ?? new URL(request.url).origin).replace(/\/$/, "");
    const returnUrl = `${baseUrl}/checkout/esewa/return?txn=${transactionUuid}`;
    const esewaConfig = resolveEsewaConfig(paymentSettings);

    const fields = buildEsewaFormFields({
      transactionUuid,
      productAmount: Math.max(0, subtotal - discount),
      taxAmount: tax,
      deliveryCharge: shippingFee,
      successUrl: returnUrl,
      failureUrl: returnUrl,
      config: esewaConfig,
    });

    return ok({ transactionUuid, formUrl: esewaConfig.paymentUrl, fields });
  } catch (error) {
    return handleApiError(error);
  }
}
