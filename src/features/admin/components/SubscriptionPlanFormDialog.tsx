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
import {
  subscriptionPlanFormDefaultValues,
  subscriptionPlanFormSchema,
  type SubscriptionPlanFormValues,
} from "@/features/admin/schemas/subscriptionPlanFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

type SubscriptionPlanFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: SubscriptionPlanFormValues;
  isSubmitting?: boolean;
  submitError?: unknown;
  onSubmit: (values: SubscriptionPlanFormValues) => void;
};

/**
 * Dialog de criar/editar plano de assinatura — RHF + Zod.
 */
function SubscriptionPlanFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting = false,
  submitError,
  onSubmit,
}: SubscriptionPlanFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanFormSchema),
    shouldFocusError: true,
    defaultValues: subscriptionPlanFormDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...subscriptionPlanFormDefaultValues,
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
            {mode === "edit" ? "Editar plano" : "Novo plano"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize os dados do plano de assinatura."
              : "Preencha os dados para criar um novo plano de assinatura."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="subscription-plan-form"
          onSubmit={submit}
          className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto px-0.5"
          noValidate
          aria-busy={isSubmitting}
        >
          {submitError ? (
            <ErrorMessage
              title="Não foi possível salvar o plano"
              message={getFriendlyErrorMessage(submitError)}
            />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="subscription-plan-name">Nome</Label>
            <Input
              id="subscription-plan-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "subscription-plan-name-error" : undefined
              }
              {...register("name")}
            />
            {errors.name ? (
              <p
                id="subscription-plan-name-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subscription-plan-description">Descrição</Label>
            <Textarea
              id="subscription-plan-description"
              rows={3}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "subscription-plan-description-error"
                  : undefined
              }
              {...register("description")}
            />
            {errors.description ? (
              <p
                id="subscription-plan-description-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="subscription-plan-price">Preço (R$)</Label>
              <Input
                id="subscription-plan-price"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={
                  errors.price ? "subscription-plan-price-error" : undefined
                }
                {...register("price")}
              />
              {errors.price ? (
                <p
                  id="subscription-plan-price-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.price.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subscription-plan-limit">Limite de anúncios</Label>
              <Input
                id="subscription-plan-limit"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.advertisementLimit)}
                aria-describedby={
                  errors.advertisementLimit
                    ? "subscription-plan-limit-error"
                    : undefined
                }
                {...register("advertisementLimit", { valueAsNumber: true })}
              />
              {errors.advertisementLimit ? (
                <p
                  id="subscription-plan-limit-error"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {errors.advertisementLimit.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subscription-plan-display-order">
              Ordem de exibição
            </Label>
            <Input
              id="subscription-plan-display-order"
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
                htmlFor="subscription-plan-is-active"
                className="text-sm font-medium"
              >
                Plano ativo
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                Planos inativos não ficam disponíveis para novos assinantes.
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="subscription-plan-is-active"
                  checked={field.value}
                  disabled={isSubmitting}
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
            form="subscription-plan-form"
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
              "Criar plano"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { SubscriptionPlanFormDialog };
export type { SubscriptionPlanFormDialogProps };
