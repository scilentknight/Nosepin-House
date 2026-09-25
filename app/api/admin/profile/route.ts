import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { adminProfileSchema } from "@/schemas/admin-settings";

export async function GET() {
  try {
    const admin = await requireAdmin();
    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { id: true, name: true, email: true, image: true },
    });
    if (!user) return fail(404, "User not found");
    return ok(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const parsed = adminProfileSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== admin.id) return fail(400, "This email is already in use");

    const user = await prisma.user.update({
      where: { id: admin.id },
      data: { name: parsed.data.name, email, image: parsed.data.image },
      select: { id: true, name: true, email: true, image: true },
    });

    return ok(user, "Profile updated");
  } catch (error) {
    return handleApiError(error);
  }
}
