import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Painel",
  description: "Área autenticada do ClubePeças.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Dashboard</h1>
        <p className="text-small text-muted-foreground">
          Bem-vindo à área autenticada. Gerencie seus anúncios pelo menu.
        </p>
      </div>

      <Link
        href={ROUTES.MY_ADVERTISEMENTS}
        className={cn(buttonVariants({ variant: "default" }), "w-fit")}
      >
        Ver meus anúncios
      </Link>
    </div>
  );
}
