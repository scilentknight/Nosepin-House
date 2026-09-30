// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { prisma } from "@/lib/prisma";

// import { ProductGallery } from "@/components/product/ProductGallery";
// import { StarRating } from "@/components/ui/StarRating";
// import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
// import { ProductDetailTabs } from "@/components/product/ProductDetailTabs";

// import { formatDate } from "@/lib/format";

// interface ProductPageProps {
//   params: Promise<{ slug: string }>;
//   searchParams: Promise<{ color?: string }>;
// }

// function initials(name: string) {
//   return name
//     .split(" ")
//     .map((part) => part[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

// export default async function ProductPage({
//   params,
//   searchParams,
// }: ProductPageProps) {
//   const { slug } = await params;
//   const { color: colorSlug } = await searchParams;

//   // ============================================================
//   // PRODUCT
//   // ============================================================

//   const product = await prisma.product.findFirst({
//     where: {
//       slug,
//       status: "PUBLISHED",
//       deletedAt: null,
//     },

//     include: {
//       category: true,

//       brand: true,

//       images: {
//         orderBy: {
//           sortOrder: "asc",
//         },
//       },

//       reviews: {
//         where: {
//           status: "APPROVED",
//         },

//         include: {
//           user: {
//             select: {
//               name: true,
//             },
//           },
//         },

//         orderBy: {
//           createdAt: "desc",
//         },
//       },

//       materials: {
//         orderBy: {
//           sortOrder: "asc",
//         },

//         include: {
//           material: true,
//           purity: true,
//         },
//       },

//       variants: {
//         where: {
//           status: "ACTIVE",
//           deletedAt: null,
//         },

//         include: {
//           attributeValues: {
//             include: {
//               attributeValue: {
//                 include: {
//                   attribute: true,
//                 },
//               },
//             },
//           },
//         },

//         orderBy: {
//           id: "asc",
//         },
//       },
//     },
//   });

//   if (!product) {
//     notFound();
//   }

//   // ============================================================
//   // RATING
//   // ============================================================

//   const avgRating = product.reviews.length
//     ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
//       product.reviews.length
//     : 0;

//   // ============================================================
//   // VARIANT GROUPS
//   // ============================================================

//   const groupMap = new Map<
//     number,
//     {
//       id: number;
//       name: string;
//       type: "TEXT" | "COLOR";
//       sortOrder: number;

//       values: Map<
//         number,
//         {
//           id: number;
//           value: string;
//           slug: string;
//           colorHex: string | null;
//           sortOrder: number;
//         }
//       >;
//     }
//   >();

//   for (const variant of product.variants) {
//     for (const av of variant.attributeValues) {
//       const attr = av.attributeValue.attribute;

//       if (!groupMap.has(attr.id)) {
//         groupMap.set(attr.id, {
//           id: attr.id,
//           name: attr.name,
//           type: attr.type,
//           sortOrder: attr.sortOrder,
//           values: new Map(),
//         });
//       }

//       const group = groupMap.get(attr.id)!;

//       if (!group.values.has(av.attributeValue.id)) {
//         group.values.set(av.attributeValue.id, {
//           id: av.attributeValue.id,
//           value: av.attributeValue.value,
//           slug: av.attributeValue.slug,
//           colorHex: av.attributeValue.colorHex,
//           sortOrder: av.attributeValue.sortOrder,
//         });
//       }
//     }
//   }

//   const variantGroups = Array.from(groupMap.values())
//     .sort((a, b) => a.sortOrder - b.sortOrder)
//     .map((group) => ({
//       id: group.id,
//       name: group.name,
//       type: group.type,

//       values: Array.from(group.values.values()).sort(
//         (a, b) => a.sortOrder - b.sortOrder,
//       ),
//     }));

//   // ============================================================
//   // INITIAL VARIANT SELECTION
//   // ============================================================

//   const initialSelected: Record<number, number> = {};

//   if (colorSlug) {
//     for (const group of variantGroups) {
//       const match = group.values.find((value) => value.slug === colorSlug);

//       if (match) {
//         initialSelected[group.id] = match.id;
//         break;
//       }
//     }
//   }

//   // ============================================================
//   // VARIANT OPTIONS
//   // ============================================================

//   const variantOptions = product.variants.map((variant) => ({
//     id: variant.id,

//     sku: variant.sku,

