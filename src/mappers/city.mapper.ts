import type { PublicCityListItemDto } from "@/contracts/cities/responses";
import type { City } from "@/types/City";

/**
 * Cidades vêm do CRUD administrativo (GET /api/v1/cities).
 * Este mapper converte os DTOs da API para o modelo de UI.
 */
export function mapCityItemToCity(item: PublicCityListItemDto): City {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    state: item.state,
    sellerCount: item.sellerCount,
  };
}

export function mapCityItemsToCities(items: PublicCityListItemDto[]): City[] {
  return items.map(mapCityItemToCity);
}

/** Resolve cidade pelo slug público, dentro de uma lista já carregada. */
export function findCityBySlug(
  cities: City[],
  slug: string,
): City | undefined {
  return cities.find((city) => city.slug === slug);
}

/** Label de exibição: "Nome — UF". */
export function formatCityLabel(city: Pick<City, "name" | "state">): string {
  return `${city.name} — ${city.state}`;
}
