import type { PublicVehicleBrandListItemDto } from "@/contracts/vehicle-brands/responses";
import type { VehicleBrand } from "@/types/VehicleBrand";

/**
 * Marcas vêm do CRUD administrativo (GET /api/v1/vehicle-brands).
 * Este mapper converte os DTOs da API para o modelo de UI.
 */
export function mapVehicleBrandItemToVehicleBrand(
  item: PublicVehicleBrandListItemDto,
): VehicleBrand {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    advertisementCount: item.advertisementCount,
  };
}

export function mapVehicleBrandItemsToVehicleBrands(
  items: PublicVehicleBrandListItemDto[],
): VehicleBrand[] {
  return items.map(mapVehicleBrandItemToVehicleBrand);
}

/** Resolve marca pelo slug público, dentro de uma lista já carregada. */
export function findVehicleBrandBySlug(
  brands: VehicleBrand[],
  slug: string,
): VehicleBrand | undefined {
  return brands.find((brand) => brand.slug === slug);
}
