import { ROUTES } from "@/constants/routes";

/**
 * Destino padrão após cadastro de usuário (ainda sem perfil de loja).
 */
export const SELLER_ONBOARDING_PROFILE_PATH = ROUTES.PROFILE;

/**
 * Destino após criar o perfil — escolher/assinar plano.
 */
export const SELLER_ONBOARDING_PLAN_PATH = ROUTES.MY_PLAN;

/**
 * Rotas liberadas sem perfil de vendedor.
 */
export function isSellerProfileOnlyPath(pathname: string): boolean {
  return (
    pathname === ROUTES.PROFILE || pathname.startsWith(`${ROUTES.PROFILE}?`)
  );
}

/**
 * Rotas liberadas com perfil mas sem plano (ACTIVE/PENDING).
 */
export function isSellerPlanOnboardingPath(pathname: string): boolean {
  if (isSellerProfileOnlyPath(pathname)) return true;
  return (
    pathname === ROUTES.MY_PLAN || pathname.startsWith(`${ROUTES.MY_PLAN}?`)
  );
}

/**
 * Para onde redirecionar no painel conforme onboarding.
 * `hasSeller` / `hasPlan` = null enquanto carrega.
 */
export function resolveSellerOnboardingRedirect(options: {
  pathname: string;
  hasSeller: boolean | null;
  hasPlan: boolean | null;
}): string | null {
  const { pathname, hasSeller, hasPlan } = options;

  if (hasSeller === null) return null;

  if (!hasSeller) {
    return isSellerProfileOnlyPath(pathname)
      ? null
      : SELLER_ONBOARDING_PROFILE_PATH;
  }

  if (hasPlan === null) return null;

  if (!hasPlan) {
    return isSellerPlanOnboardingPath(pathname)
      ? null
      : SELLER_ONBOARDING_PLAN_PATH;
  }

  return null;
}
