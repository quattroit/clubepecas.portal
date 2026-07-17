"use client";

import { useState } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { AdvertisementForm } from "@/features/dashboard/components/AdvertisementForm";
import {
  CreateAdvertisementPhotosPicker,
  type PendingPhoto,
} from "@/features/dashboard/components/photos/CreateAdvertisementPhotosPicker";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/api/useCategories";
import { useCreateAdvertisement } from "@/hooks/api/useCreateAdvertisement";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { mapAdvertisementFormToCreateRequest } from "@/mappers/advertisement-form.mapper";
import { cn } from "@/lib/utils";
import type { AdvertisementFormValues } from "@/features/dashboard/schemas/advertisementFormSchema";

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE_MB = 10;

function NewAdvertisementView() {
  const categoriesQuery = useCategories();
  const vehicleBrandsQuery = useVehicleBrands();
  const createMutation = useCreateAdvertisement();
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);

  const handleSubmit = (values: AdvertisementFormValues) => {
    createMutation.mutate({
      request: mapAdvertisementFormToCreateRequest(values),
      photos: pendingPhotos.map((photo) => photo.file),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Nova peça</h1>
          <p className="text-small text-muted-foreground">
            Preencha os dados e, se quiser, adicione até {MAX_PHOTOS} fotos
            antes de publicar.
          </p>
        </div>

        <Link
          href={ROUTES.MY_ADVERTISEMENTS}
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          Cancelar
        </Link>
      </div>

      <CreateAdvertisementPhotosPicker
        maxPhotos={MAX_PHOTOS}
        maxFileSizeMB={MAX_FILE_SIZE_MB}
        disabled={createMutation.isPending}
        value={pendingPhotos}
        onChange={setPendingPhotos}
      />

      <AdvertisementForm
        mode="create"
        categories={categoriesQuery.data ?? []}
        categoriesLoading={categoriesQuery.isLoading}
        vehicleBrands={vehicleBrandsQuery.data ?? []}
        vehicleBrandsLoading={vehicleBrandsQuery.isLoading}
        isSubmitting={createMutation.isPending}
        submitError={createMutation.isError ? createMutation.error : undefined}
        onSubmit={handleSubmit}
        submittingLabel={
          pendingPhotos.length > 0 ? "Publicando e enviando fotos…" : undefined
        }
      />
    </div>
  );
}

export { NewAdvertisementView };
