import Decimal from "decimal.js";
import type { MaterialUnit } from "./types";

/**
 * Standard mass conversion factors to GRAMS:
 * 1 CARAT = 0.2 GRAMS (standard international jewellery convention)
 * 1 GRAM = 1.0 GRAMS
 * 1 KILOGRAM = 1000.0 GRAMS
 * 1 MILLIGRAM = 0.001 GRAMS
 * 1 MILLILITER = 1.0 GRAMS
 */
export const TO_GRAM_FACTORS: Record<string, Decimal> = {
  GRAM: new Decimal(1),
  CARAT: new Decimal(0.2),
  KILOGRAM: new Decimal(1000),
  MILLIGRAM: new Decimal(0.001),
  MILLILITER: new Decimal(1),
};

/**
 * Converts a weight/quantity from one material unit to another using Decimal.js precision.
 * 
 * Example:
 * convertWeight(2, "CARAT", "GRAM") -> Decimal(0.4)
 * convertWeight(10, "GRAM", "CARAT") -> Decimal(50)
 */
export function convertWeight(
  quantity: number | string | Decimal,
  fromUnit: MaterialUnit | string,
  toUnit: MaterialUnit | string,
): Decimal {
  const qty = new Decimal(quantity || 0);

  if (qty.isZero() || fromUnit === toUnit) {
    return qty;
  }

  const fromFactor = TO_GRAM_FACTORS[fromUnit];
  const toFactor = TO_GRAM_FACTORS[toUnit];

  // If either unit is not a mass-convertible unit (e.g. PIECE), return 0 deduction
  if (!fromFactor || !toFactor) {
    return new Decimal(0);
  }

  // Convert to grams, then to target unit
  const inGrams = qty.mul(fromFactor);
  return inGrams.div(toFactor);
}

/**
 * Helper to get converted weight as a JS number with safe rounding
 */
export function convertWeightToNumber(
  quantity: number | string | Decimal,
  fromUnit: MaterialUnit | string,
  toUnit: MaterialUnit | string,
  decimalPlaces: number = 6,
): number {
  return convertWeight(quantity, fromUnit, toUnit)
    .toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP)
    .toNumber();
}
