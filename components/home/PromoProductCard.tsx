import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";

export interface PromoProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  colorway: string;
  image: string | null;
  brandName: string | null;
}

export interface PromoProductBadge {
  label: string;
  className?: string;
}

interface PromoProductCardProps {
  product: PromoProduct;
  /** Small pill shown next to the brand name (e.g. "New", "-20%"). */
  badge?: PromoProductBadge;
  /** Numbered ranking chip overlaid on the thumbnail (e.g. Trending #1-4). */
  rank?: number;
}

export function PromoProductCard({ product, badge, rank }: PromoProductCardProps) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex min-h-[104px] items-center gap-3 border border-gray-200 bg-white p-3 shadow-soft transition-shadow hover:shadow-soft-lg"
    >
      <div className="relative shrink-0">
        <ProductImage src={product.image} alt={product.name} colorway={product.colorway} className="w-14" sizes="56px" rounded={false} />
        {rank && (
          <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white shadow-sm">
            {rank}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {product.brandName && (
            <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-400">{product.brandName}</p>
          )}
          {badge && (
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                badge.className ?? "bg-secondary-500 text-white"
              }`}
            >
              {badge.label}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-sm font-bold text-primary-700">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice as number)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
