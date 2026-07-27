"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { CityCombobox } from "@/components/ui/city-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PROFESSIONAL_BUYER_SEGMENT_OPTIONS } from "@/contracts/professional-buyers";
import {
  professionalBuyerFormDefaultValues,
  professionalBuyerFormSchema,
  type ProfessionalBuyerFormValues,
} from "@/features/admin/schemas/professionalBuyerFormSchema";
import { useCities } from "@/hooks/api/useCities";
import { useViaCepLookup } from "@/hooks/api/useViaCepLookup";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { PASSWORD_HINT } from "@/lib/auth/passwordPolicy";
import { cn } from "@/lib/utils";
import { formatDocumentAuto, onlyDigits } from "@/utils/document";
import {
  formatPostalCodeInput,
  normalizePostalCode,
} from "@/utils/postalCode";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

type ProfessionalBuyerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: ProfessionalBuyerFormValues) => void;
};

function ProfessionalBuyerFormDialog({
  open,
  onOpenChange,
  isSubmitting = false,
  submitError,
  onSubmit,
}: ProfessionalBuyerFormDialogProps) {
  const citiesQuery = useCities();
  const cities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalBuyerFormValues>({
    resolver: zodResolver(professionalBuyerFormSchema),
    shouldFocusError: true,
    defaultValues: professionalBuyerFormDefaultValues,
  });

  const zipCode = useWatch({ control, name: "zipCode" }) ?? "";
  const viaCepQuery = useViaCepLookup(zipCode, open && !isSubmitting);

  useEffect(() => {
    if (!open) return;
    reset(professionalBuyerFormDefaultValues);
  }, [open, reset]);

  useEffect(() => {
    const digits = normalizePostalCode(zipCode);
    if (digits.length !== 8 || !viaCepQuery.data) return;

    setValue("address", viaCepQuery.data.street, { shouldValidate: true });
    setValue("neighborhood", viaCepQuery.data.neighborhood, {
      shouldValidate: true,
    });

    const matchedCity = cities.find(
      (city) =>
        city.name.toLowerCase() === viaCepQuery.data!.city.toLowerCase() &&
        city.state.toUpperCase() === viaCepQuery.data!.state.toUpperCase(),
    );
    if (matchedCity) {
      setValue("cityId", matchedCity.id, { shouldValidate: true });
    }
  }, [viaCepQuery.data, zipCode, setValue, cities]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo comprador profissional</DialogTitle>
          <DialogDescription>
            Cadastre um comprador profissional com senha temporária para o
            primeiro acesso em /login.
          </DialogDescription>
        </DialogHeader>

        <form
          id="professional-buyer-form"
          onSubmit={submit}
          className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível cadastrar o comprador"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <section className="flex flex-col gap-4">
            <h3 className="text-foreground text-sm font-semibold">Empresa</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-company">Nome fantasia</Label>
                <Input
                  id="pb-company"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.companyName)}
                  {...register("companyName")}
                />
                {errors.companyName ? (
                  <p className="text-destructive text-xs">
                    {errors.companyName.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-corporate">Razão social</Label>
                <Input
                  id="pb-corporate"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.corporateName)}
                  {...register("corporateName")}
                />
                {errors.corporateName ? (
                  <p className="text-destructive text-xs">
                    {errors.corporateName.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-document">CPF/CNPJ</Label>
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (
                    <Input
                      id="pb-document"
                      disabled={isSubmitting}
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      aria-invalid={Boolean(errors.document)}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(formatDocumentAuto(event.target.value))
                      }
                    />
                  )}
                />
                {errors.document ? (
                  <p className="text-destructive text-xs">
                    {errors.document.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-segment">Segmento</Label>
                <Controller
                  control={control}
                  name="segment"
                  render={({ field }) => (
                    <select
                      id="pb-segment"
                      className={selectClassName}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.segment)}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    >
                      {PROFESSIONAL_BUYER_SEGMENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.segment ? (
                  <p className="text-destructive text-xs">
                    {errors.segment.message}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-foreground text-sm font-semibold">Contato</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="pb-contact">Nome do contato</Label>
                <Input
                  id="pb-contact"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.contactName)}
                  {...register("contactName")}
                />
                {errors.contactName ? (
                  <p className="text-destructive text-xs">
                    {errors.contactName.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="pb-email">E-mail</Label>
                <Input
                  id="pb-email"
                  type="email"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-destructive text-xs">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-phone">Telefone</Label>
                <Input
                  id="pb-phone"
                  disabled={isSubmitting}
                  placeholder="11999999999"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone", {
                    setValueAs: (value: string) => onlyDigits(value),
                  })}
                />
                {errors.phone ? (
                  <p className="text-destructive text-xs">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-whatsapp">WhatsApp</Label>
                <Input
                  id="pb-whatsapp"
                  disabled={isSubmitting}
                  placeholder="11999999999"
                  aria-invalid={Boolean(errors.whatsApp)}
                  {...register("whatsApp", {
                    setValueAs: (value: string) => onlyDigits(value),
                  })}
                />
                {errors.whatsApp ? (
                  <p className="text-destructive text-xs">
                    {errors.whatsApp.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="pb-password">Senha temporária</Label>
                <PasswordInput
                  id="pb-password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.temporaryPassword)}
                  {...register("temporaryPassword")}
                />
                <p className="text-muted-foreground text-xs">{PASSWORD_HINT}</p>
                {errors.temporaryPassword ? (
                  <p className="text-destructive text-xs">
                    {errors.temporaryPassword.message}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-foreground text-sm font-semibold">Endereço</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-zip">CEP</Label>
                <Controller
                  control={control}
                  name="zipCode"
                  render={({ field }) => (
                    <Input
                      id="pb-zip"
                      disabled={isSubmitting}
                      placeholder="00000-000"
                      aria-invalid={Boolean(errors.zipCode)}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(
                          formatPostalCodeInput(event.target.value),
                        )
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
                <Label htmlFor="pb-number">Número</Label>
                <Input
                  id="pb-number"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.number)}
                  {...register("number")}
                />
                {errors.number ? (
                  <p className="text-destructive text-xs">
                    {errors.number.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="pb-address">Logradouro</Label>
                <Input
                  id="pb-address"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.address)}
                  {...register("address")}
                />
                {errors.address ? (
                  <p className="text-destructive text-xs">
                    {errors.address.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pb-neighborhood">Bairro</Label>
                <Input
                  id="pb-neighborhood"
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
                <Label htmlFor="pb-city">Cidade</Label>
                <Controller
                  control={control}
                  name="cityId"
                  render={({ field }) => (
                    <CityCombobox
                      id="pb-city"
                      cities={cities}
                      value={field.value}
                      disabled={isSubmitting || citiesQuery.isLoading}
                      invalid={Boolean(errors.cityId)}
                      onBlur={field.onBlur}
                      onChange={(next) => field.onChange(next ?? 0)}
                    />
                  )}
                />
                {errors.cityId ? (
                  <p className="text-destructive text-xs">
                    {errors.cityId.message}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </form>

        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting} />
            }
          >
            Cancelar
          </DialogClose>
          <Button
            type="submit"
            form="professional-buyer-form"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando…
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProfessionalBuyerFormDialog };
