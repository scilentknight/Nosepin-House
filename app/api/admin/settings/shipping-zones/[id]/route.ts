import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { shippingZoneSchema } from "@/schemas/admin-settings";

function serialize(zone: { rate: unknown; freeShippingMinOrder: unknown; [key: string]: unknown }) {
  return {
    ...zone,
    rate: Number(zone.rate),
    freeShippingMinOrder: zone.freeShippingMinOrder ? Number(zone.freeShippingMinOrder) : null,
  };
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid shipping zone id");

    const body = await request.json();
    const parsed = shippingZoneSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const existing = await prisma.shippingZone.findUnique({ where: { id } });
    if (!existing) return fail(404, "Shipping zone not found");

    const data = parsed.data;
    const countryTaken = await prisma.shippingZone.findFirst({ where: { country: data.country, id: { not: id } } });
    if (countryTaken) return fail(409, `A shipping zone for ${data.country} already exists`);

    const zone = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.shippingZone.updateMany({ where: { isDefault: true, id: { not: id } }, data: { isDefault: false } });
      }
      return tx.shippingZone.update({
        where: { id },
        data: {
          country: data.country,
          label: data.label,
          rate: data.rate,
          freeShippingMinOrder: data.freeShippingMinOrder ?? null,
          isDefault: data.isDefault,
        },
      });
    });

    return ok(serialize(zone), "Shipping zone updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid shipping zone id");

    const existing = await prisma.shippingZone.findUnique({ where: { id } });
    if (!existing) return fail(404, "Shipping zone not found");

    await prisma.shippingZone.delete({ where: { id } });
    return ok(null, "Shipping zone deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
