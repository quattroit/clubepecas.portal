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
  vehicleModelFormDefaultValues,
  vehicleModelFormSchema,
  type VehicleModelFormValues,
} from "@/features/admin/schemas/vehicleModelFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import type { VehicleBrand } from "@/types/VehicleBrand";
import { slugify } from "@/utils/slugify";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
  "aria-invalid:border-destructive",
);

type VehicleModelFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: VehicleModelFormValues;
  brands: VehicleBrand[];
  brandsLoading?: boolean;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: VehicleModelFormValues) => void;
};

/**
 * Dialog de criar/editar modelo de veículo — RHF + Zod, slug auto-gerado do nome.
 */
function VehicleModelFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  brands,
  brandsLoading = false,
  isSubmitting = false,
  submitError,
  onSubmit,
}: VehicleModelFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<VehicleModelFormValues>({
    resolver: zodResolver(vehicleModelFormSchema),
    shouldFocusError: true,
    defaultValues: vehicleModelFormDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...vehicleModelFormDefaultValues,
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
            {mode === "edit" ? "Editar modelo" : "Novo modelo"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados do modelo de veículo."
              : "Preencha os dados para criar um novo modelo de veículo."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="vehicle-model-form"
          onSubmit={submit}
          className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar o modelo"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-model-brand">Marca</Label>
            <select
              id="vehicle-model-brand"
              className={selectClassName}
              disabled={isSubmitting || brandsLoading}
              aria-invalid={Boolean(errors.vehicleBrandId)}
              aria-describedby={
                errors.vehicleBrandId ? "vehicle-model-brand-error" : undefined
              }
              defaultValue=""
              {...register("vehicleBrandId")}
            >
              {brandsLoading ? (
                <option value="">Carregando…</option>
              ) : (
                <>
                  <option value="" disabled>
                    Selecione uma marca
                  </option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.vehicleBrandId ? (
              <p
                id="vehicle-model-brand-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.vehicleBrandId.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-model-name">Nome</Label>
            <Input
              id="vehicle-model-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "vehicle-model-name-error" : undefined
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
                id="vehicle-model-name-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-model-slug">Slug (opcional)</Label>
            <Input
              id="vehicle-model-slug"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={
                errors.slug
                  ? "vehicle-model-slug-error"
                  : "vehicle-model-slug-hint"
              }
              {...register("slug")}
            />
            {errors.slug ? (
              <p
                id="vehicle-model-slug-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.slug.message}
              </p>
            ) : (
              <p
                id="vehicle-model-slug-hint"
                className="text-muted-foreground text-xs"
              >
                Gerado automaticamente a partir do nome — pode ser editado ou
                deixado em branco para a API gerar.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vehicle-model-display-order">Ordem de exibição</Label>
            <Input
              id="vehicle-model-display-order"
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
                htmlFor="vehicle-model-is-active"
                className="text-sm font-medium"
              >
                Modelo ativo
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                {mode === "edit"
                  ? "Altere o status pela ação “Ativar/Inativar” na listagem."
                  : "Modelos inativos não aparecem nas listas públicas."}
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="vehicle-model-is-active"
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
            form="vehicle-model-form"
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
              "Criar modelo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { VehicleModelFormDialog };
export type { VehicleModelFormDialogProps };
