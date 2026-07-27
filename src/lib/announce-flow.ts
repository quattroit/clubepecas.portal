import { ROUTES } from "@/constants/routes";

/** Query param `next` após login/cadastro vindos do fluxo Anunciar. */
export const ANNOUNCE_AUTH_NEXT = ROUTES.NEW_ADVERTISEMENT;

/** Query param na página de perfil quando o usuário ainda não tem loja. */
export const ANNOUNCE_PROFILE_PARAM = "fromAnnounce";

/**
 * URL de login que, após sucesso, leva a /painel/anuncios/novo.
 */
export function getAnnounceLoginPath(): string {
  return `${ROUTES.LOGIN}?next=${encodeURIComponent(ANNOUNCE_AUTH_NEXT)}`;
}

/**
 * URL de cadastro com o mesmo retorno pós-auth do anúncio.
 */
export function getAnnounceRegisterPath(): string {
  return `${ROUTES.REGISTER}?next=${encodeURIComponent(ANNOUNCE_AUTH_NEXT)}`;
}

/**
 * Perfil do vendedor com aviso do fluxo Anunciar.
 */
export function getAnnounceProfilePath(): string {
  return `${ROUTES.PROFILE}?${ANNOUNCE_PROFILE_PARAM}=1`;
}

/**
 * Destino para usuário já autenticado (com/sem perfil de vendedor).
 */
export function resolveAuthenticatedAnnouncePath(hasSellerProfile: boolean): string {
  return hasSellerProfile
    ? ROUTES.NEW_ADVERTISEMENT
    : getAnnounceProfilePath();
}

/**
 * Aceita apenas redirecionamentos internos seguros para a área autenticada.
 */
export function getSafeAuthNextPath(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  if (next.startsWith("/painel") || next.startsWith("/admin") || next.startsWith("/comprador"))
    return next;
  return null;
}

/**
 * Lê `?next=` da URL atual (usado no sucesso de login/cadastro).
 */
export function readAuthNextFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  return getSafeAuthNextPath(
    new URLSearchParams(window.location.search).get("next"),
  );
}

/**
 * Monta a URL de login preservando a rota protegida solicitada.
 */
export function buildLoginPathWithNext(pathWithSearch: string): string {
  const safeNext = getSafeAuthNextPath(pathWithSearch);
  if (!safeNext) {
    return ROUTES.LOGIN;
  }

  if (safeNext.startsWith("/admin")) {
    return `${ROUTES.LOGIN_ADMIN}?next=${encodeURIComponent(safeNext)}`;
  }

  return `${ROUTES.LOGIN}?next=${encodeURIComponent(safeNext)}`;
}

/**
 * Monta a URL de login administrativo preservando a rota solicitada.
 */
export function buildAdminLoginPathWithNext(pathWithSearch: string): string {
  const safeNext = getSafeAuthNextPath(pathWithSearch);
  if (!safeNext || !safeNext.startsWith("/admin")) {
    return ROUTES.LOGIN_ADMIN;
  }

  return `${ROUTES.LOGIN_ADMIN}?next=${encodeURIComponent(safeNext)}`;
}
