"use client";

import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { CityCombobox } from "@/components/ui/city-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VehicleRequirement } from "@/contracts/common/enums";
import {
  PART_REQUEST_DESCRIPTION_MAX_LENGTH,
  PART_REQUEST_ENGINE_MAX_LENGTH,
  PART_REQUEST_MAX_SUPPLIERS,
  PART_REQUEST_TITLE_MAX_LENGTH,
  createPartRequestFormSchema,
  partRequestFormDefaultValues,
  type PartRequestCategoryFieldConfig,
  type PartRequestFormInput,
  type PartRequestFormValues,
} from "@/features/professional-buyer/schemas/partRequestFormSchema";
import { useCities } from "@/hooks/api/useCities";
import { useVehicleModels } from "@/hooks/api/useVehicleModels";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/Category";
import type { VehicleBrand } from "@/types/VehicleBrand";
import {
  getChildCategories,
  getRootCategories,
  resolveRootCategory,
} from "@/utils/category-hierarchy";
import { listVehicleYears } from "@/utils/vehicle-years";

const selectClassName = cn(
  "border-input bg-surface focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-3",
);

type PartRequestFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<PartRequestFormInput>;
  categories: Category[];
  categoriesLoading?: boolean;
  vehicleBrands: VehicleBrand[];
  vehicleBrandsLoading?: boolean;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: PartRequestFormValues) => void;
  submitLabel?: string;
  submittingLabel?: string;
};

