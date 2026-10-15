import { z } from "zod";
import { convertWeightToNumber } from "@/lib/jewellery/unit-converter";
const imageInputSchema = z.object({
    url: z.string(),
    alt: z.string().max(200).default(""),
    sortOrder: z.number().int().default(0),
});
const productMaterialInputSchema = z
    .object({
    id: z.string().optional(),
    materialId: z.string().min(1, "Material is required"),
    purityId: z.string().nullable().optional(),
    grossWeight: z.number().nonnegative().nullable().optional(),
    stoneMaterialId: z.string().nullable().optional(),
    stoneWeight: z.number().nonnegative().nullable().optional(),
    stoneGrossPrice: z.number().nonnegative().nullable().optional(),
    stoneDiscountPercent: z.number().int().min(0).max(100).nullable().optional(),
    manualGrossPrice: z.number().nonnegative().nullable().optional(),
    manualDiscountPercent: z.number().int().min(0).max(100).nullable().optional(),
    netWeight: z.number().nonnegative().nullable().optional(),
    quantity: z.number().nonnegative("Quantity cannot be negative").default(1),
    unit: z.enum(["GRAM", "KILOGRAM", "CARAT", "PIECE", "MILLIGRAM", "MILLILITER"]),
    wastagePercent: z.number().nonnegative("Wastage percentage cannot be negative").nullable().optional().default(0),
    sortOrder: z.number().int().default(0),
})
    .refine((data) => {
    if (data.grossWeight !== null &&
        data.grossWeight !== undefined &&
        data.stoneWeight !== null &&
        data.stoneWeight !== undefined) {
        // If stoneMaterialId is present, convert from CARAT to primary unit (or stone unit to metal unit)
        const converted = data.stoneMaterialId
            ? convertWeightToNumber(data.stoneWeight, "CARAT", data.unit)
            : data.stoneWeight;
        return converted <= data.grossWeight;
    }
    return true;
}, {
    message: "Stone weight cannot exceed gross metal weight",
    path: ["stoneWeight"],
})
    .refine((data) => {
    if (data.stoneMaterialId && data.stoneMaterialId.trim() !== "") {
        // If stone has manual gross price, stoneWeight can be 0 (optional deduction)
        if (data.stoneGrossPrice !== null && data.stoneGrossPrice !== undefined && data.stoneGrossPrice > 0) {
            return true;
        }
        return data.stoneWeight !== null && data.stoneWeight !== undefined && data.stoneWeight > 0;
    }
    return true;
}, {
    message: "Stone weight must be greater than 0 when a stone type is selected",
    path: ["stoneWeight"],
});
export const productSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    slug: z.string().max(220).optional(),
    sku: z.string().max(80).nullable().optional(),
    categoryId: z.coerce.number().int({ message: "Category is required" }).positive({ message: "Category is required" }),
    brandId: z.coerce.number().int().nullable().optional(),
    shortDescription: z.string().max(2000).nullable().optional(),
    fullDescription: z.string().min(1, "Description is required"),
    costPrice: z.number().nonnegative().nullable().optional(),
    price: z.number().nonnegative("Price must be positive").nullable().optional(),
    compareAtPrice: z.number().nonnegative().nullable().optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]).nullable().optional(),
    discountValue: z.number().nonnegative().nullable().optional(),
    hasDiscount: z.boolean().optional().default(false),
    taxClass: z.string().max(100).nullable().optional(),
    stock: z.number().int().nonnegative().default(0),
    lowStockAlert: z.number().int().nonnegative().nullable().optional(),
    stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "ON_BACKORDER"]).default("IN_STOCK"),
    minimumOrderQuantity: z.number().int().positive().default(1),
    maximumOrderQuantity: z.number().int().positive().nullable().optional(),
    weight: z.number().nonnegative().nullable().optional(),
    length: z.number().nonnegative().nullable().optional(),
    width: z.number().nonnegative().nullable().optional(),
    height: z.number().nonnegative().nullable().optional(),
    featuredImage: z.string().nullable().optional(),
    images: z.array(imageInputSchema).default([]),
    isFeatured: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    isOnSale: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    isSpecial: z.boolean().default(false),
    isWeekly: z.boolean().default(false),
    isFlash: z.boolean().default(false),
    metaTitle: z.string().max(160).nullable().optional(),
    metaDescription: z.string().max(320).nullable().optional(),
    metaKeywords: z.string().max(320).nullable().optional(),
    warranty: z.string().max(200).nullable().optional(),
    tags: z.array(z.string().max(60)).default([]),
    colorway: z.string().max(40).default("green"),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    publishedAt: z.string().datetime().nullable().optional(),
    relatedIds: z.array(z.coerce.number().int()).default([]),
    crossSellIds: z.array(z.coerce.number().int()).default([]),
    upSellIds: z.array(z.coerce.number().int()).default([]),
    pricingStrategy: z.enum(["RATE_BASED", "MANUAL_DISCOUNT"]).default("RATE_BASED"),
    discountPercent: z.coerce.number().int().nullable().optional(),
    grossPrice: z.coerce.number().nullable().optional(),
    materials: z.array(productMaterialInputSchema).default([]),
    labourCharge: z.number().nonnegative("Labour charge cannot be negative").default(0),
    makingCharge: z.number().nonnegative("Making charge cannot be negative").default(0),
    otherCharge: z.number().nonnegative("Other charge cannot be negative").default(0),
    markupType: z.enum(["PERCENTAGE", "FIXED"]).nullable().optional(),
    markupValue: z.number().nonnegative("Markup value cannot be negative").nullable().optional(),
}).superRefine((data, ctx) => {
    if (data.pricingStrategy === "MANUAL_DISCOUNT") {
        const effectiveGross = data.grossPrice ?? data.compareAtPrice;
        if (effectiveGross === null || effectiveGross === undefined || Number.isNaN(effectiveGross) || effectiveGross <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Gross price is required and must be greater than 0",
                path: ["grossPrice"],
            });
        }
        const allowedDiscounts = [10, 20, 30, 40, 50, 60];
        if (data.discountPercent === null || data.discountPercent === undefined || !allowedDiscounts.includes(data.discountPercent)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Discount percentage must be 10%, 20%, 30%, 40%, 50%, or 60%",
                path: ["discountPercent"],
            });
        }
    }
});
export const productBulkActionSchema = z.object({
    ids: z.array(z.coerce.number().int()).min(1),
    action: z.enum(["delete", "restore", "publish", "unpublish", "archive", "feature", "unfeature"]),
});
