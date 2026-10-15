import { z } from "zod";
export const variantSchema = z.object({
    sku: z.string().max(80).nullable().optional(),
    price: z.number().nonnegative().nullable().optional(),
    compareAtPrice: z.number().nonnegative().nullable().optional(),
    costPrice: z.number().nonnegative().nullable().optional(),
    stockQuantity: z.number().int().nonnegative().default(0),
    lowStockAlert: z.number().int().nonnegative().nullable().optional(),
    weight: z.number().nonnegative().nullable().optional(),
    image: z.string().nullable().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    attributeValueIds: z.array(z.coerce.number().int()).default([]),
});
export const generateVariantsSchema = z.object({
    attributeValueGroups: z.array(z.array(z.coerce.number().int()).min(1)).min(1),
});
export const variantBulkUpdateSchema = z.object({
    ids: z.array(z.coerce.number().int()).min(1),
    price: z.number().nonnegative().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
export const variantBulkActionSchema = z.object({
    ids: z.array(z.coerce.number().int()).min(1),
    action: z.enum(["delete", "restore"]),
});
