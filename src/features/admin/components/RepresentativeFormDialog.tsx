"use client";

import { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  representativeFormDefaultValues,
  representativeFormSchema,
  type RepresentativeFormValues,
} from "@/features/admin/schemas/representativeFormSchema";
import { useViaCepLookup } from "@/hooks/api/useViaCepLookup";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { PersonType } from "@/contracts/common/enums";
import { BRAZILIAN_STATES } from "@/utils/brazilianStates";
import { cn } from "@/lib/utils";
import {
  formatDocumentInput,
  onlyDigits,
} from "@/utils/document";
import {
  formatPostalCodeInput,
  normalizePostalCode,
} from "@/utils/postalCode";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
);

type RepresentativeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  representativeCode?: string | null;
  defaultValues?: RepresentativeFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: RepresentativeFormValues) => void;
};

function RepresentativeFormDialog({
  open,
  onOpenChange,
  mode,
  representativeCode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: RepresentativeFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RepresentativeFormValues>({
    resolver: zodResolver(representativeFormSchema),
    shouldFocusError: true,
    defaultValues: representativeFormDefaultValues,
  });

  const zipCode = useWatch({ control, name: "zipCode" }) ?? "";
  const viaCepQuery = useViaCepLookup(zipCode, open && !isSubmitting);

  useEffect(() => {
    if (!open) return;
    reset({
      ...representativeFormDefaultValues,
      ...defaultValues,
    });
  }, [open, defaultValues, reset]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? "Editar representante"
              : "Novo representante"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados do representante. Código e CPF não podem ser alterados."
              : "Cadastre um representante comercial. O código será gerado automaticamente."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="representative-form"
          onSubmit={submit}
          className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar o representante"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          {mode === "edit" && representativeCode ? (
            <div className="bg-muted/40 rounded-xl border px-4 py-3">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Código do representante
              </p>
              <p className="text-foreground mt-1 font-mono text-lg font-semibold">
                {representativeCode}
              </p>
            </div>
          ) : null}

          <section className="flex flex-col gap-4">
            <h3 className="text-foreground text-sm font-semibold">
              Dados pessoais
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="rep-name">Nome</Label>
                <Input
                  id="rep-name"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="text-destructive text-xs">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rep-document">CPF</Label>
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (
                    <Input
                      id="rep-document"
                      disabled={isSubmitting || mode === "edit"}
                      placeholder="000.000.000-00"
                      aria-invalid={Boolean(errors.document)}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(
                          formatDocumentInput(
                            event.target.value,
                            PersonType.Individual,
                          ),
                        )
                      }
                    />
                  )}
                />
                {errors.document ? (
                  <p className="text-destructive text-xs">
                    {errors.document.message}
                  </p>
                ) : mode === "edit" ? (
                  <p className="text-muted-foreground text-xs">
                    CPF não pode ser alterado.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rep-phone">Telefone</Label>
                <Input
                  id="rep-phone"
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

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="rep-email">E-mail</Label>
                <Input
                  id="rep-email"
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
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-foreground text-sm font-semibold">Endereço</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="rep-zip">CEP</Label>
                <Controller
                  control={control}
                  name="zipCode"
                  render={({ field }) => (
                    <Input
                      id="rep-zip"
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
                <Label htmlFor="rep-number">Número</Label>
                <Input
                  id="rep-number"
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
                <Label htmlFor="rep-street">Logradouro</Label>
                <Input
                  id="rep-street"
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
                <Label htmlFor="rep-complement">Complemento</Label>
                <Input
                  id="rep-complement"
                  disabled={isSubmitting}
                  {...register("addressComplement")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rep-neighborhood">Bairro</Label>
                <Input
                  id="rep-neighborhood"
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
                <Label htmlFor="rep-city">Cidade</Label>
                <Input
                  id="rep-city"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.city)}
                  {...register("city")}
                />
                {errors.city ? (
                  <p className="text-destructive text-xs">{errors.city.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rep-state">Estado</Label>
                <select
                  id="rep-state"
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
                  <p className="text-destructive text-xs">
                    {errors.state.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rep-status">Status</Label>
                <select
                  id="rep-status"
                  className={selectClassName}
                  disabled={isSubmitting}
                  {...register("status")}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
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
            form="representative-form"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando…
              </>
            ) : mode === "edit" ? (
              "Salvar alterações"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RepresentativeFormDialog };
