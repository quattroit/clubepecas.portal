"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Receipt,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: ROUTES.PROFESSIONAL_BUYER,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: ROUTES.PROFESSIONAL_BUYER_QUOTATION,
    label: "Minha Cotação",
    icon: Receipt,
    exact: true,
  },
  {
    href: ROUTES.PROFESSIONAL_BUYER_QUOTATIONS_HISTORY,
    label: "Cotações enviadas",
    icon: FileText,
    exact: false,
  },
  {
    href: ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS,
    label: "Solicitações",
    icon: ClipboardList,
    exact: false,
  },
] as const;

function ProfessionalBuyerSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Área do comprador profissional"
      className="bg-sidebar border-sidebar-border w-full shrink-0 border-b md:flex md:w-60 md:flex-col md:border-r md:border-b-0"
    >
      <div className="surface-brand hidden h-14 items-center px-4 md:flex">
        <Logo href={ROUTES.HOME} size="sm" onBrand />
      </div>

      <div className="flex flex-col gap-1 p-4 md:flex-1">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Navegação
        </p>
        <nav aria-label="Área autenticada">
          <ul className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-small focus-visible:ring-sidebar-ring flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors outline-none focus-visible:ring-2",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-xs"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-opacity",
                        isActive ? "opacity-100" : "opacity-70",
                      )}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-sidebar-border mt-4 border-t pt-4 md:mt-auto">
          <Link
            href={ROUTES.HOME}
            className="text-small text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-sidebar-ring flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors outline-none focus-visible:ring-2"
          >
            <Home className="size-4 shrink-0 opacity-70" aria-hidden />
            Voltar ao site
          </Link>
        </div>
      </div>
    </aside>
  );
}

export { ProfessionalBuyerSidebar };
