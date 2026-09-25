import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { ensureUniqueSlug } from "@/lib/slug";
import { categorySchema } from "@/schemas/admin-category";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");
    const category = await prisma.category.findUnique({
      where: { id },
      include: { parent: { select: { id: true, name: true } } },
    });
    if (!category) return fail(404, "Category not found");
    return ok(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return fail(404, "Category not found");

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    if (data.parentCategoryId === id) return fail(400, "A category cannot be its own parent");

    const desiredSlug = data.slug?.trim() || data.name;
    const slug =
      desiredSlug === existing.slug ? existing.slug : await ensureUniqueSlug(prisma.category, desiredSlug, id);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        parentCategoryId: data.parentCategoryId || null,
        description: data.description || null,
        image: data.image || null,
        bannerImage: data.bannerImage || null,
        icon: data.icon || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        sortOrder: data.sortOrder,
        isFeatured: data.isFeatured,
        status: data.status,
      },
    });

    return ok(category, "Category updated");
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

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return fail(404, "Category not found");

    await prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
    return ok(null, "Category moved to trash");
  } catch (error) {
    return handleApiError(error);
  }
}
