import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    const otp = String(body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and verification code are required.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found.",
        },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "This account has already been verified.",
        },
        { status: 400 },
      );
    }

    if (!user.verificationCode || !user.verificationCodeExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "No verification code found. Please request a new code.",
        },
        { status: 400 },
      );
    }

    if (new Date() > user.verificationCodeExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "Your verification code has expired. Please request a new code.",
        },
        { status: 400 },
      );
    }

    if (otp !== user.verificationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying your account.",
      },
      { status: 500 },
    );
  }
}
