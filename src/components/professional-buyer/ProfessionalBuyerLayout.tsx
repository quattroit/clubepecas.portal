import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { ROUTES } from "@/constants/routes";

type ProfessionalBuyerLayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout simples da área do comprador profissional (Sprint 9.1).
 */
function ProfessionalBuyerLayout({ children }: ProfessionalBuyerLayoutProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col">
      <header className="bg-surface border-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 shadow-xs sm:px-6">
        <div className="flex items-center gap-3">
          <Logo href={ROUTES.PROFESSIONAL_BUYER} size="sm" />
          <span className="bg-primary hidden h-5 w-1 rounded-full sm:block" aria-hidden />
          <p className="text-small text-foreground hidden font-medium tracking-wide sm:block">
            Área do comprador profissional
          </p>
        </div>
        <UserMenu />
      </header>

      <main id="conteudo-principal" className="flex-1 p-5 sm:p-8 md:p-10">
        {children}
      </main>
    </div>
  );
}

export { ProfessionalBuyerLayout };