function PartRequestForm({
  mode = "create",
  defaultValues,
  categories,
  categoriesLoading = false,
  vehicleBrands,
  vehicleBrandsLoading = false,
  isSubmitting = false,
  submitError,
  onSubmit,
  submitLabel = mode === "edit" ? "Salvar alterações" : "Criar solicitação",
  submittingLabel = mode === "edit" ? "Salvando…" : "Criando…",
}: PartRequestFormProps) {
  const vehicleYears = listVehicleYears();
  const citiesQuery = useCities();
  const cities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);

  const allowedRootCategories = useMemo(
    () =>
      getRootCategories(categories).filter(
        (category) => category.allowProfessionalRequest,
      ),
    [categories],
  );

  const fieldConfigRef = useRef<PartRequestCategoryFieldConfig>({
    vehicleRequirement: VehicleRequirement.Required,
  });

  const schema = useMemo(
    () => createPartRequestFormSchema(() => fieldConfigRef.current),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<PartRequestFormInput, unknown, PartRequestFormValues>({
    resolver: zodResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      ...partRequestFormDefaultValues,
      ...defaultValues,
    },
  });

  const titleValue = watch("title") ?? "";
  const descriptionValue = watch("description") ?? "";
  const titleRemaining = Math.max(
    0,
    PART_REQUEST_TITLE_MAX_LENGTH - titleValue.length,
  );
  const descriptionRemaining = Math.max(
    0,
    PART_REQUEST_DESCRIPTION_MAX_LENGTH - descriptionValue.length,
  );

  const selectedRootId = watch("rootCategoryId");
  const selectedRootNumber =
    selectedRootId === "" || selectedRootId == null
      ? undefined
      : Number(selectedRootId);
  const selectedRoot =
    selectedRootNumber && selectedRootNumber > 0
      ? allowedRootCategories.find(
          (category) => category.id === selectedRootNumber,
        )
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
  const showVehicleFields = vehicleRequirement !== VehicleRequirement.Hidden;
  const vehicleRequired = vehicleRequirement === VehicleRequirement.Required;

  fieldConfigRef.current = { vehicleRequirement };

  const selectedBrandId = watch("vehicleBrandId");
  const selectedBrandNumber =
    selectedBrandId === "" || selectedBrandId == null
      ? undefined
      : Number(selectedBrandId);
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

  const supplierOptions = useMemo(
    () =>
      Array.from({ length: PART_REQUEST_MAX_SUPPLIERS }, (_, index) => index + 1),
    [],
  );

  useEffect(() => {
    const merged = {
      ...partRequestFormDefaultValues,
      ...defaultValues,
    };

    if (
      (merged.rootCategoryId === 0 ||
        merged.rootCategoryId === "" ||
        merged.rootCategoryId == null) &&
      merged.categoryId &&
      Number(merged.categoryId) > 0 &&
      categories.length > 0
    ) {
      const root = resolveRootCategory(categories, Number(merged.categoryId));
      if (root) {
        merged.rootCategoryId = root.id;
      }
    }

    reset(merged);
  }, [defaultValues, categories, reset]);

  const clearVehicleFields = () => {
    setValue("vehicleBrandId", "", { shouldValidate: false });
    setValue("vehicleModelId", "", { shouldValidate: false });
    setValue("manufacturingYear", "", { shouldValidate: false });
    setValue("modelYear", "", { shouldValidate: false });
    setValue("engine", "", { shouldValidate: false });
    clearErrors([
      "vehicleBrandId",
      "vehicleModelId",
      "manufacturingYear",
      "modelYear",
      "engine",
    ]);
  };

  const submit = handleSubmit((values) => {
    if (isSubmitting) return;
    const payload: PartRequestFormValues = { ...values };
    if (!showVehicleFields) {
      payload.vehicleBrandId = null;
      payload.vehicleModelId = null;
      payload.manufacturingYear = null;
      payload.modelYear = null;
      payload.engine = "";
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
              ? "Não foi possível salvar a solicitação"
              : "Não foi possível criar a solicitação"
          }
          message={getFriendlyErrorMessage(submitError)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <Label htmlFor="pr-title">Título</Label>
          <span
            id="pr-title-count"
            className="text-muted-foreground text-xs tabular-nums"
            aria-live="polite"
          >
            {titleRemaining} caracteres restantes
          </span>
        </div>
        <Input
          id="pr-title"
          autoComplete="off"
          maxLength={PART_REQUEST_TITLE_MAX_LENGTH}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={
            errors.title ? "pr-title-error pr-title-count" : "pr-title-count"
          }
          disabled={isSubmitting}
          {...register("title")}
        />
        {errors.title ? (
          <p id="pr-title-error" className="text-destructive text-xs" role="alert">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pr-root-category">Categoria</Label>
          <select
            id="pr-root-category"
            className={selectClassName}
            aria-invalid={Boolean(errors.rootCategoryId)}
            aria-describedby={
              errors.rootCategoryId
                ? "pr-root-category-error"
                : "pr-root-category-hint"
            }
            disabled={isSubmitting || categoriesLoading}
            {...register("rootCategoryId", {
              onChange: () => {
                setValue("categoryId", 0, { shouldValidate: false });
                clearErrors("categoryId");
                clearVehicleFields();
              },
            })}
          >
            {categoriesLoading ? (
              <option value="">Carregando…</option>
            ) : allowedRootCategories.length === 0 ? (
              <option value="">Nenhuma categoria disponível</option>
            ) : (
              <>
                <option value="" disabled>
                  Selecione uma categoria
                </option>
                {allowedRootCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
          </select>
          <p id="pr-root-category-hint" className="text-muted-foreground text-xs">
            Apenas categorias habilitadas para solicitação profissional.
          </p>
          {errors.rootCategoryId ? (
            <p
              id="pr-root-category-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.rootCategoryId.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pr-category">Subcategoria</Label>
          <select
            id="pr-category"
            className={selectClassName}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={
              errors.categoryId ? "pr-category-error" : undefined
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
                <option value="" disabled>
                  Selecione uma subcategoria
                </option>
                {subcategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.categoryId ? (
            <p
              id="pr-category-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.categoryId.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pr-quantity">Quantidade</Label>
          <Input
            id="pr-quantity"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            aria-invalid={Boolean(errors.requestedQuantity)}
            aria-describedby={
              errors.requestedQuantity ? "pr-quantity-error" : undefined
            }
            disabled={isSubmitting}
            {...register("requestedQuantity")}
          />
          {errors.requestedQuantity ? (
            <p
              id="pr-quantity-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.requestedQuantity.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pr-max-suppliers">Quantidade de fornecedores</Label>
          <select
            id="pr-max-suppliers"
            className={selectClassName}
            aria-invalid={Boolean(errors.maximumSuppliers)}
            aria-describedby={
              errors.maximumSuppliers ? "pr-max-suppliers-error" : undefined
            }
            disabled={isSubmitting}
            {...register("maximumSuppliers")}
          >
            {supplierOptions.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          {errors.maximumSuppliers ? (
            <p
              id="pr-max-suppliers-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.maximumSuppliers.message}
            </p>
          ) : null}
        </div>
      </div>

      {showVehicleFields ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pr-vehicle-brand">
                Marca{vehicleRequired ? "" : " (opcional)"}
              </Label>
              <select
                id="pr-vehicle-brand"
                className={selectClassName}
                aria-invalid={Boolean(errors.vehicleBrandId)}
                aria-describedby={
                  errors.vehicleBrandId ? "pr-vehicle-brand-error" : undefined
                }
                disabled={isSubmitting || vehicleBrandsLoading}
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
                    <option value="">Selecione</option>
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
                  id="pr-vehicle-brand-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.vehicleBrandId.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="pr-vehicle-model">
                Modelo{vehicleRequired ? "" : " (opcional)"}
              </Label>
              <select
                id="pr-vehicle-model"
                className={selectClassName}
                aria-invalid={Boolean(errors.vehicleModelId)}
                aria-describedby={
                  errors.vehicleModelId ? "pr-vehicle-model-error" : undefined
                }
                disabled={
                  isSubmitting || !hasBrandSelected || vehicleModelsLoading
                }
                {...register("vehicleModelId")}
              >
                {!hasBrandSelected ? (
                  <option value="">Selecione a marca</option>
                ) : vehicleModelsLoading ? (
                  <option value="">Carregando…</option>
                ) : vehicleModels.length === 0 ? (
                  <option value="">Nenhum modelo cadastrado</option>
                ) : (
                  <>
                    <option value="">Selecione</option>
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
                  id="pr-vehicle-model-error"
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
              <Label htmlFor="pr-manufacturing-year">
                Ano fabricação{vehicleRequired ? "" : " (opcional)"}
              </Label>
              <select
                id="pr-manufacturing-year"
                className={selectClassName}
                aria-invalid={Boolean(errors.manufacturingYear)}
                aria-describedby={
                  errors.manufacturingYear
                    ? "pr-manufacturing-year-error"
                    : undefined
                }
                disabled={isSubmitting}
                {...register("manufacturingYear")}
              >
                <option value="">Selecione</option>
                {vehicleYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.manufacturingYear ? (
                <p
                  id="pr-manufacturing-year-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.manufacturingYear.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="pr-model-year">Ano modelo</Label>
              <select
                id="pr-model-year"
                className={selectClassName}
                aria-invalid={Boolean(errors.modelYear)}
                aria-describedby={
                  errors.modelYear ? "pr-model-year-error" : undefined
                }
                disabled={isSubmitting}
                {...register("modelYear")}
              >
                <option value="">Opcional</option>
                {vehicleYears.map((year) => (
                  <option key={`model-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.modelYear ? (
                <p
                  id="pr-model-year-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.modelYear.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="pr-engine">Motor</Label>
            <Input
              id="pr-engine"
              autoComplete="off"
              maxLength={PART_REQUEST_ENGINE_MAX_LENGTH}
              placeholder="Opcional"
              aria-invalid={Boolean(errors.engine)}
              aria-describedby={errors.engine ? "pr-engine-error" : undefined}
              disabled={isSubmitting}
              {...register("engine")}
            />
            {errors.engine ? (
              <p id="pr-engine-error" className="text-destructive text-xs" role="alert">
                {errors.engine.message}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="pr-city">Cidade (opcional)</Label>
        <Controller
          control={control}
          name="cityId"
          render={({ field }) => (
            <CityCombobox
              id="pr-city"
              cities={cities}
              value={field.value ? Number(field.value) : null}
              onChange={(cityId) => field.onChange(cityId ?? "")}
              onBlur={field.onBlur}
              disabled={isSubmitting || citiesQuery.isLoading}
              invalid={Boolean(errors.cityId)}
              aria-describedby={
                errors.cityId ? "pr-city-error" : "pr-city-help"
              }
            />
          )}
        />
        <p id="pr-city-help" className="text-muted-foreground text-xs">
          Se informar a cidade, buscamos apenas fornecedores dessa cidade com
          anúncios compatíveis.
        </p>
        {errors.cityId ? (
          <p id="pr-city-error" className="text-destructive text-xs" role="alert">
            {errors.cityId.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <Label htmlFor="pr-description">Descrição</Label>
          <span
            id="pr-description-count"
            className="text-muted-foreground text-xs tabular-nums"
            aria-live="polite"
          >
            {descriptionRemaining} caracteres restantes
          </span>
        </div>
        <Textarea
          id="pr-description"
          rows={5}
          maxLength={PART_REQUEST_DESCRIPTION_MAX_LENGTH}
          placeholder="Opcional — detalhes adicionais sobre a peça"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description
              ? "pr-description-error pr-description-count"
              : "pr-description-count"
          }
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description ? (
          <p
            id="pr-description-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}

export { PartRequestForm };
