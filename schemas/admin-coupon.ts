import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(40)
    .transform((v) => v.toUpperCase().trim()),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive("Value must be positive"),
  minOrderAmount: z.number().nonnegative().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  active: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
