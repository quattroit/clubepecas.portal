"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PartRequestForm } from "@/features/professional-buyer/components/PartRequestForm";
import {
  mapPartRequestDtoToFormInput,
  mapPartRequestFormToUpdateRequest,
} from "@/features/professional-buyer/mappers/part-request-form.mapper";
import type { PartRequestFormValues } from "@/features/professional-buyer/schemas/partRequestFormSchema";
import {
  ROUTES,
  professionalBuyerPartRequestPath,
} from "@/constants/routes";
import { PartRequestStatus } from "@/contracts/common/enums";
import { useCategories } from "@/hooks/api/useCategories";
import { usePartRequest } from "@/hooks/api/usePartRequest";
import { useUpdatePartRequest } from "@/hooks/api/useUpdatePartRequest";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { parseRouteId } from "@/utils/parseRouteId";

function EditPartRequestView() {
  const params = useParams<{ id: string }>();
  const id = parseRouteId(params.id);

  const detailQuery = usePartRequest(id ?? 0, Boolean(id));
  const categoriesQuery = useCategories();
  const vehicleBrandsQuery = useVehicleBrands();
  const updateMutation = useUpdatePartRequest();

  const defaultValues = useMemo(
    () =>
      detailQuery.data
        ? mapPartRequestDtoToFormInput(detailQuery.data)
        : undefined,
    [detailQuery.data],
  );

  const handleSubmit = (values: PartRequestFormValues) => {
    if (!id) return;
    updateMutation.mutate({
      id,
      request: mapPartRequestFormToUpdateRequest(values),
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

  const isNotEditable =
    detailQuery.isSuccess &&
    detailQuery.data &&
    detailQuery.data.status !== PartRequestStatus.Open;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Editar solicitação</h1>
          <p className="text-small text-muted-foreground">
            {detailQuery.data?.title
              ? `Atualize os dados de “${detailQuery.data.title}”.`
              : "Atualize os dados da solicitação."}
          </p>
        </div>

        <Link
          href={
            id
              ? professionalBuyerPartRequestPath(id)
              : ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS
          }
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          Cancelar
        </Link>
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

      {isNotEditable ? (
        <EmptyState
          title="Solicitação não editável"
          description="Somente solicitações abertas podem ser editadas."
          action={
            <Link
              href={professionalBuyerPartRequestPath(id)}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Ver detalhes
            </Link>
          }
        />
      ) : null}

      {!detailQuery.isLoading &&
      !detailQuery.isError &&
      detailQuery.data &&
      detailQuery.data.status === PartRequestStatus.Open &&
      defaultValues ? (
        <PartRequestForm
          mode="edit"
          defaultValues={defaultValues}
          categories={categoriesQuery.data ?? []}
          categoriesLoading={categoriesQuery.isLoading}
          vehicleBrands={vehicleBrandsQuery.data ?? []}
          vehicleBrandsLoading={vehicleBrandsQuery.isLoading}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.isError ? updateMutation.error : undefined}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}

export { EditPartRequestView };
