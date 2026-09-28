"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";

export interface ParentCategoryOption {
  id: string;
  name: string;
  parentCategoryId: string | null;
  children?: ParentCategoryOption[];
}

interface ParentCategoryTreeSelectProps {
  categories: ParentCategoryOption[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  excluded?: Set<string>;
}

export function ParentCategoryTreeSelect({
  categories,
  value,
  onChange,
  loading = false,
  excluded = new Set(),
}: ParentCategoryTreeSelectProps) {
  const [open, setOpen] = useState(false);

  // Initially everything is collapsed.
  const [expandedIds, setExpandedIds] =
    useState<Set<string>>(new Set());

  const containerRef =
    useRef<HTMLDivElement>(null);

  /*
   * Keep everything collapsed when the category
   * tree changes.
   */
  useEffect(() => {
    setExpandedIds(new Set());
  }, [categories]);

  /*
   * Close when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

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

  function findCategory(
    items: ParentCategoryOption[],
    id: string,
  ): ParentCategoryOption | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      if (item.children?.length) {
        const found = findCategory(
          item.children,
          id,
        );

        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  const selectedCategory = value
    ? findCategory(categories, value)
    : null;

  function renderTree(
    items: ParentCategoryOption[],
    level = 0,
  ): React.ReactNode[] {
    const result: React.ReactNode[] = [];

    items.forEach((category) => {
      /*
       * Do not display the current category
       * or any of its descendants.
       */
      if (excluded.has(category.id)) {
        return;
      }

      const hasChildren =
        !!category.children?.length;

      const isExpanded =
        expandedIds.has(category.id);

      const isSelected =
        value === category.id;

      result.push(
        <div key={category.id}>
          <div
            className={`flex items-center ${
              isSelected
                ? "bg-slate-100"
                : "hover:bg-gray-50"
            }`}
          >
            {/* Expand / collapse */}
            <button
              type="button"
              disabled={!hasChildren}
              onClick={() => {
                if (hasChildren) {
                  toggleExpanded(category.id);
                }
              }}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 ${
                hasChildren
                  ? "hover:bg-gray-200"
                  : "cursor-default"
              }`}
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

            {/* Category name */}
            <button
              type="button"
              onClick={() => {
                onChange(category.id);
                setOpen(false);
              }}
              className={`flex min-w-0 flex-1 items-center gap-2 py-2 pr-3 text-left text-sm ${
                isSelected
                  ? "font-semibold text-slate-900"
                  : "text-gray-700"
              }`}
              style={{
                paddingLeft: `${level * 20}px`,
              }}
            >
              {level > 0 && (
                <span className="text-gray-300">
                  └
                </span>
              )}

              <span className="truncate">
                {category.name}
              </span>

              {isSelected && (
                <Check
                  size={16}
                  className="ml-auto shrink-0 text-slate-700"
                />
              )}
            </button>
          </div>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div>
              {renderTree(
                category.children!,
                level + 1,
              )}
            </div>
          )}
        </div>,
      );
    });

    return result;
  }

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Selected parent */}
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        disabled={loading}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <span
          className={
            selectedCategory
              ? "text-gray-900"
              : "text-gray-400"
          }
        >
          {loading
            ? "Loading categories..."
            : selectedCategory
              ? selectedCategory.name
              : "None (top-level)"}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && !loading && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {/* Top-level option */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm ${
              value === ""
                ? "bg-slate-100 font-semibold text-slate-900"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="w-4" />

            <span>
              None (top-level)
            </span>

            {value === "" && (
              <Check
                size={16}
                className="ml-auto"
              />
            )}
          </button>

          <div className="my-1 border-t border-gray-100" />

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