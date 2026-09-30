"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  LogOut,
  X,
  Check,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Logo } from "@/components/layout/Logo";
import { formatPrice } from "@/lib/format";

export const announcements = [
  "100% Natural Diamonds - SGL Certified",
  "Free Shipping All Over Nepal",
  "BIS Hallmarked Gold | SGL Certified Diamonds",
];

const NAV_LINKS = [
  { id: "home", href: "/", label: "Home" },
  { id: "jewellery", href: "/jewellery", label: "Jewellery" },
  { id: "about", href: "/about", label: "About Us" },
  { id: "contact", href: "/contact", label: "Contact" },
];

type Category = {
  id: number | string;
  name: string;
  slug: string;

  children?: Category[];
  subcategories?: Category[];
  subItems?: Category[];
};

type ProductSuggestion = {
  id: number;
  name: string;
  slug: string;
  price: number;
  featuredImage: string | null;
};

/* =========================================================
   SEARCH BOX
========================================================= */

function SearchBox({
  value,
  onChange,
  onSubmit,
  onNavigate,
  selectedCategory,
  onCategoryChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onNavigate?: () => void;

  selectedCategory: string;
  onCategoryChange: (value: string) => void;

  categories: Category[];
}) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);

  /*
   * Category dropdown state
   *
   * `open` is only for product search suggestions.
   * `categoryOpen` controls the category selector.
   */
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    new Set(),
  );

  const term = value.trim();

  /* ---------------------------------------------------------
     PRODUCT SEARCH SUGGESTIONS
  --------------------------------------------------------- */

  useEffect(() => {
    if (!term) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(term)}&pageSize=5`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(
            data?.success && Array.isArray(data?.data) ? data.data : [],
          );
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [term]);

  /* ---------------------------------------------------------
     CLICK OUTSIDE
  --------------------------------------------------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------------------------------------------------------
     PRODUCT NAVIGATION
  --------------------------------------------------------- */

  function goToProduct(slug: string) {
    setOpen(false);
    onNavigate?.();

    router.push(`/product/${slug}`);
  }

  const showDropdown = open && term.length > 0;

  /* ---------------------------------------------------------
     CATEGORY HELPERS
  --------------------------------------------------------- */

  function getChildren(category: Category): Category[] {
    return (
      category.children || category.subcategories || category.subItems || []
    );
  }

  function toggleCategory(categoryId: string) {
    setExpandedCategoryIds((current) => {
      const next = new Set(current);

      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });
  }

  function findCategoryName(items: Category[], slug: string): string | null {
    for (const category of items) {
      if (category.slug === slug) {
        return category.name;
      }

      const children = getChildren(category);

      if (children.length > 0) {
        const result = findCategoryName(children, slug);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  function selectCategory(slug: string) {
    onCategoryChange(slug);
    setCategoryOpen(false);
  }

  /* ---------------------------------------------------------
     DESKTOP CATEGORY TREE
  --------------------------------------------------------- */

  function renderCategoryTree(items: Category[], level = 0): ReactNode[] {
    const output: ReactNode[] = [];

    items.forEach((category) => {
      const id = String(category.id);

      const children = getChildren(category);

      const hasChildren = children.length > 0;

      const expanded = expandedCategoryIds.has(id);

      const selected = selectedCategory === category.slug;

      output.push(
        <div key={`${id}-${category.slug}`}>
          <div
            className="
              flex
              min-w-0
              items-center
              rounded-md
              transition-colors
              hover:bg-[#FBF6EE]
            "
          >
            {/* Expand / collapse button */}
            <button
              type="button"
              disabled={!hasChildren}
              onClick={() => {
                if (hasChildren) {
                  toggleCategory(id);
                }
              }}
              aria-label={
                hasChildren
                  ? expanded
                    ? `Collapse ${category.name}`
                    : `Expand ${category.name}`
                  : undefined
              }
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-md
                text-[#8A7C75]
                ${
                  hasChildren
                    ? "cursor-pointer hover:bg-[#F3E9C8] hover:text-primary-600"
                    : "cursor-default"
                }
              `}
            >
              {hasChildren ? (
                expanded ? (
                  <ChevronDown className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>

            {/* Category name */}
            <button
              type="button"
              onClick={() => selectCategory(category.slug)}
              className={`
                flex
                min-w-0
                flex-1
                items-center
                justify-between
                gap-2
                py-2
                pr-3
                text-left
                text-sm
                ${selected ? "font-medium text-primary-600" : "text-[#4F403B]"}
              `}
              style={{
                paddingLeft: `${level * 16 + 4}px`,
              }}
            >
              <span className="min-w-0 truncate">{category.name}</span>

              {selected && (
                <Check
                  className="h-4 w-4 shrink-0 text-primary-600"
                  strokeWidth={2}
                />
              )}
            </button>
          </div>

          {/* Children */}
          {hasChildren && expanded && (
            <div>{renderCategoryTree(children, level + 1)}</div>
          )}
        </div>,
      );
    });

    return output;
  }

  const selectedCategoryName =
    selectedCategory && findCategoryName(categories, selectedCategory);

  /* ---------------------------------------------------------
     SEARCH BOX UI
  --------------------------------------------------------- */

  return (
    <div ref={containerRef} className="relative flex w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="
          flex
          w-full
          items-center
          overflow-visible
          rounded-lg
          border
          border-[#E8DDD2]
          bg-white
        "
      >
        {/* CATEGORY SELECTOR */}

        <div className="relative shrink-0 border-r border-[#E8DDD2]">
          <div className="relative h-full w-[150px] md:w-[175px]">
            <button
              type="button"
              onClick={() => setCategoryOpen((current) => !current)}
              className="
                flex
                h-full
                min-h-[42px]
                w-full
                items-center
                justify-between
                gap-2
                bg-transparent
                pl-3
                pr-2
                text-left
                text-xs
                font-medium
                text-[#4F403B]
                outline-none
                md:text-sm
              "
            >
              <span className="min-w-0 truncate">
                {selectedCategoryName || "All Categories"}
              </span>

              <ChevronDown
                className={`
                  h-4
                  w-4
                  shrink-0
                  text-[#8A7C75]
                  transition-transform
                  ${categoryOpen ? "rotate-180" : ""}
                `}
                strokeWidth={2}
              />
            </button>

            {categoryOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-full
                  z-[60]
                  mt-1
                  max-h-[420px]
                  w-[280px]
                  overflow-y-auto
                  rounded-xl
                  border
                  border-[#E8DDD2]
                  bg-white
                  p-1.5
                  shadow-xl
                "
              >
                {/* ALL CATEGORIES */}

                <button
                  type="button"
                  onClick={() => {
                    onCategoryChange("");
                    setCategoryOpen(false);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    transition-colors
                    hover:bg-[#FBF6EE]
                    ${
                      !selectedCategory
                        ? "font-medium text-primary-600"
                        : "text-[#4F403B]"
                    }
                  `}
                >
                  <span>All Categories</span>

                  {!selectedCategory && (
                    <Check
                      className="h-4 w-4 text-primary-600"
                      strokeWidth={2}
                    />
                  )}
                </button>

                <div className="my-1 border-t border-[#E8DDD2]" />

                {/* CATEGORY TREE */}

                {renderCategoryTree(categories)}
              </div>
            )}
          </div>
        </div>

        {/* SEARCH INPUT */}

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (term) {
              setOpen(true);
            }
          }}
          placeholder="Search jewellery..."
          className="
            min-w-0
            flex-1
            bg-transparent
            px-3
            py-2.5
            text-sm
            text-[#4F403B]
            outline-none
            placeholder:text-[#9A8D86]
          "
        />

        {/* SEARCH BUTTON */}

        <button
          type="submit"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-r-lg
            text-[#8A7C75]
            transition-colors
            hover:bg-[#FBF6EE]
            hover:text-primary-600
          "
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* PRODUCT SUGGESTIONS */}

      {showDropdown && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-2
            overflow-hidden
            rounded-xl
            border
            border-[#E8DDD2]
            bg-white
            shadow-xl
          "
        >
          {loading ? (
            <div className="px-4 py-5 text-center text-sm text-[#8A7C75]">
              Searching...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-[#8A7C75]">
              No products found
            </div>
          ) : (
            <div className="divide-y divide-[#E8DDD2]">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => goToProduct(product.slug)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    transition-colors
                    hover:bg-[#FBF6EE]
                  "
                >
                  {/* Product image */}

                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#FBF6EE]">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-[#B49B91]" />
                      </div>
                    )}
                  </div>

                  {/* Product info */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#4F403B]">
                      {product.name}
                    </p>

                    <p className="mt-0.5 text-xs text-primary-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE CATEGORY TREE
========================================================= */

function MobileCategoryTree({
  categories,
  onNavigate,
}: {
  categories: Category[];
  onNavigate: () => void;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function getChildren(category: Category): Category[] {
    return (
      category.children || category.subcategories || category.subItems || []
    );
  }

  function toggleCategory(id: string) {
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

  function renderTree(items: Category[], level = 0): ReactNode[] {
    const output: ReactNode[] = [];

    items.forEach((category) => {
      const id = String(category.id);

      const children = getChildren(category);

      const hasChildren = children.length > 0;

      const expanded = expandedIds.has(id);

      output.push(
        <div key={`${id}-${category.slug}`}>
          <div
            className="
              flex
              items-center
              rounded-md
              transition-colors
              hover:bg-[#F3E9C8]
            "
          >
            {/* Expand / collapse */}

            <button
              type="button"
              disabled={!hasChildren}
              onClick={() => {
                if (hasChildren) {
                  toggleCategory(id);
                }
              }}
              aria-label={
                hasChildren
                  ? expanded
                    ? `Collapse ${category.name}`
                    : `Expand ${category.name}`
                  : undefined
              }
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-md
                text-[#8A7C75]
                ${
                  hasChildren
                    ? "cursor-pointer hover:text-primary-600"
                    : "cursor-default"
                }
              `}
            >
              {hasChildren ? (
                expanded ? (
                  <ChevronDown className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>

            {/* Category name */}

            <Link
              href={`/jewellery?category=${category.slug}`}
              onClick={onNavigate}
              className={`
                min-w-0
                flex-1
                py-2
                pr-3
                text-sm
                transition-colors
                hover:text-primary-600
                ${level === 0 ? "font-medium text-[#4F403B]" : "text-[#6F625D]"}
              `}
              style={{
                paddingLeft: `${level * 16 + 4}px`,
              }}
            >
              {category.name}
            </Link>
          </div>

          {/* Children */}

          {hasChildren && expanded && (
            <div>{renderTree(children, level + 1)}</div>
          )}
        </div>,
      );
    });

    return output;
  }

  return <div className="flex flex-col">{renderTree(categories)}</div>;
}

/* =========================================================
   HEADER
========================================================= */

export function Header() {
  const { data: session, status } = useSession();

  const { totalCount } = useCart();

  const { totalCount: wishlistCount } = useWishlist();

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  /* ---------------------------------------------------------
     LOAD CATEGORIES
  --------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.categories)
              ? result.categories
              : [];

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    const query = params.toString();

    router.push(query ? `/jewellery?${query}` : "/jewellery");

    setMobileOpen(false);
  }

  /* ---------------------------------------------------------
     ANNOUNCEMENT SLIDER
  --------------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex(
        (previous) => (previous + 1) % announcements.length,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* =====================================================
        ANNOUNCEMENT BAR
    ===================================================== */}

      <div
        className="
        relative
        h-8
        overflow-hidden
        bg-primary-500
        py-2
        text-center
        text-xs
        font-medium
        tracking-wide
        text-white
      "
      >
        {announcements.map((announcement, index) => (
          <div
            key={index}
            className={`
            absolute
            w-full
            transition-all
            duration-500
            ease-in-out
            ${
              index === currentAnnouncementIndex
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }
          `}
          >
            {announcement}
          </div>
        ))}
      </div>
      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header
        className="sticky top-0 z-40 border-b border-[#E8DDD2] bg-[#FBF6EE]/95
    backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* LOGO */}

            <Link href="/" className="shrink-0">
              <Logo iconSize={80} />
            </Link>

            {/* DESKTOP NAVIGATION */}

            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="
                    text-sm
                    font-medium
                    text-[#4F403B]
                    transition-colors
                    hover:text-primary-600
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* SEARCH */}

            <div className="hidden flex-1 justify-center lg:flex">
              <SearchBox
                value={search}
                onChange={setSearch}
                onSubmit={() => handleSearch()}
                onNavigate={() => setMobileOpen(false)}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </div>

            {/* RIGHT SIDE */}

            <div className="flex items-center gap-2">
              {/* NOTIFICATION */}

              <div className="hidden lg:block">
                <NotificationBell />
              </div>

              {/* ACCOUNT */}

              <div className="relative hidden lg:block">
                {status === "loading" ? (
                  <div className="h-9 w-9 animate-pulse rounded-full bg-[#F3E9C8]" />
                ) : session?.user ? (
                  <details className="group relative">
                    <summary
                      className="
                        flex
                        cursor-pointer
                        list-none
                        items-center
                        gap-2
                        rounded-lg
                        px-2
                        py-2
                        text-[#4F403B]
                        transition-colors
                        hover:bg-[#FBF6EE]
                      "
                    >
                      <User className="h-5 w-5" />

                      <span className="max-w-[100px] truncate text-sm">
                        {session.user.name || session.user.email || "Account"}
                      </span>

                      <ChevronDown className="h-4 w-4" />
                    </summary>

                    <div
                      className="
                        absolute
                        right-0
                        top-full
                        z-50
                        mt-2
                        w-56
                        rounded-xl
                        border
                        border-[#E8DDD2]
                        bg-white
                        p-2
                        shadow-xl
                      "
                    >
                      <Link
                        href="/account"
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#4F403B]
                          hover:bg-[#FBF6EE]
                        "
                      >
                        <User className="h-4 w-4" />
                        Account
                      </Link>

                      <Link
                        href="/account/orders"
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#4F403B]
                          hover:bg-[#FBF6EE]
                        "
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>

                      <Link
                        href="/admin"
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#4F403B]
                          hover:bg-[#FBF6EE]
                        "
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <div className="my-1 border-t border-[#E8DDD2]" />

                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          text-red-600
                          hover:bg-red-50
                        "
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </details>
                ) : (
                  <Link
                    href="/login"
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      px-2
                      py-2
                      text-sm
                      font-medium
                      text-[#4F403B]
                      hover:bg-[#FBF6EE]
                    "
                  >
                    <User className="h-5 w-5" />
                    Login
                  </Link>
                )}
              </div>

              {/* WISHLIST */}

              <Link
                href="/wishlist"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  text-[#4F403B]
                  transition-colors
                  hover:bg-[#FBF6EE]
                  hover:text-primary-600
                "
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />

                {wishlistCount > 0 && (
                  <span
                    className="
                      absolute
                      right-0
                      top-0
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-primary-600
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}

              <Link
                href="/cart"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  text-[#4F403B]
                  transition-colors
                  hover:bg-[#FBF6EE]
                  hover:text-primary-600
                "
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />

                {totalCount > 0 && (
                  <span
                    className="
                      absolute
                      right-0
                      top-0
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-primary-600
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() => setMobileOpen((current) => !current)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  text-[#4F403B]
                  transition-colors
                  hover:bg-[#FBF6EE]
                  lg:hidden
                "
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}

          <div className="pb-4 lg:hidden">
            <SearchBox
              value={search}
              onChange={setSearch}
              onSubmit={() => handleSearch()}
              onNavigate={() => setMobileOpen(false)}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />
          </div>
        </div>

        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        {mobileOpen && (
          <div
            className="
              border-t
              border-[#E8DDD2]
              bg-white
              lg:hidden
            "
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              {/* NORMAL NAV LINKS */}

              <nav className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      rounded-md
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-[#4F403B]
                      transition-colors
                      hover:bg-[#F3E9C8]
                      hover:text-primary-600
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* MOBILE ACCOUNT */}

              {!session?.user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    mt-1
                    flex
                    items-center
                    gap-2
                    rounded-md
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-[#4F403B]
                    transition-colors
                    hover:bg-[#F3E9C8]
                    hover:text-primary-600
                  "
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}

              {/* MOBILE CATEGORIES */}

              <div className="mt-4 border-t border-[#E8DDD2] pt-3">
                <div className="mb-2 flex items-center justify-between px-3">
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#8A7C75]
                    "
                  >
                    Categories
                  </p>

                  {categoriesLoading && (
                    <span className="text-[10px] text-[#9A8D86]">
                      Loading...
                    </span>
                  )}
                </div>

                {!categoriesLoading && categories.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[#8A7C75]">
                    No categories found
                  </p>
                )}

                {!categoriesLoading && categories.length > 0 && (
                  <MobileCategoryTree
                    categories={categories}
                    onNavigate={() => setMobileOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
