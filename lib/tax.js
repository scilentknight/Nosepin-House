import { prisma } from "@/lib/prisma";
/** Looks up the configured tax rate for a destination country. No match = no tax charged. */
export async function resolveTaxRate(country) {
    const normalized = country.trim();
    const rate = await prisma.taxRate.findFirst({ where: { country: normalized, active: true } });
    if (!rate)
        return null;
    return { percent: Number(rate.percent), label: rate.label };
}
export function computeTax(taxableAmount, percent) {
    return Math.round(taxableAmount * (percent / 100) * 100) / 100;
}
