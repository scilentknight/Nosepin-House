import {
  PromoProductCard,
  type PromoProduct,
} from "@/components/home/PromoProductCard";

interface PromoColumn {
  title: string;
  products: PromoProduct[];
}

const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

export function PromoProductColumns({ columns }: { columns: PromoColumn[] }) {
  const visible = columns.filter((c) => c.products.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="w-full border-t border-[#E8DDD2] bg-[#FBF6EE] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#937902]">
            Discover More
          </p>

          <h2 className="font-serif text-3xl italic text-[#783F35] sm:text-4xl">
            Shop Our Collections
          </h2>

          <div className="mx-auto mt-4 h-px w-16 bg-[#BA8B30]" />
        </div>

        {/* Product Columns */}
        <div
          className={`grid grid-cols-1 gap-10 md:gap-8 ${GRID_COLS[visible.length]}`}
        >
          {visible.map((column) => (
            <div
              key={column.title}
              className="rounded-2xl border border-[#E8DDD2] bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-soft-lg sm:p-6"
            >
              {/* Column Title */}
              <div className="mb-5 flex items-center justify-between border-b border-[#E8DDD2] pb-4">
                <h3 className="font-serif text-xl text-[#592D27]">
                  {column.title}
                </h3>

                <span className="text-xs uppercase tracking-wider text-[#937902]">
                  {column.products.length} Items
                </span>
              </div>

              {/* Products */}
              <div className="flex flex-col divide-y divide-[#E8DDD2]">
                {column.products.map((product) => (
                  <div
                    key={product.id}
                    className="py-4 transition-transform duration-200 first:pt-0 last:pb-0 hover:translate-x-1"
                  >
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
