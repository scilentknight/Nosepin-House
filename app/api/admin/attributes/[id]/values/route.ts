import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { slugify } from "@/lib/slug";
import { attributeValueSchema } from "@/schemas/admin-attribute";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const attribute = await prisma.attribute.findUnique({ where: { id } });
    if (!attribute) return fail(404, "Attribute not found");

    const body = await request.json();
    const parsed = attributeValueSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;

    const existing = await prisma.attributeValue.findFirst({ where: { attributeId: id, value: data.value } });
    if (existing) return fail(400, "This value already exists for this attribute");

    const value = await prisma.attributeValue.create({
      data: {
        attributeId: id,
        value: data.value,
        slug: slugify(data.value),
        colorHex: data.colorHex ?? null,
        sortOrder: data.sortOrder,
      },
    });

    return ok(value, "Value added");
  } catch (error) {
    return handleApiError(error);
  }
}
