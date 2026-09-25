import type { ReactElement } from "react";

const GRADIENTS: Record<string, string> = {
  green: "from-accent-400 to-accent-700",
  red: "from-secondary-400 to-secondary-700",
  blue: "from-primary-400 to-primary-700",
  amber: "from-amber-400 to-amber-600",
  teal: "from-teal-400 to-emerald-700",
};

const ICONS: Record<string, ReactElement> = {
  coffee: (
    <path d="M4 21h14M6 3v2m4-2v2m4-2v2M5 8h11v6a4 4 0 01-4 4H9a4 4 0 01-4-4V8zm11 2h1a2 2 0 010 4h-1" />
  ),
  leaf: (
    <path d="M5 21c8 0 14-6 14-16-10 0-16 6-16 14 0 1 .1 1.5.2 2H5zm2-4C7 12 10 8 16 6" />
  ),
  droplet: <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  capsule: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="3" />
      <path d="M12 9v6" />
    </>
  ),
};

function iconFor(categorySlug?: string) {
  if (!categorySlug) return ICONS.leaf;
  if (categorySlug.includes("coffee") || categorySlug.includes("beverage")) return ICONS.coffee;
  if (categorySlug.includes("personal") || categorySlug.includes("care")) return ICONS.droplet;
  if (categorySlug.includes("supplement") || categorySlug.includes("spirulina")) return ICONS.capsule;
  return ICONS.leaf;
}

export function ProductImagePlaceholder({
  colorway = "green",
  categorySlug,
  className = "",
  rounded = true,
}: {
  colorway?: string;
  categorySlug?: string;
  className?: string;
  rounded?: boolean;
}) {
  const gradient = GRADIENTS[colorway] ?? GRADIENTS.green;

  return (
    <div
      className={`flex aspect-square items-center justify-center ${rounded ? "rounded-xl" : ""} bg-gradient-to-br ${gradient} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-1/3 w-1/3 text-white/90"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconFor(categorySlug)}
      </svg>
    </div>
  );
}
