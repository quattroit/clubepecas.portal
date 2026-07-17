"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  advertisementFormDefaultValues,
  advertisementFormSchema,
  type AdvertisementFormValues,
} from "@/features/dashboard/schemas/advertisementFormSchema";
import { useVehicleModels } from "@/hooks/api/useVehicleModels";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  getConditionLabel,
  listAdvertisementConditions,
} from "@/mappers/categoryMeta";
import type { Category } from "@/types/Category";
import type { VehicleBrand } from "@/types/VehicleBrand";
import { listVehicleYears } from "@/utils/vehicle-years";

const selectClassName =
  "border-input bg-surface focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-3";

type AdvertisementFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<AdvertisementFormValues>;
  categories: Category[];
  categoriesLoading?: boolean;
  vehicleBrands: VehicleBrand[];
  vehicleBrandsLoading?: boolean;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: AdvertisementFormValues) => void;
  submitLabel?: string;
  submittingLabel?: string;
};

/**
 * Formulário compartilhado de anúncio (Novo / Editar).
 * Não conhece DTOs — recebe e devolve AdvertisementFormValues.
 */
function AdvertisementForm({
  mode = "create",
  defaultValues,
  categories,
  categoriesLoading = false,
  vehicleBrands,
  vehicleBrandsLoading = false,
  isSubmitting = false,
  submitError,
  onSubmit,
  submitLabel = mode === "edit" ? "Salvar alterações" : "Publicar anúncio",
  submittingLabel = mode === "edit" ? "Salvando…" : "Publicando…",
}: AdvertisementFormProps) {
  const conditions = listAdvertisementConditions();
  const vehicleYears = listVehicleYears();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdvertisementFormValues>({
    resolver: zodResolver(advertisementFormSchema),
    shouldFocusError: true,
    defaultValues: {
      ...advertisementFormDefaultValues,
      ...defaultValues,
    },
  });

  const selectedBrandId = watch("vehicleBrandId");
  const vehicleModelsQuery = useVehicleModels({
    brandId: selectedBrandId || undefined,
  });
  const vehicleModels = vehicleModelsQuery.data ?? [];
  const vehicleModelsLoading = vehicleModelsQuery.isFetching;
  const hasBrandSelected = Boolean(selectedBrandId?.trim());

  useEffect(() => {
    reset({
      ...advertisementFormDefaultValues,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  const submit = handleSubmit((values) => {
    if (isSubmitting) return;
    onSubmit(values);
  });

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-2xl flex-col gap-6"
      noValidate
      aria-busy={isSubmitting}
    >
      {submitError ? (
        <ErrorMessage
          title={
            mode === "edit"
              ? "Não foi possível salvar o anúncio"
              : "Não foi possível publicar o anúncio"
          }
          message={getFriendlyErrorMessage(submitError)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="ad-title">Título</Label>
        <Input
          id="ad-title"
          autoComplete="off"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "ad-title-error" : undefined}
          disabled={isSubmitting}
          {...register("title")}
        />
        {errors.title ? (
          <p id="ad-title-error" className="text-destructive text-xs" role="alert">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ad-description">Descrição</Label>
        <Textarea
          id="ad-description"
          rows={5}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "ad-description-error" : "ad-description-hint"
          }
          disabled={isSubmitting}
          {...register("description")}
        />
        <p id="ad-description-hint" className="text-muted-foreground text-xs">
          Descreva o estado da peça, marca e detalhes relevantes.
        </p>
        {errors.description ? (
          <p
            id="ad-description-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-category">Categoria</Label>
          <select
            id="ad-category"
            className={selectClassName}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={
              errors.categoryId ? "ad-category-error" : undefined
            }
            disabled={isSubmitting || categoriesLoading}
            defaultValue=""
            {...register("categoryId")}
          >
            {categoriesLoading ? (
              <option value="">Carregando…</option>
            ) : (
              <>
                <option value="" disabled>
                  Selecione uma categoria
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.categoryId ? (
            <p
              id="ad-category-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.categoryId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-vehicle-brand">Marca</Label>
          <select
            id="ad-vehicle-brand"
            className={selectClassName}
            aria-invalid={Boolean(errors.vehicleBrandId)}
            aria-describedby={
              errors.vehicleBrandId ? "ad-vehicle-brand-error" : undefined
            }
            disabled={isSubmitting || vehicleBrandsLoading}
            defaultValue=""
            {...register("vehicleBrandId", {
              onChange: () => {
                setValue("vehicleModelId", "", { shouldValidate: false });
              },
            })}
          >
            {vehicleBrandsLoading ? (
              <option value="">Carregando…</option>
            ) : (
              <>
                <option value="" disabled>
                  Selecione uma marca
                </option>
                {vehicleBrands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.vehicleBrandId ? (
            <p
              id="ad-vehicle-brand-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.vehicleBrandId.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-vehicle-model">Modelo</Label>
          <select
            id="ad-vehicle-model"
            className={selectClassName}
            aria-invalid={Boolean(errors.vehicleModelId)}
            aria-describedby={
              errors.vehicleModelId ? "ad-vehicle-model-error" : undefined
            }
            disabled={
              isSubmitting || !hasBrandSelected || vehicleModelsLoading
            }
            defaultValue=""
            {...register("vehicleModelId")}
          >
            {!hasBrandSelected ? (
              <option value="">Selecione uma marca</option>
            ) : vehicleModelsLoading ? (
              <option value="">Carregando…</option>
            ) : vehicleModels.length === 0 ? (
              <option value="">Nenhum modelo cadastrado</option>
            ) : (
              <>
                <option value="" disabled>
                  Selecione um modelo
                </option>
                {vehicleModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.vehicleModelId ? (
            <p
              id="ad-vehicle-model-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.vehicleModelId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-condition">Condição</Label>
          <select
            id="ad-condition"
            className={selectClassName}
            aria-invalid={Boolean(errors.condition)}
            aria-describedby={
              errors.condition ? "ad-condition-error" : undefined
            }
            disabled={isSubmitting}
            {...register("condition")}
          >
            {conditions.map((condition) => (
              <option key={condition} value={String(condition)}>
                {getConditionLabel(condition)}
              </option>
            ))}
          </select>
          {errors.condition ? (
            <p
              id="ad-condition-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.condition.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-manufacturing-year">Ano de Fabricação</Label>
          <select
            id="ad-manufacturing-year"
            className={selectClassName}
            aria-invalid={Boolean(errors.manufacturingYear)}
            aria-describedby={
              errors.manufacturingYear
                ? "ad-manufacturing-year-error"
                : undefined
            }
            disabled={isSubmitting}
            {...register("manufacturingYear")}
          >
            {vehicleYears.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
          {errors.manufacturingYear ? (
            <p
              id="ad-manufacturing-year-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.manufacturingYear.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-model-year">Ano/Modelo</Label>
          <select
            id="ad-model-year"
            className={selectClassName}
            aria-invalid={Boolean(errors.modelYear)}
            aria-describedby={
              errors.modelYear ? "ad-model-year-error" : undefined
            }
            disabled={isSubmitting}
            {...register("modelYear")}
          >
            {vehicleYears.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
          {errors.modelYear ? (
            <p
              id="ad-model-year-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.modelYear.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ad-compatibility">Compatibilidade</Label>
        <Input
          id="ad-compatibility"
          placeholder="Ex.: Civic 2014–2018, motor 1.8"
          aria-invalid={Boolean(errors.compatibilityDescription)}
          aria-describedby={
            errors.compatibilityDescription
              ? "ad-compatibility-error"
              : "ad-compatibility-hint"
          }
          disabled={isSubmitting}
          {...register("compatibilityDescription")}
        />
        <p id="ad-compatibility-hint" className="text-muted-foreground text-xs">
          Modelos, anos ou motores compatíveis com a peça.
        </p>
        {errors.compatibilityDescription ? (
          <p
            id="ad-compatibility-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.compatibilityDescription.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-price">Preço (R$)</Label>
          <Input
            id="ad-price"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "ad-price-error" : undefined}
            disabled={isSubmitting}
            {...register("price")}
          />
          {errors.price ? (
            <p
              id="ad-price-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.price.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-stock">Quantidade em estoque</Label>
          <Input
            id="ad-stock"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="1"
            aria-invalid={Boolean(errors.stockQuantity)}
            aria-describedby={
              errors.stockQuantity ? "ad-stock-error" : "ad-stock-hint"
            }
            disabled={isSubmitting}
            {...register("stockQuantity")}
          />
          <p id="ad-stock-hint" className="text-muted-foreground text-xs">
            Quantidade disponível para venda (mínimo 1).
          </p>
          {errors.stockQuantity ? (
            <p
              id="ad-stock-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.stockQuantity.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          variant="primary"
          className={cn("min-w-[10rem]")}
          disabled={isSubmitting || categoriesLoading || vehicleBrandsLoading}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {submittingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

export { AdvertisementForm };
export type { AdvertisementFormProps };
