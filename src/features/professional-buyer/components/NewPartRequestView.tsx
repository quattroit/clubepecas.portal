"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { PartRequestForm } from "@/features/professional-buyer/components/PartRequestForm";
import {
  mapPartRequestFormToCreateRequest,
} from "@/features/professional-buyer/mappers/part-request-form.mapper";
import type { PartRequestFormValues } from "@/features/professional-buyer/schemas/partRequestFormSchema";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/api/useCategories";
import { useCreatePartRequest } from "@/hooks/api/useCreatePartRequest";
import { useVehicleBrands } from "@/hooks/api/useVehicleBrands";
import { cn } from "@/lib/utils";

function NewPartRequestView() {
  const categoriesQuery = useCategories();
  const vehicleBrandsQuery = useVehicleBrands();
  const createMutation = useCreatePartRequest();

  const handleSubmit = (values: PartRequestFormValues) => {
    createMutation.mutate(mapPartRequestFormToCreateRequest(values));
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Nova solicitação</h1>
          <p className="text-small text-muted-foreground">
            Descreva a peça que você precisa e quantos fornecedores deseja contatar.
          </p>
        </div>

        <Link
          href={ROUTES.PROFESSIONAL_BUYER_PART_REQUESTS}
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          Cancelar
        </Link>
      </div>

      <PartRequestForm
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

export { NewPartRequestView };
