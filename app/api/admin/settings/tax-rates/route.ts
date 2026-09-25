import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { taxRateSchema } from "@/schemas/admin-settings";

function serialize(rate: { percent: unknown; [key: string]: unknown }) {
  return { ...rate, percent: Number(rate.percent) };
}

export async function GET() {
  try {
    await requireAdmin();
    const rates = await prisma.taxRate.findMany({ orderBy: { country: "asc" } });
    return ok(rates.map(serialize));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = taxRateSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const existing = await prisma.taxRate.findUnique({ where: { country: data.country } });
    if (existing) return fail(409, `A tax rate for ${data.country} already exists`);

    const rate = await prisma.taxRate.create({ data });
    return ok(serialize(rate), "Tax rate created");
  } catch (error) {
    return handleApiError(error);
  }
}
