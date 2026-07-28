import { Topbar } from "@/components/layout/Topbar";
import { ProfessionalBuyerSidebar } from "@/components/professional-buyer/ProfessionalBuyerSidebar";

type ProfessionalBuyerLayoutProps = {
  children: React.ReactNode;
};

function ProfessionalBuyerLayout({ children }: ProfessionalBuyerLayoutProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col md:flex-row">
      <div className="hidden md:flex">
        <ProfessionalBuyerSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar areaLabel="Área do comprador profissional" />
        <div className="md:hidden">
          <ProfessionalBuyerSidebar />
        </div>
        <main id="conteudo-principal" className="flex-1 p-5 sm:p-8 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export { ProfessionalBuyerLayout };
