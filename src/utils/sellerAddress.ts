import type { Seller } from "@/types/Seller";
import { isValidPostalCode } from "@/utils/postalCode";

export function hasCompleteSellerAddress(
  seller: Seller | null | undefined,
): boolean {
  if (!seller) {
    return false;
  }

  return (
    isValidPostalCode(seller.zipCode ?? "") &&
    Boolean(seller.street?.trim()) &&
    Boolean(seller.number?.trim()) &&
    Boolean(seller.neighborhood?.trim())
  );
}