//     price: variant.price !== null ? Number(variant.price) : null,

//     compareAtPrice:
//       variant.compareAtPrice !== null ? Number(variant.compareAtPrice) : null,

//     stock: variant.stockQuantity,

//     lowStockAlert: variant.lowStockAlert,

//     weight: variant.weight !== null ? Number(variant.weight) : null,

//     image: variant.image,

//     attributeValueIds: variant.attributeValues.map(
//       (attributeValue) => attributeValue.attributeValueId,
//     ),
//   }));

//   // ============================================================
//   // PRODUCT PRICING
//   // ============================================================

//   const basePrice = Number(product.price);

//   const baseCompareAtPrice =
//     product.compareAtPrice !== null ? Number(product.compareAtPrice) : null;

//   const customerDiscount =
//     product.forCustomer && product.customerDiscountPercent !== null
//       ? Number(product.customerDiscountPercent)
//       : null;

//   const discountedCustomerPrice =
//     customerDiscount !== null
//       ? basePrice - (basePrice * customerDiscount) / 100
//       : null;

//   // ============================================================
//   // STOCK
//   // ============================================================

//   const minimumOrderQuantity = Math.max(1, product.minimumOrderQuantity);

//   const maximumOrderQuantity =
//     product.maximumOrderQuantity !== null ? product.maximumOrderQuantity : null;

//   // ============================================================
//   // PRODUCT GALLERY
//   // ============================================================

//   const galleryImages =
//     product.images.length > 0
//       ? product.images.map((image) => ({
//           url: image.url,
//           alt: image.alt || product.name,
//         }))
//       : product.featuredImage
//         ? [
//             {
//               url: product.featuredImage,
//               alt: product.name,
//             },
//           ]
//         : [];

//   // ============================================================
//   // RENDER
//   // ============================================================

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//       {/* ======================================================
//           BREADCRUMB
//       ====================================================== */}

//       <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
//         <Link href="/shop" className="hover:text-primary-600">
//           Shop
//         </Link>

//         <span className="text-gray-300">/</span>

//         <Link
//           href={`/shop?category=${product.category.slug}`}
//           className="hover:text-primary-600"
//         >
//           {product.category.name}
//         </Link>

//         <span className="text-gray-300">/</span>

//         <span className="text-gray-700">{product.name}</span>
//       </nav>

//       {/* ======================================================
//           MAIN PRODUCT
//       ====================================================== */}

//       <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-10">
//         {/* ====================================================
//             PRODUCT GALLERY
//         ==================================================== */}

//         <ProductGallery
//           images={galleryImages}
//           productName={product.name}
//           colorway={product.colorway}
//           categorySlug={product.category.slug}
//         />

//         {/* ====================================================
//             PRODUCT INFORMATION
//         ==================================================== */}

//         <div className="min-w-0">
//           {/* ==================================================
//               CATEGORY
//           ================================================== */}

//           <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700">
//             {product.category.name}
//           </span>

//           {/* ==================================================
//               PRODUCT NAME
//           ================================================== */}

//           <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
//             {product.name}
//           </h1>

//           {/* ==================================================
//               SKU / BRAND
//           ================================================== */}

//           <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
//             {product.sku && (
//               <span>
//                 SKU:{" "}
//                 <span className="font-medium text-gray-700">{product.sku}</span>
//               </span>
//             )}

//             {product.brand && (
//               <>
//                 <span className="text-gray-300">•</span>

//                 <span>
//                   Brand:{" "}
//                   <span className="font-medium text-gray-700">
//                     {product.brand.name}
//                   </span>
//                 </span>
//               </>
//             )}
//           </div>

//           {/* ==================================================
//               RATING
//           ================================================== */}

//           {product.reviews.length > 0 && (
//             <div className="mt-3 flex items-center gap-3">
//               <StarRating rating={avgRating} count={product.reviews.length} />
//             </div>
//           )}

//           {/* ==================================================
//               SHORT DESCRIPTION

//               Full description is intentionally NOT shown here.
//               Both descriptions are now handled by the tabs.
//           ================================================== */}

//           {/* ==================================================
//               CUSTOMER DISCOUNT
//           ================================================== */}

//           {product.forCustomer &&
//             customerDiscount !== null &&
//             customerDiscount > 0 && (
//               <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
//                 <div className="flex flex-wrap items-center justify-between gap-2">
//                   <div>
//                     <p className="text-sm font-semibold text-green-800">
//                       Customer Discount
//                     </p>

