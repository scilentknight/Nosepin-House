/** Pure pricing/PV math and selection rules — no server-only deps, safe to import from client components. */

export interface PricingProductFlags {
  hasDiscount: boolean;
  forCustomer: boolean;
  customerDiscountPercent: number | null;
  forDistributor: boolean;
  hasPointValue: boolean;
}

export function computeDiscountedUnitPrice(basePrice: number, discountPercent: number | null | undefined): number {
  if (!discountPercent) return basePrice;
  return Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
}

/** PV is never entered manually — it's always 0.2% of the product's price. */
export const PV_RATE = 0.002;

export function computeAutoPv(basePrice: number): number {
  return Math.round(basePrice * PV_RATE * 100) / 100;
}

/**
 * Distributors only ever get their own distributorDiscounts entry (never another distributor's,
 * never the customer discount); customers only ever get customerDiscountPercent when forCustomer
 * is enabled; everyone else gets no discount.
 */
export function selectDiscountPercent(
  productId: number,
  product: PricingProductFlags,
  isDistributor: boolean,
  distributorDiscounts: Map<number, number>
): number | null {
  if (!product.hasDiscount) return null;
  if (isDistributor) {
    return product.forDistributor && distributorDiscounts.has(productId) ? distributorDiscounts.get(productId)! : null;
  }
  return product.forCustomer && product.customerDiscountPercent != null ? product.customerDiscountPercent : null;
}

/** PV only ever applies to a distributor explicitly selected as eligible on this product. */
export function isPvEligible(
  productId: number,
  product: Pick<PricingProductFlags, "hasPointValue">,
  isDistributor: boolean,
  distributorPvEligible: Set<number>
): boolean {
  return product.hasPointValue && isDistributor && distributorPvEligible.has(productId);
}
