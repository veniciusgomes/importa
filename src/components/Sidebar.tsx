"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const workflowItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/calculadora",
    label: "Calculadora",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="2.5" width="16" height="19" rx="2" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <circle cx="8" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="16" cy="12" r="1" />
        <circle cx="8" cy="16" r="1" />
        <circle cx="12" cy="16" r="1" />
        <circle cx="16" cy="16" r="1" />
      </svg>
    ),
  },
  {
    href: "/compras",
    label: "Controle de compras",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8h12l-1.2 11.5a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    href: "/envios",
    label: "Envios",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 8 12 3 3 8l9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    href: "/financeiro",
    label: "Financeiro",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <circle cx="7" cy="14.5" r="1" />
      </svg>
    ),
  },
];

const configItem: NavItem = {
  href: "/configuracoes",
  label: "Configurações",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
};

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      className="nav-item"
      href={item.href}
      aria-current={active ? "page" : undefined}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">📦</span> importa
      </div>

      {workflowItems.map((item) => (
        <NavLink key={item.href} item={item} active={pathname === item.href} />
      ))}

      <div className="nav-section-label">Sistema</div>
      <NavLink item={configItem} active={pathname === configItem.href} />

      <div className="sidebar-foot">Uso local · pessoa física · regime PF/RTS</div>
    </aside>
  );
}
