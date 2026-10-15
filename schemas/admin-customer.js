import { z } from "zod";

export const customerPutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(190),
  phone: z.string().trim().max(30).nullable().optional(),
});

export const customerPatchSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120).optional(),
    email: z.string().trim().email("Enter a valid email").max(190).optional(),
    phone: z.string().trim().max(30).nullable().optional(),
    emailVerified: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields to update",
  });
