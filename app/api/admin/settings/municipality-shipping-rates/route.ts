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

export async function GET() {
  try {
    await requireAdmin();
    const rates = await prisma.municipalityShippingRate.findMany({
      include: rateInclude,
      orderBy: { createdAt: "desc" },
    });
    return ok(rates.map(serialize));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = municipalityShippingRateSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const municipality = await prisma.addressBook.findUnique({ where: { id: parsed.data.municipalityId } });
    if (!municipality || municipality.level !== "MUNICIPALITY") return fail(400, "Invalid municipality");

    const existing = await prisma.municipalityShippingRate.findUnique({
      where: { municipalityId: parsed.data.municipalityId },
    });
    if (existing) return fail(409, `A shipping rate for ${municipality.name} already exists`);

    const rate = await prisma.municipalityShippingRate.create({
      data: {
        municipalityId: parsed.data.municipalityId,
        label: parsed.data.label || null,
        rate: parsed.data.rate,
        freeShippingMinOrder: parsed.data.freeShippingMinOrder ?? null,
      },
      include: rateInclude,
    });

    return ok(serialize(rate), "Municipality shipping rate created");
  } catch (error) {
    return handleApiError(error);
  }
}
