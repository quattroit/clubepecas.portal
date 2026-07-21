import { BillingCycle } from "@/contracts/common/enums";

/**
 * Rótulos estáticos usados apenas para montar seletores de UI (ex.: opções do
 * formulário administrativo) quando ainda não existe um preço vindo da API
 * para aquele ciclo. Sempre que houver um DTO de preço disponível, prefira o
 * `billingCycleLabel` retornado pela API em vez destes rótulos.
 */
const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  [BillingCycle.Monthly]: "Mensal",
  [BillingCycle.Quarterly]: "Trimestral",
  [BillingCycle.Yearly]: "Anual",
};

/** Sufixo usado ao formatar preços: "R$ X / mês". */
const BILLING_CYCLE_SUFFIXES: Record<BillingCycle, string> = {
  [BillingCycle.Monthly]: "mês",
  [BillingCycle.Quarterly]: "trimestre",
  [BillingCycle.Yearly]: "ano",
};

/** Ordem de exibição padrão dos ciclos nos seletores. */
export const BILLING_CYCLE_OPTIONS: readonly BillingCycle[] = [
  BillingCycle.Monthly,
  BillingCycle.Quarterly,
  BillingCycle.Yearly,
];

export function billingCycleLabel(cycle: BillingCycle): string {
  return BILLING_CYCLE_LABELS[cycle] ?? "—";
}

export function billingCycleSuffix(cycle: BillingCycle): string {
  return BILLING_CYCLE_SUFFIXES[cycle] ?? "ciclo";
}
