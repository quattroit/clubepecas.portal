/**
 * Formata o endereço de uma loja/vendedor para exibição em cards e perfis.
 * Retorna null quando não há nem cidade nem rua.
 */
export function formatSellerAddress(parts: {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
}): string | null {
  const street = parts.street?.trim() ?? "";
  const number = parts.number?.trim() ?? "";
  const complement = parts.complement?.trim() ?? "";
  const neighborhood = parts.neighborhood?.trim() ?? "";
  const city = parts.city?.trim() ?? "";
  const state = parts.state?.trim() ?? "";

  const streetLine = [street, number].filter(Boolean).join(", ");
  const streetWithComplement = [streetLine, complement].filter(Boolean).join(" — ");

  const cityState =
    city && state ? `${city}/${state}` : city || state || "";

  const placeLine = [neighborhood, cityState].filter(Boolean).join(" — ");

  if (streetWithComplement && placeLine) {
    return `${streetWithComplement}, ${placeLine}`;
  }

  if (streetWithComplement) {
    return streetWithComplement;
  }

  if (placeLine) {
    return placeLine;
  }

  return null;
}

/**
 * Linha curta só com rua/número/bairro (sem cidade), para combinar com cidade/UF já exibidos.
 */
export function formatSellerStreetLine(parts: {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
}): string | null {
  const street = parts.street?.trim() ?? "";
  const number = parts.number?.trim() ?? "";
  const complement = parts.complement?.trim() ?? "";
  const neighborhood = parts.neighborhood?.trim() ?? "";

  const streetLine = [street, number].filter(Boolean).join(", ");
  const withComplement = [streetLine, complement].filter(Boolean).join(" — ");

  if (withComplement && neighborhood) {
    return `${withComplement} — ${neighborhood}`;
  }

  return withComplement || neighborhood || null;
}
