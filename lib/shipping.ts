import { prisma } from "@/lib/prisma";

export interface ShippingResult {
  fee: number;
  label: string | null;
}

/**
 * Resolves the shipping fee for a destination. A municipality-specific override
 * (admin-assigned in Settings > Shipping) always wins when the address has one.
 * Otherwise falls back to the country zone: an exact country match first, then
 * whichever zone is marked default (typically an "International"/rest-of-world
 * catch-all). Returns a zero fee with no label if nothing is configured at all —
 * shipping stays optional.
 */
export async function resolveShippingFee(
  country: string,
  subtotal: number,
  municipalityId?: number | null
): Promise<ShippingResult> {
  if (municipalityId) {
    const override = await prisma.municipalityShippingRate.findUnique({
      where: { municipalityId },
      include: { municipality: true },
    });
    if (override) {
      const label = override.label || override.municipality.name;
      if (override.freeShippingMinOrder && subtotal >= Number(override.freeShippingMinOrder)) {
        return { fee: 0, label: `${label} (free over Rs ${Number(override.freeShippingMinOrder).toLocaleString()})` };
      }
      return { fee: Number(override.rate), label };
    }
  }

  const normalized = country.trim();

  const zone =
    (await prisma.shippingZone.findFirst({ where: { country: normalized } })) ??
    (await prisma.shippingZone.findFirst({ where: { isDefault: true } }));

  if (!zone) return { fee: 0, label: null };

  if (zone.freeShippingMinOrder && subtotal >= Number(zone.freeShippingMinOrder)) {
    return { fee: 0, label: `${zone.label} (free over Rs ${Number(zone.freeShippingMinOrder).toLocaleString()})` };
  }

  return { fee: Number(zone.rate), label: zone.label };
}
