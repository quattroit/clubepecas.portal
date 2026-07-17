/**
 * Formata taxa de conversão para exibição (pt-BR).
 * Null / undefined → "—".
 */
export function formatConversionRate(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  })}%`;
}

/**
 * Formata contadores de métricas (pt-BR).
 */
export function formatMetricCount(value: number): string {
  return value.toLocaleString("pt-BR");
}

/**
 * Formata variação percentual para cards (↑ / ↓ / →).
 * null → sem comparativo (não exibe).
 */
export function formatChangePercent(
  value: number | null | undefined,
): { label: string; trend: "up" | "down" | "neutral" } | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  const formatted = `${Math.abs(value).toLocaleString("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  })}%`;

  if (value > 0) {
    return { label: `↑ ${formatted}`, trend: "up" };
  }
  if (value < 0) {
    return { label: `↓ ${formatted}`, trend: "down" };
  }
  return { label: `→ ${formatted}`, trend: "neutral" };
}
