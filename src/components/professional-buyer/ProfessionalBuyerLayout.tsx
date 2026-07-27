"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type ProfessionalBuyerLayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  {
    href: ROUTES.PROFESSIONAL_BUYER,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS,
    label: "Solicitações",
    icon: ClipboardList,
    exact: false,
  },
] as const;

function ProfessionalBuyerLayout({ children }: ProfessionalBuyerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="bg-background flex min-h-full flex-1 flex-col">
      <header className="bg-surface border-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 shadow-xs sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo href={ROUTES.PROFESSIONAL_BUYER} size="sm" />
          <span className="bg-primary hidden h-5 w-1 rounded-full sm:block" aria-hidden />
          <p className="text-small text-foreground hidden font-medium tracking-wide sm:block">
            Área do comprador profissional
          </p>
        </div>

        <nav
          aria-label="Navegação do comprador profissional"
          className="flex items-center gap-1 md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-4" aria-hidden />
              </Link>
            );
          })}
        </nav>

        <nav
          aria-label="Navegação do comprador profissional"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <UserMenu />
      </header>

      <main id="conteudo-principal" className="flex-1 p-5 sm:p-8 md:p-10">
        {children}
      </main>
    </div>
  );
}

export { ProfessionalBuyerLayout };
