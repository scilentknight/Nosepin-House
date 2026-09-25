import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { taxRateSchema } from "@/schemas/admin-settings";

function serialize(rate: { percent: unknown; [key: string]: unknown }) {
  return { ...rate, percent: Number(rate.percent) };
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid tax rate id");

    const body = await request.json();
    const parsed = taxRateSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing) return fail(404, "Tax rate not found");

    const data = parsed.data;
    const countryTaken = await prisma.taxRate.findFirst({ where: { country: data.country, id: { not: id } } });
    if (countryTaken) return fail(409, `A tax rate for ${data.country} already exists`);

    const rate = await prisma.taxRate.update({ where: { id }, data });
    return ok(serialize(rate), "Tax rate updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid tax rate id");

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing) return fail(404, "Tax rate not found");

    const body = await request.json();
    if (typeof body?.active !== "boolean") return fail(400, "Invalid request");

    const rate = await prisma.taxRate.update({ where: { id }, data: { active: body.active } });
    return ok(serialize(rate), "Tax rate updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid tax rate id");

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing) return fail(404, "Tax rate not found");

    await prisma.taxRate.delete({ where: { id } });
    return ok(null, "Tax rate deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
