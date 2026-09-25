import { z } from "zod";

export const returnRequestSchema = z.object({
  reason: z.string().min(5, "Please describe the reason for the return").max(500),
});

export type ReturnRequestInput = z.infer<typeof returnRequestSchema>;
