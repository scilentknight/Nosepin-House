"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" />
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <path d="M4 7h16M4 12h16M4 17h10" />,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: (
      <path d="M4 6h7v7H4V6zm9 0h7v4h-7V6zM4 15h4v5H4v-5zm7 2h9v3h-9v-3z" />
    ),
  },
  {
    href: "/admin/materials",
    label: "Materials",
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  },
  {
    href: "/admin/material-rates",
    label: "Material Rates",
    icon: (
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2v-1.1c-1.3-.2-2.3-1.1-2.4-2.4h1.9c.1.5.5.9 1.1.9.7 0 1.1-.4 1.1-.9 0-.5-.3-.8-1.4-1.1-1.6-.4-2.6-1.1-2.6-2.5 0-1.2.9-2.1 2.3-2.3V4h2v1.1c1.1.2 2 1 2.2 2.2h-1.9c-.1-.4-.4-.8-1-.8-.6 0-1 .3-1 .8 0 .4.3.7 1.4 1 1.6.4 2.6 1.1 2.6 2.5 0 1.3-.9 2.2-2.3 2.4v1.3z" />
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4m-8-4v10l8 4m0-10v10" />
    ),
  },
  {
    href: "/admin/attributes",
    label: "Attributes",
    icon: (
      <path d="M4 6h16M4 6a2 2 0 002 2h2a2 2 0 002-2M4 6a2 2 0 012-2h2a2 2 0 012 2m6 0h4M12 6a2 2 0 002 2h2a2 2 0 002-2M12 6a2 2 0 012-2h2a2 2 0 012 2M4 18h16M4 18a2 2 0 002 2h2a2 2 0 002-2M4 18a2 2 0 012-2h2a2 2 0 012 2m6 0h4" />
    ),
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: (
      <path d="M12 3l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3z" />
    ),
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: (
      <path d="M4 8a2 2 0 012-2h5.2a2 2 0 011.4.6l6.4 6.4a2 2 0 010 2.8l-5.2 5.2a2 2 0 01-2.8 0l-6.4-6.4A2 2 0 014 13.2V8zm4.5 2a1 1 0 100-2 1 1 0 000 2z" />
    ),
  },
  {
    href: "/admin/banners",
    label: "Home Banners",
    icon: <path d="M4 5h16v14H4V5zm0 10l4.5-5 3.5 4 2.5-3 5.5 6" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.14-1.4l2.06-1.6-2-3.46-2.42.98a7.4 7.4 0 00-2.4-1.4L14 2h-4l-.5 2.52a7.4 7.4 0 00-2.4 1.4l-2.42-.98-2 3.46 2.06 1.6a7.4 7.4 0 000 2.8l-2.06 1.6 2 3.46 2.42-.98a7.4 7.4 0 002.4 1.4L10 22h4l.5-2.52a7.4 7.4 0 002.4-1.4l2.42.98 2-3.46-2.06-1.6a7.4 7.4 0 00.14-1.4z" />
    ),
  },
];

// Sidebar keeps the same colours in light and dark mode
const SIDEBAR = {
  bg: "bg-[#0f2747]",
  border: "border-white/10",
  title: "text-white",
  subtitle: "text-slate-400",
  link: "text-slate-300 hover:bg-white/10 hover:text-white",
  active: "bg-[#eb6834] text-white",
};

function Avatar({
  image,
  name,
  size,
}: {
  image?: string | null;
  name?: string | null;
  size: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt=""
      className={`${dim} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-slate-700 font-semibold text-white`}
    >
      {name?.[0]?.toUpperCase() ?? "A"}
    </span>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // desktop only: icon rail
  const [darkMode, setDarkMode] = useState(false);
  const sb = SIDEBAR;

  // Every colour in the header/content shell is driven by this, so it never depends on Tailwind's dark: setup
  const t = darkMode
    ? {
        shell: "bg-slate-950",
        header: "border-slate-800 bg-slate-900",
        iconBtn: "text-slate-300 hover:bg-slate-800",
        heading: "text-slate-400",
        name: "text-slate-200",
        chevron: "text-slate-500",
        menu: "border-slate-700 bg-slate-800",
        menuName: "text-white",
        menuEmail: "text-slate-400",
        divider: "border-slate-700",
        menuLink: "text-slate-300 hover:bg-slate-700",
        signOut: "hover:bg-slate-700",
      }
    : {
        shell: "bg-gray-100",
        header: "border-gray-200 bg-white",
        iconBtn: "text-gray-600 hover:bg-gray-100",
        heading: "text-slate-500",
        name: "text-gray-700",
        chevron: "text-gray-400",
        menu: "border-gray-200 bg-white",
        menuName: "text-gray-900",
        menuEmail: "text-gray-500",
        divider: "border-gray-100",
        menuLink: "text-gray-700 hover:bg-gray-50",
        signOut: "hover:bg-gray-50",
      };

  // Restore the saved theme once on mount
  useEffect(() => {
    setDarkMode(localStorage.getItem("admin-theme") === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("admin-theme", next ? "dark" : "light");
  };

  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((c) => !c);
    } else {
      setMobileOpen((o) => !o);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {mobileOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col overflow-hidden ${sb.bg} transition-[width,transform] duration-200 lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-16 shrink-0 items-center gap-2 border-b ${sb.border} px-5 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <Logo showText={false} iconSize={80} />
          <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
            <p
              className={`truncate text-sm font-bold leading-tight ${sb.title}`}
            >
              NOSEPIN HOUSE
            </p>
            <p className={`text-[11px] uppercase tracking-wide ${sb.subtitle}`}>
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-3 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  collapsed ? "lg:justify-center lg:px-0" : ""
                } ${isActive ? sb.active : sb.link}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  {item.icon}
                </svg>
                <span
                  className={`whitespace-nowrap ${collapsed ? "lg:hidden" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div
        className={`min-h-screen transition-[padding] duration-200 ${t.shell} ${
          darkMode ? "dark" : ""
        } ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <header
          className={`sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 sm:px-6 ${t.header}`}
        >
          <button
            className={`rounded-lg p-2 ${t.iconBtn}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={!collapsed || mobileOpen}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${t.heading}`}
          >
            Admin Dashboard
          </p>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={darkMode ? "Light mode" : "Dark mode"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                darkMode
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path d="M21 12.8A8.5 8.5 0 1111.2 3 6.7 6.7 0 0021 12.8z" />
                </svg>
              )}
            </button>

            <div className="group relative">
              <button
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${t.iconBtn}`}
              >
                <Avatar
                  image={session?.user?.image}
                  name={session?.user?.name}
                  size="sm"
                />
                <span
                  className={`hidden text-sm font-medium sm:inline ${t.name}`}
                >
                  {session?.user?.name ?? "Admin"}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`hidden h-4 w-4 sm:block ${t.chevron}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div
                className={`invisible absolute right-0 z-50 mt-1 w-56 rounded-xl border py-1 opacity-0 shadow-xl transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${t.menu}`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar
                    image={session?.user?.image}
                    name={session?.user?.name}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${t.menuName}`}>
                      {session?.user?.name ?? "Admin"}
                    </p>
                    <p className={`truncate text-xs ${t.menuEmail}`}>
                      {session?.user?.email ?? ""}
                    </p>
                  </div>
                </div>
                <div className={`border-t py-1 ${t.divider}`}>
                  <Link
                    href="/admin/profile"
                    className={`block px-4 py-2 text-sm ${t.menuLink}`}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`block w-full px-4 py-2 text-left text-sm text-secondary-600 ${t.signOut}`}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
