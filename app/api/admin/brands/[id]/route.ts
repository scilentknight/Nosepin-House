import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { ensureUniqueSlug } from "@/lib/slug";
import { brandSchema } from "@/schemas/admin-brand";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return fail(404, "Brand not found");
    return ok(brand);
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

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) return fail(404, "Brand not found");

    const body = await request.json();
    const parsed = brandSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const desiredSlug = data.slug?.trim() || data.name;
    const slug = desiredSlug === existing.slug ? existing.slug : await ensureUniqueSlug(prisma.brand, desiredSlug, id);

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        logo: data.logo || null,
        banner: data.banner || null,
        description: data.description || null,
        websiteUrl: data.websiteUrl || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        sortOrder: data.sortOrder,
        isFeatured: data.isFeatured,
        status: data.status,
      },
    });

    return ok(brand, "Brand updated");
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

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) return fail(404, "Brand not found");

    await prisma.brand.update({ where: { id }, data: { deletedAt: new Date() } });
    return ok(null, "Brand moved to trash");
  } catch (error) {
    return handleApiError(error);
  }
}
