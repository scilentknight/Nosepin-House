"use client";

import { useState } from "react";

interface FilterSidebarProps {
  children: React.ReactNode;
  activeCount?: number;
}

export function FilterSidebar({
  children,
  activeCount = 0,
}: FilterSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-full shrink-0 lg:w-64">
      {/* Toggle button — only shown below lg */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="shop-filters-panel"
        className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-soft lg:hidden"
      >
        <span className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Filter panel: collapsible below lg, always visible from lg up */}
      <div
        id="shop-filters-panel"
        className={`${open ? "mt-4 block" : "hidden"} lg:mt-0 lg:block!`}
      >
        {children}
      </div>
    </aside>
  );
}
