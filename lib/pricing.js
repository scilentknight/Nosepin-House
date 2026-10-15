/** Pure pricing/PV math and selection rules — no server-only deps, safe to import from client components. */
export function computeDiscountedUnitPrice(basePrice, discountPercent) {
    if (!discountPercent)
        return basePrice;
    return Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
}
/** PV is never entered manually — it's always 0.2% of the product's price. */
export const PV_RATE = 0.002;
export function computeAutoPv(basePrice) {
    return Math.round(basePrice * PV_RATE * 100) / 100;
}
/**
 * Distributors only ever get their own distributorDiscounts entry (never another distributor's,
 * never the customer discount); customers only ever get customerDiscountPercent when forCustomer
 * is enabled; everyone else gets no discount.
 */
export function selectDiscountPercent(productId, product, isDistributor, distributorDiscounts) {
    if (!product.hasDiscount)
        return null;
    if (isDistributor) {
        return product.forDistributor && distributorDiscounts.has(productId) ? distributorDiscounts.get(productId) : null;
    }
    return product.forCustomer && product.customerDiscountPercent != null ? product.customerDiscountPercent : null;
}
/** PV only ever applies to a distributor explicitly selected as eligible on this product. */
export function isPvEligible(productId, product, isDistributor, distributorPvEligible) {
    return product.hasPointValue && isDistributor && distributorPvEligible.has(productId);
}
