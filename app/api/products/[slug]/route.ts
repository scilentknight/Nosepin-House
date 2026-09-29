import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleApiError } from "@/lib/api";
import { getBaseUrl, absoluteUrl } from "@/lib/media";

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

    const baseUrl = getBaseUrl(request);

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
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,

      categoryId: product.categoryId,

      category: {
        ...product.category,
        image: absoluteUrl(product.category.image, baseUrl),
        bannerImage: absoluteUrl(product.category.bannerImage, baseUrl),
        icon: absoluteUrl(product.category.icon, baseUrl),
      },

      brandId: product.brandId,

      brand: product.brand
        ? {
            ...product.brand,
            logo: absoluteUrl(product.brand.logo, baseUrl),
          }
        : null,

      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,

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

      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      stockStatus: product.stockStatus,

      minimumOrderQuantity: product.minimumOrderQuantity,

      maximumOrderQuantity: product.maximumOrderQuantity,

      weight: decimalToNumber(product.weight),
      length: decimalToNumber(product.length),
      width: decimalToNumber(product.width),
      height: decimalToNumber(product.height),

      featuredImage: absoluteUrl(product.featuredImage, baseUrl),

      image: absoluteUrl(
        product.images[0]?.url ?? product.featuredImage,
        baseUrl,
      ),

      images: product.images.map((image) => ({
        id: image.id,
        url: absoluteUrl(image.url, baseUrl),
        alt: image.alt,
        sortOrder: image.sortOrder,
      })),

      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      isOnSale: product.isOnSale,
      isTrending: product.isTrending,
      isSpecial: product.isSpecial,
      isWeekly: product.isWeekly,
      isFlash: product.isFlash,

      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      metaKeywords: product.metaKeywords,

      warranty: product.warranty,
      tags: product.tags,
      colorway: product.colorway,
      status: product.status,
      publishedAt: product.publishedAt,

      labourCharge: Number(product.labourCharge),
      makingCharge: Number(product.makingCharge),
      otherCharge: Number(product.otherCharge),

      markupType: product.markupType,

      markupValue: decimalToNumber(product.markupValue),

      pricingUpdatedAt: product.pricingUpdatedAt,

      materials: product.materials.map((item) => ({
        id: item.id,

        material: {
          id: item.material.id,
          name: item.material.name,
          code: item.material.code,
          type: item.material.type,
          unit: item.material.unit,
        },

        purity: {
          id: item.purity.id,
          name: item.purity.name,
          code: item.purity.code,
          fineness: decimalToNumber(item.purity.fineness),
        },

        quantity: Number(item.quantity),
        unit: item.unit,

        wastagePercent: decimalToNumber(item.wastagePercent),

        sortOrder: item.sortOrder,
      })),

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

        image: absoluteUrl(variant.image, baseUrl),

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

      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,

      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: review.user.name,
        createdAt: review.createdAt,
      })),

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
