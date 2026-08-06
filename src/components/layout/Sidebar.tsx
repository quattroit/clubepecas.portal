"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Home,
  LayoutDashboard,
  Package,
  Receipt,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useSeller } from "@/hooks/api/useSeller";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: ROUTES.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
    requiresSeller: true,
    requiresPlan: true,
  },
  {
    href: ROUTES.MY_ADVERTISEMENTS,
    label: "Meus anúncios",
    icon: Package,
    exact: false,
    requiresSeller: true,
    requiresPlan: true,
  },
  {
    href: ROUTES.MY_PLAN,
    label: "Meu Plano",
    icon: CreditCard,
    exact: true,
    requiresSeller: true,
    requiresPlan: false,
  },
  {
    href: ROUTES.SELLER_QUOTATIONS,
    label: "Central de Cotações",
    icon: Receipt,
    exact: false,
    requiresSeller: true,
    requiresPlan: false,
  },
  {
    href: ROUTES.PROFILE,
    label: "Meu perfil",
    icon: UserRound,
    exact: true,
    requiresSeller: false,
    requiresPlan: false,
  },
] as const;

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
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const locked =
                (item.requiresSeller && !hasSeller) ||
                (item.requiresPlan && !hasPlan);

              return (
                <li key={item.href}>
                  {locked ? (
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
                  ) : (
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
                  )}
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
