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
import { Textarea } from "@/components/ui/textarea";
import { CategoryIconPicker } from "@/features/admin/components/CategoryIconPicker";
import {
  categoryFormDefaultValues,
  categoryFormSchema,
  type CategoryFormValues,
} from "@/features/admin/schemas/categoryFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { slugify } from "@/utils/slugify";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: CategoryFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: CategoryFormValues) => void;
};

/**
 * Dialog de criar/editar categoria — RHF + Zod, slug auto-gerado do nome.
 */
function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    shouldFocusError: true,
    defaultValues: categoryFormDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...categoryFormDefaultValues,
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
            {mode === "edit" ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados da categoria."
              : "Preencha os dados para criar uma nova categoria."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="category-form"
          onSubmit={submit}
          className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar a categoria"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "category-name-error" : undefined}
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
              <p id="category-name-error" className="text-destructive text-xs" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-slug">Slug</Label>
            <Input
              id="category-slug"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? "category-slug-error" : "category-slug-hint"}
              {...register("slug")}
            />
            {errors.slug ? (
              <p id="category-slug-error" className="text-destructive text-xs" role="alert">
                {errors.slug.message}
              </p>
            ) : (
              <p id="category-slug-hint" className="text-muted-foreground text-xs">
                Gerado automaticamente a partir do nome — pode ser editado.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-description">Descrição</Label>
            <Textarea
              id="category-description"
              rows={3}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            {errors.description ? (
              <p className="text-destructive text-xs" role="alert">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <Controller
            name="iconValue"
            control={control}
            render={({ field }) => (
              <CategoryIconPicker
                id="category-icon"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
                error={errors.iconValue?.message}
              />
            )}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-display-order">Ordem de exibição</Label>
            <Input
              id="category-display-order"
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
              <Label htmlFor="category-is-active" className="text-sm font-medium">
                Categoria ativa
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                {mode === "edit"
                  ? "Altere o status pela ação “Ativar/Inativar” na listagem."
                  : "Categorias inativas não aparecem no marketplace público."}
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="category-is-active"
                  checked={field.value}
                  disabled={isSubmitting || mode === "edit"}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <fieldset className="bg-muted/30 border-border flex flex-col gap-4 rounded-xl border p-4">
            <legend className="text-foreground px-1 text-sm font-semibold">
              SEO (opcional)
            </legend>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category-meta-title">Meta title</Label>
              <Input
                id="category-meta-title"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.metaTitle)}
                {...register("metaTitle")}
              />
              {errors.metaTitle ? (
                <p className="text-destructive text-xs" role="alert">
                  {errors.metaTitle.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category-meta-description">Meta description</Label>
              <Textarea
                id="category-meta-description"
                rows={2}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.metaDescription)}
                {...register("metaDescription")}
              />
              {errors.metaDescription ? (
                <p className="text-destructive text-xs" role="alert">
                  {errors.metaDescription.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category-og-image">Imagem Open Graph</Label>
              <Input
                id="category-og-image"
                type="url"
                placeholder="https://"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.ogImage)}
                {...register("ogImage")}
              />
              {errors.ogImage ? (
                <p className="text-destructive text-xs" role="alert">
                  {errors.ogImage.message}
                </p>
              ) : null}
            </div>
          </fieldset>
        </form>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>
            Cancelar
          </DialogClose>
          <Button
            type="submit"
            form="category-form"
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
              "Criar categoria"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CategoryFormDialog };
export type { CategoryFormDialogProps };
