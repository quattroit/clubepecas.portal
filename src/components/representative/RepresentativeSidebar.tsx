"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Receipt,
  ScrollText,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type RepresentativeNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
};

export const REPRESENTATIVE_NAV_ITEMS: RepresentativeNavItem[] = [
  {
    href: ROUTES.REPRESENTATIVE,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: ROUTES.REPRESENTATIVE_SELLERS,
    label: "Vendedores",
    icon: Store,
    exact: false,
  },
  {
    href: ROUTES.REPRESENTATIVE_COMMISSIONS,
    label: "Comissões",
    icon: Receipt,
    exact: false,
  },
  {
    href: ROUTES.REPRESENTATIVE_STATEMENT,
    label: "Extrato",
    icon: ScrollText,
    exact: false,
  },
  {
    href: ROUTES.REPRESENTATIVE_LINK,
    label: "Link de indicação",
    icon: Link2,
    exact: false,
  },
  {
    href: ROUTES.REPRESENTATIVE_PROFILE,
    label: "Perfil",
    icon: UserRound,
    exact: false,
  },
];

type RepresentativeSidebarProps = {
  /** Desktop completo | tablet ícones | drawer mobile. */
  variant?: "full" | "collapsed" | "drawer";
  onNavigate?: () => void;
  className?: string;
};

/**
 * Shell de navegação do portal do representante — mesmo padrão visual
 * do `AdminSidebar`, com rótulos e rotas próprios (Sprint 10.6).
 */
function RepresentativeSidebar({
  variant = "full",
  onNavigate,
  className,
}: RepresentativeSidebarProps) {
  const pathname = usePathname();
  const collapsed = variant === "collapsed";
  const isDrawer = variant === "drawer";

  return (
    <aside
      aria-label="Portal do representante"
      data-variant={variant}
      className={cn(
        "bg-sidebar border-sidebar-border flex shrink-0 flex-col",
        isDrawer && "h-full w-full border-0",
        !isDrawer && "border-r",
        collapsed ? "w-[4.5rem]" : !isDrawer && "w-60",
        className,
      )}
    >
      <div
        className={cn(
          "surface-brand flex h-14 items-center",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Logo
          href={ROUTES.REPRESENTATIVE}
          size="sm"
          onBrand
          className={cn(collapsed && "max-w-10 overflow-hidden")}
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-1", collapsed ? "p-2" : "p-4")}>
        {!collapsed ? (
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Representante
          </p>
        ) : (
          <span className="sr-only">Representante</span>
        )}
        <nav aria-label="Portal do representante">
          <ul className="flex flex-col gap-1">
            {REPRESENTATIVE_NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "text-small focus-visible:ring-sidebar-ring flex min-h-9 items-center rounded-lg transition-colors outline-none focus-visible:ring-2",
                      collapsed
                        ? "justify-center px-2 py-2"
                        : "gap-2.5 px-2.5 py-2",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-xs"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-opacity",
                        isActive ? "opacity-100" : "opacity-70",
                      )}
                      aria-hidden
                    />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export { RepresentativeSidebar };
export type { RepresentativeSidebarProps };
