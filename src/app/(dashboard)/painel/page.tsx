import type { Metadata } from "next";
import Link from "next/link";
import { Package, PlusCircle, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { SellerMetricsSection } from "@/features/dashboard/components/metrics/SellerMetricsSection";
import { SellerPlanUsageCard } from "@/features/dashboard/components/SellerPlanUsageCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Painel",
  description: "Área autenticada do ClubePeças.",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  {
    href: ROUTES.MY_ADVERTISEMENTS,
    title: "Meus anúncios",
    description: "Acompanhe, edite e gerencie suas peças publicadas.",
    icon: Package,
  },
  {
    href: ROUTES.NEW_ADVERTISEMENT,
    title: "Novo anúncio",
    description: "Publique uma nova peça no marketplace.",
    icon: PlusCircle,
  },
  {
    href: ROUTES.PROFILE,
    title: "Meu perfil",
    description: "Atualize os dados da sua loja e contato.",
    icon: UserRound,
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-h1">Dashboard</h1>
        <p className="text-body text-muted-foreground max-w-xl">
          Bem-vindo à área do vendedor. Acompanhe o desempenho da sua loja e
          gerencie seus anúncios.
        </p>
      </div>

      <SellerMetricsSection />

      <SellerPlanUsageCard />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Card className="card-interactive h-full">
              <CardHeader className="flex flex-row items-start gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-h3">{title}</CardTitle>
                  <p className="text-small">{description}</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Link
        href={ROUTES.MY_ADVERTISEMENTS}
        className={cn(buttonVariants({ variant: "primary" }), "w-fit")}
      >
        Ir para meus anúncios
      </Link>
    </div>
  );
}
