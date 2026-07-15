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
  sellerProfileFormDefaultValues,
  sellerProfileFormSchema,
  type SellerProfileFormValues,
} from "@/features/dashboard/schemas/sellerProfileFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileFormSchema),
    shouldFocusError: true,
    defaultValues: {
      ...sellerProfileFormDefaultValues,
      ...defaultValues,
    },
  });

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

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-2xl flex-col gap-5"
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
          <Label htmlFor="seller-city">Cidade</Label>
          <Input
            id="seller-city"
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "seller-city-error" : undefined}
            disabled={isSubmitting}
            {...register("city")}
          />
          {errors.city ? (
            <p
              id="seller-city-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.city.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seller-state">Estado</Label>
          <Input
            id="seller-state"
            placeholder="UF"
            maxLength={2}
            className="uppercase"
            aria-invalid={Boolean(errors.state)}
            aria-describedby={
              errors.state ? "seller-state-error" : "seller-state-hint"
            }
            disabled={isSubmitting}
            {...register("state")}
          />
          <p id="seller-state-hint" className="text-muted-foreground text-xs">
            Use a sigla do estado (ex.: PR, SP).
          </p>
          {errors.state ? (
            <p
              id="seller-state-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.state.message}
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
          Conte um pouco sobre a loja para os compradores.
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
          <Label htmlFor="seller-whatsapp">WhatsApp (opcional)</Label>
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
            Preferencialmente só números, com DDI.
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
