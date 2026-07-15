"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

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
import { SearchInput } from "@/features/marketplace";
import { cn } from "@/lib/utils";

function HeaderNavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-2 py-1.5 text-sm font-medium outline-none focus-visible:ring-2",
        isActive && "text-foreground",
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
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        Entrar
      </Link>
      <Link
        href={ROUTES.REGISTER}
        onClick={onNavigate}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
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
  const navItems = getVisibleNavItems(MAIN_NAV_ITEMS);
  const closeMenu = () => setOpen(false);

  return (
    <header className="bg-surface/95 border-border sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo className="shrink-0" size="sm" priority />

          <div className="mx-2 hidden min-w-0 flex-1 md:block">
            <SearchInput id="header-search-desktop" />
          </div>

          <nav
            aria-label="Principal"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {navItems.map((item) => (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={item.label}
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
                  <UserMenu />
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
                    className="lg:hidden"
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

        <div className="md:hidden">
          <SearchInput id="header-search-mobile" />
        </div>
      </div>
    </header>
  );
}

export { Header };
