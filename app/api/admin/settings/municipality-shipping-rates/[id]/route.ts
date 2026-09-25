import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { municipalityShippingRateSchema } from "@/schemas/admin-settings";

function serialize(rate: {
  rate: unknown;
  freeShippingMinOrder: unknown;
  municipality: {
    name: string;
    parentId: number | null;
    parent: { name: string; parentId: number | null; parent: { name: string } | null } | null;
  };
  [key: string]: unknown;
}) {
  return {
    ...rate,
    rate: Number(rate.rate),
    freeShippingMinOrder: rate.freeShippingMinOrder ? Number(rate.freeShippingMinOrder) : null,
    municipalityName: rate.municipality.name,
    districtId: rate.municipality.parentId,
    districtName: rate.municipality.parent?.name ?? null,
    provinceId: rate.municipality.parent?.parentId ?? null,
    provinceName: rate.municipality.parent?.parent?.name ?? null,
    municipality: undefined,
  };
}

const rateInclude = { municipality: { include: { parent: { include: { parent: true } } } } };

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid shipping rate id");

    const body = await request.json();
    const parsed = municipalityShippingRateSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const existing = await prisma.municipalityShippingRate.findUnique({ where: { id } });
    if (!existing) return fail(404, "Shipping rate not found");

    const municipality = await prisma.addressBook.findUnique({ where: { id: parsed.data.municipalityId } });
    if (!municipality || municipality.level !== "MUNICIPALITY") return fail(400, "Invalid municipality");

    const taken = await prisma.municipalityShippingRate.findFirst({
      where: { municipalityId: parsed.data.municipalityId, id: { not: id } },
    });
    if (taken) return fail(409, `A shipping rate for ${municipality.name} already exists`);

    const rate = await prisma.municipalityShippingRate.update({
      where: { id },
      data: {
        municipalityId: parsed.data.municipalityId,
        label: parsed.data.label || null,
        rate: parsed.data.rate,
        freeShippingMinOrder: parsed.data.freeShippingMinOrder ?? null,
      },
      include: rateInclude,
    });

    return ok(serialize(rate), "Municipality shipping rate updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid shipping rate id");

    const existing = await prisma.municipalityShippingRate.findUnique({ where: { id } });
    if (!existing) return fail(404, "Shipping rate not found");

    await prisma.municipalityShippingRate.delete({ where: { id } });
    return ok(null, "Municipality shipping rate deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
