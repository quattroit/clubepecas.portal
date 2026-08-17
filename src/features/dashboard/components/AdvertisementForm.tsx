"use client";

import { useEffect, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VehicleRequirement } from "@/contracts/common/enums";
import {
  ADVERTISEMENT_COMPATIBILITY_MAX_LENGTH,
  ADVERTISEMENT_DESCRIPTION_MAX_LENGTH,
  ADVERTISEMENT_TITLE_MAX_LENGTH,
  advertisementFormDefaultValues,
  createAdvertisementFormSchema,
  type AdvertisementCategoryFieldConfig,
  type AdvertisementFormInput,
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
import {
  getChildCategories,
  getRootCategories,
  resolveRootCategory,
} from "@/utils/category-hierarchy";
import { listVehicleYears } from "@/utils/vehicle-years";

const selectClassName =
  "border-input bg-surface focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-3";

type AdvertisementFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<AdvertisementFormInput>;
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
 * Categoria em dois níveis (raiz → subcategoria); campos de veículo
 * conforme config da raiz.
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
  const rootCategories = useMemo(
    () => getRootCategories(categories),
    [categories],
  );

  const fieldConfigRef = useRef<AdvertisementCategoryFieldConfig>({
    vehicleRequirement: VehicleRequirement.Required,
    showCompatibility: true,
  });

  const schema = useMemo(
    () => createAdvertisementFormSchema(() => fieldConfigRef.current),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<AdvertisementFormInput, unknown, AdvertisementFormValues>({
    resolver: zodResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      ...advertisementFormDefaultValues,
      ...defaultValues,
    },
  });

  const titleValue = watch("title") ?? "";
  const descriptionValue = watch("description") ?? "";
  const compatibilityValue = watch("compatibilityDescription") ?? "";
  const titleRemaining = Math.max(
    0,
    ADVERTISEMENT_TITLE_MAX_LENGTH - titleValue.length,
  );
  const descriptionRemaining = Math.max(
    0,
    ADVERTISEMENT_DESCRIPTION_MAX_LENGTH - descriptionValue.length,
  );
  const compatibilityRemaining = Math.max(
    0,
    ADVERTISEMENT_COMPATIBILITY_MAX_LENGTH - compatibilityValue.length,
  );

  const selectedRootId = watch("rootCategoryId");
  const selectedRootNumber =
    selectedRootId === "" || selectedRootId == null
      ? undefined
      : Number(selectedRootId);
  const selectedRoot =
    selectedRootNumber && selectedRootNumber > 0
      ? rootCategories.find((category) => category.id === selectedRootNumber)
      : undefined;

  const subcategories = useMemo(
    () =>
      selectedRootNumber && selectedRootNumber > 0
        ? getChildCategories(categories, selectedRootNumber)
        : [],
    [categories, selectedRootNumber],
  );

  const vehicleRequirement =
    selectedRoot?.vehicleRequirement ?? VehicleRequirement.Required;
  const showCompatibility = selectedRoot?.showCompatibility ?? true;
  const showVehicleFields = vehicleRequirement !== VehicleRequirement.Hidden;
  const vehicleRequired = vehicleRequirement === VehicleRequirement.Required;

  fieldConfigRef.current = {
    vehicleRequirement,
    showCompatibility,
  };

  const selectedBrandId = watch("vehicleBrandId");
  const selectedBrandNumber =
    selectedBrandId === "" || selectedBrandId == null
      ? undefined
      : Number(selectedBrandId);
  const selectedModelId = watch("vehicleModelId");
  const selectedModelNumber =
    selectedModelId === "" || selectedModelId == null
      ? undefined
      : Number(selectedModelId);
  const vehicleModelsQuery = useVehicleModels({
    brandId:
      selectedBrandNumber && selectedBrandNumber > 0
        ? selectedBrandNumber
        : undefined,
  });
  const vehicleModels = vehicleModelsQuery.data ?? [];
  const vehicleModelsLoading = vehicleModelsQuery.isFetching;
  const hasBrandSelected = Boolean(
    selectedBrandNumber && selectedBrandNumber > 0,
  );

  useEffect(() => {
    const merged = {
      ...advertisementFormDefaultValues,
      ...defaultValues,
    };

    if (merged.categoryId && Number(merged.categoryId) > 0 && categories.length > 0) {
      const root = resolveRootCategory(categories, Number(merged.categoryId));
      if (root) {
        merged.rootCategoryId = String(root.id);
      }
    }

    merged.categoryId =
      merged.categoryId && Number(merged.categoryId) > 0
        ? String(merged.categoryId)
        : "";
    merged.vehicleBrandId =
      merged.vehicleBrandId && Number(merged.vehicleBrandId) > 0
        ? String(merged.vehicleBrandId)
        : "";
    merged.vehicleModelId =
      merged.vehicleModelId && Number(merged.vehicleModelId) > 0
        ? String(merged.vehicleModelId)
        : "";
    merged.condition = String(merged.condition ?? "");
    if (merged.manufacturingYear) {
      merged.manufacturingYear = String(merged.manufacturingYear);
    }
    if (merged.modelYear) {
      merged.modelYear = String(merged.modelYear);
    }

    reset(merged);
  }, [defaultValues, categories, reset]);

  const clearVehicleFields = () => {
    setValue("vehicleBrandId", "", { shouldValidate: false });
    setValue("vehicleModelId", "", { shouldValidate: false });
    setValue("manufacturingYear", "", { shouldValidate: false });
    setValue("modelYear", "", { shouldValidate: false });
    clearErrors([
      "vehicleBrandId",
      "vehicleModelId",
      "manufacturingYear",
      "modelYear",
    ]);
  };

  const submit = handleSubmit((values) => {
    if (isSubmitting) return;
    const payload: AdvertisementFormValues = { ...values };
    if (!showVehicleFields) {
      payload.vehicleBrandId = null;
      payload.vehicleModelId = null;
      payload.manufacturingYear = null;
      payload.modelYear = null;
    }
    if (!showCompatibility) {
      payload.compatibilityDescription = "";
    }
    onSubmit(payload);
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
        <div className="flex items-end justify-between gap-3">
          <Label htmlFor="ad-title">Título</Label>
          <span
            id="ad-title-count"
            className="text-muted-foreground text-xs tabular-nums"
            aria-live="polite"
          >
            {titleRemaining} caracteres restantes
          </span>
        </div>
        <Input
          id="ad-title"
          autoComplete="off"
          maxLength={ADVERTISEMENT_TITLE_MAX_LENGTH}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={
            errors.title ? "ad-title-error ad-title-count" : "ad-title-count"
          }
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
        <div className="flex items-end justify-between gap-3">
          <Label htmlFor="ad-description">Descrição</Label>
          <span
            id="ad-description-count"
            className="text-muted-foreground text-xs tabular-nums"
            aria-live="polite"
          >
            {descriptionRemaining} caracteres restantes
          </span>
        </div>
        <Textarea
          id="ad-description"
          rows={5}
          maxLength={ADVERTISEMENT_DESCRIPTION_MAX_LENGTH}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description
              ? "ad-description-error ad-description-count"
              : "ad-description-hint ad-description-count"
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
          <Label htmlFor="ad-root-category">Categoria</Label>
          <select
            id="ad-root-category"
            className={selectClassName}
            aria-invalid={Boolean(errors.rootCategoryId)}
            aria-describedby={
              errors.rootCategoryId ? "ad-root-category-error" : undefined
            }
            disabled={isSubmitting || categoriesLoading}
            {...register("rootCategoryId", {
              onChange: () => {
                setValue("categoryId", 0, { shouldValidate: false });
                clearErrors("categoryId");
                clearVehicleFields();
                setValue("compatibilityDescription", "", {
                  shouldValidate: false,
                });
              },
            })}
          >
            {categoriesLoading && rootCategories.length === 0 ? (
              <option value="">Carregando…</option>
            ) : (
              <>
                <option value="">
                  Selecione uma categoria
                </option>
                {rootCategories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.rootCategoryId ? (
            <p
              id="ad-root-category-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.rootCategoryId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ad-category">Subcategoria</Label>
          <select
            id="ad-category"
            className={selectClassName}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={
              errors.categoryId ? "ad-category-error" : undefined
            }
            disabled={
              isSubmitting ||
              categoriesLoading ||
              !selectedRootNumber ||
              selectedRootNumber <= 0
            }
            {...register("categoryId")}
          >
            {!selectedRootNumber || selectedRootNumber <= 0 ? (
              <option value="">Selecione a categoria</option>
            ) : subcategories.length === 0 ? (
              <option value="">Nenhuma subcategoria</option>
            ) : (
              <>
                <option value="">
                  Selecione uma subcategoria
                </option>
                {subcategories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {showVehicleFields ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="ad-vehicle-brand">
              Marca{vehicleRequired ? "" : " (opcional)"}
            </Label>
            <select
              id="ad-vehicle-brand"
              className={selectClassName}
              aria-invalid={Boolean(errors.vehicleBrandId)}
              aria-describedby={
                errors.vehicleBrandId ? "ad-vehicle-brand-error" : undefined
              }
              disabled={isSubmitting || vehicleBrandsLoading}
              {...register("vehicleBrandId", {
                onChange: () => {
                  setValue("vehicleModelId", "", { shouldValidate: false });
                },
              })}
            >
              {vehicleBrandsLoading && vehicleBrands.length === 0 ? (
                <option value="">Carregando…</option>
              ) : (
                <>
                  <option value="">Selecione</option>
                  {vehicleBrands.map((brand) => (
                    <option key={brand.id} value={String(brand.id)}>
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
        ) : null}

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

      {showVehicleFields ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ad-vehicle-model">
                Modelo{vehicleRequired ? "" : " (opcional)"}
              </Label>
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
                {...register("vehicleModelId")}
              >
                {!hasBrandSelected ? (
                  <option value="">Selecione</option>
                ) : (
                  <>
                    <option value="">
                      {vehicleModelsLoading
                        ? "Carregando…"
                        : vehicleModels.length === 0
                          ? "Nenhum modelo cadastrado"
                          : "Selecione"}
                    </option>
                    {vehicleModels.map((model) => (
                      <option key={model.id} value={String(model.id)}>
                        {model.name}
                      </option>
                    ))}
                    {selectedModelNumber &&
                    selectedModelNumber > 0 &&
                    !vehicleModels.some(
                      (model) => model.id === selectedModelNumber,
                    ) ? (
                      <option value={String(selectedModelNumber)}>
                        {vehicleModelsLoading
                          ? "Carregando…"
                          : "Modelo selecionado"}
                      </option>
                    ) : null}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ad-manufacturing-year">
                Ano de Fabricação{vehicleRequired ? "" : " (opcional)"}
              </Label>
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
                <option value="">Selecione</option>
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
                <option value="">Selecione</option>
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
        </>
      ) : null}

      {showCompatibility ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between gap-3">
            <Label htmlFor="ad-compatibility">Compatibilidade</Label>
            <span
              id="ad-compatibility-count"
              className="text-muted-foreground text-xs tabular-nums"
              aria-live="polite"
            >
              {compatibilityRemaining} caracteres restantes
            </span>
          </div>
          <Input
            id="ad-compatibility"
            placeholder="Ex.: Civic 2014–2018, motor 1.8 (opcional)"
            maxLength={ADVERTISEMENT_COMPATIBILITY_MAX_LENGTH}
            aria-invalid={Boolean(errors.compatibilityDescription)}
            aria-describedby={
              errors.compatibilityDescription
                ? "ad-compatibility-error ad-compatibility-count"
                : "ad-compatibility-hint ad-compatibility-count"
            }
            disabled={isSubmitting}
            {...register("compatibilityDescription")}
          />
          <p id="ad-compatibility-hint" className="text-muted-foreground text-xs">
            Opcional. Modelos, anos ou motores compatíveis com a peça.
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
      ) : null}

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
