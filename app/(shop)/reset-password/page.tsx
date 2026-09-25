"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    if (!token) {
      setFormError("This reset link is missing its token.");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: values.password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setFormError(json.message ?? "Something went wrong");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Logo showText={false} iconSize={48} className="mx-auto" />
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">Reset your password</h1>
      <p className="mt-2 text-center text-sm text-gray-500">Choose a new password for your account</p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        {!token ? (
          <p className="text-sm text-red-600">This reset link is invalid. Please request a new one.</p>
        ) : success ? (
          <p className="text-sm text-gray-700">Password updated — redirecting you to log in…</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              Update password
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/login" className="font-medium text-primary-600 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
