import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MaterialForm } from "@/components/admin/materials/MaterialForm";

export default function NewMaterialPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Add Material
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a material and define its purity or grade options.
          </p>
        </div>

        {/* Right */}
        <Link
          href="/admin/materials"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Form */}
      <MaterialForm />
    </div>
  );
}