import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

const SORT_OPTIONS: Record<string, { label: string; orderBy: Prisma.ProductOrderByWithRelationInput }> = {
  featured: { label: "Featured", orderBy: { createdAt: "asc" } },
  newest: { label: "Newest", orderBy: { createdAt: "desc" } },
  "price-asc": { label: "Price: Low to High", orderBy: { price: "asc" } },
  "price-desc": { label: "Price: High to Low", orderBy: { price: "desc" } },
};

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const search = params.search?.trim();
  const category = params.category;
  const brand = params.brand;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const color = params.color;
  const minRating = params.rating ? Number(params.rating) : undefined;
  const sortKey = params.sort && SORT_OPTIONS[params.sort] ? params.sort : "featured";
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    ...(search ? { name: { contains: search } } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(brand ? { brand: { slug: brand } } : {}),
    ...(color
      ? { variants: { some: { status: "ACTIVE", deletedAt: null, attributeValues: { some: { attributeValue: { slug: color } } } } } }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } }
      : {}),
  };

  const [categories, brands, allMatching, availableColorValues, activeBrand] = await Promise.all([
    prisma.category.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { status: "PUBLISHED", deletedAt: null } } } },
      },
    }),
    prisma.brand.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { status: "PUBLISHED", deletedAt: null } } } },
      },
    }),
    prisma.product.findMany({
      where,
      orderBy: SORT_OPTIONS[sortKey].orderBy,
      include: { category: true, images: { take: 1 }, reviews: { select: { rating: true } } },
    }),
    prisma.attributeValue.findMany({
      where: {
        attribute: { type: "COLOR" },
        variantValues: {
          some: { variant: { status: "ACTIVE", deletedAt: null, product: { status: "PUBLISHED", deletedAt: null } } },
        },
      },
      select: { value: true, slug: true, colorHex: true },
      distinct: ["value"],
      orderBy: { sortOrder: "asc" },
    }),
    brand ? prisma.brand.findUnique({ where: { slug: brand }, select: { name: true } }) : null,
  ]);

  const withRatings = allMatching.map((p) => ({
    ...p,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
  }));

  const filtered = minRating ? withRatings.filter((p) => p.avgRating >= minRating) : withRatings;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const products = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function withParams(overrides: Record<string, string | undefined>) {
    const next = new URLSearchParams();
    const merged = {
      search,
      category,
      brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      color,
      rating: params.rating,
      sort: sortKey,
      ...overrides,
    };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    const qs = next.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {search
          ? `Search results for "${search}"`
          : category
            ? categories.find((c) => c.slug === category)?.name ?? "Shop"
            : activeBrand
              ? activeBrand.name
              : "All Products"}
      </h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <Link
                  href={withParams({ category: undefined, page: undefined })}
                  className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${
                    !category ? "bg-primary-50 font-semibold text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                  }`}
                >
                  All Products
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {categories.reduce((s, c) => s + c._count.products, 0)}
                  </span>
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={withParams({ category: c.slug, page: undefined })}
                    className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${
                      category === c.slug ? "bg-primary-50 font-semibold text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    {c.name}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{c._count.products}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {brands.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="text-sm font-semibold text-gray-900">Brands</h2>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <Link
                    href={withParams({ brand: undefined, page: undefined })}
                    className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${
                      !brand ? "bg-primary-50 font-semibold text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    All Brands
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {brands.reduce((s, b) => s + b._count.products, 0)}
                    </span>
                  </Link>
                </li>
                {brands.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={withParams({ brand: b.slug, page: undefined })}
                      className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${
                        brand === b.slug ? "bg-primary-50 font-semibold text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                      }`}
                    >
                      {b.name}
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{b._count.products}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {availableColorValues.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="flex items-center justify-between text-sm font-semibold text-gray-900">
                Color
                {color && (
                  <Link href={withParams({ color: undefined, page: undefined })} className="text-xs font-normal text-gray-400 hover:text-primary-600">
                    Clear
                  </Link>
                )}
              </h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {availableColorValues.map((v) => (
                  <Link
                    key={v.slug}
                    href={withParams({ color: color === v.slug ? undefined : v.slug, page: undefined })}
                    title={v.value}
                    aria-label={`Filter by ${v.value}`}
                    aria-current={color === v.slug}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-offset-2 transition-shadow ${
                      color === v.slug ? "ring-primary-500" : "ring-transparent hover:ring-gray-200"
                    }`}
                  >
                    <span className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: v.colorHex ?? "#d1d5db" }} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <form action="/shop" method="get" className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-gray-900">Price Range</h2>
            {color && <input type="hidden" name="color" value={color} />}
            {category && <input type="hidden" name="category" value={category} />}
            {brand && <input type="hidden" name="brand" value={brand} />}
            {search && <input type="hidden" name="search" value={search} />}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                defaultValue={params.minPrice}
                className="w-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                defaultValue={params.maxPrice}
                className="w-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <h2 className="mt-5 text-sm font-semibold text-gray-900">Rating</h2>
            <select
              name="rating"
              defaultValue={params.rating ?? ""}
              className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Any rating</option>
              <option value="4">4 stars & up</option>
              <option value="3">3 stars & up</option>
              <option value="2">2 stars & up</option>
              <option value="1">1 star & up</option>
            </select>

            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-primary-500 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-soft-lg"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{total} product{total === 1 ? "" : "s"} found</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort:</span>
              {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                <Link
                  key={key}
                  href={withParams({ sort: key === "featured" ? undefined : key, page: undefined })}
                  className={`rounded-full px-3 py-1.5 transition-colors ${sortKey === key ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center text-gray-500">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  className="border border-gray-200"
                  linkQuery={color ? `color=${color}` : undefined}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: Number(p.price),
                    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
                    colorway: p.colorway,
                    stock: p.stock,
                    image: p.images[0]?.url ?? null,
                    category: p.category,
                    rating: Math.round(p.avgRating * 10) / 10,
                    reviewCount: p.reviews.length,
                  }}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={withParams({ page: p === 1 ? undefined : String(p) })}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${p === page ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
