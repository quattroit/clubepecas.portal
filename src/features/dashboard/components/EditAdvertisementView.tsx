"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { AdvertisementForm } from "@/features/dashboard/components/AdvertisementForm";
import { AdvertisementPhotosManager } from "@/features/dashboard/components/photos/AdvertisementPhotosManager";
import { SellerProfileSkeleton } from "@/features/dashboard/components/SellerProfileSkeleton";
import type { AdvertisementFormValues } from "@/features/dashboard/schemas/advertisementFormSchema";
import { ROUTES } from "@/constants/routes";
import { useAdvertisementById } from "@/hooks/api/useAdvertisementById";
import { useCategories } from "@/hooks/api/useCategories";
import { useUpdateAdvertisement } from "@/hooks/api/useUpdateAdvertisement";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  mapAdvertisementDetailToFormValues,
  mapAdvertisementFormToUpdateRequest,
} from "@/mappers/advertisement-form.mapper";
import { parseRouteId } from "@/utils/parseRouteId";

function EditAdvertisementView() {
  const params = useParams<{ id: string }>();
  const id = parseRouteId(params.id);

  const advertisementQuery = useAdvertisementById(id ?? 0);
  const categoriesQuery = useCategories();
  const vehicleBrandsQuery = useVehicleBrands();
  const updateMutation = useUpdateAdvertisement();
  const categories = categoriesQuery.data ?? [];
  const vehicleBrands = vehicleBrandsQuery.data ?? [];
  const catalogsReady =
    categoriesQuery.isSuccess && vehicleBrandsQuery.isSuccess;

  const formValues = useMemo(() => {
    if (!advertisementQuery.data?.detail || categories.length === 0) {
      return undefined;
    }
    return mapAdvertisementDetailToFormValues(
      advertisementQuery.data.detail,
      categories,
    );
  }, [advertisementQuery.data?.detail, categories]);

  const handleSubmit = (values: AdvertisementFormValues) => {
    if (!id) return;
    updateMutation.mutate({
      id,
      request: mapAdvertisementFormToUpdateRequest(values),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Editar anúncio</h1>
        <p className="text-small text-muted-foreground">
          {advertisementQuery.data?.title
            ? `Atualize os dados de “${advertisementQuery.data.title}”.`
            : "Atualize os dados do seu anúncio."}
        </p>
      </div>

      {advertisementQuery.isLoading ||
      (advertisementQuery.isSuccess && !catalogsReady) ? (
        <SellerProfileSkeleton label="Carregando anúncio" />
      ) : null}

      {advertisementQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o anúncio"
          message={getFriendlyErrorMessage(advertisementQuery.error)}
        />
      ) : null}

      {categoriesQuery.isError || vehicleBrandsQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar as opções do anúncio"
          message={getFriendlyErrorMessage(
            categoriesQuery.error ?? vehicleBrandsQuery.error,
          )}
        />
      ) : null}

      {!advertisementQuery.isLoading &&
      !advertisementQuery.isError &&
      advertisementQuery.data &&
      catalogsReady &&
      formValues &&
      id ? (
        <>
          <AdvertisementPhotosManager
            advertisementId={id}
            photos={advertisementQuery.data.photos}
            maxPhotos={advertisementQuery.data.maxPhotos}
            usedCount={advertisementQuery.data.usedCount}
            remaining={advertisementQuery.data.remaining}
            maxFileSizeMB={advertisementQuery.data.maxFileSizeMB}
            loading={advertisementQuery.isFetching && !advertisementQuery.data}
            onChanged={() => {
              void advertisementQuery.refetch();
            }}
            disabled={updateMutation.isPending}
          />

          <AdvertisementForm
            key={advertisementQuery.data.id}
            mode="edit"
            defaultValues={formValues}
            categories={categories}
            categoriesLoading={categoriesQuery.isLoading}
            vehicleBrands={vehicleBrands}
            vehicleBrandsLoading={vehicleBrandsQuery.isLoading}
            isSubmitting={updateMutation.isPending}
            submitError={
              updateMutation.isError ? updateMutation.error : undefined
            }
            onSubmit={handleSubmit}
            cancelHref={ROUTES.MY_ADVERTISEMENTS}
          />
        </>
      ) : null}
    </div>
  );
}

export { EditAdvertisementView };
