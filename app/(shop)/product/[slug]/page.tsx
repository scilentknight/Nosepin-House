import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StarRating } from "@/components/ui/StarRating";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { formatDate } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { color: colorSlug } = await searchParams;

  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      variants: {
        where: { status: "ACTIVE", deletedAt: null },
        include: { attributeValues: { include: { attributeValue: { include: { attribute: true } } } } },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!product) notFound();

  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const groupMap = new Map<
    number,
    {
      id: number;
      name: string;
      type: "TEXT" | "COLOR";
      sortOrder: number;
      values: Map<number, { id: number; value: string; slug: string; colorHex: string | null; sortOrder: number }>;
    }
  >();
  for (const variant of product.variants) {
    for (const av of variant.attributeValues) {
      const attr = av.attributeValue.attribute;
      if (!groupMap.has(attr.id)) {
        groupMap.set(attr.id, { id: attr.id, name: attr.name, type: attr.type, sortOrder: attr.sortOrder, values: new Map() });
      }
      const group = groupMap.get(attr.id)!;
      if (!group.values.has(av.attributeValue.id)) {
        group.values.set(av.attributeValue.id, {
          id: av.attributeValue.id,
          value: av.attributeValue.value,
          slug: av.attributeValue.slug,
          colorHex: av.attributeValue.colorHex,
          sortOrder: av.attributeValue.sortOrder,
        });
      }
    }
  }
  const variantGroups = Array.from(groupMap.values())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((g) => ({
      id: g.id,
      name: g.name,
      type: g.type,
      values: Array.from(g.values.values()).sort((a, b) => a.sortOrder - b.sortOrder),
    }));

  const initialSelected: Record<number, number> = {};
  if (colorSlug) {
    for (const group of variantGroups) {
      const match = group.values.find((v) => v.slug === colorSlug);
      if (match) {
        initialSelected[group.id] = match.id;
        break;
      }
    }
  }
  const variantOptions = product.variants.map((v) => ({
    id: v.id,
    price: v.price !== null ? Number(v.price) : null,
    compareAtPrice: v.compareAtPrice !== null ? Number(v.compareAtPrice) : null,
    stock: v.stockQuantity,
    image: v.image,
    attributeValueIds: v.attributeValues.map((av) => av.attributeValueId),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/shop" className="hover:text-primary-600">Shop</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-primary-600">
          {product.category.name}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-10">
        <ProductGallery
          images={product.images.map((img) => ({ url: img.url, alt: img.alt }))}
          productName={product.name}
          colorway={product.colorway}
          categorySlug={product.category.slug}
        />

        <div>
          <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700">
            {product.category.name}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3">
            {product.reviews.length > 0 && <StarRating rating={avgRating} count={product.reviews.length} />}
          </div>

          <div
            className="prose prose-sm mt-4 max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary-600"
            dangerouslySetInnerHTML={{ __html: product.fullDescription }}
          />

          <div className="mt-6">
            <ProductPurchasePanel
              productId={product.id}
              basePrice={Number(product.price)}
              baseCompareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : null}
              baseStock={product.stock}
              variantGroups={variantGroups}
              variants={variantOptions}
              initialSelected={initialSelected}
            />
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Customer Reviews {product.reviews.length > 0 && `(${product.reviews.length})`}
        </h2>

        {product.reviews.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No reviews yet for this product.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {initials(review.user.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800">{review.user.name}</span>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-gray-400">
          Purchased this item? You can leave a review from a delivered order in{" "}
          <Link href="/account/orders" className="text-primary-600 hover:underline">
            My Orders
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
