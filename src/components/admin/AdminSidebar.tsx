import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/icp", label: "ICPs" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <nav className="w-56 shrink-0 border-r border-brand-charcoal/10 bg-white px-4 py-6">
      <p className="px-2 font-serif text-lg font-semibold text-brand-charcoal">
        Bawari Group
      </p>
      <ul className="mt-8 space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-brand-charcoal/80 transition-colors hover:bg-brand-neutral hover:text-brand-charcoal"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
