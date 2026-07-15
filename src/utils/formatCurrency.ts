/**
 * Formata valor monetário em Real (BRL).
 * Apenas apresentação — sem regra de negócio.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
