import type { MetadataRoute } from "next";

import type { PublicCategoryListItemDto } from "@/contracts/categories/responses";
import type { PublicCityListItemDto } from "@/contracts/cities/responses";
import {
  advertisementPath,
  categoryPath,
  ROUTES,
  storePath,
} from "@/constants/routes";
import { categoryService } from "@/services/category.service";
import { cityService } from "@/services/city.service";
import { sellerService } from "@/services/seller.service";
import { SITEMAP_ORIGIN } from "@/lib/sitemap/constants";
import { PUBLIC_LISTING_MAX_PAGE_SIZE } from "@/utils/public-listing-pagination";
import { MARKETPLACE_UNFILTERED_MAX_PAGES } from "@/utils/marketplace-search";
import { STORES_UNFILTERED_MAX_PAGES } from "@/utils/stores-search";

const PAGE_SIZE = PUBLIC_LISTING_MAX_PAGE_SIZE;
const SHUFFLE_SEED = "sitemap";
const MAX_PAGES_PER_QUERY = 1_000;
const SITEMAP_URL_LIMIT = 50_000;

const STATIC_PATHS = [
  ROUTES.HOME,
  ROUTES.ADVERTISEMENTS,
  ROUTES.STORES,
  ROUTES.CATEGORIES,
  ROUTES.PLANS,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.TERMS,
  ROUTES.PRIVACY,
] as const;

const ALLOWED_SECTIONS = new Set([
  "anuncios",
  "lojas",
  "categorias",
  "planos",
  "sobre",
  "contato",
  "termos",
  "privacidade",
]);

type PageResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

type ListingQuery = {
  page: number;
  state?: string;
};

/**
 * Monta as URLs públicas indexáveis.
 * Falha por completo se qualquer consulta vier incompleta ou inválida —
 * um sitemap parcial não deve parecer uma lista fechada.
 */
export async function loadPublicSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [categorySlugs, advertisementSlugs, storeSlugs] = await Promise.all([
    loadCategorySlugs(),
    loadAdvertisementSlugs(),
    loadStoreSlugs(),
  ]);

  const urls = [
    ...STATIC_PATHS.map((path) => toAbsolute(path)),
    ...categorySlugs.map((slug) => toAbsolute(categoryPath(encodeSlug(slug)))),
    ...storeSlugs.map((slug) => toAbsolute(storePath(encodeSlug(slug)))),
    ...advertisementSlugs.map((slug) =>
      toAbsolute(advertisementPath(encodeSlug(slug))),
    ),
  ];

  const entries = uniqueEntries(urls);

  if (entries.length > SITEMAP_URL_LIMIT) {
    throw new Error(
      `[sitemap] ${entries.length} URLs excedem o limite de ${SITEMAP_URL_LIMIT} por arquivo.`,
    );
  }

  return entries;
}

async function loadCategorySlugs(): Promise<string[]> {
  let response;
  try {
    response = await categoryService.listCategories();
  } catch (error) {
    throw new Error("[sitemap] Falha ao consultar categorias públicas.", {
      cause: error,
    });
  }

  if (!response || !Array.isArray(response.items)) {
    throw new Error("[sitemap] Resposta inválida de categorias públicas.");
  }

  const slugs = flattenCategorySlugs(response.items);
  assertUniqueSlugs("categorias", slugs);
  return slugs;
}

function flattenCategorySlugs(items: PublicCategoryListItemDto[]): string[] {
  const slugs: string[] = [];

  const visit = (item: PublicCategoryListItemDto) => {
    if (item.isActive !== true) return;
    const slug = item.slug?.trim() ?? "";
    if (!slug) {
      throw new Error(
        `[sitemap] Categoria pública ${item.id} sem slug. Sitemap interrompido.`,
      );
    }
    slugs.push(slug);
    for (const child of item.children ?? []) visit(child);
  };

  for (const item of items) visit(item);
  return slugs;
}

async function loadAdvertisementSlugs(): Promise<string[]> {
  return loadSlugs(
    "anúncios",
    MARKETPLACE_UNFILTERED_MAX_PAGES,
    (query) => categoryService.getMarketplace(listingParams(query)),
    (item) => item.slug,
  );
}

async function loadStoreSlugs(): Promise<string[]> {
  return loadSlugs(
    "lojas",
    STORES_UNFILTERED_MAX_PAGES,
    (query) => sellerService.listPublic(listingParams(query)),
    (item) => item.slug,
  );
}

/**
 * A listagem sem filtro devolve no máximo 30 páginas e ainda reduz o
 * totalCount a esse teto. Abaixo do teto, a paginação direta é completa.
 * No teto, a mesma API é relida por UF (`state`), filtro que remove o limite.
 * A ordenação usa semente fixa: o embaralhamento padrão muda a cada request
 * e faria a paginação pular ou repetir registros.
 */
async function loadSlugs<T extends { slug: string }>(
  label: string,
  unfilteredMaxPages: number,
  fetchPage: (query: ListingQuery) => Promise<PageResult<T>>,
  slugOf: (item: T) => string,
): Promise<string[]> {
  const cap = unfilteredMaxPages * PAGE_SIZE;
  const first = await fetchListingPage(label, fetchPage, { page: 1 });

  if (first.totalCount < cap) {
    const items = await collectPages(
      label,
      fetchPage,
      { state: undefined },
      first,
    );
    return slugsFrom(label, items, slugOf);
  }

  const states = await loadStates();
  if (states.length === 0) {
    throw new Error(
      `[sitemap] A listagem de ${label} atingiu o limite sem filtro e não há UFs para concluir a leitura.`,
    );
  }

  const items: T[] = [];
  for (const state of states) {
    const pageItems = await collectPages(`${label} (${state})`, fetchPage, {
      state,
    });
    items.push(...pageItems);
  }

  return slugsFrom(label, items, slugOf);
}

