import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { parsePagination } from "@/lib/admin-query";
import { ensureUniqueSlug } from "@/lib/slug";
import { categorySchema } from "@/schemas/admin-category";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const parentCategoryId = searchParams.get("parentCategoryId");
    const trashed = searchParams.get("trashed") === "true";
    const tree = searchParams.get("tree") === "true";

    const where: Prisma.CategoryWhereInput = {
      deletedAt: trashed ? { not: null } : null,
      ...(status === "ACTIVE" || status === "INACTIVE" ? { status } : {}),
      ...(parentCategoryId === "root"
        ? { parentCategoryId: null }
        : parentCategoryId
        ? { parentCategoryId: Number(parentCategoryId) }
        : {}),
      ...(search ? { name: { contains: search } } : {}),
    };

    if (tree) {
      const categories = await prisma.category.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { _count: { select: { products: true, children: true } } },
      });
      return ok({ categories, total: categories.length, page: 1, pageSize: categories.length });
    }

    const { page, pageSize, skip } = parsePagination(searchParams);

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { products: true, children: true } },
        },
        skip,
        take: pageSize,
      }),
      prisma.category.count({ where }),
    ]);

    return ok({ categories, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const slug = await ensureUniqueSlug(prisma.category, data.slug || data.name);

    const category = await prisma.category.create({
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

    return ok(category, "Category created");
  } catch (error) {
    return handleApiError(error);
  }
}
