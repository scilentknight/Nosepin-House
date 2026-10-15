import Link from "next/link";
import Image from "next/image";

export function CategoryGrid({ title, items, hrefFor }) {
  const categoriesOnly = items.filter(
    (item) => item.parentCategoryId === null || item.parentCategoryId === undefined,
  );
  if (categoriesOnly.length === 0) return null;

  return (
    <section className="w-full bg-[#f4eee4] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#937902]">
              The tray
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#381c19] sm:text-4xl">{title}</h2>
          </div>
          <Link
            href="/jewellery"
            className="hidden text-xs font-medium uppercase tracking-[0.18em] text-[#783f35] underline-offset-4 hover:underline sm:inline"
          >
            All jewellery
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#d5bbb3] md:grid-cols-4">
          {categoriesOnly.map((item, index) => {
            const wide = index === 0 && categoriesOnly.length > 2;
            return (
              <Link
                href={hrefFor(item.slug)}
                key={item.id}
                className={`group relative min-h-[190px] overflow-hidden bg-[#eadbd6] sm:min-h-[240px] ${
                  wide ? "md:col-span-2 md:row-span-2 md:min-h-[100%]" : ""
                }`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes={wide ? "(max-width: 768px) 50vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[190px] items-center justify-center font-serif text-5xl text-[#ba8b30]">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#24120f]/70 via-transparent to-transparent" />
                <h3 className="absolute bottom-4 left-4 font-serif text-lg text-white sm:text-xl">
                  {item.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
