import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { ensureUniqueSlug } from "@/lib/slug";
import { attributeSchema } from "@/schemas/admin-attribute";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.attribute.findUnique({ where: { id } });
    if (!existing) return fail(404, "Attribute not found");

    const body = await request.json();
    const parsed = attributeSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const slug = data.name === existing.name ? existing.slug : await ensureUniqueSlug(prisma.attribute, data.name, id);

    const attribute = await prisma.attribute.update({
      where: { id },
      data: { name: data.name, slug, type: data.type, sortOrder: data.sortOrder },
    });

    return ok(attribute, "Attribute updated");
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

    const existing = await prisma.attribute.findUnique({
      where: { id },
      include: { values: { include: { _count: { select: { variantValues: true } } } } },
    });
    if (!existing) return fail(404, "Attribute not found");

    const inUse = existing.values.some((v) => v._count.variantValues > 0);
    if (inUse) return fail(400, "Cannot delete an attribute whose values are used by existing variants");

    await prisma.attribute.delete({ where: { id } });
    return ok(null, "Attribute deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
