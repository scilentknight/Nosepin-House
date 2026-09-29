import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, handleApiError } from "@/lib/api";
import { variantLabel } from "@/lib/checkoutCore";
import { getBaseUrl, absoluteUrl } from "@/lib/media";

function decimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function toProductDTO(
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string | null;

    categoryId: number;
    brandId: number | null;

    shortDescription: string | null;
    fullDescription: string | null;

    costPrice: unknown;
    price: unknown;
    compareAtPrice: unknown;

    discountType: string | null;
    discountValue: unknown;

    hasDiscount: boolean;
    forCustomer: boolean;
    customerDiscountPercent: unknown;
    forDistributor: boolean;
    hasPointValue: boolean;

    taxClass: string | null;

    stock: number;
    lowStockAlert: number | null;
    stockStatus: string;

    minimumOrderQuantity: number;
    maximumOrderQuantity: number | null;

    weight: unknown;
    length: unknown;
    width: unknown;
    height: unknown;

    featuredImage: string | null;

    isFeatured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isOnSale: boolean;
    isTrending: boolean;
    isSpecial: boolean;
    isWeekly: boolean;
    isFlash: boolean;

    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;

    warranty: string | null;
    tags: unknown;
    colorway: string;

    status: string;
    publishedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    labourCharge: unknown;
    makingCharge: unknown;
    otherCharge: unknown;
    markupType: string | null;
    markupValue: unknown;
    pricingUpdatedAt: Date | null;

    category: {
      id: number;
      parentCategoryId: number | null;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      bannerImage: string | null;
      icon: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
      metaKeywords: string | null;
      sortOrder: number;
      isFeatured: boolean;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
    };

    brand: {
      id: number;
      name: string;
      slug: string;
      logo: string | null;
    } | null;

    images: {
      id: number;
      url: string | null;
      alt: string;
      sortOrder: number;
    }[];

    reviews?: {
      rating: number;
    }[];

    materials?: {
      id: string;
      quantity: unknown;
      unit: string;
      wastagePercent: unknown;
      sortOrder: number;

      material: {
        id: string;
        name: string;
        code: string;
        type: string;
        unit: string;
      };

      purity: {
        id: string;
        name: string;
        code: string;
        fineness: unknown;
      };
    }[];
  },
  baseUrl: string,
) {
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 0;

  return {
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
      id: product.category.id,
      parentCategoryId: product.category.parentCategoryId,

      name: product.category.name,
      slug: product.category.slug,

      description: product.category.description,

      image: absoluteUrl(product.category.image, baseUrl),

      bannerImage: absoluteUrl(product.category.bannerImage, baseUrl),

      icon: absoluteUrl(product.category.icon, baseUrl),

      metaTitle: product.category.metaTitle,
      metaDescription: product.category.metaDescription,
      metaKeywords: product.category.metaKeywords,

      sortOrder: product.category.sortOrder,
      isFeatured: product.category.isFeatured,
      status: product.category.status,

      createdAt: product.category.createdAt,
      updatedAt: product.category.updatedAt,
      deletedAt: product.category.deletedAt,
    },

    // =========================================================
    // BRAND
    // =========================================================

    brandId: product.brandId,

    brand: product.brand
      ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,

          logo: absoluteUrl(product.brand.logo, baseUrl),
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

    // =========================================================
    // STATUS
    // =========================================================

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

    materials:
      product.materials?.map((item) => ({
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
      })) ?? [],

    // =========================================================
    // REVIEWS
    // =========================================================

    rating: Math.round(avgRating * 10) / 10,

    reviewCount: product.reviews?.length ?? 0,

    // =========================================================
    // DATES
    // =========================================================

    createdAt: product.createdAt,

    updatedAt: product.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // =========================================================
    // BASE URL
    // =========================================================

    const baseUrl = getBaseUrl(request);

    // =========================================================
    // GET PRODUCTS BY IDS
    // =========================================================

    const ids = searchParams.get("ids");

    if (ids) {
      const idList = ids
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value));

      if (idList.length === 0) {
        return ok([]);
      }

      const products = await prisma.product.findMany({
        where: {
          id: {
            in: idList,
          },

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

            orderBy: {
              id: "asc",
            },
          },

          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      return ok(
        products.map((product) => ({
          ...toProductDTO(product, baseUrl),

          // ===================================================
          // VARIANTS
          // ===================================================

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

            label: variantLabel(variant),

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
        })),
      );
    }

    // =========================================================
    // FILTERS
    // =========================================================

    const search = searchParams.get("search")?.trim();

    const category = searchParams.get("category");

    const brand = searchParams.get("brand");

    const minPrice = searchParams.get("minPrice");

    const maxPrice = searchParams.get("maxPrice");

    const status = searchParams.get("status");

    const sort = searchParams.get("sort") ?? "featured";

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));

    const requestedPageSize = Number(searchParams.get("pageSize") ?? 12);

    const pageSize = Math.min(48, Math.max(1, requestedPageSize));

    // =========================================================
    // WHERE
    // =========================================================

    const where = {
      status: status
        ? (status as "DRAFT" | "PUBLISHED" | "ARCHIVED")
        : ("PUBLISHED" as const),

      deletedAt: null,

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                },
              },

              {
                sku: {
                  contains: search,
                },
              },
            ],
          }
        : {}),

      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),

      ...(brand
        ? {
            brand: {
              slug: brand,
            },
          }
        : {}),

      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice
                ? {
                    gte: Number(minPrice),
                  }
                : {}),

              ...(maxPrice
                ? {
                    lte: Number(maxPrice),
                  }
                : {}),
            },
          }
        : {}),
    };

    // =========================================================
    // SORT
    // =========================================================

    const orderBy =
      sort === "price-asc"
        ? {
            price: "asc" as const,
          }
        : sort === "price-desc"
          ? {
              price: "desc" as const,
            }
          : sort === "newest"
            ? {
                createdAt: "desc" as const,
              }
            : sort === "oldest"
              ? {
                  createdAt: "asc" as const,
                }
              : sort === "name-asc"
                ? {
                    name: "asc" as const,
                  }
                : sort === "name-desc"
                  ? {
                      name: "desc" as const,
                    }
                  : [
                      {
                        isFeatured: "desc" as const,
                      },

                      {
                        createdAt: "desc" as const,
                      },
                    ];

    // =========================================================
    // FETCH
    // =========================================================

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: {
          category: true,

          brand: true,

          images: {
            orderBy: {
              sortOrder: "asc",
            },

            take: 10,
          },

          reviews: {
            select: {
              rating: true,
            },
          },
        },

        orderBy,

        skip: (page - 1) * pageSize,

        take: pageSize,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,

      message: "Products retrieved successfully",

      data: products.map((product) => toProductDTO(product, baseUrl)),

      pagination: {
        page,

        pageSize,

        total,

        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
