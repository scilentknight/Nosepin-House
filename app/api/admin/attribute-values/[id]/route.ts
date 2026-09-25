import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { slugify } from "@/lib/slug";
import { attributeValueSchema } from "@/schemas/admin-attribute";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.attributeValue.findUnique({ where: { id } });
    if (!existing) return fail(404, "Attribute value not found");

    const body = await request.json();
    const parsed = attributeValueSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const value = await prisma.attributeValue.update({
      where: { id },
      data: {
        value: data.value,
        slug: slugify(data.value),
        colorHex: data.colorHex ?? null,
        sortOrder: data.sortOrder,
      },
    });

    return ok(value, "Value updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.attributeValue.findUnique({
      where: { id },
      include: { _count: { select: { variantValues: true } } },
    });
    if (!existing) return fail(404, "Attribute value not found");
    if (existing._count.variantValues > 0) return fail(400, "Cannot delete a value used by existing variants");

    await prisma.attributeValue.delete({ where: { id } });
    return ok(null, "Value deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
