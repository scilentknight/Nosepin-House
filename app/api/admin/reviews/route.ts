import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";
import { parsePagination } from "@/lib/admin-query";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const { page, pageSize, skip } = parsePagination(searchParams);

    const where: Prisma.ReviewWhereInput = {
      ...(status === "PENDING" || status === "APPROVED" || status === "REJECTED" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { comment: { contains: search } },
              { product: { name: { contains: search } } },
            ],
          }
        : {}),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: { select: { name: true, slug: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.review.count({ where }),
    ]);

    return ok({ reviews, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}
