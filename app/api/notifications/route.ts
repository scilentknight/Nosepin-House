import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const user = await requireUser();
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return ok(notifications);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const { id } = await request.json();

    if (id) {
      await prisma.notification.updateMany({
        where: { id, userId: user.id },
        data: { read: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
      });
    }

    return ok(null, "Marked as read");
  } catch (error) {
    return handleApiError(error);
  }
}
