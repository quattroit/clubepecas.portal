"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { AdvertisementForm } from "@/features/dashboard/components/AdvertisementForm";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/api/useCategories";
import { useCreateAdvertisement } from "@/hooks/api/useCreateAdvertisement";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { mapAdvertisementFormToCreateRequest } from "@/mappers/advertisement-form.mapper";
import { cn } from "@/lib/utils";
import type { AdvertisementFormValues } from "@/features/dashboard/schemas/advertisementFormSchema";

function NewAdvertisementView() {
  const categoriesQuery = useCategories();
  const vehicleBrandsQuery = useVehicleBrands();
  const createMutation = useCreateAdvertisement();

  const handleSubmit = (values: AdvertisementFormValues) => {
    createMutation.mutate({
      request: mapAdvertisementFormToCreateRequest(values),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Nova peça</h1>
          <p className="text-small text-muted-foreground">
            Preencha os dados para publicar um anúncio. Depois você poderá
            enviar as fotos.
          </p>
        </div>

        <Link
          href={ROUTES.MY_ADVERTISEMENTS}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shrink-0",
          )}
        >
          Cancelar
        </Link>
      </div>

      <AdvertisementForm
        mode="create"
        categories={categoriesQuery.data ?? []}
        categoriesLoading={categoriesQuery.isLoading}
        vehicleBrands={vehicleBrandsQuery.data ?? []}
        vehicleBrandsLoading={vehicleBrandsQuery.isLoading}
        isSubmitting={createMutation.isPending}
        submitError={createMutation.isError ? createMutation.error : undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export { NewAdvertisementView };
