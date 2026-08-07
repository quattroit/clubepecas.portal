/**
 * Texto público quando a loja oferece Frete Local.
 */
export function formatLocalDeliveryOfferLabel(
  maxRadiusKm?: number | null,
): string {
  if (typeof maxRadiusKm === "number" && maxRadiusKm > 0) {
    return `Oferece Frete Local (até ${maxRadiusKm} km)`;
  }

  return "Oferece Frete Local";
}
