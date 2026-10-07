// import { prisma } from "@/lib/prisma";
// import { ok, handleApiError } from "@/lib/api";

// type CategoryNode = {
//   id: number;
//   name: string;
//   slug: string;
//   image: string | null;
//   productCount: number;
//   parentCategoryId: number | null;
//   children: CategoryNode[];
// };

// export async function GET() {
//   try {
//     const categories = await prisma.category.findMany({
//       where: {
//         status: "ACTIVE",
//         deletedAt: null,
//       },
//       include: {
//         _count: {
//           select: {
//             products: {
//               where: {
//                 status: "PUBLISHED",
//                 deletedAt: null,
//               },
//             },
//           },
//         },
//       },
//       orderBy: [
//         {
//           sortOrder: "asc",
//         },
//         {
//           name: "asc",
//         },
//       ],
//     });

//     // Create a map of all categories
//     const categoryMap = new Map<number, CategoryNode>();

//     for (const category of categories) {
//       categoryMap.set(category.id, {
//         id: category.id,
//         name: category.name,
//         slug: category.slug,
//         image: category.image,
//         productCount: category._count.products,
//         parentCategoryId: category.parentCategoryId,
//         children: [],
//       });
//     }

//     // Build category tree
//     const rootCategories: CategoryNode[] = [];

//     for (const category of categories) {
//       const currentCategory = categoryMap.get(category.id);

//       if (!currentCategory) continue;

//       // No parent = root category
//       if (category.parentCategoryId === null) {
//         rootCategories.push(currentCategory);
//         continue;
//       }

//       // Has parent = child category
//       const parentCategory = categoryMap.get(category.parentCategoryId);

//       if (parentCategory) {
//         parentCategory.children.push(currentCategory);
//       }
//     }

//     return ok(rootCategories);
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

import { prisma } from "@/lib/prisma";
import { ok, handleApiError } from "@/lib/api";

type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
  parentCategoryId: number | null;
  children: CategoryNode[];
};

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                status: "PUBLISHED",
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    // Create a map of all categories
    const categoryMap = new Map<number, CategoryNode>();

    for (const category of categories) {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
        productCount: category._count.products,
        parentCategoryId: category.parentCategoryId,
        children: [],
      });
    }

    // Build category tree
    const rootCategories: CategoryNode[] = [];

    for (const category of categories) {
      const currentCategory = categoryMap.get(category.id);

      if (!currentCategory) continue;

      // No parent = root category
      if (category.parentCategoryId === null) {
        rootCategories.push(currentCategory);
        continue;
      }

      // Has parent = child category
      const parentCategory = categoryMap.get(category.parentCategoryId);

      if (parentCategory) {
        parentCategory.children.push(currentCategory);
      }
    }

    /*
     * Remove categories that have:
     * 1. No published products themselves
     * 2. No children containing published products
     *
     * A parent category will remain if at least one
     * child category contains a published product.
     */
    function filterCategories(items: CategoryNode[]): CategoryNode[] {
      return items
        .map((category) => {
          const filteredChildren = filterCategories(category.children);

          return {
            ...category,
            children: filteredChildren,
          };
        })
        .filter((category) => {
          const hasProducts = category.productCount > 0;
          const hasProductChildren = category.children.length > 0;

          return hasProducts || hasProductChildren;
        });
    }

    const filteredCategories = filterCategories(rootCategories);

    return ok(filteredCategories);
  } catch (error) {
    return handleApiError(error);
  }
}
