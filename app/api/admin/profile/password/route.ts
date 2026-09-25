import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { changePasswordSchema } from "@/schemas/admin-settings";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const user = await prisma.user.findUnique({ where: { id: admin.id } });
    if (!user) return fail(404, "User not found");

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!isValid) return fail(400, "Current password is incorrect");

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.user.update({ where: { id: admin.id }, data: { passwordHash } });

    return ok(null, "Password changed successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
