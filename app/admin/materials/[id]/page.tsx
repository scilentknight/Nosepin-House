import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MaterialForm } from "@/components/admin/materials/MaterialForm";

export const dynamic = "force-dynamic";

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      purities: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!material) {
    notFound();
  }

  const initialData = {
    id: material.id,
    name: material.name,
    code: material.code,
    type: material.type,
    unit: material.unit,
    description: material.description,
    isActive: material.isActive,
    purities: material.purities.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      fineness: p.fineness ? Number(p.fineness) : null,
      isActive: p.isActive,
    })),
  };

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
            Edit Material: {material.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Update material properties and purity/grade specifications.
          </p>
        </div>
      </div>

      <MaterialForm initialData={initialData} />
    </div>
  );
}
