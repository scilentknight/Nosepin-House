"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordInput) {
    setMessage(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    setMessage(json.message ?? "If an account exists for that email, we've sent a password reset link.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Logo showText={false} iconSize={48} className="mx-auto" />
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">Forgot your password?</h1>
      <p className="mt-2 text-center text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link</p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        {message ? (
          <p className="text-sm text-gray-700">{message}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
