import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { parsePagination } from "@/lib/admin-query";
import { ensureUniqueSlug } from "@/lib/slug";
import { brandSchema } from "@/schemas/admin-brand";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const trashed = searchParams.get("trashed") === "true";
    const { page, pageSize, skip } = parsePagination(searchParams);

    const where: Prisma.BrandWhereInput = {
      deletedAt: trashed ? { not: null } : null,
      ...(status === "ACTIVE" || status === "INACTIVE" ? { status } : {}),
      ...(search ? { name: { contains: search } } : {}),
    };

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { _count: { select: { products: true } } },
        skip,
        take: pageSize,
      }),
      prisma.brand.count({ where }),
    ]);

    return ok({ brands, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = brandSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const slug = await ensureUniqueSlug(prisma.brand, data.slug || data.name);

    const brand = await prisma.brand.create({
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

    return ok(brand, "Brand created");
  } catch (error) {
    return handleApiError(error);
  }
}
