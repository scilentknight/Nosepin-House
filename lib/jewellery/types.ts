export type MaterialType = "PRECIOUS_METAL" | "DIAMOND" | "GEMSTONE" | "OTHER";

export type MaterialUnit =
  | "GRAM"
  | "KILOGRAM"
  | "CARAT"
  | "PIECE"
  | "MILLIGRAM"
  | "MILLILITER";

export type MarkupType = "PERCENTAGE" | "FIXED" | "";

export interface MaterialPurityOption {
  id: string;
  name: string;
  code: string;
  fineness: number | null;
}

export interface MaterialOption {
  id: string;
  name: string;
  code: string;
  type: MaterialType;
  unit: MaterialUnit;
  purities: MaterialPurityOption[];
}

export interface ProductMaterialValue {
  materialId: string;
  purityId: string;
  quantity: string;
  unit: MaterialUnit;
  wastagePercent: string;
}

export interface JewelleryPricing {
  materialCost: number;
  labourCharge: number;
  makingCharge: number;
  otherCharge: number;

  subtotal: number;

  markupType: MarkupType;
  markupValue: number;

  markupAmount: number;

  sellingPrice: number;
}
