export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-slate-200" />
          <div className="h-4 w-56 rounded bg-slate-200" />
        </div>

        <div className="h-8 w-28 rounded bg-slate-200" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="mt-4 h-9 w-28 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Main dashboard */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 lg:grid-cols-12">
        {/* Revenue chart */}
        <div className="bg-white p-5 lg:col-span-8">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-6 h-[270px] rounded bg-slate-200" />
        </div>

        {/* At a glance */}
        <div className="bg-white p-5 lg:col-span-4">
          <div className="h-4 w-24 rounded bg-slate-200" />

          <div className="mt-6 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-4 w-16 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Orders status */}
        <div className="bg-white p-5 lg:col-span-4">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mx-auto mt-6 h-44 w-44 rounded-full bg-slate-200" />
        </div>

        {/* Best sellers */}
        <div className="bg-white p-5 lg:col-span-4">
          <div className="h-4 w-28 rounded bg-slate-200" />

          <div className="mt-6 space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="mt-2 h-1 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="bg-white p-5 lg:col-span-4">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mx-auto mt-6 h-44 w-44 rounded-full bg-slate-200" />
        </div>

        {/* Recent orders */}
        <div className="bg-white p-5 lg:col-span-12">
          <div className="h-4 w-32 rounded bg-slate-200" />

          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
