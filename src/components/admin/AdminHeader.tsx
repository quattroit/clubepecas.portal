"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

type AdminHeaderProps = {
  onOpenMobileNav?: () => void;
};

function AdminHeader({ onOpenMobileNav }: AdminHeaderProps) {
  const { user, logout, isLoggingOut } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-surface border-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 shadow-xs sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir menu de navegação"
          onClick={onOpenMobileNav}
        >
          <Menu className="size-5" aria-hidden />
        </Button>
        <Logo href={ROUTES.ADMIN} size="sm" />
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <span className="bg-primary h-5 w-1 rounded-full" aria-hidden />
        <p className="text-small text-foreground font-medium tracking-wide">
          Área administrativa
        </p>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <p className="text-small text-muted-foreground hidden max-w-[12rem] truncate sm:block">
            {user.fullName}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoggingOut}
          onClick={() => {
            logout();
            router.replace(ROUTES.LOGIN_ADMIN);
          }}
        >
          <LogOut className="size-4" aria-hidden />
          {isLoggingOut ? "Saindo…" : "Sair"}
        </Button>
        <Link
          href={ROUTES.HOME}
          className="text-small text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          Site
        </Link>
      </div>
    </header>
  );
}

export { AdminHeader };
export type { AdminHeaderProps };
