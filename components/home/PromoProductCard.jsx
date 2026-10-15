"use client";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";

export function PromoProductCard({ product, badge, rank }) {
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  return (
    <Link href={`/product/${product.slug}`} className="flex items-center gap-4">
      <div className="relative shrink-0">
        <ProductImage
          src={product.featuredImage}
          alt={product.name}
          colorway={product.colorway}
          className="w-16"
          sizes="64px"
          rounded={false}
        />
        {rank && (
          <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-[#381c19] text-[10px] font-bold text-white">
            {rank}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {product.brandName && (
            <p className="truncate text-[11px] uppercase tracking-wide text-[#937902]">
              {product.brandName}
            </p>
          )}
          {badge && (
            <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${badge.className ?? "text-[#783f35]"}`}>
              {badge.label}
            </span>
          )}
        </div>
        <p className="line-clamp-2 font-serif text-[15px] text-[#381c19]">{product.name}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-semibold text-[#783f35]">{formatPrice(product.price)}</span>
          {onSale && product.compareAtPrice != null && (
            <span className="text-xs text-[#6f625d] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
