import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import WhyNosepin from "@/components/home/WhyNosepin";
import BestSellers from "@/components/home/BestSellers";
import StatsSection from "@/components/home/StatsSection";
import MarqueeBar from "@/components/home/MarqueeBar";
import { PromoProductColumns } from "@/components/home/PromoProductColumns";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { getCurrentUser } from "@/lib/session";
import { resolveViewerProductPricing } from "@/lib/checkoutCore";
import { computeDiscountedUnitPrice, computeAutoPv } from "@/lib/pricing";
import { GoogleReviews } from "@/components/home/GoogleReviews";
const HERO_BANNER_IMAGE = "/images/hero-banner-img.jpeg";
function mapPromoProduct(p) {
    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        discountPercent: p.discountPercent != null ? Number(p.discountPercent) : null,
        colorway: p.colorway,
        // Fall back to the first gallery image when no featured image is set.
        featuredImage: p.featuredImage ?? p.images[0]?.url ?? null,
        brandName: p.brand?.name ?? null,
    };
}
function mapProductCard(p, viewerPricing) {
    const avgRating = p.reviews.length
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0;
    const price = Number(p.price);
    const distributorPrice = viewerPricing?.discountPercent != null
        ? computeDiscountedUnitPrice(price, viewerPricing.discountPercent)
        : null;
    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price,
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        discountPercent: p.discountPercent != null ? Number(p.discountPercent) : null,
        pricingStrategy: p.pricingStrategy ?? undefined,
        colorway: p.colorway,
        stock: p.stock,
        image: p.featuredImage ?? p.images[0]?.url ?? null,
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
    images: { take: 1 },
    reviews: {
        select: {
            rating: true,
        },
    },
};
async function getHomeData() {
    const [categories, products, banners, newArrivals, onSaleProducts, trendingProducts,] = await Promise.all([
        prisma.category.findMany({
            where: {
                status: "ACTIVE",
                deletedAt: null,
                // Only top-level categories
                parentCategoryId: null,
                // Must have at least one published product
                products: {
                    some: {
                        status: "PUBLISHED",
                        deletedAt: null,
                    },
                },
            },
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
    const viewerPricing = await resolveViewerProductPricing(products.map((p) => ({
        id: p.id,
        hasDiscount: p.hasDiscount,
        forCustomer: p.forCustomer,
        customerDiscountPercent: p.customerDiscountPercent != null
            ? Number(p.customerDiscountPercent)
            : null,
        forDistributor: p.forDistributor,
        hasPointValue: p.hasPointValue,
    })), viewer);
    return {
        categories,
        banners: banners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            image: b.image,
            linkUrl: b.linkUrl,
            buttonText: b.buttonText,
        })),
        products: products.map((p) => mapProductCard(p, viewerPricing.get(p.id))),
        newArrivals: newArrivals.map(mapPromoProduct),
        onSaleProducts: onSaleProducts.map(mapPromoProduct),
        trendingProducts: trendingProducts.map(mapPromoProduct),
    };
}
export default async function HomePage() {
    const { categories, products, banners, newArrivals, onSaleProducts, trendingProducts, } = await getHomeData();
    return (<div className="bg-[#f4eee4]">
      {banners.length > 0 ? (<HeroCarousel slides={banners}/>) : (<section className="relative isolate h-[58vh] min-h-[380px] overflow-hidden sm:h-[68vh] lg:h-[78vh]">
          <Image src={HERO_BANNER_IMAGE} alt="Nosepin House jewellery collection in Nepal" fill priority sizes="100vw" className="object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#24120f]/80 via-[#24120f]/25 to-transparent"/>
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e7d49a]">
              NOSEPIN HOUSE · Kathmandu
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-white sm:text-5xl">
              Jewellery made to be worn
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Nosepins, earrings, sets and gold from the counter — for everyday,
              weddings, and the pieces that stay in the family.
            </p>
            <Link href="/jewellery" className="mt-6 inline-block border border-[#e7d49a] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#e7d49a] hover:text-[#24120f]">
              See the pieces
            </Link>
          </div>
        </section>)}

      <div className="border-b border-[#e8ddd2] bg-[#fbf6ee]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            ["Certified", "SGL diamonds, BIS gold"],
            ["Across Nepal", "COD and doorstep delivery"],
            ["The counter", "01-5331582 for sales"],
            ["Returns", "Handled in the shop"],
          ].map(([label, detail]) => (
            <div key={label} className="px-4 py-4 sm:px-6">
              <p className="font-serif text-[#381c19]">{label}</p>
              <p className="mt-0.5 text-xs text-[#6f625d]">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <CategoryGrid title="Shop by piece" items={categories} hrefFor={(slug) => `/jewellery?category=${slug}`}/>
      <BestSellers products={products}/>
      <MarqueeBar />
      <PromoProductColumns columns={[
            { title: "Just in", products: newArrivals },
            { title: "On offer", products: onSaleProducts },
            { title: "Moving fast", products: trendingProducts },
        ]}/>
      <GoogleReviews />
      <WhyNosepin />
      <StatsSection />
    </div>);
}
