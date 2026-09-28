"use client";

import { useEffect, useMemo, useState } from "react";
import { ParentCategoryTreeSelect } from "@/components/admin/categories/ParentCategoryTreeSelect";

export interface CategoryFormValues {
  id?: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  description: string;
  image: File | null;
  bannerImage: File | null;
  icon: File | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  sortOrder: number;
  isFeatured: boolean;
  status: string;
}

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}

interface ParentOption {
  id: string;
  name: string;
  parentCategoryId: string | null;
  children?: ParentOption[];
}

/**
 * Converts a flat category list into a nested tree.
 *
 * Example input:
 *
 * Gold Jewellery
 * Rings -> parent = Gold Jewellery
 * Diamond Rings -> parent = Rings
 * Necklaces -> parent = Gold Jewellery
 *
 * Output:
 *
 * Gold Jewellery
 *   └── Rings
 *       └── Diamond Rings
 *   └── Necklaces
 */
function buildCategoryTree(categories: ParentOption[]): ParentOption[] {
  const categoryMap = new Map<string, ParentOption>();

  // First create a clean copy of every category.
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  const tree: ParentOption[] = [];

  categoryMap.forEach((category) => {
    if (
      category.parentCategoryId &&
      categoryMap.has(category.parentCategoryId)
    ) {
      const parent = categoryMap.get(category.parentCategoryId);

      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(category);
      }
    } else {
      // No parent = top-level category
      tree.push(category);
    }
  });

  return tree;
}

/**
 * Returns true if the supplied category already contains children.
 *
 * This function supports both:
 *
 * 1. Nested category response
 * 2. Flat category response
 */
function hasNestedChildren(categories: ParentOption[]): boolean {
  return categories.some(
    (category) => Array.isArray(category.children) && category.children.length,
  );
}

/**
 * Finds a category by ID inside a nested category tree.
 */
