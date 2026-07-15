/**
 * Rotas oficiais da aplicação.
 * Expandir aqui conforme novas telas — evitar strings espalhadas.
 */

export const ROUTES = {
  HOME: "/",
  CATEGORIES: "/categorias",
  ADVERTISEMENTS: "/anuncios",
  STORES: "/lojas",
  ABOUT: "/sobre",
  CONTACT: "/contato",
  TERMS: "/termos",
  PRIVACY: "/privacidade",
  LOGIN: "/login",
  REGISTER: "/cadastro",
  DASHBOARD: "/painel",
  MY_ADVERTISEMENTS: "/painel/anuncios",
  NEW_ADVERTISEMENT: "/painel/anuncios/novo",
  PROFILE: "/painel/perfil",
} as const;

/** Helper para rota pública de detalhe do anúncio (slug) */
export function advertisementPath(slug: string) {
  return `${ROUTES.ADVERTISEMENTS}/${slug}` as const;
}

/** Helper para editar anúncio no painel */
export function editAdvertisementPath(id: string) {
  return `${ROUTES.MY_ADVERTISEMENTS}/${id}/editar` as const;
}

/** Helper para rota dinâmica da loja do vendedor */
export function storePath(slug: string) {
  return `${ROUTES.STORES}/${slug}` as const;
}

/** Helper para rota dinâmica de categoria */
export function categoryPath(slug: string) {
  return `${ROUTES.CATEGORIES}/${slug}` as const;
}

/** Páginas acessíveis sem autenticação (área pública). */
export const PUBLIC_ROUTES = {
  HOME: ROUTES.HOME,
  CATEGORIES: ROUTES.CATEGORIES,
  ADVERTISEMENTS: ROUTES.ADVERTISEMENTS,
  STORES: ROUTES.STORES,
  ABOUT: ROUTES.ABOUT,
  CONTACT: ROUTES.CONTACT,
  TERMS: ROUTES.TERMS,
  PRIVACY: ROUTES.PRIVACY,
} as const;

/** Páginas de autenticação (login / cadastro). */
export const AUTH_ROUTES = {
  LOGIN: ROUTES.LOGIN,
  REGISTER: ROUTES.REGISTER,
} as const;

/** Páginas da área autenticada (protegidas por AuthGuard). */
export const PRIVATE_ROUTES = {
  DASHBOARD: ROUTES.DASHBOARD,
  MY_ADVERTISEMENTS: ROUTES.MY_ADVERTISEMENTS,
  NEW_ADVERTISEMENT: ROUTES.NEW_ADVERTISEMENT,
  PROFILE: ROUTES.PROFILE,
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES];
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type PrivateRoute = (typeof PRIVATE_ROUTES)[keyof typeof PRIVATE_ROUTES];
