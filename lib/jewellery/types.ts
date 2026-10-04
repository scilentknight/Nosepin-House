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
  id?: string;
  materialId: string;
  purityId?: string;
  grossWeight?: string;
  stoneWeight?: string;
  netWeight?: string;
  quantity: string;
  unit: MaterialUnit;
  wastagePercent?: string;
  itemQuantity?: string;
  sortOrder?: number;
}

export interface MaterialBreakdownItem {
  id?: string;
  materialId: string;
  materialName?: string;
  materialType?: MaterialType;
  purityId?: string | null;
  purityName?: string | null;
  grossWeight?: number | null;
  stoneWeight?: number | null;
  netWeight?: number | null;
  quantity: number;
  unit: MaterialUnit;
  wastagePercent?: number | null;
  wastageWeight?: number | null;
  chargeableQuantity?: number;
  rate: number;
  cost: number;
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

  materialBreakdown?: MaterialBreakdownItem[];
}

