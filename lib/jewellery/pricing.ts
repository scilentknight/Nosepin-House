import Decimal from "decimal.js";
import type { MarkupType, JewelleryPricing } from "./types";

export interface PricingMaterial {
  quantity: number | string | Decimal;
  rate: number | string | Decimal;
  wastagePercent?: number | string | Decimal | null;
}

export interface CalculatePricingInput {
  materials: PricingMaterial[];
  labourCharge?: number | string | Decimal | null;
  makingCharge?: number | string | Decimal | null;
  otherCharge?: number | string | Decimal | null;
  markupType?: MarkupType | null;
  markupValue?: number | string | Decimal | null;
}

export function calculateJewelleryPrice(
  input: CalculatePricingInput,
): JewelleryPricing {
  let materialCostDec = new Decimal(0);

  for (const mat of input.materials) {
    const qty = new Decimal(mat.quantity || 0);
    const rate = new Decimal(mat.rate || 0);
    const wastage = new Decimal(mat.wastagePercent || 0);

    const effectiveQty = qty.mul(new Decimal(1).add(wastage.div(100)));
    const cost = effectiveQty.mul(rate);
    materialCostDec = materialCostDec.add(cost);
  }

  const labourDec = new Decimal(input.labourCharge || 0);
  const makingDec = new Decimal(input.makingCharge || 0);
  const otherDec = new Decimal(input.otherCharge || 0);

  const subtotalDec = materialCostDec.add(labourDec).add(makingDec).add(otherDec);

  let markupAmountDec = new Decimal(0);
  const markupVal = new Decimal(input.markupValue || 0);

  if (input.markupType === "PERCENTAGE") {
    markupAmountDec = subtotalDec.mul(markupVal.div(100));
  } else if (input.markupType === "FIXED") {
    markupAmountDec = markupVal;
  }

  const sellingPriceDec = subtotalDec.add(markupAmountDec);

  return {
    materialCost: materialCostDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    labourCharge: labourDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    makingCharge: makingDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    otherCharge: otherDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    subtotal: subtotalDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    markupType: input.markupType || "",
    markupValue: markupVal.toNumber(),
    markupAmount: markupAmountDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    sellingPrice: sellingPriceDec.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
  };
}

