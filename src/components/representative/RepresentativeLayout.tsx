"use client";

import { useState } from "react";

import { RepresentativeHeader } from "@/components/representative/RepresentativeHeader";
import { RepresentativeSidebar } from "@/components/representative/RepresentativeSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type RepresentativeLayoutProps = {
  children: React.ReactNode;
};

/**
 * Shell do portal do representante — mesmo padrão visual do `AdminLayout`
 * (sidebar + header + main), rotulado para Representante (Sprint 10.6):
 * - Desktop (lg+): sidebar completa fixa
 * - Tablet (md–lg): sidebar recolhida (ícones)
 * - Mobile (<md): drawer
 */
function RepresentativeLayout({ children }: RepresentativeLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-full flex-1 flex-col md:flex-row">
      <div className="hidden md:flex lg:hidden">
        <RepresentativeSidebar variant="collapsed" />
      </div>
      <div className="hidden lg:flex">
        <RepresentativeSidebar variant="full" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <RepresentativeHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-[min(100%,18rem)] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu do portal do representante</SheetTitle>
            </SheetHeader>
            <RepresentativeSidebar
              variant="drawer"
              onNavigate={() => setMobileNavOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <main id="conteudo-principal" className="flex-1 p-5 sm:p-8 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export { RepresentativeLayout };
export type { RepresentativeLayoutProps };
