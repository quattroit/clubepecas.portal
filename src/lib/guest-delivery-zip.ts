const GUEST_DELIVERY_ZIP_KEY = "clubepecas.guestDeliveryZipCode";

/**
 * CEP de entrega do visitante (localStorage).
 */
export function loadGuestDeliveryZipCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(GUEST_DELIVERY_ZIP_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveGuestDeliveryZipCode(zipCode: string): void {
  if (typeof window === "undefined") return;
  const digits = zipCode.replace(/\D/g, "").slice(0, 8);
  try {
    if (digits.length === 8) {
      window.localStorage.setItem(GUEST_DELIVERY_ZIP_KEY, digits);
    }
  } catch {
    // ignore quota / private mode
  }
}
