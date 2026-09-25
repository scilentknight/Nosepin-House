"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!res.ok) {
      setFormError(json.message ?? "Something went wrong");
      return;
    }

    await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Logo showText={false} iconSize={48} className="mx-auto" />
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">Create your account</h1>
      <p className="mt-2 text-center text-sm text-gray-500">Join DXN for a healthier everyday</p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Full Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone (optional)" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
