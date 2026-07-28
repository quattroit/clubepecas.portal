"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Car,
  CarFront,
  ChevronDown,
  CreditCard,
  FolderOpen,
  FolderTree,
  HandCoins,
  LayoutDashboard,
  LineChart,
  MapPin,
  Package,
  ScrollText,
  Settings,
  Store,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
};

type AdminNavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: AdminNavItem[];
};

type AdminNavEntry =
  | { type: "link"; item: AdminNavItem }
  | { type: "group"; group: AdminNavGroup };

const ADMIN_NAV: AdminNavEntry[] = [
  {
    type: "link",
    item: {
      href: ROUTES.ADMIN,
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
  },
  {
    type: "link",
    item: {
      href: ROUTES.ADMIN_SELLERS,
      label: "Vendedores",
      icon: Store,
      exact: false,
    },
  },
  {
    type: "link",
    item: {
      href: ROUTES.ADMIN_ADVERTISEMENTS,
      label: "Anúncios",
      icon: Package,
      exact: false,
    },
  },
  {
    type: "link",
    item: {
      href: ROUTES.ADMIN_PROFESSIONAL_BUYERS,
      label: "Compradores Profissionais",
      icon: BriefcaseBusiness,
      exact: false,
    },
  },
  {
    type: "group",
    group: {
      id: "cadastros",
      label: "Cadastros",
      icon: FolderTree,
      items: [
        {
          href: ROUTES.ADMIN_CATEGORIES,
          label: "Categorias",
          icon: FolderTree,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_CITIES,
          label: "Cidades",
          icon: MapPin,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_VEHICLE_BRANDS,
          label: "Marcas",
          icon: Car,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_VEHICLE_MODELS,
          label: "Modelos",
          icon: CarFront,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_PLANS,
          label: "Planos",
          icon: CreditCard,
          exact: false,
        },
      ],
    },
  },
  {
    type: "group",
    group: {
      id: "representantes",
      label: "Representante Comercial",
      icon: UserRound,
      items: [
        {
          href: ROUTES.ADMIN_REPRESENTATIVES,
          label: "Representantes",
          icon: UserRound,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_COMMISSIONS,
          label: "Comissões",
          icon: Wallet,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_PAYOUTS,
          label: "Pagamentos de comissões",
          icon: HandCoins,
          exact: false,
        },
      ],
    },
  },
  {
    type: "group",
    group: {
      id: "financeiro",
      label: "Financeiro",
      icon: LineChart,
      items: [
        {
          href: ROUTES.ADMIN_PAYMENTS,
          label: "Pagamentos",
          icon: Wallet,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_FINANCIAL,
          label: "Visão financeira",
          icon: LineChart,
          exact: false,
        },
      ],
    },
  },
  {
    type: "group",
    group: {
      id: "sistema",
      label: "Sistema",
      icon: Settings,
      items: [
        {
          href: ROUTES.ADMIN_ANALYTICS,
          label: "Analytics",
          icon: BarChart3,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_FILES,
          label: "Arquivos",
          icon: FolderOpen,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_AUDIT,
          label: "Auditoria",
          icon: ScrollText,
          exact: false,
        },
        {
          href: ROUTES.ADMIN_SETTINGS,
          label: "Configurações",
          icon: Settings,
          exact: false,
        },
      ],
    },
  },
];

/** Lista plana (compatibilidade / modo ícones). */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((entry) =>
  entry.type === "link" ? [entry.item] : entry.group.items,
);

function isNavItemActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function isGroupActive(pathname: string, group: AdminNavGroup): boolean {
  return group.items.some((item) => isNavItemActive(pathname, item));
}

type AdminSidebarProps = {
  /** Desktop completo | tablet ícones | drawer mobile. */
  variant?: "full" | "collapsed" | "drawer";
  onNavigate?: () => void;
  className?: string;
};

function NavLink({
  item,
  pathname,
  collapsed,
  onNavigate,
  nested = false,
}: {
  item: AdminNavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  nested?: boolean;
}) {
  const isActive = isNavItemActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
      className={cn(
        "text-small focus-visible:ring-sidebar-ring flex min-h-9 items-center rounded-lg transition-colors outline-none focus-visible:ring-2",
        collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-2.5 py-2",
        nested && !collapsed && "pl-3",
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
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );
}

function NavGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: AdminNavGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  const groupActive = isGroupActive(pathname, group);
  const [open, setOpen] = useState(groupActive);
  const GroupIcon = group.icon;

  useEffect(() => {
    if (groupActive) {
      setOpen(true);
    }
  }, [groupActive, pathname]);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "text-small focus-visible:ring-sidebar-ring flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors outline-none focus-visible:ring-2",
          groupActive
            ? "text-sidebar-foreground font-medium"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
        aria-expanded={open}
      >
        <GroupIcon
          className={cn(
            "size-4 shrink-0",
            groupActive ? "opacity-100" : "opacity-70",
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-left">{group.label}</span>
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <ul className="border-sidebar-border mt-1 ml-3 flex flex-col gap-0.5 border-l pl-2">
          {group.items.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                pathname={pathname}
                collapsed={false}
                onNavigate={onNavigate}
                nested
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function AdminSidebar({
  variant = "full",
  onNavigate,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const collapsed = variant === "collapsed";
  const isDrawer = variant === "drawer";

  const flattenedItems = useMemo(() => ADMIN_NAV_ITEMS, []);

  return (
    <aside
      aria-label="Administração"
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
          href={ROUTES.ADMIN}
          size="sm"
          onBrand
          className={cn(collapsed && "max-w-10 overflow-hidden")}
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-1", collapsed ? "p-2" : "p-4")}>
        {!collapsed ? (
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Administração
          </p>
        ) : (
          <span className="sr-only">Administração</span>
        )}
        <nav aria-label="Área administrativa">
          {collapsed ? (
            <ul className="flex flex-col gap-1">
              {flattenedItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    pathname={pathname}
                    collapsed
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-1">
              {ADMIN_NAV.map((entry) =>
                entry.type === "link" ? (
                  <li key={entry.item.href}>
                    <NavLink
                      item={entry.item}
                      pathname={pathname}
                      collapsed={false}
                      onNavigate={onNavigate}
                    />
                  </li>
                ) : (
                  <NavGroup
                    key={entry.group.id}
                    group={entry.group}
                    pathname={pathname}
                    onNavigate={onNavigate}
                  />
                ),
              )}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
}

export { AdminSidebar };
export type { AdminSidebarProps };