function findCategory(
  categories: ParentOption[],
  id: string,
): ParentOption | null {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }

    if (category.children?.length) {
      const found = findCategory(category.children, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Collects every descendant ID of a category.
 *
 * Example:
 *
 * Gold Jewellery
 *   └── Rings
 *       └── Diamond Rings
 *
 * descendantIds(Gold Jewellery)
 *
 * returns:
 *   Rings
 *   Diamond Rings
 */
function descendantIds(
  categories: ParentOption[],
  rootId: string,
): Set<string> {
  const result = new Set<string>();

  const root = findCategory(categories, rootId);

  if (!root) {
    return result;
  }

  function collectChildren(children: ParentOption[]) {
    for (const child of children) {
      result.add(child.id);

      if (child.children?.length) {
        collectChildren(child.children);
      }
    }
  }

  collectChildren(root.children ?? []);

  return result;
}

/**
 * Renders categories recursively inside a <select>.
 *
 * Example:
 *
 * Gold Jewellery
 * — Rings
 * — — Diamond Rings
 * — — Gold Rings
 * — Necklaces
 * — — Diamond Necklaces
 * Silver Jewellery
 * — Rings
 * — — Silver Rings
 */
function renderParentOptions(
  categories: ParentOption[],
  excluded: Set<string>,
  level = 0,
): React.ReactNode[] {
  const options: React.ReactNode[] = [];

  categories.forEach((category) => {
    // Do not display the current category or its descendants
    // when editing a category.
    if (excluded.has(category.id)) {
      return;
    }

    const prefix = level > 0 ? `${"— ".repeat(level)}` : "";

    options.push(
      <option key={category.id} value={category.id}>
        {prefix}
        {category.name}
      </option>,
    );

    if (category.children?.length) {
      options.push(
        ...renderParentOptions(category.children, excluded, level + 1),
      );
    }
  });

  return options;
}

export const EMPTY_CATEGORY: CategoryFormValues = {
  name: "",
  slug: "",
  parentCategoryId: null,
  description: "",
  image: null,
  bannerImage: null,
  icon: null,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  sortOrder: 0,
  isFeatured: false,
  status: "active",
};

export function CategoryForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting = false,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    ...EMPTY_CATEGORY,
    ...initialValues,
  });

  const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /**
   * Update a single form field.
   */
  function set<K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /**
   * Fetch categories for the parent dropdown.
   *
   * We request tree=true, but this also handles a flat API response
   * in case the backend returns:
   *
   * {
   *   data: {
   *     categories: [...]
   *   }
   * }
   */
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const response = await fetch("/api/admin/categories?tree=true", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load categories: ${response.status}`);
        }

        const json = await response.json();

        const categories: ParentOption[] =
          json?.data?.categories ?? json?.categories ?? json?.data ?? [];

        if (cancelled) {
          return;
        }

        /**
         * If the API already returns nested children,
         * use them directly.
         *
         * If it returns a flat list, build the tree here.
         */
        const tree = hasNestedChildren(categories)
          ? categories
          : buildCategoryTree(categories);

        setParentOptions(tree);
      } catch (error) {
        console.error("Failed to load parent categories:", error);

        if (!cancelled) {
          setParentOptions([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Categories that cannot be selected as the parent.
   *
   * When creating:
   *   nothing is excluded.
   *
   * When editing:
   *   current category is excluded.
   *   all descendants are excluded.
   */
  const excluded = useMemo(() => {
    const result = new Set<string>();

    if (!values.id) {
      return result;
    }

    // The category cannot be its own parent.
    result.add(values.id);

    // Descendants cannot become parents either.
    const descendants = descendantIds(parentOptions, values.id);

    descendants.forEach((id) => {
      result.add(id);
    });

    return result;
  }, [parentOptions, values.id]);

  /**
   * Handle form submit.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Category Name */}
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Enter category name"
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="category-slug"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Slug
            </label>

            <input
              id="category-slug"
              type="text"
              value={values.slug}
              onChange={(event) => set("slug", event.target.value)}
              placeholder="category-slug"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label
              htmlFor="parent-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Parent Category
            </label>

            <ParentCategoryTreeSelect
              categories={parentOptions}
              value={values.parentCategoryId ?? ""}
              onChange={(value) => set("parentCategoryId", value || null)}
              loading={loadingCategories}
              excluded={excluded}
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Select a parent category to create a subcategory.
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label
              htmlFor="sort-order"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Sort Order
            </label>

            <input
              id="sort-order"
              type="number"
              value={values.sortOrder}
              onChange={(event) => set("sortOrder", Number(event.target.value))}
              min={0}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <label
            htmlFor="category-description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="category-description"
            value={values.description}
            onChange={(event) => set("description", event.target.value)}
            placeholder="Enter category description"
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Images</h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Category Image */}
          <div>
            <label
              htmlFor="category-image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category Image
            </label>

            <input
              id="category-image"
              type="file"
              accept="image/*"
              onChange={(event) =>
                set("image", event.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm"
            />
          </div>

          {/* Banner Image */}
          <div>
            <label
              htmlFor="category-banner"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Banner Image
            </label>

            <input
              id="category-banner"
              type="file"
              accept="image/*"
              onChange={(event) =>
                set("bannerImage", event.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm"
            />
          </div>

          {/* Icon */}
          <div>
            <label
              htmlFor="category-icon"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Icon
            </label>

            <input
              id="category-icon"
              type="file"
              accept="image/*,.svg"
              onChange={(event) => set("icon", event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">SEO</h2>

        <div className="space-y-5">
          {/* Meta Title */}
          <div>
            <label
              htmlFor="meta-title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Meta Title
            </label>

            <input
              id="meta-title"
              type="text"
              value={values.metaTitle}
              onChange={(event) => set("metaTitle", event.target.value)}
              placeholder="Enter meta title"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label
              htmlFor="meta-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Meta Description
            </label>

            <textarea
              id="meta-description"
              value={values.metaDescription}
              onChange={(event) => set("metaDescription", event.target.value)}
              placeholder="Enter meta description"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label
              htmlFor="meta-keywords"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Meta Keywords
            </label>

            <input
              id="meta-keywords"
              type="text"
              value={values.metaKeywords}
              onChange={(event) => set("metaKeywords", event.target.value)}
              placeholder="gold jewellery, gold rings, jewellery"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Status</h2>

        <div className="space-y-4">
          {/* Featured */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(event) => set("isFeatured", event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
            />

            <span className="text-sm text-gray-700">Featured category</span>
          </label>

          {/* Status */}
          <div>
            <label
              htmlFor="category-status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="category-status"
              value={values.status}
              onChange={(event) => set("status", event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 md:max-w-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : values.id
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}
