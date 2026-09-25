import { z } from "zod";

export const reviewSchema = z.object({
  orderItemId: z.coerce.number().int(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, "Please write at least a few words").max(1000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
