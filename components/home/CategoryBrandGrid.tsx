import Link from "next/link";
import Image from "next/image";

export interface GridTile {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

interface CategoryBrandGridProps {
  title: string;
  items: GridTile[];
  hrefFor: (slug: string) => string;
}

export function CategoryBrandGrid({
  title,
  items,
  hrefFor,
}: CategoryBrandGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="w-full border-t border-[#E8DDD2] bg-[#FBF6EE] py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-10 font-serif text-3xl italic text-[#783F35]">
          {title}
        </h2>

        <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <Link
              href={hrefFor(item.slug)}
              key={item.id}
              className="group flex cursor-pointer flex-col items-center"
            >
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-sm border border-[#E8DDD2] bg-white shadow-sm transition-all duration-300 group-hover:border-[#BA8B30] group-hover:shadow-md">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-[#BA8B30]">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>

              <h3 className="font-serif text-lg text-[#592D27] transition-colors duration-300 group-hover:text-[#BA8B30]">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>

        <p className="mb-8 text-sm text-[#6F625D]">
          Shop by our top-selling categories, bought frequently by most
          customers
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/categories"
            className="bg-[#783F35] px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#592D27]"
          >
            Discover All Categories
          </Link>

          <Link
            href="/collections"
            className="border border-[#BA8B30] bg-transparent px-8 py-3 text-xs font-medium uppercase tracking-widest text-[#783F35] transition-colors hover:bg-[#BA8B30]/10"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
