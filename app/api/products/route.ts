import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, handleApiError } from "@/lib/api";
import { variantLabel } from "@/lib/checkoutCore";

function toProductDTO(product: {
  id: number;
  name: string;
  slug: string;
  price: unknown;
  compareAtPrice: unknown;
  stock: number;
  colorway: string;
  category: { id: number; name: string; slug: string };
  images: { url: string | null; alt: string }[];
  reviews?: { rating: number }[];
}) {
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    stock: product.stock,
    colorway: product.colorway,
    image: product.images[0]?.url ?? null,
    category: product.category,
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: product.reviews?.length ?? 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (ids) {
      const idList = ids
        .split(",")
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n));
      const products = await prisma.product.findMany({
        where: { id: { in: idList }, status: "PUBLISHED", deletedAt: null },
        include: {
          category: true,
          images: { take: 1 },
          variants: {
            where: { status: "ACTIVE", deletedAt: null },
            include: { attributeValues: { include: { attributeValue: { include: { attribute: true } } } } },
          },
        },
      });
      return ok(
        products.map((p) => ({
          ...toProductDTO(p),
          variants: p.variants.map((v) => ({
            id: v.id,
            price: v.price !== null ? Number(v.price) : null,
            stock: v.stockQuantity,
            image: v.image,
            label: variantLabel(v),
          })),
        }))
      );
    }

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") ?? "featured";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(48, Number(searchParams.get("pageSize") ?? 12));

    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      ...(search ? { name: { contains: search } } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(brand ? { brand: { slug: brand } } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
    };

    const orderBy =
      sort === "price-asc"
        ? { price: "asc" as const }
        : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "newest"
        ? { createdAt: "desc" as const }
        : { createdAt: "asc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: { take: 1 }, reviews: { select: { rating: true } } },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      message: "",
      data: products.map((p) => toProductDTO(p)),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
