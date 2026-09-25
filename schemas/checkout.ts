import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  line1: z.string().min(3, "Local address / Tole is required").max(200),
  provinceId: z.number().int().positive("Province is required"),
  districtId: z.number().int().positive("District is required"),
  municipalityId: z.number().int().positive("City is required"),
  wardNo: z.number().int().positive("Area / Ward is required"),
  landmark: z.string().max(200).optional().or(z.literal("")),
  addressType: z.enum(["HOME", "OFFICE", "OTHER"]),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = z.object({
  address: addressSchema,
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  paymentSubMethod: z.literal("ESEWA").optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
