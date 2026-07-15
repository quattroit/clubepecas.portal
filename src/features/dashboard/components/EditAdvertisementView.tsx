"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { buttonVariants } from "@/components/ui/button";
import { AdvertisementForm } from "@/features/dashboard/components/AdvertisementForm";
import { SellerProfileSkeleton } from "@/features/dashboard/components/SellerProfileSkeleton";
import type { AdvertisementFormValues } from "@/features/dashboard/schemas/advertisementFormSchema";
import { ROUTES } from "@/constants/routes";
import { useAdvertisementById } from "@/hooks/api/useAdvertisementById";
import { useCategories } from "@/hooks/api/useCategories";
import { useUpdateAdvertisement } from "@/hooks/api/useUpdateAdvertisement";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  mapAdvertisementFormToPhotoUrls,
  mapAdvertisementFormToUpdateRequest,
} from "@/mappers/advertisement-form.mapper";
import { cn } from "@/lib/utils";

function EditAdvertisementView() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const advertisementQuery = useAdvertisementById(id ?? "");
  const categoriesQuery = useCategories();
  const updateMutation = useUpdateAdvertisement();

  const handleSubmit = (values: AdvertisementFormValues) => {
    if (!id || !advertisementQuery.data) return;
    updateMutation.mutate({
      id,
      request: mapAdvertisementFormToUpdateRequest(values),
      photoUrls: mapAdvertisementFormToPhotoUrls(values),
      existingPhotos: advertisementQuery.data.photos,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Editar anúncio</h1>
          <p className="text-small text-muted-foreground">
            {advertisementQuery.data?.title
              ? `Atualize os dados de “${advertisementQuery.data.title}”.`
              : "Atualize os dados do seu anúncio."}
          </p>
        </div>

        <Link
          href={ROUTES.MY_ADVERTISEMENTS}
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          Cancelar
        </Link>
      </div>

      {advertisementQuery.isLoading ? (
        <SellerProfileSkeleton label="Carregando anúncio" />
      ) : null}

      {advertisementQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o anúncio"
          message={getFriendlyErrorMessage(advertisementQuery.error)}
        />
      ) : null}

      {!advertisementQuery.isLoading &&
      !advertisementQuery.isError &&
      advertisementQuery.data ? (
        <AdvertisementForm
          key={advertisementQuery.data.id}
          mode="edit"
          defaultValues={advertisementQuery.data.formValues}
          categories={categoriesQuery.data ?? []}
          categoriesLoading={categoriesQuery.isLoading}
          isSubmitting={updateMutation.isPending}
          submitError={
            updateMutation.isError ? updateMutation.error : undefined
          }
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}

export { EditAdvertisementView };
