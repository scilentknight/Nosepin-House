import { prisma } from "@/lib/prisma";
import { ok, fail, handleApiError } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED", deletedAt: null },
      include: {
        category: true,
        images: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) return fail(404, "Product not found");

    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return ok({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.fullDescription,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      stock: product.stock,
      colorway: product.colorway,
      category: product.category,
      images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
      rating: Math.round(avgRating * 10) / 10,
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        userName: r.user.name,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
