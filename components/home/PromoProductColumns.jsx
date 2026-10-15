import { PromoProductCard } from "@/components/home/PromoProductCard";

const GRID_COLS = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

export function PromoProductColumns({ columns }) {
  const visible = columns.filter((c) => c.products.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="w-full bg-[#f4eee4] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#937902]">
            Three trays
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#381c19] sm:text-4xl">
            New, on offer, and moving
          </h2>
        </div>

        <div className={`grid grid-cols-1 gap-10 md:gap-12 ${GRID_COLS[visible.length]}`}>
          {visible.map((column) => (
            <div key={column.title}>
              <div className="mb-4 flex items-baseline justify-between border-b border-[#d5bbb3] pb-3">
                <h3 className="font-serif text-xl text-[#381c19]">{column.title}</h3>
                <span className="text-[11px] uppercase tracking-wider text-[#937902]">
                  {column.products.length}
                </span>
              </div>
              <div className="flex flex-col divide-y divide-[#e8ddd2]">
                {column.products.map((product) => (
                  <div key={product.id} className="py-4 first:pt-0 last:pb-0">
                    <PromoProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
