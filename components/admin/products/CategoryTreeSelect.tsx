"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

export interface CategoryTreeItem {
  id: string;
  name: string;
  parentCategoryId: string | null;
  children?: CategoryTreeItem[];
}

interface CategoryTreeSelectProps {
  categories: CategoryTreeItem[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  required?: boolean;
}

export function CategoryTreeSelect({
  categories,
  value,
  onChange,
  loading = false,
  required = false,
}: CategoryTreeSelectProps) {
  const [open, setOpen] = useState(false);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Expand all categories initially.
   */
  useEffect(() => {
    const ids = new Set<string>();

    function collect(items: CategoryTreeItem[]) {
      items.forEach((item) => {
        if (item.children?.length) {
          ids.add(item.id);
          collect(item.children);
        }
      });
    }

    collect(categories);

    setExpandedIds(new Set());
  }, [categories]);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Find selected category.
   */
  function findCategory(
    items: CategoryTreeItem[],
    id: string,
  ): CategoryTreeItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      if (item.children?.length) {
        const found = findCategory(item.children, id);

        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  const selectedCategory = findCategory(categories, value);

  /*
   * Toggle parent category.
   */
  function toggleExpanded(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  /*
   * Render recursive category tree.
   */
  function renderTree(items: CategoryTreeItem[], level = 0): React.ReactNode {
    return items.map((category) => {
      const hasChildren = !!category.children?.length;

      const isExpanded = expandedIds.has(category.id);

      const isSelected = value === category.id;

      return (
        <div key={category.id}>
          <div
            className={`flex items-center ${
              isSelected ? "bg-slate-100" : "hover:bg-gray-50"
            }`}
          >
            {/* Expand / collapse button */}
            <button
              type="button"
              onClick={() => hasChildren && toggleExpanded(category.id)}
              disabled={!hasChildren}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 ${
                hasChildren ? "hover:bg-gray-200" : "cursor-default"
              }`}
              aria-label={
                hasChildren
                  ? isExpanded
                    ? `Collapse ${category.name}`
                    : `Expand ${category.name}`
                  : undefined
              }
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )
              ) : (
                <span className="w-4" />
              )}
            </button>

            {/* Category */}
            <button
              type="button"
              onClick={() => {
                onChange(category.id);
                setOpen(false);
              }}
              className={`flex min-w-0 flex-1 items-center gap-2 py-2 pr-3 text-left text-sm ${
                isSelected ? "font-semibold text-slate-900" : "text-gray-700"
              }`}
              style={{
                paddingLeft: `${level * 20}px`,
              }}
            >
              {/* Tree connector */}
              {level > 0 && <span className="text-gray-300">└</span>}

              <span className="truncate">{category.name}</span>

              {isSelected && (
                <Check size={16} className="ml-auto shrink-0 text-slate-700" />
              )}
            </button>
          </div>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div>{renderTree(category.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Selected value */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={loading}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
          {loading
            ? "Loading categories..."
            : selectedCategory
              ? selectedCategory.name
              : "Select category"}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Hidden required input */}
      {required && (
        <input
          tabIndex={-1}
          value={value}
          onChange={() => {}}
          required
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          aria-hidden="true"
        />
      )}

      {/* Dropdown */}
      {open && !loading && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {categories.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No categories found.
            </div>
          ) : (
            renderTree(categories)
          )}
        </div>
      )}
    </div>
  );
}
