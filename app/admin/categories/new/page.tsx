"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  CategoryForm,
  EMPTY_CATEGORY,
  type CategoryFormValues,
} from "@/components/admin/categories/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();

  async function handleSubmit(values: CategoryFormValues): Promise<void> {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Failed to create category");
    }

    console.log("Category created:", json);

    router.push("/admin/categories");

    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Category
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new product category.
          </p>
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="mt-6">
        <CategoryForm initialValues={EMPTY_CATEGORY} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
