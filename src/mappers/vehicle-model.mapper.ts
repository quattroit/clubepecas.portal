import type { PublicVehicleModelListItemDto } from "@/contracts/vehicle-models/responses";
import type { VehicleModel } from "@/types/VehicleModel";

/**
 * Modelos vêm do CRUD administrativo (GET /api/v1/vehicle-models).
 * Este mapper converte os DTOs da API para o modelo de UI.
 */
export function mapVehicleModelItemToVehicleModel(
  item: PublicVehicleModelListItemDto,
): VehicleModel {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    vehicleBrandId: item.vehicleBrandId,
    vehicleBrandName: item.vehicleBrandName,
    vehicleBrandSlug: item.vehicleBrandSlug,
    advertisementCount: item.advertisementCount,
  };
}

export function mapVehicleModelItemsToVehicleModels(
  items: PublicVehicleModelListItemDto[],
): VehicleModel[] {
  return items.map(mapVehicleModelItemToVehicleModel);
}

/** Resolve modelo pelo slug público, dentro de uma lista já carregada. */
export function findVehicleModelBySlug(
  models: VehicleModel[],
  slug: string,
): VehicleModel | undefined {
  return models.find((model) => model.slug === slug);
}
