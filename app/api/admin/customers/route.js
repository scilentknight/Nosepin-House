import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";
import { parsePagination } from "@/lib/admin-query";

const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { orders: true, reviews: true } },
};

export async function GET(request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const verified = searchParams.get("verified");
    const { page, pageSize, skip } = parsePagination(searchParams);

    const where = {
      role: "USER",
      ...(verified === "true" ? { emailVerified: { not: null } } : {}),
      ...(verified === "false" ? { emailVerified: null } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: customerSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return ok({ customers, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}
