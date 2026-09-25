import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  slug: z.string().max(160).optional(),
  parentCategoryId: z.coerce.number().int().nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  image: z.string().nullable().optional(),
  bannerImage: z.string().nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  metaTitle: z.string().max(160).nullable().optional(),
  metaDescription: z.string().max(320).nullable().optional(),
  metaKeywords: z.string().max(320).nullable().optional(),
  sortOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const categoryBulkActionSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
  action: z.enum(["delete", "enable", "disable", "restore"]),
});

export type CategoryBulkActionInput = z.infer<typeof categoryBulkActionSchema>;

export const categoryReorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.coerce.number().int(),
        sortOrder: z.number().int(),
        parentCategoryId: z.coerce.number().int().nullable().optional(),
      })
    )
    .min(1),
});

export type CategoryReorderInput = z.infer<typeof categoryReorderSchema>;
