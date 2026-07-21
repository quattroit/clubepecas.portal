/** Mantém apenas dígitos do CEP. */
export function normalizePostalCode(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formata CEP enquanto digita: 00000-000 */
export function formatPostalCodeInput(value: string): string {
  const digits = normalizePostalCode(value).slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidPostalCode(value: string): boolean {
  return normalizePostalCode(value).length === 8;
}
