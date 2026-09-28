import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { MaterialsListClient } from "@/components/admin/materials/MaterialsListClient";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const materials = await prisma.material.findMany({
    include: {
      purities: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const formattedMaterials = materials.map((m) => ({
    id: m.id,
    name: m.name,
    code: m.code,
    type: m.type,
    unit: m.unit,
    description: m.description,
    isActive: m.isActive,
    purities: m.purities.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      fineness: p.fineness ? Number(p.fineness) : null,
      isActive: p.isActive,
    })),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Materials
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage jewellery materials and their purity or grade options.
          </p>
        </div>

        <Link href="/admin/materials/new">
          <Button variant="admin" size="sm">
            <Plus className="h-4 w-4" />
            New Material
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <MaterialsListClient initialMaterials={formattedMaterials} />
      </div>
    </div>
  );
}