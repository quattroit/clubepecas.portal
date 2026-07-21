/**
 * Converte parâmetro de rota dinâmica (string da URL) em ID numérico da entidade.
 */
export function parseRouteId(
  param: string | string[] | undefined,
): number | undefined {
  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw?.trim()) return undefined;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}
