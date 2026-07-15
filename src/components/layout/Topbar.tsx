import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { ROUTES } from "@/constants/routes";

function Topbar() {
  return (
    <header className="bg-surface border-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
      <div className="md:hidden">
        <Logo href={ROUTES.HOME} size="sm" />
      </div>
      <p className="text-small text-muted-foreground hidden md:block">
        Área do vendedor
      </p>
      <UserMenu />
    </header>
  );
}

export { Topbar };
