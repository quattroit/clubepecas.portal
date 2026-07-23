"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { Textarea } from "@/components/ui/textarea";
import { SellerPhotoPicker } from "@/features/dashboard/components/photos/SellerPhotoPicker";
import { BRAZILIAN_STATE_OPTIONS } from "@/constants/brazilian-states";
import { PersonType } from "@/contracts/common/enums";
import {
  sellerProfileFormDefaultValues,
  sellerProfileFormSchema,
  type SellerProfileFormValues,
} from "@/features/dashboard/schemas/sellerProfileFormSchema";
import { useCities } from "@/hooks/api/useCities";
import { useViaCepLookup } from "@/hooks/api/useViaCepLookup";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  documentPlaceholder,
  formatDocumentInput,
} from "@/utils/document";
import {
  formatPostalCodeInput,
  normalizePostalCode,
} from "@/utils/postalCode";

const selectClassName = cn(
  "border-input bg-surface focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors focus-visible:ring-3",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type SellerProfileFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<SellerProfileFormValues>;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: SellerProfileFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  submittingLabel?: string;
  /** Arquivo pendente (create) — enviado após criar o perfil. */
  pendingPhotoFile?: File | null;
  onPendingPhotoFileChange?: (file: File | null) => void;
};

/**
 * Formulário compartilhado do perfil de vendedor (create / edit).
 * Não conhece DTOs — recebe e devolve SellerProfileFormValues.
 */