//                     <p className="mt-1 text-xs text-green-700">
//                       {customerDiscount}% off
//                     </p>
//                   </div>

//                   {discountedCustomerPrice !== null && (
//                     <div className="text-right">
//                       <p className="text-lg font-bold text-green-700">
//                         Rs.{" "}
//                         {discountedCustomerPrice.toLocaleString("en-IN", {
//                           maximumFractionDigits: 2,
//                         })}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//           {/* ==================================================
//               PRODUCT PURCHASE PANEL
//           ================================================== */}

//           <div className="mt-6 w-full">
//             <ProductPurchasePanel
//               productId={product.id}
//               basePrice={basePrice}
//               baseCompareAtPrice={baseCompareAtPrice}
//               baseStock={product.stock}
//               minimumOrderQuantity={minimumOrderQuantity}
//               maximumOrderQuantity={maximumOrderQuantity}
//               stockStatus={product.stockStatus}
//               forCustomer={product.forCustomer}
//               customerDiscountPercent={customerDiscount}
//               hasDiscount={product.hasDiscount}
//               discountType={product.discountType}
//               discountValue={
//                 product.discountValue !== null
//                   ? Number(product.discountValue)
//                   : null
//               }
//               variantGroups={variantGroups}
//               variants={variantOptions}
//               initialSelected={initialSelected}
//             />
//           </div>

//           <ProductDetailTabs
//             shortDescription={product.shortDescription}
//             fullDescription={product.fullDescription}
//             weight={product.weight !== null ? Number(product.weight) : null}
//             warranty={product.warranty}
//             colorway={product.colorway}
//             stock={product.stock}
//             stockStatus={product.stockStatus}
//             materials={product.materials.map((item) => ({
//               id: item.id,

//               material: {
//                 name: item.material.name,
//                 code: item.material.code,
//               },

//               purity: {
//                 name: item.purity.name,
//                 code: item.purity.code,
//               },

//               quantity: Number(item.quantity),

//               unit: item.unit,

//               wastagePercent:
//                 item.wastagePercent !== null
//                   ? Number(item.wastagePercent)
//                   : null,
//             }))}
//             labourCharge={Number(product.labourCharge)}
//             makingCharge={Number(product.makingCharge)}
//             otherCharge={Number(product.otherCharge)}
//           />
//         </div>
//       </div>

//       {/* ======================================================
//           REVIEWS
//       ====================================================== */}

//       <section className="mt-16 border-t border-gray-100 pt-10">
//         <h2 className="text-xl font-bold tracking-tight text-gray-900">
//           Customer Reviews{" "}
//           {product.reviews.length > 0 && `(${product.reviews.length})`}
//         </h2>

//         {product.reviews.length === 0 ? (
//           <p className="mt-3 text-sm text-gray-500">
//             No reviews yet for this product.
//           </p>
//         ) : (
//           <div className="mt-5 space-y-4">
//             {product.reviews.map((review) => (
//               <div
//                 key={review.id}
//                 className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft"
//               >
//                 {/* REVIEWER AVATAR */}

//                 <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
//                   {initials(review.user.name)}
//                 </span>

//                 {/* REVIEW CONTENT */}

//                 <div className="min-w-0 flex-1">
//                   <div className="flex flex-wrap items-center justify-between gap-2">
//                     <span className="text-sm font-semibold text-gray-800">
//                       {review.user.name}
//                     </span>

//                     <span className="text-xs text-gray-400">
//                       {formatDate(review.createdAt)}
//                     </span>
//                   </div>

//                   {/* REVIEW RATING */}

//                   <div className="mt-1">
//                     <StarRating rating={review.rating} />
//                   </div>

//                   {/* REVIEW COMMENT */}

//                   {review.comment && (
//                     <p className="mt-2 text-sm text-gray-600">
//                       {review.comment}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* REVIEW INFORMATION */}

