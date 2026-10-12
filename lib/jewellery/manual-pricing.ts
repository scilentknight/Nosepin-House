import Decimal from "decimal.js";

export const ALLOWED_MANUAL_DISCOUNT_PERCENTAGES = [10, 20, 30, 40, 50, 60] as const;
export type ManualDiscountPercentage = (typeof ALLOWED_MANUAL_DISCOUNT_PERCENTAGES)[number];

export const DEFAULT_MANUAL_DISCOUNT_PERCENTAGE: ManualDiscountPercentage = 40;

export interface ManualPricingResult {
  grossPrice: number;
  discountPercent: number;
  discountAmount: number;
  sellingPrice: number;
}

/**
 * Validates that the discount percentage is one of the strictly allowed options:
 * 10%, 20%, 30%, 40%, 50%, 60%.
 */
export function isValidManualDiscount(
  value: unknown,
): value is ManualDiscountPercentage {
  const num = typeof value === "number" ? value : Number(value);
  return (
    Number.isInteger(num) &&
    (ALLOWED_MANUAL_DISCOUNT_PERCENTAGES as readonly number[]).includes(num)
  );
}

/**
 * Calculates selling price and discount amount using decimal-safe arithmetic.
 *
 * Formula:
 * Selling Price = Gross Price * (1 - Discount Percentage / 100)
 * Discount Amount = Gross Price * (Discount Percentage / 100)
 *
 * Rounds to 2 decimal places using standard ROUND_HALF_UP.
 */
export function calculateManualSellingPrice(
  grossPrice: number | string | Decimal,
  discountPercent: number,
): ManualPricingResult {
  const gross = new Decimal(grossPrice || 0);

  if (gross.isNaN() || !gross.isFinite() || gross.isNegative()) {
    throw new Error("Gross price must be a valid positive number");
  }

  const disc = new Decimal(discountPercent || 0);

  const discountAmount = gross
    .mul(disc.div(100))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const sellingPrice = gross
    .sub(discountAmount)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    grossPrice: gross.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    discountPercent,
    discountAmount: discountAmount.toNumber(),
    sellingPrice: sellingPrice.toNumber(),
  };
}

/**
 * Formats a currency amount into standard Nepalese Rupee display:
 * e.g., Rs. 100,000 or NPR 100,000.00
 */
export function formatCurrencyNpr(value: number, includeDecimals = true): string {
  const formatted = value.toLocaleString("en-NP", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  return `Rs. ${formatted}`;
}
