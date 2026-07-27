/**
 * Formata data ISO em pt-BR (ex.: 15 de jul. de 2026).
 * Apenas apresentação — sem regra de negócio.
 */
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/** Formata hora ISO em pt-BR (ex.: 14:30). */
export function formatTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
