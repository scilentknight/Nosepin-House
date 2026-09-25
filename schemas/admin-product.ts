import { z } from "zod";

const imageInputSchema = z.object({
  url: z.string(),
  alt: z.string().max(200).default(""),
  sortOrder: z.number().int().default(0),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().max(220).optional(),
  sku: z.string().max(80).nullable().optional(),
  categoryId: z.coerce.number().int({ message: "Category is required" }),
  brandId: z.coerce.number().int().nullable().optional(),

  shortDescription: z.string().max(2000).nullable().optional(),
  fullDescription: z.string().min(1, "Description is required"),

  costPrice: z.number().nonnegative().nullable().optional(),
  price: z.number().nonnegative("Price must be positive"),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).nullable().optional(),
  discountValue: z.number().nonnegative().nullable().optional(),
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
});

export type ProductInput = z.infer<typeof productSchema>;

export const productBulkActionSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
  action: z.enum(["delete", "restore", "publish", "unpublish", "archive", "feature", "unfeature"]),
});

export type ProductBulkActionInput = z.infer<typeof productBulkActionSchema>;
