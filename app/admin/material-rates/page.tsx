import { MaterialRateManager } from "@/components/admin/material-rates/MaterialRateManager";

export const dynamic = "force-dynamic";

export default function MaterialRatesPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Material Rates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage daily material base rates and automatically derived purity
            rates.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <MaterialRateManager />
      </div>
    </div>
  );
}
