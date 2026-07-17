import type {
  CreateSellerRequest,
  UpdateSellerRequest,
} from "@/contracts/seller/requests";
import { PersonType } from "@/contracts/common/enums";
import type { SellerProfileFormValues } from "@/features/dashboard/schemas/sellerProfileFormSchema";
import type { Seller } from "@/types/Seller";
import { formatDocumentInput } from "@/utils/document";
import { formatInstagramHandle } from "@/utils/instagram";

/**
 * Seller (UI) → valores do formulário de perfil.
 */
export function mapSellerToProfileFormValues(
  seller: Seller,
): SellerProfileFormValues {
  const personType =
    seller.personType === PersonType.Company
      ? PersonType.Company
      : PersonType.Individual;

  return {
    storeName: seller.name,
    displayName: seller.displayName ?? "",
    cityId: seller.cityId ?? "",
    personType,
    document: seller.document
      ? formatDocumentInput(seller.document, personType)
      : "",
    description: seller.description ?? "",
    whatsApp: seller.whatsApp ?? "",
    instagram: seller.instagram
      ? formatInstagramHandle(seller.instagram)
      : "",
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
    cityId: values.cityId.trim(),
    personType: values.personType,
    document: values.document.trim(),
    description: emptyToNull(values.description),
    whatsApp: values.whatsApp.trim(),
    instagram: emptyToNull(values.instagram),
    photoUrl: emptyToNull(values.photoUrl),
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
