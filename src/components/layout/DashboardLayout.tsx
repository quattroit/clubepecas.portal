import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background flex min-h-full flex-1 flex-col md:flex-row">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="md:hidden">
          <Sidebar />
        </div>
        <main id="conteudo-principal" className="flex-1 p-5 sm:p-8 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export { DashboardLayout };
