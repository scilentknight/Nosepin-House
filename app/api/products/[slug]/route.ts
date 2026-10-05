import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleApiError } from "@/lib/api";

function decimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        deletedAt: null,
      },

      include: {
        category: true,

        brand: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        materials: {
          orderBy: {
            sortOrder: "asc",
          },

          include: {
            material: true,
            purity: true,
            stoneMaterial: true,
          },
        },

        variants: {
          where: {
            status: "ACTIVE",
            deletedAt: null,
          },

          include: {
            attributeValues: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },

        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return fail(404, "Product not found");
    }

    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

    return ok({
      // =========================================================
      // BASIC INFORMATION
      // =========================================================

      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,

      // =========================================================
      // CATEGORY
      // =========================================================

      categoryId: product.categoryId,

      category: {
        ...product.category,

        // Relative paths
        image: product.category.image,

        bannerImage: product.category.bannerImage,

        icon: product.category.icon,
      },

      // =========================================================
      // BRAND
      // =========================================================

      brandId: product.brandId,

      brand: product.brand
        ? {
            ...product.brand,

            // Relative path
            logo: product.brand.logo,
          }
        : null,

      // =========================================================
      // DESCRIPTION
      // =========================================================

      shortDescription: product.shortDescription,

      fullDescription: product.fullDescription,

      // =========================================================
      // PRICING
      // =========================================================

      costPrice: decimalToNumber(product.costPrice),

      price: Number(product.price),

      compareAtPrice: decimalToNumber(product.compareAtPrice),

      discountType: product.discountType,

      discountValue: decimalToNumber(product.discountValue),

      hasDiscount: product.hasDiscount,

      forCustomer: product.forCustomer,

      customerDiscountPercent: decimalToNumber(product.customerDiscountPercent),

      forDistributor: product.forDistributor,

      hasPointValue: product.hasPointValue,

      taxClass: product.taxClass,

      // =========================================================
      // STOCK
      // =========================================================

      stock: product.stock,

      lowStockAlert: product.lowStockAlert,

      stockStatus: product.stockStatus,

      minimumOrderQuantity: product.minimumOrderQuantity,

      maximumOrderQuantity: product.maximumOrderQuantity,

      // =========================================================
      // DIMENSIONS
      // =========================================================

      weight: decimalToNumber(product.weight),

      length: decimalToNumber(product.length),

      width: decimalToNumber(product.width),

      height: decimalToNumber(product.height),

      // =========================================================
      // IMAGES
      // =========================================================

      // Relative path
      featuredImage: product.featuredImage,

      // First product image, otherwise featured image
      image: product.images[0]?.url ?? product.featuredImage,

      images: product.images.map((image) => ({
        id: image.id,

        // Relative path
        url: image.url,

        alt: image.alt,

        sortOrder: image.sortOrder,
      })),

      // =========================================================
      // PRODUCT FLAGS
      // =========================================================

      isFeatured: product.isFeatured,

      isBestSeller: product.isBestSeller,

      isNewArrival: product.isNewArrival,

      isOnSale: product.isOnSale,

      isTrending: product.isTrending,

      isSpecial: product.isSpecial,

      isWeekly: product.isWeekly,

      isFlash: product.isFlash,

      // =========================================================
      // SEO
      // =========================================================

      metaTitle: product.metaTitle,

      metaDescription: product.metaDescription,

      metaKeywords: product.metaKeywords,

      // =========================================================
      // ADDITIONAL INFORMATION
      // =========================================================

      warranty: product.warranty,

      tags: product.tags,

      colorway: product.colorway,

      status: product.status,

      publishedAt: product.publishedAt,

      // =========================================================
      // JEWELLERY PRICING
      // =========================================================

      labourCharge: Number(product.labourCharge),

      makingCharge: Number(product.makingCharge),

      otherCharge: Number(product.otherCharge),

      markupType: product.markupType,

      markupValue: decimalToNumber(product.markupValue),

      pricingUpdatedAt: product.pricingUpdatedAt,

      // =========================================================
      // MATERIALS
      // =========================================================

      materials: product.materials.map((item) => ({
        id: item.id,

        material: {
          id: item.material.id,
          name: item.material.name,
          code: item.material.code,
          type: item.material.type,
          unit: item.material.unit,
        },

        purity: item.purity
          ? {
              id: item.purity.id,
              name: item.purity.name,
              code: item.purity.code,
              fineness: decimalToNumber(item.purity.fineness),
            }
          : null,

        stoneMaterial: (item as any).stoneMaterial
          ? {
              id: (item as any).stoneMaterial.id,
              name: (item as any).stoneMaterial.name,
              code: (item as any).stoneMaterial.code,
              type: (item as any).stoneMaterial.type,
              unit: (item as any).stoneMaterial.unit,
            }
          : null,

        grossWeight: decimalToNumber(item.grossWeight),
        stoneWeight: decimalToNumber(item.stoneWeight),
        netWeight: decimalToNumber(item.netWeight),

        quantity: Number(item.quantity),

        unit: item.unit,

        wastagePercent: decimalToNumber(item.wastagePercent),

        sortOrder: item.sortOrder,
      })),

      // =========================================================
      // VARIANTS
      // =========================================================

      variants: product.variants.map((variant) => ({
        id: variant.id,

        sku: variant.sku,

        price: variant.price !== null ? Number(variant.price) : null,

        compareAtPrice:
          variant.compareAtPrice !== null
            ? Number(variant.compareAtPrice)
            : null,

        costPrice:
          variant.costPrice !== null ? Number(variant.costPrice) : null,

        stock: variant.stockQuantity,

        lowStockAlert: variant.lowStockAlert,

        weight: variant.weight !== null ? Number(variant.weight) : null,

        // Relative path
        image: variant.image,

        status: variant.status,

        attributes: variant.attributeValues.map((attributeValue) => ({
          id: attributeValue.attributeValue.id,

          value: attributeValue.attributeValue.value,

          slug: attributeValue.attributeValue.slug,

          colorHex: attributeValue.attributeValue.colorHex,

          attribute: {
            id: attributeValue.attributeValue.attribute.id,

            name: attributeValue.attributeValue.attribute.name,

            slug: attributeValue.attributeValue.attribute.slug,

            type: attributeValue.attributeValue.attribute.type,
          },
        })),
      })),

      // =========================================================
      // REVIEWS
      // =========================================================

      rating: Math.round(avgRating * 10) / 10,

      reviewCount: product.reviews.length,

      reviews: product.reviews.map((review) => ({
        id: review.id,

        rating: review.rating,

        comment: review.comment,

        userName: review.user.name,

        createdAt: review.createdAt,
      })),

      // =========================================================
      // DATES
      // =========================================================

      createdAt: product.createdAt,

      updatedAt: product.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
