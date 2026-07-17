"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersonType } from "@/contracts/common/enums";
import {
  sellerProfileFormDefaultValues,
  sellerProfileFormSchema,
  type SellerProfileFormValues,
} from "@/features/dashboard/schemas/sellerProfileFormSchema";
import { useCities } from "@/hooks/api/useCities";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatCityLabel } from "@/mappers/city.mapper";
import {
  documentLabel,
  documentPlaceholder,
  formatDocumentInput,
} from "@/utils/document";

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
}: SellerProfileFormProps) {
  const citiesQuery = useCities();
  const cities = citiesQuery.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileFormSchema),
    shouldFocusError: true,
    defaultValues: {
      ...sellerProfileFormDefaultValues,
      ...defaultValues,
    },
  });

  const personType = useWatch({ control, name: "personType" });

  useEffect(() => {
    reset({
      ...sellerProfileFormDefaultValues,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

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
          <Label htmlFor="seller-document">{documentLabel(personType)}</Label>
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="seller-city">Cidade</Label>
        <select
          id="seller-city"
          className={selectClassName}
          aria-invalid={Boolean(errors.cityId)}
          aria-describedby={
            errors.cityId
              ? "seller-city-error"
              : citiesQuery.isError
                ? "seller-city-load-error"
                : "seller-city-hint"
          }
          disabled={citiesDisabled}
          {...register("cityId")}
        >
          <option value="">
            {citiesLoading ? "Carregando cidades…" : "Selecione a cidade"}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {formatCityLabel(city)}
            </option>
          ))}
        </select>
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
            Selecione a cidade onde a loja atua.
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="seller-photo-url">URL da foto (opcional)</Label>
        <Input
          id="seller-photo-url"
          type="url"
          placeholder="https://…"
          aria-invalid={Boolean(errors.photoUrl)}
          aria-describedby={
            errors.photoUrl ? "seller-photo-url-error" : undefined
          }
          disabled={isSubmitting}
          {...register("photoUrl")}
        />
        {errors.photoUrl ? (
          <p
            id="seller-photo-url-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.photoUrl.message}
          </p>
        ) : null}
      </div>

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
