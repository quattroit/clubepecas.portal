"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Switch } from "@/components/ui/switch";
import {
  cityFormDefaultValues,
  cityFormSchema,
  type CityFormValues,
} from "@/features/admin/schemas/cityFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { slugify } from "@/utils/slugify";

type CityFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: CityFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: CityFormValues) => void;
};

/**
 * Dialog de criar/editar cidade — RHF + Zod, slug auto-gerado do nome.
 */
function CityFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: CityFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    shouldFocusError: true,
    defaultValues: cityFormDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...cityFormDefaultValues,
      ...defaultValues,
    });
  }, [open, defaultValues, reset]);

  const submit = handleSubmit((values) => {
    if (isSubmitting) return;
    onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar cidade" : "Nova cidade"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados da cidade."
              : "Preencha os dados para criar uma nova cidade."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="city-form"
          onSubmit={submit}
          className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar a cidade"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="city-name">Nome</Label>
            <Input
              id="city-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "city-name-error" : undefined}
              {...register("name")}
              onChange={(event) => {
                const nextName = event.target.value;
                setValue("name", nextName);
                if (!getValues("slug").trim()) {
                  setValue("slug", slugify(nextName), {
                    shouldValidate: true,
                  });
                }
              }}
            />
            {errors.name ? (
              <p id="city-name-error" className="text-destructive text-xs" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city-state">Estado (UF)</Label>
            <Input
              id="city-state"
              maxLength={2}
              className="uppercase"
              placeholder="PR"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.state)}
              aria-describedby={
                errors.state ? "city-state-error" : "city-state-hint"
              }
              {...register("state")}
            />
            {errors.state ? (
              <p id="city-state-error" className="text-destructive text-xs" role="alert">
                {errors.state.message}
              </p>
            ) : (
              <p id="city-state-hint" className="text-muted-foreground text-xs">
                Sigla do estado com 2 letras (ex.: PR, SP).
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city-slug">Slug (opcional)</Label>
            <Input
              id="city-slug"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? "city-slug-error" : "city-slug-hint"}
              {...register("slug")}
            />
            {errors.slug ? (
              <p id="city-slug-error" className="text-destructive text-xs" role="alert">
                {errors.slug.message}
              </p>
            ) : (
              <p id="city-slug-hint" className="text-muted-foreground text-xs">
                Gerado automaticamente a partir do nome — pode ser editado ou
                deixado em branco para a API gerar.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city-display-order">Ordem de exibição</Label>
            <Input
              id="city-display-order"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.displayOrder)}
              {...register("displayOrder", { valueAsNumber: true })}
            />
            {errors.displayOrder ? (
              <p className="text-destructive text-xs" role="alert">
                {errors.displayOrder.message}
              </p>
            ) : null}
          </div>

          <div className="border-border flex items-center justify-between gap-4 rounded-xl border p-3">
            <div className="min-w-0">
              <Label htmlFor="city-is-active" className="text-sm font-medium">
                Cidade ativa
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                {mode === "edit"
                  ? "Altere o status pela ação “Ativar/Inativar” na listagem."
                  : "Cidades inativas não aparecem nas listas públicas."}
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="city-is-active"
                  checked={field.value}
                  disabled={isSubmitting || mode === "edit"}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>
            Cancelar
          </DialogClose>
          <Button
            type="submit"
            form="city-form"
            variant="primary"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Salvando…
              </>
            ) : mode === "edit" ? (
              "Salvar alterações"
            ) : (
              "Criar cidade"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CityFormDialog };
export type { CityFormDialogProps };
