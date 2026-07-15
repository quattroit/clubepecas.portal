import type {
  CreateSellerRequest,
  UpdateSellerRequest,
} from "@/contracts/seller/requests";
import type { SellerProfileFormValues } from "@/features/dashboard/schemas/sellerProfileFormSchema";
import type { Seller } from "@/types/Seller";

/**
 * Seller (UI) → valores do formulário de perfil.
 */
export function mapSellerToProfileFormValues(
  seller: Seller,
): SellerProfileFormValues {
  return {
    storeName: seller.name,
    displayName: seller.displayName ?? "",
    city: seller.city,
    state: seller.state,
    description: seller.description ?? "",
    whatsApp: seller.whatsApp ?? "",
    photoUrl: seller.avatarUrl ?? "",
  };
}

/**
 * Formulário → CreateSellerRequest.
 */
export function mapSellerProfileFormToCreateRequest(
  values: SellerProfileFormValues,
): CreateSellerRequest {
  return mapSellerProfileFormToRequest(values);
}

/**
 * Formulário → UpdateSellerRequest (mesmo contrato do create).
 */
export function mapSellerProfileFormToUpdateRequest(
  values: SellerProfileFormValues,
): UpdateSellerRequest {
  return mapSellerProfileFormToRequest(values);
}

function mapSellerProfileFormToRequest(
  values: SellerProfileFormValues,
): CreateSellerRequest {
  return {
    storeName: values.storeName.trim(),
    displayName: values.displayName.trim(),
    city: values.city.trim(),
    state: values.state.trim().toUpperCase(),
    description: emptyToNull(values.description),
    whatsApp: emptyToNull(values.whatsApp),
    photoUrl: emptyToNull(values.photoUrl),
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
