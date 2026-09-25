import Link from "next/link";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex gap-2 overflow-x-auto scrollbar-none border-b border-gray-100 text-sm font-medium text-gray-600">
        <Link href="/account" className="shrink-0 whitespace-nowrap px-3 py-2 hover:text-primary-600">
          My Account
        </Link>
        <Link href="/account/orders" className="shrink-0 whitespace-nowrap px-3 py-2 hover:text-primary-600">
          My Orders
        </Link>
        <Link href="/account/addresses" className="shrink-0 whitespace-nowrap px-3 py-2 hover:text-primary-600">
          My Addresses
        </Link>
      </nav>
      {children}
    </div>
  );
}
