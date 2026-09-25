// import { prisma } from "@/lib/prisma";
// import { ok, handleApiError } from "@/lib/api";

// export async function GET() {
//   try {
//     const categories = await prisma.category.findMany({
//       where: { status: "ACTIVE", deletedAt: null },
//       include: {
//         _count: { select: { products: { where: { status: "PUBLISHED", deletedAt: null } } } },
//       },
//       orderBy: { name: "asc" },
//     });

//     return ok(
//       categories.map((c) => ({
//         id: c.id,
//         name: c.name,
//         slug: c.slug,
//         image: c.image,
//         productCount: c._count.products,
//       }))
//     );
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

    return ok(rootCategories);
  } catch (error) {
    return handleApiError(error);
  }
}
