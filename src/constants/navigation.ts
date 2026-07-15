import { ROUTES } from "@/constants/routes";

export type NavItem = {
  label: string;
  href: string;
  /** Se false, o item só aparece em desenvolvimento */
  showInProduction?: boolean;
};

/**
 * Links principais do Header (área pública).
 * CTAs de auth / Anunciar Peça ficam separados no Header.
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Início", href: ROUTES.HOME },
  { label: "Anúncios", href: ROUTES.ADVERTISEMENTS },
  { label: "Categorias", href: ROUTES.CATEGORIES },
  { label: "Lojas", href: ROUTES.STORES },
];

/**
 * Links institucionais do Footer.
 */
export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: "Sobre", href: ROUTES.ABOUT },
  { label: "Contato", href: ROUTES.CONTACT },
  { label: "Termos", href: ROUTES.TERMS },
  { label: "Privacidade", href: ROUTES.PRIVACY },
];

export function isNavItemVisible(item: NavItem): boolean {
  if (item.showInProduction === false) {
    return process.env.NODE_ENV !== "production";
  }
  return true;
}

export function getVisibleNavItems(items: NavItem[]): NavItem[] {
  return items.filter(isNavItemVisible);
}
