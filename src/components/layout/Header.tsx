"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import { Suspense, useState } from "react";

import { AnnounceButton } from "@/components/announce/AnnounceButton";
import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getVisibleNavItems, MAIN_NAV_ITEMS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { SearchInput } from "@/features/marketplace/components/SearchInput";
import { cn } from "@/lib/utils";
import { usePlatformSettings } from "@/hooks/api/usePlatformSettings";
import { APP_NAME, APP_LOGO_SRC } from "@/constants/app";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

function HeaderSearchField({
  id,
  tone,
}: {
  id: string;
  tone: "on-brand";
}) {
  const searchParams = useSearchParams();
  const q = normalizeSearchQuery(searchParams.get("q") ?? "");

  return (
    <SearchInput
      key={`${id}-${q}`}
      id={id}
      tone={tone}
      defaultValue={q}
    />
  );
}

function HeaderSearch({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Suspense fallback={<SearchInput id={id} tone="on-brand" />}>
        <HeaderSearchField id={id} tone="on-brand" />
      </Suspense>
    </div>
  );
}

function HeaderNavLink({
  href,
  label,
  className,
  onNavigate,
  onBrand = false,
}: {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
  onBrand?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "focus-visible:ring-ring rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2",
        onBrand
          ? cn(
              "text-brand-muted hover:bg-brand-foreground/10 hover:text-brand-foreground",
              isActive && "bg-brand-foreground/12 text-brand-foreground",
            )
          : cn(
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive && "bg-primary/10 text-primary",
            ),
        className,
      )}
    >
      {label}
    </Link>
  );
}

function GuestActions({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href={ROUTES.LOGIN}
        onClick={onNavigate}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "text-brand-muted hover:bg-brand-foreground/10 hover:text-brand-foreground",
        )}
      >
        Entrar
      </Link>
      <Link
        href={ROUTES.REGISTER}
        onClick={onNavigate}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "border-brand-border bg-transparent text-brand-foreground hover:bg-brand-foreground/10",
        )}
      >
        Cadastrar
      </Link>
      <AnnounceButton variant="primary" size="sm" onNavigate={onNavigate} />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout, isLoggingOut } = useAuth();
  const platformSettingsQuery = usePlatformSettings();
  const platformName = platformSettingsQuery.data?.platformName ?? APP_NAME;
  const logoUrl =
    platformSettingsQuery.data?.logoDarkUrl ??
    platformSettingsQuery.data?.logoUrl ??
    APP_LOGO_SRC;
  const navItems = getVisibleNavItems(MAIN_NAV_ITEMS);
  const closeMenu = () => setOpen(false);

  return (
    <header className="surface-brand border-brand-border sticky top-0 z-40 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo
            className="shrink-0"
            size="sm"
            priority
            onBrand
            src={logoUrl}
            alt={platformName}
          />

          <HeaderSearch
            id="header-search-desktop"
            className="mx-2 hidden min-w-0 flex-1 md:block"
          />

          <nav
            aria-label="Principal"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {navItems.map((item) => (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                onBrand
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            {!isLoading && isAuthenticated ? (
              <>
                <AnnounceButton
                  variant="primary"
                  size="sm"
                  className="hidden sm:inline-flex"
                />
                <div className="hidden sm:block">
                  <UserMenu tone="on-brand" />
                </div>
              </>
            ) : null}

            {!isLoading && !isAuthenticated ? (
              <div className="hidden sm:flex">
                <GuestActions />
              </div>
            ) : null}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="border-brand-border bg-transparent text-brand-foreground hover:bg-brand-foreground/10 lg:hidden"
                    aria-label="Abrir menu de navegação"
                  />
                }
              >
                <Menu className="size-4" />
              </SheetTrigger>

              <SheetContent side="right" className="w-full max-w-xs p-0">
                <SheetHeader className="border-border border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <nav
                  aria-label="Menu mobile"
                  className="flex flex-1 flex-col gap-1 p-4"
                >
                  {navItems.map((item) => (
                    <HeaderNavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      onNavigate={closeMenu}
                      className="hover:bg-muted block px-3 py-2.5"
                    />
                  ))}
                </nav>

                <div className="border-border mt-auto flex flex-col gap-2 border-t p-4">
                  {isAuthenticated ? (
                    <>
                      <p className="text-small truncate font-medium">
                        {user?.fullName}
                      </p>
                      <Link
                        href={ROUTES.MY_ADVERTISEMENTS}
                        onClick={closeMenu}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full justify-center",
                        )}
                      >
                        Meus anúncios
                      </Link>
                      <Link
                        href={ROUTES.PROFILE}
                        onClick={closeMenu}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full justify-center",
                        )}
                      >
                        Meu perfil
                      </Link>
                      <AnnounceButton
                        variant="primary"
                        className="w-full justify-center"
                        onNavigate={closeMenu}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoggingOut}
                        onClick={() => {
                          logout();
                          closeMenu();
                          router.replace(ROUTES.HOME);
                        }}
                      >
                        {isLoggingOut ? "Saindo…" : "Sair"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={ROUTES.LOGIN}
                        onClick={closeMenu}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full justify-center",
                        )}
                      >
                        Entrar
                      </Link>
                      <Link
                        href={ROUTES.REGISTER}
                        onClick={closeMenu}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full justify-center",
                        )}
                      >
                        Cadastrar
                      </Link>
                      <AnnounceButton
                        variant="primary"
                        className="w-full justify-center"
                        onNavigate={closeMenu}
                      />
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <HeaderSearch id="header-search-mobile" className="md:hidden" />
      </div>
    </header>
  );
}

export { Header };
