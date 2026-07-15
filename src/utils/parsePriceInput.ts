/**
 * Converte preço digitado (aceita vírgula ou ponto) em number.
 */
export function parsePriceInput(value: string): number {
  return Number(value.trim().replace(",", "."));
}
