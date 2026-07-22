"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/layout/Logo";
import { useRepresentativeAuth } from "@/components/providers/RepresentativeAuthProvider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { representativeAuthService } from "@/services/representative-auth.service";

type RepresentativeHeaderProps = {
  onOpenMobileNav?: () => void;
};

function RepresentativeHeader({ onOpenMobileNav }: RepresentativeHeaderProps) {
  const { representative, logout, isLoggingOut } = useRepresentativeAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.REPRESENTATIVE_LOGIN);
    // Melhor esforço — a sessão local já foi limpa independentemente do resultado.
    void representativeAuthService.logout().catch(() => {
      /* noop */
    });
    toast.success("Você saiu do portal do representante.");
  };

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
        <Logo href={ROUTES.REPRESENTATIVE} size="sm" />
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <span className="bg-primary h-5 w-1 rounded-full" aria-hidden />
        <p className="text-small text-foreground font-medium tracking-wide">
          Portal do representante
        </p>
      </div>

      <div className="flex items-center gap-3">
        {representative ? (
          <div className="hidden max-w-[16rem] flex-col text-right sm:flex">
            <span className="text-small text-foreground truncate font-medium">
              {representative.fullName}
            </span>
            <span className="text-muted-foreground truncate font-mono text-xs">
              {representative.representativeCode}
            </span>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoggingOut}
          onClick={handleLogout}
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

export { RepresentativeHeader };
export type { RepresentativeHeaderProps };
