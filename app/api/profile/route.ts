import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { updateProfileSchema } from "@/schemas/auth";

export async function GET() {
  try {
    const sessionUser = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, name: true, email: true, phone: true, image: true },
    });
    if (!user) return fail(404, "User not found");
    return ok(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const sessionUser = await requireUser();
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const user = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        image: parsed.data.image,
      },
      select: { id: true, name: true, email: true, phone: true, image: true },
    });

    return ok(user, "Profile updated");
  } catch (error) {
    return handleApiError(error);
  }
}
