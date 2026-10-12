import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { StarRating } from "@/components/ui/StarRating";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatPrice } from "@/lib/format";

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  pricingStrategy?: string;

  // Product's main/featured image
  featuredImage?: string | null;

  // Existing image property
  image?: string | null;

  colorway: string;
  stock: number;

  rating?: number;
  reviewCount?: number;

  category?: {
    name: string;
    slug: string;
  };

  distributorPrice?: number | null;
  distributorPv?: number;
}

export function ProductCard({
  product,
  className = "",
  linkQuery,
}: {
  product: ProductCardData;
  className?: string;
  linkQuery?: string;
}) {
  const onSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;

  const discountPercentage =
    product.discountPercent ??
    (onSale && product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null);

  /*
   * IMPORTANT:
   * featuredImage always has priority.
   *
   * If featuredImage exists:
   *     use featuredImage
   *
   * Otherwise:
   *     use image
   */
  const productImage = product.featuredImage ?? product.image ?? null;

  return (
    <Link
      href={
        linkQuery
          ? `/product/${product.slug}?${linkQuery}`
          : `/product/${product.slug}`
      }
      className={`group flex flex-col overflow-hidden bg-white transition-colors duration-200 hover:bg-gray-50 ${className}`}
    >
      <div className="relative p-3">
        <ProductImage
          src={productImage}
          alt={product.name}
          colorway={product.colorway}
          categorySlug={product.category?.slug}
          rounded={false}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {product.category && (
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-700 shadow-sm backdrop-blur">
            {product.category.name}
          </span>
        )}

        {onSale && (
          <span className="absolute right-5 top-5 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {discountPercentage ? `${discountPercentage}% OFF` : "Sale"}
          </span>
        )}

        {product.stock === 0 && (
          <span className="absolute right-5 top-5 rounded-full bg-gray-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}

        <WishlistButton
          productId={product.id}
          className="absolute bottom-3 right-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-5">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.name}
        </h3>

        {typeof product.rating === "number" && product.rating > 0 && (
          <StarRating rating={product.rating} count={product.reviewCount} />
        )}

        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-bold text-primary-700">
            {formatPrice(product.price)}
          </span>

          {onSale && (
            <>
              <span className="text-xs text-gray-400 line-through font-normal">
                {formatPrice(product.compareAtPrice as number)}
              </span>
              {discountPercentage && (
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                  {discountPercentage}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
