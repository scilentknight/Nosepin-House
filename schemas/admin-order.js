import { z } from "zod";
export const updateStatusSchema = z.object({
    status: z.enum(["SHIPPED", "CANCELLED", "DELIVERED"]),
    trackingNumber: z.string().max(100).optional(),
    courierName: z.string().max(100).optional(),
    note: z.string().max(500).optional(),
});
export const returnActionSchema = z.object({
    action: z.enum(["approve", "reject"]),
    note: z.string().max(500).optional(),
});
