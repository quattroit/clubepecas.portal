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
  specialtyFormDefaultValues,
  specialtyFormSchema,
  type SpecialtyFormValues,
} from "@/features/admin/schemas/specialtyFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { slugify } from "@/utils/slugify";

type SpecialtyFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: SpecialtyFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: SpecialtyFormValues) => void;
};

function SpecialtyFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: SpecialtyFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SpecialtyFormValues>({
    resolver: zodResolver(specialtyFormSchema),
    shouldFocusError: true,
    defaultValues: specialtyFormDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...specialtyFormDefaultValues,
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
            {mode === "edit" ? "Editar especialidade" : "Nova especialidade"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados da especialidade."
              : "Preencha os dados para criar uma nova especialidade."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="specialty-form"
          onSubmit={submit}
          className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar a especialidade"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="specialty-name">Nome</Label>
            <Input
              id="specialty-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "specialty-name-error" : undefined
              }
              {...register("name")}
              onChange={(event) => {
                const nextName = event.target.value;
                setValue("name", nextName);
                if (!getValues("slug").trim()) {
                  setValue("slug", slugify(nextName), {
                    shouldValidate: false,
                  });
                }
              }}
            />
            {errors.name ? (
              <p
                id="specialty-name-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="specialty-slug">Slug</Label>
            <Input
              id="specialty-slug"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={
                errors.slug ? "specialty-slug-error" : "specialty-slug-hint"
              }
              {...register("slug")}
            />
            <p id="specialty-slug-hint" className="text-muted-foreground text-xs">
              Opcional — gerado automaticamente a partir do nome.
            </p>
            {errors.slug ? (
              <p
                id="specialty-slug-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.slug.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="specialty-order">Ordem</Label>
            <Input
              id="specialty-order"
              type="number"
              min={0}
              step={1}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.displayOrder)}
              aria-describedby={
                errors.displayOrder ? "specialty-order-error" : undefined
              }
              {...register("displayOrder", { valueAsNumber: true })}
            />
            {errors.displayOrder ? (
              <p
                id="specialty-order-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.displayOrder.message}
              </p>
            ) : null}
          </div>

          {mode === "create" ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="specialty-active">Ativa</Label>
                <p className="text-muted-foreground text-xs">
                  Especialidades inativas não aparecem no perfil do vendedor.
                </p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    id="specialty-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          ) : null}
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
            form="specialty-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Salvando…
              </>
            ) : mode === "edit" ? (
              "Salvar"
            ) : (
              "Criar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { SpecialtyFormDialog };
