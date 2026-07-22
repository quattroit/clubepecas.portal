"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  representativeProfileFormDefaultValues,
  representativeProfileFormSchema,
  type RepresentativeProfileFormValues,
} from "@/features/representative/schemas/representativeProfileFormSchema";
import { useViaCepLookup } from "@/hooks/api/useViaCepLookup";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { onlyDigits } from "@/utils/document";
import {
  formatPostalCodeInput,
  normalizePostalCode,
} from "@/utils/postalCode";
import { BRAZILIAN_STATES } from "@/utils/brazilianStates";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

type RepresentativeProfileFormProps = {
  defaultValues?: RepresentativeProfileFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: RepresentativeProfileFormValues) => void;
};

/**
 * Formulário de dados editáveis do representante — nome, telefone e
 * endereço. E-mail, documento (CPF/CNPJ), código e status são somente leitura (exibidos
 * em `RepresentativeProfileView`).
 */
function RepresentativeProfileForm({
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: RepresentativeProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RepresentativeProfileFormValues>({
    resolver: zodResolver(representativeProfileFormSchema),
    shouldFocusError: true,
    defaultValues: representativeProfileFormDefaultValues,
  });

  const zipCode = useWatch({ control, name: "zipCode" }) ?? "";
  const viaCepQuery = useViaCepLookup(zipCode, !isSubmitting);

  useEffect(() => {
    reset({
      ...representativeProfileFormDefaultValues,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  useEffect(() => {
    const digits = normalizePostalCode(zipCode);
    if (digits.length !== 8 || !viaCepQuery.data) return;

    setValue("addressStreet", viaCepQuery.data.street, {
      shouldValidate: true,
    });
    setValue("neighborhood", viaCepQuery.data.neighborhood, {
      shouldValidate: true,
    });
    setValue("city", viaCepQuery.data.city, { shouldValidate: true });
    setValue("state", viaCepQuery.data.state, { shouldValidate: true });
  }, [viaCepQuery.data, zipCode, setValue]);

  const submit = handleSubmit((values) => {
    if (isSubmitting) return;
    onSubmit(values);
  });

  const cepHint =
    normalizePostalCode(zipCode).length < 8
      ? "Digite os 8 dígitos do CEP."
      : viaCepQuery.isFetching
        ? "Consultando CEP…"
        : viaCepQuery.isError || viaCepQuery.data === null
          ? "CEP não encontrado. Preencha o endereço manualmente."
          : "Endereço preenchido automaticamente. Você pode editar os campos.";

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-2xl flex-col gap-6"
      noValidate
      aria-busy={isSubmitting}
    >
      {submitError ? (
        <ErrorMessage
          title="Não foi possível salvar o perfil"
          message={getFriendlyErrorMessage(submitError)}
        />
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="text-foreground text-sm font-semibold">
          Dados pessoais
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="rep-profile-name">Nome</Label>
            <Input
              id="rep-profile-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-profile-phone">Telefone</Label>
            <Input
              id="rep-profile-phone"
              disabled={isSubmitting}
              placeholder="11999999999"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone", {
                setValueAs: (value: string) => onlyDigits(value),
              })}
            />
            {errors.phone ? (
              <p className="text-destructive text-xs">{errors.phone.message}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-foreground text-sm font-semibold">Endereço</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-profile-zip">CEP</Label>
            <Controller
              control={control}
              name="zipCode"
              render={({ field }) => (
                <Input
                  id="rep-profile-zip"
                  disabled={isSubmitting}
                  placeholder="00000-000"
                  aria-invalid={Boolean(errors.zipCode)}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(formatPostalCodeInput(event.target.value))
                  }
                />
              )}
            />
            <p className="text-muted-foreground text-xs">{cepHint}</p>
            {errors.zipCode ? (
              <p className="text-destructive text-xs">
                {errors.zipCode.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-profile-number">Número</Label>
            <Input
              id="rep-profile-number"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.addressNumber)}
              {...register("addressNumber")}
            />
            {errors.addressNumber ? (
              <p className="text-destructive text-xs">
                {errors.addressNumber.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="rep-profile-street">Logradouro</Label>
            <Input
              id="rep-profile-street"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.addressStreet)}
              {...register("addressStreet")}
            />
            {errors.addressStreet ? (
              <p className="text-destructive text-xs">
                {errors.addressStreet.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="rep-profile-complement">Complemento</Label>
            <Input
              id="rep-profile-complement"
              disabled={isSubmitting}
              {...register("addressComplement")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-profile-neighborhood">Bairro</Label>
            <Input
              id="rep-profile-neighborhood"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.neighborhood)}
              {...register("neighborhood")}
            />
            {errors.neighborhood ? (
              <p className="text-destructive text-xs">
                {errors.neighborhood.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-profile-city">Cidade</Label>
            <Input
              id="rep-profile-city"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.city)}
              {...register("city")}
            />
            {errors.city ? (
              <p className="text-destructive text-xs">{errors.city.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-profile-state">Estado</Label>
            <select
              id="rep-profile-state"
              className={selectClassName}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.state)}
              {...register("state")}
            >
              <option value="">Selecione</option>
              {BRAZILIAN_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            {errors.state ? (
              <p className="text-destructive text-xs">{errors.state.message}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="min-w-[10rem]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Salvando…
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>
    </form>
  );
}

export { RepresentativeProfileForm };
export type { RepresentativeProfileFormProps };
