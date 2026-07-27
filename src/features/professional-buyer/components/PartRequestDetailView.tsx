"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil, XCircle } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Button, buttonVariants } from "@/components/ui/button";
import { CancelPartRequestDialog } from "@/features/professional-buyer/components/CancelPartRequestDialog";
import { PartRequestStatusBadge } from "@/features/professional-buyer/components/PartRequestStatusBadge";
import {
  ROUTES,
  editProfessionalBuyerPartRequestPath,
} from "@/constants/routes";
import {
  isPartRequestCancellable,
  isPartRequestEditable,
} from "@/contracts/part-requests";
import { useCancelPartRequest } from "@/hooks/api/useCancelPartRequest";
import { usePartRequest } from "@/hooks/api/usePartRequest";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatCityLabel } from "@/mappers/city.mapper";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { parseRouteId } from "@/utils/parseRouteId";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function PartRequestDetailView() {
  const params = useParams<{ id: string }>();
  const id = parseRouteId(params.id);
  const [cancelOpen, setCancelOpen] = useState(false);

  const detailQuery = usePartRequest(id ?? 0, Boolean(id));
  const cancelMutation = useCancelPartRequest();

  const data = detailQuery.data;
  const cityLabel = useMemo(
    () =>
      data
        ? formatCityLabel({ name: data.cityName, state: data.cityState })
        : "",
    [data],
  );

  const handleConfirmCancel = () => {
    if (!id) return;
    cancelMutation.mutate(id, {
      onSuccess: () => setCancelOpen(false),
    });
  };

  if (!id) {
    return (
      <ErrorMessage
        title="Solicitação inválida"
        message="O identificador informado na URL não é válido."
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href={ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS}
            className="text-primary text-sm font-medium hover:underline"
          >
            ← Voltar para solicitações
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1">{data?.title ?? "Solicitação"}</h1>
            {data ? (
              <PartRequestStatusBadge
                status={data.status}
                label={data.statusLabel}
              />
            ) : null}
          </div>
        </div>

        {data ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            {isPartRequestEditable(data.status) ? (
              <Link
                href={editProfessionalBuyerPartRequestPath(id)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <Pencil aria-hidden />
                Editar
              </Link>
            ) : null}
            {isPartRequestCancellable(data.status) ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setCancelOpen(true)}
              >
                <XCircle aria-hidden />
                Cancelar
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {detailQuery.isLoading ? (
        <PageLoader label="Carregando solicitação…" />
      ) : null}

      {detailQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar a solicitação"
          message={getFriendlyErrorMessage(detailQuery.error)}
        />
      ) : null}

      {data ? (
        <section className="border-border bg-surface rounded-2xl border p-5 shadow-xs sm:p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <DetailField label="Categoria" value={data.categoryName} />
            <DetailField
              label="Quantidade"
              value={String(data.requestedQuantity)}
            />
            <DetailField label="Marca" value={data.vehicleBrandName} />
            <DetailField label="Modelo" value={data.vehicleModelName} />
            <DetailField
              label="Ano fabricação"
              value={String(data.manufacturingYear)}
            />
            <DetailField
              label="Ano modelo"
              value={data.modelYear != null ? String(data.modelYear) : "—"}
            />
            <DetailField label="Motor" value={data.engine?.trim() || "—"} />
            <DetailField label="Cidade" value={cityLabel} />
            <DetailField
              label="Fornecedores"
              value={String(data.maximumSuppliers)}
            />
            <DetailField label="Criada em" value={formatDate(data.createdAt)} />
            <DetailField
              label="Atualizada em"
              value={data.updatedAt ? formatDate(data.updatedAt) : "—"}
            />
          </dl>

          {data.description?.trim() ? (
            <div className="mt-6 flex flex-col gap-1.5">
              <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Descrição
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      <CancelPartRequestDialog
        open={cancelOpen}
        requestTitle={data?.title}
        isCancelling={cancelMutation.isPending}
        onOpenChange={setCancelOpen}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}

export { PartRequestDetailView };
