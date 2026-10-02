import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMailBestEffort, otpEmail } from "@/lib/mail";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: "This account has already been verified." },
        { status: 400 },
      );
    }

    // Optional: Add cooldown check here if verificationCodeExpiresAt is close to 10 mins

    const newOtp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: newOtp,
        verificationCodeExpiresAt: expiresAt,
      },
    });

    await sendMailBestEffort({ to: user.email, ...otpEmail(newOtp) });

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while resending the code." },
      { status: 500 },
    );
  }
}
