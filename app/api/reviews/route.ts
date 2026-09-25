import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { reviewSchema } from "@/schemas/review";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return fail(400, parsed.error.issues[0]?.message ?? "Invalid review");
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parsed.data.orderItemId },
      include: { order: true },
    });

    if (!orderItem || orderItem.order.userId !== user.id) {
      return fail(404, "Order item not found");
    }
    if (orderItem.order.status !== "DELIVERED") {
      return fail(400, "You can only review items from delivered orders");
    }

    try {
      const review = await prisma.review.create({
        data: {
          productId: orderItem.productId,
          userId: user.id,
          orderItemId: orderItem.id,
          rating: parsed.data.rating,
          comment: parsed.data.comment,
        },
      });
      return ok(review, "Review submitted");
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        return fail(409, "You already reviewed this item");
      }
      throw error;
    }
  } catch (error) {
    return handleApiError(error);
  }
}
