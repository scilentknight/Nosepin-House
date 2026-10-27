import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";

export default function Bestsellers({ products }) {
  const visibleProducts = products.slice(0, 8);
  if (visibleProducts.length === 0) return null;

  return (
    <section className="w-full bg-[#fbf6ee] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-[#e8ddd2] pb-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#937902]">
              From the counter
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#381c19] sm:text-4xl">
              Pieces going out the door
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#6f625d]">
              Recent jewellery on the floor — nosepins, earrings, and sets
              people actually buy.
            </p>
          </div>
          <Link
            href="/jewellery"
            className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-[#783f35] underline-offset-4 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="h-full border border-[#e8ddd2] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
