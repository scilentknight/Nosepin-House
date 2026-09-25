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
  colorway: string;
  stock: number;
  image?: string | null;
  rating?: number;
  reviewCount?: number;
  category?: { name: string; slug: string };
}

export function ProductCard({
  product,
  className = "",
  linkQuery,
}: {
  product: ProductCardData;
  className?: string;
  /** Appended to the product link, e.g. "color=red" — used to carry a shop filter into the product page. */
  linkQuery?: string;
}) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={linkQuery ? `/product/${product.slug}?${linkQuery}` : `/product/${product.slug}`}
      className={`group flex flex-col overflow-hidden bg-white transition-colors duration-200 hover:bg-gray-50 ${className}`}
    >
      <div className="relative p-3">
        <ProductImage
          src={product.image}
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
          <span className="absolute right-5 top-5 rounded-full bg-secondary-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Sale
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-5 top-5 rounded-full bg-gray-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
        <WishlistButton productId={product.id} className="absolute bottom-3 right-3" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-5">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
        {typeof product.rating === "number" && product.rating > 0 && (
          <StarRating rating={product.rating} count={product.reviewCount} />
        )}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice as number)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