//         <p className="mt-4 text-xs text-gray-400">
//           Purchased this item? You can leave a review from a delivered order in{" "}
//           <Link
//             href="/account/orders"
//             className="text-primary-600 hover:underline"
//           >
//             My Orders
//           </Link>
//           .
//         </p>
//       </section>
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { ProductGallery } from "@/components/product/ProductGallery";
import { StarRating } from "@/components/ui/StarRating";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductDetailTabs } from "@/components/product/ProductDetailTabs";

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

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const { color: colorSlug } = await searchParams;

  // ============================================================
  // PRODUCT
  // ============================================================

  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
    },

    include: {
      // featuredImage is a scalar Product field.
      // DO NOT add featuredImage: true here.
      category: true,

      brand: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      reviews: {
        where: {
          status: "APPROVED",
        },

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
    },
  });

  if (!product) {
    notFound();
  }

  // ============================================================
  // RATING
  // ============================================================

  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 0;

  // ============================================================
  // VARIANT GROUPS
  // ============================================================

  const groupMap = new Map<
    number,
    {
      id: number;
      name: string;
      type: "TEXT" | "COLOR";
      sortOrder: number;

      values: Map<
        number,
        {
          id: number;
          value: string;
          slug: string;
          colorHex: string | null;
          sortOrder: number;
        }
      >;
    }
  >();

  for (const variant of product.variants) {
    for (const av of variant.attributeValues) {
      const attr = av.attributeValue.attribute;

      if (!groupMap.has(attr.id)) {
        groupMap.set(attr.id, {
          id: attr.id,
          name: attr.name,
          type: attr.type,
          sortOrder: attr.sortOrder,
          values: new Map(),
        });
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
    .map((group) => ({
      id: group.id,
      name: group.name,
      type: group.type,

      values: Array.from(group.values.values()).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    }));

  // ============================================================
  // INITIAL VARIANT SELECTION
  // ============================================================

  const initialSelected: Record<number, number> = {};

  if (colorSlug) {
    for (const group of variantGroups) {
      const match = group.values.find((value) => value.slug === colorSlug);

      if (match) {
        initialSelected[group.id] = match.id;
        break;
      }
    }
  }

  // ============================================================
  // VARIANT OPTIONS
  // ============================================================

  const variantOptions = product.variants.map((variant) => ({
    id: variant.id,

    sku: variant.sku,

    price: variant.price !== null ? Number(variant.price) : null,

    compareAtPrice:
      variant.compareAtPrice !== null ? Number(variant.compareAtPrice) : null,

    stock: variant.stockQuantity,

    lowStockAlert: variant.lowStockAlert,

    weight: variant.weight !== null ? Number(variant.weight) : null,

    image: variant.image,

    attributeValueIds: variant.attributeValues.map(
      (attributeValue) => attributeValue.attributeValueId,
    ),
  }));

  // ============================================================
  // PRODUCT PRICING
  // ============================================================

  const basePrice = Number(product.price);

  const baseCompareAtPrice =
    product.compareAtPrice !== null ? Number(product.compareAtPrice) : null;

  const customerDiscount =
    product.forCustomer && product.customerDiscountPercent !== null
      ? Number(product.customerDiscountPercent)
      : null;

  const discountedCustomerPrice =
    customerDiscount !== null
      ? basePrice - (basePrice * customerDiscount) / 100
      : null;

  // ============================================================
  // STOCK
  // ============================================================

  const minimumOrderQuantity = Math.max(1, product.minimumOrderQuantity);

  const maximumOrderQuantity =
    product.maximumOrderQuantity !== null ? product.maximumOrderQuantity : null;

  // ============================================================
  // PRODUCT GALLERY
  // ============================================================
  //
  // featuredImage is ALWAYS the first/main image.
  //
  // Then the remaining gallery images are added.
  //
  // If featuredImage also exists inside product.images,
  // it is filtered out to prevent duplicate images.
  // ============================================================

  const galleryImages = [
    ...(product.featuredImage
      ? [
          {
            url: product.featuredImage,
            alt: product.name,
          },
        ]
      : []),

    ...product.images
      .filter((image) => image.url !== product.featuredImage)
      .map((image) => ({
        url: image.url,
        alt: image.alt || product.name,
      })),
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ======================================================
          BREADCRUMB
      ====================================================== */}

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/shop" className="hover:text-primary-600">
          Shop
        </Link>

        <span className="text-gray-300">/</span>

        <Link
          href={`/shop?category=${product.category.slug}`}
          className="hover:text-primary-600"
        >
          {product.category.name}
        </Link>

        <span className="text-gray-300">/</span>

        <span className="text-gray-700">{product.name}</span>
      </nav>

      {/* ======================================================
          MAIN PRODUCT
      ====================================================== */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-10">
        {/* ====================================================
            PRODUCT GALLERY
        ==================================================== */}

        <ProductGallery
          images={galleryImages}
          productName={product.name}
          colorway={product.colorway}
          categorySlug={product.category.slug}
        />

        {/* ====================================================
            PRODUCT INFORMATION
        ==================================================== */}

        <div className="min-w-0">
          {/* ==================================================
              CATEGORY
          ================================================== */}

          <span className="inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700">
            {product.category.name}
          </span>

          {/* ==================================================
              PRODUCT NAME
          ================================================== */}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          {/* ==================================================
              SKU / BRAND
          ================================================== */}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {product.sku && (
              <span>
                SKU:{" "}
                <span className="font-medium text-gray-700">{product.sku}</span>
              </span>
            )}

            {product.brand && (
              <>
                <span className="text-gray-300">•</span>

                <span>
                  Brand:{" "}
                  <span className="font-medium text-gray-700">
                    {product.brand.name}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* ==================================================
              RATING
          ================================================== */}

          {product.reviews.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={avgRating} count={product.reviews.length} />
            </div>
          )}

          {/* ==================================================
              CUSTOMER DISCOUNT
          ================================================== */}

          {product.forCustomer &&
            customerDiscount !== null &&
            customerDiscount > 0 && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Customer Discount
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      {customerDiscount}% off
                    </p>
                  </div>

                  {discountedCustomerPrice !== null && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-700">
                        Rs.{" "}
                        {discountedCustomerPrice.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* ==================================================
              PRODUCT PURCHASE PANEL
          ================================================== */}

          <div className="mt-6 w-full">
            <ProductPurchasePanel
              productId={product.id}
              basePrice={basePrice}
              baseCompareAtPrice={baseCompareAtPrice}
              baseStock={product.stock}
              minimumOrderQuantity={minimumOrderQuantity}
              maximumOrderQuantity={maximumOrderQuantity}
              stockStatus={product.stockStatus}
              forCustomer={product.forCustomer}
              customerDiscountPercent={customerDiscount}
              hasDiscount={product.hasDiscount}
              discountType={product.discountType}
              discountValue={
                product.discountValue !== null
                  ? Number(product.discountValue)
                  : null
              }
              variantGroups={variantGroups}
              variants={variantOptions}
              initialSelected={initialSelected}
            />
          </div>

          {/* ==================================================
              PRODUCT DETAILS
          ================================================== */}

          <ProductDetailTabs
            shortDescription={product.shortDescription}
            fullDescription={product.fullDescription}
            weight={product.weight !== null ? Number(product.weight) : null}
            warranty={product.warranty}
            colorway={product.colorway}
            stock={product.stock}
            stockStatus={product.stockStatus}
            materials={product.materials.map((item) => ({
              id: item.id,

              material: {
                name: item.material.name,
                code: item.material.code,
              },

              purity: {
                name: item.purity.name,
                code: item.purity.code,
              },

              quantity: Number(item.quantity),

              unit: item.unit,

              wastagePercent:
                item.wastagePercent !== null
                  ? Number(item.wastagePercent)
                  : null,
            }))}
            labourCharge={Number(product.labourCharge)}
            makingCharge={Number(product.makingCharge)}
            otherCharge={Number(product.otherCharge)}
          />
        </div>
      </div>

      {/* ======================================================
          REVIEWS
      ====================================================== */}

      <section className="mt-16 border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Customer Reviews{" "}
          {product.reviews.length > 0 && `(${product.reviews.length})`}
        </h2>

        {product.reviews.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No reviews yet for this product.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft"
              >
                {/* REVIEWER AVATAR */}

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {initials(review.user.name)}
                </span>

                {/* REVIEW CONTENT */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {review.user.name}
                    </span>

                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* REVIEW RATING */}

                  <div className="mt-1">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* REVIEW COMMENT */}

                  {review.comment && (
                    <p className="mt-2 text-sm text-gray-600">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEW INFORMATION */}

        <p className="mt-4 text-xs text-gray-400">
          Purchased this item? You can leave a review from a delivered order in{" "}
          <Link
            href="/account/orders"
            className="text-primary-600 hover:underline"
          >
            My Orders
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