function listingParams(query: ListingQuery) {
  return {
    page: query.page,
    pageSize: PAGE_SIZE,
    sort: "random",
    shuffleSeed: SHUFFLE_SEED,
    ...(query.state ? { state: query.state } : {}),
  };
}

async function loadStates(): Promise<string[]> {
  let response;
  try {
    response = await cityService.listCities(true);
  } catch (error) {
    throw new Error(
      "[sitemap] Falha ao consultar cidades para paginar além do limite sem filtro.",
      { cause: error },
    );
  }

  if (!response || !Array.isArray(response.items)) {
    throw new Error("[sitemap] Resposta inválida de cidades.");
  }

  return uniqueStates(response.items);
}

function uniqueStates(cities: PublicCityListItemDto[]): string[] {
  const states = new Set<string>();

  for (const city of cities) {
    const state = city.state?.trim().toUpperCase() ?? "";
    if (!state) {
      throw new Error(
        `[sitemap] Cidade "${city.name}" sem UF. Não é possível garantir a listagem completa.`,
      );
    }
    states.add(state);
  }

  return [...states].sort();
}

async function collectPages<T>(
  label: string,
  fetchPage: (query: ListingQuery) => Promise<PageResult<T>>,
  scope: { state?: string },
  firstPage?: PageResult<T>,
): Promise<T[]> {
  const collected: T[] = [];
  let expectedTotal: number | null = null;

  for (let page = 1; page <= MAX_PAGES_PER_QUERY; page += 1) {
    const response =
      page === 1 && firstPage
        ? firstPage
        : await fetchListingPage(label, fetchPage, {
            page,
            state: scope.state,
          });

    if (expectedTotal === null) {
      expectedTotal = response.totalCount;
    } else if (response.totalCount !== expectedTotal) {
      throw new Error(
        `[sitemap] totalCount de ${label} mudou durante a paginação (${expectedTotal} → ${response.totalCount}).`,
      );
    }

    collected.push(...response.items);

    if (collected.length > expectedTotal) {
      throw new Error(
        `[sitemap] ${label} devolveu mais registros (${collected.length}) do que totalCount (${expectedTotal}).`,
      );
    }

    if (collected.length === expectedTotal || response.items.length === 0) {
      break;
    }

    if (page === MAX_PAGES_PER_QUERY) {
      throw new Error(
        `[sitemap] Paginação de ${label} parou em ${MAX_PAGES_PER_QUERY} páginas com ${collected.length} de ${expectedTotal} registros.`,
      );
    }
  }

  if (expectedTotal === null || collected.length !== expectedTotal) {
    throw new Error(
      `[sitemap] Paginação incompleta de ${label}: ${collected.length} de ${expectedTotal ?? "?"}.`,
    );
  }

  return collected;
}

async function fetchListingPage<T>(
  label: string,
  fetchPage: (query: ListingQuery) => Promise<PageResult<T>>,
  query: ListingQuery,
): Promise<PageResult<T>> {
  let response: PageResult<T>;
  try {
    response = await fetchPage(query);
  } catch (error) {
    throw new Error(
      `[sitemap] Falha ao consultar ${label}, página ${query.page}.`,
      { cause: error },
    );
  }

  if (
    !response ||
    !Array.isArray(response.items) ||
    !Number.isInteger(response.totalCount) ||
    response.totalCount < 0 ||
    response.page !== query.page
  ) {
    throw new Error(
      `[sitemap] Resposta inválida de ${label}, página ${query.page}.`,
    );
  }

  return response;
}

function slugsFrom<T extends { slug: string }>(
  label: string,
  items: T[],
  slugOf: (item: T) => string,
): string[] {
  const slugs = items.map((item) => {
    const slug = slugOf(item)?.trim() ?? "";
    if (!slug) {
      throw new Error(
        `[sitemap] ${label} devolveu um registro sem slug. Sitemap interrompido.`,
      );
    }
    return slug;
  });

  assertUniqueSlugs(label, slugs);
  return slugs;
}

function assertUniqueSlugs(label: string, slugs: string[]): void {
  const unique = new Set(slugs);
  if (unique.size !== slugs.length) {
    throw new Error(
      `[sitemap] ${label} contém slugs duplicados (${slugs.length} registros, ${unique.size} slugs).`,
    );
  }
}

function encodeSlug(slug: string): string {
  if (/[/?#\\\s]/.test(slug)) {
    throw new Error(`[sitemap] Slug público inválido: "${slug}".`);
  }
  return encodeURIComponent(slug);
}

function toAbsolute(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`[sitemap] Caminho inválido: ${path}`);
  }
  return `${SITEMAP_ORIGIN}${path}`;
}

function uniqueEntries(urls: string[]): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const url of urls) {
    assertIndexable(url);
    if (seen.has(url)) {
      throw new Error(`[sitemap] URL duplicada: ${url}`);
    }
    seen.add(url);
    entries.push({ url });
  }

  return entries;
}

function assertIndexable(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`[sitemap] URL inválida: ${url}`);
  }

  if (parsed.origin !== SITEMAP_ORIGIN || parsed.search || parsed.hash) {
    throw new Error(`[sitemap] URL fora do domínio canônico: ${url}`);
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return;

  const section = segments[0];
  if (!section || !ALLOWED_SECTIONS.has(section)) {
    throw new Error(`[sitemap] Seção não indexável: ${url}`);
  }

  const isDetailSection =
    section === "anuncios" || section === "lojas" || section === "categorias";
  const maxSegments = isDetailSection ? 2 : 1;
  if (segments.length > maxSegments) {
    throw new Error(`[sitemap] URL não permitida no sitemap: ${url}`);
  }
}
