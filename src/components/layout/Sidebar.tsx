"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CreditCard,
  FolderOpen,
  Home,
  LayoutDashboard,
  Package,
  Receipt,
  Truck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useSeller } from "@/hooks/api/useSeller";
import { cn } from "@/lib/utils";

type SellerNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
  requiresSeller: boolean;
  requiresPlan: boolean;
};

type SellerNavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: SellerNavItem[];
};

type SellerNavEntry =
  | { type: "link"; item: SellerNavItem }
  | { type: "group"; group: SellerNavGroup };

const SELLER_NAV: SellerNavEntry[] = [
  {
    type: "link",
    item: {
      href: ROUTES.DASHBOARD,
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
      requiresSeller: true,
      requiresPlan: true,
    },
  },
  {
    type: "group",
    group: {
      id: "cadastros",
      label: "Cadastros",
      icon: FolderOpen,
      items: [
        {
          href: ROUTES.MY_ADVERTISEMENTS,
          label: "Meus anúncios",
          icon: Package,
          exact: false,
          requiresSeller: true,
          requiresPlan: true,
        },
        {
          href: ROUTES.LOCAL_DELIVERY,
          label: "Frete Local",
          icon: Truck,
          exact: true,
          requiresSeller: true,
          requiresPlan: false,
        },
      ],
    },
  },
  {
    type: "link",
    item: {
      href: ROUTES.MY_PLAN,
      label: "Meu Plano",
      icon: CreditCard,
      exact: true,
      requiresSeller: true,
      requiresPlan: false,
    },
  },
  {
    type: "link",
    item: {
      href: ROUTES.SELLER_QUOTATIONS,
      label: "Central de Cotações",
      icon: Receipt,
      exact: false,
      requiresSeller: true,
      requiresPlan: false,
    },
  },
  {
    type: "link",
    item: {
      href: ROUTES.PROFILE,
      label: "Meu perfil",
      icon: UserRound,
      exact: true,
      requiresSeller: false,
      requiresPlan: false,
    },
  },
];

function isNavItemActive(pathname: string, item: SellerNavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function isGroupActive(pathname: string, group: SellerNavGroup): boolean {
  return group.items.some((item) => isNavItemActive(pathname, item));
}

function LockedNavItem({
  item,
  hasSeller,
}: {
  item: SellerNavItem;
  hasSeller: boolean;
}) {
  const Icon = item.icon;
  return (
    <span
      className="text-small text-muted-foreground flex min-h-9 cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 opacity-50"
      title={
        !hasSeller
          ? "Complete seu perfil da loja para continuar"
          : "Assine um plano para continuar"
      }
      aria-disabled
    >
      <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
      {item.label}
    </span>
  );
}

function NavLink({
  item,
  pathname,
  locked,
  hasSeller,
  nested = false,
}: {
  item: SellerNavItem;
  pathname: string;
  locked: boolean;
  hasSeller: boolean;
  nested?: boolean;
}) {
  if (locked) {
    return <LockedNavItem item={item} hasSeller={hasSeller} />;
  }

  const isActive = isNavItemActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "text-small focus-visible:ring-sidebar-ring flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors outline-none focus-visible:ring-2",
        nested && "pl-3",
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
  );
}

function NavGroup({
  group,
  pathname,
  hasSeller,
  hasPlan,
}: {
  group: SellerNavGroup;
  pathname: string;
  hasSeller: boolean;
  hasPlan: boolean;
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
    <li className="w-full">
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
          {group.items.map((item) => {
            const locked =
              (item.requiresSeller && !hasSeller) ||
              (item.requiresPlan && !hasPlan);
            return (
              <li key={item.href}>
                <NavLink
                  item={item}
                  pathname={pathname}
                  locked={locked}
                  hasSeller={hasSeller}
                  nested
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const sellerQuery = useSeller();
  const subscriptionQuery = useCurrentSellerSubscription();

  const hasSeller = sellerQuery.data != null;
  const hasPlan = subscriptionQuery.data != null;

  return (
    <aside
      aria-label="Painel"
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
            {SELLER_NAV.map((entry) => {
              if (entry.type === "group") {
                return (
                  <NavGroup
                    key={entry.group.id}
                    group={entry.group}
                    pathname={pathname}
                    hasSeller={hasSeller}
                    hasPlan={hasPlan}
                  />
                );
              }

              const item = entry.item;
              const locked =
                (item.requiresSeller && !hasSeller) ||
                (item.requiresPlan && !hasPlan);

              return (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    pathname={pathname}
                    locked={locked}
                    hasSeller={hasSeller}
                  />
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

export { Sidebar };
