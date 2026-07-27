"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Users } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useMyPartRequests } from "@/hooks/api/useMyPartRequests";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function ProfessionalBuyerDashboardView() {
  const summaryQuery = useMyPartRequests({ page: 1, pageSize: 1 });
  const summary = summaryQuery.data?.summary;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Bem-vindo ao ClubePeças</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Envie solicitações de peças e encontre fornecedores na plataforma.
        </p>
      </div>

      {summaryQuery.isLoading ? (
        <PageLoader label="Carregando resumo…" />
      ) : null}

      {summaryQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o resumo"
          message={getFriendlyErrorMessage(summaryQuery.error)}
        />
      ) : null}

      {summary ? (
        <div className="flex flex-col gap-4">
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="text-primary size-5" aria-hidden />
                  Solicitações
                </CardTitle>
                <CardDescription>
                  Acompanhe suas solicitações de peças abertas e canceladas.
                </CardDescription>
              </div>
              <Link
                href={ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0",
                )}
              >
                Ver todas
                <ArrowRight aria-hidden />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryMetric label="Total" value={summary.total} />
                <SummaryMetric label="Abertas" value={summary.open} />
                <SummaryMetric label="Canceladas" value={summary.cancelled} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="text-primary size-5" aria-hidden />
                Fornecedores
              </CardTitle>
              <CardDescription>
                Fornecedores compatíveis e status de contato das suas
                solicitações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryMetric label="Encontrados" value={summary.suppliersFound} />
                <SummaryMetric
                  label="Contatados"
                  value={summary.suppliersContacted}
                />
                <SummaryMetric
                  label="Pendentes"
                  value={summary.suppliersPending}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export { ProfessionalBuyerDashboardView };
