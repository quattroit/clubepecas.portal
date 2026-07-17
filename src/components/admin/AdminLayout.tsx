"use client";

import { useState } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AdminLayoutProps = {
  children: React.ReactNode;
};

/**
 * Shell administrativo:
 * - Desktop (lg+): sidebar completa fixa
 * - Tablet (md–lg): sidebar recolhida (ícones)
 * - Mobile (&lt;md): drawer
 */
function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-full flex-1 flex-col md:flex-row">
      <div className="hidden md:flex lg:hidden">
        <AdminSidebar variant="collapsed" />
      </div>
      <div className="hidden lg:flex">
        <AdminSidebar variant="full" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-[min(100%,18rem)] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu administrativo</SheetTitle>
            </SheetHeader>
            <AdminSidebar
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

export { AdminLayout };
export type { AdminLayoutProps };
