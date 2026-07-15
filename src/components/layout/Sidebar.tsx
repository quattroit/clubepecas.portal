"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Package, UserRound } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: ROUTES.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: ROUTES.MY_ADVERTISEMENTS,
    label: "Meus anúncios",
    icon: Package,
    exact: false,
  },
  {
    href: ROUTES.PROFILE,
    label: "Meu perfil",
    icon: UserRound,
    exact: true,
  },
] as const;

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Painel"
      className="bg-sidebar border-sidebar-border w-full shrink-0 border-b md:flex md:w-56 md:flex-col md:border-r md:border-b-0"
    >
      <div className="border-sidebar-border hidden h-14 items-center border-b px-4 md:flex">
        <Logo href={ROUTES.HOME} size="sm" />
      </div>

      <div className="flex flex-col gap-1 p-4 md:flex-1">
        <p className="text-small mb-2 font-medium">Navegação</p>
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
                      "text-small hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-sidebar-border mt-3 border-t pt-3 md:mt-auto">
          <Link
            href={ROUTES.HOME}
            className="text-small hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
          >
            <Home className="size-4 shrink-0 opacity-70" aria-hidden />
            Voltar ao site
          </Link>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };
