import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  slug: z.string().max(160).optional(),
  logo: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  websiteUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  metaTitle: z.string().max(160).nullable().optional(),
  metaDescription: z.string().max(320).nullable().optional(),
  metaKeywords: z.string().max(320).nullable().optional(),
  sortOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type BrandInput = z.infer<typeof brandSchema>;

export const brandBulkActionSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
  action: z.enum(["delete", "enable", "disable", "restore"]),
});

export type BrandBulkActionInput = z.infer<typeof brandBulkActionSchema>;
