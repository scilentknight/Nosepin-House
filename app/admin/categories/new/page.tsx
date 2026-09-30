// "use client";

// import {
//   CategoryForm,
//   EMPTY_CATEGORY,
//   type CategoryFormValues,
// } from "@/components/admin/categories/CategoryForm";

// export default function NewCategoryPage() {
//   async function handleSubmit(values: CategoryFormValues): Promise<void> {
//     const res = await fetch("/api/admin/categories", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(values),
//     });

//     const json = await res.json();

//     if (!res.ok) {
//       throw new Error(json.message || "Failed to create category");
//     }

//     console.log("Category created:", json);
//   }

//   return (
//     <div className="mx-auto max-w-5xl">
//       <h1 className="text-2xl font-bold tracking-tight text-gray-900">
//         New Category
//       </h1>

//       <p className="mt-1 text-sm text-gray-500">
//         Create a new product category.
//       </p>

//       <div className="mt-6">
//         <CategoryForm initialValues={EMPTY_CATEGORY} onSubmit={handleSubmit} />
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";

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

    // Redirect to category list
    router.push("/admin/categories");

    // Refresh the page data
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        New Category
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Create a new product category.
      </p>

      <div className="mt-6">
        <CategoryForm initialValues={EMPTY_CATEGORY} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
