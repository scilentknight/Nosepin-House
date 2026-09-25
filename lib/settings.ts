import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

export async function getEmailSettings() {
  return prisma.emailSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function updateEmailSettings(data: {
  enabled: boolean;
  smtpHost: string | null;
  smtpPort: number;
  smtpUser: string | null;
  smtpPassword: string | null | undefined;
  secure: boolean;
  fromName: string;
  fromEmail: string | null;
}) {
  const { smtpPassword, ...rest } = data;
  return prisma.emailSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { ...rest, ...(smtpPassword !== undefined ? { smtpPassword } : {}) },
    create: { id: SETTINGS_ID, ...rest, smtpPassword: smtpPassword ?? null },
  });
}

export async function getPaymentSettings() {
  return prisma.paymentSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function updatePaymentSettings(data: {
  codEnabled: boolean;
  codMinOrderAmount: number | null;
  codMaxOrderAmount: number | null;
  esewaEnabled: boolean;
  esewaLogo: string | null;
  esewaProductCode: string | null;
  esewaSecretKey: string | null | undefined;
  esewaPaymentUrl: string | null;
  esewaStatusUrl: string | null;
}) {
  const { esewaSecretKey, ...rest } = data;
  return prisma.paymentSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { ...rest, ...(esewaSecretKey !== undefined ? { esewaSecretKey } : {}) },
    create: { id: SETTINGS_ID, ...rest, esewaSecretKey: esewaSecretKey ?? null },
  });
}

export async function getInvoiceSettings() {
  return prisma.invoiceSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function updateInvoiceSettings(data: {
  companyName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  footerNote: string | null;
  logo: string | null;
  invoicePrefix: string;
}) {
  return prisma.invoiceSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
}
