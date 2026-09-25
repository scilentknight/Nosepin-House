import { z } from "zod";

export const emailSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  smtpHost: z.string().max(200).nullable().optional(),
  smtpPort: z.number().int().min(1).max(65535).default(587),
  smtpUser: z.string().max(200).nullable().optional(),
  smtpPassword: z.string().max(500).nullable().optional(),
  secure: z.boolean().default(false),
  fromName: z.string().min(1).max(150).default("DXN"),
  fromEmail: z.string().email("Must be a valid email").nullable().optional().or(z.literal("")),
});

export type EmailSettingsInput = z.infer<typeof emailSettingsSchema>;

export const testEmailSchema = z.object({
  to: z.string().email("Must be a valid email"),
});

export const paymentSettingsSchema = z.object({
  codEnabled: z.boolean().default(true),
  codMinOrderAmount: z.number().nonnegative().nullable().optional(),
  codMaxOrderAmount: z.number().nonnegative().nullable().optional(),
  esewaEnabled: z.boolean().default(true),
  esewaLogo: z.string().nullable().optional(),
  esewaProductCode: z.string().max(100).nullable().optional(),
  esewaSecretKey: z.string().max(500).nullable().optional(),
  esewaPaymentUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  esewaStatusUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
});

export type PaymentSettingsInput = z.infer<typeof paymentSettingsSchema>;

export const invoiceSettingsSchema = z.object({
  companyName: z.string().max(150).default("DXN"),
  addressLine1: z.string().max(200).nullable().optional(),
  addressLine2: z.string().max(200).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email("Must be a valid email").nullable().optional().or(z.literal("")),
  taxId: z.string().max(60).nullable().optional(),
  footerNote: z.string().max(1000).nullable().optional(),
  logo: z.string().nullable().optional(),
  invoicePrefix: z.string().min(1).max(20).default("INV-"),
});

export type InvoiceSettingsInput = z.infer<typeof invoiceSettingsSchema>;

export const adminProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  email: z.string().email("Must be a valid email"),
  image: z.string().nullable().optional(),
});

export type AdminProfileInput = z.infer<typeof adminProfileSchema>;

export const shippingZoneSchema = z.object({
  country: z.string().min(1, "Country is required").max(100),
  label: z.string().min(1, "Label is required").max(150),
  rate: z.number().nonnegative("Rate must be 0 or more"),
  freeShippingMinOrder: z.number().nonnegative().nullable().optional(),
  isDefault: z.boolean().default(false),
});

export type ShippingZoneInput = z.infer<typeof shippingZoneSchema>;

export const taxRateSchema = z.object({
  country: z.string().min(1, "Country is required").max(100),
  label: z.string().min(1, "Label is required").max(60).default("VAT"),
  percent: z.number().min(0, "Percent must be 0 or more").max(100, "Percent can't exceed 100"),
  active: z.boolean().default(true),
});

export type TaxRateInput = z.infer<typeof taxRateSchema>;

export const municipalityShippingRateSchema = z.object({
  municipalityId: z.number().int().positive("Municipality is required"),
  label: z.string().max(150).nullable().optional().or(z.literal("")),
  rate: z.number().nonnegative("Rate must be 0 or more"),
  freeShippingMinOrder: z.number().nonnegative().nullable().optional(),
});

export type MunicipalityShippingRateInput = z.infer<typeof municipalityShippingRateSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
