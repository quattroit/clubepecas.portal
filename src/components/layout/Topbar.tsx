import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { ROUTES } from "@/constants/routes";

function Topbar() {
  return (
    <header className="bg-surface border-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 shadow-xs sm:px-6">
      <div className="md:hidden">
        <Logo href={ROUTES.HOME} size="sm" />
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <span className="bg-primary h-5 w-1 rounded-full" aria-hidden />
        <p className="text-small text-foreground font-medium tracking-wide">
          Área do vendedor
        </p>
      </div>
      <UserMenu />
    </header>
  );
}

export { Topbar };
