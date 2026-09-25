import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/schemas/auth";
import { sendMailBestEffort, passwordResetEmail } from "@/lib/mail";

const GENERIC_MESSAGE = "If an account exists for that email, we've sent a password reset link.";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

    const baseUrl = (process.env.NEXTAUTH_URL ?? new URL(request.url).origin).replace(/\/$/, "");
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

    await sendMailBestEffort({ to: user.email, ...passwordResetEmail(resetUrl) });
  }

  return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
}
