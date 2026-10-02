import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/auth";
import { sendMailBestEffort, otpEmail } from "@/lib/mail";

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid input",
        },
        { status: 400 },
      );
    }

    const { name, email, phone, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const verificationCode = generateOTP();
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json(
          { success: false, message: "An account with this email already exists." },
          { status: 409 },
        );
      } else {
        // Account exists but NOT verified -> regenerate OTP
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            verificationCode,
            verificationCodeExpiresAt,
          },
        });

        await sendMailBestEffort({ to: existing.email, ...otpEmail(verificationCode) });

        return NextResponse.json({
          success: true,
          pendingVerification: true,
          message: "A new verification code has been sent to your email.",
          data: { email: existing.email },
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone || null,
        passwordHash,
        emailVerified: null,
        verificationCode,
        verificationCodeExpiresAt,
      },
    });

    await sendMailBestEffort({ to: user.email, ...otpEmail(verificationCode) });

    return NextResponse.json({
      success: true,
      pendingVerification: true,
      message: "Account created. Please verify your email.",
      data: { email: user.email },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account.",
      },
      { status: 500 },
    );
  }
}
