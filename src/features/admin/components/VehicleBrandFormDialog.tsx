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
  vehicleBrandFormDefaultValues,
  vehicleBrandFormSchema,
  type VehicleBrandFormValues,
} from "@/features/admin/schemas/vehicleBrandFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { slugify } from "@/utils/slugify";

type VehicleBrandFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: VehicleBrandFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: VehicleBrandFormValues) => void;
};

/**
 * Dialog de criar/editar marca de veículo — RHF + Zod, slug auto-gerado do nome.
 */
function VehicleBrandFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: VehicleBrandFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<VehicleBrandFormValues>({
    resolver: zodResolver(vehicleBrandFormSchema),
    shouldFocusError: true,
    defaultValues: vehicleBrandFormDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...vehicleBrandFormDefaultValues,
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
            {mode === "edit" ? "Editar marca" : "Nova marca"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados da marca de veículo."
              : "Preencha os dados para criar uma nova marca de veículo."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="vehicle-brand-form"
          onSubmit={submit}
          className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar a marca"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-brand-name">Nome</Label>
            <Input
              id="vehicle-brand-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "vehicle-brand-name-error" : undefined
              }
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
              <p
                id="vehicle-brand-name-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-brand-slug">Slug (opcional)</Label>
            <Input
              id="vehicle-brand-slug"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={
                errors.slug
                  ? "vehicle-brand-slug-error"
                  : "vehicle-brand-slug-hint"
              }
              {...register("slug")}
            />
            {errors.slug ? (
              <p
                id="vehicle-brand-slug-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.slug.message}
              </p>
            ) : (
              <p
                id="vehicle-brand-slug-hint"
                className="text-muted-foreground text-xs"
              >
                Gerado automaticamente a partir do nome — pode ser editado ou
                deixado em branco para a API gerar.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-brand-display-order">Ordem de exibição</Label>
            <Input
              id="vehicle-brand-display-order"
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
              <Label
                htmlFor="vehicle-brand-is-active"
                className="text-sm font-medium"
              >
                Marca ativa
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                {mode === "edit"
                  ? "Altere o status pela ação “Ativar/Inativar” na listagem."
                  : "Marcas inativas não aparecem nas listas públicas."}
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="vehicle-brand-is-active"
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
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting} />
            }
          >
            Cancelar
          </DialogClose>
          <Button
            type="submit"
            form="vehicle-brand-form"
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
              "Criar marca"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { VehicleBrandFormDialog };
export type { VehicleBrandFormDialogProps };