function SellerProfileForm({
  mode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
  onCancel,
  submitLabel = mode === "edit" ? "Salvar alterações" : "Criar perfil",
  submittingLabel = mode === "edit" ? "Salvando…" : "Criando…",
  pendingPhotoFile = null,
  onPendingPhotoFileChange,
}: SellerProfileFormProps) {
  const citiesQuery = useCities();
  const cities = citiesQuery.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileFormSchema) as Resolver<SellerProfileFormValues>,
    shouldFocusError: true,
    defaultValues: {
      ...sellerProfileFormDefaultValues,
      ...defaultValues,
    },
  });

  const personType = useWatch({ control, name: "personType" });
  const photoUrl = useWatch({ control, name: "photoUrl" }) ?? "";
  const cityId = useWatch({ control, name: "cityId" }) ?? 0;
  const zipCode = useWatch({ control, name: "zipCode" }) ?? "";

  const viaCepQuery = useViaCepLookup(zipCode, !isSubmitting);
  const lastAutofilledCep = useRef<string | null>(null);

  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    const digits = normalizePostalCode(zipCode);
    const lookup = viaCepQuery.data;

    if (
      !lookup ||
      digits.length !== 8 ||
      lastAutofilledCep.current === digits
    ) {
      return;
    }

    setValue("street", lookup.street, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("neighborhood", lookup.neighborhood, {
      shouldDirty: true,
      shouldValidate: true,
    });
    lastAutofilledCep.current = digits;
  }, [viaCepQuery.data, zipCode, setValue]);

  useEffect(() => {
    reset({
      ...sellerProfileFormDefaultValues,
      ...defaultValues,
    });

    const nextCityId = defaultValues?.cityId ?? 0;
    if (!nextCityId || nextCityId <= 0) {
      setSelectedState(null);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!cityId || cityId <= 0) return;
    const city = cities.find((item) => item.id === cityId);
    if (city) {
      setSelectedState(city.state.toUpperCase());
    }
  }, [cityId, cities]);

  const stateOptions = useMemo(
    () =>
      BRAZILIAN_STATE_OPTIONS.filter((option) => option.id !== "all").map(
        (option) => ({ id: option.id, label: option.label }),
      ),
    [],
  );

  const cityOptions = useMemo(() => {
    if (!selectedState) return [];
    return cities
      .filter((city) => city.state.toUpperCase() === selectedState.toUpperCase())
      .map((city) => ({
        id: String(city.id),
        label: `${city.name} — ${city.state}`,
      }));
  }, [cities, selectedState]);

  const submit = handleSubmit((values) => {
    if (isSubmitting) return;
    onSubmit(values);
  });

  const citiesLoading = citiesQuery.isLoading;
  const citiesDisabled = isSubmitting || citiesLoading || citiesQuery.isError;

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
              ? "Não foi possível salvar o perfil"
              : "Não foi possível criar o perfil"
          }
          message={getFriendlyErrorMessage(submitError)}
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-store-name">Nome da loja</Label>
          <Input
            id="seller-store-name"
            aria-invalid={Boolean(errors.storeName)}
            aria-describedby={
              errors.storeName ? "seller-store-name-error" : undefined
            }
            disabled={isSubmitting}
            {...register("storeName")}
          />
          {errors.storeName ? (
            <p
              id="seller-store-name-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.storeName.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-display-name">Nome de exibição</Label>
          <Input
            id="seller-display-name"
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={
              errors.displayName ? "seller-display-name-error" : undefined
            }
            disabled={isSubmitting}
            {...register("displayName")}
          />
          {errors.displayName ? (
            <p
              id="seller-display-name-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.displayName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-person-type">Tipo de Pessoa</Label>
          <Controller
            name="personType"
            control={control}
            render={({ field }) => (
              <select
                id="seller-person-type"
                className={selectClassName}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.personType)}
                value={field.value}
                onChange={(event) => {
                  const nextType = Number(event.target.value) as PersonType;
                  field.onChange(nextType);
                  setValue("document", "", { shouldValidate: false });
                }}
                onBlur={field.onBlur}
              >
                <option value={PersonType.Individual}>Pessoa Física</option>
                <option value={PersonType.Company}>Pessoa Jurídica</option>
              </select>
            )}
          />
          {errors.personType ? (
            <p className="text-destructive text-xs" role="alert">
              {errors.personType.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-document">CPF/CNPJ</Label>
          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <Input
                id="seller-document"
                inputMode="numeric"
                autoComplete="off"
                placeholder={documentPlaceholder(personType)}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.document)}
                aria-describedby={
                  errors.document ? "seller-document-error" : undefined
                }
                value={field.value}
                onChange={(event) => {
                  field.onChange(
                    formatDocumentInput(event.target.value, personType),
                  );
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.document ? (
            <p
              id="seller-document-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.document.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-state">Estado</Label>
          <SearchableCombobox
            id="seller-state"
            options={stateOptions}
            value={selectedState}
            disabled={citiesDisabled}
            placeholder={
              citiesLoading ? "Carregando…" : "Selecione o estado"
            }
            clearLabel="Limpar estado"
            triggerLabel="Abrir lista de estados"
            emptyMessage="Digite ou abra a lista para escolher o estado."
            showOptionsWhenEmpty
            maxResults={30}
            onChange={(next) => {
              setSelectedState(next);
              // Não validar cityId=0 agora — só exige cidade no submit / ao escolher.
              setValue("cityId", 0, {
                shouldValidate: false,
                shouldDirty: true,
              });
              clearErrors("cityId");
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-city">Cidade</Label>
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <SearchableCombobox
                id="seller-city"
                options={cityOptions}
                value={
                  field.value && field.value > 0 ? String(field.value) : null
                }
                disabled={citiesDisabled || !selectedState}
                invalid={Boolean(errors.cityId)}
                placeholder={
                  citiesLoading
                    ? "Carregando cidades…"
                    : selectedState
                      ? "Selecione a cidade"
                      : "Selecione o estado primeiro"
                }
                clearLabel="Limpar cidade"
                triggerLabel="Abrir lista de cidades"
                emptyMessage={
                  selectedState
                    ? "Digite ou abra a lista para escolher a cidade."
                    : "Selecione o estado primeiro."
                }
                showOptionsWhenEmpty={Boolean(selectedState)}
                maxResults={120}
                aria-describedby={
                  errors.cityId
                    ? "seller-city-error"
                    : citiesQuery.isError
                      ? "seller-city-load-error"
                      : "seller-city-hint"
                }
                onBlur={field.onBlur}
                onChange={(nextCityId) => {
                  const parsed = nextCityId ? Number(nextCityId) : 0;
                  field.onChange(parsed);
                  if (parsed > 0) {
                    clearErrors("cityId");
                  }
                }}
              />
            )}
          />
        </div>
      </div>
      {citiesQuery.isError ? (
        <p
          id="seller-city-load-error"
          className="text-destructive text-xs"
          role="alert"
        >
          Não foi possível carregar as cidades. Tente novamente mais tarde.
        </p>
      ) : (
        <p id="seller-city-hint" className="text-muted-foreground text-xs">
          Selecione o estado e depois a cidade. Você pode digitar para filtrar.
        </p>
      )}
      {errors.cityId ? (
        <p
          id="seller-city-error"
          className="text-destructive text-xs"
          role="alert"
        >
          {errors.cityId.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Endereço da loja</h2>
        <p className="text-muted-foreground text-xs">
          Obrigatório para pagamentos via Asaas. Informe o CEP para preencher
          logradouro e bairro automaticamente.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-zip-code">CEP</Label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                id="seller-zip-code"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.zipCode)}
                aria-describedby={
                  errors.zipCode ? "seller-zip-code-error" : "seller-zip-code-hint"
                }
                value={field.value}
                onChange={(event) => {
                  lastAutofilledCep.current = null;
                  field.onChange(formatPostalCodeInput(event.target.value));
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          <p id="seller-zip-code-hint" className="text-muted-foreground text-xs">
            {viaCepQuery.isFetching
              ? "Consultando CEP…"
              : viaCepQuery.isError
                ? "Não foi possível consultar o CEP. Preencha manualmente."
                : "Digite os 8 dígitos do CEP."}
          </p>
          {errors.zipCode ? (
            <p
              id="seller-zip-code-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.zipCode.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-street">Logradouro</Label>
          <Input
            id="seller-street"
            autoComplete="street-address"
            aria-invalid={Boolean(errors.street)}
            aria-describedby={
              errors.street ? "seller-street-error" : undefined
            }
            disabled={isSubmitting}
            {...register("street")}
          />
          {errors.street ? (
            <p
              id="seller-street-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.street.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-number">Número</Label>
          <Input
            id="seller-number"
            autoComplete="off"
            aria-invalid={Boolean(errors.number)}
            aria-describedby={
              errors.number ? "seller-number-error" : undefined
            }
            disabled={isSubmitting}
            {...register("number")}
          />
          {errors.number ? (
            <p
              id="seller-number-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.number.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-complement">Complemento (opcional)</Label>
          <Input
            id="seller-complement"
            autoComplete="off"
            aria-invalid={Boolean(errors.complement)}
            disabled={isSubmitting}
            {...register("complement")}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="seller-neighborhood">Bairro</Label>
          <Input
            id="seller-neighborhood"
            autoComplete="off"
            aria-invalid={Boolean(errors.neighborhood)}
            aria-describedby={
              errors.neighborhood ? "seller-neighborhood-error" : undefined
            }
            disabled={isSubmitting}
            {...register("neighborhood")}
          />
          {errors.neighborhood ? (
            <p
              id="seller-neighborhood-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.neighborhood.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="seller-description">Descrição (opcional)</Label>
        <Textarea
          id="seller-description"
          rows={4}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description
              ? "seller-description-error"
              : "seller-description-hint"
          }
          disabled={isSubmitting}
          {...register("description")}
        />
        <p
          id="seller-description-hint"
          className="text-muted-foreground text-xs"
        >
          Conte um pouco sobre a loja para quem busca peças.
        </p>
        {errors.description ? (
          <p
            id="seller-description-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-whatsapp">WhatsApp</Label>
          <Input
            id="seller-whatsapp"
            type="tel"
            placeholder="5511999999999"
            aria-invalid={Boolean(errors.whatsApp)}
            aria-describedby={
              errors.whatsApp ? "seller-whatsapp-error" : "seller-whatsapp-hint"
            }
            disabled={isSubmitting}
            {...register("whatsApp")}
          />
          <p id="seller-whatsapp-hint" className="text-muted-foreground text-xs">
            Obrigatório. Preferencialmente só números, com DDI.
          </p>
          {errors.whatsApp ? (
            <p
              id="seller-whatsapp-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.whatsApp.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-instagram">Instagram (opcional)</Label>
          <Input
            id="seller-instagram"
            type="text"
            placeholder="@sualoja"
            autoComplete="off"
            aria-invalid={Boolean(errors.instagram)}
            aria-describedby={
              errors.instagram
                ? "seller-instagram-error"
                : "seller-instagram-hint"
            }
            disabled={isSubmitting}
            {...register("instagram")}
          />
          <p
            id="seller-instagram-hint"
            className="text-muted-foreground text-xs"
          >
            Informe o @usuário ou a URL do perfil.
          </p>
          {errors.instagram ? (
            <p
              id="seller-instagram-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.instagram.message}
            </p>
          ) : null}
        </div>
      </div>

      <SellerPhotoPicker
        mode={mode}
        value={photoUrl}
        onChange={(nextPhotoUrl) =>
          setValue("photoUrl", nextPhotoUrl, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        pendingFile={pendingPhotoFile}
        onPendingFileChange={(file) => onPendingPhotoFileChange?.(file)}
        disabled={isSubmitting}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          className={cn("min-w-[10rem]")}
          disabled={isSubmitting}
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

export { SellerProfileForm };
export type { SellerProfileFormProps };
