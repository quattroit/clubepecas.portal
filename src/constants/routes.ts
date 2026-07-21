/**
 * Rotas oficiais da aplicação.
 * Expandir aqui conforme novas telas — evitar strings espalhadas.
 */

export const ROUTES = {
  HOME: "/",
  CATEGORIES: "/categorias",
  ADVERTISEMENTS: "/anuncios",
  STORES: "/lojas",
  PLANS: "/planos",
  ABOUT: "/sobre",
  CONTACT: "/contato",
  TERMS: "/termos",
  PRIVACY: "/privacidade",
  LOGIN: "/login",
  LOGIN_ADMIN: "/loginAdm",
  REGISTER: "/cadastro",
  FORGOT_PASSWORD: "/esqueci-senha",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/painel",
  MY_ADVERTISEMENTS: "/painel/anuncios",
  NEW_ADVERTISEMENT: "/painel/anuncios/novo",
  PROFILE: "/painel/perfil",
  MY_PLAN: "/painel/meu-plano",
  ADMIN: "/admin",
  ADMIN_SELLERS: "/admin/vendedores",
  ADMIN_ADVERTISEMENTS: "/admin/anuncios",
  ADMIN_CATEGORIES: "/admin/categorias",
  ADMIN_CITIES: "/admin/cidades",
  ADMIN_VEHICLE_BRANDS: "/admin/marcas",
  ADMIN_VEHICLE_MODELS: "/admin/modelos",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_PLANS: "/admin/planos",
  ADMIN_PAYMENTS: "/admin/pagamentos",
  ADMIN_FINANCIAL: "/admin/financeiro",
  ADMIN_FILES: "/admin/arquivos",
  ADMIN_AUDIT: "/admin/auditoria",
  ADMIN_SETTINGS: "/admin/configuracoes",
} as const;

/** Helper para rota pública de detalhe do anúncio (slug) */
export function advertisementPath(slug: string) {
  return `${ROUTES.ADVERTISEMENTS}/${slug}` as const;
}

/** Helper para listagem de anúncios com busca (`?q=`). */
export function advertisementsSearchPath(q?: string | null) {
  const trimmed = q?.trim() ?? "";
  if (!trimmed) {
    return ROUTES.ADVERTISEMENTS;
  }
  return `${ROUTES.ADVERTISEMENTS}?q=${encodeURIComponent(trimmed)}` as const;
}

/** Helper para editar anúncio no painel */
export function editAdvertisementPath(id: number) {
  return `${ROUTES.MY_ADVERTISEMENTS}/${id}/editar` as const;
}

/** Helper para detalhe administrativo do vendedor */
export function adminSellerPath(id: number) {
  return `${ROUTES.ADMIN_SELLERS}/${id}` as const;
}

/** Helper para detalhe administrativo do anúncio */
export function adminAdvertisementPath(id: number) {
  return `${ROUTES.ADMIN_ADVERTISEMENTS}/${id}` as const;
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
  PLANS: ROUTES.PLANS,
  ABOUT: ROUTES.ABOUT,
  CONTACT: ROUTES.CONTACT,
  TERMS: ROUTES.TERMS,
  PRIVACY: ROUTES.PRIVACY,
} as const;

/** Páginas de autenticação (login / cadastro). */
export const AUTH_ROUTES = {
  LOGIN: ROUTES.LOGIN,
  LOGIN_ADMIN: ROUTES.LOGIN_ADMIN,
  REGISTER: ROUTES.REGISTER,
  FORGOT_PASSWORD: ROUTES.FORGOT_PASSWORD,
  RESET_PASSWORD: ROUTES.RESET_PASSWORD,
} as const;

/** Páginas da área autenticada do vendedor (protegidas por AuthGuard). */
export const PRIVATE_ROUTES = {
  DASHBOARD: ROUTES.DASHBOARD,
  MY_ADVERTISEMENTS: ROUTES.MY_ADVERTISEMENTS,
  NEW_ADVERTISEMENT: ROUTES.NEW_ADVERTISEMENT,
  PROFILE: ROUTES.PROFILE,
  MY_PLAN: ROUTES.MY_PLAN,
} as const;

/** Páginas da área administrativa (protegidas por AdminAuthGuard). */
export const ADMIN_ROUTES = {
  ADMIN: ROUTES.ADMIN,
  ADMIN_SELLERS: ROUTES.ADMIN_SELLERS,
  ADMIN_ADVERTISEMENTS: ROUTES.ADMIN_ADVERTISEMENTS,
  ADMIN_CATEGORIES: ROUTES.ADMIN_CATEGORIES,
  ADMIN_CITIES: ROUTES.ADMIN_CITIES,
  ADMIN_VEHICLE_BRANDS: ROUTES.ADMIN_VEHICLE_BRANDS,
  ADMIN_VEHICLE_MODELS: ROUTES.ADMIN_VEHICLE_MODELS,
  ADMIN_ANALYTICS: ROUTES.ADMIN_ANALYTICS,
  ADMIN_PLANS: ROUTES.ADMIN_PLANS,
  ADMIN_PAYMENTS: ROUTES.ADMIN_PAYMENTS,
  ADMIN_FINANCIAL: ROUTES.ADMIN_FINANCIAL,
  ADMIN_FILES: ROUTES.ADMIN_FILES,
  ADMIN_AUDIT: ROUTES.ADMIN_AUDIT,
  ADMIN_SETTINGS: ROUTES.ADMIN_SETTINGS,
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES];
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type PrivateRoute = (typeof PRIVATE_ROUTES)[keyof typeof PRIVATE_ROUTES];
export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];
