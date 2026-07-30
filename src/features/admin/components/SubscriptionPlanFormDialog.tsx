"use client";

import { useEffect } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
  subscriptionPlanPriceFormDefaultValues,
  type SubscriptionPlanFormValues,
} from "@/features/admin/schemas/subscriptionPlanFormSchema";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { BILLING_CYCLE_OPTIONS, billingCycleLabel } from "@/utils/billingCycle";

const selectClassName =
  "border-input bg-surface focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted";

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
 * Gerencia o array de preços por ciclo de cobrança (Sprint 8.3.1).
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
    watch,
    formState: { errors },
  } = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanFormSchema),
    shouldFocusError: true,
    defaultValues: subscriptionPlanFormDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });

  const descriptionValue = watch("description") ?? "";
  const descriptionLength = descriptionValue.length;
  const descriptionMaxLength = 1000;

  const watchedPrices = watch("prices") ?? [];
  const usedCycles = new Set(watchedPrices.map((price) => price.billingCycle));
  const availableCyclesToAdd = BILLING_CYCLE_OPTIONS.filter(
    (cycle) => !usedCycles.has(cycle),
  );

  const pricesArrayError =
    typeof errors.prices?.message === "string"
      ? errors.prices.message
      : ((errors.prices as unknown as { root?: { message?: string } } | undefined)
          ?.root?.message ?? undefined);

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

  const handleAddPrice = () => {
    const nextCycle = availableCyclesToAdd[0];
    if (nextCycle == null) return;
    append({
      ...subscriptionPlanPriceFormDefaultValues,
      billingCycle: nextCycle,
      displayOrder: fields.length,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
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
            <div className="flex items-end justify-between gap-3">
              <Label htmlFor="subscription-plan-description">Descrição</Label>
              <span
                id="subscription-plan-description-count"
                className="text-muted-foreground text-xs tabular-nums"
                aria-live="polite"
              >
                {descriptionLength}/{descriptionMaxLength}
              </span>
            </div>
            <Textarea
              id="subscription-plan-description"
              rows={4}
              maxLength={descriptionMaxLength}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "subscription-plan-description-error subscription-plan-description-count"
                  : "subscription-plan-description-count"
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

          <div className="border-border flex items-center justify-between gap-4 rounded-xl border p-3">
            <div className="min-w-0">
              <Label
                htmlFor="subscription-plan-is-demo"
                className="text-sm font-medium"
              >
                Plano demonstração
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                Trial sem renovação automática; exige preços ativos iguais a
                R$&nbsp;0 e expira ao fim do ciclo.
              </p>
              {errors.isDemo ? (
                <p className="text-destructive mt-1 text-xs" role="alert">
                  {errors.isDemo.message}
                </p>
              ) : null}
            </div>
            <Controller
              name="isDemo"
              control={control}
              render={({ field }) => (
                <Switch
                  id="subscription-plan-is-demo"
                  checked={field.value}
                  disabled={isSubmitting}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Ciclos de cobrança</p>
                <p className="text-muted-foreground text-xs">
                  Adicione, edite ou desative os ciclos oferecidos por este plano.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting || availableCyclesToAdd.length === 0}
                onClick={handleAddPrice}
              >
                <Plus className="size-4" aria-hidden />
                Adicionar ciclo
              </Button>
            </div>

            {pricesArrayError ? (
              <p className="text-destructive text-xs" role="alert">
                {pricesArrayError}
              </p>
            ) : null}

            <div className="flex flex-col gap-4">
              {fields.map((field, index) => {
                const rowErrors = errors.prices?.[index];
                const currentCycle = watchedPrices[index]?.billingCycle;

                return (
                  <div
                    key={field.id}
                    className="border-border flex flex-col gap-3 rounded-xl border p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor={`subscription-plan-price-${index}-cycle`}>
                          Ciclo
                        </Label>
                        <select
                          id={`subscription-plan-price-${index}-cycle`}
                          className={selectClassName}
                          disabled={isSubmitting}
                          aria-label="Ciclo de cobrança"
                          {...register(`prices.${index}.billingCycle`, {
                            valueAsNumber: true,
                          })}
                        >
                          {BILLING_CYCLE_OPTIONS.map((cycle) => (
                            <option
                              key={cycle}
                              value={cycle}
                              disabled={
                                cycle !== currentCycle && usedCycles.has(cycle)
                              }
                            >
                              {billingCycleLabel(cycle)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isSubmitting || fields.length <= 1}
                        aria-label="Remover ciclo"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`subscription-plan-price-${index}-price`}>
                          Preço (R$)
                        </Label>
                        <Input
                          id={`subscription-plan-price-${index}-price`}
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00"
                          disabled={isSubmitting}
                          aria-invalid={Boolean(rowErrors?.price)}
                          {...register(`prices.${index}.price`)}
                        />
                        {rowErrors?.price ? (
                          <p className="text-destructive text-xs" role="alert">
                            {rowErrors.price.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={`subscription-plan-price-${index}-display-order`}
                        >
                          Ordem de exibição
                        </Label>
                        <Input
                          id={`subscription-plan-price-${index}-display-order`}
                          type="number"
                          min={0}
                          step={1}
                          inputMode="numeric"
                          disabled={isSubmitting}
                          aria-invalid={Boolean(rowErrors?.displayOrder)}
                          {...register(`prices.${index}.displayOrder`, {
                            valueAsNumber: true,
                          })}
                        />
                        {rowErrors?.displayOrder ? (
                          <p className="text-destructive text-xs" role="alert">
                            {rowErrors.displayOrder.message}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`subscription-plan-price-${index}-name`}>
                        Nome de exibição (opcional)
                      </Label>
                      <Input
                        id={`subscription-plan-price-${index}-name`}
                        placeholder="Ex.: Plano Anual"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(rowErrors?.displayName)}
                        {...register(`prices.${index}.displayName`)}
                      />
                      {rowErrors?.displayName ? (
                        <p className="text-destructive text-xs" role="alert">
                          {rowErrors.displayName.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`subscription-plan-price-${index}-description`}>
                        Descrição do ciclo (opcional)
                      </Label>
                      <Textarea
                        id={`subscription-plan-price-${index}-description`}
                        rows={2}
                        maxLength={500}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(rowErrors?.description)}
                        {...register(`prices.${index}.description`)}
                      />
                      {rowErrors?.description ? (
                        <p className="text-destructive text-xs" role="alert">
                          {rowErrors.description.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Controller
                          name={`prices.${index}.isActive`}
                          control={control}
                          render={({ field: switchField }) => (
                            <Switch
                              id={`subscription-plan-price-${index}-active`}
                              size="sm"
                              checked={switchField.value}
                              disabled={isSubmitting}
                              onCheckedChange={switchField.onChange}
                              onBlur={switchField.onBlur}
                            />
                          )}
                        />
                        <Label
                          htmlFor={`subscription-plan-price-${index}-active`}
                          className="text-xs font-medium"
                        >
                          Ciclo ativo
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Controller
                          name={`prices.${index}.isRecommended`}
                          control={control}
                          render={({ field: switchField }) => (
                            <Switch
                              id={`subscription-plan-price-${index}-recommended`}
                              size="sm"
                              checked={switchField.value}
                              disabled={isSubmitting}
                              onCheckedChange={switchField.onChange}
                              onBlur={switchField.onBlur}
                            />
                          )}
                        />
                        <Label
                          htmlFor={`subscription-plan-price-${index}-recommended`}
                          className="text-xs font-medium"
                        >
                          Melhor custo-benefício
                        </Label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
