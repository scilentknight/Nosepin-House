"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" />,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <path d="M4 7h16M4 12h16M4 17h10" />,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: <path d="M4 6h7v7H4V6zm9 0h7v4h-7V6zM4 15h4v5H4v-5zm7 2h9v3h-9v-3z" />,
  },
  {
    href: "/admin/brands",
    label: "Brands",
    icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4m-8-4v10l8 4m0-10v10" />,
  },
  {
    href: "/admin/attributes",
    label: "Attributes",
    icon: <path d="M4 6h16M4 6a2 2 0 002 2h2a2 2 0 002-2M4 6a2 2 0 012-2h2a2 2 0 012 2m6 0h4M12 6a2 2 0 002 2h2a2 2 0 002-2M12 6a2 2 0 012-2h2a2 2 0 012 2M4 18h16M4 18a2 2 0 002 2h2a2 2 0 002-2M4 18a2 2 0 012-2h2a2 2 0 012 2m6 0h4" />,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: <path d="M12 3l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3z" />,
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: <path d="M4 8a2 2 0 012-2h5.2a2 2 0 011.4.6l6.4 6.4a2 2 0 010 2.8l-5.2 5.2a2 2 0 01-2.8 0l-6.4-6.4A2 2 0 014 13.2V8zm4.5 2a1 1 0 100-2 1 1 0 000 2z" />,
  },
  {
    href: "/admin/banners",
    label: "Home Banners",
    icon: <path d="M4 5h16v14H4V5zm0 10l4.5-5 3.5 4 2.5-3 5.5 6" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <path d="M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.14-1.4l2.06-1.6-2-3.46-2.42.98a7.4 7.4 0 00-2.4-1.4L14 2h-4l-.5 2.52a7.4 7.4 0 00-2.4 1.4l-2.42-.98-2 3.46 2.06 1.6a7.4 7.4 0 000 2.8l-2.06 1.6 2 3.46 2.42-.98a7.4 7.4 0 002.4 1.4L10 22h4l.5-2.52a7.4 7.4 0 002.4-1.4l2.42.98 2-3.46-2.06-1.6a7.4 7.4 0 00.14-1.4z" />,
  },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-slate-900 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-5">
          <Logo showText={false} iconSize={30} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-white">DXN</p>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive ? "bg-sky-500/15 text-sky-400" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Admin Dashboard</p>

          <div className="relative ml-auto group">
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
                </span>
              )}
              <span className="hidden text-sm font-medium text-gray-700 sm:inline">{session?.user?.name ?? "Admin"}</span>
              <svg viewBox="0 0 24 24" className="hidden h-4 w-4 text-gray-400 sm:block" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div className="invisible absolute right-0 z-50 mt-1 w-56 rounded-xl border border-gray-200 bg-white py-1 opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100">
              <div className="flex items-center gap-3 px-4 py-3">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                    {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{session?.user?.name ?? "Admin"}</p>
                  <p className="truncate text-xs text-gray-500">{session?.user?.email ?? ""}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 py-1">
                <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Your Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full px-4 py-2 text-left text-sm text-secondary-600 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
