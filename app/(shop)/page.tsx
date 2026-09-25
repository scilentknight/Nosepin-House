import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import WhyNosepin from "@/components/home/WhyNosepin";
import BestSellers from "@/components/home/BestSellers";
import StatsSection from "@/components/home/StatsSection";
import MarqueeBar from "@/components/home/MarqueeBar";

import { PromoProductColumns } from "@/components/home/PromoProductColumns";
import { CategoryBrandGrid } from "@/components/home/CategoryBrandGrid";
import { getCurrentUser } from "@/lib/session";
import { resolveViewerProductPricing } from "@/lib/checkoutCore";
import { computeDiscountedUnitPrice, computeAutoPv } from "@/lib/pricing";
import {
  Award,
  CreditCard,
  Truck,
  RefreshCcw,
  ArrowLeftRight,
  Diamond,
} from "lucide-react";

const HERO_BANNER_IMAGE = "/images/hero-banner-img.jpeg";

function mapPromoProduct(p: {
  id: number;
  name: string;
  slug: string;
  price: unknown;
  compareAtPrice: unknown;
  colorway: string;
  images: { url: string | null }[];
  brand: { name: string } | null;
}) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    colorway: p.colorway,
    image: p.images[0]?.url ?? null,
    brandName: p.brand?.name ?? null,
  };
}

function mapProductCard(
  p: {
    id: number;
    name: string;
    slug: string;
    price: unknown;
    compareAtPrice: unknown;
    colorway: string;
    stock: number;
    images: { url: string | null }[];
    category: { name: string; slug: string } | null;
    reviews: { rating: number }[];
  },
  viewerPricing?: { discountPercent: number | null; pvEligible: boolean },
) {
  const avgRating = p.reviews.length
    ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
    : 0;
  const price = Number(p.price);
  const distributorPrice =
    viewerPricing?.discountPercent != null
      ? computeDiscountedUnitPrice(price, viewerPricing.discountPercent)
      : null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price,
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    colorway: p.colorway,
    stock: p.stock,
    image: p.images[0]?.url ?? null,
    category: p.category ?? undefined,
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: p.reviews.length,
    distributorPrice,
    // PV is 0.2% of the distributor's own discounted price (falls back to list price if no discount applies).
    distributorPv: viewerPricing?.pvEligible
      ? computeAutoPv(distributorPrice ?? price)
      : 0,
  };
}

const CARD_INCLUDE = {
  category: true,
  images: { take: 1 as const },
  reviews: { select: { rating: true as const } },
};

async function getHomeData() {
  const [
    categories,
    brands,
    products,
    banners,
    specialProducts,
    weeklyProducts,
    flashProducts,
    newArrivals,
    onSaleProducts,
    trendingProducts,
  ] = await Promise.all([
    prisma.category.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.brand.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: CARD_INCLUDE,
    }),
    prisma.homeBannerSlide.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null, isSpecial: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, brand: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null, isWeekly: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, brand: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null, isFlash: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, brand: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null, isNewArrival: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, brand: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null, isOnSale: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, brand: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", deletedAt: null, isTrending: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, brand: { select: { name: true } } },
    }),
  ]);

  const viewer = await getCurrentUser();
  const viewerPricing = await resolveViewerProductPricing(
    products.map((p) => ({
      id: p.id,
      hasDiscount: p.hasDiscount,
      forCustomer: p.forCustomer,
      customerDiscountPercent:
        p.customerDiscountPercent != null
          ? Number(p.customerDiscountPercent)
          : null,
      forDistributor: p.forDistributor,
      hasPointValue: p.hasPointValue,
    })),
    viewer,
  );

  return {
    categories,
    brands,
    banners: banners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      linkUrl: b.linkUrl,
      buttonText: b.buttonText,
    })),
    products: products.map((p) => mapProductCard(p, viewerPricing.get(p.id))),
    specialProducts: specialProducts.map(mapPromoProduct),
    weeklyProducts: weeklyProducts.map(mapPromoProduct),
    flashProducts: flashProducts.map(mapPromoProduct),
    newArrivals: newArrivals.map(mapPromoProduct),
    onSaleProducts: onSaleProducts.map(mapPromoProduct),
    trendingProducts: trendingProducts.map(mapPromoProduct),
  };
}

export default async function HomePage() {
  const {
    categories,
    brands,
    products,
    banners,
    specialProducts,
    weeklyProducts,
    flashProducts,
    newArrivals,
    onSaleProducts,
    trendingProducts,
  } = await getHomeData();

  return (
    <div>
      {banners.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <HeroCarousel slides={banners} />
        </div>
      ) : (
        <section className="relative isolate overflow-hidden">
          <Image
            src={HERO_BANNER_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-primary-900/30" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-36 lg:px-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Wellness, Naturally
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Live Well with <span className="text-secondary-300">DXN</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-lg text-primary-50 lg:mx-0">
                Ganoderma-infused coffee, spirulina supplements, and personal
                care — delivered to your door with Cash on Delivery available.
              </p>
              <div className="mt-8 flex justify-center gap-3 lg:justify-start">
                <Link
                  href="/jewellery"
                  className="rounded-full bg-secondary-500 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-secondary-600 hover:shadow-soft-lg"
                >
                  Shop Now
                </Link>
                <Link
                  href="/jewellery"
                  className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore Jewellery
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <CategoryBrandGrid
        title="Jewellery Categories"
        items={categories}
        hrefFor={(slug) => `/jewellery?category=${slug}`}
      />

      <BestSellers products={products} />

      <MarqueeBar />

      {/* <PromoProductColumns
        columns={[
          { title: "Special Products", products: specialProducts },
          { title: "Weekly Products", products: weeklyProducts },
          { title: "Flash Products", products: flashProducts },
        ]}
      /> */}

      <PromoProductColumns
        columns={[
          { title: "New Arrivals", products: newArrivals },
          { title: "On Sale", products: onSaleProducts },
          { title: "Trending Now", products: trendingProducts },
        ]}
      />
      <WhyNosepin />
        
      <StatsSection />
    </div>
  );
}
