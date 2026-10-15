import { prisma } from "@/lib/prisma";
const SETTINGS_ID = "singleton";
export async function getEmailSettings() {
    return prisma.emailSettings.upsert({
        where: { id: SETTINGS_ID },
        update: {},
        create: { id: SETTINGS_ID },
    });
}
export async function updateEmailSettings(data) {
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
export async function updatePaymentSettings(data) {
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
export async function updateInvoiceSettings(data) {
    return prisma.invoiceSettings.upsert({
        where: { id: SETTINGS_ID },
        update: data,
        create: { id: SETTINGS_ID, ...data },
    });
}
