import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MaterialForm } from "@/components/admin/materials/MaterialForm";

export default function NewMaterialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/materials"
          aria-label="Back to materials"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-soft"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Add Material
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a material and define its purity or grade options.
          </p>
        </div>
      </div>

      <MaterialForm />
    </div>
  );
}
