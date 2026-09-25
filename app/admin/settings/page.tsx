import Link from "next/link";

const CARDS = [
  {
    href: "/admin/settings/email",
    title: "Email",
    description: "Configure the SMTP server used to send order and account emails.",
    icon: <path d="M4 6h16v12H4V6zm0 0l8 7 8-7" />,
  },
  {
    href: "/admin/settings/payment",
    title: "Payments",
    description: "Enable or disable Cash on Delivery and eSewa, and manage eSewa credentials.",
    icon: <path d="M3 7h18M3 11h18M6 15h4M3 7v10a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z" />,
  },
  {
    href: "/admin/settings/invoice",
    title: "Invoice",
    description: "Set the company details and branding shown on customer invoices.",
    icon: <path d="M7 3h10a1 1 0 011 1v17l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 011-1zm2 5h6M9 11h6M9 14h4" />,
  },
  {
    href: "/admin/settings/shipping",
    title: "Shipping & Tax",
    description: "Set per-country shipping rates and VAT/tax percentages applied at checkout.",
    icon: <path d="M3 7l1-3h11l1 3M3 7h13M3 7v9a1 1 0 001 1h1m11-10v10a1 1 0 01-1 1H8m8-11h3l2 4v6a1 1 0 01-1 1h-1m-9 0a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />,
  },
  {
    href: "/admin/profile",
    title: "Profile",
    description: "Update your admin name/email and change your password.",
    icon: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0" />,
  },
];

export default function SettingsHubPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Store-wide configuration.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                {card.icon}
              </svg>
            </span>
            <h2 className="text-sm font-semibold text-gray-900">{card.title}</h2>
            <p className="text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
