import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(500).nullable().optional(),
  image: z.string().min(1, "Image is required"),
  linkUrl: z.string().max(500).nullable().optional(),
  buttonText: z.string().max(100).nullable().optional(),
  active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;

export const bannerReorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.coerce.number().int(),
        sortOrder: z.number().int(),
      })
    )
    .min(1),
});

export type BannerReorderInput = z.infer<typeof bannerReorderSchema>;
